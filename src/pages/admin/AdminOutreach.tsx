import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
    Search, Users, Send, MessageSquare, TrendingUp, BarChart3,
    Plus, Trash2, Copy, Pencil, ChevronDown, ExternalLink,
    Target, Zap, Clock, Calendar, ArrowRight, Filter,
    Download, Upload, AlertTriangle, CheckCircle, XCircle,
    GripVertical, FileText, Linkedin, Hash, Star, Eye
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type {
    OutreachSource, OutreachStatus, OutreachPriority,
    OutreachMethod, ScriptPlatform
} from "@/integrations/supabase/types";

/* ═══════════════════════════════════════════════════════════════ */
/* Types                                                          */
/* ═══════════════════════════════════════════════════════════════ */

interface OutreachCoach {
    id: string;
    // Identity (from Google Form)
    firstName: string;
    lastName: string;
    name: string; // computed: firstName + lastName
    email: string;
    phone: string;
    linkedinUrl: string;
    // Academic
    university: string; // "University and Course"
    graduationYear: string;
    // Credentials
    credential: string; // main achievement(s)
    credentialYear: number | null;
    categories: string[]; // multi-select from form categories
    educationServices: string[]; // education-focused services they can offer
    careerServices: string[]; // career-focused services they can offer
    oxbridgeCollege: string;
    universityOffers: string; // which unis/courses they got offers from
    categoryExperience: string; // long text about their experience
    // Coaching details
    coachingExperience: string; // level of coaching experience
    packageWillingness: string; // "Yes" | "Maybe" | "No"
    weeklyHours: string; // availability per week
    // Discovery
    source: OutreachSource;
    tiktokHandle: string;
    followerCount: number;
    // Pipeline
    status: OutreachStatus;
    priority: OutreachPriority;
    outreachMethod: OutreachMethod;
    // Outreach tracking
    linkedinMessageSent: string | null;
    linkedinReplied: boolean;
    linkedinReplyDate: string | null;
    tiktokDmSent: string | null;
    tiktokReplied: boolean;
    tiktokReplyDate: string | null;
    followUpDate: string | null;
    followUpNote: string;
    // Application
    formSubmitted: boolean; // whether they've filled the Google Form
    formSubmittedDate: string | null;
    headshotUploaded: boolean;
    // Meta
    notes: string;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
}

interface OutreachScript {
    id: string;
    name: string;
    platform: ScriptPlatform;
    content: string;
    category: string;
    useCount: number;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
}

/* ═══════════════════════════════════════════════════════════════ */
/* Constants                                                      */
/* ═══════════════════════════════════════════════════════════════ */

// Categories from the Google Form coach application
const EARLYEDGE_CATEGORIES = [
    // Industry categories
    "Investment Banking (Spring Weeks, Internships, Graduate Roles)",
    "Sales & Trading / Global Markets",
    "Asset Management",
    "Quantitative Finance",
    "Private Equity & Venture Capital",
    "Consulting (MBB, Big 4, Strategy)",
    "Law (Vacation Schemes, Training Contracts)",
    "Software Engineering & Tech",
    "Cold Emailing",
    "Internship Conversion (Spring Week → Summer Offer)",
    // Education categories
    "University Admission Tests",
    "Medicine & Dentistry",
    "Oxbridge Applications",
    "University Applications (UCAS, Personal Statements)",
    // Specific tests
    "UCAT", "STEP (Cambridge Maths)", "LNAT", "TMUA", "ESAT",
    "Oxbridge Interview Preparation",
    "University / Course Selection",
    "Medicine/Dentistry Interview Mocks (MMI)",
    "Medicine/Dentistry Interview Mocks (Panel)",
] as const;

// Education-focused services from the form
const EDUCATION_SERVICES = [
    "Personal Statement Review",
    "UCAT", "STEP (Cambridge Maths)", "LNAT", "TMUA", "ESAT",
    "Oxbridge Interview Preparation",
    "University / Course Selection",
    "Medicine/Dentistry Interview Mocks & Preparation (MMI)",
    "Medicine/Dentistry Interview Mocks & Preparation (Panel)",
] as const;

// Career-focused services from the form
const CAREER_SERVICES = [
    "CV Review",
    "Cover Letters/Written Questions Review",
    "Cold Emailing Strategy",
    "Firm Specific Non-Technical Interview Preparation",
    "Firm Specific Technical/Case Interview Preparation",
    "Firm-Specific Insights & What To Expect",
    "Online Assessments (SHL, Pymetrics, etc.)",
    "Assessment Centre / Superday Prep",
    "General Advice / Mentorship",
    "Day-In-The-Life & Role Insights",
] as const;

// Coaching experience levels from the form
const COACHING_EXPERIENCE_LEVELS = [
    "Helped friends or classmates informally",
    "Mentored students through a school/uni scheme",
    "Paid tutoring or coaching",
    "Content creation (YouTube, TikTok, blog)",
    "None yet - but keen to start",
] as const;

const WEEKLY_HOURS_OPTIONS = ["1-2 Hours", "3-5 Hours", "5-10 Hours", "10+ Hours"] as const;
const PACKAGE_OPTIONS = ["Yes, I have ideas for packages", "Maybe, I'd need help creating them", "No, just single sessions for now"] as const;

const OUTREACH_STATUSES: OutreachStatus[] = [
    "found", "researched", "reached_out", "replied",
    "interested", "call_scheduled", "onboarded", "not_interested", "ghosted",
];

const PIPELINE_STATUSES: OutreachStatus[] = [
    "found", "researched", "reached_out", "replied",
    "interested", "call_scheduled", "onboarded",
];

const STATUS_LABELS: Record<OutreachStatus, string> = {
    found: "Found",
    researched: "Researched",
    reached_out: "Reached Out",
    replied: "Replied",
    interested: "Interested",
    call_scheduled: "Call Scheduled",
    onboarded: "Onboarded",
    not_interested: "Not Interested",
    ghosted: "Ghosted",
};

const STATUS_COLORS: Record<OutreachStatus, string> = {
    found: "#6366F1",
    researched: "#3B82F6",
    reached_out: "#F59E0B",
    replied: "#10B981",
    interested: "#8B5CF6",
    call_scheduled: "#06B6D4",
    onboarded: "#059669",
    not_interested: "#F43F5E",
    ghosted: "#9CA3AF",
};

const SOURCE_COLORS: Record<OutreachSource, string> = {
    linkedin: "#0A66C2",
    tiktok: "#FF0050",
    instagram: "#E4405F",
    referral: "#10B981",
    other: "#6B7280",
};

const PRIORITY_COLORS: Record<OutreachPriority, string> = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#6366F1",
};

const CATEGORY_COLORS: Record<string, string> = {
    "Investment Banking (Spring Weeks, Internships, Graduate Roles)": "#3B82F6",
    "Sales & Trading / Global Markets": "#6366F1",
    "Asset Management": "#8B5CF6",
    "Quantitative Finance": "#EC4899",
    "Private Equity & Venture Capital": "#7C3AED",
    "Consulting (MBB, Big 4, Strategy)": "#8B5CF6",
    "Law (Vacation Schemes, Training Contracts)": "#6366F1",
    "Software Engineering & Tech": "#06B6D4",
    "Cold Emailing": "#F97316",
    "Internship Conversion (Spring Week → Summer Offer)": "#10B981",
    "University Admission Tests": "#F59E0B",
    "Medicine & Dentistry": "#10B981",
    "Oxbridge Applications": "#F59E0B",
    "University Applications (UCAS, Personal Statements)": "#F97316",
    "UCAT": "#10B981",
    "STEP (Cambridge Maths)": "#06B6D4",
    "LNAT": "#6366F1",
    "TMUA": "#3B82F6",
    "ESAT": "#8B5CF6",
    "Oxbridge Interview Preparation": "#F59E0B",
    "University / Course Selection": "#F97316",
    "Medicine/Dentistry Interview Mocks (MMI)": "#10B981",
    "Medicine/Dentistry Interview Mocks (Panel)": "#059669",
};

