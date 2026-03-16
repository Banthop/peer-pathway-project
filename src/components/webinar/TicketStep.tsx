import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TICKETS, WEBINAR_TARGET_DATE } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { Check, Lock, ArrowRight, Zap, Star, BookOpen, Clock, ShieldCheck, Users, ChevronDown, ChevronUp, HelpCircle, X as XIcon, Maximize2, Info } from "lucide-react";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface TicketStepProps {
  selectedTicket: "webinar-only" | "bundle";
  onSelect: (id: "webinar-only" | "bundle") => void;
  onCheckout: () => void;
  formData: WebinarFormData;
}

/* ---- Countdown Timer ---- */
function MiniCountdown() {
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
    <div className="flex items-center justify-center gap-1.5 text-xs font-sans tabular-nums">
      <Clock className="h-3.5 w-3.5 text-amber-600" />
      <span className="text-amber-700 font-medium">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
      <span className="text-muted-foreground">until webinar</span>
    </div>
  );
}

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

/* ---- FAQ ---- */
function MiniFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Will there be a recording?", a: "Yes - all ticket holders get the recording within 24 hours of the webinar." },
    { q: "Is this relevant for non-finance roles?", a: "Absolutely. The cold emailing framework works for any industry - law, tech, consulting, media, and more." },
    { q: "What if I can't make the live session?", a: "No worries! You'll still get the recording and all bundled materials sent to your email." },
    { q: "Can I get a refund?", a: "Yes - if you're not satisfied, email us and we'll refund you." },
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

/* ---- Webinar Reminder ---- */
function WebinarReminder() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-blue-50/60 border border-blue-200/60 rounded-xl px-4 py-3 transition-all hover:border-blue-300"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm font-sans font-medium text-blue-800">What's included in the webinar?</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-blue-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="mt-2 bg-blue-50/40 border border-blue-200/40 rounded-xl px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-sans font-semibold text-blue-800 uppercase tracking-wider mb-2">
            90-minute live session covers
          </p>
          {[
            "Live walkthrough of the entire cold emailing process from start to finish",
            "How to use Apollo to find decision-maker emails at any firm",
            "Live mail-merge demo - watch real emails get sent in real-time",
            "How to write subject lines that actually get opened",
            "Handling rejections and turning them into opportunities",
            "Live Q&A - get your specific questions answered",
            "Recording sent to all attendees within 24 hours",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-600" />
              <span className="text-sm font-sans font-light text-blue-900/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TicketStep({
  selectedTicket,
  onSelect,
  onCheckout,
  formData,
}: TicketStepProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const webinar = TICKETS.webinarOnly;
  const bundle = TICKETS.bundle;
  const isWebinarSelected = selectedTicket === "webinar-only";
  const isBundleSelected = selectedTicket === "bundle";

  const firstName = formData.firstName || "there";
  const rawIndustry = formData.industry || "";
  const industry = rawIndustry && rawIndustry !== "Not sure yet" ? rawIndustry : "any industry";

  return (
    <div className="space-y-6">
      {lightboxOpen && (
        <ImageLightbox src="/email-proof.png" onClose={() => setLightboxOpen(false)} />
      )}

      {/* Personalised heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Almost there, {firstName}
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          Pick the option that's right for you
        </p>
        {/* Countdown */}
        <div className="pt-2">
          <MiniCountdown />
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
        <Users className="h-4 w-4" />
        78% of students choose the bundle
      </div>

      {/* Webinar reminder */}
      <WebinarReminder />

      {/* WEBINAR ONLY card - intentionally basic/muted */}
      <button
        type="button"
        onClick={() => onSelect("webinar-only")}
        className={cn(
          "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer p-6",
          isWebinarSelected
            ? "border-2 border-foreground/60 shadow-md bg-slate-50/50"
            : "border border-border/60 hover:border-foreground/20 bg-slate-50/30",
        )}
      >
        {/* Discount banner - muted */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold font-sans px-3 py-1 rounded-full">
            <Zap className="h-3.5 w-3.5" />
            47% OFF
          </span>
        </div>

        <h3 className="text-base font-sans font-medium text-foreground/80">
          {webinar.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
          {webinar.description}
        </p>

        {/* PRICE */}
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
          {webinar.features.map((f) => (
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
            isWebinarSelected
              ? "bg-foreground/80 text-background"
              : "bg-slate-100 text-muted-foreground",
          )}
        >
          {isWebinarSelected ? (<><Check className="h-4 w-4" />Selected</>) : "Select"}
        </div>
      </button>

      {/* BUNDLE card - premium, stands out */}
      <button
        type="button"
        onClick={() => onSelect("bundle")}
        className={cn(
          "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer",
          isBundleSelected
            ? "border-2 border-emerald-600 shadow-xl bg-gradient-to-br from-blue-50/40 via-white to-emerald-50/30 p-8"
            : "border-2 border-emerald-600/30 hover:border-emerald-600/60 hover:shadow-lg bg-gradient-to-br from-blue-50/20 via-white to-emerald-50/15 p-8",
        )}
      >
        {/* BEST VALUE badge */}
        <Badge className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full border-0 hover:bg-emerald-600">
          Best Value
        </Badge>

        {/* Most popular tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold font-sans px-3 py-1 rounded-full">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </span>
          <span className="text-xs text-amber-600 font-sans font-semibold">
            Spots are limited
          </span>
        </div>

        <h3 className="text-xl font-sans font-semibold text-foreground">
          {bundle.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
          Everything in the webinar, plus the complete playbook that landed 20+ offers
        </p>

        {/* Price */}
        <div className="mt-5">
          <span className="text-5xl font-bold text-foreground font-sans">
            £29
          </span>
        </div>

        {/* Features + guide tick */}
        <ul className="mt-5 space-y-2">
          {webinar.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-sans font-light text-foreground">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              {f}
            </li>
          ))}
          <li className="flex items-start gap-2.5 text-sm font-sans text-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
            <span><strong>The Cold Email Guide</strong> - get access instantly, and use it to prepare ahead of the webinar</span>
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
            It's perfect for breaking into <strong>{industry}</strong>.
          </p>
          <p className="text-sm font-sans text-foreground/80 leading-relaxed mb-4">
            Use it to start researching and preparing before the webinar.
          </p>

          {/* Clickable email proof - taller preview */}
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
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent" />
            {/* Expand overlay */}
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
            "This guide alone helped me land my summer in PE." - Karan M., LSE
          </p>
        </div>

        {/* Selection indicator */}
        <div
          className={cn(
            "mt-6 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-sans font-bold transition-all duration-200",
            isBundleSelected
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-700",
          )}
        >
          {isBundleSelected ? (<><Check className="h-4 w-4" />Selected</>) : "Select - Best Value"}
        </div>
      </button>

      {/* Mini FAQ */}
      <MiniFAQ />

      {/* Risk reversal */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        Full refund if you're not satisfied
      </div>

      {/* Checkout button */}
      <div className="space-y-3 text-center">
        <Button
          onClick={onCheckout}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-10 py-4 text-base rounded-xl w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          {isBundleSelected
            ? "Get Instant Access for £29"
            : "Lock In My £10 Spot"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {isBundleSelected && (
          <p className="text-xs text-emerald-600 font-sans font-medium">
            You'll get the Cold Email Guide in your inbox within 60 seconds
          </p>
        )}

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-sans font-light">
          <Lock className="h-3 w-3" />
          Secure checkout via Stripe
        </p>
      </div>
    </div>
  );
}
