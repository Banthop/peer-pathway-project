import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!signature || !webhookSecret) {
        return new Response("Missing signature or webhook secret", { status: 400 });
    }

    try {
        const body = await req.text();
        let event;
        
        try {
            event = await stripe.webhooks.signature.verifyHeaderAsync(
                body,
                signature,
                webhookSecret,
                undefined,
                cryptoProvider
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return new Response(`Webhook signature verification failed`, { status: 400 });
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;
            const email = session.customer_details?.email || session.customer_email;
            
            if (email) {
                console.log(`Processing checkout for ${email}...`);
                
                // Fetch existing contact to append tag safely
                const { data: contact } = await supabase
                    .from("crm_contacts")
                    .select("tags")
                    .eq("email", email)
                    .single();
                
                let updatedTags = ["stripe_customer"];
                if (contact?.tags) {
                    updatedTags = [...new Set([...contact.tags, "stripe_customer"])];
                }

                const { error } = await supabase.from("crm_contacts").upsert(
                    {
                        email: email,
                        status: "converted",
                        tags: updatedTags,
                        last_activity_at: new Date().toISOString()
                    },
                    { onConflict: "email" }
                );

                if (error) {
                    console.error("Supabase Error:", error.message);
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
                }
                
                console.log(`Successfully updated ${email} as converted stripe_customer.`);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
});
