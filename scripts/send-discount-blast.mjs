#!/usr/bin/env node
/**
 * send-discount-blast.mjs — Send 50% off discount emails to a CRM segment
 *
 * Uses WEBINAR50 coupon code with the existing bundle Stripe link.
 * Tags contacts with "discount_sent" to prevent duplicates.
 *
 * Usage:
 *   node scripts/send-discount-blast.mjs                          # Dry run (all hot_leads)
 *   node scripts/send-discount-blast.mjs --segment=hot_leads      # Dry run for segment
 *   node scripts/send-discount-blast.mjs --segment=hot_leads --send   # Actually send
 *   node scripts/send-discount-blast.mjs --to=email@test.com --send   # Single test
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// -- Load env --
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

const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const COUPON_CODE = 'WEBINAR50';

const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');
const segmentArg = args.find(a => a.startsWith('--segment='));
const SEGMENT = segmentArg ? segmentArg.split('=')[1] : 'hot_leads';
const toArg = args.find(a => a.startsWith('--to='));
const SINGLE_TO = toArg ? toArg.split('=')[1] : null;

// -- Segments --
const SEGMENTS = {
  hot_leads: (c) => ((c.tags || []).includes('email_clicked') || (c.tags || []).includes('form_lead')) && !(c.tags || []).includes('stripe_customer') && !(c.tags || []).includes('bounced'),
  clicked_not_bought: (c) => (c.tags || []).includes('email_clicked') && !(c.tags || []).includes('stripe_customer'),
  form_not_bought: (c) => (c.tags || []).includes('form_lead') && !(c.tags || []).includes('stripe_customer'),
  emailed_no_click: (c) => ((c.tags || []).includes('linkedin_emailed') || (c.tags || []).includes('email_sent') || (c.tags || []).includes('email_delivered')) && !(c.tags || []).includes('email_clicked'),
  all_non_buyers: (c) => !(c.tags || []).includes('stripe_customer') && !(c.tags || []).includes('bounced'),
};

// -- Email template --
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
          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Best,</td></tr>
          <tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Don & Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function p(text) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`; }

function buildDiscountEmail(firstName) {
  const name = firstName || 'there';
  return {
    subject: '50% off, just for you',
    html: emailWrapper(`
      ${p(`Hey ${name},`)}
      ${p('I saw you checked out our cold email webinar but haven\'t grabbed a ticket yet.')}
      ${p('I want to make this a complete no-brainer for you.')}
      ${p(`Use code <strong>${COUPON_CODE}</strong> at checkout to get <strong>50% off the full bundle</strong>.`)}
      ${p('That\'s the live webinar + the Cold Email Guide 2.0 for just <strong>&pound;11</strong>.')}
      <tr><td style="padding:0 0 8px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;">
          <a href="${BUNDLE_LINK}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">Get the Bundle for &pound;11 &rarr;</a>
        </td></tr></table>
      </td></tr>
      ${p(`<span style="color:#888;font-size:13px;">Use code <strong>${COUPON_CODE}</strong> at checkout.</span>`)}
      ${p('This offer expires 48 hours from now. After that, it goes back to full price.')}
    `),
  };
}

// -- Send via Broadcast API --
import { sendBroadcast } from './resend-broadcast.mjs';

async function tagContacts(contactList) {
  for (const c of contactList) {
    const newTags = [...new Set([...(c.tags || []), 'discount_sent', 'email_sent'])];
    await supabase.from('crm_contacts').update({
      tags: newTags,
      last_activity_at: new Date().toISOString(),
    }).eq('id', c.id);
  }
}

// -- Main --
async function main() {
  console.log('\n🎁 50% Off Discount Blast (Broadcast Mode)\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE\n' : '🟡 DRY RUN (use --send to go live)\n');

  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Failed to load contacts:', error.message); process.exit(1); }

  let recipients;
  if (SINGLE_TO) {
    recipients = contacts.filter(c => c.email.toLowerCase() === SINGLE_TO.toLowerCase());
    if (recipients.length === 0) { console.error(`Contact ${SINGLE_TO} not found in CRM.`); process.exit(1); }
  } else {
    const segFn = SEGMENTS[SEGMENT] || SEGMENTS.hot_leads;
    recipients = contacts.filter(c => {
      if ((c.tags || []).includes('discount_sent')) return false;
      return segFn(c);
    });
  }

  console.log(`Segment: ${SINGLE_TO ? `single: ${SINGLE_TO}` : SEGMENT}`);
  console.log(`Recipients: ${recipients.length}\n`);

  if (recipients.length === 0) {
    console.log('No recipients found (everyone already received the discount or no matches).');
    return;
  }

  for (const c of recipients.slice(0, 5)) {
    const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unknown';
    console.log(`  ${name} <${c.email}>`);
  }
  if (recipients.length > 5) console.log(`  ... and ${recipients.length - 5} more`);

  if (!LIVE_SEND) {
    console.log('\nTo send, add --send');
    return;
  }

  // Use broadcast personalization
  const html = buildDiscountEmail('{{{FIRST_NAME|there}}}').html;

  console.log('\nSending via Broadcast API...\n');
  const result = await sendBroadcast({
    name: '50% Discount Blast',
    from: FROM_EMAIL,
    subject: '50% off, just for you',
    html,
    contacts: recipients.map(c => ({ email: c.email, first_name: c.first_name || '', last_name: c.last_name || '' })),
    send: true,
  });

  console.log(`\nBroadcast sent to ${result.sent} contacts`);
  await tagContacts(recipients);
  console.log('CRM tags updated (discount_sent). No duplicates possible.');
}

main().catch(console.error);

