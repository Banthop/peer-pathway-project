import type { Coach } from "@/types/coach";

interface CoachEducationProps {
  coach: Coach;
}

const CoachEducation = ({ coach }: CoachEducationProps) => {
  if (coach.education.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-xl font-sans font-medium text-foreground mb-6">
        Education
      </h2>

      <div className="space-y-6">
        {coach.education.map((edu, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={edu.logo}
                alt={edu.institution}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-sans font-medium text-foreground">
                {edu.institution}
              </h3>
              <p className="text-sm text-muted-foreground font-sans font-light">
                {edu.degree}
              </p>
              <p className="text-xs text-muted-foreground font-sans font-light mt-0.5">
                {edu.years}
              </p>
              {edu.achievement && (
                <p className="text-sm text-foreground font-sans font-light mt-1">
                  {edu.achievement}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoachEducation;
