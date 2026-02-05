 import { Link } from "react-router-dom";
import { format, isToday, differenceInMinutes, isTomorrow } from "date-fns";
import { Calendar, Clock, ArrowRight } from "lucide-react";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { Session } from "@/types/dashboard";
 
 interface UpcomingSessionCardProps {
   session: Session;
 }
 
 export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
   const now = new Date();
   const sessionDateTime = new Date(session.date);
   const [hours, minutes] = session.time.split(":").map(Number);
   if (!isNaN(hours)) {
     sessionDateTime.setHours(hours, minutes || 0);
   }
   
   const minutesUntilSession = differenceInMinutes(sessionDateTime, now);
   const showJoinButton = minutesUntilSession <= 15 && minutesUntilSession >= -60;
 
   const formatDate = () => {
     if (isToday(session.date)) {
      return "Today";
     }
    if (isTomorrow(session.date)) {
      return "Tomorrow";
    }
    return format(session.date, "EEE, MMM d");
   };
 
   return (
    <div className="group rounded-lg border-2 border-foreground/20 bg-background p-4 transition-all duration-200 hover:border-foreground/40">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 border-2 border-foreground">
           <AvatarImage src={session.coachPhoto} alt={session.coachName} />
           <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
         </Avatar>
         
         <div className="flex-1 min-w-0">
           <div className="flex items-start justify-between gap-2">
             <div>
               <h3 className="font-medium text-foreground font-sans">{session.coachName}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{session.coachCredential}</p>
             </div>
            <Badge className="shrink-0 bg-foreground text-background font-normal text-xs">
               {session.type}
             </Badge>
           </div>
          
          {/* Logo badges */}
          <div className="mt-2 flex items-center gap-2">
            {session.coachUniversityLogo && (
              <div className="h-5 w-5 rounded border border-border bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src={session.coachUniversityLogo} 
                  alt="University" 
                  className="h-3.5 w-3.5 object-contain"
                />
              </div>
            )}
            {session.coachCompanyLogo && (
              <div className="h-5 w-5 rounded border border-border bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src={session.coachCompanyLogo} 
                  alt="Company" 
                  className="h-3.5 w-3.5 object-contain"
                />
              </div>
            )}
           </div>
         </div>
       </div>
      
      {/* Date and time section */}
      <div className="flex items-center gap-4 mb-3 py-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{session.time} · {session.duration}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Reschedule
        </Button>
        {showJoinButton ? (
          <Button
            asChild
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 font-sans"
          >
            <Link to={`/call/${session.id}`} className="flex items-center gap-1">
              Join call <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted font-sans"
          >
            <Link to={`/call/${session.id}`}>View details</Link>
          </Button>
        )}
      </div>
     </div>
   );
 }