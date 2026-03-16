import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WEBINAR_TITLE,
  WEBINAR_DATE,
  WEBINAR_TIME,
  WEBINAR_TARGET_DATE,
} from "@/data/webinarData";
import { ArrowRight, Mail, Users, TrendingUp, CheckCircle2, Clock } from "lucide-react";

interface WelcomeStepProps {
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

/* ---- Countdown Timer ---- */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(WEBINAR_TARGET_DATE).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    }
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3">
      {[
        { val: timeLeft.days, label: "days" },
        { val: timeLeft.hours, label: "hrs" },
        { val: timeLeft.minutes, label: "min" },
        { val: timeLeft.seconds, label: "sec" },
      ].map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-bold text-foreground font-sans tabular-nums bg-white/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 min-w-[52px] text-center shadow-sm">
            {String(val).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground font-sans font-light mt-1 uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---- Main WelcomeStep ---- */
export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-7">

      {/* Label */}
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-foreground/60 font-sans border border-border rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          Live Webinar
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
        {WEBINAR_TITLE}
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm md:text-base text-muted-foreground font-sans font-light max-w-lg leading-relaxed animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        A 90-minute live breakdown of the exact cold emailing framework that
        generated a <strong className="text-foreground font-medium">21% response rate</strong> and
        turned blank inboxes into real internship offers. Real emails. Real screenshots. Real results.
      </p>

      {/* Stats row */}
      <div
        className="flex items-center justify-center gap-6 md:gap-10 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          { icon: Mail, value: 20, suffix: "+", label: "Offers landed" },
          { icon: TrendingUp, value: 21, suffix: "%", label: "Response rate" },
          { icon: Users, value: 50, suffix: "+", label: "Emails / day" },
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
        className="w-full max-w-md text-left space-y-2 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What you'll walk away with
        </p>
        {[
          { text: "How to find decision-maker emails at any firm using Apollo", bonus: false },
          { text: "The exact email template that gets replies (not LinkedIn fluff)", bonus: false },
          { text: "A live demo of the full mail-merge send process", bonus: false },
          { text: "How to handle rejections and turn them into opportunities", bonus: false },
          { text: "A follow-up system that keeps your pipeline alive", bonus: false },
          { text: "Resource pack: spreadsheet template, email template, and firm list", bonus: true },
        ].map(({ text, bonus }) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-sm text-foreground/80 font-sans font-light leading-snug">
              <strong className="font-medium text-foreground">{text.split(" ").slice(0, 3).join(" ")}</strong>{" "}
              {text.split(" ").slice(3).join(" ")}
              {bonus && (
                <span className="ml-1.5 inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                  Bonus
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Countdown timer */}
      <div
        className="w-full max-w-md animate-fade-up space-y-2"
        style={{ animationDelay: "0.28s" }}
      >
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-sans font-medium">
          <Clock className="h-3.5 w-3.5" />
          Webinar starts in
        </div>
        <CountdownTimer />
      </div>

      {/* Metadata pills */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground font-sans animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="border border-border rounded-full px-3 py-1 bg-white/80 backdrop-blur-sm">
          {WEBINAR_DATE}
        </span>
        <span className="border border-border rounded-full px-3 py-1 bg-white/80 backdrop-blur-sm">
          {WEBINAR_TIME}
        </span>
        <span className="border border-border rounded-full px-3 py-1 bg-white/80 backdrop-blur-sm">
          90 min
        </span>
        <span className="border border-border rounded-full px-3 py-1 bg-white/80 backdrop-blur-sm font-medium text-foreground">
          From <span className="line-through text-muted-foreground">£19</span>{" "}
          <span className="text-emerald-600 font-semibold">£10</span>
        </span>
      </div>

      {/* Scarcity text */}
      <p
        className="text-sm text-amber-600 font-sans font-medium animate-fade-up"
        style={{ animationDelay: "0.34s" }}
      >
        Spots are limited
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
          Claim My Spot
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          Takes 30 seconds to register
        </span>
      </div>
    </div>
  );
}
