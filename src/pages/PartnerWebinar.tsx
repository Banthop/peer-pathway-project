import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { getPartnerConfig, type PartnerConfig } from "@/data/partnerConfig";
import { SPRING_WEEK_NIGHTS, SPEAKERS } from "@/data/springWeekData";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { SpringWeekIndustry } from "@/components/spring-week/SpringWeekIndustry";
import { useCountdown } from "@/components/spring-week/shared";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import { matchFirmsToNights } from "@/data/springWeekData";
import { WebinarCheckout } from "@/components/checkout/WebinarCheckout";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Lock,
  Zap,
  BookOpen,
  Check,
  Clock,
  Shield,
  ShieldCheck,
  Users,
  Star,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---- Firm names (text only) ---- */
const FIRM_NAMES = [
  "Morgan Stanley", "Evercore", "HSBC", "Deutsche Bank",
  "Houlihan Lokey", "Barclays", "Nomura", "RBC",
  "JP Morgan", "D.E. Shaw", "Macquarie", "Lazard",
  "BNP Paribas", "Jane Street", "Bank of America", "EY",
];

/* ---- FAQ data ---- */
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

/* ================================================================
   Success Screen
   ================================================================ */
function PartnerSuccessScreen({
  name,
  ticket,
  partnerName,
}: {
  name: string;
  ticket: string;
  partnerName: string;
}) {
  const tier =
    ticket === "prepare"
      ? "prepare"
      : ticket === "after-hours"
        ? "after-hours"
        : ticket === "convert"
          ? "convert"
          : "watch";

  const tierLabel =
    tier === "convert"
      ? "Convert"
      : tier === "after-hours"
        ? "After Hours"
        : tier === "prepare"
          ? "Prepare"
          : "Watch";

  const tierDescription: Record<string, string> = {
    watch:
      "You've secured your spot for the live panel + recording. We'll be in touch within 24 hours with your Zoom link and everything you need.",
    prepare:
      "You've secured the live panel, recording, and your Spring Week Handbook. We'll be in touch within 24 hours with your access details and next steps.",
    "after-hours":
      "You've secured the live panel, recording, handbook, and your spot in the After Hours session. We'll be in touch within 24 hours with everything you need.",
    convert:
      "You've secured the full package: live panel, recording, handbook, After Hours, and your 1-on-1 prep call. We'll be in touch within 24 hours to get you matched with the right speaker and send over everything.",
  };

  return (
    <div className="funnel-dark flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-white">
            You're in{name ? `, ${name}` : ""}!
          </h1>
        </div>

        <div className="funnel-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {tierLabel} tier
            </span>
          </div>
          <p className="text-sm font-light text-white/60 leading-relaxed">
            {tierDescription[tier]}
          </p>
          <p className="text-sm font-light text-white/40 leading-relaxed">
            Keep an eye on your inbox. If you don't see anything within 24 hours, drop us a message.
          </p>
        </div>

        {/* Checklist download */}
        <div
          className="funnel-card rounded-2xl p-5 space-y-3"
          style={{ borderColor: "rgba(52,211,153,0.15)" }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">
              In the meantime: your free checklist
            </span>
          </div>
          <p className="text-sm font-light text-white/50">
            Start prepping right now with the Spring Week Conversion Checklist.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="/spring-week-checklist.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-colors no-underline"
            >
              View Checklist
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/spring-week-conversion-checklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/[0.04] text-white/60 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors no-underline"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Partner attribution */}
        <div className="text-center">
          <p className="text-xs text-white/30 font-light">
            Thanks to {partnerName} for the hookup
          </p>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-block text-sm text-white/40 underline underline-offset-4 font-light hover:text-white/60 transition-colors"
          >
            Back to EarlyEdge
          </a>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Preparing Checkout Transition
   ================================================================ */
function PreparingCheckout({
  firstName,
  springWeekFirms,
  industry,
}: {
  firstName: string;
  springWeekFirms: string;
  industry: string;
}) {
  const firmMatches = matchFirmsToNights(springWeekFirms);
  const [visibleLines, setVisibleLines] = useState(0);

  const lines: Array<{ text: string }> = [];
  if (firmMatches.length > 0) {
    lines.push({
      text: `${firmMatches[0].firm} covered on ${firmMatches[0].nightLabel}`,
    });
  }
  if (industry) {
    lines.push({ text: `Matching ${industry} content` });
  }
  lines.push({ text: "Building your personalised recommendation" });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 500 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-in fade-in duration-500 max-w-md">
        <Loader2 className="h-8 w-8 mx-auto text-emerald-400 animate-spin" />
        <h2 className="text-xl font-light text-white">
          Tailoring your options{firstName ? `, ${firstName}` : ""}...
        </h2>
        <div className="space-y-3 text-left">
          {lines.map((line, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-2.5 text-sm transition-all duration-300",
                i < visibleLines
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-white/70 font-light">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Landing FAQ
   ================================================================ */
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

/* ================================================================
   Partner Welcome (Step 0)
   ================================================================ */
function PartnerWelcome({
  config,
  onContinue,
}: {
  config: PartnerConfig;
  onContinue: () => void;
}) {
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Partner banner */}
      <div className="w-full max-w-2xl mb-6">
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 border"
          style={{
            backgroundColor: `${config.brandColor}08`,
            borderColor: `${config.brandColor}25`,
          }}
        >
          <div className="flex items-center gap-3">
            <img
              src={config.logo}
              alt={`${config.name} logo`}
              className="h-5 w-auto"
            />
            <span className="text-xs font-medium text-white/70">
              Exclusive for {config.name} members
            </span>
          </div>
          <span className="text-[10px] text-white/30 font-light">
            x Early<span className="font-bold text-white/50">Edge</span>
          </span>
        </div>
      </div>

      {/* FREE badge - prominent */}
      <div className="w-full max-w-2xl text-center mb-4">
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-5 py-2 rounded-full">
          Free for {config.name} members
        </span>
      </div>

      {/* Hero - bold centered */}
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

      {/* CTA */}
      <div className="w-full max-w-2xl mt-8">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-black hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #6EE7B7, #34D399)" }}
        >
          Claim Your Free Spot
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-[11px] text-white/40 mt-3 font-light">
          Free for {config.name} members. Join 150+ students already registered.
        </p>
        <div className="flex justify-center mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/[0.06] border border-white/[0.08] px-3 py-1 rounded-full">
            Recording included
          </span>
        </div>
      </div>

      {/* Countdown */}
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

      {/* Speakers who converted at - logos */}
      <div className="w-full max-w-2xl mt-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-6 text-center">
          Speakers who converted at these firms
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-5">
          {[
            { file: "morgan-stanley.svg", h: "h-6 md:h-7", invert: true },
            { file: "jpmorgan.svg", h: "h-7 md:h-8", invert: true },
            { file: "barclays.svg", h: "h-8 md:h-10", invert: true },
            { file: "citadel.svg", h: "h-7 md:h-8", invert: false },
            { file: "deutsche-bank.svg", h: "h-6 md:h-7", invert: true },
            { file: "macquarie.svg", h: "h-6 md:h-7", invert: true },
            { file: "lazard.svg", h: "h-6 md:h-7", invert: true },
            { file: "evercore.svg", h: "h-6 md:h-7", invert: true },
            { file: "houlihan-lokey.svg", h: "h-6 md:h-7", invert: false },
            { file: "jane-street.svg", h: "h-6 md:h-7", invert: false },
            { file: "de-shaw.svg", h: "h-7 md:h-8", invert: true },
            { file: "bnp-paribas.svg", h: "h-7 md:h-8", invert: true },
            { file: "bank-of-america.svg", h: "h-6 md:h-7", invert: true },
            { file: "ey.svg", h: "h-7 md:h-8", invert: false },
            { file: "nomura.svg", h: "h-6 md:h-7", invert: true },
            { file: "rbc.svg", h: "h-9 md:h-11", invert: true },
          ].map((firm) => (
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

      {/* What you will walk away with */}
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

      {/* Why this weekend */}
      <div className="w-full max-w-2xl mt-12">
        <div
          className="funnel-card rounded-xl px-5 py-5"
          style={{ borderColor: "rgba(52,211,153,0.12)" }}
        >
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

      {/* Tier teaser (no prices) */}
      <div className="w-full max-w-2xl mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { name: "Watch", desc: "Live panel + recording", icon: "🎙" },
            { name: "Prepare", desc: "Panel + Handbook (45+ firms)", icon: "📖", highlight: true },
            { name: "After Hours", desc: "Stay after with speakers", icon: "🌙" },
            { name: "Convert", desc: "Panel + Handbook + 1-on-1 call", icon: "🚀" },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`funnel-card rounded-xl px-3 py-4 sm:p-5 text-center ${
                tier.highlight
                  ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                  : ""
              }`}
            >
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                {tier.name}
              </p>
              <p className="text-[10px] sm:text-xs text-white/55 font-light mt-1 leading-tight">
                {tier.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
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

      <div className="w-full max-w-2xl funnel-divider mt-12 mb-10" />

      <div className="w-full max-w-2xl mb-10">
        <LandingFAQ />
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between pb-10">
        <p className="text-xs text-white/20 font-light">
          Early<span className="font-bold text-white/60">Edge</span>
        </p>
        <p className="text-xs text-white/20 font-light">yourearlyedge.co.uk</p>
      </div>
    </div>
  );
}

/* ================================================================
   Animated Price Display
   ================================================================ */
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    const start = prevRef.current;
    const end = value;
    const duration = 300;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(+(start + (end - start) * eased).toFixed(2));
      if (progress < 1) requestAnimationFrame(step);
      else {
        setDisplayValue(end);
        prevRef.current = end;
      }
    }
    requestAnimationFrame(step);
  }, [value]);

  if (value === 0) return <span>FREE</span>;

  const integer = Math.floor(displayValue);
  const decimal = Math.round((displayValue - integer) * 100)
    .toString()
    .padStart(2, "0");

  return (
    <span>
      {"\u00A3"}
      {integer}
      <span className="text-[0.65em] font-normal">.{decimal}</span>
    </span>
  );
}

/* ================================================================
   Partner Tier Picker (Step 4)
   ================================================================ */
function PartnerTierPicker({
  config,
  formData,
  onCheckout,
}: {
  config: PartnerConfig;
  formData: { firstName: string; springWeekFirms: string };
  onCheckout: (tierId: string, stripeLink: string) => void;
}) {
  const [selectedTier, setSelectedTier] = useState("prepare");
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);
  const firstName = formData.firstName;

  const currentTier =
    config.tiers.find((t) => t.id === selectedTier) ?? config.tiers[0];

  const firstFirm = formData.springWeekFirms.trim()
    ? formData.springWeekFirms.split(",")[0].trim()
    : "";

  function handleCheckout() {
    onCheckout(currentTier.id, currentTier.stripeLink);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Step 4 of 4
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-white leading-tight tracking-tight">
          {firstName
            ? `Choose your tier, ${firstName}`
            : "Choose your tier"}
        </h1>
        <p className="text-sm text-white/40 font-light max-w-md mx-auto">
          One live panel. {SPEAKERS.length} speakers who converted. Every tier
          includes the full recording.
        </p>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-3 funnel-card rounded-xl px-5 py-3">
        <Clock className="w-3.5 h-3.5 text-white/25 shrink-0" />
        <p className="text-xs text-white/40">Live panel starts in</p>
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          {countdown.days > 0 && <span>{countdown.days}d</span>}
          <span>{String(countdown.hours).padStart(2, "0")}h</span>
          <span>{String(countdown.minutes).padStart(2, "0")}m</span>
          <span>{String(countdown.seconds).padStart(2, "0")}s</span>
        </div>
      </div>

      {/* Tier cards */}
      <div className="space-y-4">
        {config.tiers.map((t) => {
          const isSelected = selectedTier === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              className={[
                "w-full text-left rounded-2xl border-2 p-6 md:p-7 transition-all duration-200 relative overflow-hidden cursor-pointer",
                isSelected
                  ? "border-white/20 bg-white/[0.04]"
                  : "border-white/[0.06] bg-transparent hover:border-white/12",
              ].join(" ")}
            >
              {/* Accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-opacity duration-200"
                style={{
                  backgroundColor: t.accent,
                  opacity: isSelected ? 1 : 0.25,
                }}
              />

              <div className="pl-4 flex items-start gap-4">
                {/* Radio */}
                <div
                  className={[
                    "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    isSelected
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-white/20",
                  ].join(" ")}
                >
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 text-black"
                      strokeWidth={3}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base md:text-lg font-bold text-white">
                      {t.name}
                    </span>
                    {t.badge && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${t.accent}18`,
                          color: t.accent,
                        }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-white/50">{t.tagline}</p>
                  <div className="mt-3 space-y-1.5">
                    {t.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <Check
                          className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400"
                          strokeWidth={2.5}
                        />
                        <span className="text-xs md:text-sm text-white/50 leading-snug">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  {t.limited && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span className="text-[11px] font-semibold text-amber-400">
                        Only {t.limited} spots left
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  {t.originalPrice != null && (
                    <p className="text-sm text-white/30 line-through">
                      {"\u00A3"}
                      {t.originalPrice}
                    </p>
                  )}
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {t.price === 0 ? "FREE" : `\u00A3${t.price}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditional upsell nudge when Watch (free) is selected */}
      {selectedTier === "watch" && (
        <div
          className="funnel-card rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: `${config.brandColor}25` }}
        >
          <p className="text-sm text-white/60 font-light leading-snug">
            Most {config.name} members upgrade to{" "}
            <strong className="text-white/80 font-semibold">Prepare</strong> for
            the Handbook.
            {firstFirm
              ? ` It covers ${firstFirm} in detail.`
              : " It covers 45+ firms in detail."}
          </p>
          <button
            type="button"
            onClick={() => setSelectedTier("prepare")}
            className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Switch to Prepare
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="funnel-card rounded-xl p-5 space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              <AnimatedPrice value={currentTier.price} />
            </div>
            <p className="text-xs text-white/40 mt-1">
              {currentTier.name} tier selected
            </p>
          </div>
          {currentTier.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-black shrink-0">
              {currentTier.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99]"
        >
          <Zap className="w-4 h-4" />
          <span>
            {currentTier.price === 0
              ? `Get ${currentTier.name} for Free`
              : `Get ${currentTier.name} for \u00A3${currentTier.price}`}
          </span>
        </button>

        <p className="text-center text-[11px] text-white/30 font-light">
          You'll receive your ticket confirmation by email immediately
        </p>

        <div className="flex items-center justify-center gap-4 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Full refund
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Secure Stripe checkout
          </span>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-1">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <Users className="w-3.5 h-3.5 text-white/20" />
          Most students choose Prepare
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <Star className="w-3.5 h-3.5 text-white/20" />
          {SPEAKERS.length} speakers who did spring weeks and more
        </div>
      </div>

      {/* Urgency footer */}
      <div
        className="flex items-start gap-3 funnel-card rounded-xl px-4 py-3"
        style={{ borderColor: "rgba(245,158,11,0.12)" }}
      >
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-medium text-white/70">
            The live panel is Sunday April 12 at 7pm BST.
          </p>
          <p className="text-xs font-light text-white/40 mt-0.5">
            Spring weeks are happening right now. Prepare with people who already converted before yours starts.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Main Page Component
   ================================================================ */
export default function PartnerWebinar() {
  const { partnerSlug } = useParams<{ partnerSlug: string }>();
  const [searchParams] = useSearchParams();

  console.log("[PartnerWebinar] slug:", partnerSlug, "url:", window.location.pathname);
  const config = partnerSlug ? getPartnerConfig(partnerSlug) : null;
  console.log("[PartnerWebinar] config:", config ? config.name : "NULL");

  useEffect(() => {
    if (!config) return;
    const prev = document.title;
    document.title = `EarlyEdge x ${config.name} - Spring Week Conversion Webinar`;
    return () => {
      document.title = prev;
    };
  }, [config]);

  const isSuccess = searchParams.get("success") === "true";
  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<string | null>(null);

  if (!config) {
    return <Navigate to="/spring-week" replace />;
  }

  if (isSuccess) {
    const saved =
      localStorage.getItem("spring_week_signup") ||
      sessionStorage.getItem("spring_week_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const ticketParam = searchParams.get("ticket");
    const name = parsed?.firstName ?? "";
    const ticket = ticketParam || parsed?.selectedTicket || "watch";
    return (
      <PartnerSuccessScreen
        name={name}
        ticket={ticket}
        partnerName={config.name}
      />
    );
  }

  const partnerTags = [config.referralTag];

  const handleContinue = (): string | null => {
    const currentStep = form.step;
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }

    if (currentStep === 1) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        phone: form.formData.phoneCode
          ? `+${form.formData.phoneCode}${form.formData.phone}`
          : form.formData.phone,
        source: "webinar",
        tags: ["spring_week_form_started", ...partnerTags],
        metadata: {
          form_step: 1,
          product_type: "spring_week",
          webinar_type: "spring_week",
          partner: config.slug,
        },
      });
    }

    if (currentStep === 2) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: ["spring_week_form_started", ...partnerTags],
        metadata: {
          form_step: 2,
          year_of_study: form.formData.yearOfStudy,
          product_type: "spring_week",
          webinar_type: "spring_week",
          partner: config.slug,
        },
      });
    }

    if (currentStep === 3) {
      saveWebinarLead(
        { ...form.formData, referralSource: config.name },
        "spring_week",
      );
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: [
          "spring_week_form_started",
          "spring_week_checkout_started",
          ...partnerTags,
        ],
        metadata: {
          form_step: 4,
          industry: form.formData.industry,
          spring_week_firms: form.formData.springWeekFirms,
          biggest_concern: form.formData.biggestConcern,
          product_type: "spring_week",
          webinar_type: "spring_week",
          partner: config.slug,
        },
      });
      form.prevStep();
      setShowTransition(true);
      setTimeout(() => {
        form.nextStep();
        setTimeout(() => {
          setShowTransition(false);
        }, 400);
      }, 2500);
    }

    return null;
  };

  const handleCheckout = (tierId: string, _stripeLink: string) => {
    form.updateField("selectedTicket", tierId);
    markLeadCheckout(form.formData.email);
    setCheckoutTier(tierId);
  };

  const handleCheckoutSuccess = (tierId: string) => {
    const signupData = JSON.stringify({
      ...form.formData,
      selectedTicket: tierId,
      productType: "spring_week",
      partner: config.slug,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("spring_week_signup", signupData);
    sessionStorage.setItem("spring_week_signup", signupData);

    saveCrmContact({
      email: form.formData.email,
      firstName: form.formData.firstName,
      lastName: form.formData.lastName,
      university: form.formData.university,
      source: "webinar",
      tags: ["spring_week_form_started", "stripe_customer", "spring_week", `spring_week_${tierId}`, ...partnerTags],
      metadata: {
        product_type: "spring_week",
        webinar_type: "spring_week",
        partner: config.slug,
        tier: tierId,
      },
    });

    // Navigate to success
    window.history.replaceState(null, "", `?success=true&ticket=${tierId}`);
    window.location.reload();
  };

  // Checkout step (after tier selection)
  if (checkoutTier) {
    return (
      <div className="funnel-dark relative">
        <div className="fixed top-0 left-0 right-0 z-40">
          <Progress
            value={100}
            className="h-1 rounded-none bg-white/[0.06] [&>div]:bg-emerald-500"
          />
        </div>
        <div className="absolute top-5 left-6 z-50">
          <span className="text-sm font-light text-white/40">
            Early<span className="font-bold text-white/70">Edge</span>
          </span>
        </div>
        <main className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl mx-auto">
            <WebinarCheckout
              selectedTierId={checkoutTier}
              tiers={config.tiers}
              formData={{
                firstName: form.formData.firstName,
                lastName: form.formData.lastName,
                email: form.formData.email,
                springWeekFirms: form.formData.springWeekFirms,
                university: form.formData.university,
                industry: form.formData.industry,
              }}
              partnerSlug={config.slug}
              partnerName={config.name}
              onSuccess={handleCheckoutSuccess}
              onBack={() => setCheckoutTier(null)}
            />
          </div>
        </main>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="funnel-dark relative">
        <div className="fixed top-0 left-0 right-0 z-40">
          <Progress
            value={form.progress}
            className="h-1 rounded-none bg-white/[0.06] [&>div]:bg-emerald-500"
          />
        </div>
        <div className="absolute top-5 left-6 z-50">
          <span className="text-sm font-light text-white/40">
            Early<span className="font-bold text-white/70">Edge</span>
          </span>
        </div>
        <PreparingCheckout
          firstName={form.formData.firstName}
          springWeekFirms={form.formData.springWeekFirms}
          industry={form.formData.industry}
        />
      </div>
    );
  }

  return (
    <div className="funnel-dark relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress
          value={form.progress}
          className="h-1 rounded-none bg-white/[0.06] [&>div]:bg-emerald-500"
        />
      </div>

      {/* Logo */}
      <div className="absolute top-5 left-6 z-50">
        <span className="text-sm font-light text-white/40">
          Early<span className="font-bold text-white/70">Edge</span>
        </span>
      </div>

      {/* Step counter */}
      {form.step > 0 && (
        <div className="absolute top-6 right-6 z-50">
          <span className="text-xs text-white/30 font-light">
            {form.step} of {form.totalSteps - 1}
          </span>
        </div>
      )}

      {/* Back button */}
      {form.step > 0 && (
        <button
          type="button"
          onClick={form.prevStep}
          className="absolute top-14 left-6 z-50 text-sm text-white/40 hover:text-white/70 transition-colors font-light flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Form steps */}
      <main
        className={`min-h-screen flex ${
          form.step === 0 ? "items-start pt-28 md:pt-32" : "items-center"
        } justify-center px-4 py-8`}
      >
        <div
          className={`w-full mx-auto ${
            form.step === 0 ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          <WebinarFormStep isActive={form.step === 0} direction={form.direction}>
            <PartnerWelcome config={config} onContinue={handleContinue} />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 1} direction={form.direction}>
            <NameEmailStep
              firstName={form.formData.firstName}
              lastName={form.formData.lastName}
              email={form.formData.email}
              phoneCode={form.formData.phoneCode}
              phone={form.formData.phone}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 2} direction={form.direction}>
            <UniversityStep
              university={form.formData.university}
              yearOfStudy={form.formData.yearOfStudy}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 3} direction={form.direction}>
            <SpringWeekIndustry
              industry={form.formData.industry}
              industryDetail={form.formData.industryDetail}
              springWeekFirms={form.formData.springWeekFirms}
              biggestConcern={form.formData.biggestConcern}
              referralSource={form.formData.referralSource || config.name}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 4} direction={form.direction}>
            <PartnerTierPicker
              config={config}
              formData={form.formData}
              onCheckout={handleCheckout}
            />
          </WebinarFormStep>
        </div>
      </main>
    </div>
  );
}
