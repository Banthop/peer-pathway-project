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
              className="flex-shrink-0 w-[280px] md:w-[300px] bg-card rounded-2xl overflow-hidden border border-border/30 group cursor-pointer transition-all duration-500 hover:border-primary/20 hover:scale-[1.02] relative"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Shimmer overlay on hover */}
              <div 
                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
              
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
              
                {/* Photo with gradient overlay and glassmorphism badges */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Gradient overlay - more refined */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 35%, transparent 65%)"
                    }}
                  />
                  
                  {/* Glassmorphism logo badges - refined styling */}
                  <div className="absolute bottom-4 right-4 flex gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                      <img 
                        src={coach.universityLogo} 
                        alt="University" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:translate-x-0.5">
                      <img 
                        src={coach.companyLogo} 
                        alt="Company" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Rating badge - refined with subtle glow */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground tracking-wide">{coach.rating}</span>
                  </div>
                </div>
                
                {/* Info section - more refined spacing */}
                <div className="p-6 relative bg-gradient-to-b from-card to-secondary/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground tracking-tight">
                        {coach.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mt-0.5">
                        {coach.university}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Sessions</span>
                      <p className="text-sm font-semibold text-foreground">{coach.sessions}+</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                    {coach.role}
                  </p>
                  
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 group/link"
                  >
                    View profile
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
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
