-- CRM Contacts table - unified contact store for all form submissions
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  university TEXT,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('webinar', 'coach_signup', 'student_signup', 'linkedin', 'manual', 'other')),
  source_detail TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'engaged', 'converted', 'unsubscribed')),
  notes TEXT DEFAULT '',
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (forms don't require login)
CREATE POLICY "Allow anonymous inserts"
  ON crm_contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can also insert
CREATE POLICY "Authenticated can insert"
  ON crm_contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users (admins) can read
CREATE POLICY "Authenticated can read"
  ON crm_contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated can update"
  ON crm_contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated can delete"
  ON crm_contacts
  FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX idx_crm_contacts_email ON crm_contacts (email);
CREATE INDEX idx_crm_contacts_source ON crm_contacts (source);
CREATE INDEX idx_crm_contacts_status ON crm_contacts (status);
CREATE INDEX idx_crm_contacts_created ON crm_contacts (created_at DESC);
CREATE INDEX idx_crm_contacts_tags ON crm_contacts USING GIN (tags);
