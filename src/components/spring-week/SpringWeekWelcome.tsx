import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SPEAKERS } from "@/data/springWeekData";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award,
  Flame,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

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

/* ---- Speaker card ---- */
function SpeakerCard({ firm, note }: { firm: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-white border border-border rounded-xl px-4 py-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        <Building2 className="h-4 w-4 text-slate-500" />
      </div>
      <div className="text-center">
        <p className="text-sm font-sans font-semibold text-foreground leading-tight">
          Speaker TBC
        </p>
        <p className="text-xs font-sans font-medium text-muted-foreground mt-0.5">
          {firm}
        </p>
        {note && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---- FAQ accordion ---- */
const LANDING_FAQS = [
  {
    q: "What if I can only attend one part?",
    a: "No problem. You can buy individual tickets for Part 1 or Part 2 at £15 each. Each part covers different firms and different speakers, so both are worth attending. The Bundle saves you money and gives you both parts plus The Spring Week Playbook.",
  },
  {
    q: "Will there be a recording?",
    a: "Yes. All ticket holders get the full recording of their session within 24 hours of the live event. You can watch it back as many times as you need.",
  },
  {
    q: "What is The Spring Week Playbook?",
    a: "A written guide where each speaker shares their complete spring week experience: what the programme actually involved, insider tips you won't find on forums, the interview and assessment process, how they converted into a return offer or summer internship, and the mistakes to avoid. Included with the Bundle and Premium tiers.",
  },
  {
    q: "Can I book a speaker for 1-on-1 coaching?",
    a: "Premium ticket holders get a private coaching session with one of the panellists as part of their package. If you buy a lower tier and want to upgrade after, you can do that after purchase.",
  },
  {
    q: "What firms are covered?",
    a: "Our confirmed speakers have experience at: " + SPEAKERS.map((s) => s.firm).join(", ") + ". We are continuing to add speakers from Goldman Sachs, JPMorgan, Deutsche Bank, UBS, Lazard, Rothschild, Evercore, and others.",
  },
  {
    q: "I have not done a spring week yet. Is this for me?",
    a: "This webinar is specifically about converting spring weeks into return offers and summer internships. If you have not secured a spring week yet, check out our cold email webinar first. That covers how to land the opportunity. Come back here once you have it.",
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
  // Get unique firm names from speakers
  const firmNames = [...new Set(SPEAKERS.map((s) => s.firm))];

  return (
    <div className="flex flex-col items-center text-center space-y-8">

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

      {/* Social proof from cold email webinar */}
      <div
        className="w-full max-w-lg animate-fade-up"
        style={{ animationDelay: "0.22s" }}
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

      {/* What you'll learn */}
      <div
        className="w-full max-w-md text-left space-y-2.5 animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
          What you will learn
        </p>
        {[
          { text: "How to stand out when everyone's trying to stand out", bonus: false },
          { text: "The exact behaviours that get you remembered and invited back", bonus: false },
          { text: "What to say in networking conversations that actually matter", bonus: false },
          { text: "How to follow up after your spring week ends", bonus: false },
          { text: "Common mistakes that kill your chances and how to avoid them", bonus: false },
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

      {/* Meet Your Speakers */}
      <div
        className="w-full max-w-xl animate-fade-up"
        style={{ animationDelay: "0.27s" }}
      >
        <div className="text-left mb-3 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold">
            Meet your speakers
          </p>
          <p className="text-xs text-muted-foreground font-sans font-light">
            Real students who completed spring weeks and converted into return offers or summer internships.
            Speaker names will be announced once confirmed.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SPEAKERS.map((speaker) => (
            <SpeakerCard
              key={speaker.firm}
              firm={speaker.firm}
              note={speaker.note}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground font-sans font-light text-left">
          More speakers being confirmed. Final lineup announced to registered attendees first.
        </p>
      </div>

      {/* Firms covered */}
      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: "0.29s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2 text-left">
          Speaker experience at
        </p>
        <div className="flex flex-wrap gap-1.5 justify-start">
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

      {/* Social proof pill */}
      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-start gap-2.5 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5">
          <Users className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-sans font-light text-sm text-emerald-800 leading-relaxed">
            Our speakers converted spring weeks into return offers at Goldman, Citi, Barclays and more. These are not coaches who read about it. They did it.
          </span>
        </div>
      </div>

      {/* Pricing tiers */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 animate-fade-up"
        style={{ animationDelay: "0.31s" }}
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
        This is a LIVE 2-part panel webinar. Not a recording.
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

      {/* Divider */}
      <div
        className="w-full max-w-xl border-t border-border animate-fade-up pt-2"
        style={{ animationDelay: "0.36s" }}
      />

      {/* FAQ section */}
      <div
        className="w-full animate-fade-up"
        style={{ animationDelay: "0.37s" }}
      >
        <LandingFAQ />
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
