/**
 * create-webinar-checkout
 *
 * Creates a Stripe PaymentIntent for spring week webinar products.
 * Validates prices server-side to prevent frontend tampering.
 * Supports partner overrides (e.g. free Watch tier for partner deals).
 *
 * Request body:
 *   email       string   - customer email
 *   firstName   string   - for receipt
 *   lastName    string   - for receipt
 *   items       Array<{ id: string; price: number }>
 *   partner?    string   - optional partner slug e.g. "trackr"
 *   metadata?   Record<string, string> - extra metadata (university, firm, etc.)
 *
 * Response:
 *   { clientSecret: string; intentId: string }
 *   or { clientSecret: null; free: true } when total is 0
 *
 * Secrets required (Supabase Edge Function secrets):
 *   STRIPE_SECRET_KEY
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Server-side price map (pounds). Prevents frontend tampering.
const PRODUCT_PRICES: Record<string, number> = {
  watch: 19,
  prepare: 49,
  "after-hours": 79,
  convert: 149,
  handbook: 29,
  "prep-call": 69,
};

// Partner-specific price overrides
const PARTNER_PRICES: Record<string, Record<string, number>> = {
  trackr: { watch: 0 },
};

interface CheckoutItem {
  id: string;
  price: number;
}

interface CheckoutRequest {
  email: string;
  firstName: string;
  lastName: string;
  items: CheckoutItem[];
  partner?: string;
  metadata?: Record<string, string>;
}

function getExpectedPrice(itemId: string, partner?: string): number | null {
  if (partner && PARTNER_PRICES[partner]?.[itemId] !== undefined) {
    return PARTNER_PRICES[partner][itemId];
  }
  return PRODUCT_PRICES[itemId] ?? null;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: CheckoutRequest = await req.json();
    const { email, firstName, lastName, items, partner, metadata } = body;

    // --- Validation ---

    if (!email || typeof email !== "string") {
      return jsonResponse({ error: "email is required" }, 400);
    }

    if (!firstName || typeof firstName !== "string") {
      return jsonResponse({ error: "firstName is required" }, 400);
    }

    if (!lastName || typeof lastName !== "string") {
      return jsonResponse({ error: "lastName is required" }, 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ error: "At least one item is required" }, 400);
    }

    // Validate each item against server-side prices
    for (const item of items) {
      const expectedPrice = getExpectedPrice(item.id, partner);

      if (expectedPrice === null) {
        return jsonResponse(
          { error: `Unknown product: ${item.id}` },
          400
        );
      }

      // All prices must be non-negative. Only "watch" can be 0 (for partner deals).
      if (item.price < 0) {
        return jsonResponse(
          { error: `Invalid price for ${item.id}: price cannot be negative` },
          400
        );
      }

      if (item.price !== expectedPrice) {
        return jsonResponse(
          {
            error: `Price mismatch for ${item.id}: expected ${expectedPrice}, got ${item.price}`,
          },
          400
        );
      }
    }

    // --- Calculate total ---

    const totalPence = items.reduce((sum, item) => sum + item.price * 100, 0);

    // Free checkout (e.g. partner deal with Watch only at 0)
    if (totalPence === 0) {
      return jsonResponse({ clientSecret: null, free: true }, 200);
    }

    // --- Create PaymentIntent ---

    const intentMetadata: Record<string, string> = {
      items: JSON.stringify(items),
      email,
      firstName,
      lastName,
      ...(partner ? { partner } : {}),
      ...(metadata || {}),
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPence,
      currency: "gbp",
      receipt_email: email,
      metadata: intentMetadata,
      automatic_payment_methods: { enabled: true },
    });

    return jsonResponse(
      {
        clientSecret: paymentIntent.client_secret,
        intentId: paymentIntent.id,
      },
      200
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error";
    console.error("create-webinar-checkout error:", err);
    return jsonResponse({ error: message }, 500);
  }
});
