import { Button } from "@/components/ui/button";
import { Search, User, MessageCircle, Calendar, Video, Star, LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  headline: string;
  body: string;
}

const steps: Step[] = [
  {
    icon: Search,
    headline: "Browse coaches",
    body: "Filter by goal, uni, firm, or background. Find someone who's done exactly what you're aiming for.",
  },
  {
    icon: User,
    headline: "Check their profile",
    body: "See their experience, LinkedIn, and reviews from other students.",
  },
  {
    icon: MessageCircle,
    headline: "Book a free intro",
    body: "A 15-minute call to see if they're the right fit. No payment, no commitment.",
  },
  {
    icon: Calendar,
    headline: "Book a session",
    body: "Pick a time that works. Pay securely — you're only charged after the session is confirmed.",
  },
  {
    icon: Video,
    headline: "Meet 1-on-1",
    body: "A private call to go through your questions. CVs, prep, what to expect — whatever you need.",
  },
  {
    icon: Star,
    headline: "Leave a review",
    body: "Help other students find great coaches. Book again anytime — same coach or someone new.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
          How it works
        </h2>

        {/* Vertical Timeline */}
        <div className="max-w-xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.headline}
                  className={`relative flex gap-5 ${isLast ? "" : "pb-8"}`}
                >
                  {/* Icon node on timeline */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>

                  {/* Horizontal branch connector */}
                  <div className="absolute left-10 top-5 w-4 h-px bg-border" />

                  {/* Content */}
                  <div className="flex-1 pt-1.5 pl-2">
                    <h3 className="font-sans font-medium text-foreground mb-1 text-base">
                      {step.headline}
                    </h3>
                    <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 md:mt-16">
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
