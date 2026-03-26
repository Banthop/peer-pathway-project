#!/usr/bin/env node
/**
 * Send the "wait is this you??" email to all scraped contacts
 * who haven't already received it, and update CRM with their real names.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SENT_LOG_PATH = path.join(__dirname, '..', 'linkedin-sent-emails.json');

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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── Email template (same as linkedin-email-automation.mjs) ──
const EMAIL_SUBJECT = "wait is this you??";
const EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
  <style>body,table,td{font-family:Arial,sans-serif !important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!--[if !mso]><!--><div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">I'm not sure if this is you but someone mentioned you were looking for help with cold email and internships</div><!--<![endif]-->

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Hey,</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Did that subject line make you open this? Good.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">That's exactly what cold emailing is - getting a complete stranger to stop what they're doing and pay attention to you.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Our coach Uthman mastered it. No connections. No crazy CV. Just 1,000 cold emails, a 21% response rate, and 20+ internship offers in 3 weeks.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 12px 0;">On <strong>28th March at 7pm GMT</strong>, he's going live for 90 minutes to show you everything:</td></tr>

          <tr>
            <td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">
              &#8226; How he found the right people to email using Apollo.io<br>
              &#8226; The exact template behind his 21% response rate<br>
              &#8226; How he sent 50+ emails a day without them looking automated<br>
              &#8226; How he turned replies into ACTUAL offers
            </td>
          </tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">If you're looking for internships in finance, tech, consulting, or law and you've got nothing lined up - this is for you.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 8px 0;">Spots are limited.</td></tr>

          <tr>
            <td style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#111111;border-radius:8px;">
                    <a href="https://webinar.yourearlyedge.co.uk/webinar" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Save your spot</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="font-size:14px;line-height:25px;color:#888888;font-style:italic;padding:0 0 28px 0;">Can't make it on the night? A recording is included.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">See you there</td></tr>
          <tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── Helpers ──
function loadSentEmails() {
  try { return JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf-8')); } catch { return []; }
}
function saveSentEmails(emails) {
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(emails, null, 2));
}

async function sendEmail(toEmail) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [toEmail], subject: EMAIL_SUBJECT, html: EMAIL_HTML }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Resend error for ${toEmail}: ${JSON.stringify(result)}`);
  return result;
}

async function upsertCrmContact(contact) {
  if (!supabase) return;
  const nameParts = contact.name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const email = contact.email.toLowerCase().trim();

  // Check if contact exists
  const { data: existing } = await supabase.from('crm_contacts').select('id, first_name, last_name').eq('email', email).maybeSingle();

  if (existing) {
    // Update name if currently blank
    const updates = {};
    if (!existing.first_name && firstName) updates.first_name = firstName;
    if (!existing.last_name && lastName) updates.last_name = lastName;
    if (Object.keys(updates).length > 0) {
      await supabase.from('crm_contacts').update(updates).eq('id', existing.id);
      console.log(`   📝 Updated name for ${email}: ${firstName} ${lastName}`);
    }
  } else {
    // Insert new contact
    await supabase.from('crm_contacts').insert({
      email,
      first_name: firstName,
      last_name: lastName,
      source: 'linkedin',
      status: 'new',
      tags: ['linkedin_scraped'],
      metadata: {},
      last_activity_at: new Date().toISOString(),
    });
    console.log(`   ➕ Added to CRM: ${firstName} ${lastName} <${email}>`);
  }
}

// ── Main ──
async function main() {
  console.log('\n🚀 Sending "wait is this you??" to browser-scraped contacts\n');

  if (!RESEND_KEY) { console.error('❌ Missing RESEND_API_KEY'); process.exit(1); }

  // Load scraped contacts
  const scrapedPath = path.join(__dirname, '..', 'scraped-post1-comments.json');
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  console.log(`📋 Loaded ${scraped.length} scraped contacts`);

  // Load already-sent log
  const sentEmails = loadSentEmails();
  const sentSet = new Set(sentEmails.map(e => e.toLowerCase()));

  const newContacts = scraped.filter(c => !sentSet.has(c.email.toLowerCase()));
  console.log(`   Already sent: ${sentEmails.length}`);
  console.log(`   New to send:  ${newContacts.length}\n`);

  if (newContacts.length === 0) {
    console.log('✅ All caught up! No new emails to send.');
    // Still update CRM names for existing contacts
    console.log('\n📝 Updating CRM names for all contacts...');
    for (const contact of scraped) {
      await upsertCrmContact(contact);
    }
    console.log('✅ CRM names updated!');
    return;
  }

  let sent = 0, failed = 0;

  for (const contact of newContacts) {
    try {
      await sendEmail(contact.email);
      sentEmails.push(contact.email.toLowerCase());
      sent++;
      console.log(`   ✅ Sent to ${contact.name} <${contact.email}>`);

      // Also upsert into CRM with name
      await upsertCrmContact(contact);

      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      failed++;
      console.log(`   ❌ Failed: ${contact.email} — ${err.message}`);
    }
  }

  saveSentEmails(sentEmails);

  // Update names for contacts that already had email sent but no name
  console.log('\n📝 Updating CRM names for previously-sent contacts...');
  const alreadySent = scraped.filter(c => sentSet.has(c.email.toLowerCase()));
  for (const contact of alreadySent) {
    await upsertCrmContact(contact);
  }

  console.log(`\n📊 Results:`);
  console.log(`   Sent:   ${sent}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total sent all-time: ${sentEmails.length}`);
  console.log('\n✅ Done!');
}

main().catch(console.error);
