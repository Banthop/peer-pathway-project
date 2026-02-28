import { useState } from "react";
import {
    FileText, Video, Link2, Download, ExternalLink,
    BookOpen, CheckSquare, Wrench, PenTool, Search, Filter,
} from "lucide-react";
import { useResources, useMyPurchases, usePurchaseResource, type ResourceData } from "@/hooks/useResources";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Resource type config ──────────────────────────────────── */

const typeIcons: Record<string, React.ElementType> = {
    guide: BookOpen,
    template: FileText,
    checklist: CheckSquare,
    toolkit: Wrench,
    article: PenTool,
};

const typeLabels: Record<string, string> = {
    guide: "Guide",
    template: "Template",
    checklist: "Checklist",
    toolkit: "Toolkit",
    article: "Article",
};

const typeGradients: Record<string, string> = {
    guide: "from-blue-600 to-indigo-800",
    template: "from-emerald-600 to-teal-800",
    checklist: "from-violet-600 to-purple-800",
    toolkit: "from-amber-500 to-orange-700",
    article: "from-cyan-600 to-blue-800",
};

const categories = [
    "All",
    "Investment Banking",
    "Consulting",
    "Law",
    "UCAT",
    "Oxbridge",
    "Software Engineering",
    "Cold Emailing",
    "Graduate Schemes",
];

const resourceTypes = ["All", "guide", "template", "checklist", "toolkit", "article"];

/* ─── Mock resources for initial UI ─────────────────────────── */

const mockResources: ResourceData[] = [
    {
        id: "1", coach_id: "c1", title: "My Exact Goldman Sachs Application — Annotated",
        description: "The complete application I submitted to Goldman Sachs for their Spring Week programme, with annotations explaining every decision I made.",
        category: "Investment Banking", resource_type: "guide", price: 1000, file_url: null,
        preview_text: "Walk through the exact Cover Letter and CV that landed a Spring Week at Goldman Sachs...",
        download_count: 89, is_active: true, is_featured: true, created_at: "2026-02-10T00:00:00Z",
        coach: { user: { name: "Sarah K.", avatar_url: null }, headline: "Goldman Sachs Spring Week '24", university: "LSE" },
    },
    {
        id: "2", coach_id: "c2", title: "UCAT Score Boost: 2500 → 3100+ Study Plan",
        description: "The 8-week study plan I used to increase my UCAT score by 600 points. Includes daily schedules, resource links, and practice strategies.",
        category: "UCAT", resource_type: "template", price: 800, file_url: null,
        preview_text: "Week-by-week breakdown of how I structured my UCAT prep...",
        download_count: 156, is_active: true, is_featured: true, created_at: "2026-02-08T00:00:00Z",
        coach: { user: { name: "Priya M.", avatar_url: null }, headline: "UCAT 3150, Cambridge Medicine", university: "Cambridge" },
    },
    {
        id: "3", coach_id: "c3", title: "Cold Email Templates That Actually Get Replies",
        description: "12 email templates that got me meetings with managing directors at 5 top banks. Includes subject lines, follow-ups, and LinkedIn connection request scripts.",
        category: "Cold Emailing", resource_type: "toolkit", price: 500, file_url: null,
        preview_text: "Template 1: The 'Warm Intro Request' — use when you have a mutual connection...",
        download_count: 234, is_active: true, is_featured: false, created_at: "2026-02-05T00:00:00Z",
        coach: { user: { name: "David W.", avatar_url: null }, headline: "McKinsey Summer Analyst '24", university: "Oxford" },
    },
    {
        id: "4", coach_id: "c4", title: "Spring Week Application Checklist",
        description: "Every step from research to submission. A complete checklist covering 15+ banks with key deadlines, requirements, and tips for each.",
        category: "Investment Banking", resource_type: "checklist", price: 0, file_url: null,
        preview_text: "✅ Research: Open dates and eligibility for each bank\n✅ CV: Tailor bullet points to the specific division...",
        download_count: 312, is_active: true, is_featured: false, created_at: "2026-02-01T00:00:00Z",
        coach: { user: { name: "Sarah K.", avatar_url: null }, headline: "Goldman Sachs Spring Week '24", university: "LSE" },
    },
    {
        id: "5", coach_id: "c5", title: "How I Got Into Oxford PPE",
        description: "My complete application journey — personal statement drafts, interview preparation notes, and the reading list that helped me stand out.",
        category: "Oxbridge", resource_type: "article", price: 0, file_url: null,
        preview_text: "The key to my Oxford interview was showing genuine intellectual curiosity...",
        download_count: 187, is_active: true, is_featured: false, created_at: "2026-01-28T00:00:00Z",
        coach: { user: { name: "Tom H.", avatar_url: null }, headline: "Oxford PPE '24", university: "Oxford" },
    },
    {
        id: "6", coach_id: "c6", title: "Training Contract Cover Letter Framework",
        description: "The framework I used to write 15+ vac scheme cover letters. Includes structure, do's and don'ts, and examples from successful applications.",
        category: "Law", resource_type: "guide", price: 700, file_url: null,
        preview_text: "Structure: Hook → Why the firm → Why commercial law → Why you...",
        download_count: 98, is_active: true, is_featured: false, created_at: "2026-01-25T00:00:00Z",
        coach: { user: { name: "Emily R.", avatar_url: null }, headline: "Clifford Chance TC '24", university: "UCL" },
    },
];

