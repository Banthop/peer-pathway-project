// -- Webinar metadata --
export const WEBINAR_TITLE =
  "How Uthman got 20 internship offers in 3 weeks through cold emailing";
export const WEBINAR_SUBTITLE =
  "Learn the exact strategy that turned rejections from Morgan Stanley, Jane Street, and JPMorgan into 20 offers in just 3 weeks, all through cold emails.";
export const WEBINAR_DATE = "25 March 2026";
export const WEBINAR_TIME = "7:00 PM GMT";
export const WEBINAR_DURATION = "90 min";



// -- Stripe Payment Links --
export const STRIPE_WEBINAR_ONLY_LINK =
  "https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b";
export const STRIPE_BUNDLE_LINK =
  "https://buy.stripe.com/bJe00ifLm6lH6uK88Q2400b";

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
  "Year 12",
  "Year 13",
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
    description: "I'm just here for the webinar",
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
    name: "Webinar Only",
    price: 10,
    originalPrice: 19,
    description: "Live 90-min session + Q&A",
    features: [
      "Live webinar access",
      "Q&A with the speaker",
      "Recording sent after",
    ],
    stripeLink: STRIPE_WEBINAR_ONLY_LINK,
  },
  bundle: {
    id: "bundle",
    name: "Webinar + Cold Email Guide",
    price: 29,
    description: "Everything in Webinar Only, plus the complete cold email playbook",
    features: [
      "Live webinar access",
      "Q&A with the speaker",
      "Recording sent after",
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
export const WEBINAR_TARGET_DATE = "2026-03-25T19:00:00Z";
