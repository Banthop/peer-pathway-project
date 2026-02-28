import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { getAllCoaches } from "@/data/sampleCoach";
import type { Coach } from "@/types/coach";

interface CoachFilters {
    category?: string;
    search?: string;
    minRate?: number;
    maxRate?: number;
    sort?: "recommended" | "rating" | "price_asc" | "price_desc";
    limit?: number;
    offset?: number;
}

/**
 * Fetch a list of coaches. Uses Supabase when available, falls back to sample data.
 */
export function useCoaches(filters?: CoachFilters) {
    return useQuery<Coach[]>({
        queryKey: ["coaches", filters],
        queryFn: async () => {
            // If Supabase isn't available, return sample data
            if (!supabaseAvailable || !supabase) {
                let coaches = getAllCoaches();

                // Apply client-side filters to sample data
                if (filters?.category) {
                    coaches = coaches.filter((c) =>
                        c.skills.some((s) => s.toLowerCase().includes(filters.category!.toLowerCase()))
                    );
                }
                if (filters?.search) {
                    const q = filters.search.toLowerCase();
                    coaches = coaches.filter(
                        (c) =>
                            c.name.toLowerCase().includes(q) ||
                            c.company?.name.toLowerCase().includes(q) ||
                            c.tagline.toLowerCase().includes(q)
                    );
                }
                if (filters?.sort === "price_asc") {
                    coaches.sort((a, b) => a.hourlyRate - b.hourlyRate);
                } else if (filters?.sort === "price_desc") {
                    coaches.sort((a, b) => b.hourlyRate - a.hourlyRate);
                } else if (filters?.sort === "rating") {
                    coaches.sort((a, b) => b.rating - a.rating);
                }

                return coaches;
            }

            // TODO: Supabase query with joins for packages, services, reviews
            // For now, also return sample data until DB is seeded
            return getAllCoaches();
        },
        staleTime: 5 * 60 * 1000, // 5 min
    });
}

/**
 * Fetch a single coach by ID. Uses Supabase when available, falls back to sample data.
 */
export function useCoach(coachId: string | undefined) {
    return useQuery<Coach | null>({
        queryKey: ["coach", coachId],
        queryFn: async () => {
            if (!coachId) return null;

            // If Supabase isn't available, return sample data
            if (!supabaseAvailable || !supabase) {
                return getAllCoaches().find(c => c.id === coachId) ?? null;
            }

            // TODO: Supabase query with joins
            return getAllCoaches().find(c => c.id === coachId) ?? null;
        },
        enabled: !!coachId,
        staleTime: 5 * 60 * 1000,
    });
}
