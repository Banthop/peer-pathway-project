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
    q: "Can I upgrade later?",
    a: "We can't guarantee this. The bundle price is only available during checkout.",
  },
  {
    q: "What's in the Handbook?",
    a: "11 chapters of real insights from real spring weekers. Day-by-day walkthroughs, networking scripts, firm-by-firm breakdowns, and conversion tactics. Written in their own words.",
  },
  {
    q: "Is this worth it if I only have one spring week?",
    a: "Absolutely. Even Night 3 alone (The Conversion Masterclass) covers assessment centres and follow-up tactics that apply to every firm.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes - full refunds available up to 48 hours before Night 1. After that, we can transfer your ticket to a future event.",
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

// ---- Main component ----
export function SpringWeekNightPicker({ formData, onCheckout }: SpringWeekNightPickerProps) {
  const [selectedNights, setSelectedNights] = useState<Array<"1" | "2" | "3">>(["1", "2", "3"]);
  const [addHandbook, setAddHandbook] = useState(false);
  const [flashNight, setFlashNight] = useState<string | null>(null);
  const [handbookPulse, setHandbookPulse] = useState(false);

  const comboKey = getComboKey(selectedNights, addHandbook);
  const combo = comboKey ? SPRING_WEEK_COMBOS[comboKey] : null;
  const price = combo?.price ?? 0;

  const individualTotal =
    selectedNights.length * NIGHT_INDIVIDUAL_PRICE +
    (addHandbook ? SPRING_WEEK_HANDBOOK.standalonePrice : 0);
  const savings = individualTotal - price;
  const showSavings = savings > 0.5;

  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);
  const firstName = formData.firstName;
  const firmMatches = matchFirmsToNights(formData.springWeekFirms);

  function toggleNight(id: "1" | "2" | "3") {
    setSelectedNights((prev) => {
      if (prev.includes(id)) {
        setFlashNight(id);
        setTimeout(() => setFlashNight(null), 600);
        return prev.filter((n) => n !== id);
      }
      return [...prev, id].sort() as Array<"1" | "2" | "3">;
    });
  }

  function toggleHandbook() {
    setAddHandbook((prev) => {
      if (!prev) {
        setHandbookPulse(true);
        setTimeout(() => setHandbookPulse(false), 600);
      }
      return !prev;
    });
  }

  function handleCheckout() {
    if (!comboKey || !combo) return;
    onCheckout(comboKey, combo.stripeLink);
  }

  const isAllNights = selectedNights.length === 3;
  const hasSelection = selectedNights.length > 0 || addHandbook;

  const ctaLabel = !hasSelection
    ? "Select at least one night"
    : selectedNights.length === 0
    ? `Get The Handbook - £${price}`
    : selectedNights.length === 1
    ? `Get Night ${selectedNights[0]} Ticket - £${price}`
    : isAllNights && addHandbook
    ? `Get Complete Pack - £${price}`
    : isAllNights
    ? `Get 3-Night Pass - £${price % 1 === 0 ? price : price.toFixed(2)}`
    : `Get ${selectedNights.length}-Night Pass - £${price % 1 === 0 ? price : price.toFixed(2)}`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Step 4 of 4
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-white leading-tight tracking-tight">
          {firstName
            ? `Here's what we recommend, ${firstName}`
            : "Choose your nights"}
        </h1>
        <p className="text-sm text-white/40 font-light max-w-md mx-auto">
          Each night features different speakers from different firms. Most students take all three.
        </p>
      </div>

      {/* Personalised recommendation */}
      {firmMatches.length > 0 && (
        <div className="funnel-card rounded-xl px-4 py-3 animate-in fade-in duration-300" style={{ borderColor: "rgba(52,211,153,0.15)" }}>
          <p className="text-sm text-white/70">
            {firmMatches.map((m) => (
              <span key={m.firm}>
                <strong className="font-semibold text-emerald-400">{m.firm}</strong> is featured on{" "}
                <strong className="font-semibold text-white/80">{m.nightLabel}</strong>.{" "}
              </span>
            ))}
            <span className="font-light text-white/50">
              We recommend the 3-night pass so you don't miss any relevant content.
            </span>
          </p>
        </div>
      )}

      {/* Countdown */}
      <div className="flex items-center justify-center gap-3 funnel-card rounded-xl px-5 py-3">
        <Clock className="w-3.5 h-3.5 text-white/25 shrink-0" />
        <p className="text-xs text-white/40">Night 1 starts in</p>
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          {countdown.days > 0 && <span>{countdown.days}d</span>}
          <span>{String(countdown.hours).padStart(2, "0")}h</span>
          <span>{String(countdown.minutes).padStart(2, "0")}m</span>
          <span>{String(countdown.seconds).padStart(2, "0")}s</span>
        </div>
      </div>

      {/* Night Cards */}
      <div className="space-y-3">
        {SPRING_WEEK_NIGHTS.map((night) => {
          const isSelected = selectedNights.includes(night.id);
          const isFlashing = flashNight === night.id;
          const hasFirmMatch = firmMatches.some((m) => m.nightId === night.id);

          return (
            <button
              key={night.id}
              type="button"
              onClick={() => toggleNight(night.id)}
              className={[
                "w-full text-left rounded-xl border-2 p-4 transition-all duration-200 relative overflow-hidden cursor-pointer",
                isFlashing
                  ? "border-red-500/50 bg-red-500/[0.04]"
                  : isSelected
                  ? "border-white/20 bg-white/[0.03]"
                  : "border-white/[0.06] bg-transparent hover:border-white/12",
              ].join(" ")}
            >
              {/* Accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-opacity duration-200"
                style={{
                  backgroundColor: night.accent,
                  opacity: isSelected ? 1 : 0.2,
                }}
              />

              <div className="pl-3 flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={[
                    "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    isSelected ? "bg-emerald-500 border-emerald-500" : "border-white/20",
                    isFlashing ? "border-red-400" : "",
                  ].join(" ")}
                >
                  {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${night.accent}18`,
                        color: night.accent,
                      }}
                    >
                      {night.label}
                    </span>
                    <span className="text-[11px] text-white/30">
                      {night.date}
                    </span>
                    {hasFirmMatch && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        YOUR FIRM
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-white">{night.theme}</p>
                  <p className="mt-0.5 text-xs text-white/40">{night.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {night.speakers.slice(0, 5).map((firm) => (
                      <span
                        key={firm}
                        className="text-[11px] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full text-white/50"
                      >
                        {firm}
                      </span>
                    ))}
                    {night.speakers.length > 5 && (
                      <span className="text-[11px] bg-white/[0.04] px-2 py-0.5 rounded-full text-white/30">
                        + more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">£{NIGHT_INDIVIDUAL_PRICE}</p>
                  <p className="text-[10px] text-white/30">per night</p>
                </div>
              </div>

              {/* Deselect warning */}
              {isFlashing && (
                <div className="mt-2 pl-4 text-[11px] text-red-400 font-medium animate-in fade-in duration-100">
                  You're missing out on {night.theme} speakers
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Handbook Add-on */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={toggleHandbook}
          className={[
            "w-full text-left rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer",
            addHandbook
              ? "border-amber-500/30 bg-amber-500/[0.04]"
              : handbookPulse
              ? "border-amber-500/20"
              : "border-dashed border-amber-500/15 hover:border-amber-500/25",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                addHandbook ? "bg-amber-500 border-amber-500" : "border-amber-500/30",
              ].join(" ")}
            >
              {addHandbook && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10">
                  Add-on
                </span>
                {isAllNights && !addHandbook && (
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {SPRING_WEEK_HANDBOOK.title}
              </p>
              <p className="mt-0.5 text-xs text-white/40">
                11 chapters written by real spring weekers. Firm-by-firm breakdowns, networking scripts, conversion tactics.
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {SPRING_WEEK_HANDBOOK.features.map((f) => (
                  <div key={f} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 mt-0.5 shrink-0 text-amber-400" strokeWidth={2.5} />
                    <span className="text-[11px] text-white/40 leading-tight">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-white">
                +£{SPRING_WEEK_HANDBOOK.standalonePrice}
              </p>
              <p className="text-[10px] text-white/30">one-off</p>
            </div>
          </div>
        </button>
      </div>

      {/* Price Summary */}
      <div className="funnel-card rounded-xl p-5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Your selection
        </p>

        {(selectedNights.length > 0 || addHandbook) && (
          <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
            {selectedNights.map((id) => {
              const night = SPRING_WEEK_NIGHTS.find((n) => n.id === id)!;
              return (
                <div
                  key={id}
                  className="flex justify-between text-xs text-white/40"
                >
                  <span>
                    {night.label}: {night.theme}
                  </span>
                  <span>£{NIGHT_INDIVIDUAL_PRICE}</span>
                </div>
              );
            })}
            {addHandbook && (
              <div className="flex justify-between text-xs text-white/40">
                <span>The Spring Week Playbook</span>
                <span>£{SPRING_WEEK_HANDBOOK.standalonePrice}</span>
              </div>
            )}
            {selectedNights.length > 0 && (
              <div className="flex justify-between text-xs text-white/30 pt-1 border-t border-white/[0.04]">
                <span>Individual total</span>
                <span className="line-through">£{individualTotal.toFixed(2)}</span>
              </div>
            )}
            {showSavings && (
              <div className="flex justify-between text-xs font-semibold text-emerald-400 pt-1">
                <span>Bundle discount</span>
                <span>-£{savings.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-white/[0.06]">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {combo ? (
                <AnimatedPrice value={price} />
              ) : (
                <span className="text-white/30 text-lg">Select a night</span>
              )}
            </div>
            {showSavings && (
              <div className="mt-1">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  You save £{savings.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {combo?.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-black shrink-0">
              {combo.badge}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!hasSelection}
          className={[
            "w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
            hasSelection
              ? "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99]"
              : "bg-white/[0.06] text-white/30 cursor-not-allowed",
          ].join(" ")}
        >
          <Zap className="w-4 h-4" />
          <span>{ctaLabel}</span>
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
          78% of students choose the 3-night pass
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <Star className="w-3.5 h-3.5 text-white/20" />
          4.9 avg rating from past events
        </div>
      </div>

      {/* All-3-nights callout */}
      {!isAllNights && selectedNights.length < 3 && (
        <div className="rounded-xl funnel-card p-4 flex items-start gap-3" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
          <Star className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white/70">
              Students who attended all 3 nights reported feeling significantly more confident going into their spring week.
            </p>
            <button
              type="button"
              onClick={() => setSelectedNights(["1", "2", "3"])}
              className="mt-1 text-[11px] text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Add all 3 nights for £49.99
            </button>
          </div>
        </div>
      )}

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
            Night 1 starts Friday April 10 at 7pm.
          </p>
          <p className="text-xs font-light text-white/40 mt-0.5">
            Spring weeks begin Monday April 13. This is your last chance to prepare with people who converted.
          </p>
        </div>
      </div>
    </div>
  );
}
