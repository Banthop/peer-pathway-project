/**
 * Add portal access for a batch of emails.
 * Inserts/upserts into crm_contacts with stripe_customer + bundle tags
 * so they can sign up at /portal and access guide + webinar.
 *
 * Usage:  node scripts/add-portal-users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const SUPABASE_URL = env['VITE_SUPABASE_URL'];
const SUPABASE_KEY = env['VITE_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Emails to provision ──────────────────────────────────────
const users = [
  { email: 't.gangwani@lse.ac.uk',       firstName: 'T',      lastName: 'Gangwani' },
  { email: 'd.gupta27@lse.ac.uk',        firstName: 'D',      lastName: 'Gupta' },
  { email: 'r.mittal13@lse.ac.uk',       firstName: 'R',      lastName: 'Mittal' },
  { email: 'r.bali1@lse.ac.uk',          firstName: 'R',      lastName: 'Bali' },
  { email: 'a.nabera@lse.ac.uk',         firstName: 'A',      lastName: 'Nabera' },
  { email: 'a.olalere@lse.ac.uk',        firstName: 'A',      lastName: 'Olalere' },
  { email: 'a.khokha@lse.ac.uk',         firstName: 'A',      lastName: 'Khokha' },
  { email: 'a.s.bal@lse.ac.uk',          firstName: 'AS',     lastName: 'Bal' },
  { email: 'b.s.popli@lse.ac.uk',        firstName: 'BS',     lastName: 'Popli' },
  { email: 'e.c.paheerathan@lse.ac.uk',  firstName: 'EC',     lastName: 'Paheerathan' },
  { email: 'r.relhan@lse.ac.uk',         firstName: 'R',      lastName: 'Relhan' },
  { email: 'simonafeworki31@gmail.com',   firstName: 'Simon',  lastName: 'Afeworki' },
  { email: 'exi548@student.bham.ac.uk',  firstName: 'Student', lastName: 'Bham' },
  { email: 'v.g.chummun@lse.ac.uk',      firstName: 'VG',     lastName: 'Chummun' },
  { email: 'a.s.bisram@lse.ac.uk',       firstName: 'AS',     lastName: 'Bisram' },
  { email: 'joshdhariwal@gmail.com',      firstName: 'Josh',   lastName: 'Dhariwal' },
  { email: 'chummunkartik@gmail.com',     firstName: 'Kartik', lastName: 'Chummun' },
  { email: 'karuneshchu@gmail.com',       firstName: 'Karunesh', lastName: 'Chu' },
  { email: '07bilal.afzal@gmail.com',     firstName: 'Bilal',  lastName: 'Afzal' },
  { email: 'harii.nemal@gmail.com',       firstName: 'Harii',  lastName: 'Nemal' },
];

const TAGS = ['stripe_customer', 'bundle', 'portal_access'];

async function main() {
  console.log(`\n🚀 Adding ${users.length} users to crm_contacts with guide + webinar access...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const u of users) {
    const emailKey = u.email.toLowerCase().trim();

    // Check if already exists
    const { data: existing } = await supabase
      .from('crm_contacts')
      .select('id, email, tags')
      .eq('email', emailKey)
      .maybeSingle();

    if (existing) {
      // Update tags to include bundle + stripe_customer
      const currentTags = (existing.tags || []);
      const newTags = [...new Set([...currentTags, ...TAGS])];
      const { error } = await supabase
        .from('crm_contacts')
        .update({ tags: newTags, status: 'converted', last_activity_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) {
        console.error(`  ❌ ${emailKey}: failed to update — ${error.message}`);
        failed++;
      } else {
        console.log(`  🔄 ${emailKey}: updated tags (already existed)`);
        skipped++;
      }
      continue;
    }

    // Insert new
    const { error } = await supabase.from('crm_contacts').insert({
      email: emailKey,
      first_name: u.firstName,
      last_name: u.lastName,
      tags: TAGS,
      status: 'converted',
      source: 'other',
      source_detail: 'Manual grant — guide + webinar access',
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  ❌ ${emailKey}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅ ${emailKey}: added with guide + webinar access`);
      success++;
    }
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Done! ${success} new, ${skipped} updated, ${failed} failed`);
  console.log(`════════════════════════════════════════\n`);
}

main().catch(console.error);
