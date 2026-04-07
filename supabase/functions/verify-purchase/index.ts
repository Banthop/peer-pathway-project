import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- Product maps (mirrored from stripe-webhook) ----

const COLD_EMAIL_PRODUCTS: Record<string, { productType: string; tags: string[] }> = {
    "prod_UF1i9ZFvzOLBKJ": {
        productType: "webinar_only",
        tags: ["stripe_customer", "recording_access"],
    },
    "prod_UF1mRfmmwcrKnT": {
        productType: "bundle",
        tags: ["stripe_customer", "recording_access", "bundle", "premium_buyer"],
    },
    "prod_UI9GnUfRmimKds": {
        productType: "webinar_only",
        tags: ["stripe_customer", "recording_access"],
    },
    "prod_UI9IbKsHRmFvhH": {
        productType: "bundle",
        tags: ["stripe_customer", "recording_access", "bundle", "premium_buyer"],
    },
    "prod_UHHe5C5FqRLsjK": {
        productType: "guide_upgrade",
        tags: ["stripe_customer", "recording_access", "bundle"],
    },
};

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

// Tags representing lower spring-week tiers that should be removed on upgrade.
const SPRING_WEEK_TIER_UPGRADE_MAP: Record<string, string[]> = {
    spring_week_bundle: ["spring_week_part1", "spring_week_part2"],
    spring_week_premium: ["spring_week_part1", "spring_week_part2", "spring_week_bundle"],
};

// All known product IDs merged into one lookup for convenience.
const ALL_PRODUCTS: Record<string, { productType: string; tags: string[] }> = {
    ...COLD_EMAIL_PRODUCTS,
    ...SPRING_WEEK_PRODUCTS,
};

// Map productType to a user-facing tier name returned in the response.
function tierFromProductType(productType: string): string {
    if (productType === "spring_week_premium") return "premium";
    if (productType === "spring_week_bundle") return "bundle";
    if (productType === "spring_week_part1") return "part1";
    if (productType === "spring_week_part2") return "part2";
    if (productType === "bundle" || productType === "guide_upgrade") return "bundle";
    if (productType === "webinar_only") return "recording";
    return "recording";
}

// ---- CORS headers ----

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
    "Content-Type": "application/json",
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: CORS_HEADERS });
}

// Basic email validation.
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- Main handler ----

