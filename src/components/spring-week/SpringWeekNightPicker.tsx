import { useState, useEffect, useRef } from "react";
import {
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  Play,
  Phone,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import {
  SPRING_WEEK_NIGHTS,
  type NightComboKey,
} from "@/data/springWeekData";
import type { WebinarFormData } from "@/hooks/useWebinarForm";
import { SPEAKERS } from "@/data/springWeekData";
import { DEFAULT_TIERS } from "@/data/partnerConfig";

interface SpringWeekNightPickerProps {
  formData: WebinarFormData;
  onCheckout: (comboKey: NightComboKey, stripeLink: string) => void;
}

// ---- Countdown ----
function useCountdown(targetISO: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
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

// ---- Animated price ----
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
      else { setDisplayValue(end); prevRef.current = end; }
    }
    requestAnimationFrame(step);
  }, [value]);
  const integer = Math.floor(displayValue);
  const decimal = Math.round((displayValue - integer) * 100).toString().padStart(2, "0");
  return (
    <span>
      {"\u00A3"}{integer}<span className="text-[0.65em] font-normal">.{decimal}</span>
    </span>
  );
}

// ---- FAQ ----
const FAQ_ITEMS = [
  {
    q: "Will there be a recording?",
    a: "Yes. The full recording is included with every tier and you'll have lifetime access. Watch it live, rewatch it before your spring week, or come back to it anytime. If you can't make it on Sunday, you won't miss anything.",
  },
  {
    q: "What's in the Handbook?",
    a: "The Spring Week Conversion Handbook covers 45+ firms with insider breakdowns from students who actually converted. For each firm, you get: what the programme looks like day by day, what the assessment centre involves, how networking works, what they're really looking for, and the mistakes that cost other students their offers. It's organised by division (Investment Banking, Global Markets, Trading, Big 4, and more) so you can jump straight to your target firm. New firms are being added constantly, and if yours isn't covered yet, you can request it and we'll add it within hours.",
  },
  {
    q: "What's the 1-on-1 prep call in Convert?",
    a: "A private 30-minute call with a student who completed and converted their spring week at your specific firm. They'll walk you through exactly what to expect day by day, cover the assessment format and what they're really looking for, give you a personalised networking strategy (who to talk to, when, and what to say), and help you feel fully prepared before you walk in. Think of it as having a mentor who's already been through the exact process at your firm. You'll be matched based on the firm and division you're targeting.",
  },
  {
    q: "What if my firm isn't covered?",
    a: "The conversion strategies our speakers share work across every firm and every area of finance. The networking, assessment centre, and follow-up strategies work at every firm. Plus, the Handbook is being updated constantly. If your specific firm isn't in there yet, request it and we'll source someone who converted there and add their insights within hours.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. Full refund if it's not for you. Just email us and we'll process it. We'd rather you try it risk-free than wonder what you missed.",
  },
  {
    q: "How long is the panel?",
    a: "About 1.5 hours of focused conversion strategies from 7+ speakers, followed by a live Q&A where you can ask about your specific firm. It's designed to be dense and actionable, not a lecture.",
  },
  {
    q: "Can I upgrade later?",
    a: "We can't guarantee these prices will be available after checkout. The Prepare and Convert tiers are priced for this launch and may increase. If you're considering the Handbook or a prep call, it's best to get it now.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
      >
        {q}
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-white/70" /> : <ChevronDown className="w-4 h-4 shrink-0 text-white/70" />}
      </button>
      {open && <p className="pb-4 text-sm text-white/70 leading-relaxed font-light animate-in fade-in duration-200">{a}</p>}
    </div>
  );
}

