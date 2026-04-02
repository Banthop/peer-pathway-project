import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Types ─────────────────────────────────────────────────── */

export interface CoachService {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    duration: number; // minutes
    price: number | null; // pence, null = use hourly rate
    is_active: boolean;
    created_at: string;
}

export interface CoachPackage {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    session_count: number;
    price: number; // pence (total package price)
    is_active: boolean;
    created_at: string;
}

/* ─── Fetch services for a coach (public) ───────────────────── */

export function useCoachServices(coachId: string | undefined) {
    return useQuery({
        queryKey: ['coach-services', coachId],
        queryFn: async () => {
            if (!coachId) return [];
            const { data, error } = await supabase
                .from('coach_services')
                .select('*')
                .eq('coach_id', coachId)
                .eq('is_active', true)
                .order('price', { ascending: true });

            if (error) {
                console.error('Error fetching coach services:', error);
                return [];
            }
            return (data || []) as CoachService[];
        },
        enabled: !!coachId,
    });
}

/* ─── Fetch packages for a coach (public) ───────────────────── */

export function useCoachPackages(coachId: string | undefined) {
    return useQuery({
        queryKey: ['coach-packages', coachId],
        queryFn: async () => {
            if (!coachId) return [];
            const { data, error } = await supabase
                .from('coach_packages')
                .select('*')
                .eq('coach_id', coachId)
                .eq('is_active', true)
                .order('price', { ascending: true });

            if (error) {
                console.error('Error fetching coach packages:', error);
                return [];
            }
            return (data || []) as CoachPackage[];
        },
        enabled: !!coachId,
    });
}

/* ─── Fetch own services (coach managing their offerings) ────── */

export function useMyServices() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['my-services', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data: coachRow } = await supabase
                .from('coaches')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!coachRow) return [];

            const { data, error } = await supabase
                .from('coach_services')
                .select('*')
                .eq('coach_id', coachRow.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching own services:', error);
                return [];
            }
            return (data || []) as CoachService[];
        },
        enabled: !!user,
    });
}

/* ─── Fetch own packages (coach managing their offerings) ────── */

export function useMyPackages() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['my-packages', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data: coachRow } = await supabase
                .from('coaches')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!coachRow) return [];

            const { data, error } = await supabase
                .from('coach_packages')
                .select('*')
                .eq('coach_id', coachRow.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching own packages:', error);
                return [];
            }
            return (data || []) as CoachPackage[];
        },
        enabled: !!user,
    });
}

/* ─── Create service ─────────────────────────────────────────── */

export function useCreateService() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: Omit<CoachService, 'id' | 'created_at'>) => {
            if (!user) throw new Error('Must be logged in');
            const { data, error } = await supabase
                .from('coach_services')
                .insert(input)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-services'] });
        },
    });
}

/* ─── Update service ─────────────────────────────────────────── */

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<CoachService> & { id: string }) => {
            const { error } = await supabase
                .from('coach_services')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-services'] });
            queryClient.invalidateQueries({ queryKey: ['coach-services'] });
        },
    });
}

/* ─── Delete service ─────────────────────────────────────────── */

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serviceId: string) => {
            const { error } = await supabase
                .from('coach_services')
                .update({ is_active: false })
                .eq('id', serviceId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-services'] });
            queryClient.invalidateQueries({ queryKey: ['coach-services'] });
        },
    });
}

/* ─── Create package ─────────────────────────────────────────── */

export function useCreatePackage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: Omit<CoachPackage, 'id' | 'created_at'>) => {
            if (!user) throw new Error('Must be logged in');
            const { data, error } = await supabase
                .from('coach_packages')
                .insert(input)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-packages'] });
        },
    });
}

/* ─── Update package ─────────────────────────────────────────── */

export function useUpdatePackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<CoachPackage> & { id: string }) => {
            const { error } = await supabase
                .from('coach_packages')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-packages'] });
            queryClient.invalidateQueries({ queryKey: ['coach-packages'] });
        },
    });
}

/* ─── Delete package ─────────────────────────────────────────── */

export function useDeletePackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (packageId: string) => {
            const { error } = await supabase
                .from('coach_packages')
                .update({ is_active: false })
                .eq('id', packageId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-packages'] });
            queryClient.invalidateQueries({ queryKey: ['coach-packages'] });
        },
    });
}

/* ─── Helper: format price from pence ───────────────────────── */

export function formatPence(pence: number): string {
    return `£${(pence / 100).toFixed(0)}`;
}

export function formatPenceDecimal(pence: number): string {
    return `£${(pence / 100).toFixed(2)}`;
}
