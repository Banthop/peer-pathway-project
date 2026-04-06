/**
 * Create a demo account with RECORDING-ONLY access (no guide/bundle).
 * Email: demoupgrade@gmail.com / Password: Demo123!
 * This user has `stripe_customer` + `recording_access` tags but NOT `bundle`.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const SUPABASE_URL = env['VITE_SUPABASE_URL'];
const SUPABASE_KEY = env['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EMAIL = 'demoupgrade@gmail.com';
const PASSWORD = 'Demo123!';
const TAGS = ['stripe_customer', 'recording_access'];

async function main() {
  console.log(`\n🚀 Creating demo upgrade account: ${EMAIL}\n`);

  // 1. Create auth account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: EMAIL,
    password: PASSWORD,
    options: {
      data: { name: 'Demo Upgrade', role: 'student' }
    }
  });

  if (authError && !authError.message.includes('already registered')) {
    console.error(`  ❌ Auth error: ${authError.message}`);
  } else {
    console.log(`  ✅ Auth account created (or already exists)`);
  }

  // 2. Upsert CRM contact with recording-only access (NO bundle tag)
  const { data: existing } = await supabase
    .from('crm_contacts')
    .select('id, tags')
    .eq('email', EMAIL)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('crm_contacts')
      .update({
        tags: TAGS,
        status: 'converted',
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`  ❌ CRM update failed: ${error.message}`);
    } else {
      console.log(`  ✅ CRM contact updated with recording-only tags`);
    }
  } else {
    const { error } = await supabase.from('crm_contacts').insert({
      email: EMAIL,
      first_name: 'Demo',
      last_name: 'Upgrade',
      tags: TAGS,
      status: 'converted',
      source: 'other',
      source_detail: 'Demo account - recording only access',
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  ❌ CRM insert failed: ${error.message}`);
    } else {
      console.log(`  ✅ CRM contact created with recording-only tags`);
    }
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`  Access:   Recording ONLY (no guide/bundle)`);
  console.log(`  Tags:     ${TAGS.join(', ')}`);
  console.log(`════════════════════════════════════════\n`);
}

main().catch(console.error);