Deno.serve(async (req) => {
    // Handle CORS preflight.
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    // Parse request body.
    let email: string;
    try {
        const body = await req.json();
        email = (body.email || "").toLowerCase().trim();
    } catch {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400);
    }

    if (!email || !isValidEmail(email)) {
        return jsonResponse({ success: false, error: "A valid email address is required" }, 400);
    }

    // ---- Check existing contact for idempotency ----
    const { data: existingContact } = await supabase
        .from("crm_contacts")
        .select("id, tags, metadata, status")
        .eq("email", email)
        .maybeSingle();

    const existingTags: string[] = existingContact?.tags || [];
    const existingMetadata: Record<string, unknown> = (existingContact?.metadata as Record<string, unknown>) || {};

    // If the user already has stripe_customer tag and a known product type in
    // metadata, the webhook already processed their purchase. Return current
    // tier without hitting Stripe again.
    if (
        existingTags.includes("stripe_customer") &&
        existingMetadata.product_type &&
        typeof existingMetadata.product_type === "string"
    ) {
        return jsonResponse({
            success: true,
            tier: tierFromProductType(existingMetadata.product_type as string),
            updated: false,
            message: "Purchase already recorded",
        });
    }

    // ---- Search Stripe for recent completed checkout sessions ----
    // The Stripe API does not support filtering by customer_details.email
    // directly on the list endpoint in all SDK versions, so we list recent
    // completed sessions and filter client-side.

    let matchedSession: Stripe.Checkout.Session | null = null;
    let matchedProduct: { productType: string; tags: string[] } | null = null;

    try {
        // Look at the last 25 completed sessions (covers the last ~24 hours of
        // normal traffic). We check multiple pages if needed, up to 50 sessions.
        let hasMore = true;
        let startingAfter: string | undefined;
        let sessionsChecked = 0;
        const maxSessions = 50;
        const cutoff = Math.floor(Date.now() / 1000) - 24 * 60 * 60; // 24 hours ago

        while (hasMore && sessionsChecked < maxSessions) {
            const params: Stripe.Checkout.SessionListParams = {
                limit: 25,
                status: "complete",
            };
            if (startingAfter) params.starting_after = startingAfter;

            const sessions = await stripe.checkout.sessions.list(params);

            for (const session of sessions.data) {
                sessionsChecked++;

                // Stop scanning if session is older than 24 hours.
                if (session.created < cutoff) {
                    hasMore = false;
                    break;
                }

                const sessionEmail = (
                    session.customer_details?.email ||
                    session.customer_email ||
                    ""
                ).toLowerCase().trim();

                if (sessionEmail !== email) continue;

                // Expand line items to find product IDs.
                try {
                    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
                        expand: ["line_items.data.price.product"],
                    });
                    const lineItems = expanded.line_items?.data || [];

                    for (const item of lineItems) {
                        const productId =
                            typeof item.price?.product === "string"
                                ? item.price.product
                                : (item.price?.product as Record<string, unknown>)?.id as string | undefined;

                        if (productId && ALL_PRODUCTS[productId]) {
                            matchedSession = session;
                            matchedProduct = ALL_PRODUCTS[productId];
                            break;
                        }
                    }
                } catch (e: unknown) {
                    const errMsg = e instanceof Error ? e.message : String(e);
                    console.error(`Error expanding line items for session ${session.id}:`, errMsg);
                }

                // If we found a match, stop scanning.
                if (matchedProduct) break;
            }

            // If we found a match or exhausted sessions, stop.
            if (matchedProduct || !sessions.has_more) {
                hasMore = false;
            } else {
                const lastItem = sessions.data[sessions.data.length - 1];
                startingAfter = lastItem?.id;
            }
        }
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        console.error("Error listing Stripe checkout sessions:", errMsg);
        return jsonResponse({ success: false, error: "Failed to verify purchase with Stripe" }, 502);
    }

    // No completed session found for this email in the last 24 hours.
    if (!matchedSession || !matchedProduct) {
        return jsonResponse({
            success: true,
            tier: "free",
            updated: false,
            message: "No completed purchase found in the last 24 hours",
        });
    }

    // ---- Update crm_contacts ----
    const { productType, tags: newTags } = matchedProduct;
    const spend = matchedSession.amount_total ? matchedSession.amount_total / 100 : 0;

    // Merge tags: keep existing, add new, handle tier upgrades.
    const mergedTags = new Set<string>([...existingTags, ...newTags, productType]);

    // Remove lesser-tier spring-week tags on upgrade.
    const tagsToRemove = SPRING_WEEK_TIER_UPGRADE_MAP[productType] || [];
    for (const staleTag of tagsToRemove) mergedTags.delete(staleTag);

    // Remove webinar_only if upgrading to a real product.
    if (productType !== "webinar_only") mergedTags.delete("webinar_only");

    // Merge metadata without clobbering unrelated keys.
    const previousSpend = (typeof existingMetadata.stripe_spend === "number" ? existingMetadata.stripe_spend : 0) as number;
    const lifetimeSpend = previousSpend + spend;

    const updatedMetadata: Record<string, unknown> = {
        ...existingMetadata,
        stripe_spend: lifetimeSpend,
        last_purchase_at: new Date().toISOString(),
        product_type: productType,
        verified_via: "verify-purchase",
        verified_session_id: matchedSession.id,
    };

    if (productType.startsWith("spring_week")) {
        updatedMetadata.spring_week_product = productType;
        updatedMetadata.spring_week_purchased_at = new Date().toISOString();
        updatedMetadata.webinar_type = "spring_week";
    } else {
        updatedMetadata.webinar_type = (updatedMetadata.webinar_type as string) || "cold_email";
        if (productType.startsWith("recording_") || productType === "webinar_only") {
            updatedMetadata.recording_package = productType;
            updatedMetadata.recording_purchased_at = new Date().toISOString();
        }
    }

    const contactSource = productType.startsWith("spring_week") ? "webinar" : "other";

    const { error: upsertError } = await supabase
        .from("crm_contacts")
        .upsert(
            {
                email,
                status: "converted",
                tags: Array.from(mergedTags),
                metadata: updatedMetadata,
                last_activity_at: new Date().toISOString(),
                source: contactSource,
            },
            { onConflict: "email", ignoreDuplicates: false },
        );

    if (upsertError) {
        console.error("Supabase upsert error in verify-purchase:", upsertError.message);
        return jsonResponse({ success: false, error: "Failed to update contact record" }, 500);
    }

    const tier = tierFromProductType(productType);
    console.log(`verify-purchase: updated ${email} to tier=${tier} product=${productType} spend=${spend}`);

    return jsonResponse({
        success: true,
        tier,
        updated: true,
        productType,
    });
});
