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
              className="flex-shrink-0 w-[280px] md:w-[300px] bg-card rounded-xl overflow-hidden border border-border/50 group cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
                {/* Photo with gradient overlay and glassmorphism badges */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)"
                    }}
                  />
                  
                  {/* Glassmorphism logo badges */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110">
                      <img 
                        src={coach.universityLogo} 
                        alt="University" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5">
                      <img 
                        src={coach.companyLogo} 
                        alt="Company" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Rating badge - top left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/50 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-foreground">{coach.rating}</span>
                  </div>
                </div>
                
                {/* Info section with gradient background */}
                <div 
                  className="p-5 relative"
                  style={{
                    background: "linear-gradient(to bottom, hsl(var(--card)) 0%, hsl(var(--secondary)) 100%)"
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {coach.name}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {coach.university}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Sessions</span>
                      <p className="text-sm font-semibold text-foreground">{coach.sessions}+</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {coach.role}
                  </p>
                  
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors group/link"
                  >
                    View profile
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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
