import { useState, useEffect, useMemo } from "react";

interface UniversityEntry {
    name: string;
    country: string;
    domains: string[];
    web_pages: string[];
}

/**
 * Fetches UK universities from the Hipo universities API on mount,
 * then provides instant local filtering as the user types.
 */
export function useUniversitySearch(query: string) {
    const [allUniversities, setAllUniversities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch("http://universities.hipolabs.com/search?country=United+Kingdom")
            .then((res) => res.json())
            .then((data: UniversityEntry[]) => {
                if (cancelled) return;
                // Deduplicate and sort alphabetically
                const names = Array.from(
                    new Set(data.map((u) => u.name)),
                ).sort((a, b) => a.localeCompare(b));
                setAllUniversities(names);
            })
            .catch(() => {
                // Silently fail; user can still type manually
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q || q.length < 2) return [];
        return allUniversities.filter((name) =>
            name.toLowerCase().includes(q),
        ).slice(0, 8); // limit to 8 suggestions
    }, [query, allUniversities]);

    return { universities: filtered, loading };
}
