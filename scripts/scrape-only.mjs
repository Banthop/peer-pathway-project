import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
const content = fs.readFileSync(envPath, 'utf-8');
for (const line of content.split('\n')) {
  const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
  if (match) process.env[match[1]] = process.env[match[1]] || match[2];
}

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const POST_URL = process.env.LINKEDIN_POST_URL;

function extractEmails(text) {
  if (!text) return [];
  const cleaned = text
    .replace(/\s*\[at\]\s*/gi, '@')
    .replace(/\s*\(at\)\s*/gi, '@')
    .replace(/\s*\[dot\]\s*/gi, '.')
    .replace(/\s*\(dot\)\s*/gi, '.');
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(cleaned.match(regex) || [])].map(e => e.toLowerCase());
}

console.log('\n📡 Scraping LinkedIn comments (scrape only, no sending)...\n');
console.log(`Post: ${POST_URL}\n`);

const postIdMatch = POST_URL.match(/activity-(\d+)/);
if (!postIdMatch) { console.error('Could not extract post ID'); process.exit(1); }
const postId = postIdMatch[1];

// Try the original actor with different combos to get more comments
const actorId = 'apimaestro~linkedin-post-comments-replies-engagements-scraper-no-cookies';
const runUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=600`;

// Run with includeReplies to also get nested replies
const response = await fetch(runUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    postIds: [postId],
    maxComments: 10000,
    includeReplies: true,
    sortBy: "RELEVANCE",
  }),
});

if (!response.ok) {
  console.error('❌ Apify failed:', await response.text());
  process.exit(1);
}

const data = await response.json();
console.log(`Found ${data.length} comment(s) from Apify (attempt 1 - RELEVANCE)\n`);

// Run again sorted by RECENCY to catch different comments
const response2 = await fetch(runUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    postIds: [postId],
    maxComments: 10000,
    includeReplies: true,
    sortBy: "RECENT",
  }),
});

let data2 = [];
if (response2.ok) {
  data2 = await response2.json();
  console.log(`Found ${data2.length} comment(s) from Apify (attempt 2 - RECENT)\n`);
}

// Combine both runs
const allComments = [...data, ...data2];
console.log(`Combined: ${allComments.length} total comment objects\n`);

const allEmails = new Set();
for (const comment of allComments) {
  const text = comment.text || comment.comment || comment.commentText || comment.content || '';
  extractEmails(text).forEach(e => allEmails.add(e));
}

// Load already sent
const sentPath = path.join(__dirname, '..', 'linkedin-sent-emails.json');
let sentEmails = [];
try { sentEmails = JSON.parse(fs.readFileSync(sentPath, 'utf-8')); } catch {}
const sentSet = new Set(sentEmails);

const allList = [...allEmails];
const newEmails = allList.filter(e => !sentSet.has(e));

console.log(`📧 Total unique emails found: ${allList.length}`);
console.log(`   Already sent to: ${sentEmails.length}`);
console.log(`   New (unsent):    ${newEmails.length}\n`);

if (newEmails.length > 0) {
  console.log('New emails to send:');
  newEmails.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
}

// Save full list
const outputPath = path.join(__dirname, '..', 'linkedin-scraped-emails.json');
fs.writeFileSync(outputPath, JSON.stringify({ total: allList.length, alreadySent: sentEmails.length, newToSend: newEmails.length, allEmails: allList, newEmails }, null, 2));
console.log(`\n💾 Full list saved to linkedin-scraped-emails.json`);
console.log('✅ Done (no emails were sent)\n');
