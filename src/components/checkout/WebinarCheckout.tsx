import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Check,
  ChevronLeft,
  Clock,
  Lock,
  Loader2,
  ShieldCheck,
  Users,
  BookOpen,
  Phone,
  Zap,
  Plus,
} from "lucide-react";
import { useCountdown } from "@/components/spring-week/shared";
import { SPRING_WEEK_NIGHTS } from "@/data/springWeekData";
import type { PartnerTier } from "@/data/partnerConfig";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebinarCheckoutProps {
  selectedTierId: string;
  tiers: PartnerTier[];
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    springWeekFirms: string;
    university: string;
    industry: string;
  };
  partnerSlug?: string;
  partnerName?: string;
  onSuccess: (tierId: string) => void;
  onBack: () => void;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  nudge: string;
  scarcity?: string;
}

interface CheckoutPayload {
  email: string;
  firstName: string;
  lastName: string;
  items: Array<{ id: string; type: string; price: number }>;
  partner?: string;
  metadata: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const CHECKOUT_ENDPOINT = `${SUPABASE_URL}/functions/v1/create-webinar-checkout`;

const stripePromise = loadStripe(
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) ||
    "pk_live_51S9SPFC2xvQw3GwfxxGh9TAFqfaP3ZI5aA9nQkA88kGPxqsy2Rb40QSgua74EgxuPiAdosRBsWGOqsbzhXE1nOog009Q2oSmMu",
);

const STRIPE_APPEARANCE: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#10B981",
    colorBackground: "#0a0a0a",
    colorText: "#ffffff",
    colorDanger: "#ef4444",
    borderRadius: "12px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  rules: {
    ".Input": { border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" },
    ".Input:focus": { border: "1px solid rgba(16,185,129,0.5)", boxShadow: "0 0 0 1px rgba(16,185,129,0.25)" },
    ".Label": { color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "400" },
  },
};

const HANDBOOK_ADDON: AddOn = {
  id: "handbook", name: "Spring Week Handbook", price: 29,
  description: "Covers 45+ firms including yours. Most students add this.",
  nudge: "78% of students add this",
};

