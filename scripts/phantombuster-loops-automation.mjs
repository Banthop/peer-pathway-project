#!/usr/bin/env node
/**
 * Phantombuster -> Loops Slides Giveaway Automation
 *
 * Fetches LinkedIn post commenter data from a Phantombuster agent,
 * extracts emails from comment text, then creates/updates contacts
 * in Loops and fires a "slides_requested" event to trigger the
 * slides giveaway sequence.
 *
 * Phantombuster phantom used: "LinkedIn Post Commenters"
 * Output schema: array of objects with fields like
 *   profileUrl, firstName, lastName, comment, timestamp, etc.
 *
 * Usage:
 *   node scripts/phantombuster-loops-automation.mjs
 *
 * Env vars (set in .env.local or export directly):
 *   PHANTOMBUSTER_API_KEY   - Your Phantombuster API key (Settings > API)
 *   PHANTOMBUSTER_AGENT_ID  - The agent ID of your LinkedIn Post Commenters phantom
 *   LOOPS_API_KEY           - Your Loops API key
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Log file lives in the scripts/ directory, sibling to this file
const SENT_LOG_PATH = path.join(__dirname, 'phantombuster-sent-emails.json');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
      if (match) {
        // Don't overwrite vars already set in the environment
        process.env[match[1]] = process.env[match[1]] || match[2];
      }
    }
  } catch {
    // No .env.local present - that's fine, rely on exported env vars
  }
}

loadEnv();

const strip = (v) => v ? v.replace(/^["']|["']$/g, '') : v;
const PHANTOMBUSTER_API_KEY = strip(process.env.PHANTOMBUSTER_API_KEY);
const PHANTOMBUSTER_AGENT_ID = strip(process.env.PHANTOMBUSTER_AGENT_ID);
const LOOPS_API_KEY = strip(process.env.LOOPS_API_KEY) || '737c3b4a0a9bee2e03260a1a2a4c9c85';

// Phantombuster base URL
const PB_BASE = 'https://api.phantombuster.com/api/v2';

// ---------------------------------------------------------------------------
// Deduplication log helpers
// ---------------------------------------------------------------------------

function loadSentEmails() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSentEmails(emails) {
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(emails, null, 2));
}

// ---------------------------------------------------------------------------
// Email extraction
// ---------------------------------------------------------------------------

/**
 * Extracts email addresses from free-form comment text.
 * Handles common obfuscations like [at], (at), [dot], (dot).
 */
function extractEmails(text) {
  if (!text || typeof text !== 'string') return [];

  const cleaned = text
    .replace(/\s*\[at\]\s*/gi, '@')
    .replace(/\s*\(at\)\s*/gi, '@')
    .replace(/\s*\[dot\]\s*/gi, '.')
    .replace(/\s*\(dot\)\s*/gi, '.');

  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const matches = cleaned.match(regex) || [];
  return [...new Set(matches)].map(e => e.toLowerCase());
}

// ---------------------------------------------------------------------------
// Phantombuster API
// ---------------------------------------------------------------------------

/**
 * Fetches the latest output from a Phantombuster agent.
 *
 * Phantombuster agents write their results to an output S3 file.
 * The /agents/fetch-output endpoint returns the URL to that file.
 * We then fetch the JSON from that URL directly.
 *
 * Docs: https://phantombuster.com/api-v2#operation/fetchAgentOutput
 */
