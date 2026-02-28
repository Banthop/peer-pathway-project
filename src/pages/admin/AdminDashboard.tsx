import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Shield, CheckCircle, XCircle, Clock, Users, DollarSign,
    TrendingUp, BarChart3, AlertTriangle, Loader2, ChevronDown,
    Eye, Ban, Star, Calendar, Settings, Megaphone, Plus, Trash2, Save, Target
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ═══════════════════════════════════════════════════════════════ */
/* Hooks                                                          */
/* ═══════════════════════════════════════════════════════════════ */

function useAllCoaches() {
    return useQuery({
        queryKey: ['admin-coaches'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('coaches')
                .select(`
                    id,
                    hourly_rate,
                    bio,
                    is_verified,
                    stripe_onboarded,
                    created_at,
                    user:users!coaches_id_fkey(name, email, avatar_url)
                `)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });
}

function useAllBookings() {
    return useQuery({
        queryKey: ['admin-bookings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('id, type, status, price, commission_amount, scheduled_at, created_at');
            if (error) throw error;
            return data;
        },
    });
}

function useVerifyCoach() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ coachId, verified }: { coachId: string; verified: boolean }) => {
            const { error } = await supabase
                .from('coaches')
                .update({ is_verified: verified })
                .eq('id', coachId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-coaches'] });
        },
    });
}

/* ═══════════════════════════════════════════════════════════════ */
/* Sub Components                                                 */
/* ═══════════════════════════════════════════════════════════════ */

