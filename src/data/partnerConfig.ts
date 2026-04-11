import {
  STRIPE_SW_WATCH,
  STRIPE_SW_PREPARE,
  STRIPE_SW_CONVERT,
} from "@/data/springWeekData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PartnerTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // crossed-out price for discount display
  tagline: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
  stripeLink: string;
  accent: string; // hex color
  limited?: number; // scarcity cap, e.g. "Only 25 spots"
}

export interface PartnerConfig {
  slug: string;
  name: string;
  logo: string; // path to logo in /public
  logoDark?: string; // dark variant
  brandColor: string; // hex
  tagline: string; // "Exclusive for Trackr members"
  partnerMessage: string; // shown on the page
  referralTag: string; // CRM tag e.g. "ref_trackr"
  tiers: PartnerTier[];
}

// ---------------------------------------------------------------------------
// Shared tier definitions (partner pricing overrides the price/originalPrice)
// ---------------------------------------------------------------------------

const WATCH_TIER_BASE: Omit<PartnerTier, "price" | "originalPrice"> = {
  id: "watch",
  name: "Watch",
  tagline: "See how they did it",
  features: [
    "Live panel April 12 + full recording",
    "Hear how students converted at Morgan Stanley, JP Morgan, Jane Street and more",
    "Direct Q&A with the speakers",
  ],
  stripeLink: STRIPE_SW_WATCH,
  accent: "#6366F1",
};

const PREPARE_TIER_BASE: Omit<PartnerTier, "price" | "originalPrice"> = {
  id: "prepare",
  name: "Prepare",
  tagline: "Know what to expect at YOUR firm",
  features: [
    "Everything in Watch",
    "Spring Week Handbook: 45+ firms phase-by-phase",
    "Firm-specific intel on assessments, conversion rates and what to expect",
  ],
  badge: "MOST CHOSEN",
  recommended: true,
  stripeLink: STRIPE_SW_PREPARE,
  accent: "#10B981",
};

const AFTER_HOURS_TIER_BASE: Omit<PartnerTier, "price" | "originalPrice"> = {
  id: "after-hours",
  name: "After Hours",
  tagline: "Stay after with the speakers",
  features: [
    "Everything in Prepare",
    "Speakers stay on for an extra hour with a small group (8:30-9:30pm)",
    "Cameras on, direct questions about YOUR firm and YOUR spring week",
    "The advice you can't get from a webinar recording",
  ],
  badge: "NEW",
  stripeLink: STRIPE_SW_CONVERT,
  accent: "#8B5CF6",
  limited: 25,
};

const CONVERT_TIER_BASE: Omit<PartnerTier, "price" | "originalPrice"> = {
  id: "convert",
  name: "Convert",
  tagline: "Walk in Monday ready to get the offer",
  features: [
    "Everything in After Hours",
    "1-on-1 prep call with someone who converted at your firm (worth £69)",
    "They tell you what the week is really like and what got them the offer",
    "Priority booking for additional prep calls",
  ],
  badge: "ULTIMATE",
  stripeLink: STRIPE_SW_CONVERT,
  accent: "#F59E0B",
  limited: 12,
};

// ---------------------------------------------------------------------------
// Default tiers (normal pricing, used on the main page)
// ---------------------------------------------------------------------------

export const DEFAULT_TIERS: PartnerTier[] = [
  { ...WATCH_TIER_BASE, price: 19 },
  { ...PREPARE_TIER_BASE, price: 49 },
  { ...AFTER_HOURS_TIER_BASE, price: 79 },
  { ...CONVERT_TIER_BASE, price: 149 },
];

// ---------------------------------------------------------------------------
// Partner configs
// ---------------------------------------------------------------------------

const TRACKR_CONFIG: PartnerConfig = {
  slug: "trackr",
  name: "Trackr",
  logo: "/trackr-logo-mint.png",
  logoDark: "/trackr-logo-dark.png",
  brandColor: "#6EE7B7",
  tagline: "Exclusive for Trackr members",
  partnerMessage:
    "Sam from Trackr sorted you free access to the live panel. Choose your tier below.",
  referralTag: "ref_trackr",
  tiers: [
    { ...WATCH_TIER_BASE, price: 0, originalPrice: 19 },
    { ...PREPARE_TIER_BASE, price: 49 },
    { ...AFTER_HOURS_TIER_BASE, price: 79 },
    { ...CONVERT_TIER_BASE, price: 149 },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const PARTNERS: Record<string, PartnerConfig> = {
  [TRACKR_CONFIG.slug]: TRACKR_CONFIG,
};

export function getPartnerConfig(slug: string): PartnerConfig | null {
  return PARTNERS[slug] ?? null;
}
