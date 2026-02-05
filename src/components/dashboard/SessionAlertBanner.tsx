import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Session } from "@/types/dashboard";
import { format, isToday, isTomorrow } from "date-fns";

interface SessionAlertBannerProps {
  session: Session;
}

export function SessionAlertBanner({ session }: SessionAlertBannerProps) {
  const getDateText = () => {
    if (isToday(session.date)) {
      return `today at ${session.time}`;
    }
    if (isTomorrow(session.date)) {
      return `tomorrow at ${session.time}`;
    }
    return `on ${format(session.date, "EEEE")} at ${session.time}`;
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border-l-4 border-l-foreground bg-muted p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
          <AvatarImage src={session.coachPhoto} alt={session.coachName} />
          <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-medium text-foreground">
            Session with {session.coachName}
          </p>
          <p className="text-sm text-muted-foreground">
            {getDateText()} · {session.duration}
          </p>
        </div>
      </div>
      <Button
        asChild
        size="sm"
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        <Link to={`/call/${session.id}`} className="flex items-center gap-1">
          Join call <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}