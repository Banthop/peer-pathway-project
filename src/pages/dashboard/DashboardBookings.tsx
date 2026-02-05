 import { useState } from "react";
 import { useSearchParams } from "react-router-dom";
 import { Calendar } from "lucide-react";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
 import { PastSessionCard } from "@/components/dashboard/PastSessionCard";
 import { EmptyState } from "@/components/dashboard/EmptyState";
 import { upcomingSessions, pastSessions } from "@/data/sampleBookings";
 
 export default function DashboardBookings() {
   const [searchParams] = useSearchParams();
   const defaultTab = searchParams.get("tab") || "upcoming";
   const [activeTab, setActiveTab] = useState(defaultTab);
 
   return (
     <div className="px-6 py-8 md:px-8 lg:px-12">
       {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl font-light text-foreground">My Bookings</h1>
         <p className="mt-1 text-muted-foreground">
           Manage your upcoming and past coaching sessions
         </p>
       </div>
 
       {/* Tabs */}
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="mb-6 bg-muted">
           <TabsTrigger
             value="upcoming"
             className="data-[state=active]:bg-background data-[state=active]:text-foreground"
           >
             Upcoming
           </TabsTrigger>
           <TabsTrigger
             value="past"
             className="data-[state=active]:bg-background data-[state=active]:text-foreground"
           >
             Past
           </TabsTrigger>
         </TabsList>
 
         <TabsContent value="upcoming">
           {upcomingSessions.length > 0 ? (
             <div className="grid gap-4 md:grid-cols-2">
               {upcomingSessions.map((session) => (
                 <UpcomingSessionCard key={session.id} session={session} />
               ))}
             </div>
           ) : (
             <EmptyState
               icon={Calendar}
               title="No upcoming sessions"
               description="You don't have any sessions scheduled. Browse our coaches to book your next session."
               actionLabel="Browse coaches"
               actionHref="/"
             />
           )}
         </TabsContent>
 
         <TabsContent value="past">
           {pastSessions.length > 0 ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {pastSessions.map((session) => (
                 <PastSessionCard key={session.id} session={session} />
               ))}
             </div>
           ) : (
             <EmptyState
               icon={Calendar}
               title="No past sessions"
               description="Once you've completed coaching sessions, they'll appear here."
               actionLabel="Browse coaches"
               actionHref="/"
             />
           )}
         </TabsContent>
       </Tabs>
     </div>
   );
 }