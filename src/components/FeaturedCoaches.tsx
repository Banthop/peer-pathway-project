import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachJames from "@/assets/coach-james.jpg";
import coachEmily from "@/assets/coach-emily.jpg";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoImperial from "@/assets/logo-imperial-new.png";
import logoLSE from "@/assets/logo-lse-new.png";
import logoGoldman from "@/assets/logo-goldman-sachs.png";
import logoMcKinsey from "@/assets/logo-mckinsey-new.png";
import logoMeta from "@/assets/logo-meta.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";

const coaches = [
  {
    name: "Sarah K.",
    image: coachSarah,
    university: "Oxford PPE '24",
    role: "Incoming Analyst at Goldman Sachs",
    universityLogo: logoOxford,
    companyLogo: logoGoldman,
    rating: 4.9,
    sessions: 127,
  },
  {
    name: "David W.",
    image: coachDavid,
    university: "Cambridge Economics",
    role: "Summer Associate at McKinsey",
    universityLogo: logoCambridge,
    companyLogo: logoMcKinsey,
    rating: 5.0,
    sessions: 89,
  },
  {
    name: "James L.",
    image: coachJames,
    university: "Imperial Computing",
    role: "Software Engineer at Meta",
    universityLogo: logoImperial,
    companyLogo: logoMeta,
    rating: 4.8,
    sessions: 156,
  },
  {
    name: "Emily R.",
    image: coachEmily,
    university: "LSE Law",
    role: "Trainee Solicitor at Clifford Chance",
    universityLogo: logoLSE,
    companyLogo: logoCliffordChance,
    rating: 4.9,
    sessions: 74,
  },
  {
    name: "Sarah K.",
    image: coachSarah,
    university: "Oxford PPE '24",
    role: "Incoming Analyst at Goldman Sachs",
    universityLogo: logoOxford,
    companyLogo: logoGoldman,
    rating: 4.9,
    sessions: 127,
  },
  {
    name: "David W.",
    image: coachDavid,
    university: "Cambridge Economics",
    role: "Summer Associate at McKinsey",
    universityLogo: logoCambridge,
    companyLogo: logoMcKinsey,
    rating: 5.0,
    sessions: 89,
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
          <h2 className="text-3xl md:text-4xl font-sans font-semibold text-foreground">
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
              className="flex-shrink-0 w-[300px] md:w-[320px] bg-card rounded-xl p-5 border border-border/40 group cursor-pointer transition-all duration-300 hover:border-border"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Top row: Photo + Name/University */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground truncate">
                    {coach.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {coach.university}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-foreground">{coach.rating}</span>
                    <span className="text-xs text-muted-foreground">· {coach.sessions} sessions</span>
                  </div>
                </div>
              </div>

              {/* Role */}
              <p className="text-sm text-foreground mb-4 line-clamp-2">
                {coach.role}
              </p>

              {/* Logo badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 px-3 rounded-lg bg-secondary flex items-center justify-center">
                  <img 
                    src={coach.universityLogo} 
                    alt="University" 
                    className="h-5 w-auto object-contain"
                  />
                </div>
                <div className="h-8 px-3 rounded-lg bg-secondary flex items-center justify-center">
                  <img 
                    src={coach.companyLogo} 
                    alt="Company" 
                    className="h-5 w-auto object-contain"
                  />
                </div>
              </div>

              {/* CTA */}
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group/link"
              >
                View profile
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoaches;
