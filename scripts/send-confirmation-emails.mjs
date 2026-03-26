#!/usr/bin/env node
/**
 * Send confirmation emails to customers who purchased.
 * Segments into two groups:
 *   - Bundle buyers: get Zoom link + guide + checklist + recording note
 *   - Webinar-only buyers: get Zoom link + checklist (free) + upsell to guide
 *
 * Usage:
 *   node scripts/send-confirmation-emails.mjs              # Dry run
 *   node scripts/send-confirmation-emails.mjs --send       # Actually send
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load env ──
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

if (!RESEND_KEY) { console.error('Missing RESEND_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing Supabase config'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');

// ═══════════════════════════════════════════════════════════════
// LINKS - UPDATE THESE BEFORE SENDING
// ═══════════════════════════════════════════════════════════════

const ZOOM_LINK = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';
const WEBINAR_TIME = '7pm GMT';
const WEBINAR_DATE = 'Saturday 28th March';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';
const UPSELL_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';  // points to bundle purchase

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

function emailWrapper(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><style>body,table,td{font-family:Arial,sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
          ${bodyHtml}
          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">See you there</td></tr>
          <tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Don & Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function p(text) {
  return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`;
}

function ctaButton(text, url) {
  return `<tr>
  <td style="padding:0 0 24px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color:#111111;border-radius:8px;">
          <a href="${url}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${text}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// ── Bundle Confirmation Email ──
function bundleEmail(firstName) {
  const name = firstName || 'there';
  return {
    subject: "you're in - here's everything you need",
    html: emailWrapper(`
      ${p(`Hey ${name},`)}
      ${p("You're in. Good decision - you went for the full bundle so you're getting everything.")}
      ${p(`On ${WEBINAR_DATE} @${WEBINAR_TIME}, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email. The full strategy, the exact templates, the follow-up sequences, the mistakes etc.`)}
      ${p("He's spilling all the beans.")}
      ${p("Here's what you need to know:")}
      <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
        &#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom Meeting</a><br>
        &#8226; <strong>Date:</strong> ${WEBINAR_DATE}<br>
        &#8226; <strong>Time:</strong> ${WEBINAR_TIME}<br>
        &#8226; <strong>Duration:</strong> ~90 mins + live Q&A
      </td></tr>
      <tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>
      ${p("We'll also send you a reminder before we start so you don't miss it.")}
      ${p("Now - your guide. This is the exact cold email system Uthman used to land his offers, remastered and expanded with everything we've learned since. Templates, targeting strategy, follow-up sequences, the lot. Here it is:")}
      ${ctaButton('Download your Cold Email Guide', GUIDE_LINK)}
      ${p("Seriously, read through it before Saturday. You'll get 10x more out of the webinar if you come having already seen the framework.")}
      ${p(`Also here's the cold email checklist as a quick reference: <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Download Checklist</a>`)}
      ${p("Can't make it live?")}
      ${p("Don't stress, you'll get the full recording sent to this email within 24 hours.")}
    `),
  };
}

// ── Webinar-Only Confirmation Email ──
function webinarOnlyEmail(firstName) {
  const name = firstName || 'there';
  return {
    subject: "you're in - here's your zoom link",
    html: emailWrapper(`
      ${p(`Hey ${name},`)}
      ${p("You're in. Good decision.")}
      ${p(`On ${WEBINAR_DATE} @${WEBINAR_TIME}, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email. The full strategy, the exact templates, the follow-up sequences, the mistakes etc.`)}
      ${p("He's spilling all the beans.")}
      ${p("Here's what you need to know:")}
      <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
        &#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom Meeting</a><br>
        &#8226; <strong>Date:</strong> ${WEBINAR_DATE}<br>
        &#8226; <strong>Time:</strong> ${WEBINAR_TIME}<br>
        &#8226; <strong>Duration:</strong> ~90 mins + live Q&A
      </td></tr>
      <tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>
      ${p("We'll also send you a reminder before we start so you don't miss it.")}
      ${p(`Oh and here's the cold email checklist to get you started before the webinar: <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Download the Checklist</a>. Have a look through it so you can come with questions on Saturday.`)}
      ${p("Can't make it live?")}
      ${p("Don't stress, you'll get the full recording sent to this email within 24 hours.")}
      <tr><td style="border-top:1px solid #eee;padding:24px 0 0 0;margin-top:20px;"></td></tr>
      ${p("<strong>Want the full cold email system?</strong>")}
      ${p("The webinar covers the strategy, but the Cold Email Guide gives you the complete playbook - every template, every follow-up sequence, every tool Uthman used. It's what separates people who watch from people who actually land offers.")}
      ${ctaButton('Upgrade to the Full Bundle', UPSELL_LINK)}
    `),
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN - Uses Broadcast API (Marketing Pro - unlimited sends)
// ═══════════════════════════════════════════════════════════════

import { sendBroadcast } from './resend-broadcast.mjs';

async function tagContacts(contactList, extraTag) {
  for (const c of contactList) {
    const newTags = [...new Set([...(c.tags || []), 'confirmation_sent', extraTag])];
    await supabase.from('crm_contacts').update({
      tags: newTags,
      last_activity_at: new Date().toISOString(),
    }).eq('id', c.id);
  }
}

async function main() {
  console.log('\n📧 Customer Confirmation Email Sender (Broadcast Mode)\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE - broadcasts WILL be sent\n' : '🟡 DRY RUN - no emails will be sent (use --send to go live)\n');

  // Load all converted contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('status', 'converted')
    .order('created_at', { ascending: false });

  if (error) { console.error('Failed to load contacts:', error.message); process.exit(1); }

  console.log(`📋 Found ${contacts.length} converted customers\n`);

  // Segment: bundle vs webinar-only
  const bundleBuyers = [];
  const webinarOnlyBuyers = [];

  for (const c of contacts) {
    const tags = c.tags || [];
    if (tags.includes('confirmation_sent')) continue;

    if (tags.includes('bundle') || c.metadata?.product_type === 'bundle') {
      bundleBuyers.push(c);
    } else if (tags.includes('webinar_only') || c.metadata?.product_type === 'webinar_only') {
      webinarOnlyBuyers.push(c);
    } else {
      const spend = c.metadata?.stripe_spend || 0;
      if (spend >= 25) bundleBuyers.push(c);
      else webinarOnlyBuyers.push(c);
    }
  }

  console.log(`📦 Bundle buyers to email: ${bundleBuyers.length}`);
  console.log(`🎥 Webinar-only buyers to email: ${webinarOnlyBuyers.length}\n`);

  if (bundleBuyers.length > 0) {
    console.log('── Bundle Buyers ──');
    for (const c of bundleBuyers) console.log(`   ${(c.first_name + ' ' + c.last_name).trim() || 'Unknown'} <${c.email}>`);
    console.log('');
  }

  if (webinarOnlyBuyers.length > 0) {
    console.log('── Webinar-Only Buyers ──');
    for (const c of webinarOnlyBuyers) console.log(`   ${(c.first_name + ' ' + c.last_name).trim() || 'Unknown'} <${c.email}>`);
    console.log('');
  }

  if (!LIVE_SEND) {
    console.log('💡 Run with --send to actually send these emails.');
    console.log('⚠️  Make sure you update the ZOOM_LINK at the top of this file first!\n');
    return;
  }

  if (ZOOM_LINK.includes('XXXXXXXXXX')) {
    console.error('❌ You need to update the ZOOM_LINK at the top of this file before sending!');
    process.exit(1);
  }

  // Build generic templates using Resend broadcast personalization
  const bundleHtml = bundleEmail('{{{FIRST_NAME|there}}}').html;
  const webinarHtml = webinarOnlyEmail('{{{FIRST_NAME|there}}}').html;

  // Send bundle confirmations via broadcast
  if (bundleBuyers.length > 0) {
    console.log('\n📦 Sending BUNDLE confirmations via Broadcast...');
    const result = await sendBroadcast({
      name: 'Bundle Confirmation',
      from: FROM_EMAIL,
      subject: "you're in - here's everything you need",
      html: bundleHtml,
      contacts: bundleBuyers.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
      send: true,
    });
    console.log(`   Broadcast sent to ${result.sent} bundle buyers`);
    await tagContacts(bundleBuyers, 'bundle');
    console.log(`   Tagged ${bundleBuyers.length} contacts as confirmation_sent`);
  }

  // Send webinar-only confirmations via broadcast
  if (webinarOnlyBuyers.length > 0) {
    console.log('\n🎥 Sending WEBINAR-ONLY confirmations via Broadcast...');
    const result = await sendBroadcast({
      name: 'Webinar Confirmation',
      from: FROM_EMAIL,
      subject: "you're in - here's your zoom link",
      html: webinarHtml,
      contacts: webinarOnlyBuyers.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
      send: true,
    });
    console.log(`   Broadcast sent to ${result.sent} webinar-only buyers`);
    await tagContacts(webinarOnlyBuyers, 'webinar_only');
    console.log(`   Tagged ${webinarOnlyBuyers.length} contacts as confirmation_sent`);
  }

  console.log(`\n✅ Done! Sent confirmations to ${bundleBuyers.length + webinarOnlyBuyers.length} customers via Broadcast API.\n`);
}

main();

