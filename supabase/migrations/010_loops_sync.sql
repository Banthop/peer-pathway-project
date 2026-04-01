-- Add loops_synced_at column for tracking which contacts have been synced to Loops
ALTER TABLE crm_contacts
ADD COLUMN IF NOT EXISTS loops_synced_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_crm_contacts_loops_synced_at ON crm_contacts (loops_synced_at);
