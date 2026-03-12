-- =========================================
-- RLS Policy Fixes for Messaging & Seeding
-- =========================================

-- Drop the overly restrictive "Users can view own profile" policy
-- and replace with one that lets authenticated users see names/avatars
DROP POLICY IF EXISTS "Users can view own profile" ON users;

CREATE POLICY "Authenticated users can view all user profiles"
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow students to create conversations with coaches
CREATE POLICY "Students can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Allow coaches to create conversations too (for responding)  
CREATE POLICY "Coaches can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
  );

-- Allow public to view coach profiles (needed for profile pages)
DROP POLICY IF EXISTS "Anyone can view active coaches" ON coaches;
CREATE POLICY "Anyone can view coaches"
  ON coaches FOR SELECT
  USING (true);

-- Enable Realtime for messages and conversations tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
