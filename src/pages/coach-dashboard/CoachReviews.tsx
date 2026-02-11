import { useState } from "react";
import { Star, TrendingUp, MessageSquare, ChevronDown } from "lucide-react";
import {
    coachReviews, ratingDistribution, ratingBreakdown, coachStats,
} from "@/data/coachDashboardData";
import type { StudentReview } from "@/data/coachDashboardData";

/* ─── Star Rating ───────────────────────────────────────────── */

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center" style={{ gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} style={{ width: size, height: size }}
                    className={i <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-none text-border"} />
            ))}
        </div>
    );
}

/* ─── Rating Overview Sidebar ───────────────────────────────── */

function RatingOverview() {
    const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
    const maxCount = Math.max(...ratingDistribution.map((r) => r.count));

    return (
        <div className="space-y-6">
            {/* Overall */}
            <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-foreground mb-2">{coachStats.averageRating}</div>
                <StarRating rating={coachStats.averageRating} size={18} />
                <p className="text-xs text-muted-foreground mt-2">{totalReviews} reviews</p>
            </div>

            {/* Breakdown */}
            <div className="bg-background border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Rating Breakdown</h3>
                <div className="space-y-3">
                    {(["knowledge", "value", "responsiveness", "supportiveness"] as const).map((key) => (
                        <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground capitalize w-28 shrink-0">{key}</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-foreground rounded-full" style={{ width: `${(ratingBreakdown[key] / 5) * 100}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-foreground w-8 text-right">{ratingBreakdown[key]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distribution */}
            <div className="bg-background border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Distribution</h3>
                <div className="space-y-2.5">
                    {ratingDistribution.map((r) => (
                        <div key={r.stars} className="flex items-center gap-2.5">
                            <span className="text-xs font-medium text-foreground w-6 text-right">{r.stars}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-foreground rounded-full transition-all duration-500"
                                    style={{ width: maxCount > 0 ? `${(r.count / maxCount) * 100}%` : "0%" }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground w-6">{r.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Review Card ───────────────────────────────────────────── */

function ReviewCard({ review }: { review: StudentReview }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState(review.reply || "");

    return (
        <div className="bg-background border border-border rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border">
                        {review.avatar}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{review.student}</p>
                        <p className="text-[11px] text-muted-foreground">{review.sessionType} · {review.date}</p>
                    </div>
                </div>
                <StarRating rating={review.rating} size={13} />
            </div>

            {/* Review text */}
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{review.text}</p>

            {/* Outcome badge */}
            {review.outcome && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium mb-3">
                    <TrendingUp className="w-3 h-3" /> {review.outcome}
                </div>
            )}

            {/* Existing reply */}
            {review.replied && review.reply && (
                <div className="mt-3 pl-4 border-l-2 border-foreground/15">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1">Your reply</p>
                    <p className="text-xs text-muted-foreground">{review.reply}</p>
                </div>
            )}

            {/* Reply action */}
            {!review.replied && (
                <div className="mt-3">
                    {!showReply ? (
                        <button
                            onClick={() => setShowReply(true)}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <MessageSquare className="w-3 h-3" /> Reply
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                                placeholder="Write your reply..."
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
                            />
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors">
                                    Post Reply
                                </button>
                                <button onClick={() => setShowReply(false)} className="px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachReviews() {
    const [filter, setFilter] = useState<"all" | "5" | "4" | "3">("all");

    const filteredReviews = filter === "all"
        ? coachReviews
        : coachReviews.filter((r) => r.rating === parseInt(filter));

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Reviews</h1>
                <p className="text-sm text-muted-foreground">{coachReviews.length} reviews from students</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                {/* Main Column */}
                <div className="space-y-4 min-w-0">
                    {/* Filter */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">Filter:</span>
                        {(["all", "5", "4", "3"] as const).map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                                    }`}>
                                {f === "all" ? "All" : `${f}★`}
                            </button>
                        ))}
                    </div>

                    {/* Reviews List */}
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">No reviews match this filter</div>
                    ) : (
                        filteredReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:sticky lg:top-8 lg:self-start">
                    <RatingOverview />
                </div>
            </div>
        </div>
    );
}
