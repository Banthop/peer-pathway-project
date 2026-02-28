-- EarlyEdge Initial Schema
-- Run this in Supabase SQL editor or via CLI migration

-- =========================================
-- 1. TABLES
-- =========================================

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('student', 'coach', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Coaches
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT,
  full_bio TEXT,
  headline TEXT NOT NULL,
  credential_year INTEGER,
  university TEXT,
  categories TEXT[] NOT NULL,
  hourly_rate INTEGER NOT NULL, -- pence
  photo_url TEXT,
  linkedin_url TEXT,
  verified BOOLEAN DEFAULT false,
  stripe_account_id TEXT,
  stripe_onboarded BOOLEAN DEFAULT false,
  total_sessions INTEGER DEFAULT 0,
  commission_rate INTEGER DEFAULT 30,
  is_founding_coach BOOLEAN DEFAULT false,
  founding_coach_expires_at TIMESTAMPTZ,
  social_platform TEXT,
  social_url TEXT,
  social_followers INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaches_categories ON coaches USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_coaches_active ON coaches (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coaches_rate ON coaches (hourly_rate);

-- Coach Packages
CREATE TABLE IF NOT EXISTS coach_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  session_count INTEGER NOT NULL,
  price INTEGER NOT NULL, -- pence
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Coach Services
CREATE TABLE IF NOT EXISTS coach_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  price INTEGER, -- pence, null = use hourly rate
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Availability
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_availability_coach ON availability (coach_id, day_of_week);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  service_id UUID REFERENCES coach_services(id),
  package_id UUID REFERENCES coach_packages(id),
  type TEXT NOT NULL CHECK (type IN ('intro', 'session', 'package_session')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  commission_amount INTEGER DEFAULT 0,
  commission_rate INTEGER,
  meeting_link TEXT,
  notes TEXT,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_coach ON bookings (coach_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings (student_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  outcome_badge TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_coach ON reviews (coach_id, created_at DESC);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id, student_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (recipient_id, is_read) WHERE is_read = false;

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id),
  referral_code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER DEFAULT 10,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Season Banners
CREATE TABLE IF NOT EXISTS season_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  link_text TEXT,
  link_category TEXT,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trending Topics
CREATE TABLE IF NOT EXISTS trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('workshop', 'bootcamp', 'ama', 'panel')),
  category TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  max_attendees INTEGER NOT NULL DEFAULT 20,
  current_attendees INTEGER DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  meeting_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, student_id)
);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guide', 'template', 'checklist', 'toolkit', 'article')),
  price INTEGER NOT NULL DEFAULT 0,
  file_url TEXT,
  preview_text TEXT,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resource Purchases
CREATE TABLE IF NOT EXISTS resource_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resource_id, student_id)
);


-- =========================================
-- 2. ROW LEVEL SECURITY (RLS)
-- =========================================

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can insert users" ON users FOR INSERT WITH CHECK (true);

-- Coaches
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coaches" ON coaches FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can update own profile" ON coaches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert coaches" ON coaches FOR INSERT WITH CHECK (true);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
);
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public reviews" ON reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Student can create review" ON reviews FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Availability
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability" ON availability FOR SELECT USING (true);
CREATE POLICY "Coach can manage availability" ON availability FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
);

-- Coach Packages
ALTER TABLE coach_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view packages" ON coach_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can manage packages" ON coach_packages FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
);

-- Coach Services
ALTER TABLE coach_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON coach_services FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can manage services" ON coach_services FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
);

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
);

-- Trending Topics
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active topics" ON trending_topics FOR SELECT USING (is_active = true);

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches manage their events" ON events FOR ALL USING (
  coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
);

-- Event Registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own registrations" ON event_registrations FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Coaches see their event registrations" ON event_registrations FOR SELECT USING (
  event_id IN (SELECT id FROM events WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);
CREATE POLICY "Students can register" ON event_registrations FOR INSERT WITH CHECK (student_id = auth.uid());

-- Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active resources" ON resources FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches manage their resources" ON resources FOR ALL USING (
  coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
);

-- Resource Purchases
ALTER TABLE resource_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own purchases" ON resource_purchases FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can purchase" ON resource_purchases FOR INSERT WITH CHECK (student_id = auth.uid());

-- Season Banners
ALTER TABLE season_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active banners" ON season_banners FOR SELECT USING (is_active = true);

-- Referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
