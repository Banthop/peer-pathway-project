#!/usr/bin/env node
/**
 * auto-emailer.mjs — Continuous automation loop that checks for new contacts
 * and sends appropriate emails automatically.
 *
 * Rules:
 *   1. New Stripe customer → Instantly send confirmation email
 *   2. New form lead (30+ min old, no purchase) → Send 50% discount
 *   3. Webinar-only buyer (no guide upsell sent) → Send guide upsell
 *   4. CRM sync → Re-sync Stripe data every 5 min
 *
 * Usage:
 *   node scripts/auto-emailer.mjs           # Run continuously (checks every 2 min)
 *   node scripts/auto-emailer.mjs --once    # Run once and exit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { sendBroadcast } from './resend-broadcast.mjs';

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
const FROM_EMAIL = process.env.FROM_EMAIL || 'Dylan <dylan@yourearlyedge.co.uk>';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!RESEND_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const args = process.argv.slice(2);
const RUN_ONCE = args.includes('--once');
const CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes
const FORM_DELAY_MS = 30 * 60 * 1000; // 30 minutes

// ── Links ──
const ZOOM_LINK = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';
const WEBINAR_DATE = 'Saturday 28th March';
const WEBINAR_TIME = '7pm GMT';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';
const UPSELL_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const COUPON_CODE = 'WEBINAR50';

// ── Email HTML helpers ──
function p(text) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`; }
function cta(text, url) {
  return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${url}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${text}</a></td></tr></table></td></tr>`;
}
function wrap(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">See you there</td></tr><tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Don & Dylan</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr></table></td></tr></table></body></html>`;
}

// ── Templates (use {{{FIRST_NAME|there}}} for broadcast personalization) ──
const TEMPLATES = {
  bundle_confirmation: {
    subject: "you're in - here's everything you need",
    html: wrap(`
      ${p("Hey {{{FIRST_NAME|there}}},")}\
      ${p("You're in. Good decision - you went for the full bundle so you're getting everything.")}\
      ${p(`On ${WEBINAR_DATE} @${WEBINAR_TIME}, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email.`)}\
      <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom</a><br>&#8226; <strong>Date:</strong> ${WEBINAR_DATE}<br>&#8226; <strong>Time:</strong> ${WEBINAR_TIME}<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>\
      ${p("We'll send you a reminder before we start.")}\
      ${cta('Download your Cold Email Guide', GUIDE_LINK)}\
      ${p(`Also here's the checklist: <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Download Checklist</a>`)}\
      ${p("Can't make it live? You'll get the recording within 24 hours.")}
    `),
  },
  webinar_confirmation: {
    subject: "you're in - here's your zoom link",
    html: wrap(`
      ${p("Hey {{{FIRST_NAME|there}}},")}\
      ${p("You're in. Good decision.")}\
      ${p(`On ${WEBINAR_DATE} @${WEBINAR_TIME}, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email.`)}\
      <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom</a><br>&#8226; <strong>Date:</strong> ${WEBINAR_DATE}<br>&#8226; <strong>Time:</strong> ${WEBINAR_TIME}<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>\
      ${p(`Here's the cold email checklist: <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Download the Checklist</a>`)}\
      ${p("Can't make it live? You'll get the recording within 24 hours.")}\
      <tr><td style="border-top:1px solid #eee;padding:24px 0 0 0;"></td></tr>\
      ${p("<strong>Want the full cold email system?</strong>")}\
      ${cta('Upgrade to the Full Bundle', UPSELL_LINK)}
    `),
  },
  discount_50: {
    subject: "50% off, just for you",
    html: wrap(`
      ${p("Hey {{{FIRST_NAME|there}}},")}\
      ${p("I saw you checked out our cold email webinar but haven't grabbed a ticket yet.")}\
      ${p(`Use code <strong>${COUPON_CODE}</strong> at checkout to get <strong>50% off the full bundle</strong>.`)}\
      ${p("That's the live webinar + the Cold Email Guide 2.0 for just <strong>&pound;11</strong>.")}\
      ${cta('Get the Bundle for £11 →', BUNDLE_LINK)}\
      ${p(`<span style="color:#888;font-size:13px;">Use code <strong>${COUPON_CODE}</strong> at checkout.</span>`)}\
      ${p("This offer expires 48 hours from now.")}
    `),
  },
};

// ── Helper: tag contacts ──
async function tagContacts(contacts, ...extraTags) {
  for (const c of contacts) {
    const newTags = [...new Set([...(c.tags || []), ...extraTags])];
    await supabase.from('crm_contacts').update({
      tags: newTags,
      last_activity_at: new Date().toISOString(),
    }).eq('id', c.id);
  }
}

// ── Helper: sync Stripe to CRM ──
async function syncStripe() {
  if (!STRIPE_KEY) return;
  const cutoff = Math.floor(new Date('2026-03-16T00:00:00Z').getTime() / 1000);
  const res = await fetch(`https://api.stripe.com/v1/charges?limit=100&created[gte]=${cutoff}`, {
    headers: { Authorization: `Bearer ${STRIPE_KEY}` },
  });
  if (!res.ok) return;
  const data = await res.json();
  const charges = data.data.filter(ch => ch.status === 'succeeded' && ch.amount > 0);

  for (const charge of charges) {
    const email = (charge.billing_details?.email || charge.receipt_email || '').toLowerCase().trim();
    if (!email) continue;
    const name = charge.billing_details?.name || '';
    const [first, ...rest] = name.split(' ');
    const amount = charge.amount;

    // Check if already in CRM
    const { data: existing } = await supabase.from('crm_contacts').select('id,tags').eq('email', email).single();
    if (existing) {
      const tags = existing.tags || [];
      if (!tags.includes('stripe_customer')) {
        const newTags = [...new Set([...tags, 'stripe_customer', amount >= 2200 ? 'bundle' : 'webinar_only'])];
        await supabase.from('crm_contacts').update({ tags: newTags, status: 'converted' }).eq('id', existing.id);
      }
    } else {
      await supabase.from('crm_contacts').upsert({
        email,
        first_name: first || '',
        last_name: rest.join(' ') || '',
        source: 'other',
        status: 'converted',
        tags: ['stripe_customer', amount >= 2200 ? 'bundle' : 'webinar_only'],
        metadata: { stripe_spend: amount / 100 },
      }, { onConflict: 'email' });
    }
  }
  return charges.length;
}

// ── Main loop ──
async function runCycle() {
  const now = new Date();
  console.log(`\n🔄 [${now.toLocaleTimeString('en-GB')}] Running automation cycle...`);

  // 1. Sync Stripe
  try {
    const count = await syncStripe();
    if (count > 0) console.log(`   📦 Synced ${count} Stripe charges`);
  } catch (err) {
    console.error('   ⚠️ Stripe sync error:', err.message);
  }

  // Load all contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('   DB Error:', error.message); return; }

  // 2. Confirmation emails for new buyers
  const needConfirmation = contacts.filter(c => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer') && !tags.includes('confirmation_sent');
  });

  if (needConfirmation.length > 0) {
    const bundleBuyers = needConfirmation.filter(c => (c.tags || []).includes('bundle') || (c.metadata?.stripe_spend || 0) >= 25);
    const webinarBuyers = needConfirmation.filter(c => !bundleBuyers.includes(c));

    if (bundleBuyers.length > 0) {
      console.log(`   📧 Sending ${bundleBuyers.length} BUNDLE confirmations...`);
      try {
        await sendBroadcast({
          name: 'Auto Bundle Confirm',
          from: FROM_EMAIL,
          subject: TEMPLATES.bundle_confirmation.subject,
          html: TEMPLATES.bundle_confirmation.html,
          contacts: bundleBuyers.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
          send: true,
        });
        await tagContacts(bundleBuyers, 'confirmation_sent', 'bundle');
        console.log(`   ✅ ${bundleBuyers.length} bundle confirmations sent`);
      } catch (err) { console.error(`   ❌ Bundle confirm error: ${err.message}`); }
    }

    if (webinarBuyers.length > 0) {
      console.log(`   📧 Sending ${webinarBuyers.length} WEBINAR confirmations...`);
      try {
        await sendBroadcast({
          name: 'Auto Webinar Confirm',
          from: FROM_EMAIL,
          subject: TEMPLATES.webinar_confirmation.subject,
          html: TEMPLATES.webinar_confirmation.html,
          contacts: webinarBuyers.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
          send: true,
        });
        await tagContacts(webinarBuyers, 'confirmation_sent', 'webinar_only');
        console.log(`   ✅ ${webinarBuyers.length} webinar confirmations sent`);
      } catch (err) { console.error(`   ❌ Webinar confirm error: ${err.message}`); }
    }
  }

  // 3. Discount emails for form leads (30+ min old, never bought)
  const formLeadsForDiscount = contacts.filter(c => {
    const tags = c.tags || [];
    if (!tags.includes('form_lead')) return false;
    if (tags.includes('stripe_customer')) return false;
    if (tags.includes('discount_sent')) return false;
    // Check if form was filled 30+ minutes ago
    const created = new Date(c.created_at).getTime();
    return (Date.now() - created) >= FORM_DELAY_MS;
  });

  if (formLeadsForDiscount.length > 0) {
    console.log(`   🎁 Sending ${formLeadsForDiscount.length} discount emails (form leads, 30+ min old)...`);
    try {
      await sendBroadcast({
        name: 'Auto Discount Form Leads',
        from: FROM_EMAIL,
        subject: TEMPLATES.discount_50.subject,
        html: TEMPLATES.discount_50.html,
        contacts: formLeadsForDiscount.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
        send: true,
      });
      await tagContacts(formLeadsForDiscount, 'discount_sent', 'email_sent');
      console.log(`   ✅ ${formLeadsForDiscount.length} discount emails sent`);
    } catch (err) { console.error(`   ❌ Discount error: ${err.message}`); }
  }

  // 4. Guide upsell for webinar-only buyers (not yet sent)
  const needGuideUpsell = contacts.filter(c => {
    const tags = c.tags || [];
    return (tags.includes('webinar_only') || tags.includes('webinar_only_buyer'))
      && tags.includes('stripe_customer')
      && !tags.includes('guide_upsell_sent');
  });

  if (needGuideUpsell.length > 0) {
    console.log(`   📘 ${needGuideUpsell.length} webinar-only buyers need guide upsell (handled by send-guide-upsell.mjs)`);
  }

  // Summary
  const totalActions = needConfirmation.length + formLeadsForDiscount.length;
  if (totalActions === 0) {
    console.log('   ✅ All caught up - no emails due');
  }

  // Stats
  const customers = contacts.filter(c => (c.tags || []).includes('stripe_customer')).length;
  const confirmed = contacts.filter(c => (c.tags || []).includes('confirmation_sent')).length;
  const discounted = contacts.filter(c => (c.tags || []).includes('discount_sent')).length;
  const formLeads = contacts.filter(c => (c.tags || []).includes('form_lead') && !(c.tags || []).includes('stripe_customer')).length;
  console.log(`\n   📊 Customers: ${customers} | Confirmed: ${confirmed} | Discounted: ${discounted} | Pending forms: ${formLeads}`);
}

// ── Run ──
console.log('🤖 EarlyEdge Auto-Emailer');
console.log(`   Mode: ${RUN_ONCE ? 'Single run' : `Continuous (every ${CHECK_INTERVAL / 1000}s)`}`);

await runCycle();

if (!RUN_ONCE) {
  console.log(`\n⏰ Next check in ${CHECK_INTERVAL / 1000} seconds... (Ctrl+C to stop)`);
  setInterval(async () => {
    try {
      await runCycle();
      console.log(`\n⏰ Next check in ${CHECK_INTERVAL / 1000} seconds...`);
    } catch (err) {
      console.error('Cycle error:', err.message);
    }
  }, CHECK_INTERVAL);
}
