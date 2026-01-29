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
    title: "Fresher knowledge",
    body: [
      { text: "Your coach got their offer " },
      { text: "months ago", bold: true },
      { text: ", not years. They remember the exact questions, the current process, and what actually worked — because they just went through it." },
    ],
    delay: 0,
  },
  {
    icon: PoundSterling,
    title: "Affordable by design",
    body: [
      { text: "Career coaches charge " },
      { text: "£150+/hour", bold: true },
      { text: ". Our coaches are students and recent grads earning on the side — so you get insider knowledge from " },
      { text: "£25", bold: true },
      { text: "." },
    ],
    delay: 0.1,
  },
  {
    icon: Users,
    title: "They were just you",
    body: [
      { text: "No corporate advice from people who forgot what it's like. Your coach was in your " },
      { text: "exact position", bold: true },
      { text: " recently. They get the stress, the deadlines, and what you're going through." },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason) => (
            <ScrollReveal key={reason.title} delay={reason.delay}>
              <div className="group flex flex-col items-center text-center p-8 md:p-10 rounded-3xl bg-gradient-to-b from-secondary/40 to-secondary/20 border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
