import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Loops Sync Edge Function
 *
 * Replaces the Resend-based auto-emailer with Loops API contact sync.
 * Can be triggered via:
 *   - Cron (pg_cron calling this function's URL)
 *   - Webhook (POST from any internal service)
 *
 * What it does:
 *   1. Queries crm_contacts where loops_synced_at IS NULL
 *      OR last_activity_at > loops_synced_at (contact was updated since last sync)
 *   2. For each contact, upserts the record into Loops via contacts/update
 *   3. Maps DB fields to Loops contact properties (see field mapping below)
 *   4. Marks each successfully synced contact by writing now() into
 *      loops_synced_at (direct column if it exists, otherwise metadata.loops_synced_at)
 *
 * Required Supabase secrets:
 *   - LOOPS_API_KEY
 *   - SUPABASE_URL (auto-injected)
 *   - SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 *
 * NOTE: The loops_synced_at column does not yet exist on crm_contacts.
 * Add it with the following migration before deploying:
 *
 *   ALTER TABLE crm_contacts
 *     ADD COLUMN IF NOT EXISTS loops_synced_at timestamptz;
 *   CREATE INDEX IF NOT EXISTS crm_contacts_loops_synced_at_idx
 *     ON crm_contacts (loops_synced_at);
 *
 * Until that migration runs, this function falls back to
 * metadata->>'loops_synced_at' as a best-effort alternative.
 */

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY") || "";
const LOOPS_CONTACTS_URL = "https://app.loops.so/api/v1/contacts/update";
const LOOPS_EVENTS_URL = "https://app.loops.so/api/v1/events/send";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface CrmContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  source: string | null;
  status: string | null;
  awareness_level: string | null;
  tags: string[] | null;
  metadata: Record<string, any> | null;
  last_activity_at: string | null;
  // loops_synced_at will be present once the migration runs
  loops_synced_at?: string | null;
}

interface LoopsContactPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  // Custom properties stored on the Loops contact
  university?: string;
  productType?: string;
  isBundle?: boolean;
  totalSpent?: number;
  awarenessLevel?: string;
  status?: string;
  tags?: string;
  userGroup?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Upsert a single contact in Loops.
 * The contacts/update endpoint acts as a create-or-update (matched by email).
 */
async function upsertLoopsContact(payload: LoopsContactPayload): Promise<void> {
  if (!LOOPS_API_KEY) {
    throw new Error("LOOPS_API_KEY is not set");
  }

  const res = await fetch(LOOPS_CONTACTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Loops contacts/update failed (${res.status}): ${text}`);
  }
}

/**
 * Fire a Loops event for a contact.
 * Used here to trigger any automation tied to the contact being synced for
 * the first time (e.g. a welcome sequence for contacts that bypassed Stripe).
 */
async function sendLoopsEvent(
  email: string,
  eventName: string,
  eventProperties: Record<string, unknown> = {}
): Promise<void> {
  if (!LOOPS_API_KEY) {
    throw new Error("LOOPS_API_KEY is not set");
  }

  const res = await fetch(LOOPS_EVENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, eventName, eventProperties }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Loops events/send failed (${res.status}): ${text}`);
  }
}

/**
 * Build the Loops contact payload from a crm_contacts row.
 *
 * Field mapping:
 *   email             -> email (required)
 *   first_name        -> firstName
 *   last_name         -> lastName
 *   source            -> source
 *   awareness_level   -> awarenessLevel (custom property)
 *   status            -> status (custom property)
 *   metadata.university      -> university (custom property)
 *   metadata.product_type    -> productType (custom property)
 *   metadata.total_spent     -> totalSpent (custom property, number)
 *   tags contains 'bundle'   -> isBundle (custom boolean property)
 *   tags (joined)            -> tags (custom string property - comma-separated)
 *   tags -> userGroup        -> derived from status/tags for Loops segmentation
 */
function buildLoopsPayload(contact: CrmContact): LoopsContactPayload {
  const meta = contact.metadata || {};
  const tags = contact.tags || [];

  const isBundle =
    tags.includes("bundle") ||
    tags.includes("recording_bundle") ||
    tags.includes("recording_premium") ||
    tags.includes("spring_week_bundle") ||
    tags.includes("spring_week_premium");

  const totalSpent =
    typeof meta.total_spent === "number"
      ? meta.total_spent
      : typeof meta.stripe_spend === "number"
      ? meta.stripe_spend
      : undefined;

  // Derive a simple userGroup string for Loops segmentation
  let userGroup = "lead";
  if (contact.status === "converted" || tags.includes("stripe_customer")) {
    userGroup = isBundle ? "buyer_bundle" : "buyer";
  } else if (tags.includes("form_lead") || contact.status === "interested") {
    userGroup = "form_lead";
  }

  const payload: LoopsContactPayload = {
    email: contact.email,
  };

  if (contact.first_name) payload.firstName = contact.first_name;
  if (contact.last_name) payload.lastName = contact.last_name;
  if (contact.source) payload.source = contact.source;
  if (contact.awareness_level) payload.awarenessLevel = contact.awareness_level;
  if (contact.status) payload.status = contact.status;
  if (meta.university) payload.university = meta.university;
  if (meta.product_type) payload.productType = meta.product_type;
  if (typeof totalSpent === "number") payload.totalSpent = totalSpent;
  if (tags.length > 0) payload.tags = tags.join(",");

  payload.isBundle = isBundle;
  payload.userGroup = userGroup;

  return payload;
}

/**
 * Determine whether a contact is due for sync.
 *
 * Priority order for reading the last-synced timestamp:
 *   1. loops_synced_at column (present after migration)
 *   2. metadata.loops_synced_at (fallback until migration runs)
 *
 * A contact is due when:
 *   - It has never been synced (syncedAt is null/undefined), OR
 *   - last_activity_at is newer than the last sync time
 */
