import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Types ─────────────────────────────────────────────────── */

export interface AvailabilitySlot {
    id: string;
    coach_id: string;
    day_of_week: number; // 0=Sunday, 1=Monday, ... 6=Saturday
    start_time: string; // "HH:MM:SS"
    end_time: string;
    is_active: boolean;
    created_at: string;
}

export interface AvailabilityInput {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active?: boolean;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ─── Fetch availability for a coach (public) ───────────────── */

export function useCoachAvailability(coachId: string | undefined) {
    return useQuery({
        queryKey: ['availability', coachId],
        queryFn: async () => {
            if (!coachId) return [];
            const { data, error } = await supabase
                .from('availability')
                .select('*')
                .eq('coach_id', coachId)
                .eq('is_active', true)
                .order('day_of_week', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) {
                console.error('Error fetching availability:', error);
                return [];
            }
            return (data || []) as AvailabilitySlot[];
        },
        enabled: !!coachId,
    });
}

/* ─── Fetch own availability (coach editing their schedule) ─── */

export function useMyAvailability() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['my-availability', user?.id],
        queryFn: async () => {
            if (!user) return [];

            // Get coach id from user id
            const { data: coachRow } = await supabase
                .from('coaches')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!coachRow) return [];

            const { data, error } = await supabase
                .from('availability')
                .select('*')
                .eq('coach_id', coachRow.id)
                .order('day_of_week', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) {
                console.error('Error fetching own availability:', error);
                return [];
            }
            return (data || []) as AvailabilitySlot[];
        },
        enabled: !!user,
    });
}

/* ─── Save availability (replaces all slots for a coach) ────── */

export function useSaveAvailability() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (slots: AvailabilityInput[]) => {
            if (!user) throw new Error('Must be logged in');

            const { data: coachRow } = await supabase
                .from('coaches')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!coachRow) throw new Error('Coach profile not found');

            // Delete all existing slots for this coach
            const { error: deleteError } = await supabase
                .from('availability')
                .delete()
                .eq('coach_id', coachRow.id);

            if (deleteError) throw deleteError;

            // Insert fresh slots (skip empty days)
            const activeSlots = slots.filter(s => s.start_time && s.end_time);
            if (activeSlots.length === 0) return;

            const { error: insertError } = await supabase
                .from('availability')
                .insert(
                    activeSlots.map(s => ({
                        coach_id: coachRow.id,
                        day_of_week: s.day_of_week,
                        start_time: s.start_time,
                        end_time: s.end_time,
                        is_active: s.is_active ?? true,
                    }))
                );

            if (insertError) throw insertError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-availability'] });
            queryClient.invalidateQueries({ queryKey: ['availability'] });
        },
    });
}

/* ─── Helper: build available time slots for a given date ───── */

export function getTimeSlotsForDate(
    availability: AvailabilitySlot[],
    date: Date,
    durationMinutes: number = 60
): string[] {
    const dayOfWeek = date.getDay();
    const slotsForDay = availability.filter(a => a.day_of_week === dayOfWeek);

    const result: string[] = [];

    for (const slot of slotsForDay) {
        const [startH, startM] = slot.start_time.split(':').map(Number);
        const [endH, endM] = slot.end_time.split(':').map(Number);

        let current = startH * 60 + startM;
        const end = endH * 60 + endM;

        while (current + durationMinutes <= end) {
            const h = Math.floor(current / 60);
            const m = current % 60;
            result.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            current += durationMinutes;
        }
    }

    return result;
}
