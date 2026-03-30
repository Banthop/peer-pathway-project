import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Trophy,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
 *  CAL.COM SETUP INSTRUCTIONS:
 *
 *  1. Create a Cal.com account for Uthman
 *  2. Set up event types:
 *     - "Strategy Call" (30 min, £35)
 *     - "Deep Dive Session" (60 min, £55)
 *     - "Group Cold Email Workshop" (90 min, £20/person)
 *  3. Enable Stripe integration in Cal.com for payments
 *  4. Replace the CAL_USERNAME and event slugs below
 *  5. Cal.com handles: scheduling, payments, Zoom links, reminders
 *
 *  Cal.com embed docs: https://cal.com/docs/embeds
 * ═══════════════════════════════════════════════════════════════ */

// TODO: Replace with Uthman's Cal.com username
const CAL_USERNAME = "uthman-earlyedge";

/* ─── Session types ─── */

interface SessionType {
  id: string;
  name: string;
  duration: string;
  price: string;
  priceLabel: string;
  description: string;
  includes: string[];
  calSlug: string; // Cal.com event type slug
  popular?: boolean;
  isGroup?: boolean;
  maxParticipants?: number;
}

const SESSION_TYPES: SessionType[] = [
  {
    id: "strategy-call",
    name: "Strategy Call",
    duration: "30 min",
    price: "£35",
    priceLabel: "per session",
    description:
      "Quick, focused session to review your cold email strategy, get template feedback, or ask Uthman anything about landing internships.",
    includes: [
      "Personalised email review",
      "Strategy feedback",
      "Action plan for next steps",
    ],
    calSlug: "strategy-call",
  },
  {
    id: "deep-dive",
    name: "Deep Dive Session",
    duration: "60 min",
    price: "£59",
    priceLabel: "per session",
    description:
      "Full session covering your complete outreach strategy. Walk away with custom templates, a lead list, and a personalised action plan.",
    includes: [
      "Full outreach audit",
      "Custom email templates written for you",
      "Lead sourcing walkthrough",
      "Personalised follow-up sequences",
      "7-day email support after the session",
    ],
    calSlug: "deep-dive",
    popular: true,
  },
  {
    id: "group-workshop",
    name: "Group Cold Email Workshop",
    duration: "90 min",
    price: "£20",
    priceLabel: "per person",
    description:
      "Small-group session (max 8 people) where Uthman walks through the full cold email system live. Great if you want a more affordable option and learn from others' questions.",
    includes: [
      "Full system walkthrough",
      "Live template building",
      "Group Q&A",
      "Recording of the session",
    ],
    calSlug: "group-workshop",
    isGroup: true,
    maxParticipants: 8,
  },
];

/* ─── Package ─── */

const PACKAGE = {
  name: "3x Deep Dive Bundle",
  sessions: "3 x 60-min Deep Dive sessions",
  price: "£140",
  priceLabel: "save £37",
  description:
    "Three Deep Dive sessions spread over 3-4 weeks. Full outreach audit, custom templates, lead sourcing, and ongoing accountability as you build your pipeline. Uthman reviews your progress between sessions.",
  calSlug: "3-deep-dive-bundle",
};

/* ─── FAQ ─── */

const FAQ = [
  {
    q: "How do sessions work?",
    a: "After booking, you'll receive a confirmation email with a Zoom link. Sessions are 1-on-1 video calls (or group for workshops) where Uthman works through your specific situation.",
  },
  {
    q: "What should I prepare?",
    a: "Bring your current CV, any cold emails you've drafted, and a list of target firms or industries. The more Uthman knows, the more useful the session.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes, you can reschedule up to 24 hours before. Just use the link in your confirmation email.",
  },
  {
    q: "What about the group workshop?",
    a: "Group workshops run with 4-8 people. Dates are posted when enough interest builds. Book your spot and you'll be notified when the next one is confirmed.",
  },
  {
    q: "Refund policy?",
    a: "Not satisfied? Email us within 24 hours of your session and we'll arrange a follow-up or full refund. No questions asked.",
  },
];

/* ─── Stats ─── */

const STATS = [
  { icon: Trophy, value: "20+", label: "Offers landed" },
  { icon: Briefcase, value: "PE, IB, VC", label: "Industries" },
  { icon: MessageSquare, value: "200+", label: "Emails sent" },
];

