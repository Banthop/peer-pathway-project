import { useState } from "react";
import {
    Calendar, Clock, MessageSquare, Star, ArrowRight,
    ChevronLeft, ChevronRight,
} from "lucide-react";
import {
    upcomingCoachSessions, pastCoachSessions, getCalendarDays,
} from "@/data/coachDashboardData";

/* ─── Star Rating ───────────────────────────────────────────── */

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center" style={{ gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} style={{ width: size, height: size }}
                    className={i <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-none text-border"} />
            ))}
        </div>
    );
}

/* ─── Calendar View ─────────────────────────────────────────── */

function CalendarView() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = getCalendarDays(year, month);

    const prev = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); } };
    const next = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); } };

    // Map sessions to specific days (mock — put a few dots on some days)
    const sessionDays = new Set([3, 7, 8, 12, 14, 17, 19, 22, 25, 28]);
    const pastDays = new Set([1, 4, 6, 9, 11, 15]);

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-foreground">{monthNames[month]} {year}</h3>
                <div className="flex items-center gap-1">
                    <button onClick={prev} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={next} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
                {dayNames.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-0">
                {days.map((day, i) => {
                    const hasUpcoming = day.isCurrentMonth && sessionDays.has(day.day);
                    const hasPast = day.isCurrentMonth && pastDays.has(day.day);
                    return (
                        <div
                            key={i}
                            className={`relative py-3 text-center text-sm cursor-pointer rounded-lg transition-colors hover:bg-muted/50 ${day.isToday ? "bg-foreground text-background font-bold rounded-lg" :
                                    day.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40"
                                }`}
                        >
                            {day.day}
                            {(hasUpcoming || hasPast) && !day.isToday && (
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                                    {hasUpcoming && <div className="w-1 h-1 rounded-full bg-foreground" />}
                                    {hasPast && <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-foreground" /> Upcoming
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" /> Completed
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachSessions() {
    const [tab, setTab] = useState<"upcoming" | "past" | "calendar">("upcoming");
    const [hoveredPast, setHoveredPast] = useState<number | null>(null);

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">My Sessions</h1>
                <p className="text-sm text-muted-foreground">
                    {upcomingCoachSessions.length} upcoming · {pastCoachSessions.length} completed
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-6 border-b border-border">
                {(["upcoming", "past", "calendar"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 capitalize -mb-px ${tab === t
                            ? "border-foreground text-foreground font-semibold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}>
                        {t === "calendar" ? "Calendar" : t}
                        {t === "upcoming" && ` (${upcomingCoachSessions.length})`}
                        {t === "past" && ` (${pastCoachSessions.length})`}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {tab === "upcoming" && (
                <div className="space-y-3">
                    {upcomingCoachSessions.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-base font-medium text-foreground mb-2">No upcoming sessions</p>
                            <p className="text-sm text-muted-foreground">Share your profile to get booked by students</p>
                        </div>
                    ) : (
                        upcomingCoachSessions.map((session) => (
                            <div key={session.id} className="bg-background border border-border rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground border-2 border-border flex-shrink-0">
                                            {session.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-base font-semibold text-foreground">{session.type}</h3>
                                                {session.isNext && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-semibold">NEXT</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">with {session.student}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-bold text-foreground">£{session.price}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Confirmed</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-[11px] h-[11px]" /> {session.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-[11px] h-[11px]" /> {session.time} · {session.duration}
                                    </div>
                                </div>

                                <div className="flex gap-2.5 mt-4">
                                    {session.isNext && (
                                        <button className="px-5 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
                                            Join call <ArrowRight className="w-3 h-3" />
                                        </button>
                                    )}
                                    <button className="px-4 py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3" /> Message
                                    </button>
                                    <button className="px-4 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                        Reschedule
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === "past" && (
                <div className="space-y-2">
                    {pastCoachSessions.map((session, i) => (
                        <div
                            key={session.id}
                            onMouseEnter={() => setHoveredPast(session.id)}
                            onMouseLeave={() => setHoveredPast(null)}
                            className={`bg-background border rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 ${hoveredPast === session.id ? "border-border shadow-sm" : "border-border"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                                    {session.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">{session.type}</span>
                                        <span className="text-xs text-muted-foreground">with {session.student}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span>{session.date}</span>
                                        <span className="text-border">·</span>
                                        <span>{session.duration}</span>
                                        <span className="text-border">·</span>
                                        <span className="font-semibold text-foreground">£{session.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-14 sm:ml-0">
                                {session.reviewed && session.rating ? (
                                    <StarRating rating={session.rating} size={12} />
                                ) : (
                                    <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                                        Awaiting review
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === "calendar" && (
                <div className="max-w-[600px]">
                    <CalendarView />
                </div>
            )}
        </div>
    );
}
