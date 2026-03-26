import { createClient } from "npm:@supabase/supabase-js@2";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from('crm_contacts').select('email, tags, metadata').eq('status', 'converted');
console.log(JSON.stringify(data, null, 2));
