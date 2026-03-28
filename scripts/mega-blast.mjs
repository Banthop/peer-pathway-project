#!/usr/bin/env node
/**
 * 🚀 MEGA BLAST - One script, all segments, no one left behind.
 *
 * Segments:
 *   1. NEVER EMAILED - form leads who somehow never got ANY email (3 people)
 *   2. HOT LEADS - form_lead or email_clicked, never got discount (80 people)
 *   3. FUNNEL EMAIL 4 - clicked/form but never got the discount funnel email (11 people)
 *   4. COLD RE-ENGAGE - emailed but never clicked, no discount yet (363 people)
 *   5. FORM LEAD RE-BLAST - all 144 form leads who never converted, fresh "tonight" push
 *
 * Usage:
 *   node scripts/mega-blast.mjs                # Dry run - shows all segments
 *   node scripts/mega-blast.mjs --send         # 🔴 LIVE - sends everything
 *   node scripts/mega-blast.mjs --send --only=1,2   # Only send segments 1 & 2
 */

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE';
const RESEND_KEY = 're_6GL9cHXk_CFJesQr8nq2XKS6LqN72Vj7F';
const FROM = 'Dylan <dylan@yourearlyedge.co.uk>';
const BUNDLE_LINK = 'https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b';
const WEBINAR_LINK = 'https://webinar.yourearlyedge.co.uk/webinar';
const COUPON_CODE = 'WEBINAR50';

const args = process.argv.slice(2);
const LIVE_SEND = args.includes('--send');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY_SEGMENTS = onlyArg ? onlyArg.split('=')[1].split(',').map(Number) : null;

// ── Helpers ──
function p(t) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t, u) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
function wrap(body, signoff = 'Dylan') {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">${body}<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr><tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr></table></td></tr></table></body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

// 1) NEVER EMAILED - first touch, personal intro + discount
const TEMPLATE_FIRST_TOUCH = {
  subject: "you started signing up - here's 50% off",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("I noticed you started filling out our form for the cold email webinar but never grabbed a ticket.") +
    p("I totally get it, so I wanted to reach out personally and make this a no-brainer.") +
    p("Here's what's happening: <strong>Uthman</strong> sent 1,000 cold emails, got a <strong>21% response rate</strong> (average is 1-3%), and landed 20+ internship offers in 3 weeks.") +
    p("He's going live to break down the exact system. The templates, tools, follow-up sequences. Everything.") +
    p(`Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong> for <strong>50% off the full bundle</strong>.`) +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Live 90-min webinar + Q&A<br>&#8226; The Cold Email Guide 2.0<br>&#8226; The Cold Email Checklist<br>&#8226; Full recording<br><br>All for <strong>&pound;14.50</strong> instead of &pound;29.</td></tr>` +
    btn("Get the bundle - 50% off →", BUNDLE_LINK) +
    p(`Or just the webinar for <strong>&pound;10</strong>:`) +
    btn("Just the webinar →", WEBINAR_LINK),
    "Dylan"
  ),
  tag: 'mega_first_touch',
};

// 2) HOT LEADS discount push - form leads + clickers who never got a discount
const TEMPLATE_HOT_DISCOUNT = {
  subject: "I saved you a spot (+ 50% off)",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("You've been checking out the cold email webinar and I can tell you're interested.") +
    p("So let me make this stupidly easy for you.") +
    p(`<strong>50% off the full bundle.</strong> Code: <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong>`) +
    p("That gets you:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; The live webinar (90 mins + Q&A)<br>&#8226; The Cold Email Guide 2.0 - exact templates, subject lines, follow-up sequences<br>&#8226; The Cold Email Checklist<br>&#8226; The recording if you can't make it live<br><br>All for <strong>&pound;14.50</strong>.</td></tr>` +
    btn("Grab the bundle - 50% off →", BUNDLE_LINK) +
    p("One student used this system to land 20+ internship offers in 3 weeks. You could be next.") +
    p("This discount won't last."),
    "Dylan"
  ),
  tag: 'mega_hot_discount',
};

