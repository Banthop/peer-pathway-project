import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCoachProfile() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["coachProfile", user?.id],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return null;

            const { data, error } = await supabase
                .from("coaches")
                .select("*, user:users(name, avatar_url)")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error("Error fetching coach profile:", error);
                return null;
            }
            return data;
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateCoachProfile() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: any) => {
            if (!supabaseAvailable || !supabase || !user) throw new Error("Supabase not configured or user not authenticated");

            // Split updates into users table and coaches table
            const userUpdates: any = {};
            if (updates.name !== undefined) userUpdates.name = updates.name;
            if (updates.avatar_url !== undefined) userUpdates.avatar_url = updates.avatar_url;

            if (Object.keys(userUpdates).length > 0) {
                const { error: userError } = await supabase
                    .from("users")
                    .update(userUpdates)
                    .eq("id", user.id);
                if (userError) throw userError;
            }

            const coachUpdates: Record<string, any> = { ...updates };
            delete coachUpdates.name;
            delete coachUpdates.avatar_url;

            if (Object.keys(coachUpdates).length > 0) {
                const { error: coachError } = await supabase
                    .from("coaches")
                    .update(coachUpdates)
                    .eq("user_id", user.id);
                if (coachError) throw coachError;
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coachProfile", user?.id] });
        }
    });
}
