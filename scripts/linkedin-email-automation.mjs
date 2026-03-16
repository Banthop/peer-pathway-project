#!/usr/bin/env node
/**
 * LinkedIn Comment → Email Automation
 * 
 * Scrapes emails from LinkedIn post comments via Apify,
 * then sends automated emails via Resend.
 * 
 * Usage:
 *   node scripts/linkedin-email-automation.mjs
 * 
 * Env vars (set in .env.local or pass directly):
 *   APIFY_API_TOKEN     — Your Apify API token
 *   RESEND_API_KEY      — Your Resend API key
 *   LINKEDIN_POST_URL   — The LinkedIn post URL to scrape
 *   FROM_EMAIL          — Sender email (must be verified in Resend)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SENT_LOG_PATH = path.join(__dirname, '..', 'linkedin-sent-emails.json');

// ── Load env from .env.local ──
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
      if (match) {
        process.env[match[1]] = process.env[match[1]] || match[2];
      }
    }
  } catch { /* no .env.local, that's fine */ }
}

loadEnv();

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const RESEND_KEY = process.env.RESEND_API_KEY;
const POST_URL = process.env.LINKEDIN_POST_URL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@earlyedge.co.uk';

// ── Email Templates ──

// 1. LinkedIn comment reply — sent to anyone who drops their email on the post
const EMAIL_SUBJECT = "You asked, here it is 👇";

const EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:28px 36px;">
            <span style="font-size:22px;letter-spacing:-0.5px;color:#ffffff;text-decoration:none;">
              <span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span>
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;color:#111;">
            <p style="font-size:16px;line-height:1.5;margin:0 0 16px;">Hey 👋</p>
            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 16px;">
              Saw you commented on our post — thanks for showing interest. As promised, here's the webinar link:
            </p>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr>
                <td align="center">
                  <a href="https://earlyedge.co.uk/webinar"
                     style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">
                    Grab your free spot →
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 16px;">
              It's a <strong>free live session</strong> on spring week conversion — what actually gets you the summer offer after your spring week ends. Real tactics, real examples.
            </p>
            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px;">
              Spots are limited so register now before they're gone.
            </p>
            <p style="font-size:14px;color:#888;margin:0;">— The EarlyEdge Team</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;border-top:1px solid #eee;padding:20px 36px;">
            <p style="font-size:11px;color:#aaa;margin:0;text-align:center;">
              EarlyEdge · Learn from people who just did it · <a href="https://earlyedge.co.uk" style="color:#aaa;">earlyedge.co.uk</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

// 2. Booking confirmation — call this from your Supabase Edge Function / webhook
// Usage: sendBookingConfirmation({ studentName, coachName, coachCredential, sessionType, date, time, meetingLink, price })
export function bookingConfirmationHtml({ studentName, coachName, coachCredential, sessionType, date, time, meetingLink, price }) {
  const isIntro = price === 0 || sessionType === 'intro';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:28px 36px;">
            <span style="font-size:22px;letter-spacing:-0.5px;color:#ffffff;">
              <span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span>
            </span>
          </td>
        </tr>

        <!-- Confirmation Banner -->
        <tr>
          <td style="background:#f0fdf4;border-bottom:1px solid #d1fae5;padding:20px 36px;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#059669;letter-spacing:0.05em;text-transform:uppercase;">✓ Booking Confirmed</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;color:#111;">
            <p style="font-size:16px;line-height:1.5;margin:0 0 8px;">Hey ${studentName || 'there'} 👋</p>
            <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 28px;">
              Your ${isIntro ? 'free intro call' : sessionType} with <strong>${coachName}</strong> is confirmed.
            </p>

            <!-- Session Details Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;border-bottom:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Coach</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111;">${coachName}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#888;">${coachCredential || ''}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Session</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#111;">${sessionType || 'Coaching Session'}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Date & Time</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#111;">${date} at ${time}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:14px;">
                        <p style="margin:0;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Amount</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#111;">${isIntro ? 'Free' : '£' + (price / 100).toFixed(2)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            ${meetingLink ? `
            <!-- Join Call Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${meetingLink}"
                     style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;">
                    Join the call →
                  </a>
                </td>
              </tr>
            </table>
            ` : ''}

            <p style="font-size:14px;line-height:1.6;color:#666;margin:0 0 8px;">
              You'll get a reminder 24 hours before your session. If you need to reschedule, log in to your dashboard.
            </p>
            <p style="font-size:14px;color:#888;margin:24px 0 0;">— The EarlyEdge Team</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;border-top:1px solid #eee;padding:20px 36px;">
            <p style="font-size:11px;color:#aaa;margin:0;text-align:center;">
              EarlyEdge · <a href="https://earlyedge.co.uk/dashboard" style="color:#aaa;">View your dashboard</a> · <a href="https://earlyedge.co.uk" style="color:#aaa;">earlyedge.co.uk</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;
}

export const BOOKING_CONFIRMATION_SUBJECT = (coachName) => `Your session with ${coachName} is confirmed ✓`;

// ── Helpers ──

function loadSentEmails() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSentEmails(emails) {
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(emails, null, 2));
}

