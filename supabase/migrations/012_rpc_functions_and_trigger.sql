-- Migration 012: RPC functions, auth trigger, and missing policies
-- Run this in the Supabase SQL editor

-- =========================================
-- 1. AUTH TRIGGER: auto-create users row on signup
-- =========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public users table
  INSERT INTO public.users (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'type', 'student')
  )
  ON CONFLICT (id) DO NOTHING;

  -- If coach, create coaches skeleton row
  IF COALESCE(NEW.raw_user_meta_data->>'type', 'student') = 'coach' THEN
    INSERT INTO public.coaches (user_id, headline, categories, hourly_rate)
    VALUES (NEW.id, '', '{}', 4000)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =========================================
-- 2. COMMISSION CALCULATION FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION calculate_commission(
  p_coach_id UUID,
  p_amount INTEGER
)
RETURNS TABLE(
  commission_rate INTEGER,
  commission_amount INTEGER,
  coach_amount INTEGER
) AS $$
DECLARE
  v_coach coaches%ROWTYPE;
  v_rate INTEGER;
BEGIN
  SELECT * INTO v_coach FROM coaches WHERE id = p_coach_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 20, (p_amount * 20 / 100)::INTEGER, (p_amount - p_amount * 20 / 100)::INTEGER;
    RETURN;
  END IF;

  -- Founding coach with active exemption = 0%
  IF v_coach.is_founding_coach AND v_coach.founding_coach_expires_at > now() THEN
    v_rate := 0;
  -- Under 5 sessions: 30%
  ELSIF v_coach.total_sessions < 5 THEN
    v_rate := 30;
  -- 5+ sessions: 20%
  ELSE
    v_rate := 20;
  END IF;

  RETURN QUERY SELECT
    v_rate,
    (p_amount * v_rate / 100)::INTEGER,
    (p_amount - (p_amount * v_rate / 100))::INTEGER;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- 3. INCREMENT EVENT ATTENDEES (called by useEvents hook)
-- =========================================

CREATE OR REPLACE FUNCTION increment_event_attendees(p_event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1
  WHERE id = p_event_id
    AND current_attendees < max_attendees;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 4. DECREMENT EVENT ATTENDEES (called on unregister)
-- =========================================

CREATE OR REPLACE FUNCTION decrement_event_attendees(p_event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET current_attendees = GREATEST(current_attendees - 1, 0)
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 5. INCREMENT RESOURCE DOWNLOADS (called by useResources hook)
-- =========================================

CREATE OR REPLACE FUNCTION increment_resource_downloads(p_resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE resources
  SET download_count = download_count + 1
  WHERE id = p_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 6. MARK BOOKING COMPLETE + UPDATE COACH SESSION COUNT
-- =========================================

CREATE OR REPLACE FUNCTION complete_booking(p_booking_id UUID)
RETURNS void AS $$
DECLARE
  v_coach_id UUID;
BEGIN
  -- Mark the booking completed
  UPDATE bookings
  SET status = 'completed', completed_at = now(), updated_at = now()
  WHERE id = p_booking_id
    AND status = 'confirmed';

  -- Get the coach_id for this booking
  SELECT coach_id INTO v_coach_id FROM bookings WHERE id = p_booking_id;

  -- Increment total_sessions on coach (this drives commission tier)
  IF v_coach_id IS NOT NULL THEN
    UPDATE coaches
    SET total_sessions = total_sessions + 1,
        -- Drop commission to 20% once they hit 5 sessions
        commission_rate = CASE
          WHEN total_sessions + 1 >= 5 AND NOT is_founding_coach THEN 20
          ELSE commission_rate
        END,
        updated_at = now()
    WHERE id = v_coach_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 7. GET OR CREATE CONVERSATION
-- Returns existing conversation ID or creates one
-- =========================================

CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_coach_id UUID,
  p_student_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Try to find existing
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE coach_id = p_coach_id AND student_id = p_student_id;

  -- Create if not found
  IF NOT FOUND THEN
    INSERT INTO conversations (coach_id, student_id, last_message_at)
    VALUES (p_coach_id, p_student_id, now())
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================
-- 8. UPDATE CONVERSATION last_message_at ON NEW MESSAGE
-- =========================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_sent ON messages;
CREATE TRIGGER on_message_sent
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();


-- =========================================
-- 9. MISSING RLS POLICIES
-- =========================================

-- Conversations: allow INSERT (needed for useStartConversation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversations' AND policyname = 'Users can create conversations'
  ) THEN
    CREATE POLICY "Users can create conversations" ON conversations
      FOR INSERT WITH CHECK (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
      );
  END IF;
END $$;

-- Conversations: allow UPDATE (for last_message_at via trigger)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversations' AND policyname = 'Service can update conversations'
  ) THEN
    CREATE POLICY "Service can update conversations" ON conversations
      FOR UPDATE USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
      );
  END IF;
END $$;

-- Bookings: allow UPDATE for coaches and students (reschedule, cancel, complete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'bookings' AND policyname = 'Users can update own bookings'
  ) THEN
    CREATE POLICY "Users can update own bookings" ON bookings
      FOR UPDATE USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id)
      );
  END IF;
END $$;

-- Users: allow authenticated users to view any profile (needed for coach dashboards)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'Authenticated users can view profiles'
  ) THEN
    CREATE POLICY "Authenticated users can view profiles" ON users
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Reviews: allow students to update their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'reviews' AND policyname = 'Students can update own reviews'
  ) THEN
    CREATE POLICY "Students can update own reviews" ON reviews
      FOR UPDATE USING (auth.uid() = student_id);
  END IF;
END $$;

-- Event registrations: allow students to update (cancel)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'event_registrations' AND policyname = 'Students can update own registrations'
  ) THEN
    CREATE POLICY "Students can update own registrations" ON event_registrations
      FOR UPDATE USING (student_id = auth.uid());
  END IF;
END $$;


-- =========================================
-- 10. ADMIN STATS VIEW
-- =========================================

CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM users WHERE type = 'student') AS total_students,
  (SELECT COUNT(*) FROM users WHERE type = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM coaches WHERE verified = true) AS verified_coaches,
  (SELECT COUNT(*) FROM coaches WHERE verified = false) AS unverified_coaches,
  (SELECT COUNT(*) FROM bookings) AS total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'completed') AS completed_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
  (SELECT COALESCE(SUM(commission_amount), 0) FROM bookings WHERE status = 'completed') AS total_revenue_pence,
  (SELECT COUNT(*) FROM bookings WHERE created_at >= date_trunc('month', now())) AS bookings_this_month,
  (SELECT COALESCE(SUM(commission_amount), 0) FROM bookings WHERE status = 'completed' AND created_at >= date_trunc('month', now())) AS revenue_this_month_pence,
  (SELECT COUNT(*) FROM reviews) AS total_reviews,
  (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE is_public = true) AS average_rating,
  (SELECT COUNT(*) FROM events WHERE is_active = true AND scheduled_at > now()) AS upcoming_events,
  (SELECT COUNT(*) FROM resources WHERE is_active = true) AS total_resources;


-- =========================================
-- 11. MONTHLY REVENUE VIEW
-- =========================================

CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  date_trunc('month', created_at) AS month,
  COUNT(*) AS booking_count,
  SUM(price) AS gross_revenue_pence,
  SUM(commission_amount) AS platform_revenue_pence,
  SUM(price - commission_amount) AS coach_revenue_pence
FROM bookings
WHERE status = 'completed'
GROUP BY date_trunc('month', created_at)
ORDER BY month DESC;
