-- CRM Email Templates
CREATE TABLE IF NOT EXISTS crm_email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    segment TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select" ON crm_email_templates FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert" ON crm_email_templates FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON crm_email_templates FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON crm_email_templates FOR DELETE TO anon USING (true);

-- CRM Email Sends log
CREATE TABLE IF NOT EXISTS crm_email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES crm_email_templates(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    resend_id TEXT,
    status TEXT DEFAULT 'queued',
    sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE crm_email_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous all" ON crm_email_sends FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_email_sends_contact ON crm_email_sends(contact_id);
CREATE INDEX idx_email_sends_template ON crm_email_sends(template_id);
