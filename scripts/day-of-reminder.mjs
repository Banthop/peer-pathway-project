#!/usr/bin/env node
/**
 * DAY-OF REMINDER - Sends "it's today!" email to all buyers
 * Also picks up any new form leads who need a discount email.
 *
 * Usage:
 *   node scripts/day-of-reminder.mjs            # Dry run
 *   node scripts/day-of-reminder.mjs --send      # Fire
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const ZOOM_LINK = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';
const COUPON_CODE = 'WEBINAR50';

const LIVE_SEND = process.argv.includes('--send');

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff = 'Don & Dylan') {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">See you tonight</td></tr><tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr></table></td></tr></table></body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

// BUNDLE BUYER reminder
const BUNDLE_REMINDER = {
  subject: "tonight at 7pm - here's your zoom link",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("Quick reminder. <strong>Tonight at 7pm GMT</strong>, Uthman is going live to break down exactly how he landed 20+ internship offers using cold email.") +
    p("Here's everything you need:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Time:</strong> 7:00 PM GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
    `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
    btn("Join Zoom at 7pm \u2192", ZOOM_LINK) +
    p("Before the session, make sure you've had a look at your resources:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <a href="${GUIDE_LINK}" style="color:#0066cc;">Cold Email Guide 2.0</a><br>&#8226; <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Cold Email Checklist</a></td></tr>` +
    p("Come with questions. The more prepared you are, the more you'll get out of it.") +
    p("Can't make it live? Don't stress, the full recording will be sent to this email within 24 hours.")
  ),
  tag: 'day_of_reminder',
};

// WEBINAR-ONLY BUYER reminder
const WEBINAR_REMINDER = {
  subject: "tonight at 7pm - here's your zoom link",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("Quick reminder. <strong>Tonight at 7pm GMT</strong>, Uthman is going live to break down exactly how he landed 20+ internship offers using cold email.") +
    p("Here's your Zoom link:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM_LINK}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Time:</strong> 7:00 PM GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
    `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
    btn("Join Zoom at 7pm \u2192", ZOOM_LINK) +
    p(`Have a look at the <a href="${CHECKLIST_LINK}" style="color:#0066cc;">Cold Email Checklist</a> before the session so you can come with questions.`) +
    p("Can't make it live? The full recording will be sent to this email within 24 hours.")
  ),
  tag: 'day_of_reminder',
};

// NEW FORM LEAD - last minute discount
const NEW_LEAD_DISCOUNT = {
  subject: "it's today. 50% off, last chance",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("You just checked out our cold email webinar and I wanted to catch you before it's too late.") +
    p("The webinar is <strong>tonight at 7pm GMT</strong>. Uthman is going live to show exactly how he sent 1,000 cold emails, got a 21% response rate, and landed 20+ internship offers.") +
    p(`I'm giving you <strong>50% off the full bundle</strong>. Code: <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong>`) +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Live webinar + Q&A<br>&#8226; Cold Email Guide 2.0<br>&#8226; Cold Email Checklist<br>&#8226; Full recording<br><br><strong>&pound;14.50</strong> instead of &pound;29.</td></tr>` +
    btn("Get the bundle - 50% off \u2192", BUNDLE_LINK) +
    p("Or just the webinar for &pound;10:") +
    btn("Just the webinar \u2192", WEBINAR_LINK) +
    p("Tickets close when we go live tonight."),
    "Dylan"
  ),
  tag: 'day_of_discount',
};

// ═══════════════════════════════════════════════════════════════
// SUPABASE + RESEND
// ═══════════════════════════════════════════════════════════════

async function queryContacts() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&limit=1000`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase: ${res.status}`);
  return res.json();
}

async function updateContact(id, tags) {
  await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ tags, last_activity_at: new Date().toISOString() }),
  });
}

async function resendPost(endpoint, body) {
  const res = await fetch(`https://api.resend.com${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend ${endpoint}: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function sendBroadcast(name, subject, html, contacts) {
  if (contacts.length === 0) { console.log('   No contacts. Skipping.'); return 0; }
  console.log(`   Creating audience "${name}" (${contacts.length} contacts)...`);
  const aud = await resendPost('/audiences', { name: `${name} ${Date.now()}` });
  let added = 0;
  for (const c of contacts) {
    try {
      await resendPost(`/audiences/${aud.id}/contacts`, { email: c.email, first_name: c.first_name || '', last_name: c.last_name || '', unsubscribed: false });
      added++;
      if (added % 8 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch (e) { console.log(`   Warn: ${c.email}: ${e.message}`); }
  }
  console.log(`   Added ${added}/${contacts.length}`);
  console.log(`   Sending broadcast...`);
  const br = await resendPost('/broadcasts', { audience_id: aud.id, from: FROM, subject, html, name: `${name} ${Date.now()}` });
  await resendPost(`/broadcasts/${br.id}/send`, {});
  console.log(`   SENT! ID: ${br.id}`);
  setTimeout(async () => { try { await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${RESEND_KEY}` } }); } catch {} }, 60000);
  return added;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('   DAY-OF REMINDER - Webinar Tonight 7pm GMT');
  console.log('='.repeat(60) + '\n');
  console.log(LIVE_SEND ? 'LIVE MODE\n' : 'DRY RUN (use --send to go live)\n');

  const contacts = await queryContacts();
  console.log(`Loaded ${contacts.length} contacts\n`);

  // Segment 1: Bundle buyers needing reminder
  const bundleBuyers = contacts.filter(c => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer') && tags.includes('bundle') && !tags.includes('day_of_reminder');
  });

  // Segment 2: Webinar-only buyers needing reminder
  const webinarBuyers = contacts.filter(c => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer') && !tags.includes('bundle') && !tags.includes('day_of_reminder');
  });

  // Segment 3: New form leads who never got any email
  const campaignTags = ['email_sent','linkedin_emailed','confirmation_sent','discount_sent',
    'mega_first_touch','mega_hot_discount','mega_funnel_4','mega_cold_reengage','mega_form_reblast',
    'funnel_email_2','funnel_email_3','funnel_email_4','day_of_discount',
    'last_day_campaign','final_push_campaign','guide_upsell_sent'];
  const newLeads = contacts.filter(c => {
    const tags = c.tags || [];
    if (tags.includes('bounced') || tags.includes('stripe_customer') || c.status === 'converted') return false;
    return !campaignTags.some(t => tags.includes(t));
  });

  console.log('SEGMENTS:');
  console.log(`  [1] Bundle buyer reminders: ${bundleBuyers.length}`);
  console.log(`  [2] Webinar-only buyer reminders: ${webinarBuyers.length}`);
  console.log(`  [3] New leads (never emailed): ${newLeads.length}\n`);

  // Details
  if (bundleBuyers.length > 0) {
    console.log('-- Bundle Buyers --');
    for (const c of bundleBuyers.slice(0, 5)) console.log(`  ${c.first_name || '?'} ${c.last_name || ''} <${c.email}>`);
    if (bundleBuyers.length > 5) console.log(`  ... and ${bundleBuyers.length - 5} more`);
  }
  if (webinarBuyers.length > 0) {
    console.log('-- Webinar-Only Buyers --');
    for (const c of webinarBuyers.slice(0, 5)) console.log(`  ${c.first_name || '?'} ${c.last_name || ''} <${c.email}>`);
    if (webinarBuyers.length > 5) console.log(`  ... and ${webinarBuyers.length - 5} more`);
  }
  if (newLeads.length > 0) {
    console.log('-- New Leads --');
    for (const c of newLeads) console.log(`  ${c.first_name || '?'} ${c.last_name || ''} <${c.email}> tags: ${(c.tags||[]).join(',')}`);
  }

  if (!LIVE_SEND) {
    console.log('\nRun with --send to fire these off.');
    return;
  }

  // SEND
  let total = 0;

  // 1. Bundle reminders
  if (bundleBuyers.length > 0) {
    console.log('\n--- Sending Bundle Reminders ---');
    const sent = await sendBroadcast('Bundle Day-Of Reminder', BUNDLE_REMINDER.subject, BUNDLE_REMINDER.html, bundleBuyers);
    for (const c of bundleBuyers) {
      const newTags = [...new Set([...(c.tags || []), 'day_of_reminder', 'email_sent'])];
      await updateContact(c.id, newTags);
    }
    console.log(`   Tagged ${bundleBuyers.length} contacts`);
    total += sent;
  }

  // Pause
  if (bundleBuyers.length > 0 && webinarBuyers.length > 0) {
    console.log('   Pausing 5s...');
    await new Promise(r => setTimeout(r, 5000));
  }

  // 2. Webinar-only reminders
  if (webinarBuyers.length > 0) {
    console.log('\n--- Sending Webinar-Only Reminders ---');
    const sent = await sendBroadcast('Webinar Day-Of Reminder', WEBINAR_REMINDER.subject, WEBINAR_REMINDER.html, webinarBuyers);
    for (const c of webinarBuyers) {
      const newTags = [...new Set([...(c.tags || []), 'day_of_reminder', 'email_sent'])];
      await updateContact(c.id, newTags);
    }
    console.log(`   Tagged ${webinarBuyers.length} contacts`);
    total += sent;
  }

  // 3. New form leads
  if (newLeads.length > 0) {
    console.log('\n--- Sending New Lead Discounts ---');
    if (webinarBuyers.length > 0 || bundleBuyers.length > 0) {
      console.log('   Pausing 5s...');
      await new Promise(r => setTimeout(r, 5000));
    }
    const sent = await sendBroadcast('New Lead Day-Of Discount', NEW_LEAD_DISCOUNT.subject, NEW_LEAD_DISCOUNT.html, newLeads);
    for (const c of newLeads) {
      const newTags = [...new Set([...(c.tags || []), 'day_of_discount', 'discount_sent', 'email_sent'])];
      await updateContact(c.id, newTags);
    }
    console.log(`   Tagged ${newLeads.length} contacts`);
    total += sent;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`   DONE - ${total} emails sent`);
  console.log('='.repeat(60) + '\n');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
