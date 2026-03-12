import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://cidnbhphbmwvbozdxqhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Get auth user IDs
const { data } = await supabase.auth.admin.listUsers();
const relevant = data.users.filter(u => ['activestudent@earlyedge.co.uk', 'sarah@earlyedge.co.uk'].includes(u.email));
relevant.forEach(u => console.log(`Auth: ${u.email} → ID: ${u.id}`));

// Compare with users table
for (const u of relevant) {
  const { data: row } = await supabase.from('users').select('id, email').eq('email', u.email).single();
  console.log(`  DB:  ${row?.email} → ID: ${row?.id} (match: ${row?.id === u.id})`);
}
