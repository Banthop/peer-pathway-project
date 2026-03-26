import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Resend Webhook Handler
 * 
 * Receives webhook events from Resend (delivered, opened, clicked, bounced, complained)
 * and automatically updates CRM contact tags + metadata.
 * 
 * Register this URL in Resend Dashboard → Settings → Webhooks:
 *   https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/resend-webhook
 * 
 * Events to subscribe: email.delivered, email.opened, email.clicked, email.bounced, email.complained
 */

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Map Resend event types to CRM tags
const EVENT_TAG_MAP: Record<string, string> = {
    "email.delivered": "email_delivered",
    "email.opened": "email_opened",
    "email.clicked": "email_clicked",
    "email.bounced": "bounced",
    "email.complained": "email_complained",
};

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type, svix-id, svix-timestamp, svix-signature",
            },
        });
    }

    try {
        const payload = await req.json();
        const eventType = payload.type as string;
        
        console.log(`📨 Received Resend event: ${eventType}`);

        const tag = EVENT_TAG_MAP[eventType];
        if (!tag) {
            console.log(`   Ignoring untracked event type: ${eventType}`);
            return new Response(JSON.stringify({ status: "ignored" }), { status: 200 });
        }

        // Extract recipient email from the event data
        const data = payload.data;
        const recipientEmail = (
            data.to?.[0] ||
            data.email ||
            data.recipient ||
            ""
        ).toLowerCase().trim();

        if (!recipientEmail) {
            console.log("   No recipient email found in payload");
            return new Response(JSON.stringify({ status: "no_email" }), { status: 200 });
        }

        console.log(`   Recipient: ${recipientEmail}, Tag: ${tag}`);

        // Find the CRM contact
        const { data: contact, error: findError } = await supabase
            .from("crm_contacts")
            .select("id, tags, metadata")
            .eq("email", recipientEmail)
            .maybeSingle();

        if (findError) {
            console.error("   DB lookup error:", findError.message);
            return new Response(JSON.stringify({ error: findError.message }), { status: 500 });
        }

        if (!contact) {
            console.log(`   Contact ${recipientEmail} not found in CRM — skipping`);
            return new Response(JSON.stringify({ status: "not_found" }), { status: 200 });
        }

        // Build updates
        const existingTags: string[] = contact.tags || [];
        const existingMeta = contact.metadata || {};
        const updates: Record<string, unknown> = {
            last_activity_at: new Date().toISOString(),
        };

        // Add tag if not already present
        if (!existingTags.includes(tag)) {
            updates.tags = [...existingTags, tag];
            console.log(`   Added tag: ${tag}`);
        }

        // Update metadata with latest email event info
        const metaUpdates: Record<string, unknown> = {
            ...existingMeta,
            last_email_status: tag.replace("email_", ""),
            last_email_event_at: new Date().toISOString(),
        };

        // Track subject if available
        if (data.subject) {
            metaUpdates.last_email_subject = data.subject;
        }

        // Track click URL if available
        if (eventType === "email.clicked" && data.click?.link) {
            metaUpdates.last_click_url = data.click.link;
            metaUpdates.last_click_at = new Date().toISOString();
        }

        // Increment open/click counters
        if (eventType === "email.opened") {
            metaUpdates.email_opens = (existingMeta.email_opens || 0) + 1;
        }
        if (eventType === "email.clicked") {
            metaUpdates.email_clicks = (existingMeta.email_clicks || 0) + 1;
        }

        updates.metadata = metaUpdates;

        // Auto-update status based on engagement
        if (eventType === "email.clicked") {
            updates.status = "engaged";
        } else if (eventType === "email.bounced") {
            updates.status = "bounced";
        }

        // Apply updates
        const { error: updateError } = await supabase
            .from("crm_contacts")
            .update(updates)
            .eq("id", contact.id);

        if (updateError) {
            console.error("   Update error:", updateError.message);
            return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
        }

        console.log(`   ✅ Updated contact ${recipientEmail}`);

        return new Response(
            JSON.stringify({ status: "updated", email: recipientEmail, tag }),
            { headers: { "Content-Type": "application/json" }, status: 200 }
        );

    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
});
