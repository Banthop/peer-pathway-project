import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPRING_WEEK_TICKETS } from "@/data/springWeekData";
import type { SpringWeekTicketId } from "@/data/springWeekData";
import { cn } from "@/lib/utils";
import {
  Check,
  Lock,
  ArrowRight,
  Star,
  BookOpen,
  ShieldCheck,
  Users,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
} from "lucide-react";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface SpringWeekTicketsProps {
  selectedTicket: SpringWeekTicketId;
  onSelect: (id: SpringWeekTicketId) => void;
  onCheckout: () => void;
  formData: WebinarFormData;
}

/* ---- Playbook Details ---- */
function PlaybookDetails() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-emerald-100 bg-white overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-emerald-50/50 px-4 py-3.5 hover:bg-emerald-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-emerald-700">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-sans font-medium">What's inside The Spring Week Playbook?</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-emerald-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-emerald-500" />
        )}
      </button>

      {open && (
        <div className="px-5 py-4 bg-white animate-in fade-in slide-in-from-top-2 duration-200 border-t border-emerald-50">
          <h4 className="text-[11px] font-sans font-bold text-emerald-900 uppercase tracking-wider mb-3">
            THE SPRING WEEK PLAYBOOK INCLUDES
          </h4>
          <ul className="space-y-2.5">
            {[
              "Insider write-ups from real spring weekers at top firms",
              "What each firm's spring week programme actually involves",
              "Insider tips you won't find on forums or Reddit",
              "The interview process and what to expect at each stage",
              "How to convert your spring week into a return offer",
              "Common mistakes that kill your chances",
              "Firm-by-firm breakdown of culture, expectations, and conversion rates",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 mt-[1px] shrink-0 text-emerald-500" />
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
function SpringWeekFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "When are Part 1 and Part 2?",
      a: "Exact dates will be confirmed soon and sent to your email. Both parts are on separate days so different firms are covered in each.",
    },
    {
      q: "What if I can only attend one part?",
      a: "Each part is standalone with different speakers and firms. You'll get the recording of whichever part(s) you purchase. But the Bundle gives you both plus The Spring Week Playbook.",
    },
    {
      q: "Do I need a spring week offer already?",
      a: "Ideally yes - this webinar is about converting spring weeks, not getting them. If you're applying soon, you'll be ahead of the game when you get your offer.",
    },
    {
      q: "What is The Spring Week Playbook?",
      a: "A comprehensive guide featuring insider write-ups from real spring weekers. They share exactly what their programme involved, insider tips, and how to convert. Available with the Bundle and Premium tiers.",
    },
    {
      q: "What does the 1-on-1 coaching include?",
      a: "A dedicated session with one of our panellists who converted their spring week. They'll review your strategy, answer your specific questions, and help you prepare for your own spring week.",
    },
    {
      q: "Can I get a refund?",
      a: "Not what you expected? Full refund.",
    },
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

/* ---- Ticket Card ---- */
function TicketCard({
  ticket,
  isSelected,
  onSelect,
  variant = "default",
}: {
  ticket: (typeof SPRING_WEEK_TICKETS)[SpringWeekTicketId];
  isSelected: boolean;
  onSelect: () => void;
  variant?: "default" | "recommended" | "premium";
}) {
  const isRecommended = variant === "recommended";
  const isPremium = variant === "premium";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer p-5 md:p-6 flex flex-col",
        isRecommended && isSelected && "border-2 border-emerald-600 shadow-xl bg-gradient-to-br from-blue-50/40 via-white to-emerald-50/30",
        isRecommended && !isSelected && "border-2 border-emerald-600/30 hover:border-emerald-600/60 hover:shadow-lg bg-gradient-to-br from-blue-50/20 via-white to-emerald-50/15",
        isPremium && isSelected && "border-2 border-amber-500 shadow-xl bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20",
        isPremium && !isSelected && "border-2 border-amber-400/30 hover:border-amber-500/60 hover:shadow-lg bg-gradient-to-br from-amber-50/20 via-white to-orange-50/10",
        !isRecommended && !isPremium && isSelected && "border-2 border-foreground/60 shadow-md bg-slate-50/50",
        !isRecommended && !isPremium && !isSelected && "border border-border/60 hover:border-foreground/20 bg-slate-50/30",
      )}
    >
      {/* Badge */}
      {ticket.badge && (
        <Badge
          className={cn(
            "absolute -top-3 right-4 text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border-0",
            isRecommended && "bg-emerald-600 hover:bg-emerald-600",
            isPremium && "bg-amber-500 hover:bg-amber-500",
          )}
        >
          {isRecommended && <Star className="h-3 w-3 mr-1 fill-current" />}
          {isPremium && <Zap className="h-3 w-3 mr-1" />}
          {ticket.badge}
        </Badge>
      )}

      {/* Name and price */}
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <h3
          className={cn(
            "text-base font-sans",
            isRecommended || isPremium ? "font-semibold text-foreground" : "font-medium text-foreground/80",
          )}
        >
          {ticket.name}
        </h3>
        <span
          className={cn(
            "text-2xl font-bold font-sans shrink-0",
            isRecommended ? "text-emerald-600" : isPremium ? "text-amber-600" : "text-foreground/80",
          )}
        >
          £{ticket.price}
        </span>
      </div>

      <p className="mt-1 text-sm text-muted-foreground font-sans font-light">
        {ticket.description}
      </p>

      {/* Features */}
      <ul className="mt-3 space-y-1.5 flex-1">
        {ticket.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm font-sans font-light text-foreground/70">
            <Check
              className={cn(
                "h-3.5 w-3.5 mt-0.5 shrink-0",
                isRecommended ? "text-emerald-600" : isPremium ? "text-amber-500" : "text-slate-400",
              )}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* Selection indicator */}
      <div
        className={cn(
          "mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-sans font-medium transition-all duration-200",
          isSelected && isRecommended && "bg-emerald-600 text-white",
          isSelected && isPremium && "bg-amber-500 text-white",
          isSelected && !isRecommended && !isPremium && "bg-foreground/80 text-background",
          !isSelected && isRecommended && "bg-emerald-50 text-emerald-700",
          !isSelected && isPremium && "bg-amber-50 text-amber-700",
          !isSelected && !isRecommended && !isPremium && "bg-slate-100 text-muted-foreground",
        )}
      >
        {isSelected ? (
          <>
            <Check className="h-4 w-4" />
            Selected
          </>
        ) : isRecommended ? (
          "Select - Best Value"
        ) : (
          "Select"
        )}
      </div>
    </button>
  );
}

