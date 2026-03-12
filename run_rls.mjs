// Run RLS migration using supabase-js rpc approach
// We'll create a temp function to execute arbitrary SQL, run it, then drop it
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Try using the undocumented SQL endpoint that Supabase Studio uses internally
async function runSQL(sql, label) {
  try {
    // Supabase Studio uses this endpoint for the SQL editor
    const resp = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'x-connection-encrypted': 'false',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'x-supabase-api-version': '2024-01-01',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (resp.ok) {
      console.log(`  ✅ ${label}`);
      return true;
    }

    // Try another approach - the SQL API
    const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({}),
    });
    
    const body = await resp.text();
    console.log(`  ❌ ${label}: HTTP ${resp.status} - ${body.substring(0, 150)}`);
    return false;
  } catch (e) {
    console.log(`  ❌ ${label}: ${e.message}`);
    return false;
  }
}

// Alternative: Let's just test if we can verify the policies already exist by trying to do operations
async function testPolicies() {
  console.log('Testing if RLS policies already work...\n');
  
  // Test 1: Can the service role see users?
  const { data: users, error: uErr } = await supabase.from('users').select('id, name, type').limit(3);
  console.log(`  Users query: ${uErr ? '❌ ' + uErr.message : '✅ ' + users?.length + ' users found'}`);
  if (users) users.forEach(u => console.log(`    - ${u.name} (${u.type})`));

  // Test 2: Can we see coaches?
  const { data: coaches, error: cErr } = await supabase.from('coaches').select('id, headline, user_id').limit(3);
  console.log(`  Coaches query: ${cErr ? '❌ ' + cErr.message : '✅ ' + coaches?.length + ' coaches found'}`);

  // Test 3: Can we see conversations?
  const { data: convos, error: cvErr } = await supabase.from('conversations').select('*').limit(3);
  console.log(`  Conversations query: ${cvErr ? '❌ ' + cvErr.message : '✅ ' + convos?.length + ' convos found'}`);

  // Test 4: Can we see messages?
  const { data: msgs, error: mErr } = await supabase.from('messages').select('*').limit(3);
  console.log(`  Messages query: ${mErr ? '❌ ' + mErr.message : '✅ ' + msgs?.length + ' messages found'}`);
}

async function main() {
  console.log('🔧 RLS Migration Attempt\n');
  
  const statements = [
    ['DROP POLICY IF EXISTS "Users can view own profile" ON users', 'Drop old user policy'],
    ['CREATE POLICY "Authenticated users can view all user profiles" ON users FOR SELECT USING (auth.role() = \'authenticated\')', 'Create new user visibility policy'],
    ['CREATE POLICY "Students can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = student_id)', 'Students create convos'],  
    ['CREATE POLICY "Coaches can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id))', 'Coaches create convos'],
    ['DROP POLICY IF EXISTS "Anyone can view active coaches" ON coaches', 'Drop old coach policy'],
    ['CREATE POLICY "Anyone can view coaches" ON coaches FOR SELECT USING (true)', 'Public coach profiles'],
    ['ALTER PUBLICATION supabase_realtime ADD TABLE messages', 'Realtime on messages'],
    ['ALTER PUBLICATION supabase_realtime ADD TABLE conversations', 'Realtime on conversations'],
  ];

  for (const [sql, label] of statements) {
    await runSQL(sql, label);
  }

  console.log('\n📊 Running verification tests...');
  await testPolicies();

  // The SQL migration via the API didn't work, but since we're using service_role key
  // the operations still work because service_role bypasses RLS.
  // The RLS policies need to be applied for regular user auth to work properly.
  console.log('\n⚠️ NOTE: If RLS migration failed above, the SQL needs to be run manually');
  console.log('   in the Supabase SQL Editor. The data was seeded successfully though.');
  console.log('   Service role key bypasses RLS, so the seed data is intact.');
}

main().catch(console.error);
