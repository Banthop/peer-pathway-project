import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://cidnbhphbmwvbozdxqhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// All coaches
const { data: coaches, error: ce } = await s.from('coaches').select('id, user_id, headline, categories, user:users!inner(name, email)');
if (ce) { console.log('Coach error:', ce); process.exit(1); }
console.log('=== ALL COACHES ===');
for (const c of coaches) {
  console.log(`  ${c.id}  ${c.user.name}  ${c.user.email}  headline="${c.headline}"`);
}

// All conversations
const { data: convos } = await s.from('conversations').select('id, coach_id, student_id');
console.log('\n=== ALL CONVERSATIONS ===');
for (const c of convos) {
  const coach = coaches.find(x => x.id === c.coach_id);
  console.log(`  ${c.id}  coach=${coach?.user?.name ?? c.coach_id}  student=${c.student_id}`);
}

// Check Marcus specifically
const marcus = coaches.find(c => c.user.name === 'Marcus D.');
if (marcus) {
  console.log('\n=== MARCUS ===');
  console.log('Coach ID:', marcus.id);
  console.log('User ID:', marcus.user_id);
  const marcusConvos = convos.filter(c => c.coach_id === marcus.id);
  console.log('Marcus conversations:', marcusConvos.length);
}

// Active student user
const { data: students } = await s.from('users').select('id, name, email').eq('type', 'student');
console.log('\n=== STUDENTS ===');
for (const st of students) {
  console.log(`  ${st.id}  ${st.name}  ${st.email}`);
}
