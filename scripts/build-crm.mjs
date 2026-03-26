#!/usr/bin/env node
/**
 * build-crm.mjs — Aggregate all EarlyEdge contacts into Supabase crm_contacts
 *
 * Data sources:
 *   1. crm-linkedin-emails.json       — scraped LinkedIn commenters (email + name)
 *   2. linkedin-sent-emails.json       — emails already sent outreach (string[])
 *   3. data/unified_customers.csv      — Stripe paying customers
 *   4. data/send-discount-message.csv  — filled form but didn't purchase
 *   5. Supabase webinar_leads table    — webinar registrants
 *   6. Resend audiences               — all contacts in Resend audiences
 *   7. Resend sent emails              — delivery/open/click status for sent emails
 *
 * Deduplicates by lowercase email, assigns source + tags, upserts into crm_contacts.
 *
 * Usage:
 *   node scripts/build-crm.mjs
 *
 *   Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars, or it reads .env.local.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

/* ═══════════════════════ Config ═══════════════════════ */

function loadEnv() {
    const envPath = resolve(ROOT, ".env.local");
    if (!existsSync(envPath)) return {};
    const vars = {};
    readFileSync(envPath, "utf-8")
        .split("\n")
        .filter((l) => l.includes("=") && !l.startsWith("#"))
        .forEach((l) => {
            const [key, ...rest] = l.split("=");
            vars[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, '');
        });
    return vars;
}

const env = loadEnv();
const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY;

const RESEND_KEY =
    process.env.RESEND_API_KEY ||
    env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_KEY. Set them in .env.local or as env vars.");
    process.exit(1);
}

console.log(`\n🏗  EarlyEdge CRM Builder`);
console.log(`   Supabase: ${SUPABASE_URL}`);
console.log(`   Resend:   ${RESEND_KEY ? "✅ configured" : "⚠ not configured (skipping)"}\n`);

/* ═══════════════════════ Helpers ═══════════════════════ */

/** Simple CSV parser — handles quoted fields with commas */
function parseCSV(text) {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = parseCSVRow(lines[0]);
    return lines.slice(1).map((line) => {
        const vals = parseCSVRow(line);
        const obj = {};
        headers.forEach((h, i) => (obj[h.trim()] = (vals[i] || "").trim()));
        return obj;
    });
}

function parseCSVRow(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

function readJSON(filename) {
    const path = resolve(ROOT, filename);
    if (!existsSync(path)) {
        console.warn(`   ⚠ File not found: ${filename} — skipping`);
        return null;
    }
    return JSON.parse(readFileSync(path, "utf-8"));
}

function readCSVFile(filename) {
    const path = resolve(ROOT, filename);
    if (!existsSync(path)) {
        console.warn(`   ⚠ File not found: ${filename} — skipping`);
        return [];
    }
    return parseCSV(readFileSync(path, "utf-8"));
}

/** Split a full name into first + last */
function splitName(name) {
    if (!name) return { first: "", last: "" };
    const parts = name.trim().split(/\s+/);
    return {
        first: parts[0] || "",
        last: parts.slice(1).join(" ") || "",
    };
}

/* ═══════════════════════ Resend API helpers ═══════════════════════ */

async function resendGet(path) {
    const res = await fetch(`https://api.resend.com${path}`, {
        headers: { Authorization: `Bearer ${RESEND_KEY}` },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resend GET ${path} failed (${res.status}): ${text}`);
    }
    return res.json();
}

async function fetchAllResendAudiences() {
    const { data: audiences } = await resendGet("/audiences");
    const allContacts = [];
    for (const aud of audiences) {
        const { data: contacts } = await resendGet(`/audiences/${aud.id}/contacts`);
        for (const c of contacts) {
            allContacts.push({ ...c, audience_name: aud.name, audience_id: aud.id });
        }
    }
    return allContacts;
}

async function fetchResendEmails() {
    // Fetch sent emails in pages (Resend returns up to 50 per page)
    // Cap at 20 pages (1000 emails) to keep sync fast
    const MAX_PAGES = 20;
    const allEmails = [];
    let hasMore = true;
    let startAfter = null;
    let page = 0;
    while (hasMore && page < MAX_PAGES) {
        const query = startAfter
            ? `/emails?limit=50&starting_after=${startAfter}`
            : "/emails?limit=50";
        // Rate limit: Resend allows 5 req/sec; wait 300ms between pages
        if (startAfter) await new Promise((r) => setTimeout(r, 300));
        const result = await resendGet(query);
        const emails = result.data || [];
        allEmails.push(...emails);
        hasMore = result.has_more && emails.length > 0;
        if (emails.length > 0) {
            startAfter = emails[emails.length - 1].id;
        }
        page++;
    }
    if (hasMore) console.log(`      (capped at ${MAX_PAGES} pages / ${allEmails.length} emails)`);
    return allEmails;
}

/* ═══════════════════════ Supabase REST helpers ═══════════════════════ */

async function supabaseQuery(table, select = "*", filters = "") {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase GET ${table} failed (${res.status}): ${text}`);
    }
    return res.json();
}

async function supabaseUpsertBatch(table, rows, onConflict = "email") {
    // Supabase REST API upsert — batch of up to 1000
    const BATCH = 500;
    let upserted = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH);
        const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify(batch),
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`   ❌ Upsert batch failed (${res.status}): ${text}`);
            // Log first failing row for debugging
            console.error(`   First row in batch:`, JSON.stringify(batch[0], null, 2));
        } else {
            upserted += batch.length;
        }
    }
    return upserted;
}