async function fetchPhantombusterOutput(agentId) {
  console.log(`Fetching Phantombuster agent output (agent ID: ${agentId})...`);

  // Step 1 - get agent metadata including the output S3 URL
  const metaRes = await fetch(`${PB_BASE}/agents/fetch-output?id=${agentId}`, {
    headers: {
      'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY,
    },
  });

  if (!metaRes.ok) {
    const body = await metaRes.text();
    throw new Error(`Phantombuster agents/fetch-output failed (${metaRes.status}): ${body}`);
  }

  const meta = await metaRes.json();

  // The output field contains log text with S3 URLs for CSV and JSON results
  // Extract the JSON URL from the output text, or fall back to other fields
  let outputUrl = null;
  if (meta.output) {
    const jsonMatch = meta.output.match(/https:\/\/phantombuster\.s3\.amazonaws\.com\/[^\s]+\.json/);
    if (jsonMatch) outputUrl = jsonMatch[0];
  }
  if (!outputUrl) {
    outputUrl =
      meta.outputUrl ||
      (meta.agentStatus && meta.agentStatus.outputFiles && meta.agentStatus.outputFiles[0]) ||
      null;
  }

  if (!outputUrl) {
    console.log('  Raw meta response:', JSON.stringify(meta, null, 2));
    throw new Error(
      'Could not find output URL in Phantombuster response. ' +
      'Make sure the phantom has been launched at least once and has results.'
    );
  }

  console.log(`  Output URL found: ${outputUrl}`);

  // Step 2 - download the actual JSON output
  const dataRes = await fetch(outputUrl);

  if (!dataRes.ok) {
    throw new Error(`Failed to download Phantombuster output file (${dataRes.status})`);
  }

  const contentType = dataRes.headers.get('content-type') || '';
  let data;

  if (contentType.includes('application/json') || outputUrl.endsWith('.json')) {
    data = await dataRes.json();
  } else {
    // Some phantoms write newline-delimited JSON (one object per line)
    const text = await dataRes.text();
    try {
      data = JSON.parse(text);
    } catch {
      // Try NDJSON fallback
      data = text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          try { return JSON.parse(line); } catch { return null; }
        })
        .filter(Boolean);
    }
  }

  // Normalise to array
  if (!Array.isArray(data)) data = [data];

  console.log(`  Downloaded ${data.length} record(s) from Phantombuster`);
  return data;
}

// ---------------------------------------------------------------------------
// Loops API
// ---------------------------------------------------------------------------

/**
 * Creates or updates a Loops contact.
 * Tags the contact with "linkedin_slides_lead" via userGroup.
 * A 409 response means the contact already exists - we continue anyway
 * and still fire the event.
 */
async function createLoopsContact(email, extraProps = {}) {
  const payload = {
    email,
    source: 'linkedin_slides_post',
    userGroup: 'linkedin_slides_lead',
    ...extraProps,
  };

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok && res.status !== 409) {
    throw new Error(
      `Loops contact creation failed for ${email} (${res.status}): ${JSON.stringify(result)}`
    );
  }

  return result;
}

/**
 * Fires the "slides_requested" event in Loops to trigger the giveaway sequence.
 */
async function fireLoopsEvent(email) {
  const res = await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      eventName: 'slides_requested',
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      `Loops event failed for ${email} (${res.status}): ${JSON.stringify(result)}`
    );
  }

  return result;
}

// ---------------------------------------------------------------------------
// Process a single new email
// ---------------------------------------------------------------------------

/**
 * Extracts optional name info from a Phantombuster record to enrich the
 * Loops contact. Fields vary by phantom version - we try common names.
 */
function extractContactProps(record) {
  const props = {};

  const firstName =
    record.firstName ||
    record.firstname ||
    record.first_name ||
    record.profileFirstName ||
    null;

  const lastName =
    record.lastName ||
    record.lastname ||
    record.last_name ||
    record.profileLastName ||
    null;

  if (firstName) props.firstName = firstName;
  if (lastName) props.lastName = lastName;

  return props;
}

