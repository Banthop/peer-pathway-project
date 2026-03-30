#!/usr/bin/env node
/**
 * LAST DAY CAMPAIGN - Friday 27th March 2026
 * Webinar is TOMORROW (Saturday 28th March, 7pm GMT)
 *
 * 5 targeted emails using Cialdini's persuasion principles:
 *   1. HOT LEADS (clicked + form) - commitment/consistency + scarcity
 *   2. FORM ONLY (filled form, never clicked email) - loss aversion + social proof
 *   3. CLICKED ONLY (clicked email, no form) - social proof + scarcity
 *   4. COLD RE-ENGAGE (emailed, never clicked) - authority + FOMO
 *   5. WEBINAR BUYERS (upsell guide for tomorrow) - scarcity + authority
 *
 * All via Broadcast API (Marketing Pro).
 *
 * Usage:
 *   node scripts/last-day-campaign.mjs              # Dry run
 *   node scripts/last-day-campaign.mjs --send       # Actually send
 *   node scripts/last-day-campaign.mjs --send --only=1   # Send only email 1
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
const FROM_EMAIL = process.env.FROM_EMAIL || 'dylan@yourearlyedge.co.uk';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!RESEND_KEY) { console.error('Missing RESEND_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing Supabase config'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY_EMAIL = onlyArg ? parseInt(onlyArg.split('=')[1]) : null;

const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';

// ── Email helpers ──
function p(text) {
  return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`;
}
function cta(text, url) {
  return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${url}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">${text}</a></td></tr></table></td></tr>`;
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
</table></td></tr></table></body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// EMAIL 1: HOT LEADS (clicked email + filled form, never bought)
// Cialdini: Commitment/Consistency, Scarcity, Social Proof
// ═══════════════════════════════════════════════════════════════

const EMAIL_1 = {
  id: 1,
  name: 'Last Day - Hot Leads',
  tag: 'last_day_hot',
  subject: "you were so close",
  filter: (c) => {
    const tags = c.tags || [];
    return (tags.includes('email_clicked') || tags.includes('form_lead'))
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('last_day_hot');
  },
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("You clicked through. You checked it out. You were right there.") +
    p("I'm not gonna pretend I don't know that. You were clearly interested enough to look, and that tells me something. You know this could help you.") +
    p("So here's the situation: the webinar is <strong>tomorrow</strong>. Saturday. 7pm GMT. After that, the live session is gone. The only way to access it will be to buy the recording at a higher price.") +
    p("Right now, 70+ students from LSE, Warwick, NYU, Columbia, Emory and IU have already locked in their spots. They're going to walk into internship season with a system that's been proven to work. A 21% response rate when everyone else is getting 1-3%.") +
    p("You've already done the hard part. You showed up. You looked. All that's left is to actually commit.") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; <strong>Full bundle</strong> (webinar + guide + checklist): <strong>&pound;29</strong><br>
      &#8226; <strong>Webinar only</strong>: <strong>&pound;10</strong><br>
      &#8226; Can't make it live? Recording included.
    </td></tr>` +
    cta("Lock in your spot before it's gone", WEBINAR_LINK) +
    p("Seriously. Tomorrow this disappears. Don't be the person who looks back and goes \"I should have just done it.\""),
    "Don't sleep on this\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
  ),
};

// ═══════════════════════════════════════════════════════════════
// EMAIL 2: FORM ONLY (filled form but never clicked any email)
// Cialdini: Commitment/Consistency, Loss Aversion, Scarcity
// ═══════════════════════════════════════════════════════════════

const EMAIL_2 = {
  id: 2,
  name: 'Last Day - Form Leads',
  tag: 'last_day_form',
  subject: "you started signing up",
  filter: (c) => {
    const tags = c.tags || [];
    return tags.includes('form_lead')
      && !tags.includes('email_clicked')
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('last_day_form');
  },
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("I'm reaching out because you literally started signing up for the cold email webinar. You filled out the form. You were in.") +
    p("Something stopped you. Maybe it was timing, maybe you got distracted, maybe you wanted to think about it. Totally fair.") +
    p("But here's what I want you to know: the webinar is <strong>tomorrow night</strong>. Saturday 28th March, 7pm GMT. After tomorrow, the live session is done. Gone.") +
    p("Uthman is going to walk through the exact system he used to send 1,000 cold emails, get a 21% response rate, and land 20+ internship offers in 3 weeks. No theory. No fluff. Just the actual playbook, live, with Q&A.") +
    p("You already made the decision once. You just didn't finish it. This is your chance to follow through.") +
    cta("Finish what you started", WEBINAR_LINK) +
    p("Webinar only is just <strong>&pound;10</strong>. Full bundle with the guide and templates is <strong>&pound;29</strong>. Recording included either way.") +
    p("Tomorrow night. That's it. After that, you'll need to buy the recording at full price."),
    "See you there\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
  ),
};

// ═══════════════════════════════════════════════════════════════
// EMAIL 3: CLICKED ONLY (clicked our email but never filled form)
// Cialdini: Social Proof, Scarcity, Authority
// ═══════════════════════════════════════════════════════════════

const EMAIL_3 = {
  id: 3,
  name: 'Last Day - Clickers',
  tag: 'last_day_clicker',
  subject: "62 students already in. this closes tomorrow.",
  filter: (c) => {
    const tags = c.tags || [];
    return tags.includes('email_clicked')
      && !tags.includes('form_lead')
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('last_day_clicker');
  },
  html: wrap(
    p("Hey,") +
    p("Quick one. I know you clicked through to check out the webinar so I'll keep this short.") +
    p("62 students have already signed up. LSE, Warwick, NYU, Columbia, Emory, IU, Bocconi, McGill. They're not messing around.") +
    p("The webinar is <strong>tomorrow</strong>. Saturday 28th March, 7pm GMT. 90 minutes. Live. After that, it's over.") +
    p("Here's what they're getting that you're not:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; The exact email template behind Uthman's 21% response rate<br>
      &#8226; How he found the right people to contact using Apollo.io<br>
      &#8226; The follow-up sequence that turned cold replies into real offers<br>
      &#8226; Live Q&A to get your specific questions answered
    </td></tr>` +
    p("Everyone else at your uni is applying through the same portals, writing the same cover letters, getting the same rejections. This is different.") +
    cta("Get your ticket before tomorrow", WEBINAR_LINK) +
    p("&pound;10 for the webinar. &pound;29 for the full bundle with templates. Recording included."),
    "Last chance\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
  ),
};

// ═══════════════════════════════════════════════════════════════
// EMAIL 4: COLD RE-ENGAGE (emailed before, never clicked anything)
// Cialdini: Authority, Scarcity, Social Proof
// ═══════════════════════════════════════════════════════════════

const EMAIL_4 = {
  id: 4,
  name: 'Last Day - Re-engage',
  tag: 'last_day_reengage',
  subject: "tomorrow. last call.",
  filter: (c) => {
    const tags = c.tags || [];
    const emailed = tags.includes('linkedin_emailed') || tags.includes('email_sent') || tags.includes('email_delivered');
    return emailed
      && !tags.includes('email_clicked')
      && !tags.includes('form_lead')
      && !tags.includes('stripe_customer')
      && !tags.includes('bounced')
      && !tags.includes('last_day_reengage');
  },
  html: wrap(
    p("Hey,") +
    p("I emailed you about this a few days ago and I get it, you're busy. But I'd feel bad if I didn't send one more.") +
    p("<strong>Tomorrow night, 7pm GMT, is the live cold email webinar.</strong> After that, it's done.") +
    p("Here's why it matters:") +
    p("Our coach Uthman had zero connections. No network. No fancy CV. He sat down, figured out cold email, sent 1,000 of them, and ended up with a 21% response rate and 20+ internship offers in 3 weeks.") +
    p("The average cold email response rate is 1-3%. His was <strong>21%</strong>.") +
    p("Tomorrow, he's going to show you exactly how. The templates. The tools. The follow-up sequences. Everything. Live. With Q&A so you can ask about your specific situation.") +
    p("70+ students have already signed up. From LSE, Warwick, NYU, Columbia, and more. If you're applying for internships this summer and you don't have something lined up yet, this is probably the most useful 90 minutes you'll spend this week.") +
    cta("Grab a ticket before tomorrow", WEBINAR_LINK) +
    p("&pound;10 for the webinar. &pound;29 for the bundle with the full cold email guide + templates. A recording is included if you can't make it live."),
    "Last one from me on this\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
  ),
};

// ═══════════════════════════════════════════════════════════════
// EMAIL 5: WEBINAR-ONLY BUYERS (upsell guide before tomorrow)
// Cialdini: Scarcity (read before tomorrow), Authority, Reciprocity
// ═══════════════════════════════════════════════════════════════

const EMAIL_5 = {
  id: 5,
  name: 'Last Day - Guide Upsell',
  tag: 'last_day_upsell',
  subject: "read this before tomorrow",
  filter: (c) => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer')
      && (tags.includes('webinar_only') || c.metadata?.product_type === 'webinar_only')
      && !tags.includes('bundle')
      && !tags.includes('guide_upsell_sent')
      && !tags.includes('last_day_upsell');
  },
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("Quick heads up before tomorrow.") +
    p("You've got your webinar ticket locked in. That's great. But I want you to get the absolute most out of Saturday.") +
    p("The students who get the best results from these sessions are the ones who come prepared. They've already read the framework, they already understand the system, and they use the live session to fill in the gaps and ask specific questions.") +
    p("That's exactly what the <strong>Cold Email Guide 2.0</strong> is for. It's got:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; Uthman's exact copy-paste email templates<br>
      &#8226; The Apollo.io setup walkthrough<br>
      &#8226; The follow-up sequence that got him a 21% response rate<br>
      &#8226; The "9:03 AM Rule" for when to send
    </td></tr>` +
    p("If you read through it tonight, you'll walk into tomorrow's webinar already knowing the framework. Uthman can then go deep on the nuances and you'll get 10x more out of it.") +
    `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="https://buy.stripe.com/3cI14m1Uw11n4mC4WE2400c" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">Get the Guide for &pound;12</a></td></tr></table></td></tr>` +
    p("Read it tonight. Come prepared tomorrow. You'll thank yourself."),
    "See you at 7pm\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Don & Dylan"
  ),
};

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

const ALL_EMAILS = [EMAIL_1, EMAIL_2, EMAIL_3, EMAIL_4, EMAIL_5];

async function main() {
  console.log('\n🔥 LAST DAY CAMPAIGN - Friday 27th March\n');
  console.log('Webinar is TOMORROW. This is the final push.\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE - emails WILL be sent\n' : '🟡 DRY RUN - no emails will be sent (use --send to go live)\n');

  if (ONLY_EMAIL) console.log(`Sending only Email #${ONLY_EMAIL}\n`);

  // Load all contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Failed to load contacts:', error.message); process.exit(1); }

  console.log(`Loaded ${contacts.length} contacts from CRM\n`);

  const emailsToSend = ONLY_EMAIL
    ? ALL_EMAILS.filter(e => e.id === ONLY_EMAIL)
    : ALL_EMAILS;

  let totalSent = 0;

  for (const email of emailsToSend) {
    const recipients = contacts.filter(email.filter);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`EMAIL ${email.id}: ${email.name}`);
    console.log(`Subject: "${email.subject}"`);
    console.log(`Tag: ${email.tag}`);
    console.log(`Recipients: ${recipients.length}`);
    console.log('='.repeat(60));

    if (recipients.length === 0) {
      console.log('   No recipients for this segment.');
      continue;
    }

    // Show first 10
    for (const c of recipients.slice(0, 8)) {
      const name = ((c.first_name || '?') + ' ' + (c.last_name || '')).trim();
      console.log(`   ${name.padEnd(25)} <${c.email}>`);
    }
    if (recipients.length > 8) console.log(`   ... and ${recipients.length - 8} more`);

    if (!LIVE_SEND) continue;

    // Send via Broadcast API
    console.log(`\n   Sending via Broadcast API...`);
    try {
      const result = await sendBroadcast({
        name: email.name,
        from: FROM_EMAIL,
        subject: email.subject,
        html: email.html,
        contacts: recipients.map(c => ({
          email: c.email,
          first_name: c.first_name || '',
          last_name: c.last_name || '',
        })),
        send: true,
      });
      console.log(`   Broadcast sent to ${result.sent} contacts`);
      totalSent += result.sent;

      // Tag contacts in CRM
      for (const c of recipients) {
        const newTags = [...new Set([...(c.tags || []), email.tag, 'email_sent', 'last_day_campaign'])];
        await supabase.from('crm_contacts').update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq('id', c.id);
      }
      console.log(`   Tagged ${recipients.length} contacts as ${email.tag}`);
    } catch (err) {
      console.error(`   Broadcast failed: ${err.message}`);
    }

    // Small delay between broadcasts
    if (emailsToSend.indexOf(email) < emailsToSend.length - 1) {
      console.log('   Waiting 3s before next broadcast...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('CAMPAIGN SUMMARY');
  console.log('='.repeat(60));
  for (const email of emailsToSend) {
    const count = contacts.filter(email.filter).length;
    console.log(`   Email ${email.id} (${email.name}): ${count} recipients`);
  }
  if (LIVE_SEND) {
    console.log(`\n   Total sent: ${totalSent}`);
  } else {
    console.log('\nRun with --send to actually send these emails.');
    console.log('Send individual emails with --only=1 (or 2, 3, 4, 5)');
  }
  console.log('');
}

main().catch(console.error);
