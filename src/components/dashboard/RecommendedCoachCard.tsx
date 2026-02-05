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
    <div className="min-w-[260px] flex flex-col rounded-lg border-2 border-foreground/20 bg-background p-4 transition-all duration-200 hover:border-foreground/40">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-11 w-11 border-2 border-foreground">
           <AvatarImage src={coach.photo} alt={coach.name} />
           <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
         </Avatar>
         
         <div className="flex-1 min-w-0">
           <h3 className="font-medium text-foreground font-sans text-sm">{coach.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{coach.credential}</p>
          
          {/* Logo badges */}
          <div className="mt-2 flex items-center gap-2">
            {coach.universityLogo && (
              <div className="h-5 w-5 rounded border border-border bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src={coach.universityLogo} 
                  alt="University" 
                  className="h-3.5 w-3.5 object-contain"
                />
              </div>
            )}
            {coach.companyLogo && (
              <div className="h-5 w-5 rounded border border-border bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src={coach.companyLogo} 
                  alt="Company" 
                  className="h-3.5 w-3.5 object-contain"
                />
              </div>
            )}
          </div>
         </div>
       </div>
      
      {/* Rating */}
      {coach.rating && (
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="h-4 w-4 fill-foreground text-foreground" />
          <span className="text-sm text-foreground">{coach.rating.toFixed(1)}</span>
          {coach.reviewCount && (
            <span className="text-sm text-muted-foreground">({coach.reviewCount})</span>
          )}
        </div>
      )}
       
       <div className="flex flex-wrap gap-1.5">
         {coach.tags.slice(0, 3).map((tag) => (
           <Badge
             key={tag}
             variant="outline"
            className="border-border text-xs font-normal text-muted-foreground"
           >
             {tag}
           </Badge>
         ))}
       </div>
       
      <div className="mt-auto pt-3 flex items-center justify-between border-t border-border">
         <span className="text-sm text-foreground">
           £{coach.hourlyRate}/hr
         </span>
         <Button
           asChild
           size="sm"
           className="bg-foreground text-background hover:bg-foreground/90 font-sans h-8 text-xs"
         >
           <Link to={`/coach/${coach.id}`}>View profile</Link>
         </Button>
       </div>
     </div>
   );
 }