import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@^3.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

Deno.serve(async (req) => {
    try {
        const payload = await req.json();
        
        // The payload usually comes from Supabase Database Webhooks
        const record = payload.record;
        if (!record || !record.email) {
            // Handle raw email requests if needed, but prefer database row
            return new Response("Invalid payload", { status: 400 });
        }

        const email = record.email;
        const firstName = record.first_name || "";
        const lastName = record.last_name || "";

        console.log(`Syncing ${email} to Resend...`);

        // Attempting to retrieve audience from environment
        const audienceId = Deno.env.get("RESEND_AUDIENCE_ID");
        if (!audienceId) {
            console.warn("RESEND_AUDIENCE_ID not set. Check Supabase Vault or Secrets.");
            return new Response("No audience configured", { status: 200 });
        }

        // Add to Resend Audience
        const { data, error } = await resend.contacts.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            unsubscribed: false,
            audienceId: audienceId,
        });

        if (error) {
            // Usually returns a 422 if it already exists, which we want to ignore
            if (error.message && error.message.toLowerCase().includes("exist")) {
                console.log(`Contact ${email} already exists in Resend Audience.`);
                return new Response(JSON.stringify({ status: "already_exists" }), { status: 200 });
            }
            console.error("Resend API Error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        console.log(`Successfully pushed ${email} to Resend Audience ${audienceId}.`);
        return new Response(JSON.stringify({ status: "synced" }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error(`Resend Sync Error: ${err.message}`);
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
});
