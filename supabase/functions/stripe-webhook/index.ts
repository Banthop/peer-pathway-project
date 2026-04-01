import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY") || "";
const LOOPS_PORTAL_TRANSACTIONAL_ID = Deno.env.get("LOOPS_PORTAL_TRANSACTIONAL_ID") || "";
const ATTIO_API_KEY = Deno.env.get("ATTIO_API_KEY") || "";
const BOOK_UTHMAN = "https://webinar.yourearlyedge.co.uk/portal/book-uthman";
const PORTAL_LINK = "https://webinar.yourearlyedge.co.uk/portal";

/**
 * Sync contact to Attio CRM and place in Student Sales pipeline (Paid stage).
 */
async function syncToAttio(email: string, firstName: string, lastName: string, spend: number, productType: string) {
    if (!ATTIO_API_KEY) return;
    try {
        const fullName = `${firstName} ${lastName}`.trim() || email.split("@")[0];
        
        // Map productType to Attio Select Option (fallback to string if unmapped)
        let mappedProductType = productType;
        if (productType === "bundle" || productType === "recording_bundle") mappedProductType = "Bundle";
        else if (productType === "recording_premium") mappedProductType = "Premium";
        else if (productType.includes("webinar")) mappedProductType = "Recording Only";
        
        // 1. Upsert Person
        const personRes = await fetch("https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${ATTIO_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    values: {
                        email_addresses: [{ email_address: email }],
                        name: [{ first_name: firstName || undefined, last_name: lastName || undefined, full_name: fullName }],
                        stripe_customer: [{ value: true }],
                        total_spent: [{ value: spend }],
                        product_type: [{ option: mappedProductType }] // Tries mapping to valid options
                    }
                }
            })
        });
        
        const personData = await personRes.json();
        const recordId = personData?.data?.id?.record_id;
        
        if (recordId) {
            // 2. Add to Student Sales pipeline inside the 'Paid' stage
            const listRes = await fetch("https://api.attio.com/v2/lists/student_sales/entries", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${ATTIO_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        parent_object: "people",
                        parent_record_id: recordId,
                        entry_values: {
                            stage: [{ status: "Paid" }]
                        }
                    }
                })
            });
            console.log(`✅ Synced ${email} to Attio Student Sales Pipeline (Paid)`);
        } else {
            console.error("Attio Sync person payload failed:", JSON.stringify(personData));
        }
    } catch (e: any) {
        console.error("Attio Sync Error:", e.message);
    }
}

/**
 * Trigger Loops Marketing Event & Transactional Portal Email
 */
