import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Coach } from "@/types/coach";

interface CoachAboutProps {
  coach: Coach;
}

const CoachAbout = ({ coach }: CoachAboutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordCount = coach.bio.split(" ").length;
  const shouldTruncate = wordCount > 100;

  const displayedBio =
    shouldTruncate && !isExpanded
      ? coach.bio.split(" ").slice(0, 100).join(" ") + "..."
      : coach.bio;

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-xl font-sans font-medium text-foreground mb-4">
        About {coach.name.split(" ")[0]}
      </h2>

      <div className="mb-6">
        <p className="text-sm text-foreground font-sans font-light whitespace-pre-line leading-relaxed">
          {displayedBio}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary font-sans font-light mt-2 hover:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground font-sans font-light mb-3">
          Can help with:
        </p>
        <div className="flex flex-wrap gap-2">
          {coach.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="font-sans font-light text-xs px-3 py-1"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachAbout;
