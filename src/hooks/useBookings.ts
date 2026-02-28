import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { DbBooking } from "@/integrations/supabase/types";

type BookingStatusFilter = "upcoming" | "past" | "all";

/**
 * Fetch bookings for the current student.
 * Falls back to empty array when Supabase is unavailable.
 */
export function useStudentBookings(status: BookingStatusFilter = "all") {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["student-bookings", user?.id, status],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return [];

            let query = supabase
                .from("bookings")
                .select(`
                    *,
                    coach:coaches (
                        id,
                        headline,
                        hourly_rate,
                        user:users (
                            name,
                            avatar_url
                        )
                    )
                `)
                .eq("student_id", user.id)
                .order("scheduled_at", { ascending: status === "upcoming" });

            if (status === "upcoming") {
                query = query.gte("scheduled_at", new Date().toISOString()).not("status", "eq", "cancelled");
            } else if (status === "past") {
                query = query.lt("scheduled_at", new Date().toISOString());
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching bookings:", error);
                return [];
            }
            return data ?? [];
        },
        enabled: !!user,
        staleTime: 2 * 60 * 1000,
    });
}

/**
 * Fetch bookings for the current coach.
 */
export function useCoachBookings(status: BookingStatusFilter = "all") {
    const { user } = useAuth();

    return useQuery<DbBooking[]>({
        queryKey: ["coach-bookings", user?.id, status],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase || !user) return [];

            // First get coach ID for this user
            const { data: coach } = await supabase
                .from("coaches")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!coach) return [];

            let query = supabase
                .from("bookings")
                .select("*, student:users(name, avatar_url)")
                .eq("coach_id", coach.id)
                .order("scheduled_at", { ascending: status === "upcoming" });

            if (status === "upcoming") {
                query = query.gte("scheduled_at", new Date().toISOString()).not("status", "eq", "cancelled");
            } else if (status === "past") {
                query = query.lt("scheduled_at", new Date().toISOString());
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching coach bookings:", error);
                return [];
            }
            return (data as DbBooking[]) ?? [];
        },
        enabled: !!user,
        staleTime: 2 * 60 * 1000,
    });
}

interface CreateBookingInput {
    coach_id: string;
    service_id?: string;
    package_id?: string;
    type: "intro" | "session" | "package_session";
    scheduled_at: string;
    duration: number;
    price: number;
    notes?: string;
}

/**
 * Create a booking.
 */
export function useCreateBooking() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateBookingInput) => {
            if (!supabaseAvailable || !supabase || !user) {
                throw new Error("Supabase not configured or user not authenticated");
            }

            const { data, error } = await supabase
                .from("bookings")
                .insert({
                    ...input,
                    student_id: user.id,
                    status: input.type === "intro" ? "confirmed" : "pending",
                })
                .select()
                .single();

            if (error) throw error;
            return data as DbBooking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["coach-bookings"] });
        },
    });
}
