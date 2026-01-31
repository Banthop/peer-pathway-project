import type { Coach } from "@/types/coach";

interface CoachExperienceProps {
  coach: Coach;
}

const CoachExperience = ({ coach }: CoachExperienceProps) => {
  if (coach.experience.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <h2 className="text-xl font-sans font-medium text-foreground mb-6">
        Experience
      </h2>

      <div className="space-y-6">
        {coach.experience.map((exp, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={exp.logo}
                alt={exp.company}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-sans font-medium text-foreground">
                {exp.role}
              </h3>
              <p className="text-sm text-muted-foreground font-sans font-light">
                {exp.company}
              </p>
              <p className="text-xs text-muted-foreground font-sans font-light mt-0.5">
                {exp.dates}
              </p>
              {exp.description && (
                <p className="text-sm text-muted-foreground font-sans font-light mt-2">
                  {exp.description}
                </p>
              )}
              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exp.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs font-sans font-light text-muted-foreground bg-secondary rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoachExperience;
