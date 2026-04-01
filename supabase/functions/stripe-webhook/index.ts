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

// Spring Week Webinar product ID mapping.
// Confirm these IDs against the Stripe dashboard before deploying.
// Maps Stripe product IDs to their product type and relevant tags.
const SPRING_WEEK_PRODUCTS: Record<string, { productType: string; tags: string[] }> = {
    "prod_UFrcUWCwGdzNqo": {
        productType: "spring_week_part1",
        tags: ["stripe_customer", "spring_week", "spring_week_part1"],
    },
    "prod_UFrcmX59L7wHRW": {
        productType: "spring_week_part2",
        tags: ["stripe_customer", "spring_week", "spring_week_part2"],
    },
    "prod_UFrcsQHhGy0WES": {
        productType: "spring_week_bundle",
        tags: ["stripe_customer", "spring_week", "spring_week_bundle", "playbook_access"],
    },
    "prod_UFrcW9BHxahd9E": {
        productType: "spring_week_premium",
        tags: ["stripe_customer", "spring_week", "spring_week_premium", "playbook_access", "coaching_included"],
    },
};

// Tags representing lower spring-week tiers that should be removed when a
// customer upgrades to bundle or premium.
const SPRING_WEEK_TIER_UPGRADE_MAP: Record<string, string[]> = {
    spring_week_bundle:  ["spring_week_part1", "spring_week_part2"],
    spring_week_premium: ["spring_week_part1", "spring_week_part2", "spring_week_bundle"],
};

/**
 * Resolve product info from Stripe line items.
 * Checks line_items for Spring Week product IDs and returns matching config.
 */
async function resolveSpringWeekProduct(session: any): Promise<{ productType: string; tags: string[] } | null> {
    try {
        const expanded = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items.data.price.product"],
        });
        const lineItems = expanded.line_items?.data || [];
        for (const item of lineItems) {
            const productId = typeof item.price?.product === "string"
                ? item.price.product
                : (item.price?.product as any)?.id;
            if (productId && SPRING_WEEK_PRODUCTS[productId]) {
                return SPRING_WEEK_PRODUCTS[productId];
            }
        }
    } catch (e: any) {
        console.error("Error resolving Spring Week product:", e.message);
    }
    return null;
}

/**
 * Sync contact to Attio CRM and place in Student Sales pipeline (Paid stage).
 * The spend parameter should always be the customer's cumulative lifetime total,
 * not just the current session amount.
 * Returns the Attio person record_id on success, or null if the sync failed.
 */
async function syncToAttio(
    email: string,
    firstName: string,
    lastName: string,
    lifetimeSpend: number,
    productType: string,
): Promise<string | null> {
    if (!ATTIO_API_KEY) return null;
    try {
        const fullName = `${firstName} ${lastName}`.trim() || email.split("@")[0];

        // Map productType to Attio Select Option
        let mappedProductType = productType;
        if (productType === "bundle" || productType === "recording_bundle") mappedProductType = "Bundle";
        else if (productType === "recording_premium") mappedProductType = "Premium";
        else if (productType.includes("webinar")) mappedProductType = "Recording Only";
        else if (productType === "spring_week_part1") mappedProductType = "Spring Week Part 1";
        else if (productType === "spring_week_part2") mappedProductType = "Spring Week Part 2";
        else if (productType === "spring_week_bundle") mappedProductType = "Spring Week Bundle";
        else if (productType === "spring_week_premium") mappedProductType = "Spring Week Premium";

        // Build name values, omitting fields absent in this session so we don't
        // overwrite names that were captured earlier in the registration form.
        const nameEntry: Record<string, string> = { full_name: fullName };
        if (firstName) nameEntry.first_name = firstName;
        if (lastName) nameEntry.last_name = lastName;

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
                        name: [nameEntry],
                        stripe_customer: [{ value: true }],
                        total_spent: [{ value: lifetimeSpend }],
                        product_type: [{ option: mappedProductType }]
                    }
                }
            })
        });

        if (!personRes.ok) {
            const errText = await personRes.text();
            console.error(`Attio Person upsert HTTP ${personRes.status}:`, errText);
            return null;
        }

        const personData = await personRes.json();
        const recordId: string | undefined = personData?.data?.id?.record_id;

        if (recordId) {
            // 2. Add to Student Sales pipeline in the 'Paid' stage.
            // POST is idempotent in Attio when the entry already exists.
            // Attio returns the existing entry rather than creating a duplicate.
            const pipelineRes = await fetch("https://api.attio.com/v2/lists/student_sales/entries", {
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
            if (!pipelineRes.ok) {
                const pipelineErr = await pipelineRes.text();
                console.error(`Attio pipeline entry HTTP ${pipelineRes.status}:`, pipelineErr);
            } else {
                console.log(`Synced ${email} to Attio Student Sales Pipeline (Paid)`);
            }
            return recordId;
        } else {
            console.error("Attio Sync person payload failed:", JSON.stringify(personData));
            return null;
        }
    } catch (e: any) {
        console.error("Attio Sync Error:", e.message);
        return null;
    }
}

