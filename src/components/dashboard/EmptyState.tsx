 import type { LucideIcon } from "lucide-react";
 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 
 interface EmptyStateProps {
   icon: LucideIcon;
   title: string;
   description: string;
   actionLabel: string;
   actionHref: string;
 }
 
 export function EmptyState({
   icon: Icon,
   title,
   description,
   actionLabel,
   actionHref,
 }: EmptyStateProps) {
   return (
     <div className="flex flex-col items-center justify-center py-12 text-center">
       <div className="mb-4 rounded-full bg-muted p-4">
         <Icon className="h-8 w-8 text-muted-foreground" />
       </div>
       <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
       <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
       <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
         <Link to={actionHref}>{actionLabel}</Link>
       </Button>
     </div>
   );
 }