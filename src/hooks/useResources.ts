import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Types ─────────────────────────────────────────────────── */

export interface ResourceData {
    id: string;
    coach_id: string;
    title: string;
    description: string | null;
    category: string | null;
    resource_type: 'guide' | 'template' | 'checklist' | 'toolkit' | 'article';
    price: number; // pence (0 = free)
    file_url: string | null;
    preview_text: string | null;
    download_count: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    coach?: {
        user: { name: string; avatar_url: string | null } | null;
        headline: string;
        university: string | null;
    };
}

export interface ResourcePurchase {
    id: string;
    resource_id: string;
    student_id: string;
    created_at: string;
}

/* ─── List Resources ────────────────────────────────────────── */

export function useResources(filters?: {
    category?: string;
    type?: string;
    freeOnly?: boolean;
}) {
    return useQuery({
        queryKey: ['resources', filters],
        queryFn: async () => {
            let query = supabase
                .from('resources')
                .select(`
                    *,
                    coach:coaches(
                        headline,
                        university,
                        user:users(name, avatar_url)
                    )
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (filters?.category && filters.category !== 'All') {
                query = query.eq('category', filters.category);
            }
            if (filters?.type && filters.type !== 'All') {
                query = query.eq('resource_type', filters.type);
            }
            if (filters?.freeOnly) {
                query = query.eq('price', 0);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching resources:', error);
                return [];
            }
            return (data || []) as ResourceData[];
        },
    });
}

/* ─── Single Resource ───────────────────────────────────────── */

export function useResource(resourceId: string | undefined) {
    return useQuery({
        queryKey: ['resource', resourceId],
        queryFn: async () => {
            if (!resourceId) return null;
            const { data, error } = await supabase
                .from('resources')
                .select(`
                    *,
                    coach:coaches(
                        headline,
                        university,
                        user:users(name, avatar_url)
                    )
                `)
                .eq('id', resourceId)
                .single();

            if (error) throw error;
            return data as ResourceData;
        },
        enabled: !!resourceId,
    });
}

/* ─── My Purchases ──────────────────────────────────────────── */

export function useMyPurchases() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['resourcePurchases', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('resource_purchases')
                .select('resource_id')
                .eq('student_id', user.id);

            if (error) {
                console.error('Error fetching purchases:', error);
                return [];
            }
            return (data || []).map((p: any) => p.resource_id as string);
        },
        enabled: !!user,
    });
}

/* ─── Purchase Resource ─────────────────────────────────────── */

export function usePurchaseResource() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (resourceId: string) => {
            if (!user) throw new Error('Must be logged in');

            const { error } = await supabase
                .from('resource_purchases')
                .insert({
                    resource_id: resourceId,
                    student_id: user.id,
                });

            if (error) throw error;

            // Increment download count
            await supabase.rpc('increment_resource_downloads', { p_resource_id: resourceId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
            queryClient.invalidateQueries({ queryKey: ['resourcePurchases'] });
        },
    });
}

/* ─── Coach: Create Resource ────────────────────────────────── */

export function useCreateResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: {
            coach_id: string;
            title: string;
            description?: string;
            category?: string;
            resource_type: 'guide' | 'template' | 'checklist' | 'toolkit' | 'article';
            price: number;
            file_url?: string;
            preview_text?: string;
        }) => {
            const { data, error } = await supabase
                .from('resources')
                .insert(input)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });
}
