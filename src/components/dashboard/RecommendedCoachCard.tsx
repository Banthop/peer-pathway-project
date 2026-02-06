import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { RecommendedCoach } from "@/types/dashboard";

interface RecommendedCoachCardProps {
  coach: RecommendedCoach;
}

export function RecommendedCoachCard({ coach }: RecommendedCoachCardProps) {
  const hasReviews = coach.rating && coach.reviewCount && coach.reviewCount > 0;

  return (
    <div className="min-w-[240px] flex flex-col rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={coach.photo} alt={coach.name} />
          <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-foreground">{coach.name}</h3>
          <p className="text-xs text-muted-foreground">{coach.credential} · {coach.year}</p>
        </div>
      </div>

      {/* Rating or New coach */}
      <div className="mb-3">
        {hasReviews ? (
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
            <span className="text-sm text-foreground">{coach.rating!.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({coach.reviewCount})</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">New coach</span>
        )}
      </div>

      {/* Tags as plain text */}
      <p className="text-xs text-muted-foreground mb-4 line-clamp-1">
        {coach.tags.slice(0, 3).join(" · ")}
      </p>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm text-foreground">£{coach.hourlyRate}/hr</span>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 text-xs border-border text-foreground hover:bg-muted font-sans"
        >
          <Link to={`/coach/${coach.id}`}>View profile</Link>
        </Button>
      </div>
    </div>
  );
}