/* ---- Main SpringWeekTickets ---- */
export function SpringWeekTickets({
  selectedTicket,
  onSelect,
  onCheckout,
  formData,
}: SpringWeekTicketsProps) {
  const firstName = formData.firstName || "there";
  const selected = SPRING_WEEK_TICKETS[selectedTicket];

  return (
    <div className="space-y-6">
      {/* Personalised heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Choose your tier, {firstName}
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          Pick the option that's right for you
        </p>
      </div>

      {/* Social proof */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
        <Users className="h-4 w-4" />
        Most students choose the Bundle
      </div>

      {/* Playbook details accordion */}
      <PlaybookDetails />

      {/* 2x2 grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TicketCard
          ticket={SPRING_WEEK_TICKETS.part1}
          isSelected={selectedTicket === "part1"}
          onSelect={() => onSelect("part1")}
        />
        <TicketCard
          ticket={SPRING_WEEK_TICKETS.part2}
          isSelected={selectedTicket === "part2"}
          onSelect={() => onSelect("part2")}
        />
        <TicketCard
          ticket={SPRING_WEEK_TICKETS.bundle}
          isSelected={selectedTicket === "bundle"}
          onSelect={() => onSelect("bundle")}
          variant="recommended"
        />
        <TicketCard
          ticket={SPRING_WEEK_TICKETS.premium}
          isSelected={selectedTicket === "premium"}
          onSelect={() => onSelect("premium")}
          variant="premium"
        />
      </div>

      {/* Risk reversal */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-sans font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        Not what you expected? Full refund.
      </div>

      {/* Checkout button */}
      <div className="space-y-3 text-center">
        <Button
          onClick={onCheckout}
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-10 py-4 text-base rounded-xl w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          {selected
            ? `Get ${selected.name} for £${selected.price}`
            : "Continue to Checkout"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {selectedTicket === "bundle" && (
          <p className="text-xs text-emerald-600 font-sans font-medium">
            Includes The Spring Week Playbook - instant access after payment
          </p>
        )}

        {selectedTicket === "premium" && (
          <p className="text-xs text-amber-600 font-sans font-medium">
            Your 1-on-1 coaching session will be scheduled after the webinar
          </p>
        )}

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-sans font-light">
          <Lock className="h-3 w-3" />
          Secure checkout via Stripe
        </p>
      </div>

      {/* FAQ */}
      <SpringWeekFAQ />
    </div>
  );
}
