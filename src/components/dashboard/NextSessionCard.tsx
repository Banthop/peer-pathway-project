import { Link } from "react-router-dom";
import { format, isToday, isTomorrow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Session } from "@/types/dashboard";

interface NextSessionCardProps {
  session: Session;
}

export function NextSessionCard({ session }: NextSessionCardProps) {
  const getDateLabel = () => {
    if (isToday(session.date)) return "Today";
    if (isTomorrow(session.date)) return "Tomorrow";
    return format(session.date, "EEEE, MMM d");
  };

  const isSoon = isToday(session.date);

  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session.coachPhoto} alt={session.coachName} />
            <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base font-medium text-foreground">{session.coachName}</h3>
            <p className="text-sm text-muted-foreground">{session.coachCredential}</p>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{session.type}</span>
              <span>·</span>
              <span>
                {getDateLabel()} at {session.time}
              </span>
              <span>·</span>
              <span>{session.duration}</span>
            </div>
          </div>
        </div>

        {isSoon && (
          <span className="text-xs font-medium text-foreground bg-muted px-2 py-1 rounded shrink-0">
            Today
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button
          asChild
          className="bg-foreground text-background hover:bg-foreground/90 font-sans"
        >
          <Link to={`/call/${session.id}`} className="flex items-center gap-2">
            Join call <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground font-sans"
        >
          Reschedule
        </Button>
      </div>
    </div>
  );
}
