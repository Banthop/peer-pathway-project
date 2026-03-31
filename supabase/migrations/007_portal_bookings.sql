-- Portal bookings table for Uthman's coaching sessions
CREATE TABLE IF NOT EXISTS portal_bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email text NOT NULL,
  student_name text NOT NULL,
  session_type text NOT NULL,
  session_date date NOT NULL,
  session_time text NOT NULL,
  price_pennies integer NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  zoom_link text
);

-- Allow inserts from authenticated users
ALTER TABLE portal_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings" ON portal_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own bookings" ON portal_bookings
  FOR SELECT USING (student_email = auth.jwt() ->> 'email');
