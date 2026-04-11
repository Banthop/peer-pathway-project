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
    "Speakers stay on for an extra hour with a small group after the panel (8:30-9:30pm)",
  ],
  badge: "MOST CHOSEN",
  recommended: true,
  stripeLink: STRIPE_SW_PREPARE,
  accent: "#10B981",
};

const CONVERT_TIER_BASE: Omit<PartnerTier, "price" | "originalPrice"> = {
  id: "convert",
  name: "Convert",
  tagline: "Walk in Monday ready to get the offer",
  features: [
    "Everything in Prepare",
    "1-on-1 prep call with someone who converted at your firm (worth £69)",
    "They tell you what the week is really like and what got them the offer",
    "Priority booking for additional prep calls",
  ],
  badge: "BEST VALUE",
  stripeLink: STRIPE_SW_CONVERT,
  accent: "#10B981",
  limited: 12,
};

// ---------------------------------------------------------------------------
// Default tiers (normal pricing, used on the main page)
// ---------------------------------------------------------------------------

export const DEFAULT_TIERS: PartnerTier[] = [
  { ...WATCH_TIER_BASE, price: 19 },
  { ...PREPARE_TIER_BASE, price: 49 },
  { ...CONVERT_TIER_BASE, price: 99 },
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
    { ...CONVERT_TIER_BASE, price: 99 },
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