function extractEmails(text) {
  if (!text) return [];
  // Match email patterns, including common obfuscation like "name [at] domain [dot] com"
  const cleaned = text
    .replace(/\s*\[at\]\s*/gi, '@')
    .replace(/\s*\(at\)\s*/gi, '@')
    .replace(/\s*\[dot\]\s*/gi, '.')
    .replace(/\s*\(dot\)\s*/gi, '.');

  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(cleaned.match(regex) || [])].map(e => e.toLowerCase());
}

// ── Apify: Scrape LinkedIn post comments ──

async function scrapeComments(postUrl) {
  console.log('📡 Scraping LinkedIn comments via Apify...');

  // Use the "curious_coder/linkedin-post-comments-scraper" actor
  // or "apify/linkedin-comment-scraper" — adjust the actor ID as needed
  const actorId = 'curious_coder~linkedin-post-search-scraper';

  const runUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  const response = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urls: [postUrl],
      maxComments: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apify request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  console.log(`  ✅ Found ${data.length} comment(s)`);
  return data;
}

// ── Resend: Send email ──

async function sendEmail(toEmail) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: EMAIL_SUBJECT,
      html: EMAIL_HTML,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Resend error for ${toEmail}: ${JSON.stringify(result)}`);
  }
  return result;
}

// ── Main ──

async function main() {
  console.log('\n🚀 LinkedIn Comment → Email Automation\n');

  // Validate config
  if (!APIFY_TOKEN) {
    console.error('❌ Missing APIFY_API_TOKEN. Set it in .env.local');
    process.exit(1);
  }
  if (!RESEND_KEY) {
    console.error('❌ Missing RESEND_API_KEY. Set it in .env.local');
    process.exit(1);
  }
  if (!POST_URL) {
    console.error('❌ Missing LINKEDIN_POST_URL. Set it in .env.local');
    process.exit(1);
  }

  console.log(`📋 Post: ${POST_URL}`);
  console.log(`📨 From: ${FROM_EMAIL}\n`);

  // Step 1: Scrape comments
  let comments;
  try {
    comments = await scrapeComments(POST_URL);
  } catch (err) {
    console.error('❌ Failed to scrape comments:', err.message);
    console.log('\n💡 Tip: Make sure your Apify API token is valid.');
    console.log('   Get one at: https://console.apify.com/account/integrations');
    console.log('   You may also need to try a different LinkedIn comment scraper actor.');
    process.exit(1);
  }

  // Step 2: Extract emails from comment text
  const allEmails = new Set();
  for (const comment of comments) {
    // Comment text could be in different fields depending on the Apify actor
    const text = comment.text || comment.comment || comment.commentText || comment.content || '';
    const found = extractEmails(text);
    found.forEach(e => allEmails.add(e));
  }

  console.log(`\n📧 Found ${allEmails.size} unique email(s) in comments`);

  if (allEmails.size === 0) {
    console.log('   No emails found. People may not have commented their emails yet.');
    return;
  }

  // Step 3: Filter out already-sent
  const sentEmails = loadSentEmails();
  const sentSet = new Set(sentEmails);
  const newEmails = [...allEmails].filter(e => !sentSet.has(e));

  console.log(`   Already sent: ${sentEmails.length}`);
  console.log(`   New to send:  ${newEmails.length}\n`);

  if (newEmails.length === 0) {
    console.log('✅ All caught up! No new emails to send.');
    return;
  }

  // Step 4: Send emails via Resend
  let sent = 0;
  let failed = 0;

  for (const email of newEmails) {
    try {
      await sendEmail(email);
      sentEmails.push(email);
      sent++;
      console.log(`   ✅ Sent to ${email}`);

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      failed++;
      console.log(`   ❌ Failed: ${email} — ${err.message}`);
    }
  }

  // Save updated sent list
  saveSentEmails(sentEmails);

  console.log(`\n📊 Results:`);
  console.log(`   Sent:   ${sent}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total sent all-time: ${sentEmails.length}`);
  console.log(`\n✅ Done! Run again later to catch new comments.\n`);
}

main().catch(err => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
