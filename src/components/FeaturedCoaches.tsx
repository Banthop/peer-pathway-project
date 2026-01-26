import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachJames from "@/assets/coach-james.jpg";
import coachEmily from "@/assets/coach-emily.jpg";

const coaches = [
  {
    name: "Sarah K.",
    image: coachSarah,
    university: "Oxford PPE '24",
    role: "Incoming Analyst at Goldman Sachs",
    badges: ["Oxford", "J.P.Morgan"],
  },
  {
    name: "David W.",
    image: coachDavid,
    university: "Cambridge Economics",
    role: "Summer Associate at McKinsey",
    badges: ["Cambridge", "McKinsey"],
  },
  {
    name: "James L.",
    image: coachJames,
    university: "Imperial Computing",
    role: "Software Engineer at Meta",
    badges: ["Imperial", "Meta"],
  },
  {
    name: "Emily R.",
    image: coachEmily,
    university: "LSE Law",
    role: "Trainee Solicitor at Clifford Chance",
    badges: ["LSE", "Clifford Chance"],
  },
  {
    name: "Sarah K.",
    image: coachSarah,
    university: "Oxford PPE '24",
    role: "Incoming Analyst at Goldman Sachs",
    badges: ["Oxford", "J.P.Morgan"],
  },
  {
    name: "David W.",
    image: coachDavid,
    university: "Cambridge Economics",
    role: "Summer Associate at McKinsey",
    badges: ["Cambridge", "McKinsey"],
  },
];

const FeaturedCoaches = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            Featured coaches
          </h2>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full border-border hover:bg-card"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full border-border hover:bg-card"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Coach Cards Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {coaches.map((coach, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] md:w-[300px] bg-card rounded-xl overflow-hidden card-shadow hover:shadow-lg transition-shadow"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Photo with badges */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover"
                />
                {/* Logo badges */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {coach.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-foreground"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {coach.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {coach.university}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {coach.role}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  View profile
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoaches;
