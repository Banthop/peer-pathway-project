/**
 * Full setup: run SQL migration via Management API and seed all accounts.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MTA5MSwiZXhwIjoyMDg2MzU3MDkxfQ.nSvsldDpweslO99FUNSg5cicoQgmNzKyah0sdz7BeUo';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ── Run SQL Statements via Management API ──
async function runSQL(sql, label) {
  try {
    const resp = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (resp.ok) {
      console.log(`  ✅ ${label}`);
      return true;
    }
    
    const body = await resp.text();
    if (body.includes('already exists') || body.includes('42710') || body.includes('42P07')) {
      console.log(`  ⚠️ ${label} (already exists - OK)`);
      return true;
    }
    console.log(`  ❌ ${label}: ${body.substring(0, 200)}`);
    return false;
  } catch (e) {
    console.log(`  ❌ ${label}: ${e.message}`);
    return false;
  }
}

// ── Main ──
async function main() {
  console.log('🚀 EarlyEdge Full Setup\n');

  // Step 1: Run RLS Migration
  console.log('📋 Running RLS migration...');
  
  const sqlStatements = [
    ['DROP POLICY IF EXISTS "Users can view own profile" ON users', 'Drop old user policy'],
    ['CREATE POLICY "Authenticated users can view all user profiles" ON users FOR SELECT USING (auth.role() = \'authenticated\')', 'Create new user visibility policy'],
    ['CREATE POLICY "Students can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = student_id)', 'Students can create conversations'],
    ['CREATE POLICY "Coaches can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id))', 'Coaches can create conversations'],
    ['DROP POLICY IF EXISTS "Anyone can view active coaches" ON coaches', 'Drop old coach policy'],
    ['CREATE POLICY "Anyone can view coaches" ON coaches FOR SELECT USING (true)', 'Anyone can view coaches'],
    ['ALTER PUBLICATION supabase_realtime ADD TABLE messages', 'Enable Realtime on messages'],
    ['ALTER PUBLICATION supabase_realtime ADD TABLE conversations', 'Enable Realtime on conversations'],
  ];

  for (const [sql, label] of sqlStatements) {
    await runSQL(sql, label);
  }

  // Step 2: Create Accounts
  console.log('\n📋 Creating coach accounts...');
  
  const coaches = [
    { email: 'sarah@earlyedge.co.uk', password: 'Sarah123!', name: 'Sarah K.', slug: 'sarah-k',
      bio: "I'm Sarah, an incoming IB Analyst at Goldman Sachs and recent Oxford PPE graduate.",
      full_bio: "I'm Sarah, an incoming Investment Banking Analyst at Goldman Sachs and recent Oxford PPE graduate. Having navigated the competitive world of finance recruiting myself, I understand exactly what it takes to stand out.\n\nMy approach focuses on practical, actionable guidance. I've helped over 15 students secure offers at firms including Goldman Sachs, Morgan Stanley, JP Morgan, and Barclays.",
      headline: 'Goldman Sachs Incoming Analyst', university: 'University of Oxford',
      categories: ['Investment Banking', 'Spring Week', 'CV Review', 'Interview Prep', 'Cover Letters', 'Assessment Centres'],
      hourly_rate: 5000, total_sessions: 63,
      services: [
        { name: 'CV & Cover Letter Review', duration: 45, price: 4000, description: 'Detailed feedback on your application materials' },
        { name: 'Mock Interview', duration: 60, price: 6000, description: 'Realistic interview practice with feedback' },
        { name: 'Application Strategy', duration: 45, price: 4500, description: 'Personalised guidance on firm selection and timeline' },
      ],
      package: { name: 'IB Application Sprint', session_count: 4, price: 15000, description: 'CV Review, Mock Interview, Strategy, Cover Letters' },
    },
    { email: 'david@earlyedge.co.uk', password: 'David123!', name: 'David W.', slug: 'david-w',
      bio: "Summer Associate at McKinsey & Company, Cambridge Economics graduate.",
      full_bio: "Hi, I'm David! I'm a Summer Associate at McKinsey & Company and Cambridge Economics graduate. I'm passionate about helping aspiring consultants crack the case and land offers at MBB.",
      headline: 'McKinsey Summer Associate', university: 'University of Cambridge',
      categories: ['Consulting', 'Case Studies', 'Strategy', 'Fit Interviews', 'Problem Solving'],
      hourly_rate: 6000, total_sessions: 48,
      services: [
        { name: 'Case Interview Prep', duration: 60, price: 6500, description: 'Practice cases with real-time feedback' },
        { name: 'Fit Interview Coaching', duration: 45, price: 5000, description: 'Craft your story and nail behavioural questions' },
        { name: 'Application Review', duration: 45, price: 5500, description: 'Review and strengthen your consulting applications' },
      ],
      package: { name: 'MBB Case Prep Bundle', session_count: 5, price: 27500, description: 'Case Prep, Fit Interview, Application Review, Mock' },
    },
    { email: 'emily@earlyedge.co.uk', password: 'Emily123!', name: 'Emily R.', slug: 'emily-r',
      bio: "Trainee solicitor at Clifford Chance starting September 2025.",
      full_bio: "I'm a trainee solicitor at Clifford Chance. During my time at LSE, I secured vacation schemes at Clifford Chance, Linklaters, Freshfields, and Slaughter and May.",
      headline: 'Clifford Chance Trainee Solicitor', university: 'London School of Economics',
      categories: ['Law', 'Training Contracts', 'Vac Schemes', 'Commercial Awareness', 'Watson Glaser', 'LNAT'],
      hourly_rate: 4500, total_sessions: 34,
      services: [
        { name: 'TC Application Review', duration: 45, price: 4000, description: 'Detailed review of your training contract applications' },
        { name: 'Commercial Awareness Bootcamp', duration: 60, price: 5000, description: 'Intensive session on current commercial topics' },
        { name: 'Mock Vac Scheme Interview', duration: 60, price: 5000, description: 'Realistic mock interview for magic circle assessment' },
      ],
    },
    { email: 'james@earlyedge.co.uk', password: 'James123!', name: 'James L.', slug: 'james-l',
      bio: "Software Engineer at Meta, Imperial College London graduate.",
      full_bio: "I graduated from Imperial in 2022 with a First in Computer Science, working at Meta London since. Went through the full interview loop at Meta, Google, Amazon.",
      headline: 'Meta Software Engineer', university: 'Imperial College London',
      categories: ['Software Engineering', 'LeetCode', 'System Design', 'Data Structures', 'Algorithms', 'Coding Interviews'],
      hourly_rate: 5500, total_sessions: 52,
      services: [
        { name: 'Algorithm & Data Structures', duration: 60, price: 5500, description: 'Practice coding problems with live feedback' },
        { name: 'System Design Interview', duration: 60, price: 6500, description: 'Design scalable systems for FAANG interviews' },
        { name: 'Full Mock Interview', duration: 60, price: 6000, description: 'End-to-end mock FAANG interview with scoring' },
      ],
      package: { name: 'Tech Interview Prep', session_count: 5, price: 22500, description: 'Algorithms, System Design, Mock Interviews' },
    },
    { email: 'priya@earlyedge.co.uk', password: 'Priya123!', name: 'Priya M.', slug: 'priya-m',
      bio: "First-year medical student at UCL with UCAT score 3150 (top 2%).",
      full_bio: "I scored 3150 on the UCAT (top 2%) and received offers from UCL, King's, Bristol, and Leeds.",
      headline: 'UCAT Score 3150 · UCL Medicine', university: 'University College London',
      categories: ['UCAT', 'Medicine', 'MMI Interviews', 'Personal Statements', 'BMAT'],
      hourly_rate: 4000, total_sessions: 28,
      services: [
        { name: 'UCAT Strategy Session', duration: 60, price: 4000, description: 'Section-specific strategies for timing and scoring' },
        { name: 'UCAT Practice & Review', duration: 45, price: 3500, description: 'Timed practice with detailed review' },
        { name: 'Med School Application Review', duration: 45, price: 4000, description: 'Review personal statement and plan selection' },
      ],
      package: { name: 'UCAT Score Boost', session_count: 5, price: 17500, description: 'Diagnostic, all sections, full mock' },
    },
    { email: 'tom@earlyedge.co.uk', password: 'Tom123!', name: 'Tom H.', slug: 'tom-h',
      bio: "Oxford PPE graduate, first-generation Oxbridge student.",
      full_bio: "I read PPE at Oxford and was the first in my family to apply to Oxbridge. I've helped 8 students get offers across PPE, Economics, History, and English.",
      headline: "Oxford PPE '24", university: 'University of Oxford',
      categories: ['Oxbridge', 'Personal Statements', 'Interview Prep', 'PPE', 'TSA'],
      hourly_rate: 5500, total_sessions: 41,
      services: [
        { name: 'Personal Statement Review', duration: 60, price: 5000, description: 'In-depth review of your Oxbridge personal statement' },
        { name: 'Mock Oxbridge Interview', duration: 60, price: 5500, description: 'Realistic tutorial-style mock interview' },
        { name: 'Application Strategy', duration: 45, price: 4500, description: 'College selection and Oxbridge strategy' },
      ],
    },
    { email: 'aisha@earlyedge.co.uk', password: 'Aisha123!', name: 'Aisha N.', slug: 'aisha-n',
      bio: "Landed JPM Spring Week through cold emailing, zero connections.",
      full_bio: "Second-year Economics student at Warwick. Landed J.P. Morgan Spring Week entirely through cold emailing and networking.",
      headline: "J.P. Morgan Spring Week '24", university: 'University of Warwick',
      categories: ['Investment Banking', 'Cold Emailing', 'Networking', 'Spring Week'],
      hourly_rate: 3500, total_sessions: 18,
      services: [
        { name: 'Cold Email Workshop', duration: 45, price: 3000, description: 'Learn my proven template for cold emailing bankers' },
        { name: 'Networking Strategy', duration: 45, price: 3500, description: 'Build a systematic networking plan' },
        { name: 'Spring Week Application Review', duration: 45, price: 3500, description: 'Full review of your Spring Week applications' },
      ],
    },
    { email: 'marcus@earlyedge.co.uk', password: 'Marcus123!', name: 'Marcus D.', slug: 'marcus-d',
      bio: "BCG Summer Consultant from non-traditional background.",
      full_bio: "Studied Management at LSE and landed a summer consulting role at BCG. Came from a completely non-traditional background.",
      headline: 'BCG Summer Consultant', university: 'London School of Economics',
      categories: ['Consulting', 'Case Studies', 'PEI Stories', 'Written Cases', 'Behavioural Interviews'],
      hourly_rate: 5000, total_sessions: 30,
      services: [
        { name: 'Case Interview Coaching', duration: 60, price: 5000, description: 'Live case practice with structured problem-solving' },
        { name: 'PEI Story Development', duration: 45, price: 4000, description: 'Develop and refine 3-4 PEI stories' },
        { name: 'Written Case Prep', duration: 60, price: 5500, description: 'Practice BCG/McKinsey-style written cases' },
      ],
      package: { name: 'MBB Application Sprint', session_count: 5, price: 20000, description: 'Cases, PEI, Written Case, Application Review' },
    },
  ];

  const students = [
    { email: 'newstudent@earlyedge.co.uk', password: 'Student123!', name: 'Alex New' },
    { email: 'activestudent@earlyedge.co.uk', password: 'Active123!', name: 'Alex Active' },
    { email: 'demo@earlyedge.co.uk', password: 'Demo123!', name: 'Demo Student' },
  ];

  const coachUserIds = {};
  const coachDbIds = {};

  for (const coach of coaches) {
    process.stdout.write(`  ${coach.name}... `);
    
    // Create auth user
    const { data: userData, error: authErr } = await supabase.auth.admin.createUser({
      email: coach.email,
      password: coach.password,
      email_confirm: true,
      user_metadata: { name: coach.name, type: 'coach' },
    });

    let userId;
    if (authErr) {
      if (authErr.message?.includes('already been registered')) {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email === coach.email);
        userId = existing?.id;
        if (!userId) { console.log('❌ cannot find existing user'); continue; }
      } else {
        console.log(`❌ auth: ${authErr.message}`);
        continue;
      }
    } else {
      userId = userData.user.id;
    }
    coachUserIds[coach.slug] = userId;

    // Insert users row
    await supabase.from('users').upsert({ id: userId, email: coach.email, name: coach.name, type: 'coach' }, { onConflict: 'id' });

    // Insert coaches row
    const { data: coachRow, error: coachErr } = await supabase.from('coaches').upsert({
      user_id: userId, bio: coach.bio, full_bio: coach.full_bio, headline: coach.headline,
      university: coach.university, categories: coach.categories, hourly_rate: coach.hourly_rate,
      total_sessions: coach.total_sessions, is_active: true, is_featured: true, verified: true,
    }, { onConflict: 'user_id' }).select().single();

    if (coachErr) { console.log(`❌ coach: ${coachErr.message}`); continue; }
    coachDbIds[coach.slug] = coachRow.id;

    // Services
    for (const svc of coach.services) {
      await supabase.from('coach_services').insert({
        coach_id: coachRow.id, name: svc.name, duration: svc.duration,
        price: svc.price, description: svc.description, is_active: true,
      });
    }

    // Package
    if (coach.package) {
      await supabase.from('coach_packages').insert({
        coach_id: coachRow.id, name: coach.package.name, session_count: coach.package.session_count,
        price: coach.package.price, description: coach.package.description, is_active: true,
      });
    }

    console.log(`✅ (${coachRow.id.substring(0, 8)}...)`);
  }

  // Student accounts
  console.log('\n📋 Creating student accounts...');
  const studentUserIds = {};

  for (const student of students) {
    process.stdout.write(`  ${student.name}... `);
    
    const { data: userData, error: authErr } = await supabase.auth.admin.createUser({
      email: student.email, password: student.password,
      email_confirm: true, user_metadata: { name: student.name, type: 'student' },
    });

    let userId;
    if (authErr) {
      if (authErr.message?.includes('already been registered')) {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email === student.email);
        userId = existing?.id;
      } else { console.log(`❌ ${authErr.message}`); continue; }
    } else {
      userId = userData.user.id;
    }
    studentUserIds[student.email] = userId;

    await supabase.from('users').upsert({ id: userId, email: student.email, name: student.name, type: 'student' }, { onConflict: 'id' });
    console.log('✅');
  }

  // Seed bookings for active student
  console.log('\n📋 Seeding bookings...');
  const activeId = studentUserIds['activestudent@earlyedge.co.uk'];
  if (activeId && coachDbIds['sarah-k']) {
    await supabase.from('bookings').insert({
      coach_id: coachDbIds['sarah-k'], student_id: activeId, type: 'session', status: 'confirmed',
      scheduled_at: new Date(Date.now() + 24*60*60*1000).toISOString(), duration: 45, price: 4000, commission_amount: 1200,
    });
    await supabase.from('bookings').insert({
      coach_id: coachDbIds['sarah-k'], student_id: activeId, type: 'session', status: 'completed',
      scheduled_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(), duration: 45, price: 5000,
      commission_amount: 1500, completed_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
    });
    console.log('  ✅ Sarah bookings created');
  }
  if (activeId && coachDbIds['david-w']) {
    await supabase.from('bookings').insert({
      coach_id: coachDbIds['david-w'], student_id: activeId, type: 'session', status: 'confirmed',
      scheduled_at: new Date(Date.now() + 3*24*60*60*1000).toISOString(), duration: 60, price: 6000, commission_amount: 1800,
    });
    console.log('  ✅ David booking created');
  }

  // Seed conversations & messages
  console.log('\n📋 Seeding conversations...');
  
  async function seedConvo(studentId, coachSlug, msgs) {
    const coachUserId = coachUserIds[coachSlug];
    const coachId = coachDbIds[coachSlug];
    if (!studentId || !coachId || !coachUserId) return;

    const { data: convo, error } = await supabase.from('conversations').upsert(
      { coach_id: coachId, student_id: studentId, last_message_at: new Date().toISOString() },
      { onConflict: 'coach_id,student_id' }
    ).select().single();
    if (error) { console.log(`  ❌ convo: ${error.message}`); return; }

    for (const msg of msgs) {
      const senderId = msg.from === 'student' ? studentId : coachUserId;
      const recipientId = msg.from === 'student' ? coachUserId : studentId;
      await supabase.from('messages').insert({
        conversation_id: convo.id, sender_id: senderId, recipient_id: recipientId,
        content: msg.text, is_read: true, created_at: msg.time,
      });
    }
    console.log(`  ✅ ${coachSlug} conversation (${msgs.length} msgs)`);
  }

  if (activeId) {
    await seedConvo(activeId, 'sarah-k', [
      { from: 'student', text: "Hi Sarah! I've updated my CV with the changes we discussed. Should I send it over before tomorrow?", time: new Date(Date.now() - 48*60*60*1000).toISOString() },
      { from: 'coach', text: "Yes please! Send it over and I'll take a look before our session.", time: new Date(Date.now() - 47*60*60*1000).toISOString() },
      { from: 'student', text: "Amazing, just sent it to your email. I've also added a section on my extracurriculars like you suggested.", time: new Date(Date.now() - 46*60*60*1000).toISOString() },
      { from: 'coach', text: "Great, I'll review your CV before our session tomorrow!", time: new Date(Date.now() - 2*60*60*1000).toISOString() },
    ]);
    await seedConvo(activeId, 'david-w', [
      { from: 'coach', text: "Hey Alex! Looking forward to our mock interview on Sunday. Quick heads up on what to prepare.", time: new Date(Date.now() - 5*60*60*1000).toISOString() },
      { from: 'coach', text: "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before!", time: new Date(Date.now() - 5*60*60*1000 + 60000).toISOString() },
    ]);
  }

  const demoId = studentUserIds['demo@earlyedge.co.uk'];
  if (demoId) {
    await seedConvo(demoId, 'sarah-k', [
      { from: 'student', text: "Hi Sarah! I'm interested in your CV Review service. Could you help me with my Goldman Sachs application?", time: new Date(Date.now() - 1*60*60*1000).toISOString() },
    ]);
  }

  // Summary
  console.log('\n════════════════════════════════════');
  console.log('✅ Setup complete! Account credentials:');
  console.log('════════════════════════════════════');
  console.log('\n📋 COACHES:');
  for (const c of coaches) console.log(`  ${c.name.padEnd(12)} ${c.email.padEnd(30)} ${c.password}`);
  console.log('\n📋 STUDENTS:');
  for (const s of students) console.log(`  ${s.name.padEnd(12)} ${s.email.padEnd(30)} ${s.password}`);
  console.log('');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
