import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Star, Calendar, Clock, ArrowRight, TrendingUp,
    Users, Eye, DollarSign, MessageSquare, ExternalLink, Zap,
} from "lucide-react";
import { format, parseISO, isSameDay, isSameMonth, subMonths } from "date-fns";
import { SessionDetailPanel } from "@/components/coach-dashboard/SessionDetailPanel";
import { RescheduleModal } from "@/components/RescheduleModal";
import { useCoachBookings } from "@/hooks/useBookings";
import { useCoachProfile } from "@/hooks/useCoachProfile";
import { useCoachReviews } from "@/hooks/useReviews";

/* ─── Tiny reusable pieces ──────────────────────────────────── */

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center" style={{ gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    style={{ width: size, height: size }}
                    className={i <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-none text-border"}
                />
            ))}
        </div>
    );
}

function StatCard({ label, value, change, icon: Icon, prefix = "", tooltip }: {
    label: string; value: string | number; change?: number;
    icon: React.ElementType; prefix?: string; tooltip?: string;
}) {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div
            className="relative bg-background border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {tooltip && showTooltip && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-foreground text-background text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
                    {tooltip}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                </div>
            )}
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">{prefix}{value}</span>
                {change !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {change >= 0 ? "+" : ""}{change}%
                    </span>
                )}
            </div>
        </div>
    );
}

/* ─── Earnings Mini Chart ───────────────────────────────────── */

