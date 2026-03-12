import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to start a conversation with a coach.
 * If a conversation already exists, returns its ID.
 * If not, creates a new one and returns its ID.
 */
export function useStartConversation() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ coachId }: { coachId: string }) => {
            if (!supabaseAvailable || !supabase || !user) {
                throw new Error("Not authenticated or Supabase not configured");
            }

            // Check if conversation already exists
            const { data: existing } = await supabase
                .from("conversations")
                .select("id")
                .eq("coach_id", coachId)
                .eq("student_id", user.id)
                .single();

            if (existing) return existing.id;

            // Create new conversation
            const { data, error } = await supabase
                .from("conversations")
                .insert({
                    coach_id: coachId,
                    student_id: user.id,
                    last_message_at: new Date().toISOString(),
                })
                .select("id")
                .single();

            if (error) throw error;
            return data.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
    });
}