// 3) FUNNEL EMAIL 4 - clicked/form but never got the funnel discount
const TEMPLATE_FUNNEL_4 = {
  subject: "quick question + a discount for you",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("I noticed you checked out the webinar page but didn't grab a ticket yet. Totally fair, so I wanted to make it a no-brainer for you.") +
    p("For the next 48 hours, you can get the <strong>full bundle</strong> for just <strong>&pound;14.50</strong> (normally &pound;29):") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Live 90-min webinar (+ Q&A)<br>&#8226; Full recording sent after<br>&#8226; Uthman's exact cold email templates<br>&#8226; Apollo.io setup guide<br>&#8226; Follow-up sequences that got him a 21% response rate</td></tr>` +
    p("If you're applying for internships this summer in finance, consulting, tech, or law... this is the cheapest shortcut you'll find.") +
    p(`Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong> at checkout.`) +
    btn("Get the bundle for £14.50 →", BUNDLE_LINK) +
    p("This price won't last."),
    "Dylan"
  ),
  tag: 'mega_funnel_4',
};

// 4) COLD RE-ENGAGE - emailed but never clicked, bring them back
const TEMPLATE_COLD_REENGAGE = {
  subject: "did you see this?",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("I sent you something recently about a cold email webinar. Wanted to make sure it didn't get buried.") +
    p("Quick version: a student called Uthman sent 1,000 cold emails, got a 21% response rate (the average is 1 to 3%), and landed 20+ internship offers. In 3 weeks. Starting from zero connections.") +
    p("He's going <strong>live</strong> to break down the exact system. Templates, tools, follow-up sequences. Everything you need to start sending cold emails that actually get replies.") +
    p("If you're serious about landing an internship this summer, this is worth 90 minutes of your time.") +
    btn("See what the webinar covers →", WEBINAR_LINK) +
    p(`And if you want the full bundle (webinar + guide + checklist), use code <strong>${COUPON_CODE}</strong> for 50% off.`) +
    btn("Get the bundle - 50% off →", BUNDLE_LINK),
    "Dylan"
  ),
  tag: 'mega_cold_reengage',
};

// 5) FORM LEAD RE-BLAST - everyone who filled form but didn't convert
const TEMPLATE_FORM_REBLAST = {
  subject: "last thing - your spot is still open",
  html: wrap(
    p("Hey {{{FIRST_NAME|there}}},") +
    p("I know I've reached out before, but this is genuinely the last time.") +
    p("You started signing up for the cold email webinar, which tells me you're at least curious about how to land internships through cold outreach.") +
    p("Here's the thing. The students who actually do this stuff consistently beat out people with \"better\" CVs. Because most people never reach out at all.") +
    p("Uthman is going <strong>live</strong> to show exactly how he sent 1,000 emails, got a 21% response rate, and landed 20+ offers.") +
    p(`I'm giving you <strong>50% off</strong> as a final nudge. Code: <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">${COUPON_CODE}</strong>`) +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Live webinar + Q&A<br>&#8226; Cold Email Guide 2.0<br>&#8226; Cold Email Checklist<br>&#8226; Full recording<br><br><strong>&pound;14.50</strong> instead of &pound;29.</td></tr>` +
    btn("I'm in - get the bundle →", BUNDLE_LINK) +
    p("Or webinar only for £10:") +
    btn("Just the webinar →", WEBINAR_LINK) +
    p("After this, no more emails about it. Promise."),
    "Dylan"
  ),
  tag: 'mega_form_reblast',
};

// ═══════════════════════════════════════════════════════════════
// SUPABASE + RESEND
// ═══════════════════════════════════════════════════════════════

async function queryContacts() {
  const url = `${SUPABASE_URL}/rest/v1/crm_contacts?select=id,email,first_name,last_name,tags,status&limit=1000`;
  const res = await fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text()}`);
  return await res.json();
}

async function updateContact(id, tags) {
  await fetch(`${SUPABASE_URL}/rest/v1/crm_contacts?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ tags, last_activity_at: new Date().toISOString() }),
  });
}

