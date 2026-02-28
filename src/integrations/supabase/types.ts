/**
 * TypeScript types matching the early.md database schema.
 * Prefixed with Db to avoid collision with frontend Coach/Booking types.
 */

export type UserType = "student" | "coach" | "admin";

export interface DbUser {
    id: string;
    email: string;
    name: string;
    type: UserType;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbCoach {
    id: string;
    user_id: string;
    bio: string | null;
    full_bio: string | null;
    headline: string;
    credential_year: number | null;
    university: string | null;
    categories: string[];
    hourly_rate: number; // pence
    photo_url: string | null;
    linkedin_url: string | null;
    verified: boolean;
    stripe_account_id: string | null;
    stripe_onboarded: boolean;
    total_sessions: number;
    commission_rate: number;
    is_founding_coach: boolean;
    founding_coach_expires_at: string | null;
    social_platform: string | null;
    social_url: string | null;
    social_followers: number | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbCoachPackage {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    session_count: number;
    price: number; // pence
    is_active: boolean;
    created_at: string;
}

export interface DbCoachService {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    duration: number; // minutes
    price: number | null; // pence, null = use coach hourly rate
    is_active: boolean;
    created_at: string;
}

export interface DbAvailability {
    id: string;
    coach_id: string;
    day_of_week: number; // 0=Sunday
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
}

export type BookingType = "intro" | "session" | "package_session";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface DbBooking {
    id: string;
    coach_id: string;
    student_id: string;
    service_id: string | null;
    package_id: string | null;
    type: BookingType;
    status: BookingStatus;
    scheduled_at: string;
    duration: number; // minutes
    price: number; // pence
    commission_amount: number;
    commission_rate: number | null;
    meeting_link: string | null;
    notes: string | null;
    stripe_payment_intent_id: string | null;
    stripe_transfer_id: string | null;
    cancelled_at: string | null;
    cancelled_by: string | null;
    cancellation_reason: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbReview {
    id: string;
    booking_id: string;
    coach_id: string;
    student_id: string;
    rating: number;
    text: string | null;
    outcome_badge: string | null;
    is_public: boolean;
    created_at: string;
}

export interface DbMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface DbConversation {
    id: string;
    coach_id: string;
    student_id: string;
    last_message_at: string | null;
    created_at: string;
}

export interface DbSeasonBanner {
    id: string;
    title: string;
    subtitle: string | null;
    link_text: string | null;
    link_category: string | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

export interface DbTrendingTopic {
    id: string;
    label: string;
    category: string;
    emoji: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export type EventType = "workshop" | "bootcamp" | "ama" | "panel";

export interface DbEvent {
    id: string;
    coach_id: string;
    title: string;
    description: string | null;
    event_type: EventType;
    category: string | null;
    scheduled_at: string;
    duration: number;
    max_attendees: number;
    current_attendees: number;
    price: number; // pence
    meeting_link: string | null;
    is_active: boolean;
    created_at: string;
}

export interface DbEventRegistration {
    id: string;
    event_id: string;
    student_id: string;
    stripe_payment_intent_id: string | null;
    status: "confirmed" | "cancelled";
    created_at: string;
}

export type ResourceType = "guide" | "template" | "checklist" | "toolkit" | "article";

export interface DbResource {
    id: string;
    coach_id: string;
    title: string;
    description: string | null;
    category: string | null;
    resource_type: ResourceType;
    price: number; // pence (0 = free)
    file_url: string | null;
    preview_text: string | null;
    download_count: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
}

export interface DbResourcePurchase {
    id: string;
    resource_id: string;
    student_id: string;
    stripe_payment_intent_id: string | null;
    created_at: string;
}

export interface DbReferral {
    id: string;
    referrer_id: string;
    referred_id: string | null;
    referral_code: string;
    discount_percentage: number;
    is_used: boolean;
    used_at: string | null;
    created_at: string;
}

/* ═══════════════════════════════════════════════════════════════ */
/* Coach Outreach Tracker                                         */
/* ═══════════════════════════════════════════════════════════════ */

export type OutreachSource = "linkedin" | "tiktok" | "instagram" | "referral" | "other";
export type OutreachStatus = "found" | "researched" | "reached_out" | "replied" | "interested" | "call_scheduled" | "onboarded" | "not_interested" | "ghosted";
export type OutreachPriority = "high" | "medium" | "low";
export type OutreachMethod = "linkedin" | "tiktok" | "email" | "other";
export type ScriptPlatform = "linkedin" | "tiktok" | "email" | "both";

export interface DbCoachOutreach {
    id: string;
    name: string;
    category: string;
    university: string;
    credential: string;
    credential_year: number | null;
    source: OutreachSource;
    tiktok_handle: string;
    linkedin_url: string;
    follower_count: number;
    status: OutreachStatus;
    priority: OutreachPriority;
    outreach_method: OutreachMethod;
    linkedin_message_sent: string | null;
    linkedin_replied: boolean;
    linkedin_reply_date: string | null;
    tiktok_dm_sent: string | null;
    tiktok_replied: boolean;
    tiktok_reply_date: string | null;
    follow_up_date: string | null;
    follow_up_note: string;
    notes: string;
    added_by: string;
    created_at: string;
    updated_at: string;
}

export interface DbOutreachScript {
    id: string;
    name: string;
    platform: ScriptPlatform;
    content: string;
    category: string;
    use_count: number;
    added_by: string;
    created_at: string;
    updated_at: string;
}
