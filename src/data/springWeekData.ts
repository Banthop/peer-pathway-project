// -- Spring Week Webinar metadata --
export const WEBINAR_TITLE =
  "How Students Converted Their Spring Weeks Into Return Offers";
export const WEBINAR_SUBTITLE =
  "3 nights. 24+ speakers. Every firm covered. April 10-12, the weekend before it all starts.";

// -- Stripe Payment Links (live) --
export const STRIPE_PART1_LINK =
  "https://buy.stripe.com/dRmbJ06aM9xTg5k74M2400f";
export const STRIPE_PART2_LINK =
  "https://buy.stripe.com/fZucN456I6lH8CSfBi2400g";
export const STRIPE_BUNDLE_LINK =
  "https://buy.stripe.com/00w3cufLmcK57yO1Ks2400h";
export const STRIPE_PREMIUM_LINK =
  "https://buy.stripe.com/14AfZg8iU8tPaL02Ow2400i";

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

// -- Biggest concern options (anxiety triggers for Step 3) --
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
  firm: string;
  note?: string;
}

export const SPEAKERS: Speaker[] = [
  { name: "Speaker TBC", firm: "Jefferies" },
  { name: "Speaker TBC", firm: "Forbes" },
  { name: "Speaker TBC", firm: "Nomura" },
  { name: "Speaker TBC", firm: "Citi", note: "Return offer" },
  { name: "Speaker TBC", firm: "Barclays" },
  { name: "Speaker TBC", firm: "Optiver" },
  { name: "Speaker TBC", firm: "Bank of America" },
  { name: "Speaker TBC", firm: "Millennium" },
  { name: "Speaker TBC", firm: "PwC" },
  { name: "Speaker TBC", firm: "Citadel" },
  { name: "Speaker TBC", firm: "Morgan Stanley" },
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

// -- Ticket definitions --
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
    stripeLink: STRIPE_PART1_LINK,
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
    stripeLink: STRIPE_PART2_LINK,
  },
  bundle: {
    id: "bundle",
    name: "Bundle",
    price: 29,
    pricePence: 2900,
    description: "Both parts + The Spring Week Playbook",
    features: [
      "Live Part 1 + Part 2 panel sessions",
      "Q&A with all panellists",
      "Recordings of both sessions",
      "The Spring Week Playbook (insider guide)",
      "Insider write-ups from real spring weekers",
      "Firm-by-firm breakdown of what to expect",
    ],
    badge: "BEST VALUE",
    recommended: true,
    stripeLink: STRIPE_BUNDLE_LINK,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 49,
    pricePence: 4900,
    description: "Everything in the bundle + 1-on-1 coaching session",
    features: [
      "Everything in the Bundle",
      "1-on-1 coaching session with a panellist",
      "Personalised spring week strategy",
      "CV and application review",
      "Direct access to someone who converted",
      "Priority Q&A during live sessions",
    ],
    badge: "LIMITED SPOTS",
    stripeLink: STRIPE_PREMIUM_LINK,
  },
};

// ============================================================
// --- Night Picker System (3-night conversion webinar) ---
// ============================================================

export interface SpringWeekNight {
  id: "1" | "2" | "3";
  label: string;
  date: string;
  dateISO: string;
  theme: string;
  speakers: string[];
  tagline: string;
  accent: string; // hex colour for card accent
}

export const SPRING_WEEK_NIGHTS: SpringWeekNight[] = [
  {
    id: "1",
    label: "Night 1",
    date: "Fri 10 Apr, 7-9pm",
    dateISO: "2026-04-10T19:00:00+01:00",
    theme: "Banking & Trading",
    speakers: ["Goldman Sachs", "JPMorgan", "Morgan Stanley", "Barclays", "Citi", "HSBC"],
    tagline: "How they converted on the trading floor and in IBD",
    accent: "#6366F1",
  },
  {
    id: "2",
    label: "Night 2",
    date: "Sat 11 Apr, 6-8pm",
    dateISO: "2026-04-11T18:00:00+01:00",
    theme: "Consulting, Big 4 & Asset Management",
    speakers: ["McKinsey", "Deloitte", "EY", "KPMG", "PwC", "Schroders"],
    tagline: "From spring week to full-time at consulting and asset management firms",
    accent: "#8B5CF6",
  },
  {
    id: "3",
    label: "Night 3",
    date: "Sun 12 Apr, 6-8pm",
    dateISO: "2026-04-12T18:00:00+01:00",
    theme: "The Conversion Masterclass",
    speakers: ["Assessment centres", "Final day strategies", "Follow-up tactics"],
    tagline: "The universal conversion strategies that work at every firm",
    accent: "#10B981",
  },
];