export default function BookUthman() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCalEmbed, setShowCalEmbed] = useState<string | null>(null);

  const handleBook = (calSlug: string) => {
    // Open Cal.com in a new tab (or could use Cal.com embed)
    const calUrl = `https://cal.com/${CAL_USERNAME}/${calSlug}`;
    // Pre-fill email and name from Supabase auth
    const params = new URLSearchParams();
    if (user?.email) params.set("email", user.email);
    const name = user?.user_metadata?.name || user?.user_metadata?.full_name || "";
    if (name) params.set("name", name);
    window.open(`${calUrl}?${params.toString()}`, "_blank");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 md:px-10 lg:px-12">
        <p className="text-xs text-[#999] font-medium uppercase tracking-wider mb-1">
          1-on-1 Coaching
        </p>
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-[#111]">
          Book Uthman
        </h1>
        <p className="text-sm text-[#888] mt-1 font-light">
          Get personalised help from the person who built the system
        </p>
      </div>

      <div className="px-6 md:px-10 lg:px-12 pb-10">
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Left: Profile */}
          <div className="lg:w-[340px] flex-shrink-0 space-y-5">
            {/* Profile card */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#444] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  UA
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#111]">Uthman</h2>
                  <p className="text-[13px] text-[#666]">
                    20 Internship Offers via Cold Email
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-[#111] text-[#111]" />
                    <span className="text-[12px] text-[#888]">Webinar Host &middot; Warwick</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F0F0F0] pt-4">
                <p className="text-[13px] text-[#555] leading-relaxed font-light">
                  Uthman landed 20 internship offers across PE, IB, and VC using
                  nothing but cold email. He built the exact system taught in
                  the webinar and cold email guide, and has helped over 100
                  students replicate his approach.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-[#FAFAFA] rounded-lg p-3 text-center">
                    <stat.icon className="w-4 h-4 text-[#888] mx-auto mb-1.5" />
                    <p className="text-sm font-semibold text-[#111]">{stat.value}</p>
                    <p className="text-[10px] text-[#999] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
              <p className="text-[11px] text-[#999] font-medium uppercase tracking-wider mb-3">
                From Students
              </p>
              <div className="space-y-3">
                {[
                  {
                    text: "Genuinely the most practical webinar I've attended. Uthman gives actual templates you can use straight away.",
                    name: "Priya M.",
                    uni: "LSE",
                  },
                  {
                    text: "Had a call with Uthman and sent my first cold emails the same day. Got 3 replies within a week.",
                    name: "Jake L.",
                    uni: "Warwick",
                  },
                  {
                    text: "The group workshop was brilliant. Learned so much from other people's questions too.",
                    name: "Amina R.",
                    uni: "UCL",
                  },
                ].map((review) => (
                  <div key={review.name} className="bg-[#FAFAFA] rounded-lg p-3">
                    <p className="text-[12px] text-[#555] font-light italic leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="text-[11px] text-[#999] mt-2 font-medium">
                      {review.name}, {review.uni}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Session types + FAQ */}
          <div className="flex-1 space-y-6">
            {/* Session types */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#111]">Choose a session</h3>

              {SESSION_TYPES.map((session) => (
                <div
                  key={session.id}
                  className={`relative bg-white border rounded-xl p-6 transition-all hover:shadow-md ${
                    session.popular ? "border-[#111] shadow-sm" : "border-[#E8E8E8]"
                  }`}
                >
                  {session.popular && (
                    <span className="absolute -top-2.5 left-5 bg-[#111] text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#111] flex items-center gap-2">
                        {session.name}
                        {session.isGroup && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Group
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Clock className="w-3.5 h-3.5" />
                          {session.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Calendar className="w-3.5 h-3.5" />
                          Zoom
                        </span>
                        {session.maxParticipants && (
                          <span className="flex items-center gap-1 text-[12px] text-[#888]">
                            <Users className="w-3.5 h-3.5" />
                            Max {session.maxParticipants}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-semibold text-[#111]">{session.price}</p>
                      <p className="text-[11px] text-[#999]">{session.priceLabel}</p>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
                    {session.description}
                  </p>

                  <div className="space-y-2 mb-5">
                    {session.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="text-[12px] text-[#555]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleBook(session.calSlug)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      session.popular
                        ? "bg-[#111] text-white hover:bg-[#222]"
                        : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB]"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Book {session.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Package deal */}
            <div className="relative bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-xl p-6 text-white">
              <div className="absolute -top-2.5 left-5">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Best value
                </span>
              </div>

              <div className="flex items-start justify-between mb-3 pt-2">
                <div>
                  <h4 className="text-[15px] font-semibold">{PACKAGE.name}</h4>
                  <p className="text-[12px] text-white/50 mt-0.5">{PACKAGE.sessions}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{PACKAGE.price}</p>
                  <p className="text-[11px] text-amber-400 font-medium">{PACKAGE.priceLabel}</p>
                </div>
              </div>

              <p className="text-[13px] text-white/70 font-light leading-relaxed mb-5">
                {PACKAGE.description}
              </p>

              <button
                onClick={() => handleBook(PACKAGE.calSlug)}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-[#111] hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Package
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8E8E8]">
                <h3 className="text-[13px] font-semibold text-[#111]">
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {FAQ.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-[#111]">{faq.q}</p>
                      <ChevronDown
                        className={`w-4 h-4 text-[#999] transition-transform flex-shrink-0 ml-2 ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFaq === idx && (
                      <p className="text-[12px] text-[#666] font-light leading-relaxed mt-2 pr-6 animate-in fade-in slide-in-from-top-1 duration-200">
                        {faq.a}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
