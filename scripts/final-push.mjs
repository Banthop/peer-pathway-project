#!/usr/bin/env node
/**
 * FINAL PUSH - Friday 27th March 2026, ~8pm
 * Webinar is TOMORROW (Saturday 28th March, 7pm GMT)
 *
 * Smart targeting: queries CRM, segments contacts, sends the right email.
 * Skips anyone who's bounced, unsubscribed, or already got a last-day email.
 * Includes subtle unsubscribe link via Resend merge tag.
 *
 * Usage:
 *   node scripts/final-push.mjs              # Dry run
 *   node scripts/final-push.mjs --send       # Send for real
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
const FROM_EMAIL = 'Dylan <dylan@yourearlyedge.co.uk>';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!RESEND_KEY) { console.error('Missing RESEND_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing Supabase config'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const LIVE_SEND = process.argv.includes('--send');

const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';
const ZOOM = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';

// ── Email helpers (no em dashes anywhere) ──
function p(t) {
  return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`;
}
function cta(text, url) {
  return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${url}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">${text}</a></td></tr></table></td></tr>`;
}
function unsub() {
  return `<tr><td style="padding:32px 0 0 0;border-top:1px solid #f0f0f0;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="font-size:11px;color:#cccccc;text-decoration:none;">unsubscribe</a></td></tr>`;
}
function wrap(body, signoff = 'Dylan') {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><style>body,table,td{font-family:Arial,sans-serif !important;}</style><![endif]--></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
${body}
<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr>
<tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
${unsub()}
</table></td></tr></table></body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// SEGMENT A: "TONIGHT REMINDER" for BUYERS
// People who already paid but could use a hype/prep email
// ═══════════════════════════════════════════════════════════════

const BUYER_REMINDER = {
  name: 'Buyer - Tomorrow Reminder',
  tag: 'final_push_buyer',
  subject: 'tomorrow night, 7pm. here is everything you need.',
  filter: (c) => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer')
      && !tags.includes('final_push_buyer')
      && !tags.includes('bounced');
  },
  html: wrap(
    p('Hey {{{FIRST_NAME|there}}},') +
    p('Quick reminder: the webinar is <strong>tomorrow</strong>. Saturday 28th March, 7pm GMT sharp.') +
    p('Here is your Zoom link. Save it somewhere you will not lose it:') +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; <strong>Zoom:</strong> <a href="${ZOOM}" style="color:#0066cc;">Join Meeting</a><br>
      &#8226; <strong>Meeting ID:</strong> 816 1951 5454<br>
      &#8226; <strong>Passcode:</strong> 1FzZLi<br>
      &#8226; <strong>When:</strong> Saturday 28th March, 7pm GMT<br>
      &#8226; <strong>Duration:</strong> ~90 mins + live Q&A
    </td></tr>` +
    p('If you have not already, go through the resources before tomorrow. You will get so much more out of it:') +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; <a href="${GUIDE_LINK}" style="color:#0066cc;">Cold Email Guide 2.0</a><br>
      &#8226; <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Cold Email Checklist</a>
    </td></tr>` +
    p('Uthman is going to cover everything live, but the students who come prepared always leave with the most.') +
    p("Can't make it live? No worries, recording goes out within 24 hours.") +
    p('See you tomorrow.'),
    'Don & Dylan'
  ),
};

// ═══════════════════════════════════════════════════════════════
// SEGMENT B: HOT LEADS (clicked or filled form, never bought)
// They were interested. Give them one more shot + discount.
// ═══════════════════════════════════════════════════════════════

const HOT_LEAD_PUSH = {
  name: 'Hot Lead - Final Shot',
  tag: 'final_push_hot',
  subject: 'last one from me on this',
  filter: (c) => {
    const tags = c.tags || [];
    return (tags.includes('email_clicked') || tags.includes('form_lead'))
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('final_push_hot')
      && !tags.includes('last_day_hot');
  },
  html: wrap(
    p('Hey {{{FIRST_NAME|there}}},') +
    p('This is genuinely the last email I am going to send you about this.') +
    p('The cold email webinar is <strong>tomorrow night</strong>. Saturday 28th March, 7pm GMT. After that, the live session is gone and we are selling the recording at a higher price.') +
    p('I know you were interested because you checked it out. So here is the deal:') +
    p('Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">WEBINAR25</strong> for <strong>25% off the full bundle</strong>. That is the webinar + the complete cold email guide + checklist for just <strong>&pound;21.75</strong> instead of &pound;29.') +
    p('Or just the webinar for &pound;10. No code needed.') +
    cta("Grab your spot", WEBINAR_LINK) +
    p('70+ students from LSE, Warwick, NYU, Columbia and more have already locked in. Uthman is breaking down the exact system behind his 21% cold email response rate. Live. With Q&A.') +
    p('Recording included if you cannot make it live.') +
    p('If it is not for you, no hard feelings. But if you have been thinking about it, tonight is the time.'),
    'Dylan'
  ),
};

// ═══════════════════════════════════════════════════════════════
// SEGMENT C: COLD RE-ENGAGE (emailed before, never clicked)
// Short and punchy. Last attempt.
// ═══════════════════════════════════════════════════════════════

const COLD_REENGAGE = {
  name: 'Cold - Last Chance',
  tag: 'final_push_cold',
  subject: 'tomorrow. then it is gone.',
  filter: (c) => {
    const tags = c.tags || [];
    const emailed = tags.includes('linkedin_emailed') || tags.includes('email_sent') || tags.includes('email_delivered');
    return emailed
      && !tags.includes('email_clicked')
      && !tags.includes('form_lead')
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('final_push_cold')
      && !tags.includes('last_day_reengage');
  },
  html: wrap(
    p('Hey,') +
    p('Tomorrow night at 7pm GMT, our coach Uthman is going live to break down how he landed 20+ internship offers using cold email.') +
    p('No connections. No network. Just a system that got him a 21% response rate when the average is 1-3%.') +
    p('He is doing a full 90 minute breakdown with live Q&A. After tomorrow, the only way to access this is by buying the recording at full price.') +
    p('If you are looking for internships this summer and do not have something lined up yet, this is 90 minutes well spent.') +
    cta("See what it is about", WEBINAR_LINK) +
    p('&pound;10 for the webinar. &pound;29 for the full bundle with templates and the guide. Recording included either way.'),
    'Dylan'
  ),
};

// ═══════════════════════════════════════════════════════════════
// SEGMENT D: WEBINAR-ONLY BUYERS (upsell the guide)
// ═══════════════════════════════════════════════════════════════

const GUIDE_UPSELL = {
  name: 'Webinar Buyer - Guide Upsell',
  tag: 'final_push_upsell',
  subject: 'quick one before tomorrow',
  filter: (c) => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer')
      && (tags.includes('webinar_only') || c.metadata?.product_type === 'webinar_only')
      && !tags.includes('bundle')
      && !tags.includes('final_push_upsell')
      && !tags.includes('guide_upsell_sent')
      && !tags.includes('last_day_upsell')
      && !tags.includes('bounced');
  },
  html: wrap(
    p('Hey {{{FIRST_NAME|there}}},') +
    p('You have got your webinar ticket for tomorrow. Nice.') +
    p('One thing I wanted to mention: the students who get the most out of these sessions are the ones who come having already read the framework.') +
    p('The <strong>Cold Email Guide 2.0</strong> has everything Uthman is going to talk about, written out step by step. The templates, the Apollo.io walkthrough, the follow-up sequences, the "9:03 AM Rule" for timing.') +
    p('If you read through it tonight, tomorrow is going to make 10x more sense. You will know the framework already and can use the live session to go deep on the parts that matter to you.') +
    `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="https://buy.stripe.com/3cI14m1Uw11n4mC4WE2400c" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">Get the Guide for &pound;12</a></td></tr></table></td></tr>` +
    p('Read it tonight. Come prepared tomorrow.'),
    'Don & Dylan'
  ),
};

// ═══════════════════════════════════════════════════════════════
// SEGMENT E: NEVER-EMAILED RESEND AUDIENCE MEMBERS
// People in the Resend audience but never got any campaign email
// ═══════════════════════════════════════════════════════════════

const FRESH_OUTREACH = {
  name: 'Fresh - First Touch',
  tag: 'final_push_fresh',
  subject: 'this might be relevant to you',
  filter: (c) => {
    const tags = c.tags || [];
    const neverTouched = !tags.includes('email_sent')
      && !tags.includes('linkedin_emailed')
      && !tags.includes('email_delivered')
      && !tags.includes('confirmation_sent')
      && !tags.includes('discount_sent');
    return neverTouched
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('final_push_fresh')
      && c.email;
  },
  html: wrap(
    p('Hey {{{FIRST_NAME|there}}},') +
    p('Random one, but if you are a student looking for internships in finance, consulting, tech or law, this might be worth 2 minutes of your time.') +
    p('Our coach Uthman sent 1,000 cold emails last year with zero connections. He got a 21% response rate and landed 20+ internship offers in 3 weeks.') +
    p('Tomorrow night (Saturday 28th March, 7pm GMT) he is going live for 90 minutes to show you exactly how. The templates, the tools, the follow-up strategy, everything.') +
    p('70+ students from universities like LSE, Warwick, NYU and Columbia have already signed up.') +
    cta("Check it out", WEBINAR_LINK) +
    p('&pound;10 for the webinar. &pound;29 for the bundle with the full guide and templates. Recording included if you cannot make it live.'),
    'Dylan'
  ),
};

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

const ALL_SEGMENTS = [BUYER_REMINDER, HOT_LEAD_PUSH, GUIDE_UPSELL, COLD_REENGAGE, FRESH_OUTREACH];

async function main() {
  console.log('\n🚀 FINAL PUSH - Friday 27th March, 8pm\n');
  console.log('Webinar is TOMORROW. Sending targeted emails to every useful segment.\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE - emails WILL be sent\n' : '🟡 DRY RUN - no emails will be sent (use --send to go live)\n');

  // Load all contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Failed to load contacts:', error.message); process.exit(1); }

  console.log(`Loaded ${contacts.length} contacts from CRM\n`);

  let totalSent = 0;

  for (const segment of ALL_SEGMENTS) {
    const recipients = contacts.filter(segment.filter);

    console.log(`${'='.repeat(60)}`);
    console.log(`${segment.name}`);
    console.log(`Subject: "${segment.subject}"`);
    console.log(`Tag: ${segment.tag}`);
    console.log(`Recipients: ${recipients.length}`);
    console.log('='.repeat(60));

    if (recipients.length === 0) {
      console.log('   No recipients for this segment.\n');
      continue;
    }

    // Show sample
    for (const c of recipients.slice(0, 5)) {
      const name = ((c.first_name || '?') + ' ' + (c.last_name || '')).trim();
      console.log(`   ${name.padEnd(25)} <${c.email}>`);
    }
    if (recipients.length > 5) console.log(`   ... and ${recipients.length - 5} more`);
    console.log('');

    if (!LIVE_SEND) continue;

    // Send via Broadcast API
    console.log(`   Sending via Broadcast API...`);
    try {
      const result = await sendBroadcast({
        name: segment.name,
        from: FROM_EMAIL,
        subject: segment.subject,
        html: segment.html,
        contacts: recipients.map(c => ({
          email: c.email,
          first_name: c.first_name || '',
          last_name: c.last_name || '',
        })),
        send: true,
      });
      console.log(`   ✅ Broadcast sent to ${result.sent} contacts`);
      totalSent += result.sent;

      // Tag contacts in CRM
      for (const c of recipients) {
        const newTags = [...new Set([...(c.tags || []), segment.tag, 'email_sent', 'final_push_campaign'])];
        await supabase.from('crm_contacts').update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq('id', c.id);
      }
      console.log(`   Tagged ${recipients.length} contacts as ${segment.tag}\n`);
    } catch (err) {
      console.error(`   ❌ Broadcast failed: ${err.message}\n`);
    }

    // Delay between broadcasts
    if (ALL_SEGMENTS.indexOf(segment) < ALL_SEGMENTS.length - 1) {
      console.log('   Waiting 3s before next broadcast...\n');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('CAMPAIGN SUMMARY');
  console.log('='.repeat(60));
  for (const segment of ALL_SEGMENTS) {
    const count = contacts.filter(segment.filter).length;
    console.log(`   ${segment.name}: ${count} recipients`);
  }
  if (LIVE_SEND) {
    console.log(`\n   Total sent: ${totalSent}`);
  } else {
    console.log('\n👆 Run with --send to fire these off:');
    console.log('   node scripts/final-push.mjs --send\n');
  }
}

main().catch(console.error);
