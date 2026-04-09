import { useState, useEffect, useRef } from "react";
import {
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
  Clock,
  Users,
  ShieldCheck,
  Star,
  AlertTriangle,
} from "lucide-react";
import {
  SPRING_WEEK_NIGHTS,
  SPRING_WEEK_HANDBOOK,
  SPRING_WEEK_COMBOS,
  getComboKey,
  NIGHT_INDIVIDUAL_PRICE,
  matchFirmsToNights,
  type NightComboKey,
} from "@/data/springWeekData";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface SpringWeekNightPickerProps {
  formData: WebinarFormData;
  onCheckout: (comboKey: NightComboKey, stripeLink: string) => void;
}

// ---- Countdown to Night 1 ----
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

// ---- Animated price display ----
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

  const integer = Math.floor(displayValue);
  const decimal = Math.round((displayValue - integer) * 100).toString().padStart(2, "0");

  return (
    <span>
      £{integer}<span className="text-[0.65em] font-normal">.{decimal}</span>
    </span>
  );
}

// ---- FAQ accordion ----
const FAQ_ITEMS = [
  {
    q: "How long is the panel?",
    a: "About 3 hours. 7+ speakers sharing their conversion stories, followed by a live Q&A where you can ask about your specific firm.",
  },
  {
    q: "Will there be a recording?",
    a: "Yes - the full recording is included with every tier. If you can't make it live, you won't miss out.",
  },
  {
    q: "What if my firm isn't covered?",
    a: "The conversion strategies our speakers share work across every firm and every area of finance. The frameworks are universal.",
  },
  {
    q: "Can I upgrade later?",
    a: "We can't guarantee this. The Prepare and Convert prices are only available during checkout.",
  },
  {
    q: "What's in the Handbook?",
    a: "Firm-by-firm breakdowns for 45+ firms. What the spring week looks like, what the assessment day involves, networking scripts, and conversion tactics.",
  },
  {
    q: "What's the prep call in the Convert tier?",
    a: "A 1-on-1 call with someone who actually converted their spring week at your firm. They'll tell you what to expect, what caught them off guard, and exactly what got them the offer.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. Full refund, no questions asked, up to 48 hours before the event.",
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
        {open ? (
          <ChevronUp className="w-4 h-4 shrink-0 text-white/30" />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0 text-white/30" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm text-white/40 leading-relaxed font-light animate-in fade-in duration-200">
          {a}
        </p>
      )}
    </div>
  );
}

// ---- Tier definitions ----
import {
  SW_TICKETS,
  STRIPE_SW_WATCH,
  STRIPE_SW_PREPARE,
  STRIPE_SW_CONVERT,
  SPEAKERS,
} from "@/data/springWeekData";

type TierId = "watch" | "prepare" | "convert";

const TIERS: { id: TierId; name: string; price: number; tagline: string; features: string[]; badge?: string; recommended?: boolean; stripeLink: string }[] = [
  {
    id: "watch",
    name: "Watch",
    price: 19,
    tagline: "See how they did it",
    features: [
      "Live panel on April 12 + full recording",
      "Hear how students converted at Morgan Stanley, JP Morgan, Jane Street and more",
      "Direct Q&A with the speakers",
    ],
    stripeLink: STRIPE_SW_WATCH,
  },
  {
    id: "prepare",
    name: "Prepare",
    price: 39,
    tagline: "Know what to expect at YOUR firm",
    features: [
      "Everything in Watch",
      "Spring Week Handbook: 45+ firms, phase-by-phase",
      "Firm-specific intel on assessments, conversion rates, and what to expect",
    ],
    badge: "MOST CHOSEN",
    recommended: true,
    stripeLink: STRIPE_SW_PREPARE,
  },
  {
    id: "convert",
    name: "Convert",
    price: 79,
    tagline: "Walk in ready to get the offer",
    features: [
      "Everything in Prepare",
      "1 free prep call with someone who converted at your firm (worth £50)",
      "They tell you what the week is really like and what got them the offer",
    ],
    badge: "BEST VALUE",
    stripeLink: STRIPE_SW_CONVERT,
  },
];

// ---- Main component ----
export function SpringWeekNightPicker({ formData, onCheckout }: SpringWeekNightPickerProps) {
  const [selectedTier, setSelectedTier] = useState<TierId>("prepare");

  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);
  const firstName = formData.firstName;

  const tier = TIERS.find((t) => t.id === selectedTier)!;

  function handleCheckout() {
    onCheckout(selectedTier as unknown as NightComboKey, tier.stripeLink);
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
          One live panel. {SPEAKERS.length} speakers who converted. Every tier includes the full recording.
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

      {/* Tier Cards */}
      <div className="space-y-3">
        {TIERS.map((t) => {
          const isSelected = selectedTier === t.id;
          const accentColor = t.id === "watch" ? "#6366F1" : t.id === "prepare" ? "#10B981" : "#F59E0B";

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              className={[
                "w-full text-left rounded-xl border-2 p-5 transition-all duration-200 relative overflow-hidden cursor-pointer",
                isSelected
                  ? "border-white/20 bg-white/[0.03]"
                  : "border-white/[0.06] bg-transparent hover:border-white/12",
              ].join(" ")}
            >
              {/* Accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-opacity duration-200"
                style={{ backgroundColor: accentColor, opacity: isSelected ? 1 : 0.2 }}
              />

              <div className="pl-3 flex items-start gap-3">
                {/* Radio */}
                <div
                  className={[
                    "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    isSelected ? "bg-emerald-500 border-emerald-500" : "border-white/20",
                  ].join(" ")}
                >
                  {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{t.name}</span>
                    {t.badge && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/50">{t.tagline}</p>
                  <div className="mt-2 space-y-1">
                    {t.features.map((f) => (
                      <div key={f} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
                        <span className="text-[11px] text-white/50 leading-tight">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-white">£{t.price}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="funnel-card rounded-xl p-5 space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              <AnimatedPrice value={tier.price} />
            </div>
            <p className="text-xs text-white/40 mt-1">{tier.name} tier selected</p>
          </div>
          {tier.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-black shrink-0">
              {tier.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99]"
        >
          <Zap className="w-4 h-4" />
          <span>Get {tier.name} for £{tier.price}</span>
        </button>

        <p className="text-center text-[11px] text-white/30 font-light">
          You'll receive your ticket confirmation by email immediately
        </p>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Full refund, no questions asked
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

      {/* FAQ */}
      <div className="funnel-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
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
      <div className="flex items-start gap-3 funnel-card rounded-xl px-4 py-3" style={{ borderColor: "rgba(245,158,11,0.12)" }}>
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-medium text-white/70">
            The live panel is Sunday April 12 at 2pm BST.
          </p>
          <p className="text-xs font-light text-white/40 mt-0.5">
            Spring weeks begin Monday April 13. This is your last chance to prepare with people who converted.
          </p>
        </div>
      </div>
    </div>
  );
}
