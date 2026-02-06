import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Clock, MessageCircle } from "lucide-react";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachEmily from "@/assets/coach-emily.jpg";
import coachJames from "@/assets/coach-james.jpg";

const upcomingSessions = [
  {
    id: 1,
    coach: "Sarah K.",
    credential: "Goldman Sachs Spring Week '24",
    type: "CV Review",
    date: "Tomorrow",
    time: "2:00 PM",
    duration: "45 min",
    avatar: "SK",
    photo: coachSarah,
    isNext: true,
  },
  {
    id: 2,
    coach: "David W.",
    credential: "McKinsey Summer Associate",
    type: "Mock Interview",
    date: "Sun, Feb 8",
    time: "10:00 AM",
    duration: "60 min",
    avatar: "DW",
    photo: coachDavid,
    isNext: false,
  },
];

const pastSessions = [
  {
    id: 1,
    coach: "Sarah K.",
    credential: "Goldman Sachs Spring Week '24",
    type: "Application Strategy",
    date: "Jan 30",
    rating: 5,
    reviewed: true,
  },
  {
    id: 2,
    coach: "James L.",
    credential: "Meta Software Engineer",
    type: "Coding Interview Prep",
    date: "Jan 23",
    rating: null,
    reviewed: false,
  },
  {
    id: 3,
    coach: "Emily R.",
    credential: "Clifford Chance Trainee",
    type: "LNAT Prep",
    date: "Jan 16",
    rating: 4,
    reviewed: true,
  },
];