/* ═══════════════════════ Collect contacts ═══════════════════════ */

/**
 * Contact map: email → { first_name, last_name, sources[], tags[], metadata, ... }
 * We merge multiple sources per contact.
 */
const contactMap = new Map();

function ensureContact(email) {
    const key = email.toLowerCase().trim();
    if (!key || !key.includes("@")) return null;
    if (!contactMap.has(key)) {
        contactMap.set(key, {
            email: key,
            first_name: "",
            last_name: "",
            phone: null,
            university: null,
            source: "other",        // will be upgraded
            source_detail: null,
            tags: new Set(),
            status: "new",
            notes: "",
            metadata: {},
            last_activity_at: new Date().toISOString(),
        });
    }
    return contactMap.get(key);
}

// ── 1. LinkedIn scraped emails (problem_aware) ──
console.log("📋 Reading LinkedIn scraped emails...");
const linkedinScraped = readJSON("crm-linkedin-emails.json");
if (linkedinScraped) {
    for (const entry of linkedinScraped) {
        const c = ensureContact(entry.email);
        if (!c) continue;
        const { first, last } = splitName(entry.name);
        if (!c.first_name && first) c.first_name = first;
        if (!c.last_name && last) c.last_name = last;
        c.tags.add("linkedin_scraped");
        c.tags.add("problem_aware");
        if (c.source === "other") c.source = "linkedin";
    }
    console.log(`   ✅ ${linkedinScraped.length} LinkedIn scraped contacts`);
}

// ── 2. LinkedIn sent emails (solution_aware) ──
console.log("📋 Reading LinkedIn sent emails...");
const linkedinSent = readJSON("linkedin-sent-emails.json");
if (linkedinSent) {
    for (const email of linkedinSent) {
        const c = ensureContact(email);
        if (!c) continue;
        c.tags.add("linkedin_emailed");
        c.tags.add("solution_aware");
        if (c.source === "other") c.source = "linkedin";
        if (c.status === "new") c.status = "contacted";
    }
    console.log(`   ✅ ${linkedinSent.length} LinkedIn sent emails`);
}

