import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, GraduationCap, TrendingUp, CheckCircle2, Play, Users, Flame } from "lucide-react";

interface DaWelcomeStepProps {
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

const PANELLISTS = [
  { name: "Sarah J.", firm: "Goldman Sachs", role: "Software Engineering DA", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "David K.", firm: "Google", role: "Data DA", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Priya M.", firm: "Rolls-Royce", role: "Engineering DA", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Tom H.", firm: "J.P. Morgan", role: "Finance DA", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Aisha R.", firm: "KPMG", role: "Audit DA", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
];

export function DaWelcomeStep({ onContinue }: DaWelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-7">

      {/* Label */}
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-foreground/60 font-sans border border-blue-200 rounded-full px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm">
          <Flame className="w-3.5 h-3.5 text-blue-500" />
          Exclusive Masterclass - 100% Free
        </span>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up text-foreground font-sans leading-[1.05] max-w-2xl"
        style={{
          fontWeight: 700,
          fontSize: "clamp(26px, 4.5vw, 44px)",
          letterSpacing: "-0.02em",
          animationDelay: "0.1s",
        }}
      >
        How to Land a £30k+ Degree Apprenticeship at a Top-Tier Firm
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm md:text-base text-muted-foreground font-sans font-light max-w-xl leading-relaxed animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        Join our exclusive panel featuring 7 successful Degree Apprentices from <strong className="text-foreground font-medium">Goldman Sachs, J.P. Morgan, Rolls-Royce, KPMG, and Google</strong>. Learn the exact frameworks they used to beat thousands of other applicants and secure offers straight out of Sixth Form.
      </p>

      {/* Stats row */}
      <div
        className="flex items-center justify-center gap-6 md:gap-10 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          { icon: Star, value: 7, suffix: "", label: "Top-Tier Panellists" },
          { icon: TrendingUp, value: 95, suffix: "%", label: "Acceptance Tactics" },
          { icon: GraduationCap, value: 0, suffix: "£", label: "Student Debt" },
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
        className="w-full max-w-xl text-left space-y-2.5 animate-fade-up bg-white/50 border border-slate-100 rounded-2xl p-6 shadow-sm"
        style={{ animationDelay: "0.25s" }}
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-3">
          Inside this free masterclass
        </p>
        {[
          { text: "How to perfectly structure your CV when you have effectively 0 corporate work experience", bonus: false },
          { text: "The secret to passing the dreaded online reasoning tests (HireVue, Pymetrics) that eliminate 80% of applicants instantly", bonus: false },
          { text: "The exact Assessment Centre group-exercise strategy employed by a Goldman Sachs apprentice to command the room without being arrogant", bonus: false },
          { text: "The hidden recruitment timeline: Exactly when these firms actually recruit (and when it's too late to apply)", bonus: false },
          { text: "Alternative routes to your dream career that completely bypass the university tuition fee trap", bonus: false },
          { text: "Live Q&A: Get your specific questions answered by current apprentices who just went through the process", bonus: true },
        ].map(({ text, bonus }) => (
          <div key={text} className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
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

      {/* Social proof */}
      <div
        className="w-full animate-fade-up"
        style={{ animationDelay: "0.28s" }}
      >
        <div className="inline-flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2.5">
          <Users className="h-4 w-4" />
          <CountUp target={142} />+ ambitious students have already registered
        </div>
      </div>

      {/* Metadata pills */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="border border-border rounded-xl px-5 py-2.5 bg-white/80 backdrop-blur-sm text-sm font-sans font-medium text-foreground shadow-sm flex items-center gap-1.5">
          <Play className="h-3.5 w-3.5" />
          90 Min Masterclass
        </span>
        <span className="border border-emerald-200 rounded-xl px-5 py-2.5 bg-emerald-50/60 backdrop-blur-sm text-sm font-sans font-semibold text-foreground shadow-sm">
          <span className="line-through text-muted-foreground font-normal">£49 Value</span>{" "}
          <span className="text-emerald-600">Free for Students</span>
        </span>
      </div>

      {/* CTA */}
      <div
        className="animate-fade-up flex flex-col items-center gap-2 pt-2"
        style={{ animationDelay: "0.35s" }}
      >
        <Button
          onClick={onContinue}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-10 py-5 text-base md:text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Claim Free Ticket
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <span className="text-[11px] text-muted-foreground font-sans font-light">
          Takes 30 seconds to register
        </span>
      </div>

      {/* Panellists Section */}
      <div 
        className="w-full pt-10 animate-fade-up border-t border-slate-200 mt-8"
        style={{ animationDelay: "0.4s" }}
      >
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-6">
          Meet your masterclass panel
        </p>
        
        {/* We use grid-cols-2 on mobile, flex on desktop to wrap them naturally */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {PANELLISTS.map((panellist) => (
            <div key={panellist.name} className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform w-[140px] md:w-[150px]">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                <img 
                  src={panellist.image} 
                  alt={panellist.name}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
              </div>
              <h4 className="text-sm font-bold text-foreground font-sans leading-tight">
                {panellist.name}
              </h4>
              <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wide mt-1">
                {panellist.firm}
              </p>
              <p className="text-[9px] text-emerald-600/80 font-sans mt-0.5 font-medium">
                {panellist.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