async function processEmail(email, contactProps = {}) {
  await createLoopsContact(email, contactProps);
  await fireLoopsEvent(email);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\nPhantombuster -> Loops Slides Giveaway Automation\n');

  // Validate required config
  const missing = [];
  if (!PHANTOMBUSTER_API_KEY) missing.push('PHANTOMBUSTER_API_KEY');
  if (!PHANTOMBUSTER_AGENT_ID) missing.push('PHANTOMBUSTER_AGENT_ID');
  if (!LOOPS_API_KEY) missing.push('LOOPS_API_KEY');

  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    console.error('Set them in .env.local or export them before running.');
    console.error('\nExample .env.local entries:');
    console.error('  PHANTOMBUSTER_API_KEY=your_key_here');
    console.error('  PHANTOMBUSTER_AGENT_ID=1234567890');
    console.error('  LOOPS_API_KEY=737c3b4a0a9bee2e03260a1a2a4c9c85');
    process.exit(1);
  }

  // Step 1 - fetch Phantombuster output
  let records;
  try {
    records = await fetchPhantombusterOutput(PHANTOMBUSTER_AGENT_ID);
  } catch (err) {
    console.error(`\nFailed to fetch Phantombuster output: ${err.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('  - Verify PHANTOMBUSTER_API_KEY is correct (Settings > API in Phantombuster)');
    console.error('  - Verify PHANTOMBUSTER_AGENT_ID matches your "LinkedIn Post Commenters" phantom');
    console.error('  - Make sure the phantom has been launched at least once and completed successfully');
    process.exit(1);
  }

  // Step 2 - extract emails from comment text
  // Phantombuster "LinkedIn Post Commenters" uses the "comment" field,
  // but we also check common alternative field names for robustness.
  const emailToRecord = new Map();

  for (const record of records) {
    const commentText =
      record.comments ||
      record.comment ||
      record.commentText ||
      record.text ||
      record.content ||
      record.message ||
      '';

    const foundEmails = extractEmails(commentText);

    for (const email of foundEmails) {
      // Keep the first record we saw for each email (earliest comment)
      if (!emailToRecord.has(email)) {
        emailToRecord.set(email, record);
      }
    }
  }

  const totalFound = emailToRecord.size;
  console.log(`\nExtracted ${totalFound} unique email(s) from ${records.length} comment(s)`);

  if (totalFound === 0) {
    console.log(
      '  No emails found in comments.\n' +
      '  People may not have commented their email addresses yet, or the phantom\n' +
      '  output uses a different field name. Check the raw output file URL above.'
    );
    return;
  }

  // Step 3 - deduplicate against local log
  const sentEmails = loadSentEmails();
  const sentSet = new Set(sentEmails);
  const newEmails = [...emailToRecord.keys()].filter(e => !sentSet.has(e));

  console.log(`  Already processed: ${sentEmails.length}`);
  console.log(`  New to process:    ${newEmails.length}\n`);

  if (newEmails.length === 0) {
    console.log('All caught up - no new emails to process.');
    return;
  }

  // Step 4 - create Loops contacts and fire slides_requested events
  let processed = 0;
  let failed = 0;
  const failedEmails = [];

  for (const email of newEmails) {
    const record = emailToRecord.get(email);
    const contactProps = extractContactProps(record);

    try {
      await processEmail(email, contactProps);
      sentEmails.push(email);
      processed++;

      const nameStr = contactProps.firstName
        ? ` (${contactProps.firstName}${contactProps.lastName ? ' ' + contactProps.lastName : ''})`
        : '';
      console.log(`  OK  ${email}${nameStr}`);

      // Small delay to stay within Loops rate limits (100 req/s)
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      failed++;
      failedEmails.push(email);
      console.error(`  ERR ${email} - ${err.message}`);
    }
  }

  // Step 5 - persist updated log (only emails that succeeded)
  saveSentEmails(sentEmails);

  // Summary
  console.log('\n---');
  console.log(`Processed:  ${processed}`);
  console.log(`Failed:     ${failed}`);
  if (failed > 0) {
    console.log(`Failed emails: ${failedEmails.join(', ')}`);
    console.log('Failed emails were NOT added to the log - they will be retried on next run.');
  }
  console.log(`Total processed all-time: ${sentEmails.length}`);
  console.log('\nDone. Run again later to catch new comments.\n');
}

main().catch(err => {
  console.error('\nUnexpected error:', err);
  process.exit(1);
});
