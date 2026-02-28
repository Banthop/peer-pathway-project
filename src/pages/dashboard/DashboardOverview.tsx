import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight,
  Copy,
  Check,
  Gift,
} from "lucide-react";
import { RescheduleModal } from "@/components/RescheduleModal";
import {
  allCoaches,
  upcomingSessions,
  pastBookings,
  deadlines,
  referralInfo,
} from "@/data/dashboardData";
import { CoachCard } from "@/components/dashboard/CoachCard";
import { freeEvents, userProfile } from "@/data/eventsData";

/* ─── tiny reusable pieces ──────────────────────────────────── */

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

/* ─── Sidebar Widgets (shared by both views) ────────────────── */

function SidebarDeadlines() {
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Upcoming Deadlines
      </h3>
      <div className="space-y-3.5">
        {deadlines.map((d) => (
          <Link
            key={d.id}
            to={`/dashboard/browse?category=${encodeURIComponent(d.category)}`}
            className="flex items-center gap-3 group"
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${d.urgency === "closing" ? "animate-pulse-dot" : ""
                }`}
              style={{ backgroundColor: d.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground group-hover:underline">
                {d.title}
              </p>
              <p className="text-[11px] text-muted-foreground">{d.timeLeft}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SidebarReferral() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralInfo.code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = referralInfo.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gradient-hero rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-4 h-4 text-white/70" />
        <h3 className="text-[13px] font-semibold">Invite friends, get £5</h3>
      </div>
      <p className="text-[11px] text-white/50 mb-3">
        Share your code. They get £5 off their first session, you get £5 credit.
      </p>
      <div className="bg-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wider">
          {referralInfo.code}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function SidebarActivity() {
  const totalSessions = pastBookings.length + upcomingSessions.length;
  const uniqueCoaches = new Set(
    [...pastBookings, ...upcomingSessions].map((s) => s.coach)
  ).size;
  const reviewCount = pastBookings.filter((s) => s.reviewed).length;

  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Your Activity
      </h3>
      <div className="flex gap-6">
        <div>
          <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
          <p className="text-[11px] text-muted-foreground">Sessions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{uniqueCoaches}</p>
          <p className="text-[11px] text-muted-foreground">Coaches</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{reviewCount}</p>
          <p className="text-[11px] text-muted-foreground">Reviews</p>
        </div>
      </div>
    </div>
  );
}

/* ─── New User View ─────────────────────────────────────────── */

function NewUserView() {
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const recommendedCoaches = allCoaches.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Main column */}
      <div className="space-y-8 min-w-0">
        {/* Get Started */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground italic mb-1">
            Get started
          </h2>
          <p className="text-sm text-muted-foreground font-light mb-5">
            Find your coach, book a free intro, and start getting ahead.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-background border border-border rounded-2xl p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/15 group/step">
              <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold mb-4 transition-transform duration-200 group-hover/step:scale-105">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Browse coaches
              </h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4 flex-1 font-light">
                Find someone who's been where you want to go
              </p>
              <Link
                to="/dashboard/browse"
                className="inline-flex items-center gap-1.5 bg-foreground text-background rounded-lg px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition-colors self-start"
              >
                Browse coaches <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-background border border-border rounded-2xl p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/15 group/step">
              <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold mb-4 transition-transform duration-200 group-hover/step:scale-105">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Book a free intro
              </h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed flex-1 font-light">
                15-minute call to see if they're the right fit. No charge
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-background border border-border rounded-2xl p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/15 group/step">
              <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold mb-4 transition-transform duration-200 group-hover/step:scale-105">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Start coaching
              </h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed flex-1 font-light">
                Book sessions or packages and get personalised help
              </p>
            </div>
          </div>
        </div>

        {/* Recommended for you */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Recommended for you
            </h2>
            <Link
              to="/dashboard/browse"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recommendedCoaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                hovered={hoveredCoach === coach.id}
                onHover={setHoveredCoach}
              />
            ))}
          </div>
        </div>

        {/* Recommended Events */}
        <RecommendedEvents />
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <SidebarDeadlines />
        <SidebarReferral />
      </div>
    </div>
  );
}

/* ─── Recommended Events (compact horizontal cards) ────────── */

function RecommendedEvents() {
  const recommendedEvents = freeEvents
    .filter((e) => userProfile.interests.includes(e.category))
    .slice(0, 3);

  if (recommendedEvents.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Recommended events for you
        </h2>
        <Link
          to="/dashboard/events"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-2.5">
        {recommendedEvents.map((event) => {
          const eventDate = new Date(event.date);
          const formatted = eventDate.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={event.id}
              className="bg-background border border-border rounded-xl overflow-hidden flex transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Compact gradient strip */}
              <div
                className={`w-24 sm:w-32 bg-gradient-to-br ${event.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wider [writing-mode:vertical-lr] rotate-180">
                  {event.category}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 px-4 py-3.5 flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-foreground truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span>{formatted}</span>
                    <span className="text-border">·</span>
                    <span>{event.time}</span>
                    <span className="text-border">·</span>
                    <span>{event.host.name}</span>
                  </div>
                </div>
                <Link
                  to="/dashboard/events"
                  className="bg-foreground text-background rounded-lg px-3.5 py-2 text-[11px] font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  Register
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Active User View ──────────────────────────────────────── */

function ActiveUserView() {
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const [hoveredPast, setHoveredPast] = useState<number | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState("");

  const unreviewedCount = pastBookings.filter((s) => !s.reviewed).length;
  const bookedCoaches = allCoaches.filter((c) => c.hasBooked);
  const unbookedCoaches = allCoaches.filter((c) => !c.hasBooked).slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Main column */}
      <div className="space-y-6 min-w-0">
        {/* UP NEXT Hero */}
        <div className="gradient-hero rounded-[14px] p-6 md:p-7 text-white">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
              Up next
            </span>
            <span className="bg-white/10 rounded-md px-3 py-1 text-[11px] font-semibold text-white">
              Tomorrow · 2:00 PM
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-base font-semibold text-white/60 flex-shrink-0">
                SK
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-0.5">
                  CV Review
                </h2>
                <p className="text-[13px] text-white/50">
                  with{" "}
                  <span className="text-white/80 font-medium">Sarah K.</span> ·
                  Goldman Sachs Spring Week '24
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tomorrow
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 45 min
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setRescheduleTarget("Sarah K."); setRescheduleOpen(true); }}
                className="text-xs text-white/40 hover:text-white/60 transition-colors border border-white/15 rounded-lg px-4 py-2 cursor-pointer"
              >
                Reschedule
              </button>
              <button className="bg-white text-[#111] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-1.5">
                Join call <ArrowRight className="w-3 h-3" />
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
              return (
                <div
                  key={session.id}
                  className="bg-background border border-border rounded-lg px-5 py-4 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                      {session.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {session.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          with {session.coach}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="w-[11px] h-[11px]" />
                        {session.date}
                        <span className="text-border mx-0.5">·</span>
                        <Clock className="w-[11px] h-[11px]" />
                        {session.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs ml-12 sm:ml-0">
                    {session.hasMessage && (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageSquare className="w-3 h-3" /> 1 new message
                      </span>
                    )}
                    <span
                      onClick={() => { setRescheduleTarget(session.coach); setRescheduleOpen(true); }}
                      className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      Reschedule
                    </span>
                    <Link
                      to="/dashboard/bookings"
                      className="text-foreground font-medium hover:underline"
                    >
                      View details ›
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Review Nudge */}
        {unreviewedCount > 0 && (
          <div className="border border-dashed border-border rounded-lg px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-[22px] h-[22px] rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-3 h-3 text-amber-500" />
              </div>
              <p className="text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">James L.</span>{" "}
                session on Jan 23, 2026. you haven't left a review yet
              </p>
            </div>
            <Link
              to="/dashboard/bookings?tab=past"
              className="bg-foreground text-background rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              Leave review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Your Coaches */}
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground mb-3">
            Your coaches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookedCoaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-background border border-border rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                  {coach.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {coach.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {coach.credential}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/dashboard/messages"
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-2.5 py-1.5"
                  >
                    <MessageSquare className="w-3 h-3" /> Message
                  </Link>
                  <Link
                    to={`/coach/${coach.slug}`}
                    className="text-[11px] font-semibold text-background bg-foreground rounded-md px-2.5 py-1.5 hover:bg-foreground/90 transition-colors whitespace-nowrap"
                  >
                    Book again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

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
              return (
                <div
                  key={session.id}
                  onMouseEnter={() => setHoveredPast(session.id)}
                  onMouseLeave={() => setHoveredPast(null)}
                  className={`px-5 py-4 flex items-center justify-between transition-colors duration-150 ${hoveredPast === session.id ? "bg-muted/50" : "bg-background"
                    } ${i < 2 ? "border-b border-border/50" : ""}`}
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coaches you might like */}
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
            {unbookedCoaches.map((coach) => (
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

      {/* Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <SidebarDeadlines />
        <SidebarReferral />
        <SidebarActivity />
      </div>

      <RescheduleModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        personName={rescheduleTarget}
      />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function DashboardOverview() {
  const [view, setView] = useState<"new" | "active">("new");

  return (
    <div className="w-full px-6 py-8 md:px-10 lg:px-12">
      {/* Header + Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-foreground mb-1">
            {view === "new" ? "Welcome to EarlyEdge" : "Welcome back, Alex"}
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            {view === "new"
              ? "Three steps to your first coaching session"
              : "Here's what's coming up"}
          </p>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5 self-start">
          <button
            onClick={() => setView("new")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${view === "new"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            New User
          </button>
          <button
            onClick={() => setView("active")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${view === "active"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Active User
          </button>
        </div>
      </div>

      {/* Seasonal Banner */}
      <div className="flex items-center justify-between bg-background border border-border rounded-xl px-5 py-3.5 mb-8">
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

      {/* View Content */}
      {view === "new" ? <NewUserView /> : <ActiveUserView />}
    </div>
  );
}
