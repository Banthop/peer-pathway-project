import { Button } from "@/components/ui/button";
import { TARGET_FIRMS } from "@/data/springWeekData";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Mic2,
  BookOpen,
  Layers,
  Clock,
} from "lucide-react";

interface SpringWeekPrepWelcomeProps {
  onContinue: () => void;
}

/* ---- Firm ticker marquee ---- */
function FirmTicker() {
  const firms = TARGET_FIRMS;
  return (
    <div className="relative w-full overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      <div className="flex animate-marquee-left gap-3 whitespace-nowrap">
        {[...firms, ...firms].map((firm, i) => (
          <span
            key={`${firm}-${i}`}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-full px-3.5 py-1.5 shrink-0"
          >
            <Building2 className="h-3 w-3 text-slate-500" />
            {firm}
          </span>
        ))}
      </div>
    </div>
  );
}

const CHECKLIST_ITEMS = [
  "The mistakes that cost students their return offers",
  "What ACTUALLY matters during the week (it's not what you think)",
  "Day-by-day breakdown of what converters did differently",
  "Division-specific prep for IB, S&T, Research, AM, and Consulting",
  "The evening routine that every converter followed",
  "How to handle the networking dinner (this is where most people slip)",
];

export function SpringWeekPrepWelcome({ onContinue }: SpringWeekPrepWelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-0 -mt-16 md:-mt-20">
      {/* ---- DARK HERO SECTION ---- */}
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-950 px-6 py-10 md:py-14 space-y-6 mb-8 animate-fade-up"
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
          Spring Week{" "}
          <span className="text-emerald-400">Conversion Notes</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm font-sans font-light text-slate-300 max-w-sm mx-auto leading-relaxed">
          What students who converted at Morgan Stanley, JP Morgan, Jane Street,
          Citadel, and more did differently - compiled into one free doc.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 md:gap-10 pt-2">
          {[
            { icon: Mic2, value: "7+", label: "Speakers" },
            { icon: Building2, value: "17+", label: "Firms covered" },
            { icon: Layers, value: "4", label: "Phases" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="h-4 w-4 text-emerald-500/60 mb-1" />
              <span className="text-2xl md:text-3xl font-bold text-white font-sans">
                {value}
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
            Get the Free Doc
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ---- WHAT'S INSIDE ---- */}
      <div
        className="w-full max-w-xl text-left space-y-2.5 mb-8 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What's inside
        </p>
        {CHECKLIST_ITEMS.map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-sm text-foreground/80 font-sans font-light leading-snug">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* ---- URGENCY BOX ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/60 rounded-xl px-5 py-4">
          <Clock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <p className="text-sm font-sans font-medium text-amber-800 leading-relaxed text-left">
            Spring weeks start <strong className="font-semibold">Monday April 13</strong>.
            This is the last weekend to prepare.
          </p>
        </div>
      </div>

      {/* ---- BOTTOM CTA ---- */}
      <div
        className="animate-fade-up flex flex-col items-center gap-2 mb-8"
        style={{ animationDelay: "0.2s" }}
      >
        <Button
          onClick={onContinue}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-semibold px-10 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Get the Free Doc
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          Plus: find out about our live panel this Sunday with the students who wrote these notes.
        </span>
      </div>

      <div className="h-4" />
    </div>
  );
}
