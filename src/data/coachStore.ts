/**
 * Unified Coach Store
 *
 * Merges hard-coded sample coaches with custom coaches stored in localStorage.
 * Provides helpers for CRUD operations used by Admin, Browse, and Profile pages.
 */

import { sampleCoaches, getAllCoaches as getSampleCoaches } from "./sampleCoach";
import { allCoaches as sampleBrowseCoaches } from "./dashboardData";
import type { Coach } from "@/types/coach";
import type { Coach as BrowseCoach } from "./dashboardData";

const STORAGE_KEY = "customCoaches";

/* ── Types ─────────────────────────────────────────────────── */

export interface StoredCoach {
    /** Full profile data */
    profile: Coach;
    /** Card data for the browse page */
    browse: BrowseCoach;
}

/* ── Helpers ───────────────────────────────────────────────── */

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function readCustomCoaches(): StoredCoach[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCustomCoaches(coaches: StoredCoach[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coaches));
}

/* ── Public API ────────────────────────────────────────────── */

/** Get all coaches for the Browse page (sample + custom) */
export function getAllBrowseCoaches(): BrowseCoach[] {
    const custom = readCustomCoaches().map((c) => c.browse);
    return [...sampleBrowseCoaches, ...custom];
}

/** Get a single coach profile by slug (sample first, then custom) */
export function getProfileCoach(slug: string): Coach | undefined {
    // Check sample coaches first
    const sample = sampleCoaches[slug];
    if (sample) return sample;

    // Check custom coaches
    const custom = readCustomCoaches().find((c) => c.profile.id === slug);
    return custom?.profile;
}

/** Get all custom coaches (admin view) */
export function getCustomCoaches(): StoredCoach[] {
    return readCustomCoaches();
}

/** Save a new coach (or update existing by slug) */
export function saveCoach(coach: StoredCoach): void {
    const existing = readCustomCoaches();
    const idx = existing.findIndex((c) => c.profile.id === coach.profile.id);
    if (idx >= 0) {
        existing[idx] = coach;
    } else {
        existing.push(coach);
    }
    writeCustomCoaches(existing);
}

/** Delete a custom coach by slug */
export function deleteCoach(slug: string): void {
    const existing = readCustomCoaches().filter((c) => c.profile.id !== slug);
    writeCustomCoaches(existing);
}

/** Check if a slug is already taken */
export function isSlugTaken(slug: string): boolean {
    if (sampleCoaches[slug]) return true;
    return readCustomCoaches().some((c) => c.profile.id === slug);
}

/** Get the next available numeric ID for browse coaches */
export function getNextBrowseId(): number {
    const allBrowse = getAllBrowseCoaches();
    return Math.max(...allBrowse.map((c) => c.id), 0) + 1;
}
