 import { format } from "date-fns";
import { Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { Session } from "@/types/dashboard";
 
 interface PastSessionCardProps {
   session: Session;
 }
 
 export function PastSessionCard({ session }: PastSessionCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"
        }`}
      />
    ));
  };

   return (
    <div className="group rounded-xl border border-border/40 bg-background p-5 transition-all duration-200 hover:border-border hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 shrink-0 border-2 border-background shadow-sm">
           <AvatarImage src={session.coachPhoto} alt={session.coachName} />
           <AvatarFallback>{session.coachName.charAt(0)}</AvatarFallback>
         </Avatar>
         
        <div className="flex-1 min-w-0 space-y-2">
           <div className="flex items-start justify-between gap-2">
             <div>
               <h3 className="font-medium text-foreground">{session.coachName}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{session.coachCredential}</p>
             </div>
            <Badge variant="secondary" className="shrink-0 bg-muted text-muted-foreground font-normal">
               {session.type}
             </Badge>
           </div>
           
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(session.date, "MMM d, yyyy")}</span>
          </div>
           
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
             {session.reviewed ? (
              <div className="flex items-center gap-1">{renderStars(session.rating || 0)}</div>
             ) : (
               <Button
                asChild
                 variant="outline"
                 size="sm"
                className="h-8 border-border text-foreground hover:bg-muted"
               >
                <Link to={`/review/${session.id}`}>Leave review</Link>
               </Button>
             )}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <Link to={`/coach/${session.coachId}`}>View coach</Link>
            </Button>
           </div>
         </div>
       </div>
     </div>
   );
 }