async function resendPost(endpoint, body) {
  const res = await fetch(`https://api.resend.com${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend ${endpoint}: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function sendBroadcastSegment(name, subject, html, contacts) {
  if (contacts.length === 0) { console.log('   ⏭️  No contacts. Skipping.'); return 0; }

  console.log(`   📦 Creating audience "${name}" (${contacts.length} contacts)...`);
  const aud = await resendPost('/audiences', { name: `${name} ${Date.now()}` });

  let added = 0;
  for (const c of contacts) {
    try {
      await resendPost(`/audiences/${aud.id}/contacts`, {
        email: c.email, first_name: c.first_name || '', last_name: c.last_name || '', unsubscribed: false
      });
      added++;
      if (added % 8 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch (e) { console.log(`   ⚠️  ${c.email}: ${e.message}`); }
  }
  console.log(`   ✅ Added ${added}/${contacts.length} contacts`);

  console.log(`   📨 Sending broadcast...`);
  const br = await resendPost('/broadcasts', {
    audience_id: aud.id, from: FROM, subject, html, name: `${name} ${Date.now()}`
  });
  await resendPost(`/broadcasts/${br.id}/send`, {});
  console.log(`   🚀 SENT! Broadcast ID: ${br.id}`);

  // Cleanup after 60s
  setTimeout(async () => {
    try {
      await fetch(`https://api.resend.com/audiences/${aud.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${RESEND_KEY}` }
      });
    } catch {}
  }, 60000);

  return added;
}

// ═══════════════════════════════════════════════════════════════
// SEGMENT LOGIC
// ═══════════════════════════════════════════════════════════════

