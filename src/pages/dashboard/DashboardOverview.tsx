 import { Link } from "react-router-dom";
 import { Calendar, ArrowRight } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { SessionAlertBanner } from "@/components/dashboard/SessionAlertBanner";
 import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
 import { PastSessionCard } from "@/components/dashboard/PastSessionCard";
 import { RecommendedCoachCard } from "@/components/dashboard/RecommendedCoachCard";
 import { EmptyState } from "@/components/dashboard/EmptyState";
 import {
   upcomingSessions,
   pastSessions,
   recommendedCoaches,
 } from "@/data/sampleBookings";
 import { isToday, isTomorrow, differenceInHours } from "date-fns";
 
 export default function DashboardOverview() {
   // Check for sessions within 24 hours for the alert banner
   const imminentSession = upcomingSessions.find((session) => {
     const hoursUntil = differenceInHours(session.date, new Date());
     return hoursUntil <= 24 && hoursUntil >= 0;
   });
 
   const displayedPastSessions = pastSessions.slice(0, 3);
   const hasMorePastSessions = pastSessions.length > 3;
 
   return (
     <div className="px-6 py-8 md:px-8 lg:px-12 space-y-6">
       {/* Header */}
       <div>
         <h1 className="text-3xl font-light text-foreground font-sans">Welcome back, Alex</h1>
         <p className="mt-1 text-muted-foreground">Here's what's coming up</p>
       </div>
 
       {/* Alert Banner */}
       {imminentSession && (
         <div>
           <SessionAlertBanner session={imminentSession} />
         </div>
       )}
 
       {/* Upcoming Sessions */}
       <section className="rounded-lg border border-border bg-background p-5 shadow-sm">
         <h2 className="mb-4 text-lg font-medium text-foreground font-sans">Upcoming sessions</h2>
         {upcomingSessions.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2">
             {upcomingSessions.map((session) => (
               <UpcomingSessionCard key={session.id} session={session} />
             ))}
           </div>
         ) : (
           <EmptyState
             icon={Calendar}
             title="No sessions booked yet"
             description="Browse our coaches and book your first session to get started on your career journey."
             actionLabel="Browse coaches"
             actionHref="/"
           />
         )}
       </section>
 
       {/* Past Sessions */}
       <section className="rounded-lg border border-border bg-background p-5 shadow-sm">
         <div className="mb-4 flex items-center justify-between">
           <h2 className="text-lg font-medium text-foreground font-sans">Past sessions</h2>
           {hasMorePastSessions && (
             <Link
               to="/dashboard/bookings?tab=past"
               className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
             >
               View all <ArrowRight className="h-4 w-4" />
             </Link>
           )}
         </div>
         {displayedPastSessions.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {displayedPastSessions.map((session) => (
               <PastSessionCard key={session.id} session={session} />
             ))}
           </div>
         ) : (
           <p className="text-sm text-muted-foreground">No past sessions yet.</p>
         )}
       </section>
 
       {/* Recommended Coaches */}
       <section className="rounded-lg border border-border bg-background p-5 shadow-sm">
         <div className="mb-4 flex items-center justify-between">
           <h2 className="text-lg font-medium text-foreground font-sans">Coaches you might like</h2>
           <Link
             to="/"
             className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
           >
             Browse all coaches <ArrowRight className="h-4 w-4" />
           </Link>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
           {recommendedCoaches.map((coach) => (
             <RecommendedCoachCard key={coach.id} coach={coach} />
           ))}
         </div>
       </section>
     </div>
   );
 }