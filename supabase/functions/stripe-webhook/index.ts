import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^14.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Dylan <dylan@yourearlyedge.co.uk>";
const PORTAL_LINK = "https://webinar.yourearlyedge.co.uk/portal";
const BOOK_UTHMAN = "https://webinar.yourearlyedge.co.uk/portal/book-uthman";

/**
 * Send automated portal access email to buyer right after purchase.
 * Uses Resend broadcast pattern to land in Primary inbox.
 */
async function sendPortalAccessEmail(email: string, firstName: string, isBundle: boolean) {
    if (!RESEND_KEY) {
        console.warn("RESEND_API_KEY not set — skipping portal access email");
        return;
    }

    const headers = { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" };
    const name = firstName || "there";

    const guideSection = isBundle
        ? `<p>Your Cold Email Guide is in the vault. When it asks for a password, use: <strong>RedMango</strong></p>`
        : "";

    const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:27px;color:#222;">
<p>Hey ${name},</p>
<p>Thanks for your purchase — everything is ready for you.</p>
<p><strong>Here's how to access your materials:</strong></p>
<p>1. Go to <a href="${PORTAL_LINK}">${PORTAL_LINK}</a><br>
2. Click "Create account"<br>
3. Sign up using <strong>${email}</strong> (the email you just used to pay)<br>
4. Set any password you like<br>
5. You're in — recording, resources, everything</p>
${guideSection}
<p>If you want personalised help, Uthman does 1-on-1 strategy calls where he'll build your lead list and write custom templates for your target industry:</p>
<p><a href="${BOOK_UTHMAN}">Book a call with Uthman →</a></p>
<p>Any issues at all, just reply to this email.</p>
<p>Dylan<br>
<span style="color:#999;font-size:13px;">EarlyEdge</span></p>
</div>`;

    try {
        // 1. Create temp audience
        const audRes = await fetch("https://api.resend.com/audiences", {
            method: "POST", headers,
            body: JSON.stringify({ name: `auto_${Date.now()}_${email.split("@")[0]}` }),
        });
        const aud = await audRes.json();
        if (!aud.id) { console.error("Audience create failed:", aud); return; }

        // 2. Add contact
        await fetch(`https://api.resend.com/audiences/${aud.id}/contacts`, {
            method: "POST", headers,
            body: JSON.stringify({ email, unsubscribed: false }),
        });

        // 3. Create broadcast
        const brRes = await fetch("https://api.resend.com/broadcasts", {
            method: "POST", headers,
            body: JSON.stringify({
                audience_id: aud.id,
                from: FROM_EMAIL,
                subject: "your recording + resources are ready",
                html,
                name: `auto_portal_${email.split("@")[0]}`,
            }),
        });
        const br = await brRes.json();
        if (!br.id) { console.error("Broadcast create failed:", br); return; }

        // 4. Send
        await fetch(`https://api.resend.com/broadcasts/${br.id}/send`, {
            method: "POST", headers, body: "{}",
        });

        // 5. Cleanup
        await fetch(`https://api.resend.com/audiences/${aud.id}`, { method: "DELETE", headers });

        console.log(`📧 Portal access email sent to ${email} (${isBundle ? "bundle" : "webinar-only"})`);
    } catch (e: any) {
        console.error(`Failed to send portal access email to ${email}:`, e.message);
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
            
            if (email) {
                console.log(`Processing checkout for ${email} with spend £${spend}...`);
                
                // Fetch existing contact
                const { data: contact } = await supabase
                    .from("crm_contacts")
                    .select("id, tags, metadata")
                    .eq("email", email)
                    .maybeSingle();
                
                const updatedTags = contact?.tags ? [...new Set([...contact.tags, "stripe_customer"])] : ["stripe_customer"];
                
                // ── Detect product type from price + session metadata ──
                // Recording packages (post-webinar):
                //   recording_only = price TBD
                //   recording_bundle = price TBD (recording + guide)
                //   recording_premium = price TBD (recording + guide + 1:1)
                // Original webinar packages:
                //   webinar_only = £10
                //   bundle = £29 or £21.75 (discounted)
                //   guide addon = £12
                //
                // We also check Stripe metadata.product_type if set on the Payment Link
                const stripeProductType = session.metadata?.product_type || "";
                
                let productType = "webinar_only";
                
                if (stripeProductType) {
                    // Trust explicit product type from Stripe metadata
                    productType = stripeProductType;
                } else if (spend >= 20 || spend === 12) {
                    productType = "bundle";
                }
                
                // Remove webinar_only if upgrading
                if (productType === "bundle" && updatedTags.includes("webinar_only")) {
                    updatedTags.splice(updatedTags.indexOf("webinar_only"), 1);
                }
                
                // Handle recording-specific tags
                const isRecording = productType.startsWith("recording_");
                if (isRecording) {
                    // Add recording access tag
                    if (!updatedTags.includes("recording_access")) updatedTags.push("recording_access");
                    
                    // Add specific package tag
                    if (productType === "recording_bundle" || productType === "recording_premium") {
                        if (!updatedTags.includes("bundle")) updatedTags.push("bundle");
                    }
                    if (productType === "recording_premium") {
                        if (!updatedTags.includes("premium_buyer")) updatedTags.push("premium_buyer");
                    }
                }
                
                if (!updatedTags.includes(productType)) updatedTags.push(productType);
                
                const updatedMetadata = contact?.metadata || {};
                updatedMetadata.stripe_spend = (updatedMetadata.stripe_spend || 0) + spend;
                updatedMetadata.last_purchase_at = new Date().toISOString();
                updatedMetadata.product_type = productType;
                if (isRecording) {
                    updatedMetadata.recording_package = productType;
                    updatedMetadata.recording_purchased_at = new Date().toISOString();
                }

                let error;
                if (contact) {
                    // Update existing
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
                    // Insert new
                    console.log(`Inserting new contact...`);
                    const { error: insError } = await supabase.from("crm_contacts")
                        .insert({
                            email: email,
                            first_name: session.customer_details?.name?.split(" ")[0] || "",
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
                
                // ── AUTO-SEND portal access email ──
                const buyerFirstName = session.customer_details?.name?.split(" ")[0] || "";
                const isBundleBuyer = productType === "bundle" || productType === "recording_bundle" || productType === "recording_premium";
                await sendPortalAccessEmail(email, buyerFirstName, isBundleBuyer);
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
