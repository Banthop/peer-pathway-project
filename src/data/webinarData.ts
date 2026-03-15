// ── Webinar metadata ──────────────────────────────────────────────
export const WEBINAR_TITLE =
  "How I got 18 internship offers through cold emailing";
export const WEBINAR_SUBTITLE =
  "Learn the exact strategy that turned rejections from Morgan Stanley, Jane Street, and JPMorgan into 18 offers in 2 weeks — all through cold emails.";
export const WEBINAR_DATE = "TBC"; // replace with real date
export const WEBINAR_TIME = "7:00 PM GMT";
export const WEBINAR_DURATION = "60 min";

// ── Social proof / scarcity (edit these numbers as sign-ups grow) ──
export const SPOTS_TOTAL = 100;
export const SPOTS_TAKEN = 73;

// ── Stripe Payment Links ─────────────────────────────────────────
// Create two Payment Links in your Stripe Dashboard, then paste the
// URLs here. Set each link's "After payment" redirect to:
//   https://your-domain.com/webinar?success=true
export const STRIPE_WEBINAR_ONLY_LINK =
  "https://buy.stripe.com/REPLACE_WITH_WEBINAR_ONLY_LINK";
export const STRIPE_BUNDLE_LINK =
  "https://buy.stripe.com/REPLACE_WITH_BUNDLE_LINK";

// ── Form option lists ────────────────────────────────────────────
export const INDUSTRY_OPTIONS = [
  "Investment Banking",
  "Consulting",
  "Law",
  "Software Engineering",
  "Quant Finance",
  "Marketing / Media",
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

// ── Ticket definitions ───────────────────────────────────────────
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
    description: "Live 60-min session + Q&A",
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
    originalPrice: 39,
    description: "Everything above + the complete cold email playbook",
    features: [
      "Live webinar access",
      "Q&A with the speaker",
      "Recording sent after",
      "Cold Email Guide (PDF)",
      "12 proven email templates",
      "Company research framework",
    ],
    badge: "MOST POPULAR",
    stripeLink: STRIPE_BUNDLE_LINK,
  },
};
