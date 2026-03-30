#!/usr/bin/env node
/**
 * ZERO-DEPENDENCY blast script. Uses only fetch(). No supabase-js. No imports.
 * Queries Supabase REST API directly, sends via Resend Broadcast API directly.
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff) { return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr></table></td></tr></table></body></html>`; }

// ── Templates ──
const LAST_CHANCE_HTML = wrap(
  p("Hey {{{FIRST_NAME|there}}},") +
  p("Quick one. The cold email webinar is <strong>tonight at 7pm GMT</strong> and you haven't grabbed your ticket yet.") +
  p("Uthman sent 1,000 cold emails. Got a 21% response rate (the average is 1 to 3%). Landed 20+ internship offers in 3 weeks. Tonight he is going live for 90 minutes to break down exactly how he did it.") +
  p('I am giving you <strong>50% off the full bundle</strong> because you showed interest earlier and I want you in the room.') +
  p('Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">WEBINAR50</strong> at checkout.') +
  p("That gets you:") +
  `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; The live webinar (90 mins + Q&A)<br>&#8226; The full Cold Email Guide 2.0<br>&#8226; The Cold Email Checklist<br>&#8226; The recording if you can't make it live<br><br>All for <strong>&pound;14.50</strong> instead of &pound;29.</td></tr>` +
  btn("Get the bundle, 50% off", BUNDLE_LINK) +
  p('Or just the webinar for <strong>&pound;10</strong>. No code needed.') +
  btn("Just the webinar", WEBINAR_LINK) +
  p("This is the last email about this. After tonight it is done."),
  "Dylan"
);

const LAST_CHANCE_SUBJECT = "last chance. 50% off, webinar is tonight";

// ── Supabase REST query ──
async function queryContacts() {
  console.log('   Fetching contacts from Supabase REST API...');
  const url = `${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&status=neq.converted&limit=1000`;
  const res = await fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

// ── Supabase REST update ──
async function updateContact(id, tags) {
  await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ tags, last_activity_at: new Date().toISOString() }),
  });
}

// ── Resend Broadcast (direct, no module) ──
async function resendPost(endpoint, body) {
  const res = await fetch(`https://api.resend.com${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend ${endpoint}: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function sendBlast(name, subject, html, contacts) {
  if (contacts.length === 0) { console.log('   No contacts for this blast.'); return; }
  
  console.log(`   Creating audience "${name}" with ${contacts.length} contacts...`);
  const aud = await resendPost('/audiences', { name: `${name} ${Date.now()}` });
  
  let added = 0;
  for (const c of contacts) {
    try {
      await resendPost(`/audiences/${aud.id}/contacts`, { email: c.email, first_name: c.first_name || '', last_name: c.last_name || '', unsubscribed: false });
      added++;
      if (added % 8 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch (e) { console.log(`   Warn: ${c.email}: ${e.message}`); }
  }
  console.log(`   Added ${added}/${contacts.length} contacts`);
  
  console.log(`   Sending broadcast...`);
  const br = await resendPost('/broadcasts', { audience_id: aud.id, from: FROM, subject, html, name: `${name} ${Date.now()}` });
  await resendPost(`/broadcasts/${br.id}/send`, {});
  console.log(`   ✅ Broadcast SENT! ID: ${br.id}`);
  
  // cleanup after delay
  setTimeout(async () => {
    try { await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${RESEND_KEY}` } }); } catch {}
  }, 60000);
  
  return added;
}

// ── MAIN ──
async function main() {
  console.log('\n🚨 LAST CHANCE BLAST - Webinar Tonight 7pm GMT\n');
  
  const contacts = await queryContacts();
  console.log(`   Got ${contacts.length} non-converted contacts\n`);
  
  // Form leads who never got a last_day email
  const formLeads = contacts.filter(c => {
    const tags = c.tags || [];
    const started = tags.includes('form_started') || tags.includes('form_lead');
    if (!started) return false;
    if (tags.includes('stripe_customer')) return false;
    if (tags.includes('last_day_sent')) return false;
    return true;
  });
  
  // Dedupe
  const seen = new Set();
  const unique = formLeads.filter(c => { const e = c.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; });
  
  console.log(`   🎯 Form leads to blast: ${unique.length}`);
  for (const c of unique) console.log(`      ${c.email} | ${c.first_name || '?'} | ${(c.tags||[]).join(', ')}`);
  
  if (unique.length === 0) { console.log('\n   All caught up!'); return; }
  
  // SEND
  const sent = await sendBlast('Last Chance Tonight', LAST_CHANCE_SUBJECT, LAST_CHANCE_HTML, unique);
  
  // Tag
  console.log(`\n   Tagging ${unique.length} contacts...`);
  for (const c of unique) {
    const newTags = [...new Set([...(c.tags || []), 'last_day_sent', 'discount_sent', 'email_sent'])];
    await updateContact(c.id, newTags);
  }
  
  console.log(`\n   ✅ DONE! Sent last-chance discount to ${sent} form leads.\n`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
