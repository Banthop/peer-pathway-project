// -- Spring Week Webinar metadata --
export const WEBINAR_TITLE =
  "How Students Converted Their Spring Weeks Into Return Offers";
export const WEBINAR_SUBTITLE =
  "One evening. 6 speakers. Every firm covered. April 12, 2:00 PM - 5:00 PM BST.";

// -- Single-day event info --
export const SW_EVENT_DATE = "April 12, 2026";
export const SW_EVENT_TIME = "2:00 PM - 5:00 PM BST";
export const SW_EVENT_PLATFORM = "Zoom";

// -- Tier system --
export type SwTierId = "webinar" | "bundle" | "premium";

export const SW_TIER_TAGS: Record<SwTierId, string> = {
  webinar: "spring_week_webinar",
  bundle: "spring_week_bundle",
  premium: "spring_week_premium",
};

// -- Stripe links - placeholders until products are created --
export const STRIPE_SW_WEBINAR = "https://buy.stripe.com/TODO_SW_WEBINAR";
export const STRIPE_SW_BUNDLE = "https://buy.stripe.com/TODO_SW_BUNDLE";
export const STRIPE_SW_PREMIUM = "https://buy.stripe.com/TODO_SW_PREMIUM";
export const STRIPE_SW_HANDBOOK = "https://buy.stripe.com/TODO_SW_HANDBOOK";
export const STRIPE_SW_MATCH = "https://buy.stripe.com/TODO_SW_MATCH";

export interface SwTicket {
  id: SwTierId;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
  stripeLink: string;
}

export const SW_TICKETS: Record<SwTierId, SwTicket> = {
  webinar: {
    id: "webinar",
    name: "Webinar",
    price: 17,
    description: "Live session on April 12 + recording after",
    features: [
      "Live Zoom session, April 12",
      "Full recording access after the event",
      "Speaker directory",
      "Matchmaking form access (pay per match)",
    ],
    stripeLink: STRIPE_SW_WEBINAR,
  },
  bundle: {
    id: "bundle",
    name: "Bundle",
    price: 39,
    description: "Webinar + Spring Week Handbook (45+ firms)",
    features: [
      "Everything in Webinar",
      "Spring Week Handbook, 6-phase checklist",
      "Firm-specific intel for 45+ firms",
      "Permanent digital access",
    ],
    badge: "BEST VALUE",
    recommended: true,
    stripeLink: STRIPE_SW_BUNDLE,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 64,
    description: "Bundle + 1 free match + coaching discount",
    features: [
      "Everything in Bundle",
      "1 free matchmaking session (worth £22)",
      "Priority coaching booking",
      "Discounted coaching rates",
    ],
    badge: "LIMITED SPOTS",
    stripeLink: STRIPE_SW_PREMIUM,
  },
};

// -- Matchmaking firm list --
export const MATCHMAKING_FIRMS = [
  "Goldman Sachs", "JPMorgan", "Morgan Stanley", "Barclays", "Citi",
  "HSBC", "Deutsche Bank", "Nomura", "Jefferies", "Lazard", "Rothschild",
  "Evercore", "UBS", "BNP Paribas", "Bank of America", "Macquarie",
  "Houlihan Lokey", "PJT Partners", "Piper Sandler",
  "PwC", "Deloitte", "EY", "KPMG",
  "Citadel", "Millennium", "Optiver", "Jane Street", "D.E. Shaw",
  "BlackRock", "Schroders", "Pimco", "Fidelity",
  "Blackstone", "Carlyle",
  "McKinsey", "BCG", "Bain",
  "Other",
] as const;

// -- Matchmaking division list --
export const MATCHMAKING_DIVISIONS = [
  "Investment Banking",
  "Sales & Trading",
  "Equity Research",
  "Fixed Income",
  "Asset Management",
  "Private Equity",
  "Quantitative Trading/Research",
  "Consulting",
  "Audit / Tax",
  "Technology",
  "Other",
] as const;

// -- Form option lists --
export const SPRING_WEEK_INDUSTRY_OPTIONS = [
  "Investment Banking",
  "Asset Management",
  "Private Equity",
  "Consulting",
  "Big 4",
  "Trading / Quant",
  "Other",
] as const;

export const REFERRAL_OPTIONS = [
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Friend / Referral",
  "University Society",
  "Google",
  "Other",
] as const;

// -- Biggest concern options (anxiety triggers for registration Step 3) --
export const BIGGEST_CONCERN_OPTIONS = [
  "I don't know what to expect day-to-day",
  "I'm worried about the assessment/final day",
  "I don't know how to network effectively",
  "I want to stand out but I'm not sure how",
  "I just want to make sure I convert",
] as const;

// -- Speaker data --
export interface Speaker {
  name: string;
  firms: string[];
  university?: string;
}

