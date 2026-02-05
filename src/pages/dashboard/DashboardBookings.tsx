 import { useState } from "react";
 import { useSearchParams } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
 import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
 import { PastSessionCard } from "@/components/dashboard/PastSessionCard";
 import { EmptyState } from "@/components/dashboard/EmptyState";
 import { upcomingSessions, pastSessions } from "@/data/sampleBookings";
 
 export default function DashboardBookings() {
   const [searchParams] = useSearchParams();
   const defaultTab = searchParams.get("tab") || "upcoming";
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">(defaultTab as "upcoming" | "past");
 
   return (
     <div className="px-6 py-8 md:px-8 lg:px-12">
       {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl font-light text-foreground">My Bookings</h1>
         <p className="mt-1 text-muted-foreground">
           Manage your upcoming and past coaching sessions
         </p>
       </div>
 
      {/* Pill-style tabs */}
      <div className="mb-8">
        <div className="inline-flex rounded-full bg-muted p-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
           >
            <Clock className="h-4 w-4" />
             Upcoming
            {upcomingSessions.length > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "upcoming"
                    ? "bg-foreground text-background"
                    : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {upcomingSessions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === "past"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
           >
            <Calendar className="h-4 w-4" />
             Past
            {pastSessions.length > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "past"
                    ? "bg-foreground text-background"
                    : "bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {pastSessions.length}
              </span>
            )}
          </button>
        </div>
      </div>
 
      {/* Tab content */}
      {activeTab === "upcoming" && (
        <>
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
        </>
      )}
 
      {activeTab === "past" && (
        <>
          {pastSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
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
        </>
      )}
     </div>
   );
 }