import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import { getAllCoaches } from "@/data/sampleCoach";
import type { Coach, CoachService } from "@/types/coach";

interface CoachFilters {
    category?: string;
    search?: string;
    minRate?: number;
    maxRate?: number;
    sort?: "recommended" | "rating" | "price_asc" | "price_desc";
    limit?: number;
    offset?: number;
}

/* ------------------------------------------------------------------ */
/*  Map a Supabase coach row + its full_bio JSON into the Coach type  */
/* ------------------------------------------------------------------ */
function mapDbCoach(row: any, sampleFallback?: Coach): Coach {
    const fb = row.full_bio ? (typeof row.full_bio === "string" ? JSON.parse(row.full_bio) : row.full_bio) : {};
    const name: string = row.user?.name ?? "Coach";

    const services: CoachService[] = (fb.services ?? []).map((s: any) => ({
        name: s.name,
        duration: typeof s.duration === "number" ? `${s.duration} min` : s.duration ?? "60 min",
        price: typeof s.price === "string" ? parseInt(s.price, 10) * 100 : s.price ?? 0,
        description: s.description ?? "",
    }));

    return {
        id: row.id,
        name,
        tagline: row.headline || (fb.companyRole
            ? `${fb.companyRole} at ${fb.companyName ?? ""}`
            : sampleFallback?.tagline ?? ""),
        photo: row.photo_url || sampleFallback?.photo || "",
        rating: row.reviews?.length > 0
            ? Math.round((row.reviews.reduce((s: number, r: any) => s + r.rating, 0) / row.reviews.length) * 10) / 10
            : sampleFallback?.rating ?? 4.8,
        reviewCount: row.reviews?.length ?? sampleFallback?.reviewCount ?? 0,
        sessionsCompleted: row.total_sessions || sampleFallback?.sessionsCompleted || 0,
        followers: row.social_followers || sampleFallback?.followers || 0,
        university: {
            name: fb.education?.[0]?.institution ?? sampleFallback?.university?.name ?? "",
            logo: fb.education?.[0]?.logo ?? sampleFallback?.university?.logo ?? "",
            degree: fb.uniDegree ?? fb.education?.[0]?.degree ?? sampleFallback?.university?.degree ?? "",
            years: fb.uniYears ?? fb.education?.[0]?.years ?? sampleFallback?.university?.years ?? "",
        },
        company: {
            name: fb.companyName ?? sampleFallback?.company?.name ?? "",
            logo: fb.companyLogo ?? sampleFallback?.company?.logo ?? "",
            role: fb.companyRole ?? sampleFallback?.company?.role ?? "",
        },
        successCompanies: sampleFallback?.successCompanies ?? [],
        bio: row.bio || sampleFallback?.bio || "",
        skills: fb.skills
            ? (typeof fb.skills === "string" ? fb.skills.split(",").map((s: string) => s.trim()) : fb.skills)
            : sampleFallback?.skills ?? [],
        services: services.length > 0 ? services : sampleFallback?.services ?? [],
        hourlyRate: row.hourly_rate ? row.hourly_rate / 100 : sampleFallback?.hourlyRate ?? 50,
        experience: (fb.experience ?? []).map((e: any) => ({
            logo: e.logo || sampleFallback?.experience?.[0]?.logo || "",
            role: e.role ?? "",
            company: e.company ?? "",
            dates: e.dates ?? "",
            description: e.description,
            skills: e.skills,
        })),
        education: (fb.education ?? []).map((e: any) => ({
            logo: e.logo || sampleFallback?.education?.[0]?.logo || "",
            institution: e.institution ?? "",
            degree: e.degree ?? "",
            years: e.years ?? "",
            achievement: e.achievement,
        })),
        reviews: sampleFallback?.reviews ?? [],
        ratings: sampleFallback?.ratings ?? { knowledge: 4.8, value: 4.7, responsiveness: 4.9, supportiveness: 4.8 },
        availability: {
            nextSlot: fb.nextSlot ?? sampleFallback?.availability?.nextSlot ?? "Tomorrow",
            timezone: fb.timezone ?? sampleFallback?.availability?.timezone ?? "GMT",
        },
        package: fb.enablePackage ? {
            name: fb.packageName ?? "",
            sessions: parseInt(fb.packageSessions ?? "3", 10),
            price: parseInt(fb.packagePrice ?? "0", 10),
            originalPrice: parseInt(fb.packageOriginalPrice ?? "0", 10),
            includes: fb.packageIncludes ?? "",
        } : sampleFallback?.package,
        availableSlots: fb.enableSlots
            ? (fb.slots ?? []).map((s: any) => ({ day: s.day, time: s.time }))
            : sampleFallback?.availableSlots,
        ucatScores: sampleFallback?.ucatScores,
        ucatSJTBand: sampleFallback?.ucatSJTBand,
        landedOfferLabels: sampleFallback?.landedOfferLabels,
        upcomingEvent: sampleFallback?.upcomingEvent,
    };
}