const recommendedCoaches = [
  {
    id: 1,
    name: "Sarah K.",
    credential: "Goldman Sachs Incoming Analyst",
    uni: "Oxford '24",
    rating: 4.9,
    reviews: 47,
    tags: ["Investment Banking", "Spring Week", "CV Review"],
    rate: 50,
    avatar: "SK",
    photo: coachSarah,
    bio: "Landed Spring Weeks at Goldman & Citi. Helped 15+ friends get offers — I know exactly what recruiters look for.",
    sessions: 63,
    responseTime: "< 2 hrs",
    topReview: "Sarah completely rewrote my CV approach. Got a Goldman Spring Week offer 2 weeks later.",
    outcome: "Landed Goldman SW",
  },
  {
    id: 2,
    name: "David W.",
    credential: "McKinsey Summer Associate",
    uni: "Cambridge '23",
    rating: 5.0,
    reviews: 32,
    tags: ["Consulting", "Case Studies", "Strategy"],
    rate: 60,
    avatar: "DW",
    photo: coachDavid,
    bio: "Ex-McKinsey intern, now returning full-time. Cracked 20+ case interviews and can teach you the frameworks that actually work.",
    sessions: 48,
    responseTime: "< 1 hr",
    topReview: "Best case prep I've had. David's framework approach is miles ahead of any book.",
    outcome: "Landed BCG Internship",
  },
  {
    id: 3,
    name: "Emily R.",
    credential: "Clifford Chance Trainee",
    uni: "LSE '23",
    rating: 4.8,
    reviews: 28,
    tags: ["Law", "TC Applications", "LNAT"],
    rate: 45,
    avatar: "ER",
    photo: coachEmily,
    bio: "Secured vac schemes at 4 magic circle firms. Specialise in helping with commercial awareness and application forms.",
    sessions: 34,
    responseTime: "< 3 hrs",
    topReview: "Emily's commercial awareness prep was a game-changer for my Clifford Chance interview.",
    outcome: "Landed CC Vac Scheme",
  },
  {
    id: 4,
    name: "James L.",
    credential: "Meta Software Engineer",
    uni: "Imperial '22",
    rating: 4.9,
    reviews: 41,
    tags: ["Software Engineering", "Coding", "System Design"],
    rate: 55,
    avatar: "JL",
    photo: coachJames,
    bio: "SWE at Meta. Did 100+ LeetCode problems and went through the full tech interview loop — I'll get you interview-ready.",
    sessions: 52,
    responseTime: "< 2 hrs",
    topReview: "James' mock interviews are incredibly realistic. Passed my Meta phone screen first try.",
    outcome: "Landed Google Internship",
  },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          style={{ width: size, height: size }}
          className={star <= rating ? "fill-foreground text-foreground" : "fill-none text-border"}
        />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);

  return (
    <div className="px-6 py-8 md:px-10 lg:px-14 max-w-4xl space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-foreground font-sans">
          Welcome back, Alex
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's coming up
        </p>
      </div>

      {/* Next Session — Hero */}
      <section className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-medium text-foreground tracking-wide uppercase">
            Up next
          </span>
          <span className="text-sm text-muted-foreground">
            Tomorrow · 2:00 PM
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground overflow-hidden">
              <img src={coachSarah} alt="Sarah K." className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">CV Review</p>
              <p className="text-sm text-muted-foreground">
                with Sarah K. · Goldman Sachs Spring Week '24
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">45 min session</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reschedule
            </button>
            <Link
              to="/call/session-1"
              className="bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Join call →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Upcoming</h2>
          <Link
            to="/dashboard/bookings"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all bookings →
          </Link>
        </div>
        {upcomingSessions
          .filter((s) => !s.isNext)
          .map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-4 border-t border-border"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden">
                  <img src={session.photo} alt={session.coach} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {session.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      with {session.coach}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {session.date} at {session.time}
                    <span className="mx-1">·</span>
                    <Clock className="h-3 w-3" />
                    {session.duration}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
                  Reschedule
                </button>
                <Link
                  to={`/call/${session.id}`}
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
      </section>

      {/* Review Nudge */}
      <section className="flex items-center justify-between rounded-lg border border-border bg-background px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">James L.</span> session on Jan 23 — you haven't left a review yet
          </p>
        </div>
        <Link
          to="/review/session-4"
          className="text-sm font-medium text-foreground hover:underline shrink-0"
        >
          Leave review →
        </Link>
      </section>

      {/* Past Sessions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Past sessions</h2>
          <Link
            to="/dashboard/bookings?tab=past"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-background divide-y divide-border">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <p className="text-sm font-medium text-foreground">{session.coach}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.credential} · {session.type} · {session.date}
                </p>
              </div>
              <div className="shrink-0">
                {session.reviewed && session.rating ? (
                  <StarRating rating={session.rating} size={12} />
                ) : (
                  <Link
                    to={`/review/${session.id}`}
                    className="text-xs font-medium text-foreground hover:underline"
                  >
                    Leave review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Coaches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-foreground">Coaches you might like</h2>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse all coaches →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCoaches.map((coach) => (
            <div
              key={coach.id}
              onMouseEnter={() => setHoveredCoach(coach.id)}
              onMouseLeave={() => setHoveredCoach(null)}
              className={`rounded-xl border bg-background p-5 cursor-pointer transition-all duration-200 ${
                hoveredCoach === coach.id
                  ? "border-foreground/30 -translate-y-0.5 shadow-md"
                  : "border-border"
              }`}
            >
              {/* Top: Avatar + Name + Price */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden">
                    <img src={coach.photo} alt={coach.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{coach.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {coach.credential} · {coach.uni}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground">£{coach.rate}/hr</p>
              </div>

              {/* Bio */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {coach.bio}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-foreground text-foreground" />
                  <span className="text-foreground font-medium">{coach.rating}</span>
                  <span>({coach.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {coach.sessions} sessions
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Replies {coach.responseTime}
                </div>
              </div>

              {/* Review Snippet */}
              <div className="bg-muted rounded-lg px-3.5 py-2.5 mb-4">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{coach.topReview}"
                </p>
                <p className="text-xs font-medium text-foreground mt-1.5">
                  ✓ {coach.outcome}
                </p>
              </div>

              {/* Tags + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {coach.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/coach/${coach.id}`}
                  className="text-xs font-medium text-foreground hover:underline shrink-0 ml-3"
                >
                  View profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