export const SPRING_WEEK_HANDBOOK = {
  title: "The Spring Week Playbook",
  subtitle: "Insider guide written by students who converted",
  standalonePrice: 30,
  features: [
    "Firm-by-firm breakdown of what to expect",
    "11 chapters by real spring weekers at top firms",
    "Application tips, networking scripts, conversion tactics",
    "Permanent digital access, updated annually",
  ],
};

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

// TODO: Replace all placeholder Stripe links with real product links once created in Stripe dashboard
export const SPRING_WEEK_COMBOS: Record<NightComboKey, SpringWeekCombo> = {
  "1":               { key: "1",               price: 19,    stripeLink: "https://buy.stripe.com/TODO_NIGHT1" },
  "2":               { key: "2",               price: 19,    stripeLink: "https://buy.stripe.com/TODO_NIGHT2" },
  "3":               { key: "3",               price: 19,    stripeLink: "https://buy.stripe.com/TODO_NIGHT3" },
  "1,2":             { key: "1,2",             price: 34.99, stripeLink: "https://buy.stripe.com/TODO_NIGHTS12" },
  "1,3":             { key: "1,3",             price: 34.99, stripeLink: "https://buy.stripe.com/TODO_NIGHTS13" },
  "2,3":             { key: "2,3",             price: 34.99, stripeLink: "https://buy.stripe.com/TODO_NIGHTS23" },
  "1,2,3":           { key: "1,2,3",           price: 49.99, stripeLink: "https://buy.stripe.com/TODO_BUNDLE", badge: "BEST VALUE" },
  "1,2,3+handbook":  { key: "1,2,3+handbook",  price: 70,    stripeLink: "https://buy.stripe.com/TODO_BUNDLE_HANDBOOK", badge: "COMPLETE PACK" },
  "handbook":        { key: "handbook",         price: 30,    stripeLink: "https://buy.stripe.com/TODO_HANDBOOK" },
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

// Individual night face value - used to compute savings copy
export const NIGHT_INDIVIDUAL_PRICE = 19;

// ============================================================

// -- Firm-to-night mapping for personalised recommendations --
export const FIRM_NIGHT_MAP: Record<string, "1" | "2" | "3"> = {
  "goldman sachs": "1", "goldman": "1", "gs": "1",
  "jpmorgan": "1", "jp morgan": "1", "jpm": "1",
  "morgan stanley": "1", "ms": "1",
  "barclays": "1", "citi": "1", "citigroup": "1", "citibank": "1",
  "hsbc": "1", "deutsche bank": "1", "ubs": "1", "bnp paribas": "1",
  "jefferies": "1", "nomura": "1", "rothschild": "1", "lazard": "1",
  "evercore": "1", "jane street": "1",
  "mckinsey": "2", "deloitte": "2", "ey": "2", "kpmg": "2", "pwc": "2",
  "oc&c": "2", "carlyle": "2", "schroders": "2", "rbc": "2",
  "blackrock": "2", "pimco": "2",
  "citadel": "1", "millennium": "1", "optiver": "1",
};

export function matchFirmsToNights(firmsInput: string): Array<{ firm: string; nightId: "1" | "2" | "3"; nightLabel: string }> {
  if (!firmsInput.trim()) return [];
  const results: Array<{ firm: string; nightId: "1" | "2" | "3"; nightLabel: string }> = [];
  const input = firmsInput.toLowerCase();
  for (const [key, nightId] of Object.entries(FIRM_NIGHT_MAP)) {
    if (input.includes(key)) {
      const night = SPRING_WEEK_NIGHTS.find((n) => n.id === nightId);
      if (night) {
        // Capitalise the firm name nicely
        const firmName = key.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        results.push({ firm: firmName, nightId, nightLabel: night.label });
      }
    }
  }
  // Deduplicate by nightId
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.firm)) return false;
    seen.add(r.firm);
    return true;
  });
}

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
    "Trading desks evaluate you differently during spring weeks. Our panellists from Optiver and Citadel break it down.",
  Other:
    "The conversion strategies our panellists share work across every area of finance.",
};
