import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StudentReview {
    id: string;
    student: string;
    avatar: string;
    sessionType: string;
    date: string;
    rating: number;
    text: string;
    outcome?: string;
    replied?: boolean;
    reply?: string;
}

export function useCoachReviews() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['coachReviews', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id,
                    rating,
                    text,
                    outcome_badge,
                    created_at,
                    student:users!reviews_student_id_fkey(name, avatar_url),
                    booking:bookings(type)
                `)
                .eq('coach_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching reviews:', error);
                throw error;
            }

            return data.map((review: any): StudentReview => ({
                id: review.id,
                student: review.student?.name || 'Unknown Student',
                avatar: review.student?.avatar_url || (review.student?.name ? review.student.name.substring(0, 2).toUpperCase() : 'U'),
                sessionType: review.booking?.type === 'intro' ? 'Intro Call' : review.booking?.type === 'package_session' ? 'Package Session' : '1:1 Session',
                date: new Date(review.created_at).toLocaleDateString(),
                rating: review.rating,
                text: review.text || '',
                outcome: review.outcome_badge,
                replied: false,
                reply: undefined,
            }));
        },
        enabled: !!user,
    });
}
