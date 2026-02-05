 import { Link } from "react-router-dom";
 import { Heart } from "lucide-react";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Button } from "@/components/ui/button";
 import type { SavedCoach } from "@/types/dashboard";
 
 interface SavedCoachCardProps {
   coach: SavedCoach;
   onUnsave?: (coachId: string) => void;
 }
 
 export function SavedCoachCard({ coach, onUnsave }: SavedCoachCardProps) {
   return (
     <div className="rounded-xl border border-border/40 bg-background p-4 transition-colors hover:border-border">
       <div className="flex items-start justify-between">
         <div className="flex items-start gap-4">
           <Avatar className="h-14 w-14">
             <AvatarImage src={coach.photo} alt={coach.name} />
             <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
           </Avatar>
           
           <div>
             <h3 className="font-medium text-foreground">{coach.name}</h3>
             <p className="text-sm text-muted-foreground">{coach.credential}</p>
             <p className="mt-1 text-sm font-medium text-foreground">
               £{coach.hourlyRate}/hr
             </p>
           </div>
         </div>
         
         <button
           onClick={() => onUnsave?.(coach.id)}
           className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
           aria-label="Unsave coach"
         >
           <Heart className="h-5 w-5 fill-foreground" />
         </button>
       </div>
       
       <div className="mt-4">
         <Button
           asChild
           variant="outline"
           size="sm"
           className="w-full border-border text-foreground hover:bg-muted"
         >
           <Link to={`/coach/${coach.id}`}>View profile</Link>
         </Button>
       </div>
     </div>
   );
 }