function isDueForSync(contact: CrmContact): boolean {
  const syncedAt =
    contact.loops_synced_at ?? contact.metadata?.loops_synced_at ?? null;

  if (!syncedAt) return true;

  const syncedTime = new Date(syncedAt).getTime();
  const activityTime = contact.last_activity_at
    ? new Date(contact.last_activity_at).getTime()
    : 0;

  return activityTime > syncedTime;
}

/**
 * Persist the sync timestamp back to Supabase.
 *
 * Attempts to write the dedicated loops_synced_at column first.
 * If that column does not exist yet (migration pending), it silently
 * falls back to writing metadata.loops_synced_at instead.
 */
async function markSynced(contact: CrmContact, syncedAt: string): Promise<void> {
  // Optimistically try the dedicated column
  const { error: colErr } = await supabase
    .from("crm_contacts")
    .update({ loops_synced_at: syncedAt })
    .eq("id", contact.id);

  if (!colErr) return; // Column exists and write succeeded

  // Column does not exist yet - fall back to metadata
  const updatedMeta = { ...(contact.metadata || {}), loops_synced_at: syncedAt };
  const { error: metaErr } = await supabase
    .from("crm_contacts")
    .update({ metadata: updatedMeta })
    .eq("id", contact.id);

  if (metaErr) {
    // Non-fatal - log but do not throw so one bad write doesn't abort the batch
    console.error(
      `Failed to persist loops_synced_at for ${contact.email}: ${metaErr.message}`
    );
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  // Allow both GET (cron trigger) and POST (webhook trigger)
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry_run") === "true";

  // Optional: limit batch size via query param (default: all due contacts)
  const limitParam = url.searchParams.get("limit");
  const batchLimit = limitParam ? parseInt(limitParam, 10) : 500;

  if (!LOOPS_API_KEY) {
    console.error("LOOPS_API_KEY is not set - aborting");
    return new Response(
      JSON.stringify({ error: "LOOPS_API_KEY is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const results = {
    synced: 0,
    skipped: 0,
    errors: [] as string[],
    dryRun,
  };

  try {
    // ------------------------------------------------------------------
    // Fetch contacts that need syncing.
    //
    // Ideal query once migration runs:
    //   .or("loops_synced_at.is.null,last_activity_at.gt.loops_synced_at")
    //
    // Until then we fetch all contacts and filter client-side using isDueForSync().
    // The batch limit keeps this from being expensive in production.
    // ------------------------------------------------------------------

    const { data: contacts, error: fetchErr } = await supabase
      .from("crm_contacts")
      .select(
        "id, email, first_name, last_name, source, status, awareness_level, tags, metadata, last_activity_at, loops_synced_at"
      )
      .order("last_activity_at", { ascending: false })
      .limit(batchLimit * 5); // Fetch extra to account for already-synced rows

    if (fetchErr) {
      // loops_synced_at column might not exist yet - retry without it
      console.warn(
        `Initial fetch failed (${fetchErr.message}), retrying without loops_synced_at column`
      );

      const { data: fallbackContacts, error: fallbackErr } = await supabase
        .from("crm_contacts")
        .select(
          "id, email, first_name, last_name, source, status, awareness_level, tags, metadata, last_activity_at"
        )
        .order("last_activity_at", { ascending: false })
        .limit(batchLimit * 5);

      if (fallbackErr) throw fallbackErr;

      // Re-assign so the rest of the function uses the fallback result
      (contacts as any) = fallbackContacts;
    }

    const dueContacts = (contacts || [])
      .filter((c: CrmContact) => isDueForSync(c))
      .slice(0, batchLimit);

    console.log(
      `Loops sync: ${dueContacts.length} contacts due for sync (${dryRun ? "DRY RUN" : "LIVE"})`
    );

    const syncedAt = new Date().toISOString();

    for (const contact of dueContacts as CrmContact[]) {
      try {
        const payload = buildLoopsPayload(contact);

        if (dryRun) {
          console.log(
            `  [DRY RUN] Would sync ${contact.email} -> ${JSON.stringify(payload)}`
          );
          results.synced++;
          continue;
        }

        // Upsert contact record in Loops
        await upsertLoopsContact(payload);

        // For first-time syncs of converted (buyer) contacts that arrived
        // outside Stripe (e.g. manual imports), fire a contact_synced event
        // so Loops can branch automation accordingly.
        const isFirstSync =
          !contact.loops_synced_at && !contact.metadata?.loops_synced_at;

        if (isFirstSync && contact.status === "converted") {
          try {
            await sendLoopsEvent(contact.email, "contact_synced", {
              productType: contact.metadata?.product_type || "",
              isBundle: payload.isBundle,
              totalSpent: payload.totalSpent ?? 0,
              source: "loops_sync_function",
            });
            console.log(
              `  Fired contact_synced event for first-time buyer ${contact.email}`
            );
          } catch (evtErr: any) {
            // Non-fatal - contact is still synced even if the event fails
            console.warn(
              `  Event fire failed for ${contact.email}: ${evtErr.message}`
            );
          }
        }

        await markSynced(contact, syncedAt);

        console.log(`  Synced ${contact.email} (userGroup: ${payload.userGroup})`);
        results.synced++;
      } catch (e: any) {
        console.error(`  Failed for ${contact.email}: ${e.message}`);
        results.errors.push(`${contact.email}: ${e.message}`);
        results.skipped++;
      }
    }

    console.log(
      `Loops sync complete: ${results.synced} synced, ${results.skipped} failed, ${results.errors.length} errors`
    );

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error(`Loops sync fatal error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
