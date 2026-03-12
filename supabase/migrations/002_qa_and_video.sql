-- EarlyEdge Migration 002: Q&A Section + Video Call Support
-- Run in Supabase SQL editor

-- =========================================
-- Q&A Questions
-- =========================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT,
  category TEXT,
  is_answered BOOLEAN DEFAULT false,
  upvote_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions (category);
CREATE INDEX IF NOT EXISTS idx_questions_answered ON questions (is_answered, created_at DESC);

-- Q&A Answers
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  body TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false,
  upvote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_answers_question ON answers (question_id, created_at);

-- =========================================
-- Video Call Room URL on Bookings
-- =========================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS video_room_url TEXT;

-- =========================================
-- Event type: add 'webinar' and 'cohort' 
-- =========================================
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;
ALTER TABLE events ADD CONSTRAINT events_event_type_check 
  CHECK (event_type IN ('workshop', 'bootcamp', 'ama', 'panel', 'webinar', 'cohort'));

-- =========================================
-- RLS for Q&A
-- =========================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Students can ask questions" ON questions FOR INSERT WITH CHECK (auth.uid() = student_id);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Coaches can answer" ON answers FOR INSERT WITH CHECK (
  coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
);
