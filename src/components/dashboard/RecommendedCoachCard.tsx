 import { Link } from "react-router-dom";
import { Star } from "lucide-react";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { RecommendedCoach } from "@/types/dashboard";
 
 interface RecommendedCoachCardProps {
   coach: RecommendedCoach;
 }
 
 export function RecommendedCoachCard({ coach }: RecommendedCoachCardProps) {
   return (
    <div className="min-w-[280px] flex flex-col rounded-xl border border-border/40 bg-background p-5 transition-all duration-200 hover:border-border hover:shadow-md">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
           <AvatarImage src={coach.photo} alt={coach.name} />
           <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
         </Avatar>
         
         <div className="flex-1 min-w-0">
           <h3 className="font-medium text-foreground">{coach.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{coach.credential}</p>
           <p className="text-xs text-muted-foreground">{coach.year}</p>
          
          {/* Logo badges */}
          <div className="mt-2 flex items-center gap-2">
            {coach.universityLogo && (
              <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src={coach.universityLogo} 
                  alt="University" 
                  className="h-4 w-4 object-contain"
                />
              </div>
            )}
            {coach.companyLogo && (
              <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center overflow-hidden">
                <img 
                  src={coach.companyLogo} 
                  alt="Company" 
                  className="h-4 w-4 object-contain"
                />
              </div>
            )}
          </div>
         </div>
       </div>
      
      {/* Rating */}
      {coach.rating && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="h-4 w-4 fill-foreground text-foreground" />
          <span className="text-sm font-medium text-foreground">{coach.rating.toFixed(1)}</span>
          {coach.reviewCount && (
            <span className="text-sm text-muted-foreground">({coach.reviewCount})</span>
          )}
        </div>
      )}
       
       <div className="mt-3 flex flex-wrap gap-1.5">
         {coach.tags.slice(0, 3).map((tag) => (
           <Badge
             key={tag}
             variant="secondary"
            className="bg-muted text-xs font-normal text-foreground"
           >
             {tag}
           </Badge>
         ))}
       </div>
       
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
         <span className="text-sm font-medium text-foreground">
           £{coach.hourlyRate}/hr
         </span>
         <Button
           asChild
           size="sm"
           className="bg-foreground text-background hover:bg-foreground/90"
         >
           <Link to={`/coach/${coach.id}`}>View profile</Link>
         </Button>
       </div>
     </div>
   );
 }