function EarningsMiniChart({ monthlyEarnings }: { monthlyEarnings: { shortMonth: string, amount: number }[] }) {
    const defaultMonths = [
        { shortMonth: format(subMonths(new Date(), 2), "MMM"), amount: 0 },
        { shortMonth: format(subMonths(new Date(), 1), "MMM"), amount: 0 },
        { shortMonth: format(new Date(), "MMM"), amount: 0 },
    ];
    const chartData = monthlyEarnings.length > 0 ? monthlyEarnings.slice(-6) : defaultMonths;
    const maxAmount = Math.max(...chartData.map((m) => m.amount), 100);

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">Earnings Overview</h3>
                <Link to="/coach-dashboard/earnings" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    See details →
                </Link>
            </div>
            <div className="flex items-end gap-3 h-[140px]">
                {chartData.map((m, i) => {
                    const height = (m.amount / maxAmount) * 100;
                    const isLast = i === chartData.length - 1;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-semibold text-muted-foreground">£{m.amount.toLocaleString()}</span>
                            <div className="w-full relative flex-1 flex items-end">
                                <div
                                    className={`w-full rounded-t-md transition-all duration-500 ${isLast ? "bg-foreground" : "bg-muted"}`}
                                    style={{ height: `${height}%`, minHeight: 8 }}
                                />
                            </div>
                            <span className={`text-[11px] font-medium ${isLast ? "text-foreground" : "text-muted-foreground"}`}>
                                {m.shortMonth}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Sidebar Widgets ───────────────────────────────────────── */

function TodayScheduleWidget({ schedule }: { schedule: any[] }) {
    return (
        <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Today's Schedule
            </h3>
            {schedule.length === 0 ? (
                <p className="text-xs text-muted-foreground">No sessions today</p>
            ) : (
                <div className="space-y-3">
                    {schedule.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="text-[11px] font-semibold text-foreground w-16 shrink-0 pt-0.5">{s.time}</div>
                            <div className="flex-1 border-l-2 border-foreground/15 pl-3">
                                <p className="text-xs font-medium text-foreground">{s.type}</p>
                                <p className="text-[11px] text-muted-foreground">{s.student} · {s.duration}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PayoutWidget({ pendingPayout }: { pendingPayout: number }) {
    return (
        <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Next Payout
            </h3>
            <div className="flex items-end gap-2 mb-1">
                <span className="text-xl font-bold text-foreground">£{pendingPayout.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground mb-0.5">pending</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">Expected End of month</p>
            <Link
                to="/coach-dashboard/earnings"
                className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
            >
                View earnings <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}

function QuickActionsWidget({ coachSlug }: { coachSlug: string }) {
    return (
        <div className="bg-background border border-border rounded-xl p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Quick Actions
            </h3>
            <div className="space-y-2">
                <Link
                    to="/coach-dashboard/edit-profile"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                    Edit Profile
                </Link>
                <Link
                    to={`/coach/${coachSlug}`}
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5" /> View Public Profile
                </Link>
                <Link
                    to="/coach-dashboard/sessions"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <Calendar className="w-3.5 h-3.5" /> Manage Availability
                </Link>
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachOverview() {
    const { data: dbBookings = [] } = useCoachBookings("all");
    const { data: profile } = useCoachProfile();
    const { data: reviewsData = [] } = useCoachReviews();

    const [hoveredPast, setHoveredPast] = useState<string | number | null>(null);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState("");
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const stats = useMemo(() => {
        let totalEarningsAllTime = 0;
        let totalEarningsThisMonth = 0;
        let totalEarningsLastMonth = 0;
        let sessionsThisMonth = 0;
        let sessionsLastMonth = 0;
        let sessionsAllTime = 0;
        let pendingPayout = 0;

        const now = new Date();
        const lastMonth = subMonths(now, 1);
        const monthlyMap = new Map<string, number>();

        const upcoming: any[] = [];
        const past: any[] = [];
        const todaySchedule: any[] = [];

        dbBookings.forEach((b: any, i: number) => {
            const dateObj = parseISO(b.scheduled_at);
            const revenue = (b.price - (b.commission_amount || 0)) / 100;

            // Stats parsing
            if (b.status === "completed") {
                totalEarningsAllTime += revenue;
                sessionsAllTime++;
                if (isSameMonth(dateObj, now)) {
                    totalEarningsThisMonth += revenue;
                    sessionsThisMonth++;
                }
                if (isSameMonth(dateObj, lastMonth)) {
                    totalEarningsLastMonth += revenue;
                    sessionsLastMonth++;
                }

                const shortMonth = format(dateObj, "MMM");
                monthlyMap.set(shortMonth, (monthlyMap.get(shortMonth) || 0) + revenue);
            } else if (b.status === "confirmed") {
                pendingPayout += revenue;
            }

            if (b.status === "cancelled") return;

            // Session object parsing
            const isPast = dateObj < now || b.status === "completed";
            const sessionObj = {
                id: b.id,
                student: b.student?.name || "Unknown Student",
                avatar: b.student?.avatar_url || (b.student?.name ? b.student.name.substring(0, 2).toUpperCase() : "U"),
                type: b.type === "intro" ? "Intro Call" : b.type === "package_session" ? "Package Session" : "1:1 Session",
                date: isSameDay(dateObj, now) ? 'Today' : isSameDay(dateObj, new Date(now.getTime() + 86400000)) ? 'Tomorrow' : format(dateObj, "EEE, dd MMM"),
                time: format(dateObj, "h:mm a"),
                duration: b.duration + " min",
                price: (b.price / 100).toLocaleString(),
                status: b.status,
                rating: b.status === "completed" ? 5 : null,
                reviewed: b.status === "completed" ? true : false,
                isNext: false,
                rawDate: dateObj,
                rawBooking: b
            };

            if (isPast) {
                past.push(sessionObj);
            } else {
                upcoming.push(sessionObj);
                if (isSameDay(dateObj, now)) {
                    todaySchedule.push(sessionObj);
                }
            }
        });

        upcoming.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
        past.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        todaySchedule.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        if (upcoming.length > 0) upcoming[0].isNext = true;

        let earningsChange = 0;
        if (totalEarningsLastMonth > 0) earningsChange = Math.round(((totalEarningsThisMonth - totalEarningsLastMonth) / totalEarningsLastMonth) * 100);
        else if (totalEarningsThisMonth > 0) earningsChange = 100;

        let sessionsChange = 0;
        if (sessionsLastMonth > 0) sessionsChange = Math.round(((sessionsThisMonth - sessionsLastMonth) / sessionsLastMonth) * 100);
        else if (sessionsThisMonth > 0) sessionsChange = 100;

        const monthlyStats = [];
        for (let i = 5; i >= 0; i--) {
            const mDate = subMonths(now, i);
            const shortMonth = format(mDate, "MMM");
            monthlyStats.push({
                shortMonth,
                amount: monthlyMap.get(shortMonth) || 0
            });
        }

        return {
            totalEarningsAllTime,
            totalEarningsThisMonth,
            earningsChange,
            sessionsThisMonth,
            sessionsAllTime,
            sessionsChange,
            pendingPayout,
            monthlyStats,
            upcoming,
            past,
            todaySchedule,
            // Mock stats for missing DB tables
            averageRating: 5.0,
            totalReviews: past.length > 0 ? 1 : 0,
            profileViews: 124,
            viewsChange: 12
        };
    }, [dbBookings]);

    const openDetail = (session: any) => {
        setSelectedSession(session);
        setDetailOpen(true);
    };

    const nextSession = stats.upcoming.find((s) => s.isNext);

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground mb-1">
                    Welcome back, {profile?.user?.name || "Coach"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here's how your coaching is going
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                {/* Main Column */}
                <div className="space-y-6 min-w-0">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard label="Earnings" value={stats.totalEarningsThisMonth.toLocaleString()} change={stats.earningsChange} icon={DollarSign} prefix="£" tooltip={`£${stats.totalEarningsThisMonth.toLocaleString()} this month · £${stats.totalEarningsAllTime.toLocaleString()} all time`} />
                        <StatCard label="Sessions" value={stats.sessionsThisMonth} change={stats.sessionsChange} icon={Calendar} tooltip={`${stats.sessionsThisMonth} this month · ${stats.sessionsAllTime} all time`} />
                        <StatCard label="Rating" value={stats.averageRating} icon={Star} tooltip={`Based on ${stats.totalReviews} reviews`} />
                        <StatCard label="Profile Views" value={stats.profileViews} change={stats.viewsChange} icon={Eye} tooltip={`${stats.profileViews} views this month`} />
                    </div>

                    {/* UP NEXT Hero */}
                    {nextSession && (
                        <div className="gradient-hero rounded-[14px] p-6 md:p-7 text-white">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">Up next</span>
                                <span className="bg-white/10 rounded-md px-3 py-1 text-[11px] font-semibold text-white">
                                    {nextSession.date} · {nextSession.time}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-[48px] h-[48px] rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-base font-semibold text-white/60 flex-shrink-0 overflow-hidden">
                                        {typeof nextSession.avatar === 'string' && nextSession.avatar.includes('http') ? <img src={nextSession.avatar} alt="avatar" className="w-full h-full object-cover" /> : nextSession.avatar}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight mb-0.5">{nextSession.type}</h2>
                                        <p className="text-[13px] text-white/50">
                                            with <span className="text-white/80 font-medium">{nextSession.student}</span>
                                        </p>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {nextSession.duration}</span>
                                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> £{nextSession.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setRescheduleTarget(nextSession.student); setRescheduleOpen(true); }}
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
                    )}

                    {/* Upcoming Sessions */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[13px] font-semibold text-foreground">Upcoming Sessions</h2>
                            <Link to="/coach-dashboard/sessions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                View all →
                            </Link>
                        </div>
                        {stats.upcoming.filter((s) => !s.isNext).slice(0, 3).length === 0 ? (
                            <div className="bg-background border border-border rounded-lg px-5 py-4 text-center text-sm text-muted-foreground">
                                No other upcoming sessions
                            </div>
                        ) : stats.upcoming.filter((s) => !s.isNext).slice(0, 3).map((session) => {
                            const isSoon = session.date === "Tomorrow" || session.date === "Today";
                            return (
                                <div
                                    key={session.id}
                                    onClick={() => openDetail(session)}
                                    className={`bg-background border rounded-lg px-5 py-4 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${isSoon ? "border-foreground/30 ring-1 ring-foreground/5" : "border-border"
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0 overflow-hidden">
                                            {typeof session.avatar === 'string' && session.avatar.includes('http') ? <img src={session.avatar} alt="avatar" className="w-full h-full object-cover" /> : session.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-foreground">{session.type}</span>
                                                <span className="text-xs text-muted-foreground">with {session.student}</span>
                                                {isSoon && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-semibold flex items-center gap-1">
                                                        <Zap className="w-2.5 h-2.5" /> Starting soon
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                <Calendar className="w-[11px] h-[11px]" /> {session.date}
                                                <span className="text-border mx-0.5">·</span>
                                                <Clock className="w-[11px] h-[11px]" /> {session.time}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs ml-12 sm:ml-0">
                                        <span className="font-semibold text-foreground">£{session.price}</span>
                                        <button onClick={(e) => { e.stopPropagation(); }} className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" /> Message
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setRescheduleTarget(session.student); setRescheduleOpen(true); }} className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                            Reschedule
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Earnings Chart */}
                    <EarningsMiniChart monthlyEarnings={stats.monthlyStats} />

                    {/* Recent Reviews - Mock for now */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold tracking-tight text-foreground">Recent Reviews</h2>
                            <Link to="/coach-dashboard/reviews" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {(reviewsData || []).slice(0, 3).map((review) => (
                                <div key={review.id} className="bg-background border border-border rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                                                {review.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{review.student}</p>
                                                <p className="text-[11px] text-muted-foreground">{review.sessionType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StarRating rating={review.rating} size={12} />
                                            <span className="text-[11px] text-muted-foreground">{review.date}</span>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-muted-foreground leading-relaxed">{review.text}</p>
                                    {review.outcome && (
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                                            <TrendingUp className="w-3 h-3" /> {review.outcome}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Past Sessions */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold tracking-tight text-foreground">Past sessions</h2>
                            <Link to="/coach-dashboard/sessions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="bg-background border border-border rounded-lg overflow-hidden">
                            {stats.past.length === 0 ? (
                                <div className="px-5 py-4 text-center text-sm text-muted-foreground">No past sessions</div>
                            ) : stats.past.slice(0, 4).map((session, i) => (
                                <div
                                    key={session.id}
                                    onMouseEnter={() => setHoveredPast(session.id)}
                                    onMouseLeave={() => setHoveredPast(null)}
                                    className={`px-5 py-4 flex items-center justify-between transition-colors duration-150 ${hoveredPast === session.id ? "bg-muted/50" : "bg-background"
                                        } ${i < 3 ? "border-b border-border/50" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground overflow-hidden">
                                            {typeof session.avatar === 'string' && session.avatar.includes('http') ? <img src={session.avatar} alt="avatar" className="w-full h-full object-cover" /> : session.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{session.student}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {session.type} · {session.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-semibold text-foreground">£{session.price}</span>
                                        {session.reviewed && session.rating ? (
                                            <StarRating rating={session.rating} size={11} />
                                        ) : (
                                            <span className="text-[11px] text-muted-foreground">Awaiting review</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
                    <TodayScheduleWidget schedule={stats.todaySchedule} />
                    <PayoutWidget pendingPayout={stats.pendingPayout} />
                    <QuickActionsWidget coachSlug={profile?.id || "demo-coach"} />
                </div>
            </div>
            <RescheduleModal
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
                personName={rescheduleTarget}
            />
            <SessionDetailPanel
                session={selectedSession}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
