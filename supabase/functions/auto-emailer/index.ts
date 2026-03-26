import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Auto-Emailer Cron Function
 * 
 * Runs every 15 minutes via pg_cron. Handles:
 * 1. Form abandonment → discount email (30 min after form_started, no form_lead)
 * 2. New buyer confirmation → Zoom link + guide/checklist
 * 3. Future: scheduled nurture emails
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM = "dylan@yourearlyedge.co.uk";

const ZOOM = "https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1";
const GUIDE = "https://webinar.yourearlyedge.co.uk/resources/cold-email-guide";
const CHECKLIST = "https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist";
const WEBINAR_LINK = "https://webinar.yourearlyedge.co.uk/webinar";

// ── Email helpers ──
function p(t: string) { return `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">${t}</td></tr>`; }
function btn(t: string, u: string) { return `<tr><td style="padding:0 0 24px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#111111;border-radius:8px;"><a href="${u}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">${t}</a></td></tr></table></td></tr>`; }
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
const FORM_ABANDON_EMAIL = {
  subject: "still thinking about it?",
  html: wrap(
    p("Hey,") +
    p("I noticed you were checking out our cold email webinar earlier but didn't finish signing up.") +
    p("No pressure, but I wanted to make sure it wasn't a tech issue or anything.") +
    p("In case you were still on the fence, here's the quick version:") +
    `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; Our coach Uthman sent 1,000 cold emails<br>&#8226; Got a 21% response rate (average is 1-3%)<br>&#8226; Landed 20+ internship offers in 3 weeks<br>&#8226; He's going <strong>live on Saturday 28th March at 7pm GMT</strong> to show you exactly how</td></tr>` +
    p('The bundle is <strong>£29</strong> (webinar + full cold email guide + checklist), or just <strong>£10</strong> for the webinar alone.') +
    p('Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">WEBINAR25</strong> for <strong>25% off the bundle</strong>. Just £21.75.') +
    btn("Finish signing up", WEBINAR_LINK) +
    p("A recording is included if you can't make it live."),
    "Don't sleep on this\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
  ),
};

function bundleConfirmation(firstName: string) {
  return {
    subject: "you're in - here's everything you need",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("You're in. Good decision - you went for the full bundle so you're getting everything.") +
      p("On Saturday 28th March @7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email. The full strategy, the exact templates, the follow-up sequences, the mistakes etc.") +
      p("Here's what you need to know:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Date:</strong> Saturday 28th March<br>&#8226; <strong>Time:</strong> 7pm GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
      `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
      p("We'll also send you a reminder before we start so you don't miss it.") +
      p("Now, your guide. This is the exact cold email system Uthman used to land his offers, remastered and expanded with everything we've learned since. Templates, targeting strategy, follow-up sequences, the lot:") +
      btn("Download your Cold Email Guide", GUIDE) +
      p("Seriously, read through it before Saturday. You'll get 10x more out of the webinar if you come having already seen the framework.") +
      p(`Also here's the cold email checklist as a quick reference: <a href="${CHECKLIST}" style="color:#0066cc;">Download Checklist</a>`) +
      p("Can't make it live?") +
      p("Don't stress, you'll get the full recording sent to this email within 24 hours."),
      "See you there\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Don & Dylan"
    ),
  };
}

function webinarOnlyConfirmation(firstName: string) {
  return {
    subject: "you're in - here's your zoom link",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("You're in. Good decision.") +
      p("On Saturday 28th March @7pm GMT, Uthman is breaking down exactly how he landed 20 internship offers using nothing but cold email. The full strategy, the exact templates, the follow-up sequences, the mistakes etc.") +
      p("Here's what you need to know:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Zoom link:</strong> <a href="${ZOOM}" style="color:#0066cc;">Join Zoom Meeting</a><br>&#8226; <strong>Date:</strong> Saturday 28th March<br>&#8226; <strong>Time:</strong> 7pm GMT<br>&#8226; <strong>Duration:</strong> ~90 mins + live Q&A</td></tr>` +
      `<tr><td style="font-size:13px;line-height:22px;color:#888888;padding:0 0 20px 20px;">If the link doesn't work, open Zoom and join with Meeting ID: 816 1951 5454 / Passcode: 1FzZLi</td></tr>` +
      p("We'll also send you a reminder before we start so you don't miss it.") +
      p(`Oh and here's the cold email checklist to get you started before the webinar: <a href="${CHECKLIST}" style="color:#0066cc;">Download the Checklist</a>. Have a look through it so you can come with questions on Saturday.`) +
      p("Can't make it live?") +
      p("Don't stress, you'll get the full recording sent to this email within 24 hours."),
      "See you there\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Don & Dylan"
    ),
  };
}

// ── Send via Resend transactional API ──
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

// ── Main handler ──
Deno.serve(async (_req) => {
  const results = { form_abandon: 0, buyer_confirm: 0, errors: [] as string[] };

  try {
    // ═══ 1. FORM ABANDONMENT ═══
    // Find contacts tagged form_started but NOT form_lead and NOT converted
    // who last had activity >30 minutes ago
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: formAbandoners } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, status, last_activity_at")
      .contains("tags", ["form_started"])
      .not("tags", "cs", '["form_lead"]')
      .not("tags", "cs", '["stripe_customer"]')
      .not("tags", "cs", '["abandon_email_sent"]')
      .neq("status", "converted")
      .lt("last_activity_at", thirtyMinAgo);

    console.log(`📋 Form abandoners to email: ${formAbandoners?.length || 0}`);

    for (const contact of formAbandoners || []) {
      try {
        await sendEmail(contact.email, FORM_ABANDON_EMAIL.subject, FORM_ABANDON_EMAIL.html);
        const newTags = [...new Set([...(contact.tags || []), "abandon_email_sent", "funnel_email_4"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", contact.id);
        console.log(`  ✅ Abandon email sent to ${contact.email}`);
        results.form_abandon++;
      } catch (e: any) {
        console.error(`  ❌ Failed for ${contact.email}: ${e.message}`);
        results.errors.push(`abandon:${contact.email}:${e.message}`);
      }
    }

    // ═══ 2. NEW BUYER CONFIRMATIONS ═══
    // Find converted contacts without confirmation_sent tag
    const { data: newBuyers } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, metadata")
      .eq("status", "converted")
      .not("tags", "cs", '["confirmation_sent"]');

    console.log(`📋 New buyers needing confirmation: ${newBuyers?.length || 0}`);

    for (const buyer of newBuyers || []) {
      try {
        const tags = buyer.tags || [];
        const isBundle = tags.includes("bundle");
        const template = isBundle
          ? bundleConfirmation(buyer.first_name || "")
          : webinarOnlyConfirmation(buyer.first_name || "");

        await sendEmail(buyer.email, template.subject, template.html);
        const newTags = [...new Set([...tags, "confirmation_sent"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", buyer.id);
        console.log(`  ✅ Confirmation sent to ${buyer.email} (${isBundle ? "bundle" : "webinar-only"})`);
        results.buyer_confirm++;
      } catch (e: any) {
        console.error(`  ❌ Failed for ${buyer.email}: ${e.message}`);
        results.errors.push(`confirm:${buyer.email}:${e.message}`);
      }
    }

    console.log(`\n📊 Auto-emailer complete: ${results.form_abandon} abandon emails, ${results.buyer_confirm} confirmations, ${results.errors.length} errors`);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error(`Auto-emailer error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
