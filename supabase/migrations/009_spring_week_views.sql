-- Spring Week funnel analytics views

-- View: spring week leads with their checkout status
CREATE OR REPLACE VIEW spring_week_funnel AS
SELECT
  wl.id,
  wl.email,
  wl.first_name,
  wl.last_name,
  wl.university,
  wl.year_of_study,
  wl.industry,
  wl.industry_detail,
  wl.referral_source,
  wl.selected_ticket,
  wl.completed_checkout,
  wl.created_at AS lead_created_at,
  cc.status AS crm_status,
  cc.tags AS crm_tags,
  cc.awareness_level,
  cc.metadata->>'stripe_spend' AS total_spend,
  cc.metadata->>'spring_week_product' AS purchased_product,
  cc.metadata->>'spring_week_purchased_at' AS purchased_at,
  CASE
    WHEN cc.status = 'converted' THEN 'purchased'
    WHEN wl.completed_checkout = true THEN 'checkout_started'
    WHEN wl.industry IS NOT NULL THEN 'industry_selected'
    WHEN wl.university IS NOT NULL THEN 'university_entered'
    WHEN wl.email IS NOT NULL THEN 'email_entered'
    ELSE 'unknown'
  END AS funnel_stage
FROM webinar_leads wl
LEFT JOIN crm_contacts cc ON LOWER(wl.email) = LOWER(cc.email)
WHERE wl.webinar_type = 'spring_week'
ORDER BY wl.created_at DESC;

-- View: spring week revenue summary
CREATE OR REPLACE VIEW spring_week_revenue AS
SELECT
  cc.metadata->>'spring_week_product' AS product,
  COUNT(*) AS buyers,
  SUM(COALESCE((cc.metadata->>'stripe_spend')::numeric, 0)) AS total_revenue,
  AVG(COALESCE((cc.metadata->>'stripe_spend')::numeric, 0)) AS avg_spend
FROM crm_contacts cc
WHERE cc.tags @> ARRAY['spring_week']
  AND cc.status = 'converted'
GROUP BY cc.metadata->>'spring_week_product'
ORDER BY total_revenue DESC;

-- View: conversion funnel metrics
CREATE OR REPLACE VIEW funnel_metrics AS
SELECT
  webinar_type,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE completed_checkout = true) AS checkout_started,
  COUNT(*) FILTER (WHERE email IN (
    SELECT email FROM crm_contacts WHERE status = 'converted'
  )) AS converted,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE completed_checkout = true) / NULLIF(COUNT(*), 0),
    1
  ) AS checkout_rate_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE email IN (
      SELECT email FROM crm_contacts WHERE status = 'converted'
    )) / NULLIF(COUNT(*), 0),
    1
  ) AS conversion_rate_pct
FROM webinar_leads
GROUP BY webinar_type;
