#!/usr/bin/env node
/**
 * Slides Email Sender
 *
 * Simple workflow:
 * 1. Paste emails from LinkedIn comments into emails.txt (one per line)
 * 2. Run this script
 * 3. It sends each new email to Loops and fires the slides_requested event
 * 4. Loops handles the 4-email flow automatically
 *
 * Usage:
 *   node scripts/slides-email-sender.mjs
 *
 * First time setup:
 *   1. Create scripts/emails.txt with one email per line
 *   2. Set LOOPS_API_KEY in .env.local
 *   3. Run the script
 *
 * It tracks which emails have already been sent so you can keep
 * adding new ones to emails.txt and re-run safely.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMAILS_FILE = path.join(__dirname, 'emails.txt');
const SENT_LOG = path.join(__dirname, 'slides-sent-log.json');

// Load .env.local
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
  } catch { /* no .env.local */ }
}

loadEnv();

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

if (!LOOPS_API_KEY) {
  console.error('Missing LOOPS_API_KEY. Add it to .env.local');
  process.exit(1);
}

// Load previously sent emails
function loadSentLog() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSentLog(sent) {
  fs.writeFileSync(SENT_LOG, JSON.stringify(sent, null, 2));
}

// Read emails from emails.txt
function loadEmails() {
  if (!fs.existsSync(EMAILS_FILE)) {
    console.log(`No emails.txt found. Creating one at: ${EMAILS_FILE}`);
    console.log('Paste emails from LinkedIn comments (one per line), then run again.');
    fs.writeFileSync(EMAILS_FILE, '# Paste emails here, one per line\n# Lines starting with # are ignored\n');
    process.exit(0);
  }

  const content = fs.readFileSync(EMAILS_FILE, 'utf-8');
  const emails = content
    .split('\n')
    .map(line => line.trim().toLowerCase())
    .filter(line => line && !line.startsWith('#'))
    .filter(line => line.includes('@')); // basic email check

  return [...new Set(emails)]; // dedupe
}

// Create contact in Loops
async function createLoopsContact(email) {
  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      source: 'linkedin_slides_post',
      userGroup: 'linkedin_slides_lead',
    }),
  });

  if (res.status === 409) {
    console.log(`  Contact exists: ${email}`);
    return true;
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`  Failed to create contact ${email}: ${res.status} ${text}`);
    return false;
  }

  console.log(`  Created contact: ${email}`);
  return true;
}

// Fire slides_requested event in Loops
async function fireEvent(email) {
  const res = await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      eventName: 'slides_requested',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  Failed to fire event for ${email}: ${res.status} ${text}`);
    return false;
  }

  console.log(`  Fired slides_requested for: ${email}`);
  return true;
}

// Main
async function main() {
  const emails = loadEmails();
  const sent = loadSentLog();
  const newEmails = emails.filter(e => !sent.includes(e));

  console.log(`\nTotal emails in file: ${emails.length}`);
  console.log(`Already processed: ${sent.length}`);
  console.log(`New to process: ${newEmails.length}\n`);

  if (newEmails.length === 0) {
    console.log('No new emails. Add more to scripts/emails.txt and run again.');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const email of newEmails) {
    console.log(`Processing: ${email}`);

    const contactOk = await createLoopsContact(email);
    if (contactOk) {
      const eventOk = await fireEvent(email);
      if (eventOk) {
        sent.push(email);
        saveSentLog(sent);
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone. ${success} processed, ${failed} failed.`);
  console.log(`Total sent all time: ${sent.length}`);
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