// ---- Webinar includes accordion ----
function WebinarIncludes() {
  const [open, setOpen] = useState(false);
  const items = [
    "Full 1.5-hour live panel with 7 speakers who converted",
    "Live Q&A where you can ask about your specific firm",
    "Lifetime access to the recording",
    "Free resources and frameworks shared during the session",
  ];
  return (
    <div className="funnel-card rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left cursor-pointer"
      >
        <span className="text-sm font-medium text-white/70">What's included in the webinar?</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/70" /> : <ChevronDown className="w-4 h-4 text-white/70" />}
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-2 animate-in fade-in duration-200">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
              <span className="text-xs text-white/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Handbook preview embed ----
function HandbookPreview() {
  return (
    <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
        The Spring Week Conversion Handbook
      </p>
      <p className="text-xs text-white/80 leading-relaxed">
        This is the most detailed spring week preparation resource available anywhere.
      </p>
      <p className="text-xs text-white/70 leading-relaxed">
        Covering 45+ firms with insider breakdowns from students who actually converted.
        This is not generic careers advice - it's real, specific intel from people who
        were in your seat last year.
      </p>
      <p className="text-xs text-white/70 leading-relaxed">
        Use it alongside the live panel to go deeper on your target firm.
      </p>
      {/* Mini handbook mockup */}
      <div className="rounded-lg bg-black/40 border border-white/[0.06] p-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Bank of America Spring Week</p>
        <p className="text-[11px] text-white/70 leading-snug italic">
          "I was in the global payment solutions and credit divisions. On the first day, it was very much trying to get us to understand how the bank makes money and how the bank operates. Second and third day would be spending the entire day with your first preference, then your second preference..."
        </p>
      </div>
      <p className="text-[10px] text-white/70 text-center">Preview of the Bank of America section - tap to expand</p>
      <a
        href="/handbook"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors no-underline"
      >
        See what's inside the Handbook
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

// ---- Prep call embed ----
function PrepCallPreview() {
  return (
    <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-emerald-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          30-minute 1-on-1 prep call
        </p>
      </div>
      <p className="text-xs text-white/80 leading-relaxed">
        A private 30-minute call with a speaker who completed and converted their spring week
        at your target firm. They'll walk you through exactly what to expect - day by day -
        and give you tailored advice for your specific situation, your firm's culture, and your goals.
      </p>
      <div className="space-y-2">
        {[
          "Matched to a speaker who converted at your specific firm",
          "Covers your week's schedule, the assessment format, and what they're really looking for",
          "Personalised networking strategy - who to talk to, when, and what to say",
          "Conducted before your conversion so you walk in fully prepared",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
            <span className="text-xs text-white/80 leading-snug">{item}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-white/70 italic">
        This is the closest thing to having a mentor who's already been through it.
      </p>
    </div>
  );
}

// ---- Feature line with optional highlight ----
function FeatureLine({ text }: { text: string }) {
  // Highlight specific phrases in emerald
  const highlights = ["Lifetime access", "free resources"];
  let parts: Array<{ text: string; highlight: boolean }> = [{ text, highlight: false }];
  for (const hl of highlights) {
    const newParts: typeof parts = [];
    for (const part of parts) {
      if (part.highlight) { newParts.push(part); continue; }
      const idx = part.text.indexOf(hl);
      if (idx === -1) { newParts.push(part); continue; }
      if (idx > 0) newParts.push({ text: part.text.slice(0, idx), highlight: false });
      newParts.push({ text: hl, highlight: true });
      if (idx + hl.length < part.text.length) newParts.push({ text: part.text.slice(idx + hl.length), highlight: false });
    }
    parts = newParts;
  }

  return (
    <div className="flex items-start gap-2">
      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
      <span className="text-xs md:text-sm text-white/80 leading-snug">
        {parts.map((p, i) =>
          p.highlight ? <span key={i} className="text-emerald-400 font-medium">{p.text}</span> : <span key={i}>{p.text}</span>
        )}
      </span>
    </div>
  );
}

// ---- Tier card content renderers ----
function WatchContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <FeatureLine text="Full 1.5-hour live panel recording" />
        <FeatureLine text="Hear how students converted at JP Morgan, Jane Street, Evercore and more" />
        <FeatureLine text="Direct Q&A with the speakers" />
        <FeatureLine text="Lifetime access to the recording - watch anytime, anywhere" />
        <FeatureLine text="Extra free resources included" />
      </div>
      <p className="text-xs text-emerald-400 font-medium cursor-pointer hover:text-emerald-300 transition-colors">
        Upgrade to Prepare for the Handbook &rarr;
      </p>
    </div>
  );
}

function PrepareContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <FeatureLine text="Full 1.5-hour live panel recording" />
        <FeatureLine text="Hear how students converted at JP Morgan, Jane Street, Evercore and more" />
        <FeatureLine text="Direct Q&A with the speakers" />
        <FeatureLine text="Lifetime access to the recording - watch anytime, anywhere" />
        <FeatureLine text="Extra free resources included" />
      </div>
      <div className="flex items-start gap-2">
        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
        <span className="text-xs md:text-sm text-white/80 leading-snug">
          <span className="text-white font-semibold">The Spring Week Conversion Handbook</span> - get access instantly, and apply the strategies while you watch
        </span>
      </div>
      <HandbookPreview />
    </div>
  );
}

function ConvertContent() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-white/70 font-medium">Everything in Prepare, plus:</p>
      <PrepCallPreview />
    </div>
  );
}

