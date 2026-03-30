#!/usr/bin/env node
/**
 * BLAST: Send the Cold Email Guide to recent BUYERS (stripe_customer).
 * Zero-dependency. Uses only fetch().
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';

// ── PUT YOUR SUBPAGE GUIDE LINK HERE ──
const GUIDE_LINK = 'https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62';

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff) { return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr><tr><td style="font-size:10px;color:#cccccc;padding:20px 0 0 0;text-align:center;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#cccccc;text-decoration:none;">unsubscribe</a></td></tr></table></td></tr></table></body></html>`; }

// ── Email Template ──
const GUIDE_HTML = wrap(
  p("Hey {{{FIRST_NAME|there}}},") +
  p("Thank you so much for purchasing the Early Edge Cold Email System. We genuinely appreciate you backing yourself like this.") +
  p("Your guide is ready. Click the button below to access it right now:") +
  btn("Access Your Cold Email Guide", GUIDE_LINK) +
  p("Inside you'll find the exact step-by-step system we used to land 15+ offers, including how to find firms on Apollo, write templates that actually get replies, and send at scale using Mail Merge.") +
  p("If you also purchased the webinar, the recording will be sent to you separately.") +
  p("If you have ANY questions at all, just reply to this email. We read every single one.") +
  p("Go get that internship."),
  "Dylan & Don"
);

const SUBJECT = "Your Cold Email Guide is ready";

// ── Supabase REST query ──
async function queryBuyers() {
  console.log('   Fetching buyers from Supabase...');
  let allContacts = [];
  let from = 0;
  const limit = 1000;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&tags=cs.{stripe_customer}&limit=${limit}&offset=${from}`;
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    if (data.length === 0) break;
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

// ── Resend Broadcast ──
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
  console.log('\n📦 GUIDE DELIVERY BLAST - Sending to buyers\n');

  const buyers = await queryBuyers();
  console.log(`   Got ${buyers.length} buyers (stripe_customer tag)\n`);

  // Filter: only those who haven't received the guide yet
  const toSend = buyers.filter(c => {
    const tags = c.tags || [];
    if (tags.includes('guide_sent')) return false;
    return true;
  });

  // Dedupe
  const seen = new Set();
  const unique = toSend.filter(c => { const e = c.email.toLowerCase(); if (seen.has(e)) return false; seen.add(e); return true; });

  console.log(`   🎯 Buyers to send guide to: ${unique.length}`);
  for (const c of unique.slice(0, 10)) console.log(`      ${c.email} | ${c.first_name || '?'} | ${(c.tags||[]).join(', ')}`);
  if (unique.length > 10) console.log(`      ... and ${unique.length - 10} more.`);

  if (unique.length === 0) { console.log('\n   All buyers already have the guide!'); return; }

  // SEND
  const sent = await sendBlast('Guide Delivery', SUBJECT, GUIDE_HTML, unique);

  // Tag them as guide_sent
  console.log(`\n   Tagging ${unique.length} contacts as guide_sent...`);
  for (const c of unique) {
    const newTags = [...new Set([...(c.tags || []), 'guide_sent'])];
    await updateContact(c.id, newTags);
  }

  console.log(`\n   ✅ DONE! Sent guide to ${sent} buyers.\n`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
