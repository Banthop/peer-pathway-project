import { Search, MessageSquare, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find your coach",
    description: "Browse by category. Book a free intro call.",
  },
  {
    icon: MessageSquare,
    title: "Get coaching",
    description: "Sessions on CVs, applications, interviews—whatever you need.",
  },
  {
    icon: Trophy,
    title: "Get results",
    description: "Land the offer. Join the university. Achieve your goals.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-16 text-center">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Step number */}
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Step {index + 1}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
