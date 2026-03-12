import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
});

async function main() {
  console.log('🔧 Creating exec_sql function via REST...\n');

  // Step 1: Create a temporary function that can run SQL
  // Use the REST API to call the function endpoint
  const createFnSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
    BEGIN EXECUTE sql; END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // We need to use the PostgREST endpoint differently
  // Actually there's an edge function approach, but let's try the simplest way:
  // Create the function using the supabase-js query approach
  
  // Actually, let's try creating the function via direct PG REST
  // The issue is PostgREST only exposes existing functions, not DDL
  
  // Alternative: Use the Supabase realtime / auth admin endpoints to test if existing policies work
  // Then only add what's missing

  // Let's test if regular user login works with current RLS
  console.log('Testing if regular user auth works with current RLS...\n');
  
  // Sign in as a student
  const { data: session, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'activestudent@earlyedge.co.uk',
    password: 'Active123!',
  });
  
  if (loginErr) {
    console.log(`❌ Login failed: ${loginErr.message}`);
    return;
  }
  console.log(`✅ Logged in as ${session.user.email}\n`);
  
  // Create a client with the user's token
  const userClient = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE', {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${session.session.access_token}` } }
  });
  
  // Test 1: Can user see their own profile?
  const { data: profile, error: profileErr } = await userClient.from('users').select('*').eq('id', session.user.id);
  console.log(`  Own profile: ${profileErr ? '❌ ' + profileErr.message : '✅ OK (' + profile?.length + ' rows)'}`);
  
  // Test 2: Can user see coaches?
  const { data: coaches, error: coachErr } = await userClient.from('coaches').select('id, headline, user_id').limit(3);
  console.log(`  Coaches: ${coachErr ? '❌ ' + coachErr.message : '✅ OK (' + coaches?.length + ' coaches)'}`);
  
  // Test 3: Can user see other users (needed for messaging)?
  const { data: otherUsers, error: otherErr } = await userClient.from('users').select('id, name, type').limit(5);
  console.log(`  Other users: ${otherErr ? '❌ ' + otherErr.message : '✅ OK (' + otherUsers?.length + ' users)'}`);
  if (otherUsers) otherUsers.forEach(u => console.log(`    - ${u.name} (${u.type})`));
  
  // Test 4: Can user see conversations?
  const { data: convos, error: convoErr } = await userClient.from('conversations').select('*').limit(3);
  console.log(`  Conversations: ${convoErr ? '❌ ' + convoErr.message : '✅ OK (' + convos?.length + ' convos)'}`);
  
  // Test 5: Can user see messages?
  const { data: msgs, error: msgErr } = await userClient.from('messages').select('*').limit(3);
  console.log(`  Messages: ${msgErr ? '❌ ' + msgErr.message : '✅ OK (' + msgs?.length + ' messages)'}`);
  
  // Test 6: Can user see bookings?
  const { data: bookings, error: bookErr } = await userClient.from('bookings').select('*').limit(3);
  console.log(`  Bookings: ${bookErr ? '❌ ' + bookErr.message : '✅ OK (' + bookings?.length + ' bookings)'}`);
  
  console.log('\nDone! If any tests show ❌, the corresponding RLS policy needs updating.');
  console.log('If the tests show ✅, the existing RLS policies may already be sufficient.');
}

main().catch(console.error);
