#!/usr/bin/env node
/**
 * send-crm-email.mjs — Send emails from CRM templates via Resend
 *
 * Usage:
 *   node scripts/send-crm-email.mjs --list                    # List templates
 *   node scripts/send-crm-email.mjs --template=<name> --segment=<segment> --dry-run
 *   node scripts/send-crm-email.mjs --template=<name> --segment=<segment> --send
 *   node scripts/send-crm-email.mjs --template=<name> --to=email@example.com --send
 *
 * Merge fields: {name}, {first_name}, {last_name}, {email}
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
    const p = resolve(ROOT, ".env.local");
    if (!existsSync(p)) return {};
    const vars = {};
    readFileSync(p, "utf-8").split("\n").filter(l => l.includes("=") && !l.startsWith("#")).forEach(l => {
        const [key, ...rest] = l.split("=");
        vars[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, '');
    });
    return vars;
}

const env = loadEnv();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || env.FROM_EMAIL || "dylan@yourearlyedge.co.uk";

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("❌ Missing Supabase config"); process.exit(1); }
if (!RESEND_KEY) { console.error("❌ Missing RESEND_API_KEY"); process.exit(1); }

const SEGMENTS = {
    all: () => true,
    scraped_not_emailed: (c) => c.tags?.includes("linkedin_scraped") && !c.tags?.includes("linkedin_emailed") && !c.tags?.includes("email_sent"),
    emailed_no_click: (c) => (c.tags?.includes("linkedin_emailed") || c.tags?.includes("email_sent")) && !c.tags?.includes("email_clicked"),
    clicked_not_bought: (c) => c.tags?.includes("email_clicked") && !c.tags?.includes("stripe_customer"),
    form_not_bought: (c) => c.tags?.includes("form_lead") && !c.tags?.includes("stripe_customer"),
    form_no_discount: (c) => c.tags?.includes("form_lead") && !c.tags?.includes("stripe_customer") && !c.tags?.includes("email_sent"),
    bought: (c) => c.tags?.includes("stripe_customer") || c.status === "converted",
    hot_leads: (c) => (c.tags?.includes("email_clicked") || c.tags?.includes("form_lead")) && !c.tags?.includes("stripe_customer"),
    resend_only: (c) => c.tags?.includes("resend_audience") && !c.tags?.includes("linkedin_scraped") && !c.tags?.includes("form_lead"),
};

async function sbGet(table, select = "*") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) throw new Error(`Supabase GET ${table}: ${await res.text()}`);
    return res.json();
}

async function sbInsert(table, rows) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(`Supabase INSERT ${table}: ${await res.text()}`);
    return res.json();
}

function mergeMail(html, subject, contact) {
    const name = [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "there";
    const replace = (s) => s
        .replace(/\{name\}/gi, name)
        .replace(/\{first_name\}/gi, contact.first_name || "there")
        .replace(/\{last_name\}/gi, contact.last_name || "")
        .replace(/\{email\}/gi, contact.email || "");
    return { html: replace(html), subject: replace(subject) };
}

async function sendViaResend(to, subject, html) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
    return data;
}

// ── Parse args ──
const args = Object.fromEntries(process.argv.slice(2).map(a => {
    if (a.startsWith("--")) {
        const [k, ...v] = a.slice(2).split("=");
        return [k, v.join("=") || true];
    }
    return [a, true];
}));

async function main() {
    console.log("\n📧 CRM Email Sender\n");

    // List templates
    if (args.list) {
        const templates = await sbGet("crm_email_templates");
        if (templates.length === 0) { console.log("No templates found. Create one in the CRM."); return; }
        console.log("Templates:");
        templates.forEach(t => console.log(`  • ${t.name} — "${t.subject}" (segment: ${t.segment})`));
        return;
    }

    if (!args.template) {
        console.log("Usage:");
        console.log("  --list                          List templates");
        console.log("  --template=<name> --dry-run     Preview who would receive");
        console.log("  --template=<name> --send        Send for real");
        console.log("  --template=<name> --to=<email>  Send to one person");
        console.log("  --segment=<segment>             Filter (bought, hot_leads, etc.)");
        return;
    }

    // Load template
    const templates = await sbGet("crm_email_templates");
    const template = templates.find(t => t.name.toLowerCase() === args.template.toLowerCase());
    if (!template) { console.error(`❌ Template "${args.template}" not found. Use --list.`); process.exit(1); }
    console.log(`📋 Template: ${template.name}`);
    console.log(`   Subject: ${template.subject}`);

    // Load contacts
    const contacts = await sbGet("crm_contacts");
    const segmentKey = args.segment || template.segment || "all";
    const segmentFn = SEGMENTS[segmentKey] || SEGMENTS.all;
    let recipients;

    if (args.to) {
        recipients = contacts.filter(c => c.email.toLowerCase() === args.to.toLowerCase());
        if (recipients.length === 0) { console.error(`❌ Contact ${args.to} not found in CRM.`); process.exit(1); }
    } else {
        recipients = contacts.filter(segmentFn);
    }

    console.log(`   Segment: ${segmentKey}`);
    console.log(`   Recipients: ${recipients.length}\n`);

    if (args["dry-run"] || !args.send) {
        console.log("📝 DRY RUN — would send to:");
        recipients.forEach(c => {
            const { subject } = mergeMail(template.body_html, template.subject, c);
            console.log(`  • ${c.email} (${c.first_name || "?"} ${c.last_name || "?"}) — "${subject}"`);
        });
        console.log(`\nTo send for real, add --send`);
        return;
    }

    // Send
    let sent = 0, failed = 0;
    for (const c of recipients) {
        const { html, subject } = mergeMail(template.body_html, template.subject, c);
        try {
            const result = await sendViaResend(c.email, subject, html);
            await sbInsert("crm_email_sends", [{
                template_id: template.id, contact_id: c.id, email: c.email,
                resend_id: result.id, status: "sent",
            }]);
            sent++;
            console.log(`  ✅ ${c.email}`);
            await new Promise(r => setTimeout(r, 200)); // rate limit
        } catch (err) {
            failed++;
            console.log(`  ❌ ${c.email}: ${err.message}`);
        }
    }

    console.log(`\n📊 Sent: ${sent} | Failed: ${failed}`);
}

main().catch(err => { console.error("💥", err); process.exit(1); });
