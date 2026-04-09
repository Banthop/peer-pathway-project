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
export type SwTierId = "watch" | "prepare" | "convert";

export const SW_TIER_TAGS: Record<SwTierId, string> = {
  watch: "spring_week_watch",
  prepare: "spring_week_prepare",
  convert: "spring_week_convert",
};

// -- Stripe links - placeholders until products are created --
export const STRIPE_SW_WATCH = "https://buy.stripe.com/TODO_SW_WEBINAR";
export const STRIPE_SW_PREPARE = "https://buy.stripe.com/TODO_SW_BUNDLE";
export const STRIPE_SW_CONVERT = "https://buy.stripe.com/TODO_SW_PREMIUM";
export const STRIPE_SW_HANDBOOK = "https://buy.stripe.com/TODO_SW_HANDBOOK";
export const STRIPE_SW_MATCH = "https://buy.stripe.com/TODO_SW_MATCH";

// -- Backward-compat aliases (used by legacy components) --
export const STRIPE_SW_WEBINAR = STRIPE_SW_WATCH;
export const STRIPE_SW_BUNDLE = STRIPE_SW_PREPARE;
export const STRIPE_SW_PREMIUM = STRIPE_SW_CONVERT;

export interface SwTicket {
  id: SwTierId;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
  stripeLink: string;
}

export const SW_TICKETS: Record<SwTierId, SwTicket> = {
  watch: {
    id: "watch",
    name: "Watch",
    tagline: "See how they did it",
    price: 19,
    description: "Live panel on April 12 + full recording",
    features: [
      "Live panel: students who converted share exactly what they did differently",
      "Hear the mistakes that cost other students their offers",
      "Direct Q&A: ask about YOUR specific firm",
      "Full recording if you can't make it live",
    ],
    stripeLink: STRIPE_SW_WATCH,
  },
  prepare: {
    id: "prepare",
    name: "Prepare",
    tagline: "Know what to expect at YOUR firm",
    price: 39,
    description: "Everything in Watch, plus firm-specific intel for 45+ firms",
    features: [
      "Everything in Watch",
      "Spring Week Handbook: 45+ firms, phase-by-phase",
      "Firm-specific intel: what the AC looks like, what questions they ask, how many convert",
      "Know your firm's conversion rate before you walk in",
    ],
    badge: "MOST CHOSEN",
    recommended: true,
    stripeLink: STRIPE_SW_PREPARE,
  },
  convert: {
    id: "convert",
    name: "Convert",
    tagline: "Walk in ready to get the offer",
    price: 79,
    description: "Everything in Prepare, plus a free prep call with a converter at your firm",
    features: [
      "Everything in Prepare",
      "1 free prep call with someone who converted at your firm (worth £50)",
      "They'll tell you what the week is really like, what caught them off guard, and what got them the offer",
      "Priority booking for additional prep calls",
    ],
    badge: "BEST VALUE",
    stripeLink: STRIPE_SW_CONVERT,
  },
};

// -- Prep call firm list --
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

// -- Prep call division list --
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
    stripeLink: STRIPE_SW_WATCH,
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
    stripeLink: STRIPE_SW_WATCH,
  },
  bundle: {
    id: "bundle",
    name: "Prepare",
    price: 39,
    pricePence: 3900,
    description: "Everything in Watch, plus firm-specific intel for 45+ firms",
    features: [
      "Everything in Watch",
      "Spring Week Handbook: 45+ firms, phase-by-phase",
      "Firm-specific intel: what the AC looks like, how many convert",
      "Know your firm's conversion rate before you walk in",
    ],
    badge: "MOST CHOSEN",
    recommended: true,
    stripeLink: STRIPE_SW_PREPARE,
  },
  premium: {
    id: "premium",
    name: "Convert",
    price: 79,
    pricePence: 7900,
    description: "Everything in Prepare, plus a free prep call with a converter at your firm",
    features: [
      "Everything in Prepare",
      "1 free prep call with someone who converted at your firm (worth £50)",
      "Priority booking for additional prep calls",
    ],
    badge: "BEST VALUE",
    stripeLink: STRIPE_SW_CONVERT,
  },
};

