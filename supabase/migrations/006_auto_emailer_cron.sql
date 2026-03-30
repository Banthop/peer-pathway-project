-- Auto-emailer cron job (fixed)
-- Runs every 15 minutes to handle:
-- 1. Form abandonment emails (30 min after starting form)
-- 2. New buyer confirmation emails
-- 3. Clicker discount emails

-- Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Remove old broken cron if it exists
SELECT cron.unschedule('auto-emailer-cron');

-- Re-create with correct pg_net call (no auth needed since verify_jwt = false)
SELECT cron.schedule(
  'auto-emailer-cron',
  '*/15 * * * *',
  $$SELECT extensions.http_post(
    'https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/auto-emailer',
    '{}'::text,
    'application/json'::text
  )$$
);
