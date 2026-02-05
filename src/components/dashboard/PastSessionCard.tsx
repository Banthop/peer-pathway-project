 import { format } from "date-fns";
 import { Star } from "lucide-react";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { Session } from "@/types/dashboard";
 
 interface PastSessionCardProps {
   session: Session;
 }
 
 export function PastSessionCard({ session }: PastSessionCardProps) {
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
             {format(session.date, "MMM d, yyyy")}
           </p>
           
           <div className="mt-4">
             {session.reviewed ? (
               <div className="flex items-center gap-1">
                 {Array.from({ length: 5 }).map((_, i) => (
                   <Star
                     key={i}
                     className={`h-4 w-4 ${
                       i < (session.rating || 0)
                         ? "fill-foreground text-foreground"
                         : "text-muted-foreground/30"
                     }`}
                   />
                 ))}
               </div>
             ) : (
               <Button
                 variant="outline"
                 size="sm"
                 className="border-border text-foreground hover:bg-muted"
               >
                 Leave review
               </Button>
             )}
           </div>
         </div>
       </div>
     </div>
   );
 }