/* ═══════════════════════════════════════════════════════════════ */
/* Data Layer (localStorage)                                      */
/* ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "earlyedge_outreach";
const SCRIPTS_KEY = "earlyedge_outreach_scripts";

function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadCoaches(): OutreachCoach[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveCoaches(coaches: OutreachCoach[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coaches));
}

function getDefaultScripts(): OutreachScript[] {
    return [
        {
            id: uid(), name: "LinkedIn — Initial DM", platform: "linkedin",
            content: `Hey {name}! Saw your profile — really impressive background in {topic}.\n\nRandom question: do people ever DM you asking for 1-on-1 help? Like paid coaching?\n\nWorking on something that might be relevant if so.`,
            category: "", useCount: 0, addedBy: "Dylan",
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
            id: uid(), name: "LinkedIn — Follow Up", platform: "linkedin",
            content: `Hey {name}! Following up on my message — would you want to get paid to help people with {topic}?\n\nWe're building EarlyEdge — a peer coaching marketplace for students. Coaches charge £25-60/session and we handle payments, scheduling, everything.\n\nHappy to explain more if you're interested!`,
            category: "", useCount: 0, addedBy: "Dylan",
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
            id: uid(), name: "TikTok — Cold DM", platform: "tiktok",
            content: `Hey {name}! Love your content on {topic} — really great stuff.\n\nQuick Q: do you ever do 1-on-1 coaching? We're building a platform where people like you get paid £25-60/hr to help students.\n\nWould love to chat if you're open to it!`,
            category: "", useCount: 0, addedBy: "Dylan",
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
        {
            id: uid(), name: "LinkedIn — Warm Intro", platform: "linkedin",
            content: `Hi {name}! I came across your profile through {credential} — congrats on that.\n\nI'm building EarlyEdge, a peer coaching marketplace where students who recently achieved competitive things (spring weeks, Oxbridge offers, UCAT scores etc.) coach others who are going through the same process.\n\nGiven your background in {topic}, I think you'd be a great fit. Coaches set their own rates (typically £25-60/hr) and we handle everything else.\n\nWould you be open to a quick 10-min chat?`,
            category: "", useCount: 0, addedBy: "Dylan",
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        },
    ];
}

function loadScripts(): OutreachScript[] {
    try {
        const stored = localStorage.getItem(SCRIPTS_KEY);
        if (!stored) {
            const defaults = getDefaultScripts();
            saveScripts(defaults);
            return defaults;
        }
        return JSON.parse(stored);
    } catch {
        return getDefaultScripts();
    }
}

function saveScripts(scripts: OutreachScript[]): void {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}

/* ═══════════════════════════════════════════════════════════════ */
/* Utility Helpers                                                */
/* ═══════════════════════════════════════════════════════════════ */

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric", month: "short",
    });
}

function isOverdue(dateStr: string | null): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toDateString());
}

function isDueToday(dateStr: string | null): boolean {
    if (!dateStr) return false;
    return new Date(dateStr).toDateString() === new Date().toDateString();
}

/* ═══════════════════════════════════════════════════════════════ */
/* Shared Sub-Components                                          */
/* ═══════════════════════════════════════════════════════════════ */

function StatCard({ label, value, icon: Icon, subtitle, accent }: {
    label: string; value: string | number; icon: React.ElementType;
    subtitle?: string; accent?: string;
}) {
    return (
        <div className="bg-background border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                    style={{ backgroundColor: accent ? `${accent}15` : undefined }}>
                    <Icon className="w-4 h-4" style={{ color: accent || "#888" }} />
                </div>
            </div>
            <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
        </div>
    );
}

function StatusBadge({ status }: { status: OutreachStatus }) {
    const color = STATUS_COLORS[status];
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: `${color}15`, color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {STATUS_LABELS[status]}
        </span>
    );
}

function SourceBadge({ source }: { source: OutreachSource }) {
    const color = SOURCE_COLORS[source];
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
            style={{ backgroundColor: `${color}12`, color }}>
            {source === "linkedin" && <Linkedin className="w-2.5 h-2.5" />}
            {source}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: OutreachPriority }) {
    const color = PRIORITY_COLORS[priority];
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
            style={{ backgroundColor: `${color}12`, color }}>
            {priority}
        </span>
    );
}

