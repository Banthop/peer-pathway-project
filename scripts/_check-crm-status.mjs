import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadEnv() {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnv();

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkStatus() {
  const { data, error } = await sb
    .from('crm_contacts')
    .select('id, email, tags, status, created_at, first_name');
    
  if (error) {
    console.error('Error fetching contacts:', error);
    process.exit(1);
  }

  // Pending confirmations
  const buyers = data.filter(c => (c.tags || []).includes('stripe_customer') || c.status === 'converted');
  const unconfirmed = buyers.filter(c => !(c.tags || []).includes('confirmation_sent'));
  
  // Non-buyers
  const nonBuyers = data.filter(c => !(c.tags || []).includes('stripe_customer') && c.status !== 'converted');
  
  // Form leads / started
  const formLeads = nonBuyers.filter(c => (c.tags || []).includes('form_started') || (c.tags || []).includes('form_lead'));

  console.log(`Total buyers: ${buyers.length}`);
  console.log(`Unconfirmed buyers: ${unconfirmed.length}`);
  
  console.log(`Total non-buyers: ${nonBuyers.length}`);
  console.log(`Form leads who haven't bought: ${formLeads.length}`);
  
  if (unconfirmed.length > 0) {
    console.log('\nUnconfirmed buyer emails:');
    unconfirmed.forEach(c => console.log(`- ${c.email} (Tags: ${(c.tags || []).join(', ')})`));
  }
}

checkStatus();
