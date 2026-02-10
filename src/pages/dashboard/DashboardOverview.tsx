import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Clock } from "lucide-react";
import {
  allCoaches,
  upcomingSessions,
  pastBookings,
  categoryColorMap,
  streakInfo,
} from "@/data/dashboardData";
import { CoachCard } from "@/components/dashboard/CoachCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SessionChart } from "@/components/dashboard/SessionChart";
import { DeadlineTimeline } from "@/components/dashboard/DeadlineTimeline";
import { ReferralCard } from "@/components/dashboard/ReferralCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { TrendingCategories } from "@/components/dashboard/TrendingCategories";

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          style={{ width: size, height: size }}
          className={
            star <= rating
              ? "fill-foreground text-foreground"
              : "fill-none text-border"
          }
        />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const [hoveredPast, setHoveredPast] = useState<number | null>(null);

  const unreviewedCount = pastBookings.filter((s) => !s.reviewed).length;

  return (
    <div className="px-6 py-8 md:px-10 lg:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-serif font-normal tracking-tight text-foreground">
          Welcome back, Alex
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Here's what's coming up
        </p>
      </div>

      {/* Trending Categories */}
      <div className="mb-6">
        <TrendingCategories />
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ===== MAIN COLUMN ===== */}
        <div className="space-y-8 min-w-0">
          {/* Seasonal Alert */}
          <div className="bg-background border border-border rounded-lg px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                Spring Week season is open
              </span>{" "}
              — applications close in 6 weeks
            </p>
            <Link
              to="/dashboard/browse"
              className="text-[11px] font-semibold text-foreground hover:underline shrink-0"
            >
              View coaches →
            </Link>
          </div>

          {/* Hero — Next Session */}
          <div className="gradient-hero rounded-[14px] p-7 text-white">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                Up next
              </span>
              <span className="bg-white/10 rounded-md px-3 py-1 text-[11px] font-semibold text-white">
                Tomorrow · 2:00 PM
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-base font-semibold text-white/60">
                  SK
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight mb-1">
                    CV Review
                  </h2>
                  <p className="text-[13px] text-white/50">
                    with{" "}
                    <span className="text-white/80 font-medium">Sarah K.</span>{" "}
                    · Goldman Sachs Spring Week '24
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-white/30">
                      45 min session
                    </span>
                    <Link
                      to="/dashboard/messages"
                      className="text-xs text-white/30 underline underline-offset-2 decoration-white/20 hover:text-white/50 transition-colors"
                    >
                      Send a message
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  Reschedule
                </button>
                <button className="bg-white text-[#111] px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-white/90 transition-colors">
                  Join call →
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-semibold text-foreground">
                Upcoming
              </h2>
              <Link
                to="/dashboard/bookings"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all bookings →
              </Link>
            </div>
            {upcomingSessions
              .filter((s) => !s.isNext)
              .map((session) => {
                const catColor =
                  categoryColorMap[
                    allCoaches.find((c) => c.avatar === session.avatar)
                      ?.category || ""
                  ];
                return (
                  <div
                    key={session.id}
                    className="bg-background border border-border rounded-lg px-6 py-4 mb-2 flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    style={{
                      borderLeftWidth: "3px",
                      borderLeftColor: catColor || "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {session.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {session.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            with {session.coach}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Calendar className="w-[11px] h-[11px]" />
                          {session.date} at {session.time}
                          <span className="text-border mx-0.5">·</span>
                          <Clock className="w-[11px] h-[11px]" />
                          {session.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 text-xs">
                      {session.hasMessage && (
                        <span className="bg-muted rounded px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          1 new message
                        </span>
                      )}
                      <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                        Reschedule
                      </span>
                      <Link
                        to="/dashboard/bookings"
                        className="text-foreground font-medium hover:underline"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Review Nudge */}
          {unreviewedCount > 0 && (
            <div className="review-nudge-glow border border-dashed rounded-lg px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="w-3 h-3 text-accent-amber" />
                </div>
                <p className="text-[13px] text-muted-foreground">
                  {unreviewedCount === 1 ? (
                    <>
                      <span className="font-medium text-foreground">
                        James L.
                      </span>{" "}
                      session on Jan 23 — you haven't left a review yet
                    </>
                  ) : (
                    <>
                      You have{" "}
                      <span className="font-medium text-foreground">
                        {unreviewedCount} sessions
                      </span>{" "}
                      to review
                    </>
                  )}
                </p>
              </div>
              <Link
                to="/dashboard/bookings?tab=past"
                className="text-[13px] font-semibold text-foreground hover:underline"
              >
                {unreviewedCount === 1
                  ? "Leave review →"
                  : "Review sessions →"}
              </Link>
            </div>
          )}

          {/* Past Sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Past sessions
              </h2>
              <Link
                to="/dashboard/bookings?tab=past"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              {pastBookings.slice(0, 3).map((session, i) => {
                const coach = allCoaches.find(
                  (c) => c.avatar === session.avatar
                );
                const catColor =
                  categoryColorMap[coach?.category || ""] || "transparent";
                return (
                  <div
                    key={session.id}
                    onMouseEnter={() => setHoveredPast(session.id)}
                    onMouseLeave={() => setHoveredPast(null)}
                    className={`px-6 py-4 flex items-center justify-between transition-colors duration-150 ${
                      hoveredPast === session.id
                        ? "bg-muted/50"
                        : "bg-background"
                    } ${i < 2 ? "border-b border-border/50" : ""}`}
                    style={{
                      borderLeftWidth: "3px",
                      borderLeftColor: catColor,
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.coach}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.credential} · {session.type} · {session.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {session.reviewed ? (
                        <StarRating rating={session.rating!} size={13} />
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors">
                          Leave review
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium text-foreground cursor-pointer transition-opacity duration-200 ${
                          hoveredPast === session.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        Book again →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Coaches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Coaches you might like
              </h2>
              <Link
                to="/dashboard/browse"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse all coaches →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {allCoaches.slice(0, 4).map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  hovered={hoveredCoach === coach.id}
                  onHover={setHoveredCoach}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===== SIDEBAR COLUMN ===== */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          {/* Quick Stats */}
          <QuickStats />

          {/* Session Chart */}
          <SessionChart />

          {/* Streak / Progress */}
          <div className="bg-surface-elevated border border-border rounded-xl p-5">
            <div className="flex items-center gap-4">
              <ProgressRing
                value={streakInfo.sessionsThisMonth}
                max={streakInfo.goal}
                size={72}
                strokeWidth={5}
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    {streakInfo.sessionsThisMonth}/{streakInfo.goal}
                  </p>
                </div>
              </ProgressRing>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">
                  {streakInfo.currentStreak}-week streak
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Book 1 more session this month for a{" "}
                  {streakInfo.goal}-session streak
                </p>
                <p className="text-[11px] text-accent-blue mt-1.5">
                  Next session: {streakInfo.nextSession}
                </p>
              </div>
            </div>
          </div>

          {/* Deadlines */}
          <DeadlineTimeline />

          {/* Referral */}
          <ReferralCard />
        </div>
      </div>
    </div>
  );
}
