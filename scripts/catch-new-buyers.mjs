#!/usr/bin/env node
/**
 * NEW BUYER CHECK - Picks up any new Stripe customers who
 * haven't received confirmation yet and sends it.
 *
 * Run this after waking up / before the webinar.
 *
 * Usage:
 *   node scripts/catch-new-buyers.mjs            # Dry run
 *   node scripts/catch-new-buyers.mjs --send      # Send confirmations
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const ZOOM_LINK = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';
const GUIDE_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-guide';
const CHECKLIST_LINK = 'https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist';

const LIVE = process.argv.includes('--send');

// Plain text confirmations (Primary inbox)
function bundleText(name) {
  return `Hey ${name || 'there'},

You're in. Good decision - you went for the full bundle so you're getting everything.

Tonight at 7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using cold email. The full strategy, the templates, the follow-ups.

Here's what you need:

- Zoom link: ${ZOOM_LINK}
- Meeting ID: 816 1951 5454 / Passcode: 1FzZLi
- Date: Saturday 28th March
- Time: 7pm GMT
- Duration: ~90 mins + live Q&A

Your Cold Email Guide: ${GUIDE_LINK}
Your Cold Email Checklist: ${CHECKLIST_LINK}

Read through the guide before tonight. You'll get way more out of the webinar.

Can't make it live? No stress - full recording sent to this email within 24 hours.

See you tonight.

Don & Dylan
EarlyEdge`;
}

function webinarText(name) {
  return `Hey ${name || 'there'},

You're in. Good decision.

Tonight at 7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using cold email. The full strategy, the templates, the follow-ups.

Here's what you need:

- Zoom link: ${ZOOM_LINK}
- Meeting ID: 816 1951 5454 / Passcode: 1FzZLi
- Date: Saturday 28th March
- Time: 7pm GMT
- Duration: ~90 mins + live Q&A

Your Cold Email Checklist: ${CHECKLIST_LINK}

Have a look before tonight so you can come with questions.

Can't make it live? No stress - full recording sent to this email within 24 hours.

See you tonight.

Don & Dylan
EarlyEdge`;
}

async function api(endpoint, body) {
  const res = await fetch('https://api.resend.com' + endpoint, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(endpoint + ': ' + JSON.stringify(data));
  return data;
}

async function main() {
  console.log('\n=== NEW BUYER CHECK ===\n');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status,metadata&limit=1000`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const contacts = await res.json();

  // Buyers without confirmation
  const needConfirm = contacts.filter(c => {
    const tags = c.tags || [];
    return (tags.includes('stripe_customer') || c.status === 'converted') && !tags.includes('confirmation_sent');
  });

  console.log('Buyers needing confirmation: ' + needConfirm.length);

  if (needConfirm.length === 0) {
    console.log('All buyers have their confirmation. Nothing to do.\n');
    return;
  }

  const bundle = [];
  const webinarOnly = [];
  for (const c of needConfirm) {
    const tags = c.tags || [];
    if (tags.includes('bundle') || c.metadata?.product_type === 'bundle') {
      bundle.push(c);
    } else {
      webinarOnly.push(c);
    }
  }

  console.log('  Bundle: ' + bundle.length);
  console.log('  Webinar-only: ' + webinarOnly.length + '\n');

  for (const c of needConfirm) {
    const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '?';
    const type = bundle.includes(c) ? 'BUNDLE' : 'WEBINAR';
    console.log('  [' + type + '] ' + name + ' <' + c.email + '>');
  }

  if (!LIVE) { console.log('\nRun with --send to send confirmations.'); return; }

  console.log('\nSending...');
  let sent = 0;
  for (const c of needConfirm) {
    const isBundle = bundle.includes(c);
    const name = c.first_name || 'there';
    const text = isBundle ? bundleText(name) : webinarText(name);
    const subject = isBundle ? "you're in - here's everything you need" : "you're in - here's your zoom link";

    try {
      await api('/emails', { from: FROM, to: [c.email], subject, text });
      sent++;
      console.log('  Sent to ' + c.email);

      // Tag
      const newTags = [...new Set([...(c.tags || []), 'confirmation_sent', isBundle ? 'bundle' : 'webinar_only'])];
      await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${c.id}`, {
        method: 'PATCH',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ tags: newTags, last_activity_at: new Date().toISOString() }),
      });
    } catch (e) { console.log('  Failed: ' + c.email + ' - ' + e.message); }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone. Sent ' + sent + ' confirmations.\n');
}

main().catch(e => console.error('FATAL:', e));
