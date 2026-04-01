-- Migration 011: Add attio_id column to crm_contacts
-- Purpose: store the Attio person record ID alongside each contact so that
-- subsequent syncs can target the exact Attio record without relying solely
-- on email matching, preventing duplicate CRM records.

ALTER TABLE crm_contacts
    ADD COLUMN IF NOT EXISTS attio_id TEXT;

-- A unique index enforces one-to-one mapping between a Supabase contact and an
-- Attio person record. NULL values are excluded from uniqueness checks in
-- Postgres, so contacts that have not yet been synced can coexist safely.
CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_contacts_attio_id
    ON crm_contacts (attio_id)
    WHERE attio_id IS NOT NULL;

COMMENT ON COLUMN crm_contacts.attio_id IS
    'Attio person record_id returned by the Attio v2 upsert API. Populated by '
    'the stripe-webhook edge function after a successful Attio sync. Used to '
    'prevent duplicate CRM records on subsequent purchases by the same customer.';
