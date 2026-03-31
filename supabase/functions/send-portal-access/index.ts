import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * One-shot broadcast: Send portal access email to all webinar buyers
 * 
 * Targets: Anyone with status "converted" who has NOT yet received this email
 * (tracked via "portal_access_sent" tag)
 * 
 * Two variants:
 *   1. Bundle buyers (tag "bundle") → recording + guide + checklist
 *   2. Webinar-only buyers → recording + checklist (no guide)
 * 
 * Invoke manually: supabase functions invoke send-portal-access
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM = "Dylan <dylan@yourearlyedge.co.uk>";

// ── Links ──
const PORTAL_LOGIN = "https://webinar.yourearlyedge.co.uk/login?redirect=/portal";
const GUIDE = "https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62";
const CHECKLIST = "https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist";
const BOOK_UTHMAN = "https://webinar.yourearlyedge.co.uk/portal/book-uthman";

// ── HTML helpers (same style as auto-emailer) ──
function p(t: string) {
  return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`;
}
function btn(t: string, u: string) {
  return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`;
}
function wrap(body: string, signoff = "Dylan") {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
${body}
<tr><td style="font-size:15px;color:#222222;padding:0 0 2px 0;">${signoff}</td></tr>
<tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
</table></td></tr></table></body></html>`;
}

// ── Email templates ──

function portalAccessBundle(firstName: string) {
  return {
    subject: "the recording is live",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("The webinar recording is live.") +
      p("Uthman's full Cold Email Masterclass - 90 minutes of the exact system he used to land 20 internship offers. It's ready for you to watch right now.") +
      p("Here's what's inside:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; How to find emails of CEOs and decision-makers at any firm<br>&#8226; The exact email template behind a 21% reply rate<br>&#8226; Live demo of the mail-merge system (50+ emails/day)<br>&#8226; Follow-up sequences that keep conversations alive<br>&#8226; Full Q&amp;A with real student questions answered</td></tr>` +
      p("We've put everything on the Cold Email Platform so it's all in one place - your recording, the guide, the checklist, and Uthman's booking page.") +
      p("Log in with the email you used to buy and it's all there:") +
      btn("Watch the Recording", PORTAL_LINK) +
      p("And if you want personalised help, Uthman does 1-on-1 strategy calls where he'll build your lead list and write custom templates for your target industry:") +
      btn("Book a Call with Uthman", BOOK_UTHMAN) +
      p("Any questions, just reply to this email."),
      "Dylan"
    ),
  };
}

function portalAccessWebinarOnly(firstName: string) {
  return {
    subject: "the recording is live",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("The webinar recording is live.") +
      p("Uthman's full Cold Email Masterclass - 90 minutes of the exact system he used to land 20 internship offers. It's ready for you to watch right now.") +
      p("Here's what's inside:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; How to find emails of CEOs and decision-makers at any firm<br>&#8226; The exact email template behind a 21% reply rate<br>&#8226; Live demo of the mail-merge system (50+ emails/day)<br>&#8226; Follow-up sequences that keep conversations alive<br>&#8226; Full Q&amp;A with real student questions answered</td></tr>` +
      p("We've put everything on the Cold Email Platform so it's all in one place - your recording, the checklist, and Uthman's booking page.") +
      p("Log in with the email you used to buy and it's all there:") +
      btn("Watch the Recording", PORTAL_LINK) +
      p("And if you want personalised help, Uthman does 1-on-1 strategy calls where he'll build your lead list and write custom templates for your target industry:") +
      btn("Book a Call with Uthman", BOOK_UTHMAN) +
      p("Any questions, just reply to this email."),
      "Dylan"
    ),
  };
}

// ── Send via Resend broadcast (same pattern as auto-emailer) ──
async function sendEmail(to: string, subject: string, html: string) {
  const headers = { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" };

  // 1. Create temp audience
  const audRes = await fetch("https://api.resend.com/audiences", {
    method: "POST", headers,
    body: JSON.stringify({ name: `portal_${Date.now()}_${to.split("@")[0]}` }),
  });
  const aud = await audRes.json();
  if (!aud.id) throw new Error(`Audience create failed: ${JSON.stringify(aud)}`);

  // 2. Add contact
  await fetch(`https://api.resend.com/audiences/${aud.id}/contacts`, {
    method: "POST", headers,
    body: JSON.stringify({ email: to, unsubscribed: false }),
  });

  // 3. Create broadcast
  const brRes = await fetch("https://api.resend.com/broadcasts", {
    method: "POST", headers,
    body: JSON.stringify({ audience_id: aud.id, from: FROM, subject, html, name: `portal_access_${to.split("@")[0]}` }),
  });
  const br = await brRes.json();
  if (!br.id) throw new Error(`Broadcast create failed: ${JSON.stringify(br)}`);

  // 4. Send
  const sendRes = await fetch(`https://api.resend.com/broadcasts/${br.id}/send`, {
    method: "POST", headers, body: "{}",
  });
  if (!sendRes.ok) throw new Error(`Broadcast send failed: ${await sendRes.text()}`);

  // 5. Cleanup
  await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: "DELETE", headers });

  return { success: true };
}

// ── Main handler ──
Deno.serve(async (req) => {
  // Optional: pass ?dry_run=true to preview without sending
  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry_run") === "true";
  
  const results = { bundle_sent: 0, webinar_only_sent: 0, skipped: 0, errors: [] as string[] };

  try {
    // Get ALL converted buyers who haven't received this email yet
    const { data: buyers, error: fetchErr } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, metadata")
      .eq("status", "converted")
      .not("tags", "cs", '["portal_access_sent"]');

    if (fetchErr) throw fetchErr;

    console.log(`📋 Buyers to send portal access email: ${buyers?.length || 0}`);
    if (dryRun) console.log("🔍 DRY RUN MODE — no emails will be sent");

    for (const buyer of buyers || []) {
      try {
        const tags = buyer.tags || [];
        const firstName = buyer.first_name || "";
        
        // Determine if bundle buyer or webinar-only
        const isBundle = tags.includes("bundle") || 
                         tags.includes("recording_bundle") || 
                         tags.includes("recording_premium");
        
        const template = isBundle 
          ? portalAccessBundle(firstName) 
          : portalAccessWebinarOnly(firstName);

        if (dryRun) {
          console.log(`  📧 [DRY RUN] Would send "${template.subject}" to ${buyer.email} (${isBundle ? "bundle" : "webinar-only"})`);
          isBundle ? results.bundle_sent++ : results.webinar_only_sent++;
          continue;
        }

        await sendEmail(buyer.email, template.subject, template.html);

        // Tag as sent so we don't double-send
        const newTags = [...new Set([...tags, "portal_access_sent"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", buyer.id);

        console.log(`  ✅ Portal access sent to ${buyer.email} (${isBundle ? "bundle" : "webinar-only"})`);
        isBundle ? results.bundle_sent++ : results.webinar_only_sent++;
      } catch (e: any) {
        console.error(`  ❌ Failed for ${buyer.email}: ${e.message}`);
        results.errors.push(`${buyer.email}:${e.message}`);
      }
    }

    console.log(`\n📊 Portal access broadcast complete: ${results.bundle_sent} bundle, ${results.webinar_only_sent} webinar-only, ${results.errors.length} errors`);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error(`Portal access broadcast error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
