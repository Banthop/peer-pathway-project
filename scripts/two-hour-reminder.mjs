#!/usr/bin/env node
/**
 * 2-HOUR REMINDER - Plain text, hits Primary inbox
 * Send at ~5pm GMT (2 hours before 7pm webinar)
 *
 * Usage:
 *   node scripts/two-hour-reminder.mjs            # Dry run
 *   node scripts/two-hour-reminder.mjs --send      # Fire
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const ZOOM_LINK = 'https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1';

const LIVE = process.argv.includes('--send');

const SUBJECT = 'we start in 2 hours';
const TEXT = `Hey,

Quick one - we are going live in 2 hours.

Join here at 7pm GMT:
${ZOOM_LINK}

Meeting ID: 816 1951 5454
Passcode: 1FzZLi

See you in there.

Dylan`;

const bareHtml = TEXT.replace(/\n/g, '<br>');

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
  console.log('\n=== 2-HOUR REMINDER (Buyers Only) ===\n');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&limit=1000`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const contacts = await res.json();

  const buyers = contacts.filter(c => {
    const tags = c.tags || [];
    return tags.includes('stripe_customer') && !tags.includes('2hr_reminder') && !tags.includes('bounced');
  });

  console.log('Buyers to remind: ' + buyers.length);
  console.log('Mode: ' + (LIVE ? 'LIVE' : 'DRY RUN') + '\n');

  for (const c of buyers.slice(0, 5)) {
    const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '?';
    console.log('  ' + name + ' <' + c.email + '>');
  }
  if (buyers.length > 5) console.log('  ... and ' + (buyers.length - 5) + ' more');

  if (!LIVE) { console.log('\nRun with --send to fire.'); return; }

  console.log('\nCreating audience...');
  const aud = await api('/audiences', { name: '2hr Reminder ' + Date.now() });
  let added = 0;
  for (const c of buyers) {
    try {
      await api('/audiences/' + aud.id + '/contacts', { email: c.email, first_name: c.first_name || '', last_name: c.last_name || '', unsubscribed: false });
      added++;
      if (added % 8 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch {}
  }
  console.log('Added ' + added + '/' + buyers.length);
  const br = await api('/broadcasts', { audience_id: aud.id, from: FROM, subject: SUBJECT, html: bareHtml, name: '2hr Reminder ' + Date.now() });
  await api('/broadcasts/' + br.id + '/send', {});
  console.log('SENT! ID: ' + br.id);

  for (const c of buyers) {
    const newTags = [...new Set([...(c.tags || []), '2hr_reminder'])];
    await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${c.id}`, {
      method: 'PATCH',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ tags: newTags, last_activity_at: new Date().toISOString() }),
    });
  }
  console.log('Tagged ' + buyers.length + ' contacts. DONE.\n');
  setTimeout(async () => { try { await fetch('https://api.resend.com/audiences/' + aud.id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + RESEND_KEY } }); } catch {} }, 60000);
}

main().catch(e => console.error('FATAL:', e));