/**
 * Trigger Loops Marketing Event and Transactional Portal Email.
 * All Loops HTTP calls are individually wrapped so a Loops failure never
 * prevents Stripe from receiving its 200 acknowledgement.
 */
async function triggerLoopsEvents(
    email: string,
    firstName: string,
    lifetimeSpend: number,
    productType: string,
    isBundle: boolean,
) {
    if (!LOOPS_API_KEY) {
        console.warn("LOOPS_API_KEY not set - skipping Loops event and transactional emails");
        return;
    }

    const headers = { Authorization: `Bearer ${LOOPS_API_KEY}`, "Content-Type": "application/json" };

    const isSpringWeek = productType.startsWith("spring_week");
    const webinarType = isSpringWeek ? "spring_week" : "cold_email";

    if (isSpringWeek) {
        // Fire 'spring_week_purchase_completed' to trigger Flow 6 (Spring Week Welcome Sequence)
        const hasPlaybook = productType === "spring_week_bundle" || productType === "spring_week_premium";
        const hasCoaching = productType === "spring_week_premium";
        const webinarPart = productType === "spring_week_part1" ? "1"
            : productType === "spring_week_part2" ? "2"
            : "both";
        const hasBothParts = productType === "spring_week_bundle" || productType === "spring_week_premium";

        try {
            const evtRes = await fetch("https://app.loops.so/api/v1/events/send", {
                method: "POST", headers,
                body: JSON.stringify({
                    email,
                    eventName: "spring_week_purchase_completed",
                    eventProperties: {
                        spend: lifetimeSpend,
                        productType,
                        webinarType,
                        isBundle,
                        hasPlaybook,
                        hasCoaching,
                        webinarPart,
                        hasBothParts,
                        portalLink: PORTAL_LINK,
                        bookUthmanLink: BOOK_UTHMAN,
                    }
                })
            });
            if (!evtRes.ok) {
                const errText = await evtRes.text();
                console.error(`Loops events/send HTTP ${evtRes.status}:`, errText);
            } else {
                console.log(`Triggered Loops 'spring_week_purchase_completed' event for ${email}`);
            }
        } catch (e: any) {
            console.error("Loops Spring Week Event Error:", e.message);
        }
    } else {
        // Fire 'purchase_completed' to trigger Flow 1 (Cold Email Buyer Welcome Sequence)
        try {
            const evtRes = await fetch("https://app.loops.so/api/v1/events/send", {
                method: "POST", headers,
                body: JSON.stringify({
                    email,
                    eventName: "purchase_completed",
                    eventProperties: {
                        spend: lifetimeSpend,
                        productType,
                        webinarType,
                        isBundle
                    }
                })
            });
            if (!evtRes.ok) {
                const errText = await evtRes.text();
                console.error(`Loops events/send HTTP ${evtRes.status}:`, errText);
            } else {
                console.log(`Triggered Loops 'purchase_completed' event for ${email}`);
            }
        } catch (e: any) {
            console.error("Loops Event Error:", e.message);
        }
    }

    // 2. Fire Transactional Portal Access Email (requires LOOPS_PORTAL_TRANSACTIONAL_ID)
    if (LOOPS_PORTAL_TRANSACTIONAL_ID) {
        try {
            const txRes = await fetch("https://app.loops.so/api/v1/transactional", {
                method: "POST", headers,
                body: JSON.stringify({
                    transactionalId: LOOPS_PORTAL_TRANSACTIONAL_ID,
                    email,
                    dataVariables: {
                        firstName: firstName || "there",
                        portalLink: PORTAL_LINK,
                        bookUthmanLink: BOOK_UTHMAN,
                        isBundle: isBundle ? "true" : "false",
                        productType,
                        webinarType
                    }
                })
            });
            if (!txRes.ok) {
                const errText = await txRes.text();
                console.error(`Loops transactional HTTP ${txRes.status}:`, errText);
            } else {
                console.log(`Sent Loops portal access email to ${email}`);
            }
        } catch (e: any) {
            console.error("Loops Transactional Error:", e.message);
        }
    } else {
        console.warn("LOOPS_PORTAL_TRANSACTIONAL_ID not set - skipping portal access email but sequence was triggered");
    }
}