export const SPEAKERS: Speaker[] = [
  { name: "Ayo", firms: ["Morgan Stanley", "Evercore", "HSBC", "Deutsche Bank"], university: "LSE" },
  { name: "Aashay", firms: ["Houlihan Lokey", "Barclays"], university: "LSE" },
  { name: "Serena", firms: ["Nomura", "RBC", "Dare", "Barings", "Houlihan Lokey"], university: "LSE" },
  { name: "Momo", firms: ["JP Morgan", "D.E. Shaw", "Deutsche Bank"], university: "" },
  { name: "Joel", firms: ["Jane Street", "Bank of America", "EY"], university: "LSE" },
  { name: "Ike", firms: ["Macquarie", "Lazard", "BNP Paribas", "HSBC"], university: "" },
];

// -- Target firms for display --
export const TARGET_FIRMS = [
  "Goldman Sachs",
  "JPMorgan",
  "Morgan Stanley",
  "Barclays",
  "Citi",
  "HSBC",
  "Deutsche Bank",
  "UBS",
  "BNP Paribas",
  "Jefferies",
  "Nomura",
  "Rothschild",
  "Lazard",
  "Evercore",
  "PwC",
  "Deloitte",
  "EY",
  "KPMG",
  "Citadel",
  "Millennium",
  "Optiver",
  "Jane Street",
  "BlackRock",
  "Pimco",
  "Schroders",
] as const;

// -- Industry reinforcement messages for the spring week context --
export const SPRING_WEEK_INDUSTRY_REINFORCEMENT: Record<string, string> = {
  "Investment Banking":
    "Most of our panellists converted at top investment banks. You're in the right place.",
  "Asset Management":
    "Spring weeks at asset managers are some of the best conversion opportunities. We'll cover exactly how.",
  "Private Equity":
    "PE spring weeks are rare and competitive. Our panellists share how to make the most of every minute.",
  Consulting:
    "Consulting spring weeks are structured differently. We'll cover what firms look for in a conversion candidate.",
  "Big 4":
    "Big 4 spring weeks have some of the highest conversion rates. Learn how to make sure you're one of them.",
  "Trading / Quant":
    "Trading desks evaluate you differently during spring weeks. Our panellists from Optiver and Jane Street break it down.",
  Other:
    "The conversion strategies our panellists share work across every area of finance.",
};

// ============================================================
// BACKWARD-COMPATIBILITY STUBS
// These exports keep pre-existing components (SpringWeekWebinar,
// SpringWeekPortal, SpringWeekPlaybook, SpringWeekTickets,
// SpringWeekNightPicker, SpringWeekWelcome) compiling while they
// await a full rewrite. Do NOT use these in new code.
// ============================================================

export type SpringWeekTicketId = "part1" | "part2" | "bundle" | "premium";

export interface SpringWeekTicket {
  id: SpringWeekTicketId;
  name: string;
  price: number;
  pricePence: number;
  description: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
  stripeLink: string;
}

export const SPRING_WEEK_TICKETS: Record<SpringWeekTicketId, SpringWeekTicket> = {
  part1: {
    id: "part1",
    name: "Part 1 Only",
    price: 15,
    pricePence: 1500,
    description: "Access to Part 1 of the live panel webinar",
    features: [
      "Live Part 1 panel session",
      "Q&A with panellists",
      "Recording access after the event",
      "Networking tips from real spring weekers",
    ],
    stripeLink: STRIPE_SW_WEBINAR,
  },
  part2: {
    id: "part2",
    name: "Part 2 Only",
    price: 15,
    pricePence: 1500,
    description: "Access to Part 2 of the live panel webinar",
    features: [
      "Live Part 2 panel session",
      "Q&A with panellists",
      "Recording access after the event",
      "Conversion strategies from different firms",
    ],
    stripeLink: STRIPE_SW_WEBINAR,
  },
  bundle: {
    id: "bundle",
    name: "Bundle",
    price: 39,
    pricePence: 3900,
    description: "Webinar + Spring Week Handbook (45+ firms)",
    features: [
      "Everything in Webinar",
      "Spring Week Handbook, 6-phase checklist",
      "Firm-specific intel for 45+ firms",
      "Permanent digital access",
    ],
    badge: "BEST VALUE",
    recommended: true,
    stripeLink: STRIPE_SW_BUNDLE,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 64,
    pricePence: 6400,
    description: "Bundle + 1 free match + coaching discount",
    features: [
      "Everything in Bundle",
      "1 free matchmaking session (worth £22)",
      "Priority coaching booking",
      "Discounted coaching rates",
    ],
    badge: "LIMITED SPOTS",
    stripeLink: STRIPE_SW_PREMIUM,
  },
};

export const SPRING_WEEK_HANDBOOK = {
  title: "The Spring Week Handbook",
  subtitle: "Insider guide written by students who converted",
  standalonePrice: 30,
  features: [
    "Firm-by-firm breakdown of what to expect",
    "6-phase checklist for the full spring week journey",
    "Application tips, networking scripts, conversion tactics",
    "Permanent digital access, updated annually",
  ],
};

