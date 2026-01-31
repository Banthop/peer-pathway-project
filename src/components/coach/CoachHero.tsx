import { Star } from "lucide-react";
import type { Coach } from "@/types/coach";

interface CoachHeroProps {
  coach: Coach;
}

const CoachHero = ({ coach }: CoachHeroProps) => {
  return (
    <section className="pb-8">
      {/* Photo + Name + Rating */}
      <div className="flex items-start gap-5 mb-4">
        <img
          src={coach.photo}
          alt={coach.name}
          className="w-24 h-24 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-sans font-medium text-foreground">
              {coach.name}
            </h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-sans font-light text-foreground">
                {coach.rating}
              </span>
              <span className="text-sm text-muted-foreground font-sans font-light">
                ({coach.reviewCount} reviews)
              </span>
            </div>
          </div>
          <p className="text-base text-muted-foreground font-sans font-light mb-2">
            {coach.tagline}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans font-light">
            <span>{coach.sessionsCompleted} sessions</span>
            <span>·</span>
            <span>{coach.followers} followers</span>
          </div>
        </div>
      </div>

      {/* University/Company Badges */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center overflow-hidden">
            <img
              src={coach.university.logo}
              alt={coach.university.name}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-sm font-sans font-light text-foreground">
            Studied at {coach.university.name.split(" ").pop()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center overflow-hidden">
            <img
              src={coach.company.logo}
              alt={coach.company.name}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-sm font-sans font-light text-foreground">
            {coach.company.role} at {coach.company.name}
          </span>
        </div>
      </div>

      {/* Success Companies */}
      {coach.successCompanies.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground font-sans font-light">
            Successful clients at:
          </span>
          <div className="flex items-center gap-2">
            {coach.successCompanies.slice(0, 4).map((company, index) => (
              <div
                key={index}
                className="h-8 px-2 rounded bg-secondary flex items-center justify-center overflow-hidden"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ))}
            {coach.successCompanies.length > 4 && (
              <span className="text-sm text-muted-foreground font-sans font-light">
                +{coach.successCompanies.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CoachHero;
