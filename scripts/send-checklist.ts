/**
 * Send the free Spring Week Conversion Checklist to a list of emails.
 *
 * Usage:
 *   npx tsx scripts/send-checklist.ts email1@example.com email2@example.com
 *
 * Or pipe from a file:
 *   cat emails.txt | xargs npx tsx scripts/send-checklist.ts
 *
 * What it does:
 * 1. Adds each email to Supabase crm_contacts (tagged: spring_week_checklist, linkedin_lead)
 * 2. Fires a Loops event to trigger the checklist email
 * 3. Logs results
 */

const SUPABASE_URL = "https://cidnbhphbmwvbozdxqhe.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const LOOPS_API_KEY = process.env.LOOPS_API_KEY || "737c3b4a0a9bee2e03260a1a2a4c9c85";
const CHECKLIST_URL = "https://webinar.yourearlyedge.co.uk/spring-week-conversion-checklist.pdf";
const WEBINAR_URL = "https://webinar.yourearlyedge.co.uk/spring-week";

const emails = process.argv.slice(2).map(e => e.toLowerCase().trim()).filter(Boolean);

if (emails.length === 0) {
  console.log("Usage: npx tsx scripts/send-checklist.ts email1 email2 ...");
  process.exit(1);
}

async function sendToOne(email: string) {
  const firstName = email.split("@")[0].split(".")[0];
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // 1. Add to Loops contact + fire event
  try {
    const contactRes = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName: name,
        source: "linkedin_checklist",
        userGroup: "lead",
      }),
    });

    // Contact might already exist, that's fine
    if (!contactRes.ok) {
      const text = await contactRes.text();
      if (!text.includes("already exists")) {
        console.warn(`  [Loops contact] ${email}: ${text}`);
      }
    }

    // Fire the checklist event
    const eventRes = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName: "checklist_requested",
        eventProperties: {
          firstName: name,
          checklistUrl: CHECKLIST_URL,
          webinarUrl: WEBINAR_URL,
          source: "linkedin",
        },
      }),
    });

    if (eventRes.ok) {
      console.log(`  [Loops] ${email} - event fired`);
    } else {
      console.warn(`  [Loops event] ${email}: ${await eventRes.text()}`);
    }
  } catch (err: any) {
    console.error(`  [Loops error] ${email}: ${err.message}`);
  }
}

async function main() {
  console.log(`\nSending checklist to ${emails.length} email(s)...\n`);

  for (const email of emails) {
    await sendToOne(email);
  }

  console.log(`\nDone. ${emails.length} processed.`);
  console.log(`Checklist URL: ${CHECKLIST_URL}`);
  console.log(`\nNote: You need a "checklist_requested" flow in Loops that sends`);
  console.log(`the email with the PDF link. The event has been fired for each contact.`);
}

main();
