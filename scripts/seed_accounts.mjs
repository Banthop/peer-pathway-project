/**
 * EarlyEdge Seed Script
 * Creates all coach and student accounts in Supabase.
 * 
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed_accounts.mjs
 * 
 * Requires the service_role key (from Supabase Dashboard > Settings > API).
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  console.error('   Find it in: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ── Coach Data ────────────────────────────────────────────────
const coaches = [
  {
    email: 'sarah@earlyedge.co.uk', password: 'Sarah123!', name: 'Sarah K.',
    slug: 'sarah-k',
    bio: "I'm Sarah, an incoming Investment Banking Analyst at Goldman Sachs and recent Oxford PPE graduate.",
    full_bio: "I'm Sarah, an incoming Investment Banking Analyst at Goldman Sachs and recent Oxford PPE graduate. Having navigated the competitive world of finance recruiting myself, I understand exactly what it takes to stand out and secure offers at top-tier banks.\n\nMy approach focuses on practical, actionable guidance tailored to your specific goals. Whether you're preparing for spring week applications, summer internships, or full-time roles, I'll help you craft compelling applications and ace your interviews.\n\nI've helped over 15 students secure offers at firms including Goldman Sachs, Morgan Stanley, JP Morgan, and Barclays.",
    headline: 'Goldman Sachs Incoming Analyst',
    university: 'University of Oxford',
    categories: ['Investment Banking', 'Spring Week', 'CV Review', 'Interview Prep', 'Cover Letters', 'Assessment Centres'],
    hourly_rate: 5000,
    total_sessions: 63,
    services: [
      { name: 'CV & Cover Letter Review', duration: 45, price: 4000, description: 'Detailed feedback on your application materials with specific improvements' },
      { name: 'Mock Interview', duration: 60, price: 6000, description: 'Realistic interview practice with feedback on technicals and behavioural questions' },
      { name: 'Application Strategy', duration: 45, price: 4500, description: 'Personalised guidance on firm selection, timeline, and application approach' },
    ],
    package: { name: 'IB Application Sprint', session_count: 4, price: 15000, description: 'CV Review, Mock Interview, Strategy, Cover Letters' },
  },
  {
    email: 'david@earlyedge.co.uk', password: 'David123!', name: 'David W.',
    slug: 'david-w',
    bio: "Hi, I'm David! I'm a Summer Associate at McKinsey & Company and Cambridge Economics graduate.",
    full_bio: "Hi, I'm David! I'm a Summer Associate at McKinsey & Company and Cambridge Economics graduate. I'm passionate about helping aspiring consultants crack the case and land offers at MBB and other top firms.\n\nHaving gone through the recruiting process myself and helped dozens of candidates prepare, I know what it takes to succeed.",
    headline: 'McKinsey Summer Associate',
    university: 'University of Cambridge',
    categories: ['Consulting', 'Case Studies', 'Strategy', 'Fit Interviews', 'Problem Solving'],
    hourly_rate: 6000,
    total_sessions: 48,
    services: [
      { name: 'Case Interview Prep', duration: 60, price: 6500, description: 'Practice cases with real-time feedback and frameworks' },
      { name: 'Fit Interview Coaching', duration: 45, price: 5000, description: 'Craft your story and nail behavioural questions' },
      { name: 'Application Review', duration: 45, price: 5500, description: 'Review and strengthen your consulting applications end-to-end' },
    ],
    package: { name: 'MBB Case Prep Bundle', session_count: 5, price: 27500, description: 'Case Prep, Fit Interview, Application Review, Mock' },
  },
  {
    email: 'emily@earlyedge.co.uk', password: 'Emily123!', name: 'Emily R.',
    slug: 'emily-r',
    bio: "I'm a trainee solicitor at Clifford Chance starting in September 2025.",
    full_bio: "I'm a trainee solicitor at Clifford Chance starting in September 2025. During my time at LSE, I secured vacation schemes at Clifford Chance, Linklaters, Freshfields, and Slaughter and May.",
    headline: 'Clifford Chance Trainee Solicitor',
    university: 'London School of Economics',
    categories: ['Law', 'Training Contracts', 'Vac Schemes', 'Commercial Awareness', 'Watson Glaser', 'LNAT', 'Application Forms'],
    hourly_rate: 4500,
    total_sessions: 34,
    services: [
      { name: 'TC Application Review', duration: 45, price: 4000, description: 'Detailed review and feedback on your training contract applications' },
      { name: 'Commercial Awareness Bootcamp', duration: 60, price: 5000, description: 'Intensive session on current commercial topics' },
      { name: 'Mock Vac Scheme Interview', duration: 60, price: 5000, description: 'Realistic mock interview simulating a magic circle vac scheme assessment' },
    ],
  },
  {
    email: 'james@earlyedge.co.uk', password: 'James123!', name: 'James L.',
    slug: 'james-l',
    bio: "Software Engineer at Meta, Imperial College London graduate.",
    full_bio: "I graduated from Imperial in 2022 with a First in Computer Science, and I've been working at Meta London since. I went through the full interview loop at Meta, Google, Amazon, and several startups.",
    headline: 'Meta Software Engineer',
    university: 'Imperial College London',
    categories: ['Software Engineering', 'LeetCode', 'System Design', 'Data Structures', 'Algorithms', 'Coding Interviews', 'Python/Java'],
    hourly_rate: 5500,
    total_sessions: 52,
    services: [
      { name: 'Algorithm & Data Structures', duration: 60, price: 5500, description: 'Practice coding problems with live feedback' },
      { name: 'System Design Interview', duration: 60, price: 6500, description: 'Design scalable systems like those asked at Meta, Google, and Amazon interviews' },
      { name: 'Full Mock Interview', duration: 60, price: 6000, description: 'End-to-end mock of a real FAANG interview with detailed scoring and feedback' },
    ],
    package: { name: 'Tech Interview Prep', session_count: 5, price: 22500, description: 'Algorithms, System Design, Mock Interviews' },
  },
  {
    email: 'priya@earlyedge.co.uk', password: 'Priya123!', name: 'Priya M.',
    slug: 'priya-m',
    bio: "First-year medical student at UCL with a UCAT score of 3150 (top 2%).",
    full_bio: "I'm a first-year medical student at UCL. I scored 3150 on the UCAT (top 2%) and received offers from UCL, King's, Bristol, and Leeds.",
    headline: 'UCAT Score 3150 · UCL Medicine',
    university: 'University College London',
    categories: ['UCAT', 'Medicine Applications', 'MMI Interviews', 'Personal Statements', 'Timing Strategies', 'BMAT'],
    hourly_rate: 4000,
    total_sessions: 28,
    services: [
      { name: 'UCAT Strategy Session', duration: 60, price: 4000, description: 'Learn section-specific strategies for timing and score optimisation' },
      { name: 'UCAT Practice & Review', duration: 45, price: 3500, description: 'Timed practice under test conditions with detailed review' },
      { name: 'Med School Application Review', duration: 45, price: 4000, description: 'Review personal statement and plan med school selection' },
    ],
    package: { name: 'UCAT Score Boost', session_count: 5, price: 17500, description: 'Diagnostic, all sections, full mock' },
  },
  {
    email: 'tom@earlyedge.co.uk', password: 'Tom123!', name: 'Tom H.',
    slug: 'tom-h',
    bio: "Reading PPE at Oxford, first-generation Oxbridge student.",
    full_bio: "I'm reading PPE at Oxford and was the first in my family to apply to Oxbridge. I've since helped 8 students get offers across PPE, Economics, History, and English.",
    headline: 'Oxford PPE \'24',
    university: 'University of Oxford',
    categories: ['Oxbridge Applications', 'Personal Statements', 'Interview Prep', 'PPE', 'TSA', 'Supercurriculars'],
    hourly_rate: 5500,
    total_sessions: 41,
    services: [
      { name: 'Personal Statement Review', duration: 60, price: 5000, description: 'In-depth review and restructuring of your Oxbridge personal statement' },
      { name: 'Mock Oxbridge Interview', duration: 60, price: 5500, description: 'Realistic tutorial-style mock interview with detailed feedback' },
      { name: 'Application Strategy', duration: 45, price: 4500, description: 'College selection, supercurricular planning, and Oxbridge strategy' },
    ],
  },
  {
    email: 'aisha@earlyedge.co.uk', password: 'Aisha123!', name: 'Aisha N.',
    slug: 'aisha-n',
    bio: "Landed JPM Spring Week with zero connections through cold emailing.",
    full_bio: "I'm a second-year Economics student at Warwick. I landed my J.P. Morgan Spring Week entirely through cold emailing and networking.",
    headline: 'J.P. Morgan Spring Week \'24',
    university: 'University of Warwick',
    categories: ['Investment Banking', 'Cold Emailing', 'Networking', 'Spring Week Apps', 'Non-target Strategy', 'LinkedIn'],
    hourly_rate: 3500,
    total_sessions: 18,
    services: [
      { name: 'Cold Email Workshop', duration: 45, price: 3000, description: 'Learn my proven template for cold emailing bankers' },
      { name: 'Networking Strategy', duration: 45, price: 3500, description: 'Build a systematic networking plan' },
      { name: 'Spring Week Application Review', duration: 45, price: 3500, description: 'Full review of your Spring Week applications' },
    ],
  },
  {
    email: 'marcus@earlyedge.co.uk', password: 'Marcus123!', name: 'Marcus D.',
    slug: 'marcus-d',
    bio: "BCG Summer Consultant from a non-traditional background.",
    full_bio: "I studied Management at LSE and landed a summer consulting role at BCG. What makes me different is that I came from a completely non-traditional background.",
    headline: 'BCG Summer Consultant',
    university: 'London School of Economics',
    categories: ['Consulting', 'Case Studies', 'PEI Stories', 'Written Cases', 'Non-traditional Backgrounds', 'Behavioural Interviews'],
    hourly_rate: 5000,
    total_sessions: 30,
    services: [
      { name: 'Case Interview Coaching', duration: 60, price: 5000, description: 'Live case practice with a focus on structured problem-solving' },
      { name: 'PEI Story Development', duration: 45, price: 4000, description: 'Develop and refine 3-4 PEI stories authentically' },
      { name: 'Written Case Prep', duration: 60, price: 5500, description: 'Practice BCG/McKinsey-style written cases' },
    ],
    package: { name: 'MBB Application Sprint', session_count: 5, price: 20000, description: 'Cases, PEI, Written Case, Application Review' },
  },
];

// ── Student Data ──────────────────────────────────────────────
const students = [
  { email: 'newstudent@earlyedge.co.uk', password: 'Student123!', name: 'Alex New' },
  { email: 'activestudent@earlyedge.co.uk', password: 'Active123!', name: 'Alex Active' },
  { email: 'demo@earlyedge.co.uk', password: 'Demo123!', name: 'Demo Student' },
];

// ── Helper ────────────────────────────────────────────────────
async function createAuthUser(email, password, name, type) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, type },
  });
  if (error) {
    if (error.message?.includes('already been registered')) {
      console.log(`  ⚠️ ${email} already exists, fetching...`);
      // List users and find this one
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users?.find(u => u.email === email);
      return existing || null;
    }
    console.error(`  ❌ Failed to create ${email}:`, error.message);
    return null;
  }
  return data.user;
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('🚀 EarlyEdge Seed Script\n');

  // ── 1. Create Coach Accounts ──
  console.log('📋 Creating coach accounts...');
  const coachUserIds = {};

  for (const coach of coaches) {
    console.log(`  Creating ${coach.name} (${coach.email})...`);
    const user = await createAuthUser(coach.email, coach.password, coach.name, 'coach');
    if (!user) continue;
    coachUserIds[coach.slug] = user.id;

    // Insert into users table
    const { error: userErr } = await supabase.from('users').upsert({
      id: user.id,
      email: coach.email,
      name: coach.name,
      type: 'coach',
    }, { onConflict: 'id' });
    if (userErr) console.error(`    ❌ users insert:`, userErr.message);

    // Insert into coaches table
    const { data: coachRow, error: coachErr } = await supabase.from('coaches').upsert({
      user_id: user.id,
      bio: coach.bio,
      full_bio: coach.full_bio,
      headline: coach.headline,
      university: coach.university,
      categories: coach.categories,
      hourly_rate: coach.hourly_rate,
      total_sessions: coach.total_sessions,
      is_active: true,
      is_featured: true,
      verified: true,
    }, { onConflict: 'user_id' }).select().single();
    if (coachErr) console.error(`    ❌ coaches insert:`, coachErr.message);

    const coachId = coachRow?.id;
    if (!coachId) continue;

    // Insert services
    for (const svc of coach.services) {
      await supabase.from('coach_services').upsert({
        coach_id: coachId,
        name: svc.name,
        duration: svc.duration,
        price: svc.price,
        description: svc.description,
        is_active: true,
      }, { ignoreDuplicates: true });
    }

    // Insert package if exists
    if (coach.package) {
      await supabase.from('coach_packages').upsert({
        coach_id: coachId,
        name: coach.package.name,
        session_count: coach.package.session_count,
        price: coach.package.price,
        description: coach.package.description,
        is_active: true,
      }, { ignoreDuplicates: true });
    }

    console.log(`  ✅ ${coach.name} created (coach_id: ${coachId})`);
  }

  // ── 2. Create Student Accounts ──
  console.log('\n📋 Creating student accounts...');
  const studentUserIds = {};

  for (const student of students) {
    console.log(`  Creating ${student.name} (${student.email})...`);
    const user = await createAuthUser(student.email, student.password, student.name, 'student');
    if (!user) continue;
    studentUserIds[student.email] = user.id;

    const { error: userErr } = await supabase.from('users').upsert({
      id: user.id,
      email: student.email,
      name: student.name,
      type: 'student',
    }, { onConflict: 'id' });
    if (userErr) console.error(`    ❌ users insert:`, userErr.message);
    console.log(`  ✅ ${student.name} created`);
  }

  // ── 3. Seed sample bookings for active student ──
  console.log('\n📋 Seeding bookings for active student...');
  const activeStudentId = studentUserIds['activestudent@earlyedge.co.uk'];

  if (activeStudentId) {
    // Get Sarah's coach_id
    const { data: sarahCoach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', coachUserIds['sarah-k'])
      .single();

    const { data: davidCoach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', coachUserIds['david-w'])
      .single();

    if (sarahCoach) {
      // Upcoming booking with Sarah
      await supabase.from('bookings').insert({
        coach_id: sarahCoach.id,
        student_id: activeStudentId,
        type: 'session',
        status: 'confirmed',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        duration: 45,
        price: 4000,
        commission_amount: 1200,
      });
      console.log('  ✅ Upcoming booking with Sarah created');

      // Past booking with Sarah
      await supabase.from('bookings').insert({
        coach_id: sarahCoach.id,
        student_id: activeStudentId,
        type: 'session',
        status: 'completed',
        scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        duration: 45,
        price: 5000,
        commission_amount: 1500,
        completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      console.log('  ✅ Past booking with Sarah created');
    }

    if (davidCoach) {
      // Upcoming booking with David
      await supabase.from('bookings').insert({
        coach_id: davidCoach.id,
        student_id: activeStudentId,
        type: 'session',
        status: 'confirmed',
        scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        duration: 60,
        price: 6000,
        commission_amount: 1800,
      });
      console.log('  ✅ Upcoming booking with David created');
    }
  }

  // ── 4. Seed conversations & messages ──
  console.log('\n📋 Seeding conversations and messages...');

  async function seedConversation(studentId, coachSlug, messages) {
    const coachUserId = coachUserIds[coachSlug];
    if (!studentId || !coachUserId) return;

    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', coachUserId)
      .single();
    if (!coach) return;

    const { data: convo, error: convoErr } = await supabase
      .from('conversations')
      .upsert({
        coach_id: coach.id,
        student_id: studentId,
        last_message_at: new Date().toISOString(),
      }, { onConflict: 'coach_id,student_id' })
      .select()
      .single();

    if (convoErr) {
      console.error(`    ❌ conversation insert:`, convoErr.message);
      return;
    }

    for (const msg of messages) {
      const senderId = msg.from === 'student' ? studentId : coachUserId;
      const recipientId = msg.from === 'student' ? coachUserId : studentId;
      
      await supabase.from('messages').insert({
        conversation_id: convo.id,
        sender_id: senderId,
        recipient_id: recipientId,
        content: msg.text,
        is_read: true,
        created_at: msg.time,
      });
    }
    console.log(`  ✅ Conversation seeded (${messages.length} messages)`);
  }

  if (activeStudentId) {
    // Conversation with Sarah
    await seedConversation(activeStudentId, 'sarah-k', [
      { from: 'student', text: "Hi Sarah! I've updated my CV with the changes we discussed last time. Should I send it over before tomorrow?", time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { from: 'coach', text: "Yes please! Send it over and I'll take a look before our session so we can hit the ground running.", time: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString() },
      { from: 'student', text: "Amazing, just sent it to your email. I've also added a section on my extracurriculars like you suggested.", time: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString() },
      { from: 'coach', text: "Great, I'll review your CV before our session tomorrow!", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ]);

    // Conversation with David
    await seedConversation(activeStudentId, 'david-w', [
      { from: 'coach', text: "Hey Alex! Looking forward to our mock interview on Sunday. Quick heads up on what to prepare.", time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      { from: 'coach', text: "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before 😄", time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    ]);
  }

  // Demo student conversation with Sarah
  const demoStudentId = studentUserIds['demo@earlyedge.co.uk'];
  if (demoStudentId) {
    await seedConversation(demoStudentId, 'sarah-k', [
      { from: 'student', text: "Hi Sarah! I'm interested in your CV Review service. Could you help me with my Goldman Sachs application?", time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ]);
  }

  // ── 5. Summary ──
  console.log('\n════════════════════════════════════════');
  console.log('✅ Seed complete! Account credentials:');
  console.log('════════════════════════════════════════');
  console.log('\n📋 COACH ACCOUNTS:');
  for (const c of coaches) {
    console.log(`  ${c.name.padEnd(12)} ${c.email.padEnd(30)} ${c.password}`);
  }
  console.log('\n📋 STUDENT ACCOUNTS:');
  for (const s of students) {
    console.log(`  ${s.name.padEnd(12)} ${s.email.padEnd(30)} ${s.password}`);
  }
  console.log('');
}

main().catch(console.error);