/* ─── Resource Card ─────────────────────────────────────────── */

function ResourceCard({ resource, purchased, onPurchase }: {
    resource: ResourceData;
    purchased: boolean;
    onPurchase: () => void;
}) {
    const Icon = typeIcons[resource.resource_type] || FileText;
    const gradient = typeGradients[resource.resource_type] || "from-gray-600 to-gray-800";
    const isFree = resource.price === 0;
    const coachName = resource.coach?.user?.name || "Coach";
    const coachInitials = coachName.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="bg-background border border-border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md group">
            {/* Gradient header */}
            <div className={`relative h-32 bg-gradient-to-br ${gradient} px-5 py-4 flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {typeLabels[resource.resource_type]}
                    </span>
                    {isFree ? (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            Free
                        </span>
                    ) : (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            £{(resource.price / 100).toFixed(0)}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
                        {resource.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
                <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {resource.description}
                </p>

                {resource.preview_text && (
                    <div className="bg-muted/30 rounded-lg p-3 mb-3 border border-border/50">
                        <p className="text-[11px] text-foreground/60 italic line-clamp-2">
                            "{resource.preview_text}"
                        </p>
                    </div>
                )}

                {/* Coach + Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground flex-shrink-0">
                            {coachInitials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-foreground truncate">{coachName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{resource.coach?.headline}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
                        <Download className="w-3 h-3" />
                        {resource.download_count}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-4">
                {purchased || isFree ? (
                    <button className="w-full py-2.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors flex items-center justify-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        {isFree ? "Download Free" : "Download"}
                    </button>
                ) : (
                    <button
                        onClick={onPurchase}
                        className="w-full py-2.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                    >
                        Get Access · £{(resource.price / 100).toFixed(0)}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function DashboardResources() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const { user } = useAuth();
    const { data: dbResources = [] } = useResources({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        type: selectedType !== "All" ? selectedType : undefined,
        freeOnly: showFreeOnly,
    });
    const { data: myPurchases = [] } = useMyPurchases();
    const purchaseMutation = usePurchaseResource();

    // Use DB data if available, otherwise show mock resources
    const allResources = dbResources.length > 0 ? dbResources : mockResources;

    const filteredResources = allResources.filter((r) => {
        if (selectedCategory !== "All" && r.category !== selectedCategory) return false;
        if (selectedType !== "All" && r.resource_type !== selectedType) return false;
        if (showFreeOnly && r.price > 0) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                r.title.toLowerCase().includes(q) ||
                (r.description || "").toLowerCase().includes(q) ||
                (r.category || "").toLowerCase().includes(q)
            );
        }
        return true;
    });

    return (
        <div className="w-full">
            {/* Header */}
            <div className="px-6 pt-8 pb-0 md:px-10 lg:px-12">
                <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground mb-1">
                    Resources
                </h1>
                <p className="text-sm text-muted-foreground">
                    Guides, templates, and toolkits from coaches who've been where you're going
                </p>
            </div>

            {/* Search + Filters */}
            <div className="px-6 md:px-10 lg:px-12 mt-5 space-y-4">
                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                </div>

                {/* Filter row */}
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-background border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground cursor-pointer font-sans appearance-none pr-8"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                        }}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === "All" ? "All categories" : cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-background border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground cursor-pointer font-sans appearance-none pr-8"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                        }}
                    >
                        {resourceTypes.map((t) => (
                            <option key={t} value={t}>
                                {t === "All" ? "All types" : typeLabels[t] || t}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowFreeOnly(!showFreeOnly)}
                        className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${showFreeOnly
                                ? "bg-foreground text-background"
                                : "bg-background border border-border text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Free only
                    </button>
                </div>
            </div>

            {/* Featured section */}
            {selectedCategory === "All" && !searchQuery && (
                <div className="px-6 md:px-10 lg:px-12 mt-6">
                    <h2 className="text-base font-semibold text-foreground mb-1">Featured</h2>
                    <p className="text-[12px] text-muted-foreground mb-4">Our most popular resources this month</p>
                </div>
            )}

            {/* Resource Grid */}
            <div className="px-6 md:px-10 lg:px-12 mt-4 pb-10">
                {filteredResources.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-base font-medium mb-2">No resources found</p>
                        <p className="text-[13px]">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredResources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                purchased={myPurchases.includes(resource.id)}
                                onPurchase={() => purchaseMutation.mutate(resource.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
