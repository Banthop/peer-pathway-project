import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NextSessionCard } from "@/components/dashboard/NextSessionCard";
import { NoSessionPrompt } from "@/components/dashboard/NoSessionPrompt";
import { CompactSessionRow } from "@/components/dashboard/CompactSessionRow";
import { PastSessionRow } from "@/components/dashboard/PastSessionRow";
import { ReviewNudge, BookingNudge } from "@/components/dashboard/ActionNudge";
import { RecommendedCoachCard } from "@/components/dashboard/RecommendedCoachCard";
import {
  upcomingSessions,
  pastSessions,
  recommendedCoaches,
} from "@/data/sampleBookings";
import { differenceInHours } from "date-fns";

export default function DashboardOverview() {
  // Next session: first upcoming within 48 hours
  const nextSession = upcomingSessions.find((s) => {
    const hours = differenceInHours(s.date, new Date());
    return hours <= 48 && hours >= -1;
  });

  // Additional upcoming sessions (beyond the hero one)
  const additionalSessions = nextSession
    ? upcomingSessions.filter((s) => s.id !== nextSession.id)
    : upcomingSessions;

  // Find first unreviewed past session for nudge
  const unreviewedSession = pastSessions.find((s) => !s.reviewed);

  const displayedPast = pastSessions.slice(0, 4);
  const hasMorePast = pastSessions.length > 4;

  return (
    <div className="px-6 py-8 md:px-10 lg:px-14 max-w-4xl space-y-10">
      {/* Greeting */}
      <h1 className="text-2xl font-medium text-foreground font-sans">Welcome back, Alex</h1>

      {/* Next Session (Hero Priority) */}
      {nextSession ? (
        <NextSessionCard session={nextSession} />
      ) : (
        <NoSessionPrompt />
      )}

      {/* Additional Upcoming Sessions — only if more than the hero */}
      {additionalSessions.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-foreground mb-2">Upcoming sessions</h2>
          <div className="rounded-lg border border-border bg-background divide-y divide-border px-5">
            {additionalSessions.map((session) => (
              <CompactSessionRow key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      {/* Action Nudge — one at a time */}
      {unreviewedSession ? (
        <ReviewNudge session={unreviewedSession} />
      ) : upcomingSessions.length === 0 ? (
        <BookingNudge />
      ) : null}

      {/* Past Sessions */}
      {displayedPast.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-foreground">Past sessions</h2>
            {hasMorePast && (
              <Link
                to="/dashboard/bookings?tab=past"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="rounded-lg border border-border bg-background divide-y divide-border px-5">
            {displayedPast.map((session) => (
              <PastSessionRow key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Coaches */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Coaches you might like</h2>
          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse all coaches <ArrowRight className="h-3 w-3" />
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