/* ─── Stats Cards ────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, description, accent }: {
    label: string; value: string | number; icon: React.ElementType;
    description?: string; accent?: string;
}) {
    return (
        <div className="bg-background border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent || "bg-muted"}`}>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
    );
}

/* ─── Coach Verification Table ───────────────────────── */
function CoachVerificationTable({ coaches, onVerify }: {
    coaches: any[];
    onVerify: (id: string, verified: boolean) => void;
}) {
    const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

    const filtered = coaches.filter(c => {
        if (filter === "pending") return !c.is_verified;
        if (filter === "verified") return c.is_verified;
        return true;
    });

    return (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Coach Profiles</h3>
                <div className="flex bg-muted rounded-lg p-0.5">
                    {(["all", "pending", "verified"] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === f
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}>
                            {f === "all" ? `All (${coaches.length})` : f === "pending" ? `Pending (${coaches.filter(c => !c.is_verified).length})` : `Verified (${coaches.filter(c => c.is_verified).length})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-border">
                {filtered.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                        No coaches match this filter
                    </div>
                ) : (
                    filtered.map((coach) => (
                        <div key={coach.id} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border flex-shrink-0">
                                {coach.user?.name?.substring(0, 2).toUpperCase() || '??'}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {coach.user?.name || 'Unnamed Coach'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {coach.user?.email} · £{coach.hourly_rate || 0}/hr
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-2">
                                {coach.stripe_onboarded && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                                        Stripe ✓
                                    </span>
                                )}
                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${coach.is_verified
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-amber-50 text-amber-600"
                                    }`}>
                                    {coach.is_verified ? "Verified" : "Pending"}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1.5">
                                {!coach.is_verified ? (
                                    <button
                                        onClick={() => onVerify(coach.id, true)}
                                        className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Approve
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onVerify(coach.id, false)}
                                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                    >
                                        <Ban className="w-3 h-3" /> Revoke
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* ─── Season Banners Manager ─────────────────────────── */
function SeasonBannersManager() {
    const [banners, setBanners] = useState([
        { id: 1, title: "Spring Coaching Sale — 20% off all packages", active: true, color: "#10b981" },
        { id: 2, title: "New coaches: Finance & Consulting specialists now live!", active: false, color: "#3b82f6" },
    ]);
    const [newBanner, setNewBanner] = useState("");

    const addBanner = () => {
        if (!newBanner.trim()) return;
        setBanners([...banners, {
            id: Date.now(),
            title: newBanner.trim(),
            active: false,
            color: "#6366f1",
        }]);
        setNewBanner("");
    };

    const toggleActive = (id: number) => {
        setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
    };

    const deleteBanner = (id: number) => {
        setBanners(banners.filter(b => b.id !== id));
    };

    return (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Megaphone className="w-4 h-4" /> Season Banners
                </h3>
            </div>
            <div className="p-5 space-y-3">
                {banners.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                        <span className="text-sm text-foreground flex-1">{b.title}</span>
                        <button
                            onClick={() => toggleActive(b.id)}
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${b.active ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {b.active ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => deleteBanner(b.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                <div className="flex gap-2 mt-2">
                    <input
                        value={newBanner}
                        onChange={e => setNewBanner(e.target.value)}
                        placeholder="New banner text..."
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        onKeyDown={e => e.key === 'Enter' && addBanner()}
                    />
                    <button
                        onClick={addBanner}
                        className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* Main Page                                                      */
/* ═══════════════════════════════════════════════════════════════ */

type AdminTab = "overview" | "coaches" | "banners";

export default function AdminDashboard() {
    const [tab, setTab] = useState<AdminTab>("overview");
    const { data: coaches = [], isLoading: loadingCoaches } = useAllCoaches();
    const { data: bookings = [], isLoading: loadingBookings } = useAllBookings();
    const verifyCoach = useVerifyCoach();

    const stats = useMemo(() => {
        const totalRevenue = bookings.reduce((sum: number, b: any) =>
            sum + (b.status !== 'cancelled' ? (b.price || 0) : 0), 0
        ) / 100;

        const platformCommission = bookings.reduce((sum: number, b: any) =>
            sum + (b.status !== 'cancelled' ? (b.commission_amount || 0) : 0), 0
        ) / 100;

        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
        const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
        const verifiedCoaches = coaches.filter((c: any) => c.is_verified).length;
        const pendingCoaches = coaches.filter((c: any) => !c.is_verified).length;

        return {
            totalRevenue: `£${totalRevenue.toLocaleString()}`,
            platformCommission: `£${platformCommission.toLocaleString()}`,
            totalCoaches: coaches.length,
            verifiedCoaches,
            pendingCoaches,
            totalBookings: bookings.length,
            completedBookings,
            pendingBookings,
        };
    }, [coaches, bookings]);

    const handleVerify = (coachId: string, verified: boolean) => {
        verifyCoach.mutate({ coachId, verified });
    };

    const isLoading = loadingCoaches || loadingBookings;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Shield className="w-6 h-6" /> Admin Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage coaches, monitor revenue, and configure platform settings
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/admin/outreach"
                            className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2"
                        >
                            <Target className="w-4 h-4" /> Coach Outreach
                        </Link>
                        <Link
                            to="/admin/coaches"
                            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" /> Manage Coach Profiles
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border mb-6">
                    {([
                        { key: "overview", label: "Overview" },
                        { key: "coaches", label: `Coaches (${coaches.length})` },
                        { key: "banners", label: "Banners" },
                    ] as { key: AdminTab; label: string }[]).map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {tab === "overview" && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard label="Total Revenue" value={stats.totalRevenue} icon={DollarSign} description="Across all bookings" />
                                    <StatCard label="Platform Revenue" value={stats.platformCommission} icon={TrendingUp} description="Commission earned" />
                                    <StatCard label="Total Coaches" value={stats.totalCoaches} icon={Users} description={`${stats.verifiedCoaches} verified, ${stats.pendingCoaches} pending`} />
                                    <StatCard label="Total Bookings" value={stats.totalBookings} icon={Calendar} description={`${stats.completedBookings} completed, ${stats.pendingBookings} pending`} />
                                </div>

                                {/* Pending Coaches Alert */}
                                {stats.pendingCoaches > 0 && (
                                    <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-amber-800">
                                                {stats.pendingCoaches} coach{stats.pendingCoaches > 1 ? "es" : ""} awaiting verification
                                            </p>
                                            <p className="text-xs text-amber-600">Review and approve profiles to make them live on the platform.</p>
                                        </div>
                                        <button
                                            onClick={() => setTab("coaches")}
                                            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                                        >
                                            Review Now
                                        </button>
                                    </div>
                                )}

                                {/* Quick Coach Table */}
                                <CoachVerificationTable
                                    coaches={coaches.slice(0, 5)}
                                    onVerify={handleVerify}
                                />
                            </div>
                        )}

                        {/* Coaches Tab */}
                        {tab === "coaches" && (
                            <CoachVerificationTable coaches={coaches} onVerify={handleVerify} />
                        )}

                        {/* Banners Tab */}
                        {tab === "banners" && (
                            <SeasonBannersManager />
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
