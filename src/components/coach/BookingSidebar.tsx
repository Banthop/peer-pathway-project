import { useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingDialog from "@/components/coach/booking/BookingDialog";
import type { Coach } from "@/types/coach";
import type { BookingType } from "@/types/booking";

interface BookingSidebarProps {
  coach: Coach;
}

const BookingSidebar = ({ coach }: BookingSidebarProps) => {
  const firstName = coach.name.split(" ")[0];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>("free-intro");

  const handleOpenDialog = (type: BookingType) => {
    setBookingType(type);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Availability */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-sans font-light text-foreground">
            Available {coach.availability.nextSlot}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleOpenDialog("free-intro")}
            className="w-full font-sans font-light bg-foreground text-background hover:bg-foreground/90"
          >
            Schedule a free intro
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOpenDialog("session")}
            className="w-full font-sans font-light"
          >
            Book a session
          </Button>
        </div>

        {/* Quality Guarantee */}
        <div className="flex items-start gap-3 pt-2 border-t border-border">
          <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-sans font-medium text-foreground">
              Protected by EarlyEdge
            </p>
            <p className="text-xs text-muted-foreground font-sans font-light">
              Quality Guarantee
            </p>
          </div>
        </div>

        {/* Message Option */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground font-sans font-light mb-2">
            Questions? Message {firstName} before you get started.
          </p>
          <button className="flex items-center gap-1.5 text-sm text-primary font-sans font-light hover:underline">
            <MessageCircle className="w-4 h-4" />
            Send a message
          </button>
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        coach={coach}
        type={bookingType}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default BookingSidebar;
