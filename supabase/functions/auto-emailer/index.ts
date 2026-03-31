import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Auto-Emailer Cron Function
 * 
 * Runs every 15 minutes via pg_cron. Handles:
 * 1. Form abandonment → discount email (30 min after form_started, no form_lead)
 * 2. New buyer confirmation → Zoom link + guide/checklist (original webinar)
 * 3. Recording buyer confirmation → portal access + package-specific content
 * 4. Clicker discount → 25% off nudge
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM = "dylan@yourearlyedge.co.uk";

const ZOOM = "https://us05web.zoom.us/j/81619515454?pwd=Es8e29zvOEAsJ45BoSICugps7ataVp.1";
const GUIDE = "https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62";
const CHECKLIST = "https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist";
const WEBINAR_LINK = "https://webinar.yourearlyedge.co.uk/webinar";
const PORTAL_LINK = "https://webinar.yourearlyedge.co.uk/portal";
const PORTAL_LOGIN = "https://webinar.yourearlyedge.co.uk/login?redirect=/portal";
const BOOK_UTHMAN = "https://webinar.yourearlyedge.co.uk/portal/book-uthman";

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

// ═══════════════════════════════════════════
//  NEW: Recording Purchase Confirmation Emails
// ═══════════════════════════════════════════

function recordingOnlyConfirmation(firstName: string) {
  return {
    subject: "you're in — here's your recording access",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("You're in. Your recording access is ready.") +
      p("Uthman's full Cold Email Masterclass — 90 minutes of the exact system he used to land 20 internship offers using nothing but cold emails. No connections, no crazy CV, just a system that works.") +
      p("Here's what's inside:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; How to find emails of CEOs and decision-makers at <strong>any</strong> firm<br>&#8226; The exact email template behind a 21% reply rate<br>&#8226; Live demo of the mail-merge system (50+ emails/day, zero spam)<br>&#8226; Follow-up sequences that keep conversations alive<br>&#8226; The full Q&A with real student questions answered</td></tr>` +
      p("To access your recording, sign in to the Cold Email Platform with the email you used to purchase:") +
      btn("Access Your Recording", PORTAL_LOGIN) +
      p(`Here's the cold email checklist as a quick reference to get started: <a href="${CHECKLIST}" style="color:#0066cc;">Download&nbsp;Checklist</a>`) +
      p("Watch it, take notes, and start sending emails this week. That's the plan."),
      "Don & Dylan"
    ),
  };
}

function recordingBundleConfirmation(firstName: string) {
  return {
    subject: "you're in — recording + guide ready",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("You're in. Good decision — you went for the full bundle so you're getting everything.") +
      p("Uthman's full Cold Email Masterclass recording + the complete Cold Email Guide. This is the exact system he used to land 20 internship offers.") +
      p("Here's what you've got:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Full recording</strong> — 90-min masterclass with live Q&A<br>&#8226; <strong>Cold Email Guide</strong> — the complete written playbook<br>&#8226; <strong>Cold Email Checklist</strong> — quick reference sheet<br>&#8226; <strong>Platform access</strong> — everything in one place</td></tr>` +
      p("Sign in to the Cold Email Platform to access everything:") +
      btn("Access Your Platform", PORTAL_LOGIN) +
      p("Your Cold Email Guide is also available here:") +
      btn("Open Cold Email Guide", GUIDE) +
      p(`And here's the checklist for quick reference: <a href="${CHECKLIST}" style="color:#0066cc;">Download Checklist</a>`) +
      p("Honestly, start with the guide. Read through it, then watch the recording to see Uthman do it live. That combo is how people get results fastest."),
      "Don & Dylan"
    ),
  };
}