// ---- Main component ----
export function SpringWeekNightPicker({ formData, onCheckout }: SpringWeekNightPickerProps) {
  const [selectedTier, setSelectedTier] = useState("prepare");
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);
  const firstName = formData.firstName;
  const currentTier = DEFAULT_TIERS.find((t) => t.id === selectedTier) ?? DEFAULT_TIERS[1];

  function handleCheckout() {
    onCheckout(currentTier.id as unknown as NightComboKey, currentTier.stripeLink);
  }

  const tierContentMap: Record<string, React.ReactNode> = {
    watch: <WatchContent />,
    prepare: <PrepareContent />,
    convert: <ConvertContent />,
  };

  const tierTaglines: Record<string, string> = {
    watch: "Full 1.5-hour panel - watch live or anytime after",
    prepare: "Everything in Watch, plus the complete handbook that covers 45+ firms",
    convert: "Walk in ready to get the offer",
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Step 4 of 4</p>
        <h1 className="text-2xl md:text-[28px] font-bold text-white leading-tight tracking-tight">
          {firstName ? `Choose your tier, ${firstName}` : "Choose your tier"}
        </h1>
        <p className="text-sm text-white/70 font-light max-w-md mx-auto">
          One live panel. {SPEAKERS.length} speakers who converted. Every tier includes the full recording.
        </p>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-3 funnel-card rounded-xl px-5 py-3">
        <Clock className="w-3.5 h-3.5 text-white/25 shrink-0" />
        <p className="text-xs text-white/70">Live panel starts in</p>
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          {countdown.days > 0 && <span>{countdown.days}d</span>}
          <span>{String(countdown.hours).padStart(2, "0")}h</span>
          <span>{String(countdown.minutes).padStart(2, "0")}m</span>
          <span>{String(countdown.seconds).padStart(2, "0")}s</span>
        </div>
      </div>

      {/* Social proof row */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70 bg-white/[0.04] rounded-full px-3 py-1.5">
            <Clock className="w-3 h-3 text-white/70" />
            +1.5 hours of conversion strategies
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70 bg-white/[0.04] rounded-full px-3 py-1.5">
            <Users className="w-3 h-3 text-white/70" />
            20+ students have already purchased
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70">
            <Play className="w-3 h-3 text-white/70" />
            Full recording included
          </span>
        </div>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full px-3 py-1">
            78% of students choose Prepare
          </span>
        </div>
      </div>

      {/* Webinar includes accordion */}
      <WebinarIncludes />

      {/* Tier Cards */}
      <div className="space-y-4">
        {DEFAULT_TIERS.map((t) => {
          const isSelected = selectedTier === t.id;
          const isPrepare = t.id === "prepare";
          const isWatch = t.id === "watch";

          return (
            <div key={t.id} className="relative">
              {/* Most popular badge for prepare */}
              {isPrepare && (
                <div className="flex justify-center -mb-3 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-500 px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedTier(t.id)}
                className={[
                  "w-full text-left rounded-2xl border-2 p-6 md:p-7 transition-all duration-200 relative overflow-hidden cursor-pointer",
                  isSelected
                    ? isPrepare
                      ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                      : "border-white/20 bg-white/[0.04]"
                    : "border-white/[0.06] bg-transparent hover:border-white/12",
                ].join(" ")}
              >
                {/* Accent strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-opacity duration-200"
                  style={{ backgroundColor: t.accent, opacity: isSelected ? 1 : 0.25 }}
                />

                <div className="pl-4 space-y-3">
                  {/* Badge row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {isWatch && (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                          24% OFF
                        </span>
                        <span className="text-[10px] font-medium text-emerald-400">
                          Valid for next 12 hours only
                        </span>
                      </>
                    )}
                    {isPrepare && (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                          Best Value
                        </span>
                        <span className="text-[10px] font-medium text-emerald-400">
                          This week only
                        </span>
                      </>
                    )}
                  </div>

                  {/* Name + price row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        {/* Radio */}
                        <div
                          className={[
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                            isSelected ? "bg-emerald-500 border-emerald-500" : "border-white/20",
                          ].join(" ")}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </div>
                        <span className="text-base md:text-lg font-bold text-white">{t.name}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/80 pl-[34px]">
                        {tierTaglines[t.id] ?? t.tagline}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {isWatch && (
                        <p className="text-xs text-white/70 line-through">{"\u00A3"}25</p>
                      )}
                      <p className="text-xl md:text-2xl font-bold text-white">{"\u00A3"}{t.price}</p>
                    </div>
                  </div>

                  {/* Tier content always visible */}
                  <div className="pl-[34px] pt-2">
                    {tierContentMap[t.id]}
                  </div>

                  {/* Scarcity for convert */}
                  {t.limited && (
                    <div className="flex items-center gap-1.5 pl-[34px]">
                      <AlertTriangle className="w-3 h-3 text-emerald-400" />
                      <span className="text-[11px] font-semibold text-emerald-400">
                        Only {t.limited} spots left
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="funnel-card rounded-xl p-5 space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              <AnimatedPrice value={currentTier.price} />
            </div>
            <p className="text-xs text-white/70 mt-1">{currentTier.name} tier selected</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99]"
        >
          <Zap className="w-4 h-4" />
          <span>Get {currentTier.name} for {"\u00A3"}{currentTier.price}</span>
        </button>

        {/* Social proof under CTA */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-white/70">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            78% of students choose Prepare
          </span>
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            Includes full recording forever
          </span>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-white/70">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Full refund if not satisfied
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Secure Stripe checkout
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div className="funnel-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Frequently asked questions
          </p>
        </div>
        <div className="px-5">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Urgency footer */}
      <div className="flex items-start gap-3 funnel-card rounded-xl px-4 py-3" style={{ borderColor: "rgba(16,185,129,0.12)" }}>
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-white/70">
            The live panel is Sunday April 12 at 7pm BST.
          </p>
          <p className="text-xs font-light text-white/70 mt-0.5">
            Spring weeks start the next morning. This is the last weekend to prepare.
          </p>
        </div>
      </div>
    </div>
  );
}
