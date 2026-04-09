import { useState } from "react";
import { SPRING_WEEK_NIGHTS, SPEAKERS } from "@/data/springWeekData";
import { useCountdown } from "./shared";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  Shield,
  Check,
} from "lucide-react";

interface SpringWeekWelcomeProps {
  onContinue: () => void;
}

/* ---- Firm names (text only, no logos) ---- */
const FIRM_NAMES = [
  "Morgan Stanley", "Evercore", "HSBC", "Deutsche Bank",
  "Houlihan Lokey", "Barclays", "Nomura", "RBC",
  "JP Morgan", "D.E. Shaw", "Macquarie", "Lazard",
  "BNP Paribas", "Jane Street", "Bank of America", "EY",
];

/* ---- Checklist card component ---- */
function ChecklistCard() {
  return (
    <div className="checklist-card">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
          EarlyEdge Checklist
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full ml-auto">
          Free
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mt-3 leading-tight">
        Spring Week
        <br />
        <span className="text-emerald-400">Conversion</span>
        <br />
        Checklist
      </h3>
      <p className="text-xs text-white/60 mt-2 mb-4">
        Your step-by-step guide to standing out
      </p>
      <div className="space-y-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className={`rounded flex items-center justify-center shrink-0 ${
                i < 2 ? "bg-emerald-500" : "border border-white/15 bg-transparent"
              }`}
              style={{ width: 18, height: 18 }}
            >
              {i < 2 && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
            </div>
            <div
              className={`h-2 rounded-full flex-1 ${
                i < 2 ? "bg-emerald-500/30" : "bg-white/[0.06]"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-4 font-medium">
        Early<span className="text-white/60 font-bold">Edge</span>
      </p>
    </div>
  );
}

/* ---- FAQ accordion ---- */
const LANDING_FAQS = [
  {
    q: "How long is the session?",
    a: "About 3 hours. Two speaker sessions plus an open Q&A at the end where you can ask about your specific firm.",
  },
  {
    q: "Will there be recordings?",
    a: "Yes - recordings are included with every ticket. If you can't make it live, you won't miss out.",
  },
  {
    q: "What if my firm isn't listed?",
    a: "The conversion strategies our panellists share work across every firm and every area of finance. The frameworks are universal.",
  },
  {
    q: "What's in The Handbook?",
    a: "11 chapters of real insights from real spring weekers. Day-by-day walkthroughs, networking scripts, firm-by-firm breakdowns, and conversion tactics. Written in their own words.",
  },
  {
    q: "I haven't done a spring week yet. Is this for me?",
    a: "This webinar is specifically about converting spring weeks into return offers. If you haven't secured one yet, this will still give you incredible insight into what firms look for.",
  },
  {
    q: "Can I get a refund?",
    a: "Full refund available. We're confident you'll find it valuable.",
  },
];

