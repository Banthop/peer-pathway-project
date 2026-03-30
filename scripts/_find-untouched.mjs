#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnv() {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnv();

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const { data, error } = await sb.from('crm_contacts').select('id,email,first_name,last_name,tags,status,created_at,last_activity_at').order('created_at', { ascending: false });
if (error) { console.error(error); process.exit(1); }

// Everyone who started form or is form_lead, never bought, never got any follow-up discount/abandon email
const allFormNotBought = data.filter(c => {
  const tags = c.tags || [];
  const startedForm = tags.includes('form_started') || tags.includes('form_lead');
  const bought = tags.includes('stripe_customer') || c.status === 'converted';
  return startedForm && !bought;
});

const neverEmailed = allFormNotBought.filter(c => {
  const tags = c.tags || [];
  const gotEmail = tags.includes('abandon_email_sent') || tags.includes('discount_sent') || tags.includes('funnel_email_4') || tags.includes('clicker_discount_sent');
  return !gotEmail;
});

const alreadyEmailed = allFormNotBought.filter(c => {
  const tags = c.tags || [];
  return tags.includes('abandon_email_sent') || tags.includes('discount_sent') || tags.includes('funnel_email_4') || tags.includes('clicker_discount_sent');
});

console.log(`\n=== FORM LEADS WHO NEVER BOUGHT ===`);
console.log(`Total: ${allFormNotBought.length}`);
console.log(`  Never got ANY follow-up email: ${neverEmailed.length}`);
console.log(`  Already emailed (but didn't buy): ${alreadyEmailed.length}`);

console.log(`\n--- NEVER EMAILED (${neverEmailed.length}) ---`);
for (const c of neverEmailed) {
  console.log(`  ${c.email} | ${c.first_name || '?'} | tags: ${(c.tags||[]).join(', ')} | created: ${c.created_at}`);
}

console.log(`\n--- ALREADY EMAILED BUT DIDNT BUY (${alreadyEmailed.length}) ---`);
for (const c of alreadyEmailed) {
  console.log(`  ${c.email} | ${c.first_name || '?'} | tags: ${(c.tags||[]).join(', ')} | created: ${c.created_at}`);
}

console.log(`\n=== GRAND TOTAL TO BLAST: ${allFormNotBought.length} form leads who never converted ===`);