// ── 3. Stripe customers (most_aware) — LIVE from Stripe API ──
const STRIPE_KEY = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
    console.log("⚠️  No STRIPE_SECRET_KEY found, skipping live Stripe sync. Falling back to CSV.");
    const stripeCsv = readCSVFile("data/unified_customers.csv");
    for (const row of stripeCsv) {
        const email = row.Email || row.email;
        if (!email) continue;
        const c = ensureContact(email);
        if (!c) continue;
        const { first, last } = splitName(row.Name || row.name || "");
        if (!c.first_name && first) c.first_name = first;
        if (!c.last_name && last) c.last_name = last;
        c.tags.add("stripe_customer");
        c.tags.add("most_aware");
        c.source = "other";
        c.status = "converted";
        const spend = parseFloat(row["Total Spend"] || "0");
        c.metadata.stripe_spend = spend;
        c.metadata.stripe_id = row.id || "";
        c.source_detail = `Stripe -- £${spend.toFixed(0)}`;
    }
    console.log(`   ✅ ${stripeCsv.length} Stripe customers (from CSV fallback)`);
} else {
    console.log("📋 Fetching Stripe customers LIVE from API (since 16 Mar 2026)...");
    let allCharges = [];
    let hasMore = true;
    let startingAfter = null;
    const WEBINAR_LAUNCH = Math.floor(new Date("2026-03-16T00:00:00Z").getTime() / 1000);
    while (hasMore) {
        const params = new URLSearchParams({ limit: "100", "created[gte]": String(WEBINAR_LAUNCH) });
        if (startingAfter) params.set("starting_after", startingAfter);
        const res = await fetch(`https://api.stripe.com/v1/charges?${params}`, {
            headers: { Authorization: `Bearer ${STRIPE_KEY}` },
        });
        if (!res.ok) {
            console.error("   ⚠️ Stripe API error:", await res.text());
            break;
        }
        const data = await res.json();
        allCharges.push(...data.data.filter(ch => ch.status === "succeeded" && ch.amount > 0));
        hasMore = data.has_more;
        if (data.data.length > 0) startingAfter = data.data[data.data.length - 1].id;
    }
    console.log(`   📦 ${allCharges.length} successful charges found`);

    // Group by email
    const byEmail = {};
    for (const charge of allCharges) {
        const email = (charge.billing_details?.email || charge.receipt_email || "").toLowerCase().trim();
        if (!email) continue;
        if (!byEmail[email]) byEmail[email] = { charges: [], total: 0, name: "" };
        byEmail[email].charges.push(charge);
        byEmail[email].total += charge.amount / 100;
        if (!byEmail[email].name && charge.billing_details?.name) byEmail[email].name = charge.billing_details.name;
    }

    let stripeCount = 0;
    for (const [email, info] of Object.entries(byEmail)) {
        const c = ensureContact(email);
        if (!c) continue;
        stripeCount++;
        const { first, last } = splitName(info.name);
        if (!c.first_name && first) c.first_name = first;
        if (!c.last_name && last) c.last_name = last;
        c.tags.add("stripe_customer");
        c.tags.add("most_aware");
        c.source = "other";
        c.status = "converted";
        c.metadata.stripe_spend = info.total;
        c.metadata.payment_count = info.charges.length;
        c.source_detail = `Stripe -- £${info.total.toFixed(0)} (${info.charges.length} payment${info.charges.length > 1 ? "s" : ""})`;

        // Determine ticket type from charge amounts
        const amounts = info.charges.map(ch => ch.amount);
        if (amounts.some(a => a >= 2200)) {
            c.tags.add("bundle");
        } else if (amounts.some(a => a >= 900 && a <= 1100)) {
            c.tags.add("webinar_only");
            c.tags.add("webinar_only_buyer");
            c.metadata.webinar_ticket = "webinar-only";
        }
        if (amounts.some(a => a >= 1100 && a <= 1300)) {
            c.tags.add("guide_purchased");
        }
    }
    console.log(`   ✅ ${stripeCount} unique Stripe customers (LIVE)`);
}

