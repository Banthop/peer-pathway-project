import { useState } from "react";
import { DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
    coachStats, monthlyEarnings, payoutHistory, serviceBreakdown,
} from "@/data/coachDashboardData";

/* ─── Stat Card ─────────────────────────────────────────────── */

function BigStat({ label, value, sub, icon: Icon }: {
    label: string; value: string; sub?: string; icon: React.ElementType;
}) {
    return (
        <div className="bg-background border border-border rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
            {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
    );
}

/* ─── Status Badge ──────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        paid: "bg-emerald-50 text-emerald-700",
        pending: "bg-amber-50 text-amber-700",
        processing: "bg-blue-50 text-blue-600",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${styles[status] || "bg-muted text-muted-foreground"}`}>
            {status}
        </span>
    );
}

/* ─── Revenue Chart ─────────────────────────────────────────── */

function RevenueChart() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const allMonths = [
        { shortMonth: "Mar", amount: 0 }, { shortMonth: "Apr", amount: 120 },
        { shortMonth: "May", amount: 280 }, { shortMonth: "Jun", amount: 350 },
        { shortMonth: "Jul", amount: 190 }, { shortMonth: "Aug", amount: 310 },
        ...monthlyEarnings,
    ];
    const maxAmount = Math.max(...allMonths.map((m) => m.amount));

    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground">Monthly Revenue</h3>
                <span className="text-xs text-muted-foreground">Last 12 months</span>
            </div>
            <div className="flex items-end gap-2 h-[200px]">
                {allMonths.map((m, i) => {
                    const height = maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0;
                    const isLast = i === allMonths.length - 1;
                    const isHovered = hoveredBar === i;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 relative"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {/* Tooltip */}
                            {isHovered && m.amount > 0 && (
                                <div className="absolute -top-8 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap z-10">
                                    £{m.amount.toLocaleString()}
                                </div>
                            )}
                            <div className="w-full relative flex-1 flex items-end">
                                <div
                                    className={`w-full rounded-t-md transition-all duration-300 ${isLast ? "bg-foreground" : isHovered ? "bg-foreground/60" : "bg-muted"
                                        }`}
                                    style={{ height: `${Math.max(height, 3)}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-medium ${isLast ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                {m.shortMonth}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Service Breakdown ─────────────────────────────────────── */

function ServiceBreakdownChart() {
    return (
        <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Revenue by Service</h3>
            <div className="space-y-4">
                {serviceBreakdown.map((s) => (
                    <div key={s.name}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-foreground">{s.name}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{s.sessions} sessions</span>
                                <span className="text-xs font-semibold text-foreground">£{s.revenue.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-foreground rounded-full transition-all duration-700"
                                style={{ width: `${s.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachEarnings() {
    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Earnings</h1>
                <p className="text-sm text-muted-foreground">Track your revenue and payouts</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <BigStat label="Total Earnings" value={`£${coachStats.totalEarningsAllTime.toLocaleString()}`} sub="All time" icon={DollarSign} />
                <BigStat label="This Month" value={`£${coachStats.totalEarningsThisMonth.toLocaleString()}`} sub={`+${coachStats.earningsChange}% vs last month`} icon={TrendingUp} />
                <BigStat label="Pending Payout" value={`£${coachStats.pendingPayout}`} sub={`Expected ${coachStats.nextPayoutDate}`} icon={Clock} />
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
                <RevenueChart />
            </div>

            {/* Two Column: Payouts + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payout History */}
                <div className="bg-background border border-border rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-base font-semibold text-foreground">Payout History</h3>
                    </div>
                    <div className="divide-y divide-border/50">
                        {payoutHistory.map((p) => (
                            <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{p.date}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{p.sessions} sessions</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-foreground">£{p.amount}</span>
                                    <StatusBadge status={p.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Breakdown */}
                <ServiceBreakdownChart />
            </div>
        </div>
    );
}
