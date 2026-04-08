-- Spring Week Matchmaking table
-- Stores requests from students wanting to be matched with speakers from specific firms

CREATE TABLE IF NOT EXISTS spring_week_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email text NOT NULL,
  student_name text NOT NULL,
  firm text NOT NULL,
  division text,
  spring_week_date text,
  want_to_know text,
  is_paid boolean DEFAULT false,
  is_free_match boolean DEFAULT false,
  stripe_session_id text,
  matched_speaker_name text,
  matched_speaker_email text,
  zoom_link text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'matched', 'scheduled', 'completed', 'refunded')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE spring_week_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can insert own matches"
  ON spring_week_matches FOR INSERT
  WITH CHECK (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Students can view own matches"
  ON spring_week_matches FOR SELECT
  USING (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role full access"
  ON spring_week_matches FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sw_matches_status ON spring_week_matches(status);
CREATE INDEX IF NOT EXISTS idx_sw_matches_email ON spring_week_matches(student_email);

-- Add free match tracking to crm_contacts
ALTER TABLE crm_contacts ADD COLUMN IF NOT EXISTS sw_free_match_used boolean DEFAULT false;