function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-4 w-4 text-white/50" />
        <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
          Common Questions
        </span>
      </div>
      {LANDING_FAQS.map((faq, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen(open === i ? null : i)}
          className="w-full text-left funnel-card rounded-xl px-4 py-3.5 transition-all hover:border-white/12"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white/90 leading-snug">
              {faq.q}
            </span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 text-white/50 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/50 shrink-0" />
            )}
          </div>
          {open === i && (
            <p className="mt-2.5 text-sm font-light text-white/60 leading-relaxed">
              {faq.a}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---- Main SpringWeekWelcome ---- */
export function SpringWeekWelcome({ onContinue }: SpringWeekWelcomeProps) {
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);

  return (
    <div className="flex flex-col items-center w-full">

      {/* ---- HERO SECTION ---- */}
      <div className="w-full max-w-2xl">
        {/* Top row: Checklist card + Headline */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

          {/* Checklist card - hidden on mobile */}
          <div className="hidden md:block w-[240px] shrink-0">
            <ChecklistCard />
          </div>

          {/* Right: headline area */}
          <div className="flex-1">
            {/* Date pill + free note */}
            <div className="flex items-center gap-3 mb-8">
              <span className="funnel-pill">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Sunday April 12
              </span>
              <span className="text-xs font-medium text-white/60">
                Free checklist included
              </span>
            </div>

            {/* Headline */}
            <h1
              className="funnel-heading"
              style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
            >
              How students{" "}
              <span className="text-emerald-400">converted</span> their spring weeks into return offers
            </h1>

            {/* Subtitle */}
            <p className="funnel-sub mt-4 text-sm md:text-[15px] max-w-md">
              {SPEAKERS.length} speakers. 17+ firms. Every conversion strategy they used, shared in one afternoon.
            </p>

            {/* Date + Platform row */}
            <div className="flex flex-wrap items-center gap-4 mt-5 text-[13px] text-white/60 font-light">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/25" />
                Sun April 12 - 2-5pm BST
              </span>
              <span className="hidden sm:inline text-white/15">|</span>
              <span>Live on Zoom - recording included</span>
            </div>
          </div>
        </div>

        {/* Checklist card - mobile only */}
        <div className="md:hidden mt-8">
          <ChecklistCard />
        </div>
      </div>

      {/* ---- COUNTDOWN BAR ---- */}
      <div className="w-full max-w-2xl mt-10">
        <div className="flex items-center justify-between funnel-card rounded-xl px-4 py-3">
          <span className="text-xs text-white/60 font-light">
            Spring weeks start Monday. This is the weekend to get ready.
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 shrink-0 ml-3">
            <Clock className="h-3 w-3" />
            {countdown.days}d {String(countdown.hours).padStart(2, "0")}h{" "}
            {String(countdown.minutes).padStart(2, "0")}m
          </div>
        </div>
      </div>

      {/* ---- CTA ---- */}
      <div className="w-full max-w-2xl mt-6">
        <button type="button" onClick={onContinue} className="funnel-cta">
          Secure Your Spot - From £19
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-[11px] text-white/50 mt-3 font-light">
          Join 150+ students already registered. Full refund if it's not for you.
        </p>
      </div>

      {/* ---- SPEAKERS WHO CONVERTED AT ---- */}
      <div className="w-full max-w-2xl mt-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-4">
          Speakers who converted at
        </h2>
        <div className="flex flex-wrap gap-2">
          {FIRM_NAMES.map((firm) => (
            <span
              key={firm}
              className="text-[13px] font-semibold text-white/80 bg-white/[0.06] border border-white/[0.10] rounded-lg px-3.5 py-2"
            >
              {firm}
            </span>
          ))}
        </div>
      </div>

      {/* ---- WHAT YOU'LL WALK AWAY WITH ---- */}
      <div className="w-full max-w-2xl mt-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-4">
          What you will walk away with
        </h2>
        <div className="space-y-2">
          {[
            "What to expect during your spring week - day by day, firm by firm",
            "How to network without being awkward (scripts from people who did it)",
            "Assessment centre strategies that got them return offers",
            "The mistakes that cost other students their offers",
            "Direct Q&A with speakers about your specific firm",
            "Recordings of all sessions if you can't make one live",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 py-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400/80" />
              <span className="text-[14px] text-white/60 font-light leading-snug">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- WHY THIS WEEKEND ---- */}
      <div className="w-full max-w-2xl mt-12">
        <div className="funnel-card rounded-xl px-5 py-5" style={{ borderColor: "rgba(52,211,153,0.12)" }}>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Why this weekend?
          </p>
          <p className="text-[14px] font-light text-white/70 leading-relaxed">
            Spring weeks start <strong className="font-semibold text-white/80">Monday April 13</strong>.
            Most firms run the assessment centre on the{" "}
            <strong className="font-semibold text-white/80">final day</strong>,
            so the students who convert are the ones who showed up ready from day one.
          </p>
          <p className="text-[14px] font-light text-white/60 mt-2 leading-relaxed">
            This is the last weekend to prepare with students who already converted.
          </p>
        </div>
      </div>

      {/* ---- PRICING PREVIEW ---- */}
      <div className="w-full max-w-2xl mt-12">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { name: "Watch", price: "£19", desc: "Live panel + recording" },
            { name: "Prepare", price: "£39", desc: "Panel + Handbook (45+ firms)", highlight: true },
            { name: "Convert", price: "£79", desc: "Panel + Handbook + prep call" },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`funnel-card rounded-xl px-3 py-4 sm:p-5 text-center ${
                tier.highlight ? "border-emerald-500/30 bg-emerald-500/[0.04]" : ""
              }`}
            >
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                {tier.name}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white">{tier.price}</p>
              <p className="text-[10px] sm:text-xs text-white/55 font-light mt-1 leading-tight">{tier.desc}</p>
              {tier.highlight && (
                <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  Most chosen
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---- BOTTOM CTA ---- */}
      <div className="w-full max-w-2xl mt-8">
        <button type="button" onClick={onContinue} className="funnel-cta">
          I Want to Be Prepared
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-white/50 font-light">
          <Shield className="h-3 w-3" />
          <span>Full refund. Secure Stripe checkout.</span>
        </div>
      </div>

      {/* ---- DIVIDER ---- */}
      <div className="w-full max-w-2xl funnel-divider mt-12 mb-10" />

      {/* ---- FAQ ---- */}
      <div className="w-full max-w-2xl mb-10">
        <LandingFAQ />
      </div>

      {/* ---- FOOTER ---- */}
      <div className="w-full max-w-2xl flex items-center justify-between pb-10">
        <p className="text-xs text-white/20 font-light">
          Early<span className="font-bold text-white/60">Edge</span>
        </p>
        <p className="text-xs text-white/20 font-light">
          yourearlyedge.co.uk
        </p>
      </div>
    </div>
  );
}