export interface SpringWeekNight {
  id: "1" | "2" | "3";
  label: string;
  date: string;
  dateISO: string;
  theme: string;
  speakers: string[];
  tagline: string;
  accent: string;
}

export const SPRING_WEEK_NIGHTS: SpringWeekNight[] = [
  {
    id: "1",
    label: "Session 1",
    date: "Sun 12 Apr, 2-3:30pm",
    dateISO: "2026-04-12T14:00:00+01:00",
    theme: "Banking, Trading and Asset Management",
    speakers: ["Morgan Stanley", "Evercore", "Nomura", "JP Morgan", "Macquarie", "HSBC"],
    tagline: "How they converted in IBD, S&T, and asset management",
    accent: "#6366F1",
  },
  {
    id: "2",
    label: "Session 2",
    date: "Sun 12 Apr, 3:30-5pm",
    dateISO: "2026-04-12T15:30:00+01:00",
    theme: "The Conversion Masterclass",
    speakers: ["Jane Street", "Bank of America", "Lazard", "BNP Paribas", "EY", "Barclays"],
    tagline: "Universal conversion strategies that work at every firm",
    accent: "#10B981",
  },
  {
    id: "3",
    label: "Q&A",
    date: "Sun 12 Apr, 4:45-5pm",
    dateISO: "2026-04-12T16:45:00+01:00",
    theme: "Open Q&A",
    speakers: ["All speakers"],
    tagline: "Ask anything directly to the panel",
    accent: "#F59E0B",
  },
];

export type NightComboKey =
  | "1"
  | "2"
  | "3"
  | "1,2"
  | "1,3"
  | "2,3"
  | "1,2,3"
  | "1,2,3+handbook"
  | "handbook";

export interface SpringWeekCombo {
  key: NightComboKey;
  price: number;
  stripeLink: string;
  badge?: string;
}

export const SPRING_WEEK_COMBOS: Record<NightComboKey, SpringWeekCombo> = {
  "1":               { key: "1",              price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "2":               { key: "2",              price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "3":               { key: "3",              price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "1,2":             { key: "1,2",            price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "1,3":             { key: "1,3",            price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "2,3":             { key: "2,3",            price: 17,   stripeLink: STRIPE_SW_WEBINAR },
  "1,2,3":           { key: "1,2,3",          price: 17,   stripeLink: STRIPE_SW_WEBINAR, badge: "WEBINAR" },
  "1,2,3+handbook":  { key: "1,2,3+handbook", price: 39,   stripeLink: STRIPE_SW_BUNDLE,  badge: "BUNDLE" },
  "handbook":        { key: "handbook",        price: 30,   stripeLink: STRIPE_SW_HANDBOOK },
};

export function getComboKey(
  selectedNights: Array<"1" | "2" | "3">,
  includeHandbook: boolean
): NightComboKey | null {
  const sorted = [...selectedNights].sort().join(",");
  if (sorted === "" && includeHandbook) return "handbook";
  if (sorted === "" && !includeHandbook) return null;
  if (includeHandbook && sorted === "1,2,3") return "1,2,3+handbook";
  return sorted as NightComboKey;
}

export const NIGHT_INDIVIDUAL_PRICE = 17;

export const FIRM_NIGHT_MAP: Record<string, "1" | "2" | "3"> = {
  "goldman sachs": "1", "goldman": "1", "gs": "1",
  "jpmorgan": "1", "jp morgan": "1", "jpm": "1",
  "morgan stanley": "1", "ms": "1",
  "barclays": "2", "citi": "1", "citigroup": "1",
  "hsbc": "1", "deutsche bank": "1", "ubs": "1", "bnp paribas": "2",
  "jefferies": "1", "nomura": "1", "rothschild": "1", "lazard": "2",
  "evercore": "1", "jane street": "2",
  "deloitte": "2", "ey": "2", "kpmg": "2", "pwc": "2",
  "schroders": "1", "rbc": "1",
  "blackrock": "1", "pimco": "1",
  "citadel": "1", "millennium": "1", "optiver": "1",
  "macquarie": "1", "houlihan lokey": "1", "bank of america": "2",
};

export function matchFirmsToNights(
  firmsInput: string
): Array<{ firm: string; nightId: "1" | "2" | "3"; nightLabel: string }> {
  if (!firmsInput.trim()) return [];
  const results: Array<{ firm: string; nightId: "1" | "2" | "3"; nightLabel: string }> = [];
  const input = firmsInput.toLowerCase();
  for (const [key, nightId] of Object.entries(FIRM_NIGHT_MAP)) {
    if (input.includes(key)) {
      const night = SPRING_WEEK_NIGHTS.find((n) => n.id === nightId);
      if (night) {
        const firmName = key.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        results.push({ firm: firmName, nightId, nightLabel: night.label });
      }
    }
  }
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.firm)) return false;
    seen.add(r.firm);
    return true;
  });
}
