/**
 * outreachSync.ts
 * Shared utility for reading/writing outreach data in localStorage
 * and syncing coach onboarding responses into the outreach tracker.
 */

const STORAGE_KEY = "earlyedge_outreach";

export interface OutreachCoachEntry {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    university: string;
    graduationYear: string;
    credential: string;
    credentialYear: number | null;
    categories: string[];
    educationServices: string[];
    careerServices: string[];
    oxbridgeCollege: string;
    universityOffers: string;
    categoryExperience: string;
    coachingExperience: string;
    packageWillingness: string;
    weeklyHours: string;
    source: "linkedin" | "tiktok" | "instagram" | "referral" | "other";
    tiktokHandle: string;
    followerCount: number;
    status: "found" | "researched" | "reached_out" | "replied" | "interested" | "call_scheduled" | "onboarded" | "not_interested" | "ghosted";
    priority: "high" | "medium" | "low";
    outreachMethod: "linkedin" | "tiktok" | "email" | "instagram" | "other";
    linkedinMessageSent: string | null;
    linkedinReplied: boolean;
    linkedinReplyDate: string | null;
    tiktokDmSent: string | null;
    tiktokReplied: boolean;
    tiktokReplyDate: string | null;
    followUpDate: string | null;
    followUpNote: string;
    formSubmitted: boolean;
    formSubmittedDate: string | null;
    headshotUploaded: boolean;
    notes: string;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
    // Onboarding data (populated when coach completes onboarding)
    onboardingData?: {
        tagline: string;
        bio: string;
        category: string;
        hourlyRate: string;
        uniName: string;
        uniDegree: string;
        companyName: string;
        companyRole: string;
        skills: string;
        services: { name: string; duration: string; price: string; description: string }[];
        enablePackage: boolean;
        packageName: string;
        packageSessions: string;
        packagePrice: string;
        packageOriginalPrice: string;
        packageIncludes: string;
        completedAt: string;
    };
    userId?: string; // link to Supabase user ID
}

function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadOutreachCoaches(): OutreachCoachEntry[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

export function saveOutreachCoaches(coaches: OutreachCoachEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coaches));
}

/**
 * Sync a completed onboarding form into the outreach tracker.
 * - If an entry with matching email exists, update it.
 * - Otherwise, create a new entry.
 */
export function syncOnboardingToOutreach(params: {
    email: string;
    name: string;
    userId: string;
    onboardingForm: {
        tagline: string;
        bio: string;
        category: string;
        hourlyRate: string;
        uniName: string;
        uniDegree: string;
        companyName: string;
        companyRole: string;
        skills: string;
        services: { name: string; duration: string; price: string; description: string }[];
        enablePackage: boolean;
        packageName: string;
        packageSessions: string;
        packagePrice: string;
        packageOriginalPrice: string;
        packageIncludes: string;
    };
}): void {
    const { email, name, userId, onboardingForm } = params;
    const coaches = loadOutreachCoaches();
    const now = new Date().toISOString();

    const onboardingData = {
        ...onboardingForm,
        completedAt: now,
    };

    // Try to find existing entry by email (case-insensitive)
    const existingIndex = coaches.findIndex(
        (c) => c.email.toLowerCase() === email.toLowerCase()
    );

    if (existingIndex >= 0) {
        // Update existing entry
        const existing = coaches[existingIndex];
        coaches[existingIndex] = {
            ...existing,
            status: "onboarded",
            formSubmitted: true,
            formSubmittedDate: now,
            updatedAt: now,
            userId,
            university: onboardingForm.uniName || existing.university,
            credential: onboardingForm.tagline || existing.credential,
            categories: onboardingForm.category
                ? [onboardingForm.category]
                : existing.categories,
            onboardingData,
        };
    } else {
        // Create new entry
        const nameParts = name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const newEntry: OutreachCoachEntry = {
            id: uid(),
            firstName,
            lastName,
            name,
            email,
            phone: "",
            linkedinUrl: "",
            university: onboardingForm.uniName,
            graduationYear: "",
            credential: onboardingForm.tagline,
            credentialYear: null,
            categories: onboardingForm.category ? [onboardingForm.category] : [],
            educationServices: [],
            careerServices: [],
            oxbridgeCollege: "",
            universityOffers: "",
            categoryExperience: "",
            coachingExperience: "",
            packageWillingness: onboardingForm.enablePackage ? "Yes, I have ideas for packages" : "No, just single sessions for now",
            weeklyHours: "",
            source: "other",
            tiktokHandle: "",
            followerCount: 0,
            status: "onboarded",
            priority: "medium",
            outreachMethod: "other",
            linkedinMessageSent: null,
            linkedinReplied: false,
            linkedinReplyDate: null,
            tiktokDmSent: null,
            tiktokReplied: false,
            tiktokReplyDate: null,
            followUpDate: null,
            followUpNote: "",
            formSubmitted: true,
            formSubmittedDate: now,
            headshotUploaded: false,
            notes: `Self-signed up via website. ${onboardingForm.companyName ? `Works at ${onboardingForm.companyName} (${onboardingForm.companyRole}).` : ""} Rate: £${onboardingForm.hourlyRate}/hr.`,
            addedBy: "Auto",
            createdAt: now,
            updatedAt: now,
            onboardingData,
            userId,
        };

        coaches.push(newEntry);
    }

    saveOutreachCoaches(coaches);
}
