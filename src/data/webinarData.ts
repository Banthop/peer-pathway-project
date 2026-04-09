// -- Recording metadata --
export const WEBINAR_TITLE =
  "How Uthman got 20 internship offers in 3 weeks through cold emailing";
export const WEBINAR_SUBTITLE =
  "Watch the full 90-minute recording of the exact cold emailing framework that generated a 21% response rate and turned blank inboxes into real internship offers. Real emails. Real screenshots. Real results - on demand.";

// Recording-specific constants
export const IS_RECORDING = true;
export const RECORDING_VIEWER_COUNT = "150+";
export const RECORDING_DURATION = "90 min";

// -- Stripe Payment Links --
export const STRIPE_WEBINAR_ONLY_LINK =
  "https://buy.stripe.com/8x29AS56I8tPaL09cU2400l";
export const STRIPE_BUNDLE_LINK =
  "https://buy.stripe.com/eVqeVcbv6dO9bP4exe2400m";

// -- Form option lists --
export const INDUSTRY_OPTIONS = [
  "Finance",
  "Law",
  "Consulting",
  "Tech",
  "Marketing / Media",
  "Healthcare",
  "Not sure yet",
] as const;

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year+",
  "Recent Graduate",
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

export const COACHING_OPTIONS = [
  {
    value: "yes",
    label: "Yes, I'd love that",
    description: "I want tailored guidance to land my dream role",
  },
  {
    value: "maybe",
    label: "Maybe later",
    description: "I'm interested but want to learn more first",
  },
  {
    value: "no",
    label: "No thanks",
    description: "I'm just here for the recording",
  },
] as const;

// -- Ticket definitions --
export interface Ticket {
  id: "webinar-only" | "bundle";
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  stripeLink: string;
}

export const TICKETS: Record<"webinarOnly" | "bundle", Ticket> = {
  webinarOnly: {
    id: "webinar-only",
    name: "Recording Only",
    price: 10,
    originalPrice: 19,
    description: "Full 90-min recording - watch anytime",
    features: [
      "Full 90-min recording",
      "Watch anytime, anywhere",
      "Lifetime access",
      "24/7 Q&A access to Uthman regarding any cold-emailing queries",
      "Includes extra cold-emailing resources",
    ],
    stripeLink: STRIPE_WEBINAR_ONLY_LINK,
  },
  bundle: {
    id: "bundle",
    name: "Recording + Cold Email Guide",
    price: 29,
    description: "Everything in the recording, plus the complete cold email playbook",
    features: [
      "Full 90-min recording",
      "Watch anytime, anywhere",
      "Lifetime access",
      "24/7 Q&A access to Uthman regarding any cold-emailing queries",
      "Cold Email Guide (PDF)",
      "Find emails of CEOs and key decision-makers",
      "Write messages that actually get replies",
      "Stand out in a flooded inbox",
      "Turn cold emails into real offers",
    ],
    badge: "BEST VALUE",
    stripeLink: STRIPE_BUNDLE_LINK,
  },
};
