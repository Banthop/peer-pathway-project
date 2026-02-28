import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { DbConversation, DbMessage } from "@/integrations/supabase/types";

/**
 * Fetch conversations for the current user.
 */
export function useConversations() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["conversations", user?.id],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return [];

            const { data, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    coach:coaches(
                        id,
                        user_id,
                        headline,
                        user:users(name, avatar_url)
                    ),
                    student:users(name, avatar_url),
                    messages(
                        id,
                        content,
                        created_at,
                        is_read,
                        sender_id
                    )
                `)
                .or(`student_id.eq.${user.id},coach_id.in.(select id from coaches where user_id = '${user.id}')`)
                .order("last_message_at", { ascending: false });

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
