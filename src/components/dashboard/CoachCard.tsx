import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Coach } from "@/data/dashboardData";

interface CoachCardProps {
    coach: Coach;
    hovered: boolean;
    onHover: (id: number | null) => void;
    large?: boolean;
}

export function CoachCard({ coach, hovered, onHover, large }: CoachCardProps) {
    return (
        <Link
            to={`/coach/${coach.id}`}
            onMouseEnter={() => onHover(coach.id)}
            onMouseLeave={() => onHover(null)}
            className={`block bg-background border rounded-xl cursor-pointer transition-all duration-200 ${large ? "p-6" : "p-5"
                } ${hovered
                    ? "border-foreground/30 -translate-y-0.5 shadow-md"
                    : "border-border"
                }`}
        >
            {/* Top: Avatar + Name + Price */}
            <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {coach.avatar}
                    </div>
                    <div>
                        <p className="text-[15px] font-semibold tracking-tight text-foreground">
                            {coach.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            {coach.credential} · {coach.uni}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[17px] font-bold tracking-tight text-foreground">
                        £{coach.rate}
                    </span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                        /hr
                    </span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-3">
                {coach.bio}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-foreground text-foreground" />
                    <span className="text-xs font-semibold text-foreground">
                        {coach.rating}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        ({coach.reviews})
                    </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <rect x="2" y="2" width="12" height="12" rx="2" />
                        <path d="M5 7h6M5 10h3" />
                    </svg>
                    {coach.sessions} sessions
                </div>
            </div>

            {/* Package */}
            <div className="bg-muted rounded-lg px-3.5 py-2.5 mb-3.5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-foreground">
                        {coach.packageName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                        {coach.packageSessions} sessions · £
                        {Math.round(coach.packagePrice / coach.packageSessions)}/session
                    </p>
                </div>
                <span className="text-sm font-bold text-foreground">
                    £{coach.packagePrice}
                </span>
            </div>

            {/* Tags + CTA */}
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {coach.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-[10.5px] px-2.5 py-0.5 bg-muted rounded-full text-muted-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <span
                    className={`text-xs font-semibold whitespace-nowrap px-3.5 py-1.5 rounded-md transition-all duration-200 ${hovered
                            ? "bg-foreground text-background"
                            : "bg-transparent text-foreground"
                        }`}
                >
                    {coach.hasBooked ? "Book again →" : "Free intro →"}
                </span>
            </div>
        </Link>
    );
}
