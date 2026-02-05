 import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { SavedCoach } from "@/types/dashboard";
 
 interface SavedCoachCardProps {
   coach: SavedCoach;
   onUnsave?: (coachId: string) => void;
 }
 
 export function SavedCoachCard({ coach, onUnsave }: SavedCoachCardProps) {
   return (
    <div className="group rounded-lg border border-border bg-background p-4 transition-all duration-200 hover:shadow-md">
       <div className="flex items-start justify-between mb-3">
         <div className="flex items-start gap-3">
           <Avatar className="h-11 w-11 border-2 border-foreground">
             <AvatarImage src={coach.photo} alt={coach.name} />
             <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
           </Avatar>
           
          <div className="space-y-1">
             <h3 className="font-medium text-foreground font-sans text-sm">{coach.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{coach.credential}</p>
            
            {/* Logo badges */}
            <div className="flex items-center gap-2 pt-1">
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
         
         <button
           onClick={() => onUnsave?.(coach.id)}
          className="rounded-full p-1.5 text-muted-foreground transition-all duration-200 hover:text-foreground"
           aria-label="Unsave coach"
         >
           <Heart className="h-4 w-4 fill-current" />
         </button>
       </div>
       
      {/* Rating and tags */}
      <div className="space-y-2 mb-3">
        {coach.rating && (
          <div className="flex items-center gap-1.5">
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
      </div>
      
      {/* Actions */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-sm text-foreground">£{coach.hourlyRate}/hr</span>
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