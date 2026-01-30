import { Clock, PoundSterling, Users } from "lucide-react";
import { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

interface ReasonBody {
  text: string;
  bold?: boolean;
}

interface Reason {
  icon: typeof Clock;
  title: string;
  body: ReasonBody[];
  delay: number;
}

const reasons: Reason[] = [
  {
    icon: Clock,
    title: "Months ago, not years",
    body: [
      { text: "Your coach succeeded recently. They remember exactly what worked because they just did it." },
    ],
    delay: 0,
  },
  {
    icon: PoundSterling,
    title: "Quality without the price tag",
    body: [
      { text: "What consultants charge £150+/hour for, starting at £25/hour." },
    ],
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Insider knowledge",
    body: [
      { text: "What the process is really like. The stuff you won't find online." },
    ],
    delay: 0.2,
  },
];

const RenderBody = ({ segments }: { segments: ReasonBody[] }): ReactNode => {
  return (
    <>
      {segments.map((segment, index) => 
        segment.bold ? (
          <span key={index} className="font-semibold text-foreground">
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
};

const WhyEarlyEdge = () => {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Headline */}
        <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
          Why students choose EarlyEdge
        </h2>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason) => (
            <ScrollReveal key={reason.title} delay={reason.delay}>
              <div className="group flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 hover:scale-[1.02]">
                {/* Icon Container - Dark circle with white icon */}
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <reason.icon
                    className="text-background"
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}
                <h3 className="text-foreground mb-3 font-sans font-semibold text-xl">
                  {reason.title}
                </h3>

                {/* Body Text */}
                <p className="max-w-[280px] font-sans font-light text-base leading-relaxed text-muted-foreground">
                  <RenderBody segments={reason.body} />
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEarlyEdge;
