import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import type { DbUser, UserType } from "@/integrations/supabase/types";

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: DbUser | null;
    userType: UserType | null;
    loading: boolean;
}

interface AuthContextValue extends AuthState {
    signUp: (email: string, password: string, name: string, type: UserType) => Promise<{ error: AuthError | Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        profile: null,
        userType: null,
        loading: true,
    });

    // Fetch the user's profile row from the `users` table
    const fetchProfile = useCallback(async (userId: string) => {
        if (!supabase) return null;
        const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        return (data as DbUser) ?? null;
    }, []);

    // Create a profile row in `users` table if one doesn't exist yet.
    // This runs after email confirmation when the SIGNED_IN event fires.
    const ensureProfile = useCallback(async (user: User) => {
        if (!supabase) return null;

        // Check if profile already exists
        const existing = await fetchProfile(user.id);
        if (existing) return existing;

        // Pull name & type from auth metadata (set during signUp)
        const meta = user.user_metadata ?? {};
        const name = meta.name || meta.full_name || user.email?.split("@")[0] || "User";
        const type: UserType = meta.type || "student";

        // Insert profile
        const { error: profileError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email!,
            name,
            type,
        });

        if (profileError) {
            console.error("Failed to create user profile:", profileError);
            return null;
        }

        // If coach, also create a coaches row
        if (type === "coach") {
            await supabase.from("coaches").insert({
                user_id: user.id,
                headline: "",
                categories: [],
                hourly_rate: 5000, // £50 default
            });
        }

        // Fetch and return the newly created profile
        return await fetchProfile(user.id);
    }, [fetchProfile]);

    // ---- Auth state listener ----
    useEffect(() => {
        if (!supabaseAvailable || !supabase) {
            // Demo mode – no real auth
            setState((s) => ({ ...s, loading: false }));
            return;
        }

        // Get the initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const profile = await ensureProfile(session.user);
                setState({
                    user: session.user,
                    session,
                    profile,
                    userType: profile?.type ?? null,
                    loading: false,
                });
            } else {
                setState((s) => ({ ...s, loading: false }));
            }
        });

        // Listen for future auth changes (fires after email confirmation, OAuth, etc.)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Ensure profile exists — creates it on first SIGNED_IN after email confirmation
                const profile = await ensureProfile(session.user);
                setState({
                    user: session.user,
                    session,
                    profile,
                    userType: profile?.type ?? null,
                    loading: false,
                });
            } else {
                setState({
                    user: null,
                    session: null,
                    profile: null,
                    userType: null,
                    loading: false,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [ensureProfile]);

    // ---- Actions ----

    const signUp = useCallback(
        async (email: string, password: string, name: string, type: UserType) => {
            if (!supabase) return { error: new Error("Supabase not configured") };

            // Store name & type in auth metadata — the profile row will be
            // created automatically by ensureProfile() when the user confirms
            // their email and the SIGNED_IN event fires.
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name, type } },
            });

            if (error) return { error };
            return { error: null };
        },
        []
    );

    const signIn = useCallback(async (email: string, password: string) => {
        if (!supabase) return { error: new Error("Supabase not configured") };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    }, []);

    const signInWithGoogle = useCallback(async () => {
        if (!supabase) return { error: new Error("Supabase not configured") };
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/dashboard` },
        });
        return { error };
    }, []);

    const signOut = useCallback(async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        if (!supabase) return { error: new Error("Supabase not configured") };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
        return { error };
    }, []);

    const value: AuthContextValue = {
        ...state,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
