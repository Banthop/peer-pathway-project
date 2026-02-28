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
                const profile = await fetchProfile(session.user.id);
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

        // Listen for future auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await fetchProfile(session.user.id);
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
    }, [fetchProfile]);

    // ---- Actions ----

    const signUp = useCallback(
        async (email: string, password: string, name: string, type: UserType) => {
            if (!supabase) return { error: new Error("Supabase not configured") };

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name, type } },
            });

            if (error) return { error };

            // Insert into public.users table (mirrors auth.users)
            if (data.user) {
                const { error: profileError } = await supabase.from("users").insert({
                    id: data.user.id,
                    email,
                    name,
                    type,
                });
                if (profileError) {
                    console.error("Failed to create user profile:", profileError);
                    return { error: profileError as unknown as Error };
                }

                // If type is coach, also create a coaches row
                if (type === "coach") {
                    await supabase.from("coaches").insert({
                        user_id: data.user.id,
                        headline: "",
                        categories: [],
                        hourly_rate: 5000, // £50 default
                    });
                }
            }

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
