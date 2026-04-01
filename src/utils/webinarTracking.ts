import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import type { WebinarFormData } from "@/hooks/useWebinarForm";
import { saveCrmContact } from "./crmTracking";

/**
 * Save a webinar lead to Supabase.
 * Called when user completes the referral step (all key data collected).
 * Non-blocking - fires and forgets so it doesn't slow the form.
 */
export async function saveWebinarLead(formData: WebinarFormData, webinarType: string = "cold_email"): Promise<void> {
    if (!supabaseAvailable || !supabase) {
        console.log("[WebinarLead] Supabase not configured - skipping save");
        return;
    }

    try {
        const { error } = await supabase.from("webinar_leads").insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_code: formData.phoneCode,
            phone: formData.phone,
            university: formData.university,
            year_of_study: formData.yearOfStudy,
            industry: formData.industry,
            industry_detail: formData.industryDetail,
            referral_source: formData.referralSource,
            selected_ticket: formData.selectedTicket,
            completed_checkout: false,
            webinar_type: webinarType,
        });

        if (error) {
            console.error("[WebinarLead] Failed to save:", error.message);
        } else {
            console.log("[WebinarLead] Lead saved successfully");
            
            // Push to CRM as well
            await saveCrmContact({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phoneCode ? `+${formData.phoneCode}${formData.phone}` : formData.phone,
                university: formData.university,
                source: "webinar",
                tags: ["form_lead"],
                metadata: {
                    year_of_study: formData.yearOfStudy,
                    industry: formData.industry,
                    industry_detail: formData.industryDetail,
                    referral_source: formData.referralSource,
                    ticket: formData.selectedTicket
                }
            });
        }
    } catch (err) {
        // Never let tracking break the form
        console.error("[WebinarLead] Error:", err);
    }
}

/**
 * Mark a lead as having completed checkout (called before Stripe redirect).
 */
export async function markLeadCheckout(email: string): Promise<void> {
    if (!supabaseAvailable || !supabase) return;

    try {
        await supabase
            .from("webinar_leads")
            .update({ completed_checkout: true })
            .eq("email", email);
    } catch (err) {
        console.error("[WebinarLead] Checkout mark error:", err);
    }
}
