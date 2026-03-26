CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.invoke_resend_sync_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/resend-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', current_setting('request.jwt.claim.role', true) -- Or the anon key
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_crm_contact_created ON crm_contacts;
CREATE TRIGGER on_crm_contact_created
  AFTER INSERT ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.invoke_resend_sync_webhook();
