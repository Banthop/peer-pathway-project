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

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff) { return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr><tr><td style="font-size:10px;color:#cccccc;padding:20px 0 0 0;text-align:center;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#cccccc;text-decoration:none;">unsubscribe</a></td></tr></table></td></tr></table></body></html>`; }

// ── Templates ──
const CRAZY_DEAL_HTML = wrap(
  p("Hey {{{FIRST_NAME|there}}},") +
  p("Okay, we said we wouldn't email you again. We lied. But for a good reason.") +
  p("The webinar is in a few hours at 7pm GMT. People are pumped.") +
  p("We want you there, so we're doing something crazy.") +
  p("If you buy the webinar ticket for &pound;10, we'll give you the FULL Cold Email Guide 2.0 (worth &pound;29) for completely free.") +
  p("Just use the code <strong style='background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;'>FREEGUIDE</strong> at checkout on the full bundle.") +
  p("That drops the price of the &pound;29 bundle to just &pound;10. You get the webinar and the full 50-page guide for the exact same price as just the webinar.") +
  btn("Get the bundle for \u00A310", BUNDLE_LINK) +
  p("Seriously, this is it. We are not going to email you again after this. For real this time."),
  "Dylan & Don"
);

const CRAZY_DEAL_SUBJECT = "okay, we lied (crazy deal)";

// ── Supabase REST query ──
async function queryContacts() {
  console.log('   Fetching non-converted contacts from Supabase REST API...');
  
  let allContacts = [];
  let from = 0;
  const limit = 1000;
  while(true) {
    const url = `${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&status=neq.converted&limit=${limit}&offset=${from}`;
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    if(data.length === 0) break;
    allContacts = allContacts.concat(data);
    from += limit;
  }
  return allContacts;
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
  if (contacts.length === 0) { console.log('   No contacts for this blast.'); return 0; }
  
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
  console.log('\n🚨 CRAZY DEAL BLAST - Webinar Tonight 7pm GMT\n');
  
  const contacts = await queryContacts();
  console.log(`   Got ${contacts.length} non-converted contacts\n`);
  
  // Form leads who haven't bought yet
  const formLeads = contacts.filter(c => {
    const tags = c.tags || [];
    const started = tags.includes('form_started') || tags.includes('form_lead');
    if (!started) return false;
    if (tags.includes('stripe_customer')) return false;
    // We send this even to those who got last_day_sent
    if (tags.includes('crazy_deal_sent')) return false;
    return true;
  });
  
  // Dedupe
  const seen = new Set();
  const unique = formLeads.filter(c => { const e = c.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; });
  
  console.log(`   🎯 Form leads to blast: ${unique.length}`);
  for (const c of unique.slice(0, 5)) console.log(`      ${c.email} | ${c.first_name || '?'} | ${(c.tags||[]).join(', ')}`);
  if (unique.length > 5) console.log(`      ... and ${unique.length - 5} more.`);
  
  if (unique.length === 0) { console.log('\n   All caught up!'); return; }
  
  // SEND
  const sent = await sendBlast('Crazy Deal Tonight', CRAZY_DEAL_SUBJECT, CRAZY_DEAL_HTML, unique);
  
  // Tag
  console.log(`\n   Tagging ${unique.length} contacts...`);
  for (const c of unique) {
    const newTags = [...new Set([...(c.tags || []), 'crazy_deal_sent'])];
    await updateContact(c.id, newTags);
  }
  
  console.log(`\n   ✅ DONE! Sent crazy deal to ${sent} form leads.\n`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
