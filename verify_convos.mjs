import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://cidnbhphbmwvbozdxqhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Check conversations
const { data: convos } = await supabase.from('conversations').select('id, student_id, coach_id');
console.log('Conversations:', JSON.stringify(convos, null, 2));

// Check the activestudent user ID
const { data: users } = await supabase.from('users').select('id, email, type').eq('email', 'activestudent@earlyedge.co.uk');
console.log('\nActive student:', JSON.stringify(users, null, 2));

// Check coaches
const { data: coaches } = await supabase.from('coaches').select('id, user_id').limit(3);
console.log('\nCoaches:', JSON.stringify(coaches, null, 2));

// Messages
const { data: msgs } = await supabase.from('messages').select('id, conversation_id, content').limit(5);
console.log('\nMessages:', JSON.stringify(msgs, null, 2));
