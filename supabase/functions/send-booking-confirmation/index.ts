import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Send booking confirmation emails via Resend Broadcast pattern.
 * Called from the frontend after Stripe payment success redirect.
 *
 * Sends TWO broadcasts:
 *   1. Confirmation email to the student
 *   2. Notification email to Uthman
 */

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Uthman <uthman@yourearlyedge.co.uk>";
const UTHMAN_EMAIL = "uthman6696@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ── Broadcast helper (same pattern as send-portal-access) ── */
async function sendViaBroadcast(to: string, subject: string, html: string, tag: string) {
  const headers = { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" };

  // 1. Create temp audience
  const audRes = await fetch("https://api.resend.com/audiences", {
    method: "POST", headers,
    body: JSON.stringify({ name: `booking_${tag}_${Date.now()}` }),
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
    body: JSON.stringify({
      audience_id: aud.id,
      from: FROM_EMAIL,
      subject,
      html,
      name: `booking_${tag}_${to.split("@")[0]}`,
    }),
  });
  const br = await brRes.json();
  if (!br.id) throw new Error(`Broadcast create failed: ${JSON.stringify(br)}`);

  // 4. Send
  const sendRes = await fetch(`https://api.resend.com/broadcasts/${br.id}/send`, {
    method: "POST", headers, body: "{}",
  });
  if (!sendRes.ok) throw new Error(`Broadcast send failed: ${await sendRes.text()}`);

  // 5. Cleanup audience
  await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: "DELETE", headers });

  console.log(`📧 Broadcast sent to ${to}: "${subject}"`);
}

/* ── Email HTML builders ── */

function buildStudentEmail(name: string, sessionName: string, duration: string, dateStr: string, time: string, price: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
<tr><td style="font-size:13px;color:#999999;padding:0 0 24px 0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span> <span style="font-weight:300;color:#bbbbbb;">Cold Email</span></td></tr>
<tr><td style="font-size:22px;font-weight:600;color:#111111;padding:0 0 8px 0;">Booking confirmed</td></tr>
<tr><td style="font-size:15px;color:#555555;padding:0 0 24px 0;line-height:1.6;">Hey ${name}, your session with Uthman is locked in. Here are the details:</td></tr>
<tr><td style="background-color:#f9f9f9;border-radius:12px;padding:20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-size:12px;color:#999;padding:0 0 4px 0;">SESSION</td></tr>
<tr><td style="font-size:15px;font-weight:600;color:#111;padding:0 0 16px 0;">${sessionName} (${duration})</td></tr>
<tr><td style="font-size:12px;color:#999;padding:0 0 4px 0;">DATE &amp; TIME</td></tr>
<tr><td style="font-size:15px;font-weight:600;color:#111;padding:0 0 16px 0;">${dateStr} at ${time}</td></tr>
<tr><td style="font-size:12px;color:#999;padding:0 0 4px 0;">ZOOM</td></tr>
<tr><td style="font-size:15px;padding:0 0 16px 0;color:#555;">Uthman will send you a Zoom link before your session</td></tr>
<tr><td style="font-size:12px;color:#999;padding:0 0 4px 0;">PRICE</td></tr>
<tr><td style="font-size:15px;font-weight:600;color:#111;padding:0;">${price}</td></tr>
</table>
</td></tr>
<tr><td style="font-size:14px;color:#888;padding:20px 0 0 0;line-height:1.6;">Need to reschedule? Just reply to this email at least 24 hours before your session.</td></tr>
<tr><td style="font-size:15px;color:#222;padding:24px 0 2px 0;">Uthman</td></tr>
<tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>
</table></td></tr></table></body></html>`;
}

function buildUthmanEmail(studentName: string, studentEmail: string, sessionName: string, duration: string, dateStr: string, time: string, price: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<div style="max-width:480px;margin:0 auto;padding:32px 16px;">
<h2 style="color:#111;margin:0 0 8px 0;">New booking</h2>
<p style="color:#555;font-size:15px;margin:0 0 20px 0;">Someone just booked a session with you.</p>
<div style="background:#f9f9f9;border-radius:12px;padding:20px;">
<p style="margin:0 0 4px 0;font-size:12px;color:#999;">STUDENT</p>
<p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:#111;">${studentName} (${studentEmail})</p>
<p style="margin:0 0 4px 0;font-size:12px;color:#999;">SESSION</p>
<p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:#111;">${sessionName} (${duration})</p>
<p style="margin:0 0 4px 0;font-size:12px;color:#999;">DATE &amp; TIME</p>
<p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:#111;">${dateStr} at ${time}</p>
<p style="margin:0 0 4px 0;font-size:12px;color:#999;">PRICE</p>
<p style="margin:0 0 0 0;font-size:15px;font-weight:600;color:#111;">${price}</p>
</div>
<p style="color:#888;font-size:14px;margin:20px 0 0 0;">Please send them a Zoom link before the session.</p>
</div></body></html>`;
}

/* ── Main handler ── */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_KEY) {
      throw new Error("RESEND_API_KEY not set");
    }

    const {
      studentEmail,
      studentName,
      sessionName,
      sessionId,
      duration,
      dateStr,
      time,
      price,
    } = await req.json();

    if (!studentEmail || !sessionName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing booking confirmation for ${studentEmail}: ${sessionName} on ${dateStr} at ${time}`);

    const errors: string[] = [];

    // 1. Send confirmation to student
    try {
      await sendViaBroadcast(
        studentEmail,
        `Booking confirmed: ${sessionName} on ${dateStr}`,
        buildStudentEmail(studentName || "there", sessionName, duration || "", dateStr || "", time || "", price || ""),
        `student_${sessionId || "session"}`
      );
    } catch (e: any) {
      console.error(`Failed to send student email: ${e.message}`);
      errors.push(`student: ${e.message}`);
    }

    // 2. Send notification to Uthman
    try {
      await sendViaBroadcast(
        UTHMAN_EMAIL,
        `New booking: ${studentName} - ${sessionName} on ${dateStr}`,
        buildUthmanEmail(studentName || "Student", studentEmail, sessionName, duration || "", dateStr || "", time || "", price || ""),
        `uthman_${sessionId || "session"}`
      );
    } catch (e: any) {
      console.error(`Failed to send Uthman notification: ${e.message}`);
      errors.push(`uthman: ${e.message}`);
    }

    const status = errors.length === 0 ? "ok" : "partial";
    console.log(`Booking confirmation result: ${status} (${errors.length} errors)`);

    return new Response(JSON.stringify({ status, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
