import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import type { CrmSource } from "@/integrations/supabase/types";

export interface CrmContactInput {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    university?: string;
    source: CrmSource;
    sourceDetail?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
}

/**
 * Save or update a CRM contact in Supabase.
 * Uses upsert on email to deduplicate — if a contact with the same email
 * already exists, it updates their info instead of creating a duplicate.
 *
 * Call this from any form submission handler. Non-blocking by design.
 *
 * Usage:
 * ```ts
 * saveCrmContact({
 *   email: "user@example.com",
 *   firstName: "John",
 *   lastName: "Doe",
 *   source: "webinar",
 *   metadata: { industry: "finance", yearOfStudy: "2nd" },
 * });
 * ```
 */
export async function saveCrmContact(input: CrmContactInput): Promise<void> {
    if (!supabaseAvailable || !supabase) {
        console.log("[CRM] Supabase not configured — skipping save");
        return;
    }

    try {
        const { error } = await supabase.from("crm_contacts").upsert(
            {
                email: input.email.toLowerCase().trim(),
                first_name: input.firstName || "",
                last_name: input.lastName || "",
                phone: input.phone || null,
                university: input.university || null,
                source: input.source,
                source_detail: input.sourceDetail || null,
                tags: input.tags || [],
                metadata: input.metadata || {},
                last_activity_at: new Date().toISOString(),
            },
            { onConflict: "email" }
        );

        if (error) {
            console.error("[CRM] Failed to save contact:", error.message);
        } else {
            console.log("[CRM] Contact saved:", input.email);
        }
    } catch (err) {
        // Never let tracking break the calling form
        console.error("[CRM] Error:", err);
    }
}
