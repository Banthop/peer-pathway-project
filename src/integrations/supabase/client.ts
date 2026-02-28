import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Whether Supabase is configured and available */
export const supabaseAvailable = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseAvailable) {
    console.warn(
        "[EarlyEdge] Supabase not configured — running in demo mode with sample data. " +
        "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to connect."
    );
}

// Create the client only when credentials exist; otherwise export null.
// All consumers should check `supabaseAvailable` before calling.
export const supabase: SupabaseClient | null = supabaseAvailable
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : null;
