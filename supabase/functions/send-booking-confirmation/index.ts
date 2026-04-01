import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Send booking confirmation emails via Loops Event.
 * Called from the frontend after Stripe payment success redirect.
 *
 * Sends TWO events:
 *   1. `booking_confirmed` (to the student)
 *   2. `new_booking_notification` (to Uthman)
 */

const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY") || "";
const UTHMAN_EMAIL = "uthman6696@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendLoopsEvent(email: string, eventName: string, properties: any) {
  if (!LOOPS_API_KEY) {
      throw new Error("LOOPS_API_KEY not set");
  }
  const res = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${LOOPS_API_KEY}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          email,
          eventName,
          eventProperties: properties
      }),
  });
  if (!res.ok) {
      throw new Error(`Loops API error: ${await res.text()}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!LOOPS_API_KEY) {
      throw new Error("LOOPS_API_KEY not set");
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
      coachName,
      coachFirm,
      isSpringWeekCoaching,
    } = await req.json();

    if (!studentEmail || !sessionName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing booking confirmation for ${studentEmail}: ${sessionName} on ${dateStr} at ${time}`);

    const errors: string[] = [];
    const eventProps: Record<string, any> = {
        studentName: studentName || "there",
        studentEmail,
        sessionName,
        sessionId,
        duration: duration || "",
        dateStr: dateStr || "",
        time: time || "",
        price: price || "",
        bookUthmanLink: "https://webinar.yourearlyedge.co.uk/portal/book-uthman",
    };

    // Add coach details for spring week panellist coaching
    if (coachName) eventProps.coachName = coachName;
    if (coachFirm) eventProps.coachFirm = coachFirm;

    // Determine which event to fire based on coaching type
    const studentEventName = isSpringWeekCoaching
        ? "spring_week_coaching_booked"
        : "booking_confirmed";

    // 1. Send confirmation to student via Loops Event
    try {
      await sendLoopsEvent(studentEmail, studentEventName, eventProps);
      console.log(`Student ${studentEventName} event sent to ${studentEmail}`);
    } catch (e: any) {
      console.error(`Failed to send student email event: ${e.message}`);
      errors.push(`student: ${e.message}`);
    }

    // 2. Send notification to Uthman via Loops Event
    try {
      await sendLoopsEvent(UTHMAN_EMAIL, "new_booking_notification", eventProps);
      console.log(`Uthman notification event sent to ${UTHMAN_EMAIL}`);
    } catch (e: any) {
      console.error(`Failed to send Uthman notification event: ${e.message}`);
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
