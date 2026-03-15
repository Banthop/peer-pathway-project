import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TICKETS, SPOTS_TOTAL, SPOTS_TAKEN } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { Check, Lock, ArrowRight } from "lucide-react";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface TicketStepProps {
  selectedTicket: "webinar-only" | "bundle";
  onSelect: (id: "webinar-only" | "bundle") => void;
  onCheckout: () => void;
  formData: WebinarFormData;
}

const ticketList = [TICKETS.webinarOnly, TICKETS.bundle] as const;

export function TicketStep({
  selectedTicket,
  onSelect,
  onCheckout,
}: TicketStepProps) {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Choose your ticket
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          {SPOTS_TAKEN} of {SPOTS_TOTAL} spots taken
        </p>
      </div>

      {/* Ticket cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ticketList.map((ticket) => {
          const isSelected = selectedTicket === ticket.id;

          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelect(ticket.id)}
              className={cn(
                "relative text-left rounded-xl p-6 transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-2 border-foreground shadow-md bg-foreground/[0.02]"
                  : "border border-border hover:border-foreground/30 hover:shadow-sm",
              )}
            >
              {/* Most popular badge */}
              {ticket.badge && (
                <Badge className="absolute -top-2.5 right-4 bg-foreground text-background text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border-0 hover:bg-foreground">
                  {ticket.badge}
                </Badge>
              )}

              {/* Ticket name */}
              <h3 className="text-base font-sans font-medium text-foreground mt-1">
                {ticket.name}
              </h3>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                {ticket.originalPrice && (
                  <span className="text-sm line-through text-muted-foreground font-sans">
                    £{ticket.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-semibold text-foreground font-sans">
                  £{ticket.price}
                </span>
              </div>

              {/* Save badge for bundle */}
              {ticket.originalPrice && (
                <span className="inline-block mt-1.5 text-xs font-sans font-medium text-emerald-600">
                  Save £{ticket.originalPrice - ticket.price}
                </span>
              )}

              {/* Description */}
              <p className="mt-3 text-xs text-muted-foreground font-sans font-light">
                {ticket.description}
              </p>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {ticket.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-sans font-light text-foreground"
                  >
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selection indicator */}
              <div
                className={cn(
                  "mt-5 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-sans font-medium transition-colors",
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {isSelected ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Selected
                  </>
                ) : (
                  "Select"
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Checkout button */}
      <div className="space-y-3">
        <Button
          onClick={onCheckout}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans font-light px-8 py-3 text-sm rounded-lg w-full sm:w-auto"
        >
          Continue to checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Trust signal */}
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-sans font-light">
          <Lock className="h-3 w-3" />
          Secure checkout via Stripe
        </p>
      </div>
    </div>
  );
}
