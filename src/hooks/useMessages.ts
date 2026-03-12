import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { DbConversation, DbMessage } from "@/integrations/supabase/types";

/**
 * Fetch conversations for the current user.
 */
export function useConversations() {
    const { user, userType } = useAuth();

    return useQuery({
        queryKey: ["conversations", user?.id],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return [];

            // For coaches, first get their coach row ID
            let coachId: string | null = null;
            if (userType === "coach") {
                const { data: coach } = await supabase
                    .from("coaches")
                    .select("id")
                    .eq("user_id", user.id)
                    .single();
                coachId = coach?.id ?? null;
                if (!coachId) return [];
            }

            // Simple filter based on user type — no subqueries
            let query = supabase
                .from("conversations")
                .select(`
                    *,
                    coach:coaches(
                        id,
                        user_id,
                        headline,
                        user:users(name, avatar_url)
                    ),
                    student:users!conversations_student_id_fkey(name, avatar_url)
                `)
                .order("last_message_at", { ascending: false });

            if (userType === "coach" && coachId) {
                query = query.eq("coach_id", coachId);
            } else {
                query = query.eq("student_id", user.id);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching conversations:", error);
                return [];
            }
            return data ?? [];
        },
        enabled: !!user,
        staleTime: 60 * 1000,
    });
}

/**
 * Fetch messages in a conversation, with Realtime subscription.
 */
export function useMessages(conversationId: string | undefined) {
    const queryClient = useQueryClient();

    const query = useQuery<DbMessage[]>({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !conversationId) return [];

            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                return [];
            }
            return (data as DbMessage[]) ?? [];
        },
        enabled: !!conversationId,
        staleTime: 30 * 1000,
    });

    // Realtime subscription for new messages
    useEffect(() => {
        if (!supabaseAvailable || !supabase || !conversationId) return;

        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    // Append new message to cache
                    queryClient.setQueryData<DbMessage[]>(
                        ["messages", conversationId],
                        (old) => [...(old ?? []), payload.new as DbMessage]
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, queryClient]);

    return query;
}

/**
 * Send a message in a conversation.
 */
export function useSendMessage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            conversationId,
            recipientId,
            content,
        }: {
            conversationId: string;
            recipientId: string;
            content: string;
        }) => {
            if (!supabaseAvailable || !supabase || !user) {
                throw new Error("Supabase not configured or user not authenticated");
            }

            const { data, error } = await supabase
                .from("messages")
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    recipient_id: recipientId,
                    content,
                })
                .select()
                .single();

            if (error) throw error;

            // Update conversation.last_message_at
            await supabase
                .from("conversations")
                .update({ last_message_at: new Date().toISOString() })
                .eq("id", conversationId);

            return data as DbMessage;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            // Messages update via Realtime, but invalidate as fallback
            queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
        },
    });
}

/**
 * Get unread message count for the current user.
 */
export function useUnreadCount() {
    const { user } = useAuth();

    return useQuery<number>({
        queryKey: ["unread-count", user?.id],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return 0;

            const { count, error } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true })
                .eq("recipient_id", user.id)
                .eq("is_read", false);

            if (error) return 0;
            return count ?? 0;
        },
        enabled: !!user,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000, // Poll every 30s as backup to Realtime
    });
}

/**
 * Create or find an existing conversation between the current user and a coach.
 */
export function useStartConversation() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ coachId }: { coachId: string }) => {
            if (!supabaseAvailable || !supabase || !user) {
                throw new Error("Not authenticated");
            }

            // Check if conversation already exists
            const { data: existing } = await supabase
                .from("conversations")
                .select("id")
                .eq("student_id", user.id)
                .eq("coach_id", coachId)
                .maybeSingle();

            if (existing) return existing.id as string;

            // Create new conversation
            const { data: newConvo, error } = await supabase
                .from("conversations")
                .insert({
                    student_id: user.id,
                    coach_id: coachId,
                    last_message_at: new Date().toISOString(),
                })
                .select("id")
                .single();

            if (error) throw error;
            return newConvo.id as string;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
    });
}
