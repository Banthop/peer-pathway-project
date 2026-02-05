 import { Info } from "lucide-react";
 import { Link } from "react-router-dom";
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
     <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
       <div className="flex items-center gap-3">
         <div className="rounded-full bg-background p-2">
           <Info className="h-4 w-4 text-foreground" />
         </div>
         <p className="text-sm text-foreground">
           You have a session with <span className="font-medium">{session.coachName}</span>{" "}
           {getDateText()}
         </p>
       </div>
       <Button
         asChild
         size="sm"
         className="bg-foreground text-background hover:bg-foreground/90"
       >
         <Link to={`/call/${session.id}`}>Join call</Link>
       </Button>
     </div>
   );
 }