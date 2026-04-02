import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Coach } from "@/types/coach";

// Colour palette for category pills
const PILL_COLOURS: Record<string, string> = {
    "Investment Banking": "pill-blue",
    "Spring Week": "pill-indigo",
    "Consulting": "pill-violet",
    "Law": "pill-indigo",
    "UCAT": "pill-emerald",
    "Oxbridge": "pill-amber",
    "Software Engineering": "pill-cyan",
    "Interview Prep": "pill-rose",
    "Personal Statements": "pill-amber",
    "Networking": "pill-blue",
    "CV/Resume": "pill-violet",
    "Case Studies": "pill-violet",
    "Strategy": "pill-indigo",
};

function pillClass(skill: string): string {
    return PILL_COLOURS[skill] ?? "pill-blue";
}

interface CoachCardProps {
    coach: Coach;
    hovered: boolean;
    onHover: (id: string | null) => void;
}

export function CoachCard({ coach, hovered, onHover }: CoachCardProps) {
    const displayedSkills = coach.skills.slice(0, 3);
    const extraSkills = coach.skills.length - displayedSkills.length;

    // Initials avatar fallback
    const initials = coach.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const universityShort = coach.university?.name
        ? coach.university.name.replace("University of ", "").replace(" University", "")
        : "";

    return (
        <Link
            to={`/coach/${coach.id}`}
            onMouseEnter={() => onHover(coach.id)}
            onMouseLeave={() => onHover(null)}
            className={`block bg-background border rounded-xl cursor-pointer transition-all duration-200 p-5 ${
                hovered
                    ? "border-foreground/20 -translate-y-0.5 shadow-lg shadow-black/8"
                    : "border-border"
            }`}
        >
            {/* Top row: avatar + name + rate */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar with gradient ring on hover */}
                    <div
                        className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            hovered
                                ? "ring-2 ring-offset-1 ring-indigo-400/60"
                                : "ring-1 ring-border"
                        } ${
                            coach.photo
                                ? "overflow-hidden bg-muted"
                                : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                        }`}
                    >
                        {coach.photo ? (
                            <img
                                src={coach.photo}
                                alt={coach.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>

                    <div>
                        <p className="text-[14px] font-semibold tracking-tight text-foreground leading-tight">
                            {coach.name}
                        </p>
                        {/* Credential / tagline */}
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                            {coach.tagline || coach.company?.role || "Coach"}
                        </p>
                        {/* University badge */}
                        {universityShort && (
                            <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground leading-none">
                                {universityShort}
                            </span>
                        )}
                    </div>
                </div>

                {/* Hourly rate */}
                <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-[17px] font-bold tracking-tight text-foreground">
                        £{Math.round(coach.hourlyRate)}
                    </span>
                    <span className="text-[11px] font-normal text-muted-foreground">/hr</span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {coach.bio}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">
                        {coach.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        ({coach.reviewCount})
                    </span>
                </div>

                {/* Sessions */}
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
                    {coach.sessionsCompleted} sessions
                </div>
            </div>

            {/* Category pills + CTA */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                    {displayedSkills.map((skill) => (
                        <span
                            key={skill}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pillClass(skill)}`}
                        >
                            {skill}
                        </span>
                    ))}
                    {extraSkills > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{extraSkills}
                        </span>
                    )}
                </div>

                <span
                    className={`text-[11px] font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                        hovered
                            ? "gradient-cta text-white shadow-sm"
                            : "bg-foreground/5 text-foreground"
                    }`}
                >
                    Book free intro
                </span>
            </div>
        </Link>
    );
}