const PREP_CALL_ADDON: AddOn = {
  id: "prep-call", name: "1-on-1 Prep Call", price: 69,
  description: "A call with someone who converted at your firm. They tell you what to expect.",
  nudge: "Students with prep calls convert at 3x the rate",
  scarcity: "Only 12 prep call spots available",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAvailableAddOns(tierId: string): AddOn[] {
  const out: AddOn[] = [];
  if (tierId === "watch") out.push(HANDBOOK_ADDON);
  if (tierId !== "convert") out.push(PREP_CALL_ADDON);
  return out;
}

function fmt(amount: number): string {
  return amount === 0 ? "FREE" : `\u00A3${amount}`;
}

async function callCheckout(payload: CheckoutPayload) {
  const r = await fetch(CHECKOUT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(body || `Server error (${r.status})`);
  }
  return r.json() as Promise<{ clientSecret?: string | null; free?: boolean; intentId?: string }>;
}

// ---------------------------------------------------------------------------
// Payment Form (inner component, consumes Stripe context)
// ---------------------------------------------------------------------------

function PaymentForm({ total, onSuccess, tierId }: {
  total: number;
  onSuccess: (tierId: string) => void;
  tierId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed. Please try again.");
      setPaying(false);
    } else if (result.paymentIntent?.status === "succeeded" || result.paymentIntent?.status === "requires_capture") {
      onSuccess(tierId);
    } else {
      setPaying(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      <button
        type="submit" disabled={!stripe || paying}
        className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {paying
          ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
          : <><Lock className="w-4 h-4" />Pay {fmt(total)}</>}
      </button>
      <TrustBadges />
    </form>
  );
}

function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-4 text-[11px] text-white/30">
      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Full refund if it's not for you</span>
      <span className="flex items-center gap-1"><Lock className="w-3 h-3" />256-bit encryption</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function WebinarCheckout({
  selectedTierId, tiers, formData, partnerSlug, partnerName, onSuccess, onBack,
}: WebinarCheckoutProps) {
  const tier = tiers.find((t) => t.id === selectedTierId) ?? tiers[0];
  const availableAddOns = useMemo(() => getAvailableAddOns(selectedTierId), [selectedTierId]);
  const [activeAddOns, setActiveAddOns] = useState<Set<string>>(new Set());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const reqRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdown = useCountdown(SPRING_WEEK_NIGHTS[0].dateISO);

  // Stable refs for callbacks to avoid re-triggering the payment intent effect
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const addOnTotal = availableAddOns.filter((a) => activeAddOns.has(a.id)).reduce((s, a) => s + a.price, 0);
  const total = tier.price + addOnTotal;
  const isFree = total === 0;
  const firstFirm = formData.springWeekFirms ? formData.springWeekFirms.split(",")[0].trim() : "";

  // TEMPORARY: fall back to Stripe payment link when edge function is unavailable
  const handleStripeLinkFallback = useCallback(() => {
    if (tier.stripeLink) {
      window.open(tier.stripeLink, "_blank", "noopener");
    }
  }, [tier.stripeLink]);

  const fetchIntent = useCallback(() => {
    const seq = ++reqRef.current;
    setLoading(true);
    setFetchError(null);
    setShowFallback(false);

    // Show fallback button after 5 seconds if still loading
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowFallback(true);
    }, 5000);

    const items: Array<{ id: string; type: string; price: number }> = [
      { id: selectedTierId, type: "tier", price: tier.price },
    ];
    for (const a of availableAddOns) {
      if (activeAddOns.has(a.id)) items.push({ id: a.id, type: "addon", price: a.price });
    }
    const payload: CheckoutPayload = {
      email: formData.email, firstName: formData.firstName, lastName: formData.lastName,
      items, partner: partnerSlug,
      metadata: {
        university: formData.university, industry: formData.industry,
        springWeekFirms: formData.springWeekFirms, tierId: selectedTierId,
        partnerSlug: partnerSlug ?? "", partnerName: partnerName ?? "",
      },
    };

    callCheckout(payload)
      .then((data) => {
        if (seq !== reqRef.current) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (data.free) {
          onSuccessRef.current(selectedTierId);
          return;
        }
        if (!data.clientSecret) {
          setFetchError("No payment session returned. Please try again.");
          setShowFallback(true);
          setLoading(false);
          return;
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        if (seq !== reqRef.current) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const message = err instanceof Error ? err.message : "Could not create checkout";
        setFetchError(message);
        setShowFallback(true);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTierId, tier.price, activeAddOns, availableAddOns, formData.email, formData.firstName, formData.lastName, formData.university, formData.industry, formData.springWeekFirms, partnerSlug, partnerName]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  // Create or update PaymentIntent when total changes
  useEffect(() => {
    if (isFree) { setClientSecret(null); return; }
    fetchIntent();
  }, [total, isFree, fetchIntent]);

  function handleFreeClaim() {
    // Free tier with no add-ons: skip edge function entirely
    if (isFree) {
      onSuccessRef.current(selectedTierId);
      return;
    }
    // Free tier base + paid add-ons: still need checkout
    setLoading(true);
    setFetchError(null);
    fetchIntent();
  }

  function toggleAddOn(id: string) {
    setActiveAddOns((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // --- Render ---

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors font-light cursor-pointer">
          <ChevronLeft className="w-4 h-4" />Change tier
        </button>
        <h1 className="text-2xl md:text-[28px] font-bold text-white leading-tight tracking-tight">
          Complete your order
        </h1>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-3 funnel-card rounded-xl px-5 py-3">
        <Clock className="w-3.5 h-3.5 text-white/25 shrink-0" />
        <p className="text-xs text-white/40">Panel starts in</p>
        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          {countdown.days > 0 && <span>{countdown.days}d</span>}
          <span>{String(countdown.hours).padStart(2, "0")}h</span>
          <span>{String(countdown.minutes).padStart(2, "0")}m</span>
          <span>{String(countdown.seconds).padStart(2, "0")}s</span>
        </div>
      </div>

      {/* Section 1: Order Summary */}
      <div className="funnel-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: tier.accent }} />
            <div>
              <p className="text-base font-bold text-white">{tier.name}</p>
              <p className="text-xs text-white/40 mt-0.5">{tier.tagline}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            {tier.originalPrice != null && (
              <p className="text-xs text-white/30 line-through">{"\u00A3"}{tier.originalPrice}</p>
            )}
            <p className="text-lg font-bold text-white">{fmt(tier.price)}</p>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
          {tier.features.slice(0, 3).map((f) => (
            <div key={f} className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
              <span className="text-xs text-white/50 leading-snug">{f}</span>
            </div>
          ))}
          {tier.features.length > 3 && (
            <p className="text-xs text-white/30 pl-5">+{tier.features.length - 3} more included</p>
          )}
        </div>
      </div>

      {/* Section 2: Add-ons */}
      {availableAddOns.length > 0 && (
        <div className="space-y-3">
          {tier.price === 0 && (
            <div className="funnel-card rounded-xl px-4 py-3 border-emerald-500/15">
              <p className="text-sm text-white/60 font-light leading-snug">
                You're getting the panel for free.
                {firstFirm
                  ? ` Add the Handbook to know exactly what ${firstFirm}'s spring week looks like.`
                  : " Add the Handbook to know exactly what YOUR firm's spring week looks like."}
              </p>
            </div>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Recommended add-ons</p>
          {availableAddOns.map((addOn) => {
            const active = activeAddOns.has(addOn.id);
            const Icon = addOn.id === "handbook" ? BookOpen : Phone;
            return (
              <button key={addOn.id} type="button" onClick={() => toggleAddOn(addOn.id)}
                className={["w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 relative overflow-hidden cursor-pointer",
                  active ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-white/[0.06] bg-transparent hover:border-white/12",
                ].join(" ")}>
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-200"
                  style={{ backgroundColor: "#10B981", opacity: active ? 1 : 0 }} />
                <div className="flex items-start gap-4">
                  <div className={["mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    active ? "bg-emerald-500 border-emerald-500" : "border-white/20"].join(" ")}>
                    {active ? <Check className="w-3 h-3 text-black" strokeWidth={3} /> : <Plus className="w-3 h-3 text-white/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-sm font-semibold text-white">{addOn.name}</span>
                      <span className="text-sm font-bold text-emerald-400">+{"\u00A3"}{addOn.price}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/40 leading-snug">{addOn.description}</p>
                    {addOn.scarcity && <p className="mt-1.5 text-[11px] font-semibold text-emerald-400">{addOn.scarcity}</p>}
                  </div>
                </div>
                {active && (
                  <div className="mt-3 ml-9 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <p className="text-[11px] text-emerald-400/70 font-medium">{addOn.nudge}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Total breakdown (only when add-ons active or original price shown) */}
      {(addOnTotal > 0 || tier.originalPrice != null) && (
        <div className="funnel-card rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">{tier.name} tier</span>
            <span className="text-white/70">{fmt(tier.price)}</span>
          </div>
          {availableAddOns.filter((a) => activeAddOns.has(a.id)).map((a) => (
            <div key={a.id} className="flex justify-between text-sm">
              <span className="text-white/50">{a.name}</span>
              <span className="text-white/70">+{"\u00A3"}{a.price}</span>
            </div>
          ))}
          <div className="border-t border-white/[0.06] pt-2 flex justify-between">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-lg font-bold text-white">{fmt(total)}</span>
          </div>
        </div>
      )}

      {/* Section 3: Payment */}
      <div className="space-y-4">
        {isFree ? (
          <div className="space-y-3">
            <button type="button" onClick={handleFreeClaim} disabled={loading}
              className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Securing your spot...</>
                : <><Zap className="w-4 h-4" />Claim Your Free Spot</>}
            </button>
            {fetchError && <ErrorBanner message={fetchError} />}
            <div className="flex items-center justify-center gap-4 text-[11px] text-white/30">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Instant confirmation</span>
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" />No card required</span>
            </div>
          </div>
        ) : loading ? (
          <div className="funnel-card rounded-2xl p-8 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <p className="text-sm text-white/40 font-light">Preparing secure checkout...</p>
            {showFallback && tier.stripeLink && (
              <button type="button" onClick={handleStripeLinkFallback}
                className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99] mt-2">
                <Lock className="w-4 h-4" />Continue to Payment ({fmt(tier.price)})
              </button>
            )}
          </div>
        ) : fetchError ? (
          <div className="space-y-3">
            <ErrorBanner message={fetchError} />
            {/* TEMPORARY: fall back to Stripe payment link when edge function fails */}
            {tier.stripeLink && (
              <button type="button" onClick={handleStripeLinkFallback}
                className="w-full py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.99]">
                <Lock className="w-4 h-4" />Continue to Payment ({fmt(tier.price)})
              </button>
            )}
            <button type="button" onClick={fetchIntent}
              className="w-full py-3 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              Try again
            </button>
          </div>
        ) : clientSecret && clientSecret.length > 0 ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
            <PaymentForm total={total} onSuccess={onSuccess} tierId={selectedTierId} />
          </Elements>
        ) : (
          <div className="funnel-card rounded-2xl p-8 flex flex-col items-center gap-3">
            <p className="text-sm text-white/40 font-light">Waiting for payment session...</p>
            <button type="button" onClick={fetchIntent}
              className="text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Social proof footer */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/30">
        <Users className="w-3.5 h-3.5 text-white/20" />
        150+ students registered{partnerName ? ` (including ${partnerName} members)` : ""}
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}

export default WebinarCheckout;
