import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Star } from "lucide-react";
import type { Session } from "@/types/dashboard";

interface PastSessionRowProps {
  session: Session;
}

export function PastSessionRow({ session }: PastSessionRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{session.coachName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {session.coachCredential} · {session.type} · {format(session.date, "MMM d")}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        {session.reviewed && session.rating ? (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: session.rating }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
            ))}
          </div>
        ) : (
          <Link
            to={`/review/${session.id}`}
            className="text-xs font-medium text-foreground hover:underline"
          >
            Leave review
          </Link>
        )}
      </div>
    </div>
  );
}
