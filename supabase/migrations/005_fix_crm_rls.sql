-- Fix RLS for CRM Contacts Upsert
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- The frontend uses .upsert() which requires both INSERT and UPDATE privileges.
-- The previous migration only granted INSERT to anonymous users, causing silent failures.

DROP POLICY IF EXISTS "Allow anonymous updates" ON crm_contacts;
DROP POLICY IF EXISTS "Allow anonymous updates for upsert" ON crm_contacts;

CREATE POLICY "Allow anonymous updates for upsert"
  ON crm_contacts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
