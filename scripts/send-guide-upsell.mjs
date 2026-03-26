#!/usr/bin/env node

/**
 * Guide Upsell Broadcast 
 * Targets all CRM contacts tagged `webinar_only` 
 * and pitches the new Guide 2.0.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
      if (match) process.env[match[1]] = process.env[match[1]] || match[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnv();

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'dylan@yourearlyedge.co.uk';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!RESEND_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing API keys');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');
const TEST_EMAIL = args.find(a => a.startsWith('--test='))?.split('=')[1];

const STRIPE_CHECKOUT_LINK = 'https://buy.stripe.com/3cI14m1Uw11n4mC4WE2400c'; 

function emailWrapper(bodyHtml) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;font-family:-apple-system,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;text-align:left;">
          ${bodyHtml}
          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Best,</td></tr>
          <tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Don & Dylan</td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function p(text) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`; }

const UPSELL_EMAIL = {
  subject: 'the exact templates for Saturday',
  html: emailWrapper(`
    ${p('Hey,')}
    ${p('Since you grabbed a ticket to Saturday\'s live webinar, I wanted to reach out.')}
    ${p('A lot of students asked if we could just give them the exact email templates, Apollo filters, and tracking sheets that Uthman uses.')}
    ${p('So we put together <strong>The Cold Email Guide 2.0</strong>.')}
    ${p('It has the exact copy-paste templates, the proven "9:03 AM Rule", and the step-by-step Mail Merge setup so you don\'t trigger spam filters.')}
    ${p('Since you already bought the webinar ticket, you can grab the guide here to complete the bundle before we go live:')}
    <tr><td style="padding:0 0 24px 0;">
      <a href="${STRIPE_CHECKOUT_LINK}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Get the Guide for &pound;12 &rarr;</a>
    </td></tr>
    ${p('Have a read before Saturday so you can follow along perfectly.')}
  `)
};

async function sendEmail(toEmail) {
  const headers = { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" };

  // 1. Create a temporary audience
  const audRes = await fetch("https://api.resend.com/audiences", {
    method: "POST", headers,
    body: JSON.stringify({ name: `upsell_${Date.now()}_${toEmail.split("@")[0]}` }),
  });
  const aud = await audRes.json();
  if (!aud.id) throw new Error(`Audience create failed: ${JSON.stringify(aud)}`);

  // 2. Add the single contact
  await fetch(`https://api.resend.com/audiences/${aud.id}/contacts`, {
    method: "POST", headers,
    body: JSON.stringify({ email: toEmail, unsubscribed: false }),
  });

  // 3. Create broadcast
  const brRes = await fetch("https://api.resend.com/broadcasts", {
    method: "POST", headers,
    body: JSON.stringify({ audience_id: aud.id, from: FROM_EMAIL, subject: UPSELL_EMAIL.subject, html: UPSELL_EMAIL.html, name: `upsell_${Date.now()}` }),
  });
  const br = await brRes.json();
  if (!br.id) throw new Error(`Broadcast create failed: ${JSON.stringify(br)}`);

  // 4. Send broadcast
  const sendRes = await fetch(`https://api.resend.com/broadcasts/${br.id}/send`, {
    method: "POST", headers, body: "{}"
  });
  if (!sendRes.ok) throw new Error(`Broadcast send failed: ${await sendRes.text()}`);

  // 5. Clean up audience
  await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: "DELETE", headers });
}

async function main() {
  if (TEST_EMAIL) {
    console.log(`\n🧪 Sending test email to ${TEST_EMAIL}...`);
    try {
      await sendEmail(TEST_EMAIL);
      console.log('✅ Test sent successfully! Check your inbox.');
    } catch (err) {
      console.error('❌ Test failed:', err.message);
    }
    return;
  }
  console.log('\n🚀 Guide 2.0 Upsell Sender\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE\n' : '🟡 DRY RUN (--send to go live)\n');

  // Load all webinar_only contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('id, email, tags')
    .contains('tags', ['webinar_only']);

  if (error) { console.error('❌ DB Error:', error); return; }

  const toSend = contacts.filter(c => !(c.tags || []).includes('guide_upsell_sent'));

  console.log(`Found ${toSend.length} webinar_only buyers who need the upsell.\n`);

  if (!LIVE_SEND) {
    toSend.slice(0, 10).forEach(c => console.log(`   - ${c.email}`));
    if (toSend.length > 10) console.log(`   ...and ${toSend.length - 10} more`);
    console.log('\nRun: node scripts/send-guide-upsell.mjs --send');
    return;
  }

  for (const c of toSend) {
    try {
      await sendEmail(c.email);
      const newTags = [...(c.tags || []), 'guide_upsell_sent'];
      await supabase.from('crm_contacts').update({ tags: newTags }).eq('id', c.id);
      console.log(`✅ Sent to ${c.email}`);
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.log(`❌ Failed ${c.email}: ${err.message}`);
    }
  }
}
main();
