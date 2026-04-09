import { useAuth } from "@/contexts/AuthContext";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { SPEAKERS } from "@/data/springWeekData";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Users,
  Target,
} from "lucide-react";

const CAL_USERNAME = "yourearlyedge";

/* ---- Session data ---- */

interface CoachingSession {
  id: string;
  name: string;
  duration: string;
  price: string;
  discountedPrice?: string;
  description: string;
  includes: string[];
  calSlug: string;
  popular?: boolean;
}

const SESSIONS: CoachingSession[] = [
  {
    id: "strategy-call",
    name: "Quick Fire",
    duration: "30 min",
    price: "£45",
    discountedPrice: "£39",
    description:
      "Focused 30-minute session to review your spring week strategy, get answers to your biggest concerns, or talk through your approach for a specific firm.",
    includes: [
      "Personalised strategy review for your firm",
      "Answers to your biggest questions",
      "Clear action plan for your week",
    ],
    calSlug: "sw-strategy-call",
  },
  {
    id: "deep-dive",
    name: "Full Gameplan",
    duration: "60 min",
    price: "£75",
    discountedPrice: "£59",
    description:
      "The full session. Walk away with a firm-specific conversion plan, know exactly what to expect each day, and have your assessment centre strategy locked in.",
    includes: [
      "Complete conversion plan for your firm",
      "Day-by-day breakdown of what to expect",
      "Assessment centre strategy and prep",
      "7-day follow-up support after the session",
    ],
    calSlug: "sw-deep-dive",
    popular: true,
  },
];

/* ---- Handle booking ---- */

function useBookingHandler() {
  const { user } = useAuth();

  return (slug: string) => {
    const params = new URLSearchParams();
    if (user?.email) params.set("email", user.email);
    const name =
      user?.user_metadata?.name || user?.user_metadata?.full_name || "";
    if (name) params.set("name", name);
    window.open(
      `https://cal.com/${CAL_USERNAME}/${slug}?${params.toString()}`,
      "_blank",
    );
  };
}

/* ---- Session card ---- */

interface SessionCardProps {
  session: CoachingSession;
  hasDiscount: boolean;
  onBook: (slug: string) => void;
}

