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
    title: "Fresh from the frontlines",
    body: [
      { text: "Your coach succeeded " },
      { text: "months ago", bold: true },
      { text: ", not years. Whether it's Oxbridge interviews, UCAT prep, or landing a spring week, they remember exactly what worked because they just did it." },
    ],
    delay: 0,
  },
  {
    icon: PoundSterling,
    title: "Quality without the price tag",
    body: [
      { text: "Tutors and consultants charge " },
      { text: "£150+ per hour", bold: true },
      { text: ". Our coaches are high-achievers earning on the side, which means you get the same caliber of guidance starting from just " },
      { text: "£25", bold: true },
      { text: "." },
    ],
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Someone who truly gets it",
    body: [
      { text: "Forget generic advice from people who applied a decade ago. Your coach was in your " },
      { text: "exact position", bold: true },
      { text: " recently. They understand the pressure, the tight deadlines, and what it actually takes to stand out." },
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
        <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-4 text-center">
          Why students choose EarlyEdge
        </h2>

        {/* Subheadline */}
        <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-md mx-auto font-sans font-light">
          The advantages of learning from someone who was just in your shoes.
        </p>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {reasons.map((reason) => (
            <ScrollReveal key={reason.title} delay={reason.delay}>
              <div className="group relative flex flex-col items-center text-center p-8 md:p-10 rounded-3xl bg-background border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon Container - Gradient background */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <reason.icon
                    className="text-background"
                    size={24}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Title */}
                <h3 className="relative text-foreground mb-4 font-sans font-semibold text-lg tracking-tight">
                  {reason.title}
                </h3>

                {/* Body Text */}
                <p className="relative max-w-[300px] font-sans font-light text-[15px] leading-relaxed text-muted-foreground">
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
