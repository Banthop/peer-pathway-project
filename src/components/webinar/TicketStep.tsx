import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TICKETS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { Check, Lock, ArrowRight, Zap, Star, BookOpen } from "lucide-react";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface TicketStepProps {
  selectedTicket: "webinar-only" | "bundle";
  onSelect: (id: "webinar-only" | "bundle") => void;
  onCheckout: () => void;
  formData: WebinarFormData;
}

export function TicketStep({
  selectedTicket,
  onSelect,
  onCheckout,
  formData,
}: TicketStepProps) {
  const webinar = TICKETS.webinarOnly;
  const bundle = TICKETS.bundle;
  const isWebinarSelected = selectedTicket === "webinar-only";
  const isBundleSelected = selectedTicket === "bundle";

  const firstName = formData.firstName || "there";
  const rawIndustry = formData.industry || "";
  const industry = rawIndustry && rawIndustry !== "Not sure yet" ? rawIndustry : "any industry";

  return (
    <div className="space-y-6">
      {/* Personalised heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Almost there, {firstName}
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          Pick the option that's right for you
        </p>
      </div>

      {/* WEBINAR ONLY card */}
      <button
        type="button"
        onClick={() => onSelect("webinar-only")}
        className={cn(
          "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer p-8",
          isWebinarSelected
            ? "border-2 border-foreground shadow-lg bg-foreground/[0.02]"
            : "border border-border hover:border-foreground/30 hover:shadow-md",
        )}
      >
        {/* BIG discount banner */}
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold font-sans px-4 py-1.5 rounded-full">
            <Zap className="h-4 w-4" />
            47% OFF
          </span>
          <span className="text-xs text-red-500 font-sans font-semibold animate-pulse">
            Limited time only
          </span>
        </div>

        <h3 className="text-lg font-sans font-medium text-foreground">
          {webinar.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
          {webinar.description}
        </p>

        {/* PRICE - make £19 very large and crossed out */}
        <div className="mt-5 flex items-end gap-4">
          <div className="relative">
            <span className="text-5xl font-bold text-muted-foreground/30 font-sans">
              £19
            </span>
            {/* Thick red strikethrough line */}
            <div
              className="absolute top-[52%] left-0 right-0 h-[3px] bg-red-500 rounded-full"
              style={{ transform: "rotate(-8deg)" }}
            />
          </div>
          <span className="text-5xl font-bold text-foreground font-sans">
            £10
          </span>
        </div>
        <span className="inline-block mt-2 text-sm font-sans font-bold text-emerald-600">
          You save £9
        </span>

        {/* Features */}
        <ul className="mt-5 space-y-2">
          {webinar.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-sans font-light text-foreground">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              {f}
            </li>
          ))}
        </ul>

        {/* Selection indicator */}
        <div
          className={cn(
            "mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-sans font-medium transition-all duration-200",
            isWebinarSelected
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {isWebinarSelected ? (<><Check className="h-4 w-4" />Selected</>) : "Select"}
        </div>
      </button>

      {/* BUNDLE card */}
      <button
        type="button"
        onClick={() => onSelect("bundle")}
        className={cn(
          "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer",
          isBundleSelected
            ? "border-2 border-foreground shadow-xl bg-foreground/[0.02] p-8"
            : "border-2 border-foreground/20 hover:border-foreground/50 hover:shadow-lg p-8",
        )}
      >
        {/* BEST VALUE badge */}
        <Badge className="absolute -top-3 right-6 bg-foreground text-background text-[10px] uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full border-0 hover:bg-foreground">
          Best Value
        </Badge>

        {/* Most popular tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold font-sans px-3 py-1 rounded-full">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
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
            <span><strong>The Cold Email Guide</strong> - instant access, use it to prepare before the webinar</span>
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
            Not generic advice from the internet. The real system, step by step, that you can copy and start
            using <strong>the same day you get it</strong>.
            {" "}Perfect for breaking into <strong>{industry}</strong>.
            {" "}<strong>You get access today</strong> - start researching and preparing ahead of the webinar.
          </p>
          <div className="space-y-2.5">
            {[
              "How to find emails of CEOs and key decision-makers at any firm",
              "The exact email templates that generated a 21% response rate",
              "How to stand out in a flooded inbox (when 98% of cold emails get ignored)",
              "The follow-up system that turned silence into real offers",
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
            "This guide alone is worth more than the entire bundle price." - Previous attendee
          </p>
        </div>

        {/* Selection indicator */}
        <div
          className={cn(
            "mt-6 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-sans font-bold transition-all duration-200",
            isBundleSelected
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground",
          )}
        >
          {isBundleSelected ? (<><Check className="h-4 w-4" />Selected</>) : "Select - Best Value"}
        </div>
      </button>

      {/* Checkout button */}
      <div className="space-y-3 text-center">
        <Button
          onClick={onCheckout}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-10 py-4 text-base rounded-xl w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Continue to checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-sans font-light">
          <Lock className="h-3 w-3" />
          Secure checkout via Stripe
        </p>
      </div>
    </div>
  );
}
