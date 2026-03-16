-- Create webinar_leads table to track form submissions
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS webinar_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_code TEXT,
  phone TEXT,
  university TEXT,
  year_of_study TEXT,
  industry TEXT,
  industry_detail TEXT,
  referral_source TEXT,
  selected_ticket TEXT DEFAULT 'bundle',
  completed_checkout BOOLEAN DEFAULT false
);

-- Enable RLS so only you (authenticated) can read, but anon can insert
ALTER TABLE webinar_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (the form doesn't require login)
CREATE POLICY "Allow anonymous inserts"
  ON webinar_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (you in the dashboard) can read
CREATE POLICY "Only authenticated users can read"
  ON webinar_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for quick lookups
CREATE INDEX idx_webinar_leads_email ON webinar_leads (email);

-- Create index on created_at for sorting
CREATE INDEX idx_webinar_leads_created_at ON webinar_leads (created_at DESC);
