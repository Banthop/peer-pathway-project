#!/usr/bin/env node
/**
 * Audit CRM for gaps: people who commented on LinkedIn but were never emailed,
 * contacts with no campaign tags, buyers without confirmations, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  console.log('Loading CRM contacts...');
  const { data: contacts, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('DB error:', error.message); process.exit(1); }
  console.log(`Loaded ${contacts.length} contacts\n`);

  const crmEmails = new Set(contacts.map(c => c.email?.toLowerCase()).filter(Boolean));

  // 1) LinkedIn commenters NOT in CRM
  let scraped = [];
  try {
    scraped = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scraped-post1-comments.json'), 'utf-8'));
  } catch {}
  const notInCrm = scraped.filter(s => !crmEmails.has(s.email?.toLowerCase()));

  console.log('='.repeat(60));
  console.log('LINKEDIN COMMENTERS NOT IN CRM');
  console.log('='.repeat(60));
  console.log(`Total scraped: ${scraped.length} | Not in CRM: ${notInCrm.length}`);
  for (const p of notInCrm) {
    console.log(`  ${(p.name || '?').padEnd(35)} <${p.email}>`);
  }

  // 2) CRM contacts who have NEVER received any campaign email
  const campaignTags = [
    'final_push_buyer','final_push_hot','final_push_cold','final_push_fresh','final_push_upsell',
    'last_day_hot','last_day_form','last_day_clicker','last_day_reengage','last_day_upsell',
    'funnel_email_2','funnel_email_3','funnel_email_4',
    'linkedin_emailed','email_sent','email_delivered','confirmation_sent','discount_sent',
    'guide_upsell_sent','final_push_campaign','last_day_campaign',
  ];
  const neverEmailed = contacts.filter(c => {
    const tags = c.tags || [];
    return !campaignTags.some(t => tags.includes(t)) && !tags.includes('bounced');
  });

  console.log('\n' + '='.repeat(60));
  console.log('CRM CONTACTS NEVER EMAILED (excluding bounced)');
  console.log('='.repeat(60));
  console.log(`Count: ${neverEmailed.length}`);
  for (const c of neverEmailed.slice(0, 50)) {
    const name = ((c.first_name || '?') + ' ' + (c.last_name || '')).trim();
    console.log(`  ${name.padEnd(30)} <${c.email}>  tags:[${(c.tags||[]).join(',')}]  src:${c.source || '?'}`);
  }
  if (neverEmailed.length > 50) console.log(`  ... and ${neverEmailed.length - 50} more`);

  // 3) Tag breakdown
  console.log('\n' + '='.repeat(60));
  console.log('TAG BREAKDOWN');
  console.log('='.repeat(60));
  const tagCounts = {};
  for (const c of contacts) for (const t of (c.tags || [])) tagCounts[t] = (tagCounts[t] || 0) + 1;
  for (const [t, n] of Object.entries(tagCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(35)} ${n}`);
  }

  // 4) Source breakdown
  console.log('\n' + '='.repeat(60));
  console.log('SOURCE BREAKDOWN');
  console.log('='.repeat(60));
  const srcCounts = {};
  for (const c of contacts) srcCounts[c.source || 'unknown'] = (srcCounts[c.source || 'unknown'] || 0) + 1;
  for (const [s, n] of Object.entries(srcCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${s.padEnd(35)} ${n}`);
  }

  // 5) Buyers without confirmation
  const buyersNoConfirm = contacts.filter(c =>
    (c.tags||[]).includes('stripe_customer') && !(c.tags||[]).includes('confirmation_sent')
  );
  console.log('\n' + '='.repeat(60));
  console.log('BUYERS WITHOUT CONFIRMATION EMAIL');
  console.log('='.repeat(60));
  console.log(`Count: ${buyersNoConfirm.length}`);
  for (const c of buyersNoConfirm) {
    const name = ((c.first_name || '?') + ' ' + (c.last_name || '')).trim();
    console.log(`  ${name.padEnd(30)} <${c.email}>`);
  }

  // 6) Status breakdown
  console.log('\n' + '='.repeat(60));
  console.log('STATUS BREAKDOWN');
  console.log('='.repeat(60));
  const statCounts = {};
  for (const c of contacts) statCounts[c.status || 'null'] = (statCounts[c.status || 'null'] || 0) + 1;
  for (const [s, n] of Object.entries(statCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${s.padEnd(25)} ${n}`);
  }

  // Summary of actionable gaps
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY OF ACTIONABLE GAPS');
  console.log('='.repeat(60));
  console.log(`  LinkedIn commenters NOT in CRM:   ${notInCrm.length}`);
  console.log(`  CRM contacts never emailed:       ${neverEmailed.length}`);
  console.log(`  Buyers without confirmation:      ${buyersNoConfirm.length}`);
  console.log(`  Total CRM contacts:               ${contacts.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
