import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Calendar, Clock } from "lucide-react";
import { upcomingSessions, pastBookings, allCoaches, categoryColorMap } from "@/data/dashboardData";

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

  return (
    <div className="px-6 py-8 md:px-10 lg:px-12 max-w-[1000px]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-serif font-normal tracking-tight text-foreground">
          My Bookings
        </h1>
      </div>

      {/* Segmented Control Tabs */}
      <div className="inline-flex bg-muted rounded-lg p-1 mb-7">
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
          {upcomingSessions.map((session) => {
            const coach = allCoaches.find((c) => c.avatar === session.avatar);
            const catColor = categoryColorMap[coach?.category || ""] || "transparent";
            return (
              <div
                key={session.id}
                className="bg-background border border-border rounded-xl px-7 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: catColor,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center text-[15px] font-semibold text-muted-foreground">
                      {session.avatar}
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-tight text-foreground">
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
                  {session.isNext && (
                    <span className="text-xs font-medium text-accent-blue">
                      Starts tomorrow
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5 mt-4">
                  {session.isNext && (
                    <button className="px-5 py-2 bg-foreground text-background rounded-md text-xs font-semibold hover:opacity-90 transition-opacity">
                      Join call →
                    </button>
                  )}
                  <Link
                    to="/dashboard/messages"
                    className="px-5 py-2 bg-background text-foreground border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Message coach
                  </Link>
                  <button className="px-5 py-2 bg-background text-muted-foreground border border-border rounded-md text-xs font-medium hover:text-foreground transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Tab */}
      {bookingsTab === "past" && (
        <div className="flex flex-col gap-2.5">
          {pastBookings.map((session) => {
            const coach = allCoaches.find((c) => c.avatar === session.avatar);
            const catColor = categoryColorMap[coach?.category || ""] || "transparent";
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
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: catColor,
                }}
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
                        <span className="text-border">·</span>
                        £{session.price}
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
                        hoveredPast === session.id ? "opacity-100" : "opacity-0"
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
  );
}
