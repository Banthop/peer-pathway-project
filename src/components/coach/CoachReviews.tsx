import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Coach } from "@/types/coach";

interface CoachReviewsProps {
  coach: Coach;
}

const CoachReviews = ({ coach }: CoachReviewsProps) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleReviews = coach.reviews.slice(0, visibleCount);
  const hasMore = visibleCount < coach.reviews.length;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-xl font-sans font-medium text-foreground mb-6">
        {coach.reviewCount} Reviews
      </h2>

      {/* Overall Rating */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground font-sans font-light">
          Overall:
        </span>
        {renderStars(Math.round(coach.rating))}
        <span className="text-sm font-sans font-medium text-foreground">
          {coach.rating}
        </span>
      </div>

      {/* Category Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-secondary/30 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground font-sans font-light mb-1">
            Knowledge
          </p>
          <p className="text-sm font-sans font-medium text-foreground">
            {coach.ratings.knowledge.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-sans font-light mb-1">
            Value
          </p>
          <p className="text-sm font-sans font-medium text-foreground">
            {coach.ratings.value.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-sans font-light mb-1">
            Responsiveness
          </p>
          <p className="text-sm font-sans font-medium text-foreground">
            {coach.ratings.responsiveness.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-sans font-light mb-1">
            Supportiveness
          </p>
          <p className="text-sm font-sans font-medium text-foreground">
            {coach.ratings.supportiveness.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Success Companies */}
      {coach.successCompanies.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm text-muted-foreground font-sans font-light">
            Successful clients at:
          </span>
          <div className="flex items-center gap-2">
            {coach.successCompanies.slice(0, 4).map((company, index) => (
              <div
                key={index}
                className="h-7 px-2 rounded bg-secondary flex items-center justify-center overflow-hidden"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-5 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-4">
        {visibleReviews.map((review, index) => (
          <Card key={index} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-sans font-medium text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans font-light">
                    {review.date}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-foreground font-sans font-light leading-relaxed">
                {review.text}
              </p>
              {review.outcome && (
                <Badge
                  variant="secondary"
                  className="mt-3 font-sans font-light text-xs"
                >
                  ✓ {review.outcome}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="font-sans font-light"
          >
            Load more reviews
          </Button>
        </div>
      )}
    </section>
  );
};

export default CoachReviews;