async function triggerLoopsEvents(email: string, firstName: string, spend: number, productType: string, isBundle: boolean) {
    if (!LOOPS_API_KEY) {
        console.warn("LOOPS_API_KEY not set — skipping Loops event & transactional emails");
        return;
    }

    const headers = { Authorization: `Bearer ${LOOPS_API_KEY}`, "Content-Type": "application/json" };
    
    // 1. Fire 'purchase_completed' Event to trigger the automated Buyer Welcome Sequence
    try {
        await fetch("https://app.loops.so/api/v1/events/send", {
            method: "POST", headers,
            body: JSON.stringify({
                email,
                eventName: "purchase_completed",
                eventProperties: {
                    spend,
                    productType,
                    isBundle
                }
            })
        });
        console.log(`✅ Triggered Loops 'purchase_completed' event for ${email}`);
    } catch (e: any) {
        console.error("Loops Event Error:", e.message);
    }
    
    // 2. Fire Transactional Portal Access Email (Requires LOOPS_PORTAL_TRANSACTIONAL_ID)
    if (LOOPS_PORTAL_TRANSACTIONAL_ID) {
        try {
            await fetch("https://app.loops.so/api/v1/transactional", {
                method: "POST", headers,
                body: JSON.stringify({
                    transactionalId: LOOPS_PORTAL_TRANSACTIONAL_ID,
                    email,
                    dataVariables: {
                        firstName: firstName || "there",
                        portalLink: PORTAL_LINK,
                        bookUthmanLink: BOOK_UTHMAN,
                        isBundle: isBundle ? "true" : "false" // used in loops template logic
                    }
                })
            });
            console.log(`📧 Sent Loops portal access email to ${email}`);
        } catch (e: any) {
            console.error("Loops Transactional Error:", e.message);
        }
    } else {
        console.warn("LOOPS_PORTAL_TRANSACTIONAL_ID not set — skipping manual portal access email but sequence was triggered");
    }
}

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
            const email = (session.customer_details?.email || session.customer_email || "").toLowerCase().trim();
            const spend = session.amount_total ? session.amount_total / 100 : 0;
            const firstName = session.customer_details?.name?.split(" ")[0] || "";
            const lastName = session.customer_details?.name?.split(" ").slice(1).join(" ") || "";
            
            if (email) {
                console.log(`Processing checkout for ${email} with spend £${spend}...`);
                
                // Fetch existing contact
                const { data: contact } = await supabase
                    .from("crm_contacts")
                    .select("id, tags, metadata")
                    .eq("email", email)
                    .maybeSingle();
                
                const updatedTags = contact?.tags ? [...new Set([...contact.tags, "stripe_customer"])] : ["stripe_customer"];
                
                const stripeProductType = session.metadata?.product_type || "";
                
                let productType = "webinar_only";
                if (stripeProductType) {
                    productType = stripeProductType;
                } else if (spend >= 20 || spend === 12) {
                    productType = "bundle";
                }
                
                // Remove webinar_only if upgrading
                if (productType === "bundle" && updatedTags.includes("webinar_only")) {
                    updatedTags.splice(updatedTags.indexOf("webinar_only"), 1);
                }
                
                const isRecording = productType.startsWith("recording_");
                if (isRecording) {
                    if (!updatedTags.includes("recording_access")) updatedTags.push("recording_access");
                    if (productType === "recording_bundle" || productType === "recording_premium") {
                        if (!updatedTags.includes("bundle")) updatedTags.push("bundle");
                    }
                    if (productType === "recording_premium") {
                        if (!updatedTags.includes("premium_buyer")) updatedTags.push("premium_buyer");
                    }
                }
                
                if (!updatedTags.includes(productType)) updatedTags.push(productType);
                
                const currentSpend = (contact?.metadata?.stripe_spend || 0) + spend;
                const updatedMetadata = contact?.metadata || {};
                updatedMetadata.stripe_spend = currentSpend;
                updatedMetadata.last_purchase_at = new Date().toISOString();
                updatedMetadata.product_type = productType;
                if (isRecording) {
                    updatedMetadata.recording_package = productType;
                    updatedMetadata.recording_purchased_at = new Date().toISOString();
                }

                let error;
                if (contact) {
                    console.log(`Updating existing contact: ${contact.id}`);
                    const { error: updError } = await supabase.from("crm_contacts")
                        .update({
                            status: "converted",
                            tags: updatedTags,
                            metadata: updatedMetadata,
                            last_activity_at: new Date().toISOString()
                        }).eq("id", contact.id);
                    error = updError;
                } else {
                    console.log(`Inserting new contact...`);
                    const { error: insError } = await supabase.from("crm_contacts")
                        .insert({
                            email: email,
                            first_name: firstName,
                            status: "converted",
                            tags: updatedTags,
                            metadata: updatedMetadata,
                            last_activity_at: new Date().toISOString(),
                            source: "other"
                        });
                    error = insError;
                }

                if (error) {
                    console.error("Supabase Error:", error.message);
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
                }
                
                console.log(`Successfully updated ${email} as converted stripe_customer (${productType}).`);
                
                // ── SYNC TO ATTIO ──
                await syncToAttio(email, firstName, lastName, currentSpend, productType);
                
                // ── TRIGGER LOOPS EVENTS / EMAILS ──
                const isBundleBuyer = productType === "bundle" || productType === "recording_bundle" || productType === "recording_premium";
                await triggerLoopsEvents(email, firstName, currentSpend, productType, isBundleBuyer);
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
