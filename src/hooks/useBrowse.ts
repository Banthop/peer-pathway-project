import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ─── Types ─────────────────────────────────────────────────── */

export interface TrendingTopic {
    id: string;
    label: string;
    category: string;
    emoji: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface SeasonBanner {
    id: string;
    title: string;
    subtitle: string | null;
    link_text: string | null;
    link_category: string | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
}

/* ─── Trending Topics ────────────────────────────────────────── */

export function useTrendingTopics() {
    return useQuery({
        queryKey: ['trending-topics'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('trending_topics')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error('Error fetching trending topics:', error);
                // Return sensible defaults so the UI never breaks
                return getDefaultTopics();
            }
            const result = (data || []) as TrendingTopic[];
            return result.length > 0 ? result : getDefaultTopics();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - these change rarely
    });
}

/* ─── Active Season Banner ───────────────────────────────────── */

export function useSeasonBanner() {
    return useQuery({
        queryKey: ['season-banner'],
        queryFn: async () => {
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from('season_banners')
                .select('*')
                .eq('is_active', true)
                .or(`starts_at.is.null,starts_at.lte.${now}`)
                .or(`ends_at.is.null,ends_at.gte.${now}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching season banner:', error);
                return null;
            }
            return data as SeasonBanner | null;
        },
        staleTime: 5 * 60 * 1000,
    });
}

/* ─── All Banners (admin) ────────────────────────────────────── */

export function useAllBanners() {
    return useQuery({
        queryKey: ['all-banners'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('season_banners')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching banners:', error);
                return [];
            }
            return (data || []) as SeasonBanner[];
        },
    });
}

/* ─── Default topics fallback (when DB is empty) ─────────────── */

function getDefaultTopics(): TrendingTopic[] {
    return [
        { id: '1', label: 'Goldman Sachs Spring Week', category: 'Investment Banking', emoji: '🏦', sort_order: 1, is_active: true },
        { id: '2', label: 'Oxbridge Applications', category: 'Oxbridge Applications', emoji: '🎓', sort_order: 2, is_active: true },
        { id: '3', label: 'UCAT Prep', category: 'UCAT', emoji: '🏥', sort_order: 3, is_active: true },
        { id: '4', label: 'McKinsey Case Prep', category: 'Consulting', emoji: '📊', sort_order: 4, is_active: true },
        { id: '5', label: 'Clifford Chance Vac Scheme', category: 'Law (Vac Schemes)', emoji: '⚖️', sort_order: 5, is_active: true },
        { id: '6', label: 'Cold Emailing Strategy', category: 'Cold Emailing', emoji: '📧', sort_order: 6, is_active: true },
    ];
}
