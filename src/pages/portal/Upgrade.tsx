import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { cn } from "@/lib/utils";
import {
  Check, ArrowRight, Zap, Star, BookOpen, ShieldCheck, Users,
  ChevronDown, ChevronUp, HelpCircle, X as XIcon, Maximize2,
  Play, Info, Lock,
} from "lucide-react";

const RECORDING_LINK = "https://buy.stripe.com/4gM7sK8iUcK55qGbl22400d";
const BUNDLE_LINK = "https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e";
const GUIDE_UPGRADE_LINK = "https://buy.stripe.com/6oU8wOfLmaBXdXc74M2400k";

/* ---- Image Lightbox ---- */
function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-[101]"
        aria-label="Close lightbox"
      >
        <XIcon className="h-6 w-6" />
      </button>
      <img
        src={src}
        alt="Real internship offer email"
        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/* ---- Recording Includes Accordion ---- */
function RecordingIncludes() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border-2 border-blue-400 bg-white overflow-hidden transition-all shadow-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-blue-50 px-6 py-5 hover:bg-blue-100/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-blue-700">
          <Info className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-sans font-semibold">What's inside the recording?</span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-blue-500 font-normal">(tap to expand)</span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-6 w-6 text-blue-500" />
        ) : (
          <ChevronDown className="h-6 w-6 text-blue-500" />
        )}
      </button>

      {open && (
        <div className="px-5 py-4 bg-white animate-in fade-in slide-in-from-top-2 duration-200 border-t border-blue-50">
          <h4 className="text-[11px] font-sans font-bold text-blue-900 uppercase tracking-wider mb-3">
            WHAT'S INSIDE THE RECORDING
          </h4>
          <ul className="space-y-2.5">
            {[
              "Watch the full cold email process done live - not just the theory, see it executed start to finish in real time",
              "Live Apollo demo - watch us find real decision-maker emails at target firms on screen",
              "Mail merge demo - see real cold emails get sent in real time (including the 9:03 AM send rule and why it works)",
              "Live Q&A with real student questions - hear the edge-case questions other students asked that you wouldn't think of",
              "The commentary you can't get from slides - the reasoning behind every strategy, what to tweak for different firms, and mistakes to avoid",
              "Follow-up sequences broken down - exactly what to send on Day 3, Day 7, and Day 14 when they don't reply",
              "Watch anytime on any device - lifetime access, rewatch as many times as you want",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 mt-[1px] shrink-0 text-blue-500" />
                <span className="text-sm font-sans font-light text-slate-600 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---- FAQ ---- */
function MiniFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How long do I have access?", a: "Lifetime. Watch as many times as you want, at your own pace. The recording is yours forever." },
    { q: "Is this relevant for non-finance roles?", a: "Absolutely. The cold emailing framework works for any industry - law, tech, consulting, media, and more." },
    { q: "Can I watch on mobile?", a: "Yes - the recording works perfectly on any device. Watch on your phone, tablet, or laptop." },
    { q: "What if I'm not satisfied?", a: "We offer a full refund. Just email us and we'll sort it out." },
    { q: "When do I get access?", a: "Instantly. After payment, you'll be redirected to the portal and your content will be unlocked immediately." },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
          Frequently Asked Questions
        </span>
      </div>
      {faqs.map((faq, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen(open === i ? null : i)}
          className="w-full text-left bg-white/60 backdrop-blur-sm border border-border rounded-xl px-4 py-3 transition-all hover:border-foreground/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-sans font-medium text-foreground">{faq.q}</span>
            {open === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
          {open === i && (
            <p className="mt-2 text-sm font-sans font-light text-muted-foreground leading-relaxed animate-in fade-in duration-200">
              {faq.a}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

export default function Upgrade() {
  const { user } = useAuth();
  const { buyerStatus } = useBuyerAuth();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<"recording" | "bundle">("bundle");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const tier = buyerStatus?.tier ?? "free";
  const firstName = user?.user_metadata?.name?.split(" ")[0] || "there";
  const email = user?.email || "";
  const isRecordingUser = tier === "recording";

  // Pre-select from URL params
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan === "recording") setSelectedPlan("recording");
    if (plan === "bundle") setSelectedPlan("bundle");
  }, [searchParams]);

  function buildCheckoutUrl(baseUrl: string) {
    const url = new URL(baseUrl);
    if (email) url.searchParams.set("prefilled_email", email);
    if (email) url.searchParams.set("client_reference_id", email);
    return url.toString();
  }

  function handleCheckout() {
    const link = isRecordingUser
      ? GUIDE_UPGRADE_LINK
      : selectedPlan === "bundle"
        ? BUNDLE_LINK
        : RECORDING_LINK;
    window.open(buildCheckoutUrl(link), "_blank");
  }

  const isRecordingSelected = selectedPlan === "recording";
  const isBundleSelected = selectedPlan === "bundle";

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      {lightboxOpen && (
        <ImageLightbox src="/email-proof.png" onClose={() => setLightboxOpen(false)} />
      )}

      <div className="max-w-xl lg:max-w-4xl mx-auto px-6 py-10 md:py-16">
        <div className="space-y-6">

          {/* Personalised heading */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
              {isRecordingUser
                ? `You've got the recording, ${firstName}`
                : `Unlock Your Edge, ${firstName}`}
            </h2>
            <p className="text-sm text-muted-foreground font-sans font-light">
              {isRecordingUser
                ? "You already have the recording. Add the Cold Email Guide to unlock the full system."
                : "Choose the plan that's right for you"}
            </p>
          </div>

          {/* Social proof */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <Users className="h-4 w-4" />
              78% of students choose the bundle
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-foreground/60 font-sans font-medium bg-white/60 border border-border rounded-full px-4 py-2">
              <Play className="h-3.5 w-3.5" />
              150+ students have already watched this recording
            </div>
          </div>

          {!isRecordingUser && <RecordingIncludes />}

          {/* ---- RECORDING ONLY card (hidden for recording-tier users) ---- */}
          {!isRecordingUser && (
            <button
              type="button"
              onClick={() => setSelectedPlan("recording")}
              className={cn(
                "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer p-6",
                isRecordingSelected
                  ? "border-2 border-foreground/60 shadow-md bg-slate-50/50"
                  : "border border-border/60 hover:border-foreground/20 bg-slate-50/30",
              )}
            >
              {/* Discount banner */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold font-sans px-3 py-1 rounded-full">
                  <Zap className="h-3.5 w-3.5" />
                  47% OFF
                </span>
                <span className="text-xs text-amber-600 font-sans font-semibold">
                  This week only
                </span>
              </div>

              <h3 className="text-base font-sans font-medium text-foreground/80">
                Recording Only
              </h3>
              <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
                Full 90-min recording - watch anytime
              </p>

              {/* Price */}
              <div className="mt-4 flex items-end gap-3">
                <div className="relative">
                  <span className="text-3xl font-bold text-muted-foreground/30 font-sans">
                    £19
                  </span>
                  <div
                    className="absolute top-[52%] left-0 right-0 h-[2px] bg-slate-400 rounded-full"
                    style={{ transform: "rotate(-8deg)" }}
                  />
                </div>
                <span className="text-3xl font-bold text-foreground/80 font-sans">
                  £10
                </span>
              </div>

              {/* Features */}
              <ul className="mt-4 space-y-1.5">
                {[
                  "Full 90-min recording",
                  "Watch anytime, anywhere",
                  "Lifetime access",
                  "24/7 Q&A access to Uthman regarding any cold-emailing queries",
                  "Includes free cold-emailing resources",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-sans font-light text-foreground/60">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Selection indicator */}
              <div
                className={cn(
                  "mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-sans font-medium transition-all duration-200",
                  isRecordingSelected
                    ? "bg-foreground/80 text-background"
                    : "bg-slate-100 text-muted-foreground",
                )}
              >
                {isRecordingSelected ? (<><Check className="h-4 w-4" />Selected</>) : "Select"}
              </div>
            </button>
          )}

          {/* ---- BUNDLE card ---- */}
          <button
            type="button"
            onClick={() => setSelectedPlan("bundle")}
            className={cn(
              "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer",
              isRecordingUser
                ? "border-2 border-emerald-600 shadow-xl bg-gradient-to-br from-blue-50/40 via-white to-emerald-50/30 p-6 lg:p-8"
                : isBundleSelected
                  ? "border-2 border-emerald-600 shadow-xl bg-gradient-to-br from-blue-50/40 via-white to-emerald-50/30 p-6 lg:p-8"
                  : "border-2 border-emerald-600/30 hover:border-emerald-600/60 hover:shadow-lg bg-gradient-to-br from-blue-50/20 via-white to-emerald-50/15 p-6 lg:p-8",
            )}
          >
            {/* BEST VALUE badge */}
            <span className="absolute -top-3 right-6 bg-[#111] text-white text-[10px] uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full border-0">
              Best Value
            </span>

            {/* Most popular tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold font-sans px-3 py-1 rounded-full">
                <Star className="h-3 w-3 fill-current" />
                Most Popular
              </span>
              <span className="text-xs text-amber-600 font-sans font-semibold">
                This week only
              </span>
            </div>

            <h3 className="text-xl font-sans font-semibold text-foreground">
              {isRecordingUser ? "Add the Cold Email Guide" : "Recording + Cold Email Guide"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
              Everything in the recording, plus the complete playbook that landed 20+ offers
            </p>

            {/* Price */}
            <div className="mt-5">
              <span className="text-5xl font-bold text-foreground font-sans">
                {isRecordingUser ? "£19" : "£29"}
              </span>
            </div>

            {/* Features + Guide showcase (vertical layout) */}
            <div>
            <ul className="mt-5 space-y-2">
              {["Full 90-min recording", "Watch anytime, anywhere", "Lifetime access", "24/7 Q&A access to Uthman regarding any cold-emailing queries"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-sans font-light text-foreground">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm font-sans text-foreground">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                <span><strong>The Cold Email Guide</strong> - get access instantly, and apply the strategies while you watch</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm font-sans text-foreground">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                <span><strong>EarlyEdge Cold Email Tracker</strong> included</span>
              </li>
            </ul>

            {/* Cold Email Guide showcase */}
            <div className="mt-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-foreground" />
                <span className="text-sm font-sans font-bold text-foreground uppercase tracking-wide">
                  The Cold Email Guide
                </span>
              </div>
              <p className="text-sm font-sans text-foreground/80 leading-relaxed mb-4">
                <strong>This is the exact guide Uthman personally used</strong> to land 20+ internship offers.
                This is not generic advice from the internet, it's a real system, step by step, that you can
                copy and <strong>start using today</strong>.
              </p>
              <p className="text-sm font-sans text-foreground/80 leading-relaxed mb-4">
                It's perfect for breaking into your target industry. Use it alongside the recording to start applying immediately.
              </p>

              {/* Clickable email proof */}
              <div
                className="relative rounded-lg overflow-hidden mb-4 border border-slate-200 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
              >
                <img
                  src="/email-proof.png"
                  alt="Real internship offer"
                  className="w-full h-48 object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                  width={500}
                  height={192}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                    <Maximize2 className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-xs font-sans font-medium text-foreground">Click to expand</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[11px] text-foreground/70 font-sans font-medium bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 inline-flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" />
                    Real offer email - tap to view full size
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  "A curated list of 200+ firms actively hiring interns, with contact details",
                  "5 proven email templates for different industries and scenarios",
                  "The psychology behind why certain subject lines get 3x more opens",
                  "A step-by-step research method to personalise every email in under 2 minutes",
                  "A ready-to-use spreadsheet to track every lead, reply, and meeting",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-foreground" />
                    <span className="text-sm font-sans font-light text-foreground/90 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground font-sans italic">
                "This guide alone helped me land my summer in PE." - Birkaran P, LSE
              </p>
            </div>
            </div>

            {/* Selection indicator */}
            <div
              className={cn(
                "mt-6 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-sans font-bold transition-all duration-200",
                (isBundleSelected || isRecordingUser)
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700",
              )}
            >
              {(isBundleSelected || isRecordingUser)
                ? (<><Check className="h-4 w-4" />Selected</>)
                : "Select - Best Value"}
            </div>
          </button>

          {/* Risk reversal */}
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Full refund if you're not satisfied
          </div>

          {/* Checkout button */}
          <div className="space-y-3 text-center">
            <button
              type="button"
              onClick={handleCheckout}
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-10 py-4 text-base rounded-xl w-full shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              {isRecordingUser
                ? "Add the Guide - £19"
                : isBundleSelected
                  ? "Get Instant Access for £29"
                  : "Get the Recording for £10"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>

            {(isBundleSelected || isRecordingUser) && (
              <p className="text-xs text-emerald-600 font-sans font-medium">
                You'll get the Cold Email Guide in your inbox within 60 seconds
              </p>
            )}

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-sans font-light">
              <Lock className="h-3 w-3" />
              Secure checkout via Stripe - Instant access after payment
            </p>
          </div>

          {/* FAQ */}
          <MiniFAQ />

        </div>
      </div>
    </div>
  );
}
