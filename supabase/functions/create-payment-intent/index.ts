/**
 * create-payment-intent
 *
 * Creates a Stripe PaymentIntent for a 1-on-1 coaching session or package.
 * Handles the commission split via Stripe Connect (application_fee_amount +
 * transfer_data.destination).
 *
 * Request body:
 *   coachId       UUID - coaches table id
 *   bookingId     UUID - bookings table id (already created as 'pending')
 *   amountPence   number - total charge in pence (e.g. 5000 = £50)
 *   description   string - shown on Stripe receipt ("Mock Interview with Sarah K.")
 *   studentEmail  string - for Stripe receipt
 *
 * Response:
 *   { clientSecret: string }  - pass to Stripe.js confirmCardPayment()
 *
 * Secrets required (Supabase Edge Function secrets):
 *   STRIPE_SECRET_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { coachId, bookingId, amountPence, description, studentEmail } = await req.json();

    if (!coachId || !bookingId || !amountPence || amountPence < 100) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch coach to get Stripe account + commission info
    const { data: coach, error: coachError } = await supabase
      .from("coaches")
      .select("stripe_account_id, stripe_onboarded, is_founding_coach, founding_coach_expires_at, total_sessions, commission_rate")
      .eq("id", coachId)
      .single();

    if (coachError || !coach) {
      return new Response(
        JSON.stringify({ error: "Coach not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate commission rate
    let commissionRate = 20; // default
    if (coach.is_founding_coach && coach.founding_coach_expires_at && new Date(coach.founding_coach_expires_at) > new Date()) {
      commissionRate = 0;
    } else if (coach.total_sessions < 5) {
      commissionRate = 30;
    }

    const commissionPence = Math.round(amountPence * commissionRate / 100);

    // Build PaymentIntent options
    const intentOptions: Stripe.PaymentIntentCreateParams = {
      amount: amountPence,
      currency: "gbp",
      description: description || "EarlyEdge coaching session",
      receipt_email: studentEmail || undefined,
      metadata: {
        booking_id: bookingId,
        coach_id: coachId,
        commission_rate: commissionRate,
        commission_pence: commissionPence,
      },
    };

    // Only add transfer/fee if coach is onboarded with Stripe Connect
    if (coach.stripe_onboarded && coach.stripe_account_id) {
      intentOptions.application_fee_amount = commissionPence;
      intentOptions.transfer_data = {
        destination: coach.stripe_account_id,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(intentOptions);

    // Store the payment intent ID + commission snapshot on the booking
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        commission_rate: commissionRate,
        commission_amount: commissionPence,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Failed to update booking with payment intent:", updateError);
      // Non-fatal: still return client secret so payment can proceed
    }

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("create-payment-intent error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
