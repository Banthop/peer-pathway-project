import { Link } from "react-router-dom";
import { format, isToday, isTomorrow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Session } from "@/types/dashboard";

interface CompactSessionRowProps {
  session: Session;
}

export function CompactSessionRow({ session }: CompactSessionRowProps) {
  const getDateLabel = () => {
    if (isToday(session.date)) return "Today";
    if (isTomorrow(session.date)) return "Tomorrow";
    return format(session.date, "EEE, MMM d");
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.coachPhoto} alt={session.coachName} />
          <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-foreground">{session.coachName}</p>
          <p className="text-xs text-muted-foreground">
            {session.type} · {getDateLabel()} at {session.time}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground hidden sm:inline">Reschedule</span>
        <Link
          to={`/call/${session.id}`}
          className="text-xs font-medium text-foreground hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
