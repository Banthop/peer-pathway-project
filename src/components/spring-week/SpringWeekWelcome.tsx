import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SPRING_WEEK_NIGHTS, TARGET_FIRMS } from "@/data/springWeekData";
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
  Calendar,
  TrendingDown,
} from "lucide-react";

interface SpringWeekWelcomeProps {
  onContinue: () => void;
}

/* ---- Countdown to Night 1 ---- */
function useCountdown(targetISO: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return timeLeft;
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
  return (
    <>
      {val}
      {suffix}
    </>
  );
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

/* ---- Night preview card ---- */
function NightPreviewCard({ night }: { night: (typeof SPRING_WEEK_NIGHTS)[number] }) {
  return (
    <div
      className="relative bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-2.5 hover:border-white/20 transition-all"
      style={{ boxShadow: `0 0 20px ${night.accent}10` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ backgroundColor: night.accent }}
      />
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${night.accent}20`, color: night.accent }}
        >
          {night.label}
        </span>
      </div>
      <p className="text-xs text-slate-400 font-sans">{night.date}</p>
      <p className="text-sm font-semibold text-white font-sans">{night.theme}</p>
      <div className="flex flex-wrap gap-1">
        {night.speakers.slice(0, 4).map((s) => (
          <span
            key={s}
            className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full font-sans"
          >
            {s}
          </span>
        ))}
        {night.speakers.length > 4 && (
          <span className="text-[10px] text-slate-500 px-1 font-sans">
            +{night.speakers.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

/* ---- FAQ accordion ---- */
const LANDING_FAQS = [
  {
    q: "How long are the sessions?",
    a: "Each night is approximately 2 hours. 8 speakers at 12 minutes each, plus panel discussion and live Q&A.",
  },
  {
    q: "Will there be recordings?",
    a: "Yes - recordings of all sessions are included with every ticket. If you can't make one live, you won't miss out.",
  },
  {
    q: "What if my firm isn't listed?",
    a: "The conversion strategies our panellists share work across every firm and every area of finance. The frameworks are universal.",
  },
  {
    q: "What's in The Handbook?",
    a: "11 chapters of real insights from real spring weekers. Day-by-day walkthroughs, networking scripts, firm-by-firm breakdowns, and conversion tactics. Written in their own words, not AI-generated.",
  },
  {
    q: "I haven't done a spring week yet. Is this for me?",
    a: "This webinar is specifically about converting spring weeks into return offers. If you haven't secured a spring week yet, this will still give you incredible insight into what firms look for, but it's designed for students who already have one.",
  },
  {
    q: "Can I upgrade later?",
    a: "We can't guarantee this. The bundle price is only available during checkout.",
  },
];

function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full max-w-xl space-y-1.5">
      <div className="flex items-center gap-1.5 mb-3">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold">
          Common Questions
        </span>
      </div>
      {LANDING_FAQS.map((faq, i) => (
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

/* ---- Main SpringWeekWelcome ---- */
export function SpringWeekWelcome({ onContinue }: SpringWeekWelcomeProps) {
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);

  return (
    <div className="flex flex-col items-center text-center space-y-0 -mt-16 md:-mt-20">
      {/* ---- URGENCY STRIP ---- */}
      <div className="w-full max-w-xl mb-8 animate-fade-up">
        <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <p className="text-xs font-sans font-medium text-amber-800">
            Spring weeks start Monday April 13. This is your last chance to prepare.
          </p>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 shrink-0">
            <Clock className="h-3 w-3" />
            {countdown.days}d {String(countdown.hours).padStart(2, "0")}h {String(countdown.minutes).padStart(2, "0")}m
          </div>
        </div>
      </div>

      {/* ---- DARK HERO SECTION ---- */}
      <div className="w-full max-w-xl rounded-2xl bg-slate-950 px-6 py-10 md:py-14 space-y-6 mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        {/* Label */}
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-emerald-400 font-sans border border-emerald-500/30 rounded-full px-4 py-1.5 bg-emerald-500/10">
            <Flame className="w-3.5 h-3.5" />
            Live 3-Night Panel Webinar
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
          You got your spring week.
          <br />
          Now make sure you convert it.
        </h1>

        {/* Shock stat */}
        <div className="flex items-center justify-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-400" />
          <p className="text-sm font-sans font-light text-slate-300">
            Only <span className="text-red-400 font-bold">30-40%</span> of spring weekers get a return offer.
          </p>
        </div>
        <p className="text-sm font-sans font-light text-slate-400 max-w-sm mx-auto">
          The ones who do aren't smarter - they just knew what to expect.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 md:gap-10 pt-2">
          {[
            { icon: Calendar, value: 3, suffix: "", label: "Nights" },
            { icon: Mic2, value: 24, suffix: "+", label: "Speakers" },
            { icon: Building2, value: 25, suffix: "+", label: "Firms covered" },
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

        {/* Primary CTA in hero */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            onClick={onContinue}
            className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-semibold px-10 py-4 text-base rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            size="lg"
          >
            Secure Your Spot - Starting from £19
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <span className="text-[11px] text-slate-500 font-sans font-light">
            Join 150+ students already registered
          </span>
        </div>
      </div>

      {/* ---- SOCIAL PROOF BAR ---- */}
      <div
        className="w-full max-w-xl space-y-2 mb-8 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-start gap-2.5 bg-white border border-border rounded-xl px-4 py-3">
            <Users className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="text-xs font-sans font-light text-foreground/80 leading-relaxed text-left">
              Students from <strong className="font-medium">LSE, Warwick, UCL, Imperial, Bristol, Oxford & Cambridge</strong>
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

      {/* ---- 3-NIGHT PREVIEW CARDS ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-3 text-left">
          3 Nights, 3 Themes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SPRING_WEEK_NIGHTS.map((night) => (
            <NightPreviewCard key={night.id} night={night} />
          ))}
        </div>
      </div>

      {/* ---- WHAT YOU'LL WALK AWAY WITH ---- */}
      <div
        className="w-full max-w-xl text-left space-y-2.5 mb-8 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What you will walk away with
        </p>
        {[
          "Exactly what to expect during your spring week - day by day, firm by firm",
          "How to network without being awkward (scripts from people who actually did it)",
          "The assessment centre strategies that got them return offers",
          "What NOT to do - the mistakes that cost students their offers",
          "Direct Q&A with speakers - ask anything about your specific firm",
          "Recordings of all sessions (if you can't make one live)",
        ].map((text) => (
          <div key={text} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-sm text-foreground/80 font-sans font-light leading-snug">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* ---- WHY THIS WEEKEND ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-5 py-4 text-left space-y-2">
          <p className="text-xs font-sans font-semibold text-amber-800 uppercase tracking-wider">
            Why this weekend?
          </p>
          <p className="text-sm font-sans font-light text-amber-900 leading-relaxed">
            Spring weeks start <strong className="font-semibold">Monday April 13</strong>.
            Assessment centres happen on the <strong className="font-semibold">last day</strong>.
            That means you need conversion strategies <em>before</em> you walk in - not after.
          </p>
          <p className="text-sm font-sans font-light text-amber-800 leading-relaxed">
            This is the only weekend you can prepare with people who actually converted.
          </p>
        </div>
      </div>

      {/* ---- FROM OUR LAST WEBINAR ---- */}
      <div
        className="w-full max-w-xl mb-8 animate-fade-up"
        style={{ animationDelay: "0.27s" }}
      >
        <div className="bg-slate-900 rounded-2xl px-6 py-5 text-left space-y-3">
          <p className="text-[10px] uppercase tracking-wider font-sans font-semibold text-slate-400">
            From our last webinar
          </p>
          <p className="text-white font-sans font-light text-sm leading-relaxed">
            <span className="text-emerald-400 font-semibold">100+ students attended</span> our cold email masterclass.
            Students landed opportunities at firms they had previously been rejected from.
            You learned how to get in the door.
          </p>
          <p className="text-slate-300 font-sans font-light text-sm leading-relaxed">
            Now learn how to stay in the room.
          </p>
        </div>
      </div>

      {/* ---- PRICING OVERVIEW ---- */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-fade-up"
        style={{ animationDelay: "0.29s" }}
      >
        <span className="border border-border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm text-sm font-sans font-medium text-foreground shadow-sm">
          Single Night - £19
        </span>
        <span className="border border-border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm text-sm font-sans font-medium text-foreground shadow-sm">
          Two Nights - £34.99
        </span>
        <span className="border border-emerald-200 rounded-xl px-4 py-2 bg-emerald-50/60 backdrop-blur-sm text-sm font-sans font-semibold text-foreground shadow-sm">
          All 3 Nights - <span className="text-emerald-600">£49.99</span>
        </span>
        <span className="border border-amber-200 rounded-xl px-4 py-2 bg-amber-50/60 backdrop-blur-sm text-sm font-sans font-semibold text-foreground shadow-sm">
          3 Nights + Handbook - <span className="text-amber-600">£70</span>
        </span>
      </div>

      {/* ---- RISK REVERSAL ---- */}
      <div
        className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-6 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <Shield className="h-3.5 w-3.5 text-emerald-600" />
        <span>Not what you expected? Full refund, no questions asked.</span>
      </div>

      {/* ---- BOTTOM CTA ---- */}
      <div
        className="animate-fade-up flex flex-col items-center gap-2 mb-8"
        style={{ animationDelay: "0.31s" }}
      >
        <Button
          onClick={onContinue}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-semibold px-10 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          I Want to Be Prepared
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          No spam. We'll only email you about the webinar.
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-full max-w-xl border-t border-border animate-fade-up pt-2 mb-6"
        style={{ animationDelay: "0.32s" }}
      />

      {/* FAQ section */}
      <div
        className="w-full animate-fade-up mb-4"
        style={{ animationDelay: "0.33s" }}
      >
        <LandingFAQ />
      </div>

      <div className="h-4" />
    </div>
  );
}
