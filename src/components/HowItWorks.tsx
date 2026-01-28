import { Video, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import coachSarahCard from "@/assets/coach-sarah-card.png";

const steps = [
  {
    number: 1,
    title: "Find your coach",
    description: "Browse by category. Book a free intro call.",
    visual: "coach-card",
  },
  {
    number: 2,
    title: "Get coaching",
    description: "Sessions on CVs, applications, interviews—whatever you need.",
    visual: "video",
  },
  {
    number: 3,
    title: "Get results",
    description: "Land the offer. Join the university. Achieve your goals.",
    visual: "trophy",
  },
];

const StepVisual = ({ type }: { type: string }) => {
  if (type === "coach-card") {
    return (
      <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
        <img
          src={coachSarahCard}
          alt="Coach card preview"
          className="h-full w-auto object-contain rounded-lg shadow-sm border border-border"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-secondary border-2 border-border flex items-center justify-center shadow-xs">
          <Video className="w-10 h-10 md:w-12 md:h-12 text-foreground" strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  if (type === "trophy") {
    return (
      <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-secondary border-2 border-border flex items-center justify-center shadow-xs">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 text-foreground" strokeWidth={1.5} />
        </div>
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
