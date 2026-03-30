#!/usr/bin/env node
/**
 * FINAL CALL - "it's today, doors close at 7pm" to non-buyers
 * Only hits people who haven't already been emailed today (day_of_*)
 *
 * Usage:
 *   node scripts/final-call-today.mjs                    # Dry run
 *   node scripts/final-call-today.mjs --send             # Send to 4-email group only
 *   node scripts/final-call-today.mjs --send --all       # Send to everyone
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const COUPON_CODE = 'WEBINAR50';

const LIVE_SEND = process.argv.includes('--send');
const SEND_ALL = process.argv.includes('--all');

function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">Dylan</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr></table></td></tr></table></body></html>`;
}

const FINAL_EMAIL = {
  subject: "it's today. last chance to join",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("This is the last email you'll get from me about this.") +
    p("Tonight at <strong>7pm GMT</strong>, Uthman is going live. He's the student who sent 1,000 cold emails, got a 21% response rate, and landed 20+ internship offers in 3 weeks.") +
    p("He's breaking down the exact system. Every template. Every tool. Every follow-up sequence. Live, with Q&A.") +
    p("After tonight, the only way to access this is buying the recording at full price.") +
    p(`Right now you can still get <strong>50% off the full bundle</strong> with code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong>`) +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Live webinar + Q&A<br>&#8226; Cold Email Guide 2.0<br>&#8226; Cold Email Checklist<br>&#8226; Full recording<br><br><strong>&pound;14.50</strong> instead of &pound;29.</td></tr>` +
    btn("Get the bundle - 50% off \u2192", BUNDLE_LINK) +
    p("Or just the webinar for &pound;10:") +
    btn("Just the webinar \u2192", WEBINAR_LINK) +
    p("No more emails after this. If cold emailing isn't for you, no worries at all. But if you've been thinking about it, tonight is the night.")
  ),
  tag: 'final_call_today',
};

// Count campaign emails per contact
const emailTags = [
  'linkedin_emailed','funnel_email_2','funnel_email_3','funnel_email_4',
  'discount_sent','last_day_campaign','final_push_campaign',
  'mega_first_touch','mega_hot_discount','mega_funnel_4','mega_cold_reengage','mega_form_reblast',
  'guide_upsell_sent','confirmation_sent','day_of_reminder','day_of_discount',
];

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

async function sendBroadcast(name, contacts) {
  if (contacts.length === 0) return 0;
  console.log(`   Creating audience "${name}" (${contacts.length})...`);
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
  const br = await resendPost('/broadcasts', { audience_id: aud.id, from: FROM, subject: FINAL_EMAIL.subject, html: FINAL_EMAIL.html, name: `${name} ${Date.now()}` });
  await resendPost(`/broadcasts/${br.id}/send`, {});
  console.log(`   SENT! ID: ${br.id}`);
  setTimeout(async () => { try { await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${RESEND_KEY}` } }); } catch {} }, 60000);
  return added;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('   FINAL CALL - "it\'s today" to non-buyers');
  console.log('='.repeat(60));
  console.log(LIVE_SEND ? '\nLIVE MODE' + (SEND_ALL ? ' (ALL non-buyers)' : ' (low-medium touch only)') : '\nDRY RUN');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&limit=1000`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const contacts = await res.json();

  const nonBuyers = contacts.filter(c => {
    const tags = c.tags || [];
    return !tags.includes('stripe_customer') && c.status !== 'converted' && !tags.includes('bounced');
  });

  // Exclude anyone already emailed today
  const eligible = nonBuyers.filter(c => {
    const tags = c.tags || [];
    return !tags.includes('final_call_today') && !tags.includes('day_of_discount');
  });

  const withCounts = eligible.map(c => {
    const tags = c.tags || [];
    return { ...c, emailCount: emailTags.filter(t => tags.includes(t)).length };
  });

  const lowMed = withCounts.filter(c => c.emailCount <= 4); // 4 or fewer emails
  const higher = withCounts.filter(c => c.emailCount > 4);  // 5+ emails

  console.log(`\nTotal non-buyers: ${nonBuyers.length}`);
  console.log(`Already emailed today: ${nonBuyers.length - eligible.length}`);
  console.log(`Eligible: ${eligible.length}\n`);
  console.log(`  4 or fewer emails (fresh-ish): ${lowMed.length}`);
  console.log(`  5+ emails (heavily touched):   ${higher.length}\n`);

  const toSend = SEND_ALL ? withCounts : lowMed;
  console.log(`Will send to: ${toSend.length} people` + (SEND_ALL ? ' (ALL)' : ' (low-med only, use --all for everyone)'));

  // Show sample
  for (const c of toSend.slice(0, 10)) {
    const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '?';
    console.log(`  ${name.padEnd(25)} <${c.email}>  (${c.emailCount} prev emails)`);
  }
  if (toSend.length > 10) console.log(`  ... and ${toSend.length - 10} more`);

  if (!LIVE_SEND) {
    console.log('\nTo send (low-med only): node scripts/final-call-today.mjs --send');
    console.log('To send ALL:           node scripts/final-call-today.mjs --send --all');
    return;
  }

  // SEND
  const sent = await sendBroadcast('Final Call Today', toSend);

  // Tag
  console.log(`   Tagging ${toSend.length} contacts...`);
  for (const c of toSend) {
    const newTags = [...new Set([...(c.tags || []), 'final_call_today', 'email_sent'])];
    await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${c.id}`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ tags: newTags, last_activity_at: new Date().toISOString() }),
    });
  }

  console.log(`\n   DONE - ${sent} "final call" emails sent\n`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
