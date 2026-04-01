// -- Spring Week Webinar metadata --
export const WEBINAR_TITLE =
  "How Students Converted Their Spring Weeks Into Return Offers";
export const WEBINAR_SUBTITLE =
  "A 2-part panel with students who actually did it at Goldman, Citi, Barclays, and more";

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
