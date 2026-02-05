 import { Link } from "react-router-dom";
 import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import type { RecommendedCoach } from "@/types/dashboard";
 
 interface RecommendedCoachCardProps {
   coach: RecommendedCoach;
 }
 
 export function RecommendedCoachCard({ coach }: RecommendedCoachCardProps) {
   return (
     <div className="min-w-[280px] rounded-xl border border-border/40 bg-background p-4 transition-colors hover:border-border">
       <div className="flex items-start gap-4">
         <Avatar className="h-14 w-14">
           <AvatarImage src={coach.photo} alt={coach.name} />
           <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
         </Avatar>
         
         <div className="flex-1 min-w-0">
           <h3 className="font-medium text-foreground">{coach.name}</h3>
           <p className="text-sm text-muted-foreground">{coach.credential}</p>
           <p className="text-xs text-muted-foreground">{coach.year}</p>
         </div>
       </div>
       
       <div className="mt-3 flex flex-wrap gap-1.5">
         {coach.tags.slice(0, 3).map((tag) => (
           <Badge
             key={tag}
             variant="secondary"
             className="bg-muted text-xs font-normal text-muted-foreground"
           >
             {tag}
           </Badge>
         ))}
       </div>
       
       <div className="mt-4 flex items-center justify-between">
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