export const SPRING_WEEK_HANDBOOK = {
  title: "The Spring Week Handbook",
  subtitle: "Written by students who converted at 45+ firms",
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
  "1":               { key: "1",              price: 19,   stripeLink: STRIPE_SW_WATCH },
  "2":               { key: "2",              price: 19,   stripeLink: STRIPE_SW_WATCH },
  "3":               { key: "3",              price: 19,   stripeLink: STRIPE_SW_WATCH },
  "1,2":             { key: "1,2",            price: 19,   stripeLink: STRIPE_SW_WATCH },
  "1,3":             { key: "1,3",            price: 19,   stripeLink: STRIPE_SW_WATCH },
  "2,3":             { key: "2,3",            price: 19,   stripeLink: STRIPE_SW_WATCH },
  "1,2,3":           { key: "1,2,3",          price: 19,   stripeLink: STRIPE_SW_WATCH, badge: "WATCH" },
  "1,2,3+handbook":  { key: "1,2,3+handbook", price: 39,   stripeLink: STRIPE_SW_PREPARE,  badge: "PREPARE" },
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

export const NIGHT_INDIVIDUAL_PRICE = 19;

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

// -- Network firms for Prep Call page --

export interface NetworkFirm {
  name: string;
  category: "Investment Banking" | "Trading & Quant" | "Asset Management & PE" | "Consulting & Big 4" | "Other";
  hasSpringWeek: boolean;
  conversionRate?: string;
}

export const NETWORK_FIRMS: NetworkFirm[] = [
  // Investment Banking
  { name: "Goldman Sachs", category: "Investment Banking", hasSpringWeek: true },
  { name: "J.P. Morgan", category: "Investment Banking", hasSpringWeek: true, conversionRate: "10% offer" },
  { name: "Morgan Stanley", category: "Investment Banking", hasSpringWeek: true, conversionRate: "25% offer" },
  { name: "Barclays", category: "Investment Banking", hasSpringWeek: true, conversionRate: "70% offer" },
  { name: "Citi", category: "Investment Banking", hasSpringWeek: true, conversionRate: "50% offer" },
  { name: "HSBC", category: "Investment Banking", hasSpringWeek: true },
  { name: "Deutsche Bank", category: "Investment Banking", hasSpringWeek: true, conversionRate: "30% offer" },
  { name: "UBS", category: "Investment Banking", hasSpringWeek: true },
  { name: "Bank of America", category: "Investment Banking", hasSpringWeek: true, conversionRate: "20% offer" },
  { name: "BNP Paribas", category: "Investment Banking", hasSpringWeek: true, conversionRate: "30% offer" },
  { name: "Nomura", category: "Investment Banking", hasSpringWeek: true },
  { name: "Jefferies", category: "Investment Banking", hasSpringWeek: true, conversionRate: "80%" },
  { name: "Rothschild & Co", category: "Investment Banking", hasSpringWeek: true, conversionRate: "35% offer" },
  { name: "Lazard", category: "Investment Banking", hasSpringWeek: true, conversionRate: "40% offer" },
  { name: "Evercore", category: "Investment Banking", hasSpringWeek: true, conversionRate: "15% offer" },
  { name: "PJT Partners", category: "Investment Banking", hasSpringWeek: true, conversionRate: "30% offer" },
  { name: "Houlihan Lokey", category: "Investment Banking", hasSpringWeek: true, conversionRate: "40% offer" },
  { name: "Piper Sandler", category: "Investment Banking", hasSpringWeek: true, conversionRate: "72% offer" },
  { name: "Perella Weinberg", category: "Investment Banking", hasSpringWeek: true },
  { name: "Macquarie", category: "Investment Banking", hasSpringWeek: true, conversionRate: "35% offer" },
  { name: "Wells Fargo", category: "Investment Banking", hasSpringWeek: true },
  { name: "RBC Capital Markets", category: "Investment Banking", hasSpringWeek: true },
  { name: "Standard Chartered", category: "Investment Banking", hasSpringWeek: true },
  { name: "Santander", category: "Investment Banking", hasSpringWeek: true },
  { name: "NatWest Markets", category: "Investment Banking", hasSpringWeek: true },
  { name: "Rede Partners", category: "Investment Banking", hasSpringWeek: true },
  { name: "Ardea Partners", category: "Investment Banking", hasSpringWeek: true },
  { name: "TD Securities", category: "Investment Banking", hasSpringWeek: true },
  { name: "Scotiabank", category: "Investment Banking", hasSpringWeek: true },
  { name: "Credit Agricole", category: "Investment Banking", hasSpringWeek: true },

  // Trading & Quant
  { name: "Jane Street", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Citadel", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Optiver", category: "Trading & Quant", hasSpringWeek: true },
  { name: "D.E. Shaw", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Millennium", category: "Trading & Quant", hasSpringWeek: true },
  { name: "DRW", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Hudson River Trading", category: "Trading & Quant", hasSpringWeek: true },
  { name: "G-Research", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Maven Securities", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Glencore", category: "Trading & Quant", hasSpringWeek: true },
  { name: "IMC Trading", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Dare", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Susquehanna (SIG)", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Marshall Wace", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Point72", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Capula", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Brevan Howard", category: "Trading & Quant", hasSpringWeek: true },
  { name: "GSA Capital", category: "Trading & Quant", hasSpringWeek: true },
  { name: "Da Vinci", category: "Trading & Quant", hasSpringWeek: true },

  // Asset Management & PE
  { name: "BlackRock", category: "Asset Management & PE", hasSpringWeek: true, conversionRate: "30%" },
  { name: "Schroders", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "Fidelity International", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "Blackstone", category: "Asset Management & PE", hasSpringWeek: true, conversionRate: "~3%" },
  { name: "Ares Management", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "CD&R", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "Barings", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "PIMCO", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "GIC", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "Bain Capital", category: "Asset Management & PE", hasSpringWeek: true },
  { name: "Legal & General", category: "Asset Management & PE", hasSpringWeek: true },

  // Consulting & Big 4
  { name: "McKinsey", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "BCG", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "Deloitte", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "EY", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "PwC", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "KPMG", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "Oliver Wyman", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "PA Consulting", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "Compass Lexecon", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "BDO", category: "Consulting & Big 4", hasSpringWeek: true },
  { name: "Marsh McLennan", category: "Consulting & Big 4", hasSpringWeek: true },
];