// ── 4. Form leads who didn't buy (product_aware) ──
console.log("📋 Reading discount message leads...");
const discountCsv = readCSVFile("data/send-discount-message.csv");
for (const row of discountCsv) {
    const email = row.email;
    if (!email) continue;
    const c = ensureContact(email);
    if (!c) continue;
    if (!c.first_name && row.first_name) c.first_name = row.first_name;
    if (!c.last_name && row.last_name) c.last_name = row.last_name;
    c.tags.add("form_lead");
    c.tags.add("product_aware");
    if (c.source === "other") c.source = "other";
    if (!c.source_detail) c.source_detail = "Filled form, didn't purchase";
}
console.log(`   ✅ ${discountCsv.length} form leads`);

// ── 5. Webinar leads from Supabase ──
console.log("📋 Fetching webinar leads from Supabase...");
try {
    const webinarLeads = await supabaseQuery("webinar_leads");
    for (const lead of webinarLeads) {
        const email = lead.email;
        if (!email) continue;
        const c = ensureContact(email);
        if (!c) continue;
        if (!c.first_name && lead.first_name) c.first_name = lead.first_name;
        if (!c.last_name && lead.last_name) c.last_name = lead.last_name;
        if (!c.phone && lead.phone) c.phone = lead.phone;
        if (!c.university && lead.university) c.university = lead.university;
        c.tags.add("webinar_registered");
        c.tags.add("product_aware");
        if (c.source === "other" || c.source === "linkedin") c.source = "webinar";
        c.metadata.webinar_ticket = lead.ticket_type || lead.plan || "";
    }
    console.log(`   ✅ ${webinarLeads.length} webinar leads`);
} catch (err) {
    console.warn(`   ⚠ Could not fetch webinar_leads: ${err.message}`);
    console.warn(`   (Table may not exist — continuing without webinar data)`);
}

// ── 6. Resend audience contacts ──
if (RESEND_KEY) {
    console.log("📋 Fetching Resend audience contacts...");
    try {
        const resendContacts = await fetchAllResendAudiences();
        const audienceNames = new Set();
        for (const rc of resendContacts) {
            const email = rc.email;
            if (!email) continue;
            const c = ensureContact(email);
            if (!c) continue;
            // Use Resend first/last name if we don't have one
            if (!c.first_name && rc.first_name) c.first_name = rc.first_name;
            if (!c.last_name && rc.last_name) c.last_name = rc.last_name;
            c.tags.add("resend_audience");
            c.tags.add(`audience:${rc.audience_name.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40)}`);
            audienceNames.add(rc.audience_name);
            // If unsubscribed in Resend, mark them
            if (rc.unsubscribed) {
                c.tags.add("resend_unsubscribed");
                c.status = "unsubscribed";
            }
        }
        console.log(`   ✅ ${resendContacts.length} Resend contacts across ${audienceNames.size} audience(s)`);
        for (const name of audienceNames) console.log(`      • ${name}`);
    } catch (err) {
        console.warn(`   ⚠ Resend audiences error: ${err.message}`);
    }

    // ── 7. Resend sent email history (delivery/open/click tracking) ──
    console.log("📋 Fetching Resend sent email history...");
    try {
        const sentEmails = await fetchResendEmails();
        const statusCounts = {};
        for (const em of sentEmails) {
            const toEmail = (em.to || [])[0];
            if (!toEmail) continue;
            const c = ensureContact(toEmail);
            if (!c) continue;
            c.tags.add("email_sent");
            // Track delivery status
            const event = em.last_event || "sent";
            c.tags.add(`email_${event}`);
            statusCounts[event] = (statusCounts[event] || 0) + 1;
            // Track email metadata
            if (!c.metadata.emails_sent) c.metadata.emails_sent = 0;
            c.metadata.emails_sent++;
            c.metadata.last_email_subject = em.subject;
            c.metadata.last_email_status = event;
            c.metadata.last_email_date = em.created_at;
            // Upgrade status based on engagement
            if (event === "clicked" && c.status !== "converted") c.status = "engaged";
            else if (event === "opened" && c.status === "new") c.status = "contacted";
            else if (event === "delivered" && c.status === "new") c.status = "contacted";
            else if (event === "bounced") c.tags.add("bounced");
        }
        console.log(`   ✅ ${sentEmails.length} sent emails tracked`);
        for (const [status, count] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) {
            console.log(`      • ${status}: ${count}`);
        }
    } catch (err) {
        console.warn(`   ⚠ Resend email history error: ${err.message}`);
    }
} else {
    console.log("⏭  Skipping Resend sync (no RESEND_API_KEY)\n");
}