function getSampleByName(): Map<string, Coach> {
    const map = new Map<string, Coach>();
    for (const c of getAllCoaches()) {
        const firstName = c.name.split(/[\s.]/)[0].toLowerCase();
        map.set(firstName, c);
    }
    return map;
}

/**
 * Fetch a list of coaches. Uses Supabase when available, falls back to sample data.
 */
export function useCoaches(filters?: CoachFilters) {
    return useQuery<Coach[]>({
        queryKey: ["coaches", filters],
        queryFn: async () => {
            if (!supabaseAvailable || !supabase) return getAllCoaches();

            const { data: rows, error } = await supabase
                .from("coaches")
                .select(`
                    *,
                    user:users!coaches_user_id_fkey(name, email, avatar_url),
                    reviews(rating)
                `)
                .eq("is_active", true)
                .eq("verified", true)
                .order("is_featured", { ascending: false })
                .order("total_sessions", { ascending: false });

            if (error || !rows || rows.length === 0) {
                console.warn("useCoaches: Supabase query failed or empty, using sample data", error);
                return getAllCoaches();
            }

            const sampleMap = getSampleByName();
            let coaches = rows.map((row: any) => {
                const firstName = (row.user?.name ?? "").split(/[\s.]/)[0].toLowerCase();
                return mapDbCoach(row, sampleMap.get(firstName));
            });

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
        },
        staleTime: 5 * 60 * 1000,
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

            if (!supabaseAvailable || !supabase) {
                return getAllCoaches().find(c => c.id === coachId) ?? null;
            }

            // Try UUID lookup first
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/.test(coachId);
            if (isUuid) {
                const { data: row, error } = await supabase
                    .from("coaches")
                    .select("*, user:users(name, email, avatar_url)")
                    .eq("id", coachId)
                    .single();

                if (!error && row) {
                    const sampleMap = getSampleByName();
                    const firstName = (row.user?.name ?? "").split(/[\s.]/)[0].toLowerCase();
                    return mapDbCoach(row, sampleMap.get(firstName));
                }
            }

            // Slug lookup: match by name (e.g. "sarah-k" → "Sarah K.")
            const sampleMatch = getAllCoaches().find(c => c.id === coachId);
            if (sampleMatch) {
                // Find the corresponding Supabase coach by name
                const firstName = sampleMatch.name.split(/[\s.]/)[0].toLowerCase();
                const { data: rows } = await supabase
                    .from("coaches")
                    .select("*, user:users(name, email, avatar_url)")
                    .eq("is_active", true);

                if (rows) {
                    const match = rows.find((r: any) =>
                        (r.user?.name ?? "").split(/[\s.]/)[0].toLowerCase() === firstName
                    );
                    if (match) {
                        const sampleMap = getSampleByName();
                        return mapDbCoach(match, sampleMap.get(firstName));
                    }
                }
                // Return sample data as last resort
                return sampleMatch;
            }

            return null;
        },
        enabled: !!coachId,
        staleTime: 5 * 60 * 1000,
    });
}
