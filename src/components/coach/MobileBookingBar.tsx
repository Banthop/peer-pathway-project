import { Button } from "@/components/ui/button";
import type { Coach } from "@/types/coach";

interface MobileBookingBarProps {
  coach: Coach;
}

const MobileBookingBar = ({ coach }: MobileBookingBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-sans font-light text-muted-foreground">
            Available {coach.availability.nextSlot}
          </span>
        </div>
        <Button
          size="sm"
          className="font-sans font-light bg-foreground text-background hover:bg-foreground/90"
        >
          Book a free intro
        </Button>
      </div>
    </div>
  );
};

export default MobileBookingBar;
