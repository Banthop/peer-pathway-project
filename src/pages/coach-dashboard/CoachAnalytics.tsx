import { useState } from "react";
import { TrendingUp, Users, Clock, BarChart3, ArrowUpRight } from "lucide-react";
import { analyticsData, coachStats } from "@/data/coachDashboardData";

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

function SessionsChart() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const data = analyticsData.weeklySessionCounts;
    const maxCount = Math.max(...data.map((d) => d.count));

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground">Sessions Over Time</h3>
                <span className="text-xs text-muted-foreground">Weekly</span>
            </div>
            <div className="flex items-end gap-3 h-[180px]">
                {data.map((d, i) => {
                    const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                    const isHovered = hoveredBar === i;
                    const isLast = i === data.length - 1;
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

function TopServices() {
    const maxSessions = Math.max(...analyticsData.topServices.map((s) => s.sessions));
    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Top Services</h3>
            <div className="space-y-4">
                {analyticsData.topServices.map((s, i) => (
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

function StudentDemographics() {
    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Student Interests</h3>
            <div className="space-y-3">
                {analyticsData.studentCategories.map((c) => (
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
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachAnalytics() {
    const [period, setPeriod] = useState<Period>("month");

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
                    value={analyticsData.bookingRate}
                    suffix="%"
                    icon={TrendingUp}
                    description="Sessions booked vs. profile views"
                />
                <MetricCard
                    label="Avg Session"
                    value={analyticsData.avgSessionLength}
                    suffix="min"
                    icon={Clock}
                    description="Average session duration"
                />
                <MetricCard
                    label="Repeat Students"
                    value={analyticsData.repeatStudentRate}
                    suffix="%"
                    icon={Users}
                    description="Students who book again"
                />
            </div>

            {/* Sessions Chart */}
            <div className="mb-8">
                <SessionsChart />
            </div>

            {/* Two Column: Services + Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopServices />
                <StudentDemographics />
            </div>
        </div>
    );
}
