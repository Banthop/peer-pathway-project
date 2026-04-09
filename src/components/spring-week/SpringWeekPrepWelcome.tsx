import { useState } from "react";
import { useCountdown, CountUp, FirmTicker } from "./shared";
import { Button } from "@/components/ui/button";
import { SPRING_WEEK_NIGHTS } from "@/data/springWeekData";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Mic2,
  TrendingDown,
  BookOpen,
  Layers,
} from "lucide-react";

interface SpringWeekPrepWelcomeProps {
  onContinue: () => void;
}

/* ---- FAQ accordion ---- */
const PREP_FAQS = [
  {
    q: "What exactly is in the checklist?",
    a: "A distilled set of notes from 7+ students who converted their spring weeks at top banks, trading firms, and consultancies. Covers what they did each day, how they networked, what the assessments looked like, and the mistakes they saw others make.",
  },
  {
    q: "Is this actually free?",
    a: "Yes. No card, no trial, no catch. We ask for your name, email, and details about your spring week so we can personalise the experience.",
  },
  {
    q: "I haven't secured a spring week yet. Is this for me?",
    a: "This is designed for students who already have one confirmed. The content will still give insight into what firms look for, but it's written for students about to start.",
  },
  {
    q: "What's the live panel?",
    a: "After downloading, you'll see the option to join a live panel this Sunday (April 12, 2-5pm BST) where the speakers discuss conversion strategies live and answer your questions. Optional and separate from the free checklist.",
  },
  {
    q: "Will you spam me?",
    a: "No. You'll get the checklist, one email about the live panel, and that's it unless you opt in to more.",
  },
];

function PrepFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full max-w-xl space-y-1.5">
      <div className="flex items-center gap-1.5 mb-3">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold">
          Common Questions
        </span>
      </div>
      {PREP_FAQS.map((faq, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen(open === i ? null : i)}
          className="w-full text-left bg-white/60 backdrop-blur-sm border border-border rounded-xl px-4 py-3.5 transition-all hover:border-foreground/20 hover:bg-white/80"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-sans font-medium text-foreground leading-snug">
              {faq.q}
            </span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
          {open === i && (
            <p className="mt-2.5 text-sm font-sans font-light text-muted-foreground leading-relaxed animate-in fade-in duration-200 text-left">
              {faq.a}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---- Main SpringWeekPrepWelcome ---- */
export function SpringWeekPrepWelcome({ onContinue }: SpringWeekPrepWelcomeProps) {
  const countdown = useCountdown("2026-04-12T14:00:00+01:00");

  return (
    <div className="flex flex-col items-center text-center space-y-0 -mt-16 md:-mt-20">
      {/* ---- 1. URGENCY STRIP ---- */}
      <div className="w-full max-w-xl mb-8 animate-fade-up">
        <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <p className="text-xs font-sans font-medium text-amber-800">
            Spring weeks start Monday April 13. Get the free prep notes before yours begins.
          </p>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 shrink-0">
            <Clock className="h-3 w-3" />
            {countdown.days}d {String(countdown.hours).padStart(2, "0")}h{" "}
            {String(countdown.minutes).padStart(2, "0")}m
          </div>
        </div>
      </div>

      {/* ---- 2. DARK HERO CARD ---- */}
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-950 px-6 py-10 md:py-14 space-y-6 mb-8 animate-fade-up"
        style={{ animationDelay: "0.05s" }}
      >
        {/* Badge */}
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-emerald-400 font-sans border border-emerald-500/30 rounded-full px-4 py-1.5 bg-emerald-500/10">
            <BookOpen className="w-3.5 h-3.5" />
            Free Resource
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-sans leading-[1.08] max-w-md mx-auto"
          style={{
            fontWeight: 700,
            fontSize: "clamp(24px, 4.5vw, 40px)",
            letterSpacing: "-0.02em",
          }}
        >
          The Spring Week{" "}
          <span className="text-emerald-400">Conversion Checklist</span>
        </h1>

        {/* Shock stat */}
        <div className="flex items-center justify-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-400" />
          <p className="text-sm font-sans font-light text-slate-300">
            Only <span className="text-red-400 font-bold">30-40%</span> of spring weekers get a
            return offer. This covers what the other 60% missed.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 md:gap-10 pt-2">
          {[
            { icon: Mic2, value: 7, suffix: "+", label: "Speakers" },
            { icon: Building2, value: 16, suffix: "+", label: "Firms covered" },
            { icon: Layers, value: 6, suffix: "", label: "Chapters" },
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="h-4 w-4 text-emerald-500/60 mb-1" />
              <span className="text-2xl md:text-3xl font-bold text-white font-sans">
                <CountUp target={value} suffix={suffix} />
              </span>
              <span className="text-[10px] text-slate-500 font-sans font-light mt-0.5">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Firm ticker */}
        <FirmTicker />

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            onClick={onContinue}
            className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-semibold px-10 py-4 text-base rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            size="lg"
          >
            Get the Free Checklist
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <span className="text-[11px] text-slate-500 font-sans font-light">
            Plus: find out about our live panel this Sunday with the students behind it.
          </span>
        </div>
      </div>

      {/* ---- 3. SOCIAL PROOF BAR ---- */}
      <div
        className="w-full max-w-xl space-y-2 mb-8 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-start gap-2.5 bg-white border border-border rounded-xl px-4 py-3">
            <Users className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="text-xs font-sans font-light text-foreground/80 leading-relaxed text-left">
              Students from{" "}
              <strong className="font-medium">
                LSE, Warwick, UCL, Imperial, Bristol, Oxford & Cambridge
              </strong>
            </span>
          </div>
          <div className="flex-1 flex items-start gap-2.5 bg-white border border-border rounded-xl px-4 py-3">
            <Award className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="text-xs font-sans font-light text-foreground/80 leading-relaxed text-left">
              100+ students attended our last webinar series
            </span>
          </div>
        </div>
      </div>

      {/* ---- 4. WHAT'S INSIDE THE CHECKLIST ---- */}
      <div
        className="w-full max-w-xl text-left space-y-2.5 mb-8 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What's inside the checklist
        </p>
        {[
          "The mistakes that cost students their return offers",
          "What ACTUALLY matters during the week (it's not what you think)",
          "Day-by-day breakdown of what converters did differently",
          "Division-specific prep for IB, S&T, Research, AM, and Consulting",
          "The evening routine every converter followed",
          "How to handle the networking dinner (this is where most people slip)",
        ].map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-sm text-foreground/80 font-sans font-light leading-snug">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* ---- 5. WHY THIS WEEKEND ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-5 py-4 text-left space-y-2">
          <p className="text-xs font-sans font-semibold text-amber-800 uppercase tracking-wider">
            Why this weekend?
          </p>
          <p className="text-sm font-sans font-light text-amber-900 leading-relaxed">
            Spring weeks start <strong className="font-semibold">Monday April 13</strong>. Most
            firms run the assessment on the{" "}
            <strong className="font-semibold">final day</strong>, so the students who convert are the
            ones who showed up ready from day one.
          </p>
          <p className="text-sm font-sans font-light text-amber-800 leading-relaxed">
            Download the checklist now. Decide about the live panel after.
          </p>
        </div>
      </div>

      {/* ---- 6. FROM OUR LAST WEBINAR ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="bg-slate-900 rounded-2xl px-6 py-5 text-left space-y-3">
          <p className="text-[10px] uppercase tracking-wider font-sans font-semibold text-slate-400">
            From our last webinar
          </p>
          <p className="text-white font-sans font-light text-sm leading-relaxed">
            <span className="text-emerald-400 font-semibold">100+ students attended</span> our cold
            email masterclass. Students landed opportunities at firms they had previously been
            rejected from.
          </p>
          <p className="text-slate-300 font-sans font-light text-sm leading-relaxed">
            That was about getting in the door. This is about making sure you stay in the room.
          </p>
        </div>
      </div>

      {/* ---- 7. WHAT ELSE IS AVAILABLE ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.27s" }}
      >
        <div className="bg-white border border-border rounded-xl px-5 py-4 text-left">
          <p className="text-sm font-sans font-light text-foreground/80 leading-relaxed">
            After downloading, you'll see options for our live panel this Sunday (April 12, 2-5pm
            BST) with all the speakers, the Spring Week Handbook (45+ firms), and 1-on-1 prep calls.
          </p>
        </div>
      </div>

      {/* ---- 8. RISK REVERSAL + BOTTOM CTA ---- */}
      <div
        className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-6 animate-fade-up"
        style={{ animationDelay: "0.29s" }}
      >
        <Shield className="h-3.5 w-3.5 text-emerald-600" />
        <span>100% free. No card required. Just your email.</span>
      </div>

      <div
        className="animate-fade-up flex flex-col items-center gap-2 mb-8"
        style={{ animationDelay: "0.3s" }}
      >
        <Button
          onClick={onContinue}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-semibold px-10 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Get the Free Checklist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          No spam. We'll only email you about spring week prep.
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-full max-w-xl border-t border-border animate-fade-up pt-2 mb-6"
        style={{ animationDelay: "0.31s" }}
      />

      {/* ---- 9. FAQ ---- */}
      <div
        className="w-full animate-fade-up mb-4"
        style={{ animationDelay: "0.32s" }}
      >
        <PrepFAQ />
      </div>

      <div className="h-4" />
    </div>
  );
}
