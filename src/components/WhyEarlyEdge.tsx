import { Clock, PoundSterling, Users } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Fresher knowledge",
    body: "Your coach got their offer months ago, not years. They remember the exact questions, the current process, and what actually worked — because they just went through it.",
    delay: 0,
  },
  {
    icon: PoundSterling,
    title: "Affordable by design",
    body: "Career coaches charge £150+/hour. Our coaches are students and recent grads earning on the side — so you get insider knowledge at prices that won't break the bank.",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "They were just you",
    body: "No corporate advice from people who forgot what it's like. Your coach was in your exact position recently. They get the stress, the deadlines, and what you're going through.",
    delay: 0.2,
  },
];

const WhyEarlyEdge = () => {
  return (
    <section className="w-full bg-white py-12 md:py-20 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Headline */}
        <h2
          className="text-center mb-12"
          style={{
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontWeight: 600,
            fontSize: "clamp(28px, 4vw, 36px)",
          }}
        >
          Why students choose EarlyEdge
        </h2>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <reason.icon
                className="text-foreground mb-4"
                size={48}
                strokeWidth={1.5}
              />

              {/* Title */}
              <h3
                className="text-foreground mb-3"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                {reason.title}
              </h3>

              {/* Body Text */}
              <p
                className="max-w-[300px]"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#4B5563",
                }}
              >
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEarlyEdge;
