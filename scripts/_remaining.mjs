import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  const content = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  for (const l of content.split('\n')) {
    const m = l.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/);
    if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

const res = await fetch(`${url}/rest/v1/crm_contacts?select=email,first_name,last_name,tags,status,metadata&order=created_at.desc`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const c = await res.json();

const has = (x, ...t) => t.every(tt => (x.tags || []).includes(tt));
const no = (x, t) => !(x.tags || []).includes(t);
const any = (x, ...t) => t.some(tt => (x.tags || []).includes(tt));
const safe = (x) => no(x, 'bounced') && no(x, 'resend_unsubscribed') && x.status !== 'unsubscribed';
const touched = (x) => any(x, 'email_sent', 'linkedin_emailed', 'email_delivered', 'last_day_hot', 'last_day_form', 'last_day_clicker', 'last_day_reengage', 'last_day_upsell', 'confirmation_sent', 'discount_sent', 'funnel_email_2', 'guide_upsell_sent');

const neverEmailed = c.filter(x => !touched(x) && safe(x));
const resendOnly = c.filter(x => has(x, 'resend_audience') && !any(x, 'linkedin_scraped', 'form_lead', 'stripe_customer') && !touched(x) && safe(x));
const buyersNoPrep = c.filter(x => has(x, 'stripe_customer') && !any(x, 'last_day_upsell', 'last_day_hot'));

console.log(`Total: ${c.length}`);
console.log(`Never emailed: ${neverEmailed.length}`);
console.log(`Resend audience only: ${resendOnly.length}`);
console.log(`Buyers not prep'd today: ${buyersNoPrep.length}`);
console.log('');
console.log('--- NEVER EMAILED SAMPLE ---');
for (const x of neverEmailed.slice(0, 10)) console.log(`  ${(x.first_name || '?')} ${x.last_name || ''} <${x.email}> [${(x.tags || []).join(',')}]`);
if (neverEmailed.length > 10) console.log(`  +${neverEmailed.length - 10} more`);
console.log('');
console.log('--- BUYERS NO PREP ---');
for (const x of buyersNoPrep.slice(0, 10)) console.log(`  ${(x.first_name || '?')} ${x.last_name || ''} <${x.email}> [${(x.tags || []).join(',')}]`);
process.exit(0);
