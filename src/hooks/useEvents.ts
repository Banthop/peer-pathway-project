import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Types ─────────────────────────────────────────────────── */

export interface EventData {
    id: string;
    coach_id: string;
    title: string;
    description: string | null;
    event_type: 'workshop' | 'bootcamp' | 'ama' | 'panel';
    category: string | null;
    scheduled_at: string;
    duration: number;
    max_attendees: number;
    current_attendees: number;
    price: number; // pence
    meeting_link: string | null;
    is_active: boolean;
    created_at: string;
    coach?: {
        user: { name: string; avatar_url: string | null } | null;
        headline: string;
        university: string | null;
    };
}

export interface EventRegistration {
    id: string;
    event_id: string;
    student_id: string;
    status: 'confirmed' | 'cancelled';
    created_at: string;
}

/* ─── List Events ───────────────────────────────────────────── */

export function useEvents(category?: string) {
    return useQuery({
        queryKey: ['events', category],
        queryFn: async () => {
            let query = supabase
                .from('events')
                .select(`
                    *,
                    coach:coaches(
                        headline,
                        university,
                        user:users(name, avatar_url)
                    )
                `)
                .eq('is_active', true)
                .gte('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true });

            if (category && category !== 'All') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching events:', error);
                // Return mock data on error (table may not exist yet)
                return [];
            }
            return (data || []) as EventData[];
        },
    });
}

/* ─── Single Event ──────────────────────────────────────────── */

export function useEvent(eventId: string | undefined) {
    return useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            if (!eventId) return null;
            const { data, error } = await supabase
                .from('events')
                .select(`
                    *,
                    coach:coaches(
                        headline,
                        university,
                        user:users(name, avatar_url)
                    )
                `)
                .eq('id', eventId)
                .single();

            if (error) throw error;
            return data as EventData;
        },
        enabled: !!eventId,
    });
}

/* ─── My Registrations ──────────────────────────────────────── */

export function useMyEventRegistrations() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['eventRegistrations', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('event_registrations')
                .select('event_id')
                .eq('student_id', user.id)
                .eq('status', 'confirmed');

            if (error) {
                console.error('Error fetching registrations:', error);
                return [];
            }
            return (data || []).map((r: any) => r.event_id as string);
        },
        enabled: !!user,
    });
}

/* ─── Register for Event ────────────────────────────────────── */

export function useRegisterForEvent() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            if (!user) throw new Error('Must be logged in');

            const { error } = await supabase
                .from('event_registrations')
                .insert({
                    event_id: eventId,
                    student_id: user.id,
                    status: 'confirmed',
                });

            if (error) throw error;

            // Increment attendee count
            await supabase.rpc('increment_event_attendees', { p_event_id: eventId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['eventRegistrations'] });
        },
    });
}

/* ─── Unregister from Event ─────────────────────────────────── */

export function useUnregisterFromEvent() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            if (!user) throw new Error('Must be logged in');

            const { error } = await supabase
                .from('event_registrations')
                .update({ status: 'cancelled' })
                .eq('event_id', eventId)
                .eq('student_id', user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['eventRegistrations'] });
        },
    });
}

/* ─── Coach: Create Event ───────────────────────────────────── */

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: {
            coach_id: string;
            title: string;
            description?: string;
            event_type: 'workshop' | 'bootcamp' | 'ama' | 'panel';
            category?: string;
            scheduled_at: string;
            duration: number;
            max_attendees: number;
            price: number;
            meeting_link?: string;
        }) => {
            const { data, error } = await supabase
                .from('events')
                .insert(input)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}
