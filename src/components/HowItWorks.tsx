import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import stepFindCoach from "@/assets/step-find-coach.png";
import stepCoaching from "@/assets/step-coaching.png";
import stepResults from "@/assets/step-results.png";

const steps = [
  {
    number: 1,
    title: "Find your coach",
    description: "Browse coaches who've been where you want to go. Book a free intro call to find your fit.",
    image: stepFindCoach,
    imageAlt: "Find your coach",
    features: [
      { label: "Search by goal", description: "Find coaches for your specific target" },
      { label: "Filter by background", description: "University, company, field" },
      { label: "Free intro call", description: "No commitment to start" },
    ],
  },
  {
    number: 2,
    title: "Get coached",
    description: "Work 1-on-1 on applications, interviews, and strategy—tailored to your goals.",
    image: stepCoaching,
    imageAlt: "Coaching session",
    features: [
      { label: "Application review", description: "CVs, personal statements, cover letters" },
      { label: "Interview practice", description: "Mock interviews with feedback" },
      { label: "Strategy sessions", description: "Planning and timeline guidance" },
    ],
  },
  {
    number: 3,
    title: "Land your offer",
    description: "Join thousands who've secured spots at top universities and firms.",
    image: stepResults,
    imageAlt: "Success trophy",
    features: [
      { label: "University offers", description: "Oxbridge, Russell Group, US schools" },
      { label: "Internships", description: "Spring weeks, summer programs" },
      { label: "Graduate roles", description: "Full-time positions at top firms" },
    ],
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-16 md:mb-20 text-center">
          How it works
        </h2>

        {/* Vertical Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.number} className="relative">
                  {/* Step Number Circle - Desktop (centered on timeline) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 w-12 h-12 rounded-full bg-foreground text-background items-center justify-center font-sans font-semibold text-lg z-10">
                    {step.number}
                  </div>

                  {/* Card Container - Alternating sides on desktop */}
                  <div className={`md:w-[calc(50%-2rem)] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    {/* Card */}
                    <div className="bg-card rounded-xl border border-border p-6 md:p-8 relative">
                      {/* Step Number Circle - Mobile */}
                      <div className="md:hidden absolute -left-3 top-6 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-sans font-semibold text-base z-10">
                        {step.number}
                      </div>

                      {/* Mobile: Add left padding to account for circle */}
                      <div className="md:pl-0 pl-6">
                        {/* Illustration */}
                        <div className="flex justify-center mb-6">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            className="w-28 h-28 md:w-36 md:h-36 object-contain"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-sans font-medium text-foreground mb-3 text-center">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="font-sans font-light text-muted-foreground text-center mb-6">
                          {step.description}
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-2">
                          {step.features.map((feature) => (
                            <Badge
                              key={feature.label}
                              variant="secondary"
                              className="px-3 py-1.5 text-xs font-sans font-normal bg-secondary/80 text-secondary-foreground hover:bg-secondary cursor-default"
                            >
                              {feature.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector to next step - Desktop */}
                  {!isLast && (
                    <div className="hidden md:block h-16" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16 md:mt-20">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-sans font-extralight"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
