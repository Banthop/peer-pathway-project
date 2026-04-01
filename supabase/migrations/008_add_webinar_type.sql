-- Add webinar_type column to webinar_leads for segmenting cold_email vs spring_week funnels
ALTER TABLE webinar_leads
ADD COLUMN IF NOT EXISTS webinar_type text NOT NULL DEFAULT 'cold_email';

-- Add awareness tracking columns to crm_contacts
ALTER TABLE crm_contacts
ADD COLUMN IF NOT EXISTS awareness_level text DEFAULT 'unaware',
ADD COLUMN IF NOT EXISTS first_touchpoint text,
ADD COLUMN IF NOT EXISTS lifetime_value numeric DEFAULT 0;

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_crm_contacts_awareness_level ON crm_contacts (awareness_level);
CREATE INDEX IF NOT EXISTS idx_webinar_leads_webinar_type ON webinar_leads (webinar_type);
