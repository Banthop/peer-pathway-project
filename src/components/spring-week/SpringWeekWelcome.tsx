import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WEBINAR_TITLE,
  SPEAKERS,
} from "@/data/springWeekData";
import { ArrowRight, CheckCircle2, Building2, Users, Award, Flame, CalendarDays } from "lucide-react";

interface SpringWeekWelcomeProps {
  onContinue: () => void;
}

/* ---- Animated counter ---- */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const dur = 1800;
    const start = performance.now();
    (function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    })(start);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{val}{suffix}</>;
}

/* ---- Main SpringWeekWelcome ---- */
export function SpringWeekWelcome({ onContinue }: SpringWeekWelcomeProps) {
  // Get unique firm names from speakers
  const firmNames = [...new Set(SPEAKERS.map((s) => s.firm))];

  return (
    <div className="flex flex-col items-center text-center space-y-7">

      {/* Label */}
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-foreground/60 font-sans border border-emerald-200 rounded-full px-4 py-1.5 bg-emerald-50/80 backdrop-blur-sm">
          <Flame className="w-3.5 h-3.5 text-emerald-500" />
          Live 2-Part Panel Webinar
        </span>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up text-foreground font-sans leading-[1.05] max-w-lg"
        style={{
          fontWeight: 700,
          fontSize: "clamp(26px, 4.5vw, 44px)",
          letterSpacing: "-0.02em",
          animationDelay: "0.1s",
        }}
      >
        Most Students Get Spring Weeks. Few Convert Them.
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm md:text-base text-muted-foreground font-sans font-light max-w-lg leading-relaxed animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        Learn exactly how students at top firms turned 1-2 weeks into{" "}
        <strong className="text-foreground font-medium">return offers</strong> and{" "}
        <strong className="text-foreground font-medium">summer internships</strong>.
        Real strategies from people who actually did it.
      </p>

      {/* Stats row */}
      <div
        className="flex items-center justify-center gap-6 md:gap-10 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          { icon: Building2, value: 25, suffix: "+", label: "Target firms" },
          { icon: CalendarDays, value: 2, suffix: "-Part", label: "Panel" },
          { icon: Award, value: 11, suffix: "+", label: "Real conversions" },
        ].map(({ icon: Icon, value, suffix, label }) => (
          <div key={label} className="flex flex-col items-center">
            <Icon className="h-4 w-4 text-emerald-600/60 mb-1" />
            <span className="text-2xl md:text-3xl font-bold text-foreground font-sans">
              <CountUp target={value} suffix={suffix} />
            </span>
            <span className="text-[10px] text-muted-foreground font-sans font-light mt-0.5">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* What you'll learn */}
      <div
        className="w-full max-w-md text-left space-y-2.5 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What you'll learn
        </p>
        {[
          { text: "How to stand out when everyone's trying to stand out", bonus: false },
          { text: "The exact behaviours that get you remembered (and invited back)", bonus: false },
          { text: "What to say in networking conversations that actually matter", bonus: false },
          { text: "How to follow up after your spring week ends", bonus: false },
          { text: "Common mistakes that kill your chances (and how to avoid them)", bonus: false },
          { text: "Insider tips from panellists who converted at top firms", bonus: true },
        ].map(({ text, bonus }) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-sm text-foreground/80 font-sans font-light leading-snug">
              {text}
              {bonus && (
                <span className="ml-1.5 inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                  Bonus
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Firms covered */}
      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: "0.27s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2 text-left">
          Speakers with experience at
        </p>
        <div className="flex flex-wrap gap-1.5">
          {firmNames.map((firm) => (
            <span
              key={firm}
              className="text-xs font-sans font-medium text-foreground/70 bg-slate-100 border border-slate-200 rounded-full px-3 py-1"
            >
              {firm}
            </span>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: "0.28s" }}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2.5">
          <Users className="h-4 w-4" />
          100+ students attended our last webinar. Students landed interviews at firms they'd been rejected from.
        </div>
      </div>

      {/* Metadata pills - pricing tiers */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="border border-border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm text-sm font-sans font-medium text-foreground shadow-sm">
          Part 1 - £15
        </span>
        <span className="border border-border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm text-sm font-sans font-medium text-foreground shadow-sm">
          Part 2 - £15
        </span>
        <span className="border border-emerald-200 rounded-xl px-4 py-2 bg-emerald-50/60 backdrop-blur-sm text-sm font-sans font-semibold text-foreground shadow-sm">
          Bundle - <span className="text-emerald-600">£29</span>
        </span>
        <span className="border border-amber-200 rounded-xl px-4 py-2 bg-amber-50/60 backdrop-blur-sm text-sm font-sans font-semibold text-foreground shadow-sm">
          Premium - <span className="text-amber-600">£49</span>
        </span>
      </div>

      {/* Live emphasis */}
      <p
        className="text-xs text-foreground/60 font-sans font-medium animate-fade-up"
        style={{ animationDelay: "0.32s" }}
      >
        This is a LIVE 2-part panel webinar - not a recording.
      </p>

      {/* Urgency */}
      <p
        className="text-sm text-amber-600 font-sans font-medium animate-fade-up"
        style={{ animationDelay: "0.34s" }}
      >
        Spring week applications are opening now. Be prepared.
      </p>

      {/* CTA */}
      <div
        className="animate-fade-up flex flex-col items-center gap-2"
        style={{ animationDelay: "0.35s" }}
      >
        <Button
          onClick={onContinue}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-10 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Secure Your Spot
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          Limited spots available for each session
        </span>
      </div>
    </div>
  );
}
