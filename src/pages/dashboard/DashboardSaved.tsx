 import { useState } from "react";
 import { Heart } from "lucide-react";
 import { SavedCoachCard } from "@/components/dashboard/SavedCoachCard";
 import { EmptyState } from "@/components/dashboard/EmptyState";
 import { savedCoaches as initialSavedCoaches } from "@/data/sampleBookings";
 import type { SavedCoach } from "@/types/dashboard";
 
 export default function DashboardSaved() {
   const [savedCoaches, setSavedCoaches] = useState<SavedCoach[]>(initialSavedCoaches);
 
   const handleUnsave = (coachId: string) => {
     setSavedCoaches((prev) => prev.filter((coach) => coach.id !== coachId));
   };
 
   return (
     <div className="px-6 py-8 md:px-8 lg:px-12">
       {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl font-light text-foreground">Saved Coaches</h1>
         <p className="mt-1 text-muted-foreground">
           Coaches you've saved for later
         </p>
       </div>
 
       {/* Coach Grid */}
       {savedCoaches.length > 0 ? (
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
           {savedCoaches.map((coach) => (
             <SavedCoachCard key={coach.id} coach={coach} onUnsave={handleUnsave} />
           ))}
         </div>
       ) : (
         <EmptyState
           icon={Heart}
           title="No saved coaches yet"
           description="When you find coaches you like, save them here for quick access later."
           actionLabel="Browse coaches"
           actionHref="/"
         />
       )}
     </div>
   );
 }