function recordingPremiumConfirmation(firstName: string) {
  return {
    subject: "you're in — recording + guide + 1:1 call booked",
    html: wrap(
      p(`Hey ${firstName || "there"},`) +
      p("You're in. You went for the premium package — smart move. This is the fastest path to results.") +
      p("Here's everything you've got:") +
      `<tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 20px;">&#8226; <strong>Full recording</strong> — 90-min masterclass with live Q&A<br>&#8226; <strong>Cold Email Guide</strong> — the complete written playbook<br>&#8226; <strong>Cold Email Checklist</strong> — quick reference sheet<br>&#8226; <strong>1-on-1 call with Uthman</strong> — personalised strategy session<br>&#8226; <strong>Platform access</strong> — everything in one place</td></tr>` +
      p("Step 1: Sign in to the Cold Email Platform to access everything:") +
      btn("Access Your Platform", PORTAL_LOGIN) +
      p("Step 2: Read through your Cold Email Guide:") +
      btn("Open Cold Email Guide", GUIDE) +
      p("Step 3: Book your 1-on-1 call with Uthman. He'll review your specific situation, help you build your lead list, and create custom templates for your target industry:") +
      btn("Book Your Call with Uthman", BOOK_UTHMAN) +
      p("Pro tip: Watch the recording and read the guide <strong>before</strong> your call with Uthman. You'll get 10x more out of it if you come prepared with questions."),
      "Don & Dylan"
    ),
  };
}

// ── Send via Resend Marketing (broadcast) to bypass transactional quota ──
async function sendEmail(to: string, subject: string, html: string) {
  const headers = { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" };

  // 1. Create a temporary audience
  const audRes = await fetch("https://api.resend.com/audiences", {
    method: "POST", headers,
    body: JSON.stringify({ name: `auto_${Date.now()}_${to.split("@")[0]}` }),
  });
  const aud = await audRes.json();
  if (!aud.id) throw new Error(`Audience create failed: ${JSON.stringify(aud)}`);

  // 2. Add the single contact
  await fetch(`https://api.resend.com/audiences/${aud.id}/contacts`, {
    method: "POST", headers,
    body: JSON.stringify({ email: to, unsubscribed: false }),
  });

  // 3. Create broadcast
  const brRes = await fetch("https://api.resend.com/broadcasts", {
    method: "POST", headers,
    body: JSON.stringify({ audience_id: aud.id, from: FROM, subject, html, name: `auto_${subject.slice(0, 30)}` }),
  });
  const br = await brRes.json();
  if (!br.id) throw new Error(`Broadcast create failed: ${JSON.stringify(br)}`);

  // 4. Send broadcast
  const sendRes = await fetch(`https://api.resend.com/broadcasts/${br.id}/send`, {
    method: "POST", headers, body: "{}",
  });
  if (!sendRes.ok) throw new Error(`Broadcast send failed: ${await sendRes.text()}`);

  // 5. Clean up audience
  await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: "DELETE", headers });

  return { success: true };
}

