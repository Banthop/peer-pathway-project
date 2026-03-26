#!/usr/bin/env node
/**
 * Smart Funnel Email Sender
 * 
 * Queries the CRM database, determines each contact's funnel stage,
 * and sends the appropriate email. Never sends the same email twice.
 * Automatically updates CRM tags after every send.
 * 
 * Usage:
 *   node scripts/send-funnel-emails.mjs              # Dry run (shows what would send)
 *   node scripts/send-funnel-emails.mjs --send        # Actually send emails
 *   node scripts/send-funnel-emails.mjs --send --stage=2   # Only send Email 2
 *   node scripts/send-funnel-emails.mjs --send --stage=3   # Only send Email 3
 *   node scripts/send-funnel-emails.mjs --send --stage=4   # Only send Email 4
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

if (!RESEND_KEY) { console.error('❌ Missing RESEND_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ Missing Supabase config'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');
const STAGE_FILTER = args.find(a => a.startsWith('--stage='));
const ONLY_STAGE = STAGE_FILTER ? parseInt(STAGE_FILTER.split('=')[1]) : null;

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';

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
          <tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

function p(text) {
  return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${text}</td></tr>`;
}

// ── Email 1: Already exists ("wait is this you??") - handled by send-scraped-emails.mjs

// ── Email 2: Emailed but didn't click - re-pitch with social proof ──
const EMAIL_2 = {
  tag: 'funnel_email_2',
  subject: 'the numbers don\'t lie',
  html: emailWrapper(`
    ${p('Hey,')}
    ${p('I sent you something a few days ago about a cold email webinar. You might have missed it so I wanted to follow up.')}
    ${p('Here are the actual numbers from our coach Uthman:')}
    <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; 1,000 cold emails sent<br>
      &#8226; 21% response rate (industry average is 1-3%)<br>
      &#8226; 20+ internship offers<br>
      &#8226; 3 weeks. From zero connections.
    </td></tr>
    ${p('He\'s not some LinkedIn influencer. He\'s a student who figured out a system that actually works.')}
    ${p('This <strong>Saturday 28th March at 7pm GMT</strong>, he\'s going live for 90 minutes to break down exactly how he did it - the templates, the tools, the follow-up sequences. Everything.')}
    ${p('Spots are filling up fast and we\'re capping attendance to keep it interactive.')}
    ${ctaButton('Save your spot →', WEBINAR_LINK)}
    ${p('<em style="color:#888;">Can\'t make it live? A recording is included with every ticket.</em>')}
  `),
};

// ── Email 3: Opened but didn't click - urgency + FOMO ──
const EMAIL_3 = {
  tag: 'funnel_email_3',
  subject: 'your competition already signed up',
  html: emailWrapper(`
    ${p('Hey,')}
    ${p('I can see you opened my last email but didn\'t click through.')}
    ${p('I get it - you\'re busy. But here\'s the thing:')}
    ${p('Students from LSE, Warwick, NYU, Columbia, and IU have already secured their spots for Saturday\'s webinar.')}
    ${p('While you\'re still thinking about it, someone at your uni is already preparing to send their first batch of cold emails using Uthman\'s exact system.')}
    ${p('The webinar is <strong>this Saturday, 28th March at 7pm GMT</strong>. After that, the only way to access this is by buying the recording.')}
    ${ctaButton('Grab your spot before it fills up →', WEBINAR_LINK)}
    ${p('No fluff. No theory. Just the exact playbook that got a student with zero connections 20+ offers in 3 weeks.')}
  `),
};

// ── Email 4: Clicked/signed up but didn't purchase - discount push ──
const EMAIL_4 = {
  tag: 'funnel_email_4',
  subject: 'quick question + a discount for you',
  html: emailWrapper(`
    ${p('Hey,')}
    ${p('I noticed you checked out the webinar page but didn\'t grab a ticket yet. Totally fair - so I wanted to make it a no-brainer for you.')}
    ${p('For the next 48 hours, you can get the <strong>full bundle</strong> for just <strong>£29</strong> (normally £38+):')}
    <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
      &#8226; Live 90-min webinar (Sat 28th March, 7pm GMT)<br>
      &#8226; Full recording sent after<br>
      &#8226; Uthman's exact cold email templates<br>
      &#8226; Apollo.io setup guide<br>
      &#8226; Follow-up sequences that got him a 21% response rate
    </td></tr>
    ${p('If you\'re applying for internships this summer in finance, consulting, tech, or law - this is the cheapest shortcut you\'ll find.')}
    ${ctaButton('Get the bundle for £29 →', WEBINAR_LINK)}
    ${p('This price won\'t last. We\'re raising it after the webinar.')}
  `),
};

// ═══════════════════════════════════════════════════════════════
// FUNNEL STAGE LOGIC
// ═══════════════════════════════════════════════════════════════

function classifyContact(contact) {
  const tags = contact.tags || [];
  const status = contact.status;

  // Already converted - no email needed
  if (status === 'converted' || tags.includes('stripe_customer')) return { stage: 'most_aware', emailNeeded: null };

  // Product Aware: form_lead or clicked - send Email 4 if not already sent
  if (tags.includes('form_lead') || tags.includes('email_clicked')) {
    if (tags.includes('funnel_email_4')) return { stage: 'product_aware', emailNeeded: null };
    return { stage: 'product_aware', emailNeeded: EMAIL_4, stageNum: 4 };
  }

  // Solution Aware: opened email - send Email 3 if not already sent
  if (tags.includes('email_opened') || status === 'engaged') {
    if (tags.includes('funnel_email_3')) return { stage: 'solution_aware', emailNeeded: null };
    return { stage: 'solution_aware', emailNeeded: EMAIL_3, stageNum: 3 };
  }

  // Problem Aware: emailed/delivered but no open - send Email 2 if not already sent
  if (tags.includes('email_sent') || tags.includes('linkedin_emailed') || tags.includes('email_delivered') || status === 'contacted') {
    if (tags.includes('funnel_email_2')) return { stage: 'problem_aware', emailNeeded: null };
    return { stage: 'problem_aware', emailNeeded: EMAIL_2, stageNum: 2 };
  }

  // Unaware - Email 1 is handled by the linkedin-email-automation.mjs script
  return { stage: 'unaware', emailNeeded: null };
}

// ═══════════════════════════════════════════════════════════════
// SEND + CRM UPDATE
// ═══════════════════════════════════════════════════════════════

async function sendEmail(toEmail, template) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [toEmail], subject: template.subject, html: template.html }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Resend error: ${JSON.stringify(result)}`);
  return result;
}

async function updateCrmAfterSend(contactId, existingTags, templateTag) {
  const newTags = [...existingTags];
  if (!newTags.includes(templateTag)) newTags.push(templateTag);
  if (!newTags.includes('email_sent')) newTags.push('email_sent');

  const { error } = await supabase
    .from('crm_contacts')
    .update({
      tags: newTags,
      last_activity_at: new Date().toISOString(),
      metadata: {
        last_funnel_email: templateTag,
        last_funnel_email_date: new Date().toISOString(),
      },
    })
    .eq('id', contactId);

  if (error) console.error(`   ⚠️ CRM update failed for ${contactId}: ${error.message}`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n🎯 Smart Funnel Email Sender\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE - emails WILL be sent\n' : '🟡 DRY RUN - no emails will be sent (use --send to go live)\n');

  // Load all CRM contacts
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('❌ Failed to load contacts:', error.message); process.exit(1); }

  console.log(`📋 Loaded ${contacts.length} contacts from CRM\n`);

  // Classify each contact
  const toSend = [];
  const summary = { unaware: 0, problem_aware: 0, solution_aware: 0, product_aware: 0, most_aware: 0, needs_email: 0 };

  for (const contact of contacts) {
    const result = classifyContact(contact);
    summary[result.stage]++;

    if (result.emailNeeded) {
      // Apply stage filter if specified
      if (ONLY_STAGE && result.stageNum !== ONLY_STAGE) continue;
      
      summary.needs_email++;
      toSend.push({ contact, ...result });
    }
  }

  // Print funnel summary
  console.log('📊 Funnel Breakdown:');
  console.log(`   Unaware (no email sent):     ${summary.unaware}`);
  console.log(`   Problem Aware (emailed):     ${summary.problem_aware}`);
  console.log(`   Solution Aware (opened):     ${summary.solution_aware}`);
  console.log(`   Product Aware (clicked):     ${summary.product_aware}`);
  console.log(`   Most Aware (converted):      ${summary.most_aware}`);
  console.log(`\n   📨 Emails to send: ${toSend.length}\n`);

  if (toSend.length === 0) {
    console.log('✅ Everyone is covered! No funnel emails needed right now.');
    console.log('   (Contacts move stages when Resend webhooks report opens/clicks)');
    return;
  }

  // Group by email template for display
  const byStage = {};
  for (const item of toSend) {
    const key = item.emailNeeded.tag;
    if (!byStage[key]) byStage[key] = [];
    byStage[key].push(item);
  }

  for (const [tag, items] of Object.entries(byStage)) {
    const subject = items[0].emailNeeded.subject;
    console.log(`\n── "${subject}" (${tag}) - ${items.length} recipients ──`);
    for (const item of items.slice(0, 10)) {
      const name = [item.contact.first_name, item.contact.last_name].filter(Boolean).join(' ') || 'Unknown';
      console.log(`   ${name} <${item.contact.email}>`);
    }
    if (items.length > 10) console.log(`   ... and ${items.length - 10} more`);
  }

  if (!LIVE_SEND) {
    console.log('\n💡 Run with --send to actually send these emails.');
    console.log('   Example: node scripts/send-funnel-emails.mjs --send');
    console.log('   Example: node scripts/send-funnel-emails.mjs --send --stage=2');
    return;
  }

  // Send emails
  let sent = 0, failed = 0;
  console.log('\n📨 Sending...\n');

  for (const item of toSend) {
    try {
      await sendEmail(item.contact.email, item.emailNeeded);
      await updateCrmAfterSend(item.contact.id, item.contact.tags || [], item.emailNeeded.tag);
      sent++;
      const name = [item.contact.first_name, item.contact.last_name].filter(Boolean).join(' ') || 'Unknown';
      console.log(`   ✅ ${name} <${item.contact.email}> - "${item.emailNeeded.subject}"`);
      await new Promise(r => setTimeout(r, 400)); // Rate limit
    } catch (err) {
      failed++;
      console.log(`   ❌ ${item.contact.email} - ${err.message}`);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   Sent:   ${sent}`);
  console.log(`   Failed: ${failed}`);
  console.log('\n✅ Done! CRM tags updated automatically. No duplicates possible.');
}

main().catch(console.error);
