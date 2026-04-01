import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Send portal access via Loops Event
 * Targets: Anyone with status "converted" who has NOT yet received this email
 * (tracked via "portal_access_sent" tag)
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY")!;

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
  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry_run") === "true";
  
  const results = { bundle_sent: 0, webinar_only_sent: 0, skipped: 0, errors: [] as string[] };

  try {
    const { data: buyers, error: fetchErr } = await supabase
      .from("crm_contacts")
      .select("id, email, first_name, tags, metadata")
      .eq("status", "converted")
      .not("tags", "cs", '["portal_access_sent"]');

    if (fetchErr) throw fetchErr;

    console.log(`📋 Buyers to send portal access email: ${buyers?.length || 0}`);
    if (dryRun) console.log("🔍 DRY RUN MODE - no emails will be sent");

    for (const buyer of buyers || []) {
      try {
        const tags = buyer.tags || [];
        const firstName = buyer.first_name || "";
        
        const isBundle = tags.includes("bundle") || 
                         tags.includes("recording_bundle") || 
                         tags.includes("recording_premium");

        if (dryRun) {
          console.log(`  📧 [DRY RUN] Would send portal access event to ${buyer.email} (isBundle: ${isBundle})`);
          isBundle ? results.bundle_sent++ : results.webinar_only_sent++;
          continue;
        }

        // Trigger Loops Event
        await sendLoopsEvent(buyer.email, "portal_access_granted", {
            firstName: firstName || "there",
            isBundle
        });

        const newTags = [...new Set([...tags, "portal_access_sent"])];
        await supabase.from("crm_contacts").update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
        }).eq("id", buyer.id);

        console.log(`  ✅ Portal access event sent to ${buyer.email} (isBundle: ${isBundle})`);
        isBundle ? results.bundle_sent++ : results.webinar_only_sent++;
      } catch (e: any) {
        console.error(`  ❌ Failed for ${buyer.email}: ${e.message}`);
        results.errors.push(`${buyer.email}:${e.message}`);
      }
    }

    console.log(`\n📊 Portal access event broadcast complete: ${results.bundle_sent} bundle, ${results.webinar_only_sent} webinar-only, ${results.errors.length} errors`);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error(`Portal access broadcast error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
