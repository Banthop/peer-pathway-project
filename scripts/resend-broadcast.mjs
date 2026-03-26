#!/usr/bin/env node
/**
 * resend-broadcast.mjs — Shared utility for sending emails via Resend Broadcast API
 * 
 * Uses the Marketing Pro plan (unlimited broadcasts) instead of transactional API.
 * 
 * Flow:
 *   1. Create a temporary audience
 *   2. Add contacts to it
 *   3. Create + send a broadcast to that audience
 *   4. Optionally clean up the audience after
 *
 * Usage:
 *   import { sendBroadcast } from './resend-broadcast.mjs';
 *   await sendBroadcast({
 *     name: 'Confirmation Emails',
 *     from: 'Dylan <dylan@yourearlyedge.co.uk>',
 *     subject: 'Your ticket is confirmed!',
 *     html: '<p>Hi {{{FIRST_NAME|there}}}, ...</p>',
 *     contacts: [{ email: 'a@b.com', first_name: 'Alex', last_name: 'Smith' }],
 *     send: true,
 *   });
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// -- Load env --
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
const FROM_EMAIL = process.env.FROM_EMAIL || 'Dylan <dylan@yourearlyedge.co.uk>';

async function resendPost(endpoint, body) {
  const res = await fetch(`https://api.resend.com${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend ${endpoint} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function resendDelete(endpoint) {
  const res = await fetch(`https://api.resend.com${endpoint}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${RESEND_KEY}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn(`   Cleanup warning: DELETE ${endpoint} returned ${res.status}`);
  }
}

/**
 * Send a broadcast email to a list of contacts via Resend Marketing API
 */
export async function sendBroadcast({ name, from, subject, html, contacts, send = false, cleanup = true }) {
  if (!RESEND_KEY) throw new Error('Missing RESEND_API_KEY');
  if (!contacts || contacts.length === 0) {
    console.log('   No contacts to send to.');
    return { sent: 0, audienceId: null, broadcastId: null };
  }

  const audienceName = `${name} ${Date.now()}`;
  console.log(`\n   Creating audience: "${audienceName}" (${contacts.length} contacts)...`);

  // 1. Create temporary audience
  const audience = await resendPost('/audiences', { name: audienceName });
  const audienceId = audience.id;
  console.log(`   Audience created: ${audienceId}`);

  // 2. Add contacts (with rate limiting)
  let added = 0;
  for (const c of contacts) {
    try {
      await resendPost(`/audiences/${audienceId}/contacts`, {
        email: c.email,
        first_name: c.first_name || '',
        last_name: c.last_name || '',
        unsubscribed: false,
      });
      added++;
      // Rate limit: 10 per second max
      if (added % 8 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.warn(`   Failed to add ${c.email}: ${err.message}`);
    }
  }
  console.log(`   Added ${added}/${contacts.length} contacts to audience`);

  if (!send) {
    console.log(`   DRY RUN - broadcast not sent. Audience "${audienceName}" created with ${added} contacts.`);
    return { sent: 0, audienceId, broadcastId: null };
  }

  // 3. Create + send broadcast
  console.log(`   Creating and sending broadcast...`);
  const broadcast = await resendPost('/broadcasts', {
    audience_id: audienceId,
    from: from || FROM_EMAIL,
    subject,
    html,
    name: audienceName,
    send: true,
  });
  console.log(`   Broadcast sent! ID: ${broadcast.id}`);

  // 4. Cleanup (optional, delete audience after a delay to let broadcast process)
  if (cleanup) {
    console.log(`   Will clean up audience in 60s...`);
    setTimeout(async () => {
      try {
        await resendDelete(`/audiences/${audienceId}`);
        console.log(`   Cleaned up audience ${audienceId}`);
      } catch {}
    }, 60000);
  }

  return { sent: added, audienceId, broadcastId: broadcast.id };
}

// -- CLI mode: run directly --
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  // Test with a single email
  const testEmail = process.argv[2];
  if (!testEmail) {
    console.log('Usage: node scripts/resend-broadcast.mjs test@email.com');
    process.exit(0);
  }
  sendBroadcast({
    name: 'Test Broadcast',
    subject: 'Test from EarlyEdge',
    html: '<p>Hi {{{FIRST_NAME|there}}}, this is a test broadcast from EarlyEdge.</p><p>{{{RESEND_UNSUBSCRIBE_URL}}}</p>',
    contacts: [{ email: testEmail, first_name: 'Test' }],
    send: true,
  }).then(r => console.log('\nResult:', r)).catch(console.error);
}
