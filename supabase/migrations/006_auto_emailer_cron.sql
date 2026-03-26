-- Auto-emailer cron job
-- Runs every 15 minutes to handle:
-- 1. Form abandonment emails (30 min after starting form)
-- 2. New buyer confirmation emails

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'auto-emailer-cron',
  '*/15 * * * *',
  $$SELECT extensions.http_post(
    'https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/auto-emailer',
    '{}'::text,
    'application/json'::text
  )$$
);