function SessionCard({ session, hasDiscount, onBook }: SessionCardProps) {
  const displayPrice = hasDiscount && session.discountedPrice
    ? session.discountedPrice
    : session.price;

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden transition-all ${
        session.popular
          ? "border-2 border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.1)] ring-1 ring-emerald-50"
          : "border border-[#E0E0E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      {session.popular && (
        <span className="absolute top-3 right-3 bg-gradient-to-r from-[#111] to-[#333] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-sm">
          Most Popular
        </span>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3 pr-24">
          <div>
            <h3 className="text-[15px] font-semibold text-[#111]">{session.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[12px] text-[#888]">
                <Clock className="w-3.5 h-3.5" />
                {session.duration}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-[#888]">
                <Calendar className="w-3.5 h-3.5" />
                Zoom
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {hasDiscount && session.discountedPrice ? (
              <div className="flex flex-col items-end">
                <span className="text-[12px] text-[#BBB] line-through">{session.price}</span>
                <span className="text-xl font-bold text-[#111]">{displayPrice}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Member rate</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#111]">{displayPrice}</span>
            )}
          </div>
        </div>

        <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
          {session.description}
        </p>

        {/* What's included */}
        <p className="text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-2">
          What you get
        </p>
        <div className="space-y-1.5 mb-4">
          {session.includes.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-[12px] text-[#555]">{item}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onBook(session.calSlug)}
          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${
            session.popular
              ? "bg-[#111] text-white hover:bg-[#222] shadow-sm"
              : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB] border border-[#E0E0E0]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Book this session
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---- Discount banner ---- */

function DiscountBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-emerald-700" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#111]">
            You get discounted coaching rates
          </p>
          <p className="text-[12px] text-[#888] font-light mt-1 leading-relaxed">
            As a Prepare or Convert member, your prices are shown above at the member rate.
            Book anytime - slots fill up as we get closer to spring week dates.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Speaker coaching directory ---- */

function SpeakerCoachingDirectory() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-[#888]" />
        <h3 className="text-[14px] font-semibold text-[#111]">Your panel speakers</h3>
      </div>
      <p className="text-[12px] text-[#888] font-light mb-4">
        These are the speakers from the live panel. When you book a session,
        we match you with the speaker most relevant to your target firm.
      </p>
      <div className="space-y-3">
        {SPEAKERS.map((speaker) => (
          <div
            key={speaker.name}
            className="flex items-start gap-3 bg-[#FAFAFA] rounded-xl p-3.5 border border-[#F0F0F0]"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center text-[12px] font-semibold text-white flex-shrink-0">
              {speaker.name[0]}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-semibold text-[#111]">{speaker.name}</p>
                {speaker.university && (
                  <span className="text-[11px] text-[#888] font-light">{speaker.university}</span>
                )}
              </div>
              <p className="text-[11px] text-[#888] font-light mb-1.5">
                Can help with:
              </p>
              <div className="flex flex-wrap gap-1">
                {speaker.firms.map((firm) => (
                  <span
                    key={firm}
                    className="text-[10px] bg-white border border-[#E8E8E8] text-[#555] px-2 py-0.5 rounded-full font-medium"
                  >
                    {firm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- How it works ---- */

function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Pick your session",
      desc: "Choose Strategy Call or Deep Dive based on how much time you need.",
    },
    {
      icon: Calendar,
      title: "Book a slot",
      desc: "Select a time on Cal.com. Your email is pre-filled automatically.",
    },
    {
      icon: Users,
      title: "Get matched",
      desc: "We match you to the speaker with experience at your target firm.",
    },
    {
      icon: Star,
      title: "Walk away with a plan",
      desc: "Leave with firm-specific tactics, a networking list, and clear next steps.",
    },
  ];

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <h3 className="text-[14px] font-semibold text-[#111] mb-4">How it works</h3>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, i) => (
          <div key={step.title} className="bg-[#FAFAFA] rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#111] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <step.icon className="w-3.5 h-3.5 text-[#888]" />
            </div>
            <p className="text-[12px] font-semibold text-[#111] mb-0.5">{step.title}</p>
            <p className="text-[11px] text-[#888] font-light leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Main ---- */

export default function SpringWeekBooking() {
  const access = useSwAccess();
  const handleBook = useBookingHandler();

  const hasDiscount = access.hasCoachingDiscount;

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-7">
          <h1 className="text-[22px] md:text-[26px] font-bold text-[#111] tracking-tight">
            1-on-1 Sessions
          </h1>
          <p className="text-[13px] text-[#999] font-light mt-1.5">
            Book directly with the speakers from the panel. They've been where you are.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-5">
        {/* Discount banner */}
        {hasDiscount && <DiscountBanner />}

        {/* Session cards */}
        <div className="space-y-4">
          {SESSIONS.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              hasDiscount={hasDiscount}
              onBook={handleBook}
            />
          ))}
        </div>

        {/* How it works */}
        <HowItWorks />

        {/* Speaker directory */}
        <SpeakerCoachingDirectory />

        {/* Risk reversal */}
        <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#888] font-light">
            Not satisfied after your session?{" "}
            <a
              href="mailto:support@yourearlyedge.co.uk"
              className="text-[#555] underline underline-offset-2"
            >
              Email us
            </a>{" "}
            and we'll arrange a follow-up or full refund.
            You can reschedule up to 24 hours before your slot.
          </p>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-[#CCC] text-center">
          Questions?{" "}
          <a
            href="mailto:support@yourearlyedge.co.uk"
            className="text-[#AAA] underline underline-offset-2"
          >
            support@yourearlyedge.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
