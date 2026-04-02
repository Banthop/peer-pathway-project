import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ─── Types ─────────────────────────────────────────────────── */

export interface AdminStats {
    total_students: number;
    total_coaches: number;
    verified_coaches: number;
    unverified_coaches: number;
    total_bookings: number;
    completed_bookings: number;
    confirmed_bookings: number;
    total_revenue_pence: number;
    bookings_this_month: number;
    revenue_this_month_pence: number;
    total_reviews: number;
    average_rating: number;
    upcoming_events: number;
    total_resources: number;
}

export interface MonthlyRevenue {
    month: string;
    booking_count: number;
    gross_revenue_pence: number;
    platform_revenue_pence: number;
    coach_revenue_pence: number;
}

export interface AdminCoach {
    id: string;
    user_id: string;
    headline: string;
    university: string | null;
    hourly_rate: number;
    verified: boolean;
    stripe_onboarded: boolean;
    total_sessions: number;
    commission_rate: number;
    is_founding_coach: boolean;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    user: { name: string; email: string; avatar_url: string | null } | null;
}

/* ─── Admin Stats (from view) ────────────────────────────────── */

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // Query the admin_stats view created in migration 012
            const { data, error } = await supabase
                .from('admin_stats' as any)
                .select('*')
                .single();

            if (error || !data) {
                // Fallback: compute manually from raw tables
                return computeStatsFallback();
            }
            return data as AdminStats;
        },
        staleTime: 60 * 1000, // 1 minute
    });
}

/* ─── Fallback: compute stats from raw tables ────────────────── */

async function computeStatsFallback(): Promise<AdminStats> {
    const [
        { count: totalStudents },
        { count: totalCoaches },
        { count: verifiedCoaches },
        { count: totalBookings },
        { count: completedBookings },
        { count: confirmedBookings },
        bookingsData,
        { count: totalReviews },
        reviewsData,
        { count: upcomingEvents },
        { count: totalResources },
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('type', 'student'),
        supabase.from('coaches').select('*', { count: 'exact', head: true }),
        supabase.from('coaches').select('*', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('bookings').select('commission_amount').eq('status', 'completed'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('rating').eq('is_public', true),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('scheduled_at', new Date().toISOString()),
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    const totalRevenue = (bookingsData.data || []).reduce((sum: number, b: any) => sum + (b.commission_amount || 0), 0);
    const avgRating = reviewsData.data?.length
        ? (reviewsData.data as any[]).reduce((sum, r) => sum + r.rating, 0) / reviewsData.data.length
        : 0;

    // This month's bookings/revenue
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [thisMonthBookings, thisMonthRevenue] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('bookings').select('commission_amount').eq('status', 'completed').gte('created_at', monthStart.toISOString()),
    ]);

    const monthlyRevenuePence = (thisMonthRevenue.data || []).reduce((sum: number, b: any) => sum + (b.commission_amount || 0), 0);

    return {
        total_students: totalStudents || 0,
        total_coaches: totalCoaches || 0,
        verified_coaches: verifiedCoaches || 0,
        unverified_coaches: (totalCoaches || 0) - (verifiedCoaches || 0),
        total_bookings: totalBookings || 0,
        completed_bookings: completedBookings || 0,
        confirmed_bookings: confirmedBookings || 0,
        total_revenue_pence: totalRevenue,
        bookings_this_month: thisMonthBookings.count || 0,
        revenue_this_month_pence: monthlyRevenuePence,
        total_reviews: totalReviews || 0,
        average_rating: Math.round(avgRating * 10) / 10,
        upcoming_events: upcomingEvents || 0,
        total_resources: totalResources || 0,
    };
}

/* ─── Monthly Revenue (from view) ───────────────────────────── */

export function useMonthlyRevenue(months = 6) {
    return useQuery({
        queryKey: ['monthly-revenue', months],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('monthly_revenue' as any)
                .select('*')
                .limit(months);

            if (error || !data) {
                // Fallback: compute from raw bookings
                return computeMonthlyFallback(months);
            }
            return data as MonthlyRevenue[];
        },
        staleTime: 5 * 60 * 1000,
    });
}

async function computeMonthlyFallback(months: number): Promise<MonthlyRevenue[]> {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const { data } = await supabase
        .from('bookings')
        .select('price, commission_amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', cutoff.toISOString())
        .order('created_at', { ascending: false });

    if (!data || data.length === 0) return [];

    // Group by month
    const byMonth: Record<string, { gross: number; commission: number; count: number }> = {};
    for (const b of data as any[]) {
        const month = b.created_at.slice(0, 7); // "YYYY-MM"
        if (!byMonth[month]) byMonth[month] = { gross: 0, commission: 0, count: 0 };
        byMonth[month].gross += b.price || 0;
        byMonth[month].commission += b.commission_amount || 0;
        byMonth[month].count++;
    }

    return Object.entries(byMonth)
        .map(([month, v]) => ({
            month: `${month}-01`,
            booking_count: v.count,
            gross_revenue_pence: v.gross,
            platform_revenue_pence: v.commission,
            coach_revenue_pence: v.gross - v.commission,
        }))
        .sort((a, b) => b.month.localeCompare(a.month));
}

/* ─── All coaches (admin view) ───────────────────────────────── */

export function useAdminCoaches() {
    return useQuery({
        queryKey: ['admin-coaches-full'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coaches')
                .select(`
                    id,
                    user_id,
                    headline,
                    university,
                    hourly_rate,
                    verified,
                    stripe_onboarded,
                    total_sessions,
                    commission_rate,
                    is_founding_coach,
                    is_featured,
                    is_active,
                    created_at,
                    user:users!coaches_user_id_fkey(name, email, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching admin coaches:', error);
                return [];
            }
            return (data || []) as AdminCoach[];
        },
    });
}

/* ─── Verify / unverify coach ─────────────────────────────────── */

export function useVerifyCoach() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ coachId, verified }: { coachId: string; verified: boolean }) => {
            const { error } = await supabase
                .from('coaches')
                .update({ verified })
                .eq('id', coachId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coaches-full'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });
}

/* ─── Feature / unfeature coach ──────────────────────────────── */

export function useFeatureCoach() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ coachId, featured }: { coachId: string; featured: boolean }) => {
            const { error } = await supabase
                .from('coaches')
                .update({ is_featured: featured })
                .eq('id', coachId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coaches-full'] });
        },
    });
}

/* ─── Deactivate coach ───────────────────────────────────────── */

export function useDeactivateCoach() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ coachId, active }: { coachId: string; active: boolean }) => {
            const { error } = await supabase
                .from('coaches')
                .update({ is_active: active })
                .eq('id', coachId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coaches-full'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });
}

/* ─── Create/update season banner ────────────────────────────── */

export function useUpsertBanner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (banner: Omit<SeasonBanner, 'id'> & { id?: string }) => {
            if (banner.id) {
                const { error } = await supabase
                    .from('season_banners')
                    .update(banner)
                    .eq('id', banner.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('season_banners')
                    .insert(banner);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-banners'] });
            queryClient.invalidateQueries({ queryKey: ['season-banner'] });
        },
    });
}

interface SeasonBanner {
    id: string;
    title: string;
    subtitle: string | null;
    link_text: string | null;
    link_category: string | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
}
