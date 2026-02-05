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
    <div className="group rounded-xl border border-border/40 bg-background p-5 transition-all duration-200 hover:border-border hover:shadow-md">
       <div className="flex items-start justify-between">
         <div className="flex items-start gap-4">
           <Avatar className="h-14 w-14">
             <AvatarImage src={coach.photo} alt={coach.name} />
             <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
           </Avatar>
           
          <div className="space-y-1">
             <h3 className="font-medium text-foreground">{coach.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{coach.credential}</p>
            
            {/* Logo badges */}
            <div className="flex items-center gap-2 pt-1">
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
         
         <button
           onClick={() => onUnsave?.(coach.id)}
          className="rounded-full p-2 text-foreground transition-all duration-200 hover:bg-muted hover:scale-110"
           aria-label="Unsave coach"
         >
           <Heart className="h-5 w-5 fill-foreground" />
         </button>
       </div>
       
      {/* Rating and tags */}
      <div className="mt-4 space-y-3">
        {coach.rating && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-foreground text-foreground" />
            <span className="text-sm font-medium text-foreground">{coach.rating.toFixed(1)}</span>
            {coach.reviewCount && (
              <span className="text-sm text-muted-foreground">({coach.reviewCount} reviews)</span>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1.5">
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
      </div>
      
      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">£{coach.hourlyRate}/hr</span>
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