Deno.serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!signature || !webhookSecret) {
        return new Response("Missing signature or webhook secret", { status: 400 });
    }

    // Read the raw body once -- this must happen before any other awaits so
    // the stream is not consumed.
    let body: string;
    try {
        body = await req.text();
    } catch (e: any) {
        console.error("Failed to read request body:", e.message);
        // Return 200 to prevent Stripe retrying an unreadable body forever.
        return new Response(JSON.stringify({ received: true, warning: "body read failed" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    let event: Stripe.Event;
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
        // 400 tells Stripe not to retry -- bad signature will never succeed.
        return new Response("Webhook signature verification failed", { status: 400 });
    }

    // Always acknowledge quickly. All processing below uses non-fatal try/catch so
    // an internal error will be logged but Stripe still gets a 200.
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        // Guard: require an email address -- nothing can proceed without one.
        const email = (session.customer_details?.email || session.customer_email || "").toLowerCase().trim();
        if (!email) {
            console.warn(`checkout.session.completed missing email for session ${session.id} -- skipping`);
            return new Response(JSON.stringify({ received: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        // --- Idempotency check ---
        // Stripe retries webhooks that do not receive a 200 within 30 s, and
        // can also deliver the same event multiple times. We deduplicate by
        // storing the Stripe event ID in the contact metadata. If we have
        // already processed this exact event, return 200 immediately.
        const { data: existingContact } = await supabase
            .from("crm_contacts")
            .select("id, tags, metadata, first_name, last_name")
            .eq("email", email)
            .maybeSingle();

        const processedEvents: string[] = existingContact?.metadata?.processed_stripe_events || [];
        if (processedEvents.includes(event.id)) {
            console.log(`Duplicate webhook event ${event.id} for ${email} -- already processed, returning 200`);
            return new Response(JSON.stringify({ received: true, duplicate: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const spend = session.amount_total ? session.amount_total / 100 : 0;

            // Only write name fields when Stripe actually provides them so we
            // do not clobber names captured at form registration.
            const rawName = session.customer_details?.name || "";
            const firstName = rawName ? rawName.split(" ")[0] : "";
            const lastName = rawName ? rawName.split(" ").slice(1).join(" ") : "";

            console.log(`Processing checkout for ${email} spend=${spend} event=${event.id}`);

            // Parse client_reference_id for ticket hint (format: "email|ticketId" or just "email")
            const clientRef = session.client_reference_id || "";
            const ticketHint = clientRef.includes("|") ? clientRef.split("|")[1] : "";

            // Build tag set from existing contact, adding stripe_customer baseline
            const existingTags: string[] = existingContact?.tags || [];
            const updatedTags = new Set<string>([...existingTags, "stripe_customer"]);

            const stripeProductType = session.metadata?.product_type || "";

            // Resolve Spring Week product via Stripe line item expansion
            const swProduct = await resolveSpringWeekProduct(session);

            let productType = "webinar_only";

            if (swProduct) {
                productType = swProduct.productType;
                for (const tag of swProduct.tags) updatedTags.add(tag);
                console.log(`Spring Week product detected: ${productType}`);
            } else if (stripeProductType) {
                productType = stripeProductType;
            } else if (ticketHint && ["part1", "part2", "bundle", "premium"].includes(ticketHint)) {
                // Fallback: use ticket hint from client_reference_id
                productType = `spring_week_${ticketHint}`;
                const fallbackKey = Object.keys(SPRING_WEEK_PRODUCTS).find(
                    k => SPRING_WEEK_PRODUCTS[k].productType === productType
                );
                if (fallbackKey) {
                    for (const tag of SPRING_WEEK_PRODUCTS[fallbackKey].tags) updatedTags.add(tag);
                }
                console.log(`Spring Week product resolved via ticket hint: ${productType}`);
            } else if (spend >= 20 || spend === 12) {
                productType = "bundle";
            }

            // Remove lesser-tier spring-week tags on upgrade (e.g. part1 when
            // the same customer now buys the bundle or premium).
            const tagsToRemove = SPRING_WEEK_TIER_UPGRADE_MAP[productType] || [];
            for (const staleTag of tagsToRemove) updatedTags.delete(staleTag);

            // Remove webinar_only if upgrading to a real product
            if (productType !== "webinar_only") updatedTags.delete("webinar_only");

            // Handle cold email recording products
            const isRecording = productType.startsWith("recording_");
            if (isRecording) {
                updatedTags.add("recording_access");
                if (productType === "recording_bundle" || productType === "recording_premium") {
                    updatedTags.add("bundle");
                }
                if (productType === "recording_premium") {
                    updatedTags.add("premium_buyer");
                }
            }

            // Always tag with the product type itself
            updatedTags.add(productType);

            // Accumulate lifetime spend on top of whatever was stored before
            const previousSpend: number = existingContact?.metadata?.stripe_spend || 0;
            const lifetimeSpend = previousSpend + spend;

            // Merge new metadata over existing, never clobbering unrelated keys
            const updatedMetadata: Record<string, any> = { ...(existingContact?.metadata || {}) };
            updatedMetadata.stripe_spend = lifetimeSpend;
            updatedMetadata.last_purchase_at = new Date().toISOString();
            updatedMetadata.product_type = productType;
            // Track all processed event IDs to prevent double-counting on retries
            updatedMetadata.processed_stripe_events = [...processedEvents, event.id];
            if (isRecording) {
                updatedMetadata.recording_package = productType;
                updatedMetadata.recording_purchased_at = new Date().toISOString();
            }
            if (swProduct) {
                updatedMetadata.spring_week_product = productType;
                updatedMetadata.spring_week_purchased_at = new Date().toISOString();
                updatedMetadata.webinar_type = "spring_week";
            } else {
                updatedMetadata.webinar_type = updatedMetadata.webinar_type || "cold_email";
            }

            // Build upsert row. Only include name columns when Stripe returned a
            // name so we do not overwrite names captured at registration.
            const contactSource = productType.startsWith("spring_week") ? "webinar" : "other";
            const upsertRow: Record<string, any> = {
                email,
                status: "converted",
                tags: Array.from(updatedTags),
                metadata: updatedMetadata,
                last_activity_at: new Date().toISOString(),
                source: contactSource,
            };
            if (firstName) upsertRow.first_name = firstName;
            if (lastName) upsertRow.last_name = lastName;

            const { error } = await supabase
                .from("crm_contacts")
                .upsert(upsertRow, { onConflict: "email", ignoreDuplicates: false });

            if (error) {
                // A database error is unexpected but non-fatal for Stripe.
                // Log it and return 200 so Stripe does not retry indefinitely.
                console.error("Supabase upsert error:", error.message);
            } else {
                console.log(`Upserted ${email} as converted stripe_customer (${productType}) lifetimeSpend=${lifetimeSpend}`);
            }

            // Fire integrations regardless of the Supabase result so a DB hiccup
            // does not block the customer from receiving their portal email.

            // -- SYNC TO ATTIO (lifetime spend, not just this session) --
            await syncToAttio(email, firstName, lastName, lifetimeSpend, productType);

            // -- TRIGGER LOOPS EVENTS / EMAILS --
            const isBundleBuyer =
                productType === "bundle" ||
                productType === "recording_bundle" ||
                productType === "recording_premium" ||
                productType === "spring_week_bundle" ||
                productType === "spring_week_premium";
            await triggerLoopsEvents(email, firstName, lifetimeSpend, productType, isBundleBuyer);

        } catch (innerErr: any) {
            // Per-session error: log and fall through to return 200 so Stripe
            // does not retry. The issue must be investigated in logs.
            console.error(`Error processing checkout for ${email}: ${innerErr.message}`);
        }
    }

    // Always return 200 to acknowledge the webhook to Stripe.
    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
