import { useState, useMemo } from "react";
import { TrendingUp, Users, Clock, BarChart3, ArrowUpRight } from "lucide-react";
import { format, parseISO, startOfWeek, subWeeks, isSameWeek } from "date-fns";
import { useCoachBookings } from "@/hooks/useBookings";

/* ─── Period Selector ───────────────────────────────────────── */

type Period = "week" | "month" | "3months" | "all";

const periodLabels: Record<Period, string> = {
    week: "This Week",
    month: "This Month",
    "3months": "Last 3 Months",
    all: "All Time",
};

/* ─── Metric Card ───────────────────────────────────────────── */

function MetricCard({ label, value, suffix, icon: Icon, description }: {
    label: string; value: string | number; suffix?: string;
    icon: React.ElementType; description?: string;
}) {
    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-end gap-1">
                <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
                {suffix && <span className="text-lg font-semibold text-muted-foreground mb-0.5">{suffix}</span>}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
    );
}

/* ─── Sessions Chart ────────────────────────────────────────── */

function SessionsChart({ data }: { data: { week: string, count: number }[] }) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const maxCount = Math.max(...data.map((d) => d.count), 5); // Fallback to 5 to avoid 0 height flat lines

    // Ensure we have at least some columns even if empty
    const displayData = data.length > 0 ? data : Array.from({ length: 4 }).map((_, i) => ({
        week: `Wk ${i + 1}`, count: 0
    }));

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground">Sessions Over Time</h3>
                <span className="text-xs text-muted-foreground">Weekly</span>
            </div>
            <div className="flex items-end gap-3 h-[180px]">
                {displayData.map((d, i) => {
                    const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                    const isHovered = hoveredBar === i;
                    const isLast = i === displayData.length - 1;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 relative"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}>
                            {isHovered && (
                                <div className="absolute -top-7 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap z-10">
                                    {d.count} sessions
                                </div>
                            )}
                            <div className="w-full relative flex-1 flex items-end">
                                <div
                                    className={`w-full rounded-t-md transition-all duration-300 ${isLast ? "bg-foreground" : isHovered ? "bg-foreground/60" : "bg-muted"
                                        }`}
                                    style={{ height: `${Math.max(height, 5)}%` }}
                                />
                            </div>
                            <span className={`text-[9px] font-medium whitespace-nowrap ${isLast ? "text-foreground" : "text-muted-foreground"}`}>
                                {d.week.slice(0, 5)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Top Services ──────────────────────────────────────────── */

function TopServices({ services }: { services: { name: string, sessions: number, revenue: number }[] }) {
    const maxSessions = Math.max(...services.map((s) => s.sessions), 1);

    if (services.length === 0) {
        return (
            <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-foreground mb-5">Top Services</h3>
                <p className="text-sm text-muted-foreground">No sessions yet to determine top services.</p>
            </div>
        );
    }

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Top Services</h3>
            <div className="space-y-4">
                {services.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-4">
                        <span className="w-5 text-xs font-bold text-muted-foreground text-right">{i + 1}</span>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-foreground">{s.name}</span>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{s.sessions} sessions</span>
                                    <span className="font-semibold text-foreground">£{s.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-foreground rounded-full transition-all duration-700"
                                    style={{ width: `${(s.sessions / maxSessions) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Student Demographics ──────────────────────────────────── */

function StudentDemographics({ data }: { data: { category: string, count: number, pct: number }[] }) {
    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Student Interests</h3>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
                <div className="space-y-3">
                    {data.map((c) => (
                        <div key={c.category} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-foreground">{c.category}</span>
                                    <span className="text-xs font-semibold text-foreground">{c.pct}%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground/70 rounded-full transition-all duration-700"
                                        style={{ width: `${c.pct}%` }} />
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground w-20 text-right">{c.count} students</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachAnalytics() {
    const [period, setPeriod] = useState<Period>("all");
    const { data: dbBookings = [] } = useCoachBookings(period === 'all' ? 'all' : period === '3months' ? 'all' : period);

    const stats = useMemo(() => {
        let totalTime = 0;
        let completedSessions = 0;
        const studentMap = new Set<string>();
        const studentBookingCounts = new Map<string, number>();
        const serviceMap = new Map<string, { sessions: number, revenue: number }>();

        const now = new Date();
        const weeklyCountsMap = new Map<string, number>();

        // Initialize last 4 weeks
        for (let i = 4; i >= 0; i--) {
            const wStart = startOfWeek(subWeeks(now, i));
            weeklyCountsMap.set(wStart.toISOString(), 0);
        }

        dbBookings.forEach((b: any) => {
            if (b.status === "cancelled") return;

            const rev = (b.price - (b.commission_amount || 0)) / 100;
            const sName = b.type === "intro" ? "Intro Call" : b.type === "package_session" ? "Package Session" : "1:1 Session";

            // Build service map
            const currentService = serviceMap.get(sName) || { sessions: 0, revenue: 0 };
            serviceMap.set(sName, {
                sessions: currentService.sessions + 1,
                revenue: currentService.revenue + rev
            });

            // Build student map
            if (b.student_id) {
                studentMap.add(b.student_id);
                studentBookingCounts.set(b.student_id, (studentBookingCounts.get(b.student_id) || 0) + 1);
            }

            if (b.status === "completed") {
                totalTime += b.duration;
                completedSessions++;
            }

            // Map to weekly buckets for chart
            const dateObj = parseISO(b.scheduled_at);
            for (let i = 0; i <= 4; i++) {
                const wStart = startOfWeek(subWeeks(now, i));
                if (isSameWeek(dateObj, wStart)) {
                    weeklyCountsMap.set(wStart.toISOString(), (weeklyCountsMap.get(wStart.toISOString()) || 0) + 1);
                    break;
                }
            }
        });

        const avgSessionLength = completedSessions > 0 ? Math.round(totalTime / completedSessions) : 0;

        // Calculate repeat booking rate
        let repeatStudents = 0;
        studentBookingCounts.forEach(count => {
            if (count > 1) repeatStudents++;
        });
        const repeatStudentRate = studentMap.size > 0 ? Math.round((repeatStudents / studentMap.size) * 100) : 0;

        // Top Services array
        const topServices = Array.from(serviceMap.entries()).map(([name, data]) => ({
            name,
            ...data
        })).sort((a, b) => b.revenue - a.revenue);

        // Weekly Session chart array
        const weeklySessionCounts = Array.from(weeklyCountsMap.entries()).map(([iso, count]) => ({
            week: format(parseISO(iso), 'MMM d'),
            count
        })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

        // Mock demographics for now since we don't track student interests in DB
        const studentCategories = studentMap.size > 0 ? [
            { category: "Computer Science", count: Math.ceil(studentMap.size * 0.45), pct: 45 },
            { category: "Business", count: Math.ceil(studentMap.size * 0.35), pct: 35 },
            { category: "Economics", count: Math.ceil(studentMap.size * 0.20), pct: 20 },
        ] : [];

        // Mock booking rate (views vs bookings) until we have analytics tracking
        const bookingRate = studentMap.size > 0 ? 12 : 0;

        return {
            avgSessionLength,
            repeatStudentRate,
            topServices,
            weeklySessionCounts,
            studentCategories,
            bookingRate
        };
    }, [dbBookings]);

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Analytics</h1>
                    <p className="text-sm text-muted-foreground">Understand your performance and growth</p>
                </div>
                <div className="flex bg-muted rounded-lg p-0.5">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${period === p
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}>
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <MetricCard
                    label="Booking Rate"
                    value={stats.bookingRate}
                    suffix="%"
                    icon={TrendingUp}
                    description="Sessions booked vs. profile views (mock)"
                />
                <MetricCard
                    label="Avg Session"
                    value={stats.avgSessionLength}
                    suffix="min"
                    icon={Clock}
                    description="Average session duration"
                />
                <MetricCard
                    label="Repeat Students"
                    value={stats.repeatStudentRate}
                    suffix="%"
                    icon={Users}
                    description="Students who book again"
                />
            </div>

            {/* Sessions Chart */}
            <div className="mb-8">
                <SessionsChart data={stats.weeklySessionCounts} />
            </div>

            {/* Two Column: Services + Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopServices services={stats.topServices} />
                <StudentDemographics data={stats.studentCategories} />
            </div>
        </div>
    );
}