// ── Main handler ──
Deno.serve(async (_req) => {
  const results = { form_abandon: 0, buyer_confirm: 0, recording_confirm: 0, clicker_discount: 0, errors: [] as string[] };

  try {
    // ═══ 1. FORM ABANDONMENT ═══
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

    // ═══ 2. NEW BUYER CONFIRMATIONS (original webinar + recording) ═══
    const { data: newBuyers } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, metadata")
      .eq("status", "converted")
      .not("tags", "cs", '["confirmation_sent"]');

    console.log(`📋 New buyers needing confirmation: ${newBuyers?.length || 0}`);

    for (const buyer of newBuyers || []) {
      try {
        const tags = buyer.tags || [];
        const meta = buyer.metadata || {};
        const productType = meta.product_type || "";
        const firstName = buyer.first_name || "";
        
        let template;
        let isRecording = false;
        
        // ── Determine which confirmation template to use ──
        if (productType === "recording_premium") {
          template = recordingPremiumConfirmation(firstName);
          isRecording = true;
        } else if (productType === "recording_bundle") {
          template = recordingBundleConfirmation(firstName);
          isRecording = true;
        } else if (productType === "recording_only" || tags.includes("recording_access")) {
          template = recordingOnlyConfirmation(firstName);
          isRecording = true;
        } else if (tags.includes("bundle")) {
          template = bundleConfirmation(firstName);
        } else {
          template = webinarOnlyConfirmation(firstName);
        }

        await sendEmail(buyer.email, template.subject, template.html);
        const newTags = [...new Set([...tags, "confirmation_sent"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", buyer.id);
        
        const typeLabel = isRecording ? `recording:${productType}` : (tags.includes("bundle") ? "bundle" : "webinar-only");
        console.log(`  ✅ Confirmation sent to ${buyer.email} (${typeLabel})`);
        
        if (isRecording) {
          results.recording_confirm++;
        } else {
          results.buyer_confirm++;
        }
      } catch (e: any) {
        console.error(`  ❌ Failed for ${buyer.email}: ${e.message}`);
        results.errors.push(`confirm:${buyer.email}:${e.message}`);
      }
    }

    // ═══ 3. CLICKER DISCOUNT ═══
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: clickers } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, status, metadata")
      .contains("tags", ["email_clicked"])
      .not("tags", "cs", '["stripe_customer"]')
      .not("tags", "cs", '["funnel_email_4"]')
      .not("tags", "cs", '["clicker_discount_sent"]')
      .neq("status", "converted");

    // Filter to only those who clicked more than 1 hour ago
    const clickerTargets = (clickers || []).filter(c => {
      const clickedAt = c.metadata?.last_click_at || c.metadata?.last_email_event_at;
      if (!clickedAt) return true;
      return new Date(clickedAt).getTime() < Date.now() - 60 * 60 * 1000;
    });

    console.log(`📋 Clickers needing discount: ${clickerTargets.length}`);

    const CLICKER_DISCOUNT = {
      subject: "you looked, here's 25% off",
      html: wrap(
        p("Hey,") +
        p("I noticed you clicked through to check out the cold email webinar but didn't grab a ticket.") +
        p("No worries. Here's a little nudge:") +
        p('Use code <strong style="background:#f5f5f5;padding:3px 10px;border-radius:4px;font-size:16px;letter-spacing:1px;">WEBINAR25</strong> at checkout for <strong>25% off the full bundle</strong>. That\'s the webinar + the complete cold email guide for just <strong>£21.75</strong> instead of £29.') +
        p("The webinar is <strong>this Saturday 28th March at 7pm GMT</strong>. Uthman is going live for 90 minutes to show you the exact system he used to land 20+ internship offers through cold email.") +
        p("No connections. No crazy CV. Just a system that works.") +
        btn("Grab your spot, 25% off", WEBINAR_LINK) +
        p("Or just the webinar for £10. No code needed.") +
        p("A recording is included if you can't make it live."),
        "Don't sleep on this\n</td></tr><tr><td style=\"font-size:15px;color:#222222;padding:0 0 2px 0;\">Dylan"
      ),
    };

    for (const clicker of clickerTargets) {
      try {
        await sendEmail(clicker.email, CLICKER_DISCOUNT.subject, CLICKER_DISCOUNT.html);
        const newTags = [...new Set([...(clicker.tags || []), "clicker_discount_sent", "funnel_email_4"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", clicker.id);
        console.log(`  ✅ Clicker discount sent to ${clicker.email}`);
        results.clicker_discount++;
      } catch (e: any) {
        console.error(`  ❌ Failed for ${clicker.email}: ${e.message}`);
        results.errors.push(`clicker:${clicker.email}:${e.message}`);
      }
    }

    console.log(`\n📊 Auto-emailer complete: ${results.form_abandon} abandon, ${results.buyer_confirm} webinar confirms, ${results.recording_confirm} recording confirms, ${results.clicker_discount} clicker discounts, ${results.errors.length} errors`);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error(`Auto-emailer error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
