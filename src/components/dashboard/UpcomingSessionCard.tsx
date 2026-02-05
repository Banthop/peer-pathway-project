 import { Link } from "react-router-dom";
 import { format, isToday, differenceInMinutes } from "date-fns";
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
       return `Today, ${session.time}`;
     }
     return `${format(session.date, "EEE, MMM d")}, ${session.time}`;
   };
 
   return (
     <div className="rounded-xl border border-border/40 bg-background p-4 transition-colors hover:border-border">
       <div className="flex items-start gap-4">
         <Avatar className="h-12 w-12">
           <AvatarImage src={session.coachPhoto} alt={session.coachName} />
           <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
         </Avatar>
         
         <div className="flex-1 min-w-0">
           <div className="flex items-start justify-between gap-2">
             <div>
               <h3 className="font-medium text-foreground">{session.coachName}</h3>
               <p className="text-sm text-muted-foreground">{session.coachCredential}</p>
             </div>
             <Badge variant="secondary" className="shrink-0 bg-muted text-foreground">
               {session.type}
             </Badge>
           </div>
           
           <p className="mt-2 text-sm text-muted-foreground">
             {formatDate()} · {session.duration}
           </p>
           
           <div className="mt-4 flex items-center gap-3">
             {showJoinButton ? (
               <Button
                 asChild
                 size="sm"
                 className="bg-foreground text-background hover:bg-foreground/90"
               >
                 <Link to={`/call/${session.id}`}>Join call</Link>
               </Button>
             ) : null}
             <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
               Reschedule
             </Button>
           </div>
         </div>
       </div>
     </div>
   );
 }