function CategoryDot({ category }: { category: string }) {
    const color = CATEGORY_COLORS[category] || "#6B7280";
    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {category || "Uncategorised"}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* Toast                                                          */
/* ═══════════════════════════════════════════════════════════════ */

function useToast() {
    const [msg, setMsg] = useState<string | null>(null);
    const show = useCallback((text: string) => {
        setMsg(text);
        setTimeout(() => setMsg(null), 2500);
    }, []);
    const Toast = msg ? (
        <div className="fixed bottom-6 right-6 z-[200] px-5 py-3 bg-foreground text-background rounded-xl text-sm font-semibold shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300">
            {msg}
        </div>
    ) : null;
    return { show, Toast };
}

/* ═══════════════════════════════════════════════════════════════ */
/* DASHBOARD TAB                                                  */
/* ═══════════════════════════════════════════════════════════════ */

function DashboardTab({ coaches }: { coaches: OutreachCoach[] }) {
    const statusIndex = (s: OutreachStatus) => OUTREACH_STATUSES.indexOf(s);
    const total = coaches.length;
    const reachedOut = coaches.filter(c => statusIndex(c.status) >= 2 && c.status !== "not_interested" && c.status !== "ghosted").length;
    const replied = coaches.filter(c => c.linkedinReplied || c.tiktokReplied).length;
    const rate = reachedOut > 0 ? Math.round((replied / reachedOut) * 100) : 0;
    const onboarded = coaches.filter(c => c.status === "onboarded").length;
    const followUpsDue = coaches.filter(c => isOverdue(c.followUpDate) || isDueToday(c.followUpDate)).length;
    const thisWeek = coaches.filter(c => {
        const d = new Date(c.createdAt);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
    }).length;

    const maxCount = Math.max(...OUTREACH_STATUSES.map(s => coaches.filter(c => c.status === s).length), 1);
    const liCount = coaches.filter(c => c.outreachMethod === "linkedin").length;
    const ttCount = coaches.filter(c => c.outreachMethod === "tiktok").length;
    const otherCount = total - liCount - ttCount;
    const splitTotal = Math.max(liCount + ttCount + otherCount, 1);

    const recentActivity = [...coaches]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 8);

    const followUps = coaches.filter(c => c.followUpDate && (isOverdue(c.followUpDate) || isDueToday(c.followUpDate)))
        .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime());

    return (
        <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <StatCard label="Total Coaches" value={total} icon={Users} subtitle={`+${thisWeek} this week`} accent="#6366F1" />
                <StatCard label="Reached Out" value={reachedOut} icon={Send} subtitle={`${total - reachedOut} remaining`} accent="#F59E0B" />
                <StatCard label="Replied" value={replied} icon={MessageSquare} accent="#10B981" />
                <StatCard label="Response Rate" value={`${rate}%`} icon={TrendingUp} subtitle={replied > 0 ? `${replied}/${reachedOut}` : undefined} accent="#3B82F6" />
                <StatCard label="Onboarded" value={onboarded} icon={CheckCircle} subtitle={onboarded > 0 ? `${Math.round(onboarded / total * 100)}% of total` : undefined} accent="#059669" />
                <StatCard label="Follow-ups Due" value={followUpsDue} icon={Clock} subtitle={followUpsDue > 0 ? "Action needed" : "All clear"} accent={followUpsDue > 0 ? "#EF4444" : "#10B981"} />
            </div>

            {/* Follow-up Alert */}
            {followUps.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-800">Follow-ups Due</span>
                    </div>
                    <div className="space-y-2">
                        {followUps.slice(0, 5).map(c => (
                            <div key={c.id} className="flex items-center gap-3 text-sm">
                                <span className="font-medium text-amber-900">{c.name}</span>
                                <CategoryDot category={c.categories?.[0] || ""} />
                                <span className="text-amber-600 text-xs">
                                    {isOverdue(c.followUpDate) ? `Overdue (${formatDate(c.followUpDate!)})` : "Due today"}
                                </span>
                                {c.followUpNote && <span className="text-amber-500 text-xs truncate max-w-[200px]">{c.followUpNote}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pipeline Breakdown */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline Breakdown</h3>
                    <div className="space-y-2.5">
                        {OUTREACH_STATUSES.map(status => {
                            const count = coaches.filter(c => c.status === status).length;
                            const pct = (count / maxCount) * 100;
                            return (
                                <div key={status} className="flex items-center gap-3">
                                    <span className="w-24 text-[11px] text-muted-foreground text-right flex-shrink-0 font-medium">
                                        {STATUS_LABELS[status]}
                                    </span>
                                    <div className="flex-1 h-7 bg-muted/50 rounded-md overflow-hidden relative">
                                        <div className="h-full rounded-md flex items-center px-2.5 text-[11px] font-bold text-white transition-all duration-500"
                                            style={{
                                                width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                                                backgroundColor: STATUS_COLORS[status],
                                            }}>
                                            {count > 0 && count}
                                        </div>
                                    </div>
                                    <span className="w-6 text-xs font-bold text-foreground text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Outreach Split */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Outreach Split</h3>
                    <div className="space-y-3">
                        {[
                            { name: "LinkedIn", count: liCount, color: "#0A66C2", icon: Linkedin },
                            { name: "TikTok", count: ttCount, color: "#FF0050", icon: Hash },
                            { name: "Other", count: otherCount, color: "#6B7280", icon: Send },
                        ].map(p => (
                            <div key={p.name} className="flex items-center gap-4 p-3.5 rounded-lg bg-muted/30">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
                                    <p.icon className="w-4 h-4" style={{ color: p.color }} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-semibold text-foreground block">{p.name}</span>
                                    <span className="text-[11px] text-muted-foreground">{p.count} coaches</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-foreground">{Math.round(p.count / splitTotal * 100)}%</span>
                                </div>
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(p.count / splitTotal) * 100}%`, backgroundColor: p.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-background border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
                {recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">No activity yet. Add your first coach!</p>
                ) : (
                    <div className="divide-y divide-border">
                        {recentActivity.map(c => (
                            <div key={c.id} className="flex items-center gap-3 py-3">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[c.status] }} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm">
                                        <strong className="text-foreground">{c.name}</strong>
                                        <span className="text-muted-foreground"> — </span>
                                    </span>
                                    <StatusBadge status={c.status} />
                                </div>
                                <CategoryDot category={c.categories?.[0] || ""} />
                                <span className="text-[11px] text-muted-foreground flex-shrink-0">{timeAgo(c.updatedAt)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* DIRECTORY TAB                                                  */
/* ═══════════════════════════════════════════════════════════════ */

function DirectoryTab({ coaches, onEdit, onDelete, onUpdateStatus, onAdd }: {
    coaches: OutreachCoach[];
    onEdit: (coach: OutreachCoach) => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: OutreachStatus) => void;
    onAdd: () => void;
}) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const filtered = useMemo(() => {
        let list = [...coaches];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.categories.join(" ").toLowerCase().includes(q) ||
                c.university.toLowerCase().includes(q) ||
                c.credential.toLowerCase().includes(q) ||
                c.tiktokHandle.toLowerCase().includes(q) ||
                (c.email || "").toLowerCase().includes(q) ||
                c.notes.toLowerCase().includes(q)
            );
        }
        if (filterStatus) list = list.filter(c => c.status === filterStatus);
        if (filterSource) list = list.filter(c => c.source === filterSource);
        if (filterPriority) list = list.filter(c => c.priority === filterPriority);
        if (filterCategory) list = list.filter(c => c.categories?.includes(filterCategory));

        list.sort((a, b) => {
            const va = (a as any)[sortField] || "";
            const vb = (b as any)[sortField] || "";
            if (sortField === "createdAt" || sortField === "updatedAt") {
                return sortDir === "desc"
                    ? new Date(vb).getTime() - new Date(va).getTime()
                    : new Date(va).getTime() - new Date(vb).getTime();
            }
            const cmp = String(va).localeCompare(String(vb));
            return sortDir === "asc" ? cmp : -cmp;
        });
        return list;
    }, [coaches, search, filterStatus, filterSource, filterPriority, filterCategory, sortField, sortDir]);

    const toggleSort = (field: string) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("asc"); }
    };

    const SortIndicator = ({ field }: { field: string }) => (
        <span className="text-muted-foreground/50 ml-0.5">
            {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    );

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2.5 items-center bg-background border border-border rounded-xl px-4 py-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search coaches..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none">
                    <option value="">All Statuses</option>
                    {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
                    className="px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none">
                    <option value="">All Sources</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="referral">Referral</option>
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                    className="px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none">
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    className="px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none">
                    <option value="">All Categories</option>
                    {EARLYEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-background border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th onClick={() => toggleSort("name")} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap">
                                    Name <SortIndicator field="name" />
                                </th>
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Credential</th>
                                <th onClick={() => toggleSort("source")} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap">
                                    Source <SortIndicator field="source" />
                                </th>
                                <th onClick={() => toggleSort("status")} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap">
                                    Status <SortIndicator field="status" />
                                </th>
                                <th onClick={() => toggleSort("priority")} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap">
                                    Priority <SortIndicator field="priority" />
                                </th>
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Follow-up</th>
                                <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">By</th>
                                <th onClick={() => toggleSort("createdAt")} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground whitespace-nowrap">
                                    Added <SortIndicator field="createdAt" />
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-12 text-center">
                                        <div className="text-muted-foreground">
                                            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm font-medium">No coaches found</p>
                                            <p className="text-xs mt-1">Try adjusting your filters or add a new coach</p>
                                            <button onClick={onAdd} className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Add Coach
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(c => (
                                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="text-sm font-semibold text-foreground">{c.name}</span>
                                                {c.university && (
                                                    <span className="block text-[11px] text-muted-foreground">{c.university}</span>
                                                )}
                                                {c.email && (
                                                    <span className="block text-[10px] text-muted-foreground/60">{c.email}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.categories && c.categories.length > 0 ? (
                                                <div className="flex flex-col gap-0.5">
                                                    {c.categories.slice(0, 2).map((cat, i) => <CategoryDot key={i} category={cat} />)}
                                                    {c.categories.length > 2 && <span className="text-[10px] text-muted-foreground">+{c.categories.length - 2} more</span>}
                                                </div>
                                            ) : <CategoryDot category={c.credential} />}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-muted-foreground">
                                                {c.credential}{c.credentialYear ? ` '${String(c.credentialYear).slice(-2)}` : ""}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><SourceBadge source={c.source} /></td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={c.status}
                                                onChange={e => onUpdateStatus(c.id, e.target.value as OutreachStatus)}
                                                className="text-[11px] font-semibold bg-transparent border border-transparent hover:border-border rounded-lg px-1 py-0.5 cursor-pointer focus:outline-none focus:border-foreground/20"
                                                style={{ color: STATUS_COLORS[c.status] }}
                                            >
                                                {OUTREACH_STATUSES.map(s => (
                                                    <option key={s} value={s} style={{ color: "#111" }}>{STATUS_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                                        <td className="px-4 py-3">
                                            {c.followUpDate ? (
                                                <span className={`text-xs font-medium ${isOverdue(c.followUpDate) ? "text-red-500" : isDueToday(c.followUpDate) ? "text-amber-500" : "text-muted-foreground"}`}>
                                                    {formatDate(c.followUpDate)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/40">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                                                {c.addedBy?.charAt(0)?.toUpperCase() || "?"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {c.linkedinUrl && (
                                                    <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                <button onClick={() => onEdit(c)}
                                                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => onDelete(c.id)}
                                                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {filtered.length > 0 && (
                    <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                            Showing {filtered.length} of {coaches.length} coaches
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* PIPELINE TAB                                                   */
/* ═══════════════════════════════════════════════════════════════ */

function PipelineTab({ coaches, onUpdateStatus, onEdit }: {
    coaches: OutreachCoach[];
    onUpdateStatus: (id: string, status: OutreachStatus) => void;
    onEdit: (coach: OutreachCoach) => void;
}) {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        setDropTarget(status);
    };

    const handleDragLeave = () => setDropTarget(null);

    const handleDrop = (e: React.DragEvent, newStatus: OutreachStatus) => {
        e.preventDefault();
        if (draggedId) onUpdateStatus(draggedId, newStatus);
        setDraggedId(null);
        setDropTarget(null);
    };

    // Group coaches that are not_interested or ghosted under their respective columns at the end
    const allStatuses: OutreachStatus[] = [...PIPELINE_STATUSES, "not_interested", "ghosted"];

    return (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 240px)" }}>
            {allStatuses.map(status => {
                const cards = coaches.filter(c => c.status === status);
                const isActive = dropTarget === status;
                return (
                    <div key={status} className="flex-shrink-0 w-[230px] flex flex-col bg-muted/20 border border-border rounded-xl overflow-hidden">
                        {/* Column Header */}
                        <div className="px-3.5 py-3 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: STATUS_COLORS[status] }}>
                                    {STATUS_LABELS[status]}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {cards.length}
                            </span>
                        </div>

                        {/* Column Body */}
                        <div
                            className={`flex-1 p-2 space-y-2 min-h-[100px] transition-colors ${isActive ? "bg-muted/40" : ""}`}
                            onDragOver={e => handleDragOver(e, status)}
                            onDragLeave={handleDragLeave}
                            onDrop={e => handleDrop(e, status)}
                        >
                            {cards.map(c => (
                                <div
                                    key={c.id}
                                    draggable
                                    onDragStart={e => handleDragStart(e, c.id)}
                                    onClick={() => onEdit(c)}
                                    className={`bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-foreground/20 hover:-translate-y-0.5 transition-all group ${draggedId === c.id ? "opacity-40 rotate-1" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-1 mb-1.5">
                                        <span className="text-sm font-semibold text-foreground leading-snug">{c.name}</span>
                                        <GripVertical className="w-3 h-3 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                    </div>
                                    {c.credential && (
                                        <p className="text-[11px] text-muted-foreground mb-1.5 leading-snug">
                                            {c.credential}{c.credentialYear ? ` '${String(c.credentialYear).slice(-2)}` : ""}
                                        </p>
                                    )}
                                    <CategoryDot category={c.categories?.[0] || ""} />
                                    <div className="flex gap-1.5 mt-2 flex-wrap">
                                        <SourceBadge source={c.source} />
                                        <PriorityBadge priority={c.priority} />
                                    </div>
                                    {c.followUpDate && (isOverdue(c.followUpDate) || isDueToday(c.followUpDate)) && (
                                        <div className="mt-2 text-[10px] font-medium text-amber-500 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            Follow-up {isOverdue(c.followUpDate) ? "overdue" : "today"}
                                        </div>
                                    )}
                                    {/* Mobile fallback: status selector */}
                                    <select
                                        value={c.status}
                                        onChange={e => { e.stopPropagation(); onUpdateStatus(c.id, e.target.value as OutreachStatus); }}
                                        onClick={e => e.stopPropagation()}
                                        className="mt-2 w-full text-[10px] bg-muted/50 border border-border rounded-md px-2 py-1 text-muted-foreground lg:hidden focus:outline-none"
                                    >
                                        {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ANALYTICS TAB                                                  */
/* ═══════════════════════════════════════════════════════════════ */

function AnalyticsTab({ coaches }: { coaches: OutreachCoach[] }) {
    // Conversion Funnel (cumulative)
    const funnelData = PIPELINE_STATUSES.map(s => ({
        label: STATUS_LABELS[s],
        count: coaches.filter(c =>
            PIPELINE_STATUSES.indexOf(c.status) >= PIPELINE_STATUSES.indexOf(s) &&
            c.status !== "not_interested" && c.status !== "ghosted"
        ).length,
        color: STATUS_COLORS[s],
    }));
    const maxFunnel = Math.max(...funnelData.map(d => d.count), 1);

    // Effectiveness by platform
    const liCoaches = coaches.filter(c => c.outreachMethod === "linkedin");
    const ttCoaches = coaches.filter(c => c.outreachMethod === "tiktok");
    const liSent = liCoaches.filter(c => c.linkedinMessageSent).length;
    const liRep = liCoaches.filter(c => c.linkedinReplied).length;
    const ttSent = ttCoaches.filter(c => c.tiktokDmSent).length;
    const ttRep = ttCoaches.filter(c => c.tiktokReplied).length;

    // Response times
    const responseTimes: number[] = [];
    coaches.forEach(c => {
        if (c.linkedinReplied && c.linkedinMessageSent && c.linkedinReplyDate) {
            const diff = (new Date(c.linkedinReplyDate).getTime() - new Date(c.linkedinMessageSent).getTime()) / (1000 * 60 * 60 * 24);
            if (diff >= 0) responseTimes.push(diff);
        }
        if (c.tiktokReplied && c.tiktokDmSent && c.tiktokReplyDate) {
            const diff = (new Date(c.tiktokReplyDate).getTime() - new Date(c.tiktokDmSent).getTime()) / (1000 * 60 * 60 * 24);
            if (diff >= 0) responseTimes.push(diff);
        }
    });
    const avgTime = responseTimes.length ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1) : "—";
    const fastestTime = responseTimes.length ? Math.min(...responseTimes).toFixed(1) : "—";

    // Top categories
    const catCounts: Record<string, number> = {};
    coaches.forEach(c => { (c.categories || []).forEach(cat => { if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1; }); });
    const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCat = Math.max(...topCategories.map(([, n]) => n), 1);

    // Weekly activity
    const weeklyData: { week: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const label = `${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
        const count = coaches.filter(c => {
            const d = new Date(c.createdAt);
            return d >= weekStart && d < weekEnd;
        }).length;
        weeklyData.push({ week: label, count });
    }
    const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Conversion Funnel */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Conversion Funnel</h3>
                    <div className="space-y-2.5">
                        {funnelData.map((d, i) => (
                            <div key={d.label} className="flex items-center gap-3">
                                <span className="w-24 text-[11px] text-muted-foreground text-right flex-shrink-0 font-medium">
                                    {d.label}
                                </span>
                                <div className="flex-1 relative">
                                    <div className="h-8 bg-muted/30 rounded-md overflow-hidden">
                                        <div className="h-full rounded-md flex items-center px-3 text-[11px] font-bold text-white transition-all duration-500"
                                            style={{
                                                width: `${Math.max((d.count / maxFunnel) * 100, d.count > 0 ? 10 : 0)}%`,
                                                backgroundColor: d.color,
                                            }}>
                                            {d.count}
                                        </div>
                                    </div>
                                </div>
                                {i > 0 && funnelData[i - 1].count > 0 && (
                                    <span className="text-[10px] font-medium text-muted-foreground w-12 text-right">
                                        {Math.round((d.count / funnelData[i - 1].count) * 100)}%
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outreach Effectiveness */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Outreach Effectiveness</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "LinkedIn Sent", value: liSent, color: "#0A66C2" },
                            { label: "LinkedIn Replied", value: liRep, color: "#10B981" },
                            { label: "LinkedIn Rate", value: liSent ? `${Math.round(liRep / liSent * 100)}%` : "—", color: "#0A66C2" },
                            { label: "TikTok Sent", value: ttSent, color: "#FF0050" },
                            { label: "TikTok Replied", value: ttRep, color: "#10B981" },
                            { label: "TikTok Rate", value: ttSent ? `${Math.round(ttRep / ttSent * 100)}%` : "—", color: "#FF0050" },
                        ].map(stat => (
                            <div key={stat.label} className="p-3.5 bg-muted/30 rounded-lg">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">{stat.label}</span>
                                <span className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Response Times */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Response Times</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 bg-muted/30 rounded-lg">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Average</span>
                            <span className="text-xl font-bold text-foreground">{avgTime}{avgTime !== "—" ? "d" : ""}</span>
                        </div>
                        <div className="p-3.5 bg-muted/30 rounded-lg">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Fastest</span>
                            <span className="text-xl font-bold text-foreground">{fastestTime}{fastestTime !== "—" ? "d" : ""}</span>
                        </div>
                        <div className="p-3.5 bg-muted/30 rounded-lg">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Total Replies</span>
                            <span className="text-xl font-bold text-foreground">{responseTimes.length}</span>
                        </div>
                    </div>
                    {responseTimes.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Distribution</span>
                            {[
                                { label: "< 1 day", count: responseTimes.filter(t => t < 1).length },
                                { label: "1-3 days", count: responseTimes.filter(t => t >= 1 && t < 3).length },
                                { label: "3-7 days", count: responseTimes.filter(t => t >= 3 && t < 7).length },
                                { label: "7+ days", count: responseTimes.filter(t => t >= 7).length },
                            ].map(d => (
                                <div key={d.label} className="flex items-center gap-2">
                                    <span className="w-14 text-[11px] text-muted-foreground">{d.label}</span>
                                    <div className="flex-1 h-4 bg-muted/30 rounded overflow-hidden">
                                        <div className="h-full bg-foreground/20 rounded transition-all"
                                            style={{ width: `${(d.count / responseTimes.length) * 100}%` }} />
                                    </div>
                                    <span className="text-[11px] font-bold text-foreground w-4 text-right">{d.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Categories */}
                <div className="bg-background border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Top Categories</h3>
                    {topCategories.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Add categories to see breakdown</p>
                    ) : (
                        <div className="space-y-2.5">
                            {topCategories.map(([name, count]) => (
                                <div key={name} className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[name] || "#6B7280" }} />
                                    <span className="text-xs text-foreground flex-1 truncate">{name}</span>
                                    <div className="w-20 h-3 bg-muted/30 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all"
                                            style={{ width: `${(count / maxCat) * 100}%`, backgroundColor: CATEGORY_COLORS[name] || "#6B7280" }} />
                                    </div>
                                    <span className="text-xs font-bold text-foreground w-5 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-background border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Activity</h3>
                <div className="flex items-end gap-2 h-32">
                    {weeklyData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-foreground">{d.count}</span>
                            <div className="w-full bg-muted/30 rounded-t overflow-hidden" style={{ height: "100%" }}>
                                <div className="w-full rounded-t transition-all duration-500"
                                    style={{
                                        height: `${Math.max((d.count / maxWeekly) * 100, d.count > 0 ? 10 : 2)}%`,
                                        backgroundColor: "#6366F1",
                                        marginTop: "auto",
                                    }} />
                            </div>
                            <span className="text-[9px] text-muted-foreground whitespace-nowrap">{d.week}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* SCRIPTS TAB                                                    */
/* ═══════════════════════════════════════════════════════════════ */

function ScriptsTab({ scripts, onAdd, onEdit, onDelete, onCopy }: {
    scripts: OutreachScript[];
    onAdd: () => void;
    onEdit: (script: OutreachScript) => void;
    onDelete: (id: string) => void;
    onCopy: (script: OutreachScript) => void;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Outreach Scripts</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Templates with <span className="text-blue-500 font-medium">{"{variables}"}</span> that auto-fill when copied</p>
                </div>
                <button onClick={onAdd}
                    className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Script
                </button>
            </div>

            {scripts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No scripts yet</p>
                    <p className="text-xs mt-1">Add your first outreach template</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {scripts.map(s => {
                        // Highlight {variables}
                        const rendered = s.content.split(/(\{[^}]+\})/g).map((part, i) =>
                            part.match(/^\{[^}]+\}$/)
                                ? <span key={i} className="text-blue-500 font-semibold bg-blue-50 px-1 rounded">{part}</span>
                                : <span key={i}>{part}</span>
                        );

                        return (
                            <div key={s.id} className="bg-background border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">{s.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <SourceBadge source={s.platform === "both" ? "linkedin" : s.platform as OutreachSource} />
                                            {s.category && <CategoryDot category={s.category} />}
                                            {s.useCount > 0 && (
                                                <span className="text-[10px] text-muted-foreground">{s.useCount}x copied</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-3.5 text-[12px] text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto mb-3 font-mono">
                                    {rendered}
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => onCopy(s)}
                                        className="flex-1 px-3 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-1.5">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                    <button onClick={() => onEdit(s)}
                                        className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => onDelete(s.id)}
                                        className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* SETTINGS TAB                                                   */
/* ═══════════════════════════════════════════════════════════════ */

function SettingsTab({ coaches, scripts, onClear, toast }: {
    coaches: OutreachCoach[];
    scripts: OutreachScript[];
    onClear: () => void;
    toast: (msg: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = { coaches, scripts, exportedAt: new Date().toISOString(), version: 1 };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `earlyedge-outreach-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        toast("Data exported!");
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (data.coaches) saveCoaches(data.coaches);
                if (data.scripts) saveScripts(data.scripts);
                toast(`Imported ${(data.coaches || []).length} coaches, ${(data.scripts || []).length} scripts!`);
                window.location.reload();
            } catch {
                toast("Invalid file format");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Export Data</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Download all {coaches.length} coaches and {scripts.length} scripts as JSON. Share with your cofounder.
                </p>
                <button onClick={handleExport}
                    className="w-full px-4 py-2.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors">
                    Export JSON
                </button>
            </div>

            <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Import Data</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Import data from a JSON export file. This will replace your current data.
                </p>
                <input type="file" ref={fileRef} accept=".json" onChange={handleImport} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    Import JSON
                </button>
            </div>

            <div className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-semibold text-foreground">Clear All Data</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Permanently delete all coaches and scripts. This cannot be undone.
                </p>
                <button onClick={onClear}
                    className="w-full px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                    Clear Everything
                </button>
            </div>

            {/* Supabase Migration Info */}
            <div className="md:col-span-3 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Live Sync with Supabase</h3>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Currently using localStorage. To enable real-time sync between you and your cofounder,
                            run the SQL migration in your Supabase dashboard to create the <code className="bg-blue-100 px-1 rounded">coach_outreach</code> and{" "}
                            <code className="bg-blue-100 px-1 rounded">outreach_scripts</code> tables, then the hooks can be swapped to Supabase queries.
                            Check the plan file for the full SQL.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* COACH DIALOG (Add / Edit)                                      */
/* ═══════════════════════════════════════════════════════════════ */

function CoachDialog({ open, onClose, coach, onSave }: {
    open: boolean;
    onClose: () => void;
    coach: OutreachCoach | null;
    onSave: (data: Partial<OutreachCoach>) => void;
}) {
    const emptyForm = {
        firstName: "", lastName: "", email: "", phone: "",
        linkedinUrl: "", university: "", graduationYear: "",
        credential: "", credentialYear: "" as string,
        categories: [] as string[], educationServices: [] as string[],
        careerServices: [] as string[], oxbridgeCollege: "", universityOffers: "",
        categoryExperience: "", coachingExperience: "",
        packageWillingness: "", weeklyHours: "",
        source: "linkedin" as OutreachSource, tiktokHandle: "", followerCount: "",
        outreachMethod: "linkedin" as OutreachMethod, priority: "medium" as OutreachPriority,
        status: "found" as OutreachStatus,
        linkedinMessageSent: "", linkedinReplied: false, linkedinReplyDate: "",
        tiktokDmSent: "", tiktokReplied: false, tiktokReplyDate: "",
        followUpDate: "", followUpNote: "",
        formSubmitted: false, formSubmittedDate: "",
        headshotUploaded: false,
        notes: "", addedBy: "Dylan",
    };

    const [form, setForm] = useState(emptyForm);
    const [section, setSection] = useState<"identity" | "application" | "outreach">("identity");

    useEffect(() => {
        if (coach) {
            setForm({
                firstName: coach.firstName || "", lastName: coach.lastName || "",
                email: coach.email || "", phone: coach.phone || "",
                linkedinUrl: coach.linkedinUrl || "", university: coach.university || "",
                graduationYear: coach.graduationYear || "",
                credential: coach.credential || "", credentialYear: coach.credentialYear?.toString() || "",
                categories: coach.categories || [],
                educationServices: coach.educationServices || [],
                careerServices: coach.careerServices || [],
                oxbridgeCollege: coach.oxbridgeCollege || "",
                universityOffers: coach.universityOffers || "",
                categoryExperience: coach.categoryExperience || "",
                coachingExperience: coach.coachingExperience || "",
                packageWillingness: coach.packageWillingness || "",
                weeklyHours: coach.weeklyHours || "",
                source: coach.source, tiktokHandle: coach.tiktokHandle || "",
                followerCount: coach.followerCount?.toString() || "",
                outreachMethod: coach.outreachMethod, priority: coach.priority,
                status: coach.status,
                linkedinMessageSent: coach.linkedinMessageSent || "",
                linkedinReplied: coach.linkedinReplied,
                linkedinReplyDate: coach.linkedinReplyDate || "",
                tiktokDmSent: coach.tiktokDmSent || "",
                tiktokReplied: coach.tiktokReplied,
                tiktokReplyDate: coach.tiktokReplyDate || "",
                followUpDate: coach.followUpDate || "",
                followUpNote: coach.followUpNote || "",
                formSubmitted: coach.formSubmitted || false,
                formSubmittedDate: coach.formSubmittedDate || "",
                headshotUploaded: coach.headshotUploaded || false,
                notes: coach.notes || "", addedBy: coach.addedBy || "Dylan",
            });
        } else {
            setForm(emptyForm);
        }
        setSection("identity");
    }, [coach, open]);

    const toggleArray = (arr: string[], val: string) =>
        arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
            name: `${form.firstName} ${form.lastName}`.trim(),
            credentialYear: form.credentialYear ? parseInt(form.credentialYear) : null,
            followerCount: parseInt(form.followerCount) || 0,
            linkedinMessageSent: form.linkedinMessageSent || null,
            linkedinReplyDate: form.linkedinReplyDate || null,
            tiktokDmSent: form.tiktokDmSent || null,
            tiktokReplyDate: form.tiktokReplyDate || null,
            followUpDate: form.followUpDate || null,
            formSubmittedDate: form.formSubmittedDate || null,
        });
    };

    if (!open) return null;

    const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
        <div className={full ? "col-span-2" : ""}>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
            {children}
        </div>
    );

    const inputCls = "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20";

    const sectionTabs: { key: typeof section; label: string }[] = [
        { key: "identity", label: "Identity & Discovery" },
        { key: "application", label: "Application Details" },
        { key: "outreach", label: "Outreach Tracking" },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-background border border-border rounded-2xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
                    <h2 className="text-base font-bold text-foreground">{coach ? "Edit Coach" : "Add Coach"}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg">
                        &times;
                    </button>
                </div>

                {/* Section Tabs */}
                <div className="px-6 pt-4 flex gap-1 border-b border-border">
                    {sectionTabs.map(t => (
                        <button key={t.key} type="button" onClick={() => setSection(t.key)}
                            className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                                section === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* ── Section 1: Identity & Discovery ── */}
                    {section === "identity" && (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name *">
                                <input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inputCls} placeholder="First name" />
                            </Field>
                            <Field label="Last Name *">
                                <input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inputCls} placeholder="Last name" />
                            </Field>
                            <Field label="Email">
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="coach@email.com" />
                            </Field>
                            <Field label="Phone (with country code)">
                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+44..." />
                            </Field>
                            <Field label="LinkedIn URL">
                                <input type="url" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} className={inputCls} placeholder="https://linkedin.com/in/..." />
                            </Field>
                            <Field label="TikTok Handle">
                                <input value={form.tiktokHandle} onChange={e => setForm({ ...form, tiktokHandle: e.target.value })} className={inputCls} placeholder="@handle" />
                            </Field>
                            <Field label="University & Course">
                                <input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className={inputCls} placeholder="e.g. LSE Economics, Oxford PPE" />
                            </Field>
                            <Field label="Graduation Year">
                                <input value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} className={inputCls} placeholder="e.g. 2025" />
                            </Field>
                            <Field label="Follower Count">
                                <input type="number" value={form.followerCount} onChange={e => setForm({ ...form, followerCount: e.target.value })} className={inputCls} placeholder="Approx followers" />
                            </Field>
                            <Field label="Found On">
                                <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value as OutreachSource })} className={inputCls}>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="referral">Referral</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Priority">
                                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as OutreachPriority })} className={inputCls}>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </Field>
                            <Field label="Status">
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as OutreachStatus })} className={inputCls}>
                                    {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                </select>
                            </Field>
                            <Field label="Added By">
                                <input value={form.addedBy} onChange={e => setForm({ ...form, addedBy: e.target.value })} className={inputCls} placeholder="Your name" />
                            </Field>
                            <Field label="Follow-up Date">
                                <input type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })} className={inputCls} />
                            </Field>
                            <Field label="Notes" full>
                                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} placeholder="Any notes..." />
                            </Field>
                        </div>
                    )}

                    {/* ── Section 2: Application Details (from Google Form) ── */}
                    {section === "application" && (
                        <div className="space-y-5">
                            <Field label="Main Achievement(s) / Credential(s)" full>
                                <textarea value={form.credential} onChange={e => setForm({ ...form, credential: e.target.value })} rows={2} className={inputCls}
                                    placeholder="e.g. Goldman Sachs Spring Week 2024, Oxford PPE 2025, UCAT Score 3150" />
                            </Field>

                            {/* Categories multi-select */}
                            <div>
                                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Categories (select all that apply)
                                </label>
                                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto border border-border rounded-lg p-3">
                                    {EARLYEDGE_CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-2 text-xs text-foreground cursor-pointer py-1 px-1.5 rounded hover:bg-muted/30">
                                            <input type="checkbox" checked={form.categories.includes(cat)}
                                                onChange={() => setForm({ ...form, categories: toggleArray(form.categories, cat) })}
                                                className="w-3.5 h-3.5 rounded border-border" />
                                            <span className="leading-snug">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                                {form.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {form.categories.map(c => (
                                            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">{c}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Field label="Experience in Selected Categories" full>
                                <textarea value={form.categoryExperience} onChange={e => setForm({ ...form, categoryExperience: e.target.value })} rows={2} className={inputCls}
                                    placeholder="Tell us more about your experience..." />
                            </Field>

                            {/* Education services multi-select */}
                            <div>
                                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Education-Focused Services
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {EDUCATION_SERVICES.map(svc => (
                                        <button key={svc} type="button"
                                            onClick={() => setForm({ ...form, educationServices: toggleArray(form.educationServices, svc) })}
                                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                                                form.educationServices.includes(svc)
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                                            }`}>
                                            {svc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Career services multi-select */}
                            <div>
                                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Career-Focused Services
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {CAREER_SERVICES.map(svc => (
                                        <button key={svc} type="button"
                                            onClick={() => setForm({ ...form, careerServices: toggleArray(form.careerServices, svc) })}
                                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                                                form.careerServices.includes(svc)
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                                            }`}>
                                            {svc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Oxbridge College (if applicable)">
                                    <input value={form.oxbridgeCollege} onChange={e => setForm({ ...form, oxbridgeCollege: e.target.value })} className={inputCls} placeholder="e.g. Trinity, St John's" />
                                </Field>
                                <Field label="University Offers Received">
                                    <input value={form.universityOffers} onChange={e => setForm({ ...form, universityOffers: e.target.value })} className={inputCls} placeholder="e.g. Oxford PPE, LSE Economics" />
                                </Field>
                                <Field label="Coaching Experience">
                                    <select value={form.coachingExperience} onChange={e => setForm({ ...form, coachingExperience: e.target.value })} className={inputCls}>
                                        <option value="">Select...</option>
                                        {COACHING_EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </Field>
                                <Field label="Would Offer Packages?">
                                    <select value={form.packageWillingness} onChange={e => setForm({ ...form, packageWillingness: e.target.value })} className={inputCls}>
                                        <option value="">Select...</option>
                                        {PACKAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </Field>
                                <Field label="Weekly Availability">
                                    <select value={form.weeklyHours} onChange={e => setForm({ ...form, weeklyHours: e.target.value })} className={inputCls}>
                                        <option value="">Select...</option>
                                        {WEEKLY_HOURS_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </Field>
                                <div className="flex flex-col gap-3 justify-end">
                                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                        <input type="checkbox" checked={form.formSubmitted}
                                            onChange={e => setForm({ ...form, formSubmitted: e.target.checked })}
                                            className="w-4 h-4 rounded border-border" />
                                        Google Form Submitted
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                        <input type="checkbox" checked={form.headshotUploaded}
                                            onChange={e => setForm({ ...form, headshotUploaded: e.target.checked })}
                                            className="w-4 h-4 rounded border-border" />
                                        Headshot Uploaded
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Section 3: Outreach Tracking ── */}
                    {section === "outreach" && (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Outreach Method">
                                <select value={form.outreachMethod} onChange={e => setForm({ ...form, outreachMethod: e.target.value as OutreachMethod })} className={inputCls}>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="tiktok">TikTok DM</option>
                                    <option value="email">Email</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Follow-up Date">
                                <input type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })} className={inputCls} />
                            </Field>

                            <div className="col-span-2 border-t border-border pt-4 mt-2">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">LinkedIn</span>
                            </div>
                            <Field label="LinkedIn Message Sent">
                                <input type="date" value={form.linkedinMessageSent} onChange={e => setForm({ ...form, linkedinMessageSent: e.target.value })} className={inputCls} />
                            </Field>
                            <div className="flex items-end gap-3">
                                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                    <input type="checkbox" checked={form.linkedinReplied} onChange={e => setForm({ ...form, linkedinReplied: e.target.checked })}
                                        className="w-4 h-4 rounded border-border" />
                                    LinkedIn Replied
                                </label>
                                {form.linkedinReplied && (
                                    <input type="date" value={form.linkedinReplyDate} onChange={e => setForm({ ...form, linkedinReplyDate: e.target.value })} className={`${inputCls} max-w-[160px]`} />
                                )}
                            </div>

                            <div className="col-span-2 border-t border-border pt-4 mt-2">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">TikTok</span>
                            </div>
                            <Field label="TikTok DM Sent">
                                <input type="date" value={form.tiktokDmSent} onChange={e => setForm({ ...form, tiktokDmSent: e.target.value })} className={inputCls} />
                            </Field>
                            <div className="flex items-end gap-3">
                                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                    <input type="checkbox" checked={form.tiktokReplied} onChange={e => setForm({ ...form, tiktokReplied: e.target.checked })}
                                        className="w-4 h-4 rounded border-border" />
                                    TikTok Replied
                                </label>
                                {form.tiktokReplied && (
                                    <input type="date" value={form.tiktokReplyDate} onChange={e => setForm({ ...form, tiktokReplyDate: e.target.value })} className={`${inputCls} max-w-[160px]`} />
                                )}
                            </div>

                            <Field label="Follow-up Note" full>
                                <input value={form.followUpNote} onChange={e => setForm({ ...form, followUpNote: e.target.value })} className={inputCls} placeholder="What to follow up about..." />
                            </Field>
                        </div>
                    )}

                    <div className="flex justify-between mt-6 pt-4 border-t border-border">
                        <div className="flex gap-2">
                            {section !== "identity" && (
                                <button type="button" onClick={() => setSection(section === "outreach" ? "application" : "identity")}
                                    className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                    Back
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose}
                                className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                Cancel
                            </button>
                            {section !== "outreach" ? (
                                <button type="button" onClick={() => setSection(section === "identity" ? "application" : "outreach")}
                                    className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center gap-1">
                                    Next <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <button type="submit"
                                    className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors">
                                    {coach ? "Save Changes" : "Add Coach"}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* SCRIPT DIALOG (Add / Edit)                                     */
/* ═══════════════════════════════════════════════════════════════ */

function ScriptDialog({ open, onClose, script, onSave }: {
    open: boolean;
    onClose: () => void;
    script: OutreachScript | null;
    onSave: (data: Partial<OutreachScript>) => void;
}) {
    const [form, setForm] = useState({
        name: "", platform: "linkedin" as ScriptPlatform, content: "", category: "", addedBy: "Dylan",
    });

    useEffect(() => {
        if (script) {
            setForm({ name: script.name, platform: script.platform, content: script.content, category: script.category, addedBy: script.addedBy });
        } else {
            setForm({ name: "", platform: "linkedin", content: "", category: "", addedBy: "Dylan" });
        }
    }, [script, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    // Detect variables in content
    const variables = form.content.match(/\{[^}]+\}/g) || [];

    if (!open) return null;

    const inputCls = "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-background border border-border rounded-2xl w-full max-w-[520px] shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-base font-bold text-foreground">{script ? "Edit Script" : "Add Script"}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Script Name *</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. LinkedIn Initial DM" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Platform</label>
                            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value as ScriptPlatform })} className={inputCls}>
                                <option value="linkedin">LinkedIn</option>
                                <option value="tiktok">TikTok</option>
                                <option value="email">Email</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Target Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                                <option value="">Any category</option>
                                {EARLYEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Script Content *</label>
                        <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={8} className={`${inputCls} font-mono text-xs leading-relaxed`}
                            placeholder="Write your outreach script here... Use {name}, {topic}, {credential} as variables" />
                    </div>
                    {variables.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-medium text-muted-foreground">Variables:</span>
                            {variables.map((v, i) => (
                                <span key={i} className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{v}</span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-border">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors">
                            {script ? "Save Changes" : "Add Script"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN PAGE                                                      */
/* ═══════════════════════════════════════════════════════════════ */

type OutreachTab = "dashboard" | "directory" | "pipeline" | "analytics" | "scripts" | "settings";

export default function AdminOutreach() {
    const [tab, setTab] = useState<OutreachTab>("dashboard");
    const [coaches, setCoaches] = useState<OutreachCoach[]>(() => loadCoaches());
    const [scripts, setScripts] = useState<OutreachScript[]>(() => loadScripts());

    // Dialogs
    const [coachDialogOpen, setCoachDialogOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<OutreachCoach | null>(null);
    const [scriptDialogOpen, setScriptDialogOpen] = useState(false);
    const [editingScript, setEditingScript] = useState<OutreachScript | null>(null);

    const { show: showToast, Toast } = useToast();

    // Sync to localStorage on change
    useEffect(() => { saveCoaches(coaches); }, [coaches]);
    useEffect(() => { saveScripts(scripts); }, [scripts]);

    // ─── Coach CRUD ───
    const handleSaveCoach = (data: Partial<OutreachCoach>) => {
        if (editingCoach) {
            setCoaches(prev => prev.map(c =>
                c.id === editingCoach.id ? {
                    ...c, ...data,
                    name: `${data.firstName || c.firstName} ${data.lastName || c.lastName}`.trim(),
                    updatedAt: new Date().toISOString(),
                } as OutreachCoach : c
            ));
            showToast("Coach updated!");
        } else {
            const firstName = data.firstName || "";
            const lastName = data.lastName || "";
            const newCoach: OutreachCoach = {
                id: uid(),
                // Identity
                firstName,
                lastName,
                name: `${firstName} ${lastName}`.trim(),
                email: data.email || "",
                phone: data.phone || "",
                linkedinUrl: data.linkedinUrl || "",
                // Academic
                university: data.university || "",
                graduationYear: data.graduationYear || "",
                // Credentials
                credential: data.credential || "",
                credentialYear: data.credentialYear ?? null,
                categories: data.categories || [],
                educationServices: data.educationServices || [],
                careerServices: data.careerServices || [],
                oxbridgeCollege: data.oxbridgeCollege || "",
                universityOffers: data.universityOffers || "",
                categoryExperience: data.categoryExperience || "",
                // Coaching details
                coachingExperience: data.coachingExperience || "",
                packageWillingness: data.packageWillingness || "",
                weeklyHours: data.weeklyHours || "",
                // Discovery
                source: data.source || "linkedin",
                tiktokHandle: data.tiktokHandle || "",
                followerCount: data.followerCount || 0,
                // Pipeline
                status: data.status || "found",
                priority: data.priority || "medium",
                outreachMethod: data.outreachMethod || "linkedin",
                // Outreach tracking
                linkedinMessageSent: data.linkedinMessageSent || null,
                linkedinReplied: data.linkedinReplied || false,
                linkedinReplyDate: data.linkedinReplyDate || null,
                tiktokDmSent: data.tiktokDmSent || null,
                tiktokReplied: data.tiktokReplied || false,
                tiktokReplyDate: data.tiktokReplyDate || null,
                followUpDate: data.followUpDate || null,
                followUpNote: data.followUpNote || "",
                // Application
                formSubmitted: data.formSubmitted || false,
                formSubmittedDate: data.formSubmittedDate || null,
                headshotUploaded: data.headshotUploaded || false,
                // Meta
                notes: data.notes || "",
                addedBy: data.addedBy || "Dylan",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCoaches(prev => [newCoach, ...prev]);
            showToast("Coach added!");
        }
        setCoachDialogOpen(false);
        setEditingCoach(null);
    };

    const handleDeleteCoach = (id: string) => {
        if (!confirm("Delete this coach?")) return;
        setCoaches(prev => prev.filter(c => c.id !== id));
        showToast("Coach deleted");
    };

    const handleUpdateStatus = (id: string, status: OutreachStatus) => {
        setCoaches(prev => prev.map(c =>
            c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
        ));
        showToast(`Moved to ${STATUS_LABELS[status]}`);
    };

    const handleEditCoach = (coach: OutreachCoach) => {
        setEditingCoach(coach);
        setCoachDialogOpen(true);
    };

    const handleAddCoach = () => {
        setEditingCoach(null);
        setCoachDialogOpen(true);
    };

    // ─── Script CRUD ───
    const handleSaveScript = (data: Partial<OutreachScript>) => {
        if (editingScript) {
            setScripts(prev => prev.map(s =>
                s.id === editingScript.id ? { ...s, ...data, updatedAt: new Date().toISOString() } as OutreachScript : s
            ));
            showToast("Script updated!");
        } else {
            const newScript: OutreachScript = {
                id: uid(),
                name: data.name || "",
                platform: data.platform || "linkedin",
                content: data.content || "",
                category: data.category || "",
                useCount: 0,
                addedBy: data.addedBy || "Dylan",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setScripts(prev => [...prev, newScript]);
            showToast("Script added!");
        }
        setScriptDialogOpen(false);
        setEditingScript(null);
    };

    const handleDeleteScript = (id: string) => {
        if (!confirm("Delete this script?")) return;
        setScripts(prev => prev.filter(s => s.id !== id));
        showToast("Script deleted");
    };

    const handleCopyScript = (script: OutreachScript) => {
        navigator.clipboard.writeText(script.content).then(() => {
            setScripts(prev => prev.map(s =>
                s.id === script.id ? { ...s, useCount: s.useCount + 1, updatedAt: new Date().toISOString() } : s
            ));
            showToast("Script copied to clipboard!");
        }).catch(() => showToast("Copy failed"));
    };

    const handleClear = () => {
        if (!confirm("Are you sure? This will delete ALL coaches and scripts.")) return;
        if (!confirm("Really? This cannot be undone.")) return;
        setCoaches([]);
        setScripts(getDefaultScripts());
        showToast("All data cleared");
    };

    const tabs: { key: OutreachTab; label: string; count?: number }[] = [
        { key: "dashboard", label: "Dashboard" },
        { key: "directory", label: "Directory", count: coaches.length },
        { key: "pipeline", label: "Pipeline" },
        { key: "analytics", label: "Analytics" },
        { key: "scripts", label: "Scripts", count: scripts.length },
        { key: "settings", label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Target className="w-6 h-6" /> Coach Outreach Tracker
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Track, manage, and analyse your coach recruitment pipeline
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <button onClick={handleAddCoach}
                            className="px-4 py-2.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" /> Add Coach
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border mb-6 overflow-x-auto">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap flex items-center gap-1.5 ${
                                tab === t.key
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {t.label}
                            {t.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                                    tab === t.key ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                                }`}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {tab === "dashboard" && <DashboardTab coaches={coaches} />}
                {tab === "directory" && (
                    <DirectoryTab
                        coaches={coaches}
                        onEdit={handleEditCoach}
                        onDelete={handleDeleteCoach}
                        onUpdateStatus={handleUpdateStatus}
                        onAdd={handleAddCoach}
                    />
                )}
                {tab === "pipeline" && (
                    <PipelineTab
                        coaches={coaches}
                        onUpdateStatus={handleUpdateStatus}
                        onEdit={handleEditCoach}
                    />
                )}
                {tab === "analytics" && <AnalyticsTab coaches={coaches} />}
                {tab === "scripts" && (
                    <ScriptsTab
                        scripts={scripts}
                        onAdd={() => { setEditingScript(null); setScriptDialogOpen(true); }}
                        onEdit={s => { setEditingScript(s); setScriptDialogOpen(true); }}
                        onDelete={handleDeleteScript}
                        onCopy={handleCopyScript}
                    />
                )}
                {tab === "settings" && (
                    <SettingsTab coaches={coaches} scripts={scripts} onClear={handleClear} toast={showToast} />
                )}
            </main>
            <Footer />

            {/* Dialogs */}
            <CoachDialog
                open={coachDialogOpen}
                onClose={() => { setCoachDialogOpen(false); setEditingCoach(null); }}
                coach={editingCoach}
                onSave={handleSaveCoach}
            />
            <ScriptDialog
                open={scriptDialogOpen}
                onClose={() => { setScriptDialogOpen(false); setEditingScript(null); }}
                script={editingScript}
                onSave={handleSaveScript}
            />

            {/* Toast */}
            {Toast}
        </div>
    );
}
