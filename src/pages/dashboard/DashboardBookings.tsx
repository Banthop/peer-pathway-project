import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import {
  upcomingSessions,
  pastBookings,
} from "@/data/dashboardData";
import { BookingsCalendar } from "@/components/dashboard/BookingsCalendar";

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

export default function DashboardBookings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "upcoming";
  const [bookingsTab, setBookingsTab] = useState<"upcoming" | "past">(
    defaultTab as "upcoming" | "past"
  );
  const [hoveredPast, setHoveredPast] = useState<number | null>(null);

  const nextSession = upcomingSessions.find((s) => s.isNext);
  const otherUpcoming = upcomingSessions.filter((s) => !s.isNext);

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="px-6 pt-8 pb-0 md:px-10 lg:px-12">
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground mb-1">
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your upcoming and past coaching sessions
        </p>
      </div>

      {/* Seasonal Banner */}
      <div className="px-6 md:px-10 lg:px-12 mt-5">
        <div className="flex items-center justify-between bg-background border border-border rounded-xl px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-background" />
            </div>
            <p className="text-sm text-foreground">
              <span className="font-medium">Spring Week season is open</span>
              <span className="text-muted-foreground">
                {" "}
               . applications close in 6 weeks
              </span>
            </p>
          </div>
          <Link
            to="/dashboard/browse"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline whitespace-nowrap"
          >
            View coaches <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="px-6 md:px-10 lg:px-12 mt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Bookings */}
          <div>
            {/* Segmented Control Tabs */}
            <div className="inline-flex bg-muted rounded-lg p-1 mb-6">
              {(["upcoming", "past"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBookingsTab(tab)}
                  className={`px-5 py-2 text-[13px] capitalize font-sans rounded-md transition-all duration-200 ${
                    bookingsTab === tab
                      ? "bg-background text-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}{" "}
                  {tab === "upcoming" && `(${upcomingSessions.length})`}
                  {tab === "past" && `(${pastBookings.length})`}
                </button>
              ))}
            </div>

            {/* Upcoming Tab */}
            {bookingsTab === "upcoming" && (
              <div className="flex flex-col gap-3">
                {/* Next Session. dark hero card */}
                {nextSession && (
                  <div className="gradient-hero rounded-[14px] p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                        Next session
                      </span>
                      <span className="bg-white/10 rounded-md px-3 py-1 text-[11px] font-semibold text-white">
                        {nextSession.date} · {nextSession.time}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-[48px] h-[48px] rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-base font-semibold text-white/60 flex-shrink-0">
                          {nextSession.avatar}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight mb-0.5">
                            {nextSession.type}
                          </h2>
                          <p className="text-[13px] text-white/50">
                            with{" "}
                            <span className="text-white/80 font-medium">
                              {nextSession.coach}
                            </span>{" "}
                            · {nextSession.credential}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{" "}
                              {nextSession.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {nextSession.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {nextSession.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-white/40 hover:text-white/60 transition-colors border border-white/15 rounded-lg px-4 py-2">
                          Reschedule
                        </button>
                        <button className="bg-white text-[#111] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-1.5">
                          Join call <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other upcoming sessions. standard white cards */}
                {otherUpcoming.map((session) => (
                  <div
                    key={session.id}
                    className="bg-background border border-border rounded-xl px-6 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-muted border-2 border-border flex items-center justify-center text-sm font-semibold text-muted-foreground">
                          {session.avatar}
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold tracking-tight text-foreground">
                            {session.type}
                          </p>
                          <p className="text-[13px] text-muted-foreground mt-0.5">
                            with {session.coach} · {session.credential}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          £{session.price}
                        </p>
                        <p className="text-[11px] text-accent-emerald font-medium mt-0.5">
                          Confirmed
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-[11px] h-[11px]" />
                        {session.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-[11px] h-[11px]" />
                        {session.time} · {session.duration}
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-4">
                      <button className="px-5 py-2 bg-background text-muted-foreground border border-border rounded-md text-xs font-medium hover:text-foreground transition-colors">
                        Reschedule
                      </button>
                      <Link
                        to="/dashboard/messages"
                        className="px-5 py-2 bg-background text-foreground border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3 h-3" /> Message
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Tab */}
            {bookingsTab === "past" && (
              <div className="flex flex-col gap-2.5">
                {pastBookings.map((session) => {
                  return (
                    <div
                      key={session.id}
                      onMouseEnter={() => setHoveredPast(session.id)}
                      onMouseLeave={() => setHoveredPast(null)}
                      className={`bg-background border rounded-xl px-6 py-5 transition-all duration-150 ${
                        hoveredPast === session.id
                          ? "border-foreground/20 -translate-y-0.5 shadow-sm"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[13px] font-semibold text-muted-foreground">
                            {session.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {session.type}{" "}
                              <span className="font-normal text-muted-foreground">
                                with {session.coach}
                              </span>
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {session.date}
                              <span className="text-border">·</span>£
                              {session.price}
                              <span className="text-border">·</span>
                              {session.credential}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                          {session.reviewed ? (
                            <StarRating rating={session.rating!} size={13} />
                          ) : (
                            <button className="px-3.5 py-1.5 bg-foreground text-background rounded-md text-[11px] font-semibold hover:opacity-90 transition-opacity">
                              Leave review
                            </button>
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Calendar Widget */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <BookingsCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
