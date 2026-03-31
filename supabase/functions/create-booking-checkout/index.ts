import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { 
      sessionName, 
      pricePennies, 
      studentEmail, 
      studentName,
      sessionId
    } = await req.json();

    if (!sessionName || !pricePennies || !studentEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Creating Stripe Checkout for ${studentEmail}: ${sessionName} (£${pricePennies / 100})`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Uthman Coaching: ${sessionName}`,
              description: `1-on-1 Session with Uthman for EarlyEdge Portal`,
            },
            unit_amount: pricePennies,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: studentEmail,
      metadata: {
        studentName,
        sessionId,
      },
      success_url: "https://webinar.yourearlyedge.co.uk/portal/book-uthman?success=true",
      cancel_url: "https://webinar.yourearlyedge.co.uk/portal/book-uthman?canceled=true",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error creating stripe checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
