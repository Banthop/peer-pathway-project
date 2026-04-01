import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import type { DbUser, UserType } from "@/integrations/supabase/types";

const IS_WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: DbUser | null;
    userType: UserType | null;
    loading: boolean;
}

interface AuthContextValue extends AuthState {
    signUp: (email: string, password: string, name: string, type: UserType) => Promise<{ error: AuthError | Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null; userType: string | null }>;
    signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | Error | null }>;
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

    // Track whether signIn() already handled the session to avoid double-processing
    const signInHandledRef = useRef(false);

    // Track whether signIn() already handled the session to avoid double-processing

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

        // Get the initial session - set state immediately from metadata
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const metaType = (session.user.user_metadata?.type as UserType) ?? null;
                setState({
                    user: session.user,
                    session,
                    profile: null,    // Profile loaded lazily, not needed for routing
                    userType: metaType,
                    loading: false,
                });
            } else {
                setState(s => ({ ...s, loading: false }));
            }
        }).catch((err) => {
            console.error("[EarlyEdge] Failed to get auth session:", err);
            setState(s => ({ ...s, loading: false }));
        });

        // Listen for future auth changes (fires after email confirmation, OAuth, etc.)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session?.user) {
                setState({
                    user: null,
                    session: null,
                    profile: null,
                    userType: null,
                    loading: false,
                });
                return;
            }

            // For TOKEN_REFRESHED, just update the session/user
            if (event === 'TOKEN_REFRESHED') {
                setState(prev => ({ ...prev, session, user: session.user }));
                return;
            }

            // For SIGNED_IN: skip if signIn() already handled this
            if (signInHandledRef.current) {
                signInHandledRef.current = false;
                return;
            }

            // For OAuth sign-ins (Google), ensure profile exists in the users table
            if (event === 'SIGNED_IN') {
                ensureProfile(session.user).catch(console.error);
            }

            // Use user_metadata as fallback for userType
            const metaType = (session.user.user_metadata?.type as UserType) ?? null;
            setState(prev => ({
                ...prev,
                user: session.user,
                session,
                userType: prev.userType || metaType || "student",
                loading: false,
            }));
        });

        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            // Immediately set auth state so route guards don't redirect
            // before the navigate() in the signup page can fire.
            if (data.user && data.session) {
                signInHandledRef.current = true;
                setState(prev => ({
                    ...prev,
                    user: data.user,
                    session: data.session,
                    userType: type,
                    loading: false,
                }));
            } else if (data.user) {
                // Email confirmation enabled - user exists but no session yet.
                // Set user+type so CoachRoute allows access to onboarding.
                signInHandledRef.current = true;
                setState(prev => ({
                    ...prev,
                    user: data.user,
                    userType: type,
                    loading: false,
                }));
            }

            return { error: null };
        },
        []
    );

    const signIn = useCallback(async (email: string, password: string) => {
        if (!supabase) return { error: new Error("Supabase not configured"), userType: null as string | null };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error, userType: null as string | null };

        // Get user type from auth metadata (fast, no DB call needed for redirect)
        const userType = (data.user?.user_metadata?.type as UserType) ?? null;

        // Immediately set user+session so ProtectedRoute doesn't redirect.
        // Profile will be fully loaded by onAuthStateChange listener.
        if (data.user && data.session) {
            setState(prev => ({
                ...prev,
                user: data.user,
                session: data.session,
                loading: false,
                userType,
            }));
        }

        signInHandledRef.current = true;
        return { error: null, userType };
    }, []);

    const signInWithGoogle = useCallback(async (redirectTo?: string) => {
        if (!supabase) return { error: new Error("Supabase not configured") };
        // In WEBINAR_ONLY mode, default redirect to /portal instead of /dashboard
        const defaultRedirect = IS_WEBINAR_ONLY ? "/portal" : "/dashboard";
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectTo || `${window.location.origin}${defaultRedirect}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
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
