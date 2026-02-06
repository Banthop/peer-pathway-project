import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { Session } from "@/types/dashboard";

interface ReviewNudgeProps {
  session: Session;
}

export function ReviewNudge({ session }: ReviewNudgeProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3">
      <p className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{session.coachName}</span> session on{" "}
        {format(session.date, "MMM d")} —{" "}
      </p>
      <Link
        to={`/review/${session.id}`}
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline shrink-0"
      >
        Leave a review <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function BookingNudge() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3">
      <p className="text-sm text-muted-foreground">Ready for your next session?</p>
      <Link
        to="/"
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline shrink-0"
      >
        Browse coaches <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
