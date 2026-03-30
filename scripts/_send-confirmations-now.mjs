#!/usr/bin/env node
/**
 * Send confirmation emails (Zoom + Guide) to buyers missing confirmation_sent tag.
 * Zero-dependency. Uses only fetch().
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';

const ZOOM = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';
const GUIDE = 'https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62';
const CHECKLIST = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff) { return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr><tr><td style="font-size:10px;color:#cccccc;padding:20px 0 0 0;text-align:center;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#cccccc;text-decoration:none;">unsubscribe</a></td></tr></table></td></tr></table></body></html>`; }

// ── Templates ──
function bundleConfirmation(firstName) {
  return {
    subject: "you're in, here's everything you need",
    html: wrap(
      p(`Hey ${firstName || 'there'},`) +
      p("You're in. Good decision, you went for the full bundle so you're getting everything.") +
      p("On Saturday 28th March @7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email. The full strategy, the exact templates, the follow-up sequences, the mistakes etc.") +
      p("Here's what you need to know:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Date:</strong> Saturday 28th March<br>&#8226; <strong>Time:</strong> 7pm GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
      `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
      p("We'll also send you a reminder before we start so you don't miss it.") +
      p("Now, your guide. This is the exact cold email system Uthman used to land his offers, remastered and expanded with everything we've learned since:") +
      btn("Access your Cold Email Guide", GUIDE) +
      p("Seriously, read through it before Saturday. You'll get 10x more out of the webinar if you come having already seen the framework.") +
      p(`Also here's the cold email checklist as a quick reference: <a href="${CHECKLIST}" style="color:#0066cc;">Download Checklist</a>`) +
      p("Can't make it live? Don't stress, you'll get the full recording sent to this email within 24 hours."),
      "See you there\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Don & Dylan"
    ),
  };
}

function webinarOnlyConfirmation(firstName) {
  return {
    subject: "you're in, here's your zoom link",
    html: wrap(
      p(`Hey ${firstName || 'there'},`) +
      p("You're in. Good decision.") +
      p("On Saturday 28th March @7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email.") +
      p("Here's what you need to know:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Date:</strong> Saturday 28th March<br>&#8226; <strong>Time:</strong> 7pm GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
      `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
      p("We'll also send you a reminder before we start so you don't miss it.") +
      p(`Oh and here's the cold email checklist to get you started before the webinar: <a href="${CHECKLIST}" style="color:#0066cc;">Download the Checklist</a>. Have a look through it so you can come with questions on Saturday.`) +
      p("Can't make it live? Don't stress, you'll get the full recording sent to this email within 24 hours."),
      "See you there\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Don & Dylan"
    ),
  };
}

// ── Resend ──
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
  if (contacts.length === 0) { console.log(`   No contacts for "${name}".`); return 0; }
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
  console.log(`   Added ${added}/${contacts.length}`);
  const br = await resendPost('/broadcasts', { audience_id: aud.id, from: FROM, subject, html, name: `${name} ${Date.now()}` });
  await resendPost(`/broadcasts/${br.id}/send`, {});
  console.log(`   ✅ Broadcast SENT! ID: ${br.id}`);
  setTimeout(async () => { try { await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${RESEND_KEY}` } }); } catch {} }, 60000);
  return added;
}

// ── Supabase ──
async function updateContact(id, tags) {
  await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ tags, last_activity_at: new Date().toISOString() }),
  });
}

// ── MAIN ──
async function main() {
  console.log('\n📧 CONFIRMATION SENDER: Zoom + Guide to buyers missing confirmation\n');

  // Get ALL buyers (stripe_customer tag)
  let allBuyers = [];
  let from = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&tags=cs.{stripe_customer}&limit=1000&offset=${from}`;
    const res = await fetch(url, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
    const data = await res.json();
    if (data.length === 0) break;
    allBuyers = allBuyers.concat(data);
    from += 1000;
  }
  console.log(`   Total buyers: ${allBuyers.length}`);

  // Filter: missing confirmation_sent
  const needConfirmation = allBuyers.filter(c => !(c.tags || []).includes('confirmation_sent'));
  console.log(`   Missing confirmation: ${needConfirmation.length}`);

  // Split into bundle vs webinar-only
  const bundleBuyers = needConfirmation.filter(c => (c.tags || []).includes('bundle'));
  const webinarOnly = needConfirmation.filter(c => !(c.tags || []).includes('bundle'));

  console.log(`   Bundle buyers: ${bundleBuyers.length}`);
  console.log(`   Webinar-only buyers: ${webinarOnly.length}`);

  // Send bundle confirmations
  if (bundleBuyers.length > 0) {
    const tmpl = bundleConfirmation('{{{FIRST_NAME|there}}}');
    await sendBlast('Bundle Confirmation', tmpl.subject, tmpl.html, bundleBuyers);
    for (const c of bundleBuyers) {
      const newTags = [...new Set([...(c.tags || []), 'confirmation_sent'])];
      await updateContact(c.id, newTags);
    }
  }

  // Send webinar-only confirmations
  if (webinarOnly.length > 0) {
    const tmpl = webinarOnlyConfirmation('{{{FIRST_NAME|there}}}');
    await sendBlast('Webinar Confirmation', tmpl.subject, tmpl.html, webinarOnly);
    for (const c of webinarOnly) {
      const newTags = [...new Set([...(c.tags || []), 'confirmation_sent'])];
      await updateContact(c.id, newTags);
    }
  }

  if (needConfirmation.length === 0) {
    console.log('\n   ✅ All buyers already have their confirmations!');
  } else {
    console.log(`\n   ✅ DONE! Sent confirmations to ${needConfirmation.length} buyers.`);
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