function buildSegments(contacts) {
  const seen = new Set(); // global dedup across segments
  function dedup(list) {
    return list.filter(c => {
      const e = c.email.toLowerCase();
      if (seen.has(e)) return false;
      seen.add(e);
      return true;
    });
  }

  // 1. NEVER EMAILED - form leads with zero campaign tags
  const campaignTags = [
    'final_push_buyer','final_push_hot','final_push_cold','final_push_fresh','final_push_upsell',
    'last_day_hot','last_day_form','last_day_clicker','last_day_reengage','last_day_upsell',
    'funnel_email_2','funnel_email_3','funnel_email_4',
    'linkedin_emailed','email_sent','email_delivered','confirmation_sent','discount_sent',
    'guide_upsell_sent','final_push_campaign','last_day_campaign',
    'mega_first_touch','mega_hot_discount','mega_funnel_4','mega_cold_reengage','mega_form_reblast',
  ];
  const neverEmailed = dedup(contacts.filter(c => {
    const tags = c.tags || [];
    if (tags.includes('bounced') || tags.includes('stripe_customer') || c.status === 'converted') return false;
    return !campaignTags.some(t => tags.includes(t));
  }));

  // 2. HOT LEADS - form_lead or email_clicked, NOT a buyer, never got discount
  const hotLeads = dedup(contacts.filter(c => {
    const tags = c.tags || [];
    const isHot = tags.includes('email_clicked') || tags.includes('form_lead');
    if (!isHot) return false;
    if (tags.includes('stripe_customer') || c.status === 'converted') return false;
    if (tags.includes('bounced')) return false;
    if (tags.includes('discount_sent') || tags.includes('mega_hot_discount')) return false;
    return true;
  }));

  // 3. FUNNEL EMAIL 4 - clicked/form but never got funnel_email_4
  const funnel4 = dedup(contacts.filter(c => {
    const tags = c.tags || [];
    const eligible = tags.includes('form_lead') || tags.includes('email_clicked');
    if (!eligible) return false;
    if (tags.includes('stripe_customer') || c.status === 'converted') return false;
    if (tags.includes('bounced')) return false;
    if (tags.includes('funnel_email_4') || tags.includes('mega_funnel_4')) return false;
    return true;
  }));

  // 4. COLD RE-ENGAGE - emailed/delivered but never clicked, no discount
  const coldReengage = dedup(contacts.filter(c => {
    const tags = c.tags || [];
    const wasEmailed = tags.includes('email_sent') || tags.includes('linkedin_emailed') || tags.includes('email_delivered');
    if (!wasEmailed) return false;
    if (tags.includes('email_clicked') || tags.includes('form_lead')) return false;
    if (tags.includes('stripe_customer') || c.status === 'converted') return false;
    if (tags.includes('bounced')) return false;
    if (tags.includes('discount_sent') || tags.includes('mega_cold_reengage')) return false;
    return true;
  }));

  // 5. FORM LEAD RE-BLAST - all form leads who never converted (last-shot catch-all)
  const formReblast = dedup(contacts.filter(c => {
    const tags = c.tags || [];
    const isForm = tags.includes('form_started') || tags.includes('form_lead');
    if (!isForm) return false;
    if (tags.includes('stripe_customer') || c.status === 'converted') return false;
    if (tags.includes('bounced')) return false;
    if (tags.includes('mega_form_reblast')) return false;
    return true;
  }));

  return [
    { num: 1, name: 'Never Emailed (First Touch)', template: TEMPLATE_FIRST_TOUCH, contacts: neverEmailed },
    { num: 2, name: 'Hot Leads (Discount Push)', template: TEMPLATE_HOT_DISCOUNT, contacts: hotLeads },
    { num: 3, name: 'Funnel Email 4 (Clicked, No Discount)', template: TEMPLATE_FUNNEL_4, contacts: funnel4 },
    { num: 4, name: 'Cold Re-Engage (Emailed, No Click)', template: TEMPLATE_COLD_REENGAGE, contacts: coldReengage },
    { num: 5, name: 'Form Lead Re-Blast (Final Push)', template: TEMPLATE_FORM_REBLAST, contacts: formReblast },
  ];
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '🚀'.repeat(20));
  console.log('   MEGA BLAST - All Segments, One Script');
  console.log('🚀'.repeat(20) + '\n');
  console.log(LIVE_SEND ? '🔴 LIVE MODE - emails WILL be sent\n' : '🟡 DRY RUN - no emails sent (use --send to go live)\n');

  const contacts = await queryContacts();
  console.log(`📋 Loaded ${contacts.length} CRM contacts\n`);

  const segments = buildSegments(contacts);

  // Summary
  console.log('═'.repeat(60));
  console.log('SEGMENT BREAKDOWN');
  console.log('═'.repeat(60));
  let totalToSend = 0;
  for (const seg of segments) {
    const active = !ONLY_SEGMENTS || ONLY_SEGMENTS.includes(seg.num);
    const marker = active ? '📨' : '⏭️ ';
    console.log(`  ${marker} [${seg.num}] ${seg.name}: ${seg.contacts.length} recipients${active ? '' : ' (SKIPPED)'}`);
    if (active) totalToSend += seg.contacts.length;
  }
  console.log(`\n  📊 TOTAL TO SEND: ${totalToSend} emails\n`);

  // Details
  for (const seg of segments) {
    const active = !ONLY_SEGMENTS || ONLY_SEGMENTS.includes(seg.num);
    if (!active) continue;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`[${seg.num}] ${seg.name} - "${seg.template.subject}"`);
    console.log(`${'─'.repeat(60)}`);
    for (const c of seg.contacts.slice(0, 8)) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '?';
      console.log(`  ${name.padEnd(25)} <${c.email}>`);
    }
    if (seg.contacts.length > 8) console.log(`  ... and ${seg.contacts.length - 8} more`);
  }

  if (!LIVE_SEND) {
    console.log('\n' + '═'.repeat(60));
    console.log('To send ALL segments:        node scripts/mega-blast.mjs --send');
    console.log('To send specific segments:   node scripts/mega-blast.mjs --send --only=1,2');
    console.log('═'.repeat(60) + '\n');
    return;
  }

  // ── SEND ──
  console.log('\n' + '🔴'.repeat(20));
  console.log('   SENDING...');
  console.log('🔴'.repeat(20) + '\n');

  let grandTotal = 0;
  for (const seg of segments) {
    if (ONLY_SEGMENTS && !ONLY_SEGMENTS.includes(seg.num)) {
      console.log(`\n⏭️  Skipping [${seg.num}] ${seg.name}`);
      continue;
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`SENDING [${seg.num}] ${seg.name}`);
    console.log(`${'═'.repeat(60)}`);

    try {
      const sent = await sendBroadcastSegment(
        seg.name,
        seg.template.subject,
        seg.template.html,
        seg.contacts
      );

      // Tag contacts
      console.log(`   🏷️  Tagging ${seg.contacts.length} contacts with '${seg.template.tag}'...`);
      for (const c of seg.contacts) {
        const newTags = [...new Set([...(c.tags || []), seg.template.tag, 'email_sent', 'discount_sent'])];
        await updateContact(c.id, newTags);
      }
      console.log(`   ✅ Segment [${seg.num}] complete! Sent: ${sent}`);
      grandTotal += sent;

      // Pause between segments to avoid rate limits
      if (segments.indexOf(seg) < segments.length - 1) {
        console.log('   ⏳ Pausing 5s before next segment...');
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (err) {
      console.error(`   ❌ FAILED [${seg.num}]: ${err.message}`);
    }
  }

  console.log('\n' + '✅'.repeat(20));
  console.log(`   MEGA BLAST COMPLETE - ${grandTotal} emails sent across all segments`);
  console.log('✅'.repeat(20) + '\n');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
