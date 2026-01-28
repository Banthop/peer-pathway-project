import { Button } from "@/components/ui/button";
import stepFindCoach from "@/assets/step-find-coach.png";
import stepCoaching from "@/assets/step-coaching.png";
import stepResults from "@/assets/step-results.png";

const steps = [
  {
    number: 1,
    title: "Find your coach",
    description: "Browse coaches who've been where you want to go. Book a free intro call to find your fit.",
    visual: "coach-card",
  },
  {
    number: 2,
    title: "Get coached",
    description: "Work 1-on-1 on applications, interviews, and strategy—tailored to your goals.",
    visual: "video",
  },
  {
    number: 3,
    title: "Land your offer",
    description: "Join thousands who've secured spots at top universities and firms.",
    visual: "trophy",
  },
];

const StepVisual = ({ type }: { type: string }) => {
  if (type === "coach-card") {
    return (
      <div className="relative w-full h-40 md:h-48 flex items-center justify-center">
        <img 
          src={stepFindCoach} 
          alt="Find your coach" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="relative w-full h-40 md:h-48 flex items-center justify-center">
        <img 
          src={stepCoaching} 
          alt="Coaching session" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
        />
      </div>
    );
  }

  if (type === "trophy") {
    return (
      <div className="relative w-full h-40 md:h-48 flex items-center justify-center">
        <img 
          src={stepResults} 
          alt="Success trophy" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
        />
      </div>
    );
  }

  return null;
};

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-16 md:mb-20 text-center">
          How it works
        </h2>

        {/* Timeline Container */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block relative">
            {/* Timeline Line */}
            <div className="absolute top-6 left-[16.67%] right-[16.67%] h-0.5 bg-border" />

            {/* Steps Grid */}
            <div className="grid grid-cols-3 gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Number Circle */}
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-sans font-semibold text-lg mb-8 z-10 transition-transform duration-300 group-hover:scale-110">
                    {step.number}
                  </div>

                  {/* Visual */}
                  <div className="mb-6 transition-transform duration-300 group-hover:scale-[1.02]">
                    <StepVisual type={step.visual} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-sans font-medium text-foreground mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans font-light text-muted-foreground max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden relative">
            {/* Timeline Line - Vertical on left */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex gap-6"
                >
                  {/* Step Number Circle */}
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-sans font-semibold text-lg z-10 flex-shrink-0">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    {/* Visual */}
                    <div className="mb-4">
                      <StepVisual type={step.visual} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-sans font-medium text-foreground mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans font-light text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
