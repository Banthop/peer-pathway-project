import { Star, Calendar, Clock, ArrowRight, MessageSquare, FileText } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

export interface CoachSession {
    id: number | string;
    student: string;
    avatar: string;
    type: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    status: "upcoming" | "completed" | "cancelled";
    isNext?: boolean;
    hasMessage?: boolean;
    reviewed?: boolean;
    rating?: number;
    reviewText?: string;
    notes?: string;
}

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={star <= Math.round(rating) ? "fill-foreground text-foreground" : "text-border"}
                    style={{ width: size, height: size }}
                />
            ))}
        </div>
    );
}

interface SessionDetailPanelProps {
    session: CoachSession | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SessionDetailPanel({ session, open, onOpenChange }: SessionDetailPanelProps) {
    if (!session) return null;

    const isUpcoming = session.status === "upcoming";

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[420px] overflow-y-auto">
                <SheetHeader className="pb-0">
                    <SheetTitle className="text-lg tracking-tight">Session Details</SheetTitle>
                    <SheetDescription>
                        {isUpcoming ? "Upcoming session" : "Past session"} · {session.date}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Student + Session Type */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-muted border-2 border-border flex items-center justify-center text-base font-semibold text-muted-foreground flex-shrink-0">
                            {session.avatar}
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">{session.student}</h3>
                            <p className="text-sm text-muted-foreground">{session.type}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Calendar className="w-3 h-3" /> Date
                            </div>
                            <div className="text-sm font-medium text-foreground">{session.date}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Clock className="w-3 h-3" /> Time
                            </div>
                            <div className="text-sm font-medium text-foreground">{session.time}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Clock className="w-3 h-3" /> Duration
                            </div>
                            <div className="text-sm font-medium text-foreground">{session.duration}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                £ Price
                            </div>
                            <div className="text-sm font-bold text-foreground">£{session.price}</div>
                        </div>
                    </div>

                    {/* Student Notes */}
                    {session.notes && (
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                <FileText className="w-3 h-3" /> Student Notes
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground/80 leading-relaxed border border-border/50">
                                "{session.notes}"
                            </div>
                        </div>
                    )}

                    {/* Actions for Upcoming */}
                    {isUpcoming && (
                        <div className="flex flex-col gap-2.5 pt-2">
                            <button className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                                Join call <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <Link
                                to="/coach-dashboard/messages"
                                className="w-full py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-3.5 h-3.5" /> Send a message
                            </Link>
                        </div>
                    )}

                    {/* Review for Past */}
                    {!isUpcoming && (
                        <div>
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Student Review
                            </div>
                            {session.reviewed && session.rating ? (
                                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <StarRating rating={session.rating} size={13} />
                                        <span className="text-sm font-semibold text-foreground">{session.rating}.0</span>
                                    </div>
                                    {session.reviewText && (
                                        <p className="text-sm text-foreground/70 leading-relaxed">
                                            "{session.reviewText}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground text-center border border-dashed border-border">
                                    No review yet
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
