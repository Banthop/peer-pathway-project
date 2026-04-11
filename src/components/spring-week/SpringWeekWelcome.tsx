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
} from "lucide-react";

interface SpringWeekWelcomeProps {
  onContinue: () => void;
}

/* ---- Firm logos (SVGs from /public/logos/) ---- */
const FIRM_LOGOS = [
  { file: "morgan-stanley.svg", h: "h-6 md:h-7", invert: true },
  { file: "jpmorgan.svg", h: "h-7 md:h-8", invert: true },
  { file: "barclays.svg", h: "h-8 md:h-9", invert: false },
  { file: "citadel.svg", h: "h-7 md:h-8", invert: false },
  { file: "deutsche-bank.svg", h: "h-6 md:h-7", invert: true },
  { file: "macquarie.svg", h: "h-6 md:h-7", invert: true },
  { file: "lazard.svg", h: "h-6 md:h-7", invert: true },
  { file: "evercore.svg", h: "h-6 md:h-7", invert: true },
  { file: "houlihan-lokey.svg", h: "h-6 md:h-7", invert: false },
  { file: "jane-street.svg", h: "h-6 md:h-7", invert: false },
  { file: "de-shaw.svg", h: "h-6 md:h-7", invert: false },
  { file: "bnp-paribas.svg", h: "h-6 md:h-7", invert: false },
  { file: "bank-of-america.svg", h: "h-6 md:h-7", invert: true },
  { file: "ey.svg", h: "h-7 md:h-8", invert: false },
  { file: "nomura.svg", h: "h-6 md:h-7", invert: true },
  { file: "rbc.svg", h: "h-7 md:h-8", invert: false },
];

/* ---- FAQ accordion ---- */
const LANDING_FAQS = [
  {
    q: "How long does the session last?",
    a: "The session runs for approximately 3 hours. This includes two speaker presentations, followed by a dedicated Q&A segment where you can ask specific questions about your target firm.",
  },
  {
    q: "Will the session be recorded?",
    a: "Yes, full recordings are included with every ticket type. If you are unable to attend the live event, you can still catch up on all the material at your own pace.",
  },
  {
    q: "What if my target firm isn't listed?",
    a: "The conversion strategies and frameworks shared by our panellists are fundamentally universal. They have proven highly effective across every major firm and all sub-sectors of the finance industry.",
  },
  {
    q: "What is included inside The Handbook?",
    a: "The Handbook features 11 chapters of actionable insights directly from successful spring week participants. It covers day-by-day walkthroughs, proven networking scripts, detailed firm-by-firm breakdowns, and step-by-step conversion tactics.",
  },
  {
    q: "I haven't secured a spring week yet. Is this still relevant for me?",
    a: "While this webinar focuses predominantly on converting existing spring weeks into return offers, it provides unparalleled transparency into what recruiting teams actively evaluate-making it an exceptional resource for future applicants.",
  },
  {
    q: "What is your refund policy?",
    a: "We will happily provide a full refund if the session does not meet your expectations. We are entirely confident in the practical value of the insights you will receive.",
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

      {/* ---- HERO SECTION (bold centered) ---- */}
      <div className="w-full max-w-2xl text-center">
        <h1
          className="text-white font-bold leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(32px, 7vw, 56px)" }}
        >
          You got the spring week.
          <br />
          Will you <span className="text-emerald-400">convert</span> it?
        </h1>

        <p className="mt-6 text-base md:text-lg font-light text-white/60 leading-relaxed max-w-lg mx-auto">
          Only <strong className="text-white font-bold">10-15%</strong> of spring interns convert on average. This Sunday,{" "}
          <span className="text-white font-medium">10+ students</span> who converted{" "}
          <span className="text-white font-medium">25+ spring weeks</span> share exactly how they did it.
        </p>
      </div>

      {/* ---- CTA ---- */}
      <div className="w-full max-w-2xl mt-8">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-black hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #6EE7B7, #34D399)" }}
        >
          Get Ready Before Monday
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-[11px] text-white/40 mt-3 font-light">
          Join 150+ students already registered. Full refund if it's not for you.
        </p>
        <div className="flex justify-center mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/[0.06] border border-white/[0.08] px-3 py-1 rounded-full">
            Recording included
          </span>
        </div>
      </div>

      {/* ---- COUNTDOWN BAR ---- */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex items-center justify-between funnel-card rounded-xl px-4 py-3">
          <span className="text-xs text-white/60 font-light">
            Spring weeks are happening now. Get ready before yours starts.
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 shrink-0 ml-3">
            <Clock className="h-3 w-3" />
            {countdown.days}d {String(countdown.hours).padStart(2, "0")}h{" "}
            {String(countdown.minutes).padStart(2, "0")}m{" "}
            {String(countdown.seconds).padStart(2, "0")}s
          </div>
        </div>
      </div>

      {/* ---- SPEAKERS WHO CONVERTED AT (logos) ---- */}
      <div className="w-full max-w-2xl mt-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-6 text-center">
          Speakers who converted at these firms
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-5">
          {FIRM_LOGOS.map((firm) => (
            <img
              key={firm.file}
              src={`/logos/${firm.file}`}
              alt={firm.file.replace(".svg", "").replace(/-/g, " ")}
              className={`${firm.h} w-auto opacity-60 hover:opacity-100 transition-opacity duration-200`}
              style={firm.invert ? { filter: "brightness(0) invert(1)" } : undefined}
            />
          ))}
        </div>
        <p className="text-[11px] text-white/40 text-center mt-4 tracking-wide">
          + many more
        </p>
      </div>

      {/* ---- WHAT YOU WILL WALK AWAY WITH ---- */}
      <div className="w-full max-w-2xl mt-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-4 text-center">
          What you will walk away with
        </h2>
        <div className="space-y-2">
          {[
            "What to expect during your spring week - day by day, firm by firm",
            "How to network without being awkward (including scripts from people who did it)",
            "Assessment centre strategies that landed return offers",
            "The mistakes that cost other students their offers",
            "Direct Q&A with speakers about your specific firm",
            "Recordings of all sessions if you can't make one live",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 py-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400/80" />
              <span className="text-[14px] text-white/85 font-light leading-snug">
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
            Spring weeks are running right now across every major firm.
            Most run the assessment centre on the{" "}
            <strong className="font-semibold text-white/80">final day</strong>,
            so the students who convert are the ones who showed up ready from
            day one.
          </p>
          <p className="text-[14px] font-light text-white/60 mt-2 leading-relaxed">
            Get ready before your week starts with students who already
            converted.
          </p>
        </div>
      </div>

      {/* ---- BOTTOM CTA ---- */}
      <div className="w-full max-w-2xl mt-8">
        <button type="button" onClick={onContinue} className="funnel-cta">
          From £19 - I Want to Be Prepared
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
