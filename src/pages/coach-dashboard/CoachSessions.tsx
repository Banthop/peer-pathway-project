import { useState, useMemo } from "react";
import {
    Calendar, Clock, MessageSquare, Star, ArrowRight,
    ChevronLeft, ChevronRight,
} from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { SessionDetailPanel } from "@/components/coach-dashboard/SessionDetailPanel";
import { RescheduleModal } from "@/components/RescheduleModal";
import { useCoachBookings } from "@/hooks/useBookings";

/* ─── Calendar helper ───────────────────────────────────────── */

interface CalendarDay {
    day: number;
    sessions: any[];
    isToday: boolean;
    isCurrentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days: CalendarDay[] = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, sessions: [], isToday: false, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
        days.push({ day: d, sessions: [], isToday, isCurrentMonth: true });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, sessions: [], isToday: false, isCurrentMonth: false });
        }
    }
    return days;
}

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

interface CalendarViewProps {
    selectedDay: number | null;
    onSelectDay: (day: number | null) => void;
    upcomingDates: Date[];
    pastDates: Date[];
    currentMonth: number;
    currentYear: number;
    onMonthChange: (m: number, y: number) => void;
}

function CalendarView({ selectedDay, onSelectDay, upcomingDates, pastDates, currentMonth, currentYear, onMonthChange }: CalendarViewProps) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = getCalendarDays(currentYear, currentMonth);

    const prev = () => {
        if (currentMonth === 0) onMonthChange(11, currentYear - 1);
        else onMonthChange(currentMonth - 1, currentYear);
        onSelectDay(null);
    };
    const next = () => {
        if (currentMonth === 11) onMonthChange(0, currentYear + 1);
        else onMonthChange(currentMonth + 1, currentYear);
        onSelectDay(null);
    };

    const handleDayClick = (day: typeof days[0]) => {
        if (!day.isCurrentMonth) return;
        onSelectDay(selectedDay === day.day ? null : day.day);
    };

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-foreground">{monthNames[currentMonth]} {currentYear}</h3>
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
                    const todayObj = new Date(currentYear, currentMonth, day.day);
                    const hasUpcoming = day.isCurrentMonth && upcomingDates.some(d => isSameDay(d, todayObj));
                    const hasPast = day.isCurrentMonth && pastDates.some(d => isSameDay(d, todayObj));
                    const isSelected = day.isCurrentMonth && selectedDay === day.day;
                    return (
                        <button
                            key={i}
                            onClick={() => handleDayClick(day)}
                            className={`relative py-3 text-center text-sm rounded-lg transition-colors ${day.isToday && !isSelected ? "bg-foreground text-background font-bold" :
                                isSelected ? "bg-foreground/10 ring-1 ring-foreground font-semibold text-foreground" :
                                    day.isCurrentMonth ? "text-foreground hover:bg-muted/50 cursor-pointer" : "text-muted-foreground/40"
                                }`}
                            disabled={!day.isCurrentMonth}
                        >
                            {day.day}
                            {(hasUpcoming || hasPast) && !day.isToday && (
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                                    {hasUpcoming && <div className="w-1 h-1 rounded-full bg-foreground" />}
                                    {hasPast && <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />}
                                </div>
                            )}
                        </button>
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
    const { data: dbBookings = [] } = useCoachBookings("all");

    const mappedSessions = useMemo(() => {
        const upcoming: any[] = [];
        const past: any[] = [];
        const upcomingDates: Date[] = [];
        const pastDates: Date[] = [];

        dbBookings.forEach((b: any, i: number) => {
            if (b.status === "cancelled") return;

            const dateObj = parseISO(b.scheduled_at);
            const isPast = dateObj < new Date() || b.status === "completed";
            const sessionObj = {
                id: b.id,
                student: b.student?.name || "Unknown Student",
                avatar: b.student?.avatar_url || (b.student?.name ? b.student.name.substring(0, 2).toUpperCase() : "U"),
                type: b.type === "intro" ? "Intro Call" : b.type === "package_session" ? "Package Session" : "1:1 Session",
                date: format(dateObj, "EEE, dd MMM"),
                time: format(dateObj, "h:mm a"),
                duration: b.duration + " min",
                price: (b.price / 100),
                status: b.status,
                rating: b.status === "completed" ? 5 : null,
                reviewed: b.status === "completed" ? true : false,
                isNext: false,
                rawDate: dateObj,
                rawBooking: b
            };

            if (isPast) {
                past.push(sessionObj);
                pastDates.push(dateObj);
            } else {
                upcoming.push(sessionObj);
                upcomingDates.push(dateObj);
            }
        });

        // Sort upcoming oldest first
        upcoming.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
        // Sort past newest first
        past.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

        if (upcoming.length > 0) upcoming[0].isNext = true;

        if (upcoming.length === 0 && past.length === 0) {
            return { upcoming: [], past: [], upcomingDates: [], pastDates: [] };
        }

        return { upcoming, past, upcomingDates, pastDates };
    }, [dbBookings]);

    const { upcoming, past, upcomingDates, pastDates } = mappedSessions;

    const [tab, setTab] = useState<"upcoming" | "past" | "calendar">("upcoming");
    const [hoveredPast, setHoveredPast] = useState<string | number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState("");

    const now = new Date();
    const [calYear, setCalYear] = useState(now.getFullYear());
    const [calMonth, setCalMonth] = useState(now.getMonth());

    const openDetail = (session: any) => {
        setSelectedSession(session);
        setDetailOpen(true);
    };

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">My Sessions</h1>
                <p className="text-sm text-muted-foreground">
                    {upcoming.length} upcoming · {past.length} completed
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
                        {t === "upcoming" && ` (${upcoming.length})`}
                        {t === "past" && ` (${past.length})`}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {tab === "upcoming" && (
                <div className="space-y-3">
                    {upcoming.length === 0 ? (
                        <div className="text-center py-16 bg-background border border-border rounded-xl">
                            <p className="text-base font-medium text-foreground mb-2">No upcoming sessions</p>
                            <p className="text-sm text-muted-foreground">Share your profile to get booked by students</p>
                        </div>
                    ) : (
                        upcoming.map((session) => (
                            <div key={session.id} onClick={() => openDetail(session)} className="bg-background border border-border rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground border-2 border-border flex-shrink-0 overflow-hidden">
                                            {typeof session.avatar === "string" && session.avatar.includes("http") ? <img src={session.avatar} alt="avatar" className="w-full h-full object-cover" /> : session.avatar}
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
                                        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{session.status}</p>
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
                                    <button onClick={(e) => { e.stopPropagation(); }} className="px-4 py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3" /> Message
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setRescheduleTarget(session.student); setRescheduleOpen(true); }} className="px-4 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
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
                    {past.length === 0 ? (
                        <div className="text-center py-16 bg-background border border-border rounded-xl">
                            <p className="text-base font-medium text-foreground mb-2">No completed sessions</p>
                        </div>
                    ) : (
                        past.map((session, i) => (
                            <div
                                key={session.id}
                                onClick={() => openDetail(session)}
                                onMouseEnter={() => setHoveredPast(session.id)}
                                onMouseLeave={() => setHoveredPast(null)}
                                className={`bg-background border rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 cursor-pointer ${hoveredPast === session.id ? "border-border shadow-sm" : "border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden">
                                        {typeof session.avatar === "string" && session.avatar.includes("http") ? <img src={session.avatar} alt="avatar" className="w-full h-full object-cover" /> : session.avatar}
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
                        )))}
                </div>
            )}

            {tab === "calendar" && (
                <div className="max-w-[600px]">
                    <CalendarView
                        selectedDay={selectedDay}
                        onSelectDay={setSelectedDay}
                        upcomingDates={upcomingDates}
                        pastDates={pastDates}
                        currentMonth={calMonth}
                        currentYear={calYear}
                        onMonthChange={(m, y) => { setCalMonth(m); setCalYear(y); }}
                    />

                    {/* Sessions for selected day */}
                    {selectedDay !== null && (() => {
                        const targetDate = new Date(calYear, calMonth, selectedDay);
                        const dayUpcoming = upcoming.filter((s: any) => isSameDay(s.rawDate, targetDate));
                        const dayPast = past.filter((s: any) => isSameDay(s.rawDate, targetDate));
                        const hasAny = dayUpcoming.length > 0 || dayPast.length > 0;
                        return (
                            <div className="mt-4 bg-background border border-border rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Sessions on the {selectedDay}{selectedDay === 1 || selectedDay === 21 || selectedDay === 31 ? "st" : selectedDay === 2 || selectedDay === 22 ? "nd" : selectedDay === 3 || selectedDay === 23 ? "rd" : "th"}
                                </h4>
                                {!hasAny ? (
                                    <p className="text-sm text-muted-foreground">No sessions scheduled for this day.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {dayUpcoming.map((s: any) => (
                                            <div key={`u-${s.id}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground overflow-hidden">
                                                        {typeof s.avatar === "string" && s.avatar.includes("http") ? <img src={s.avatar} alt="avatar" className="w-full h-full object-cover" /> : s.avatar}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">{s.type}</span>
                                                        <span className="text-xs text-muted-foreground ml-2">with {s.student}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-semibold text-foreground">{s.time}</div>
                                                    <div className="text-[10px] text-muted-foreground">{s.duration}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {dayPast.map((s: any) => (
                                            <div key={`p-${s.id}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/20 opacity-70">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground overflow-hidden">
                                                        {typeof s.avatar === "string" && s.avatar.includes("http") ? <img src={s.avatar} alt="avatar" className="w-full h-full object-cover" /> : s.avatar}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">{s.type}</span>
                                                        <span className="text-xs text-muted-foreground ml-2">with {s.student}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">{s.time}</div>
                                                    <div className="text-[10px] text-muted-foreground">Completed</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            <SessionDetailPanel
                session={selectedSession}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
            <RescheduleModal
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
                personName={rescheduleTarget}
            />
        </div>
    );
}