/* ═══════════════════════ Assign final source priority ═══════════════════════ */

// Source priority: stripe > webinar > linkedin > other
const SOURCE_PRIORITY = {
    manual: 0,
    other: 1,
    linkedin: 2,
    student_signup: 3,
    coach_signup: 4,
    webinar: 5,
};

for (const c of contactMap.values()) {
    // If they're a Stripe customer, override source detail
    if (c.tags.has("stripe_customer")) {
        // Keep status as converted, source_detail as Stripe info
        // Source stays as "other" but source_detail marks them as Stripe
    }
    // Capitalize names
    if (c.first_name) c.first_name = c.first_name.charAt(0).toUpperCase() + c.first_name.slice(1);
    if (c.last_name) c.last_name = c.last_name.charAt(0).toUpperCase() + c.last_name.slice(1);
}

/* ═══════════════════════ Upsert to Supabase ═══════════════════════ */

const contacts = Array.from(contactMap.values()).map((c) => ({
    email: c.email,
    first_name: c.first_name || "",
    last_name: c.last_name || "",
    phone: c.phone,
    university: c.university,
    source: c.source,
    source_detail: c.source_detail,
    tags: Array.from(c.tags),
    status: c.status,
    notes: c.notes,
    last_activity_at: c.last_activity_at,
    metadata: c.metadata,
}));

console.log(`\n📊 Summary:`);
console.log(`   Total unique contacts: ${contacts.length}`);
console.log(`   LinkedIn scraped:      ${contacts.filter((c) => c.tags.includes("linkedin_scraped")).length}`);
console.log(`   LinkedIn emailed:      ${contacts.filter((c) => c.tags.includes("linkedin_emailed")).length}`);
console.log(`   Stripe customers:      ${contacts.filter((c) => c.tags.includes("stripe_customer")).length}`);
console.log(`   Form leads:            ${contacts.filter((c) => c.tags.includes("form_lead")).length}`);
console.log(`   Webinar registered:    ${contacts.filter((c) => c.tags.includes("webinar_registered")).length}`);
console.log(`   Resend audience:       ${contacts.filter((c) => c.tags.includes("resend_audience")).length}`);
console.log(`   Email sent via Resend: ${contacts.filter((c) => c.tags.includes("email_sent")).length}`);
console.log(`   Email clicked:         ${contacts.filter((c) => c.tags.includes("email_clicked")).length}`);
console.log(`   Email bounced:         ${contacts.filter((c) => c.tags.includes("bounced")).length}`);
console.log(`   Status converted:      ${contacts.filter((c) => c.status === "converted").length}`);
console.log(`   Status engaged:        ${contacts.filter((c) => c.status === "engaged").length}`);
console.log(`   Status contacted:      ${contacts.filter((c) => c.status === "contacted").length}`);
console.log(`   Status new:            ${contacts.filter((c) => c.status === "new").length}`);

console.log(`\n🚀 Upserting ${contacts.length} contacts to Supabase crm_contacts...`);
try {
    const count = await supabaseUpsertBatch("crm_contacts", contacts);
    console.log(`   ✅ Successfully upserted ${count} contacts!`);
} catch (err) {
    console.error(`   ❌ Upsert failed: ${err.message}`);
    process.exit(1);
}

console.log(`\n✨ CRM build complete! Visit /admin/crm to see your contacts.\n`);
