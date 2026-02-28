import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachJames from "@/assets/coach-james.jpg";
import coachEmily from "@/assets/coach-emily.jpg";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoImperial from "@/assets/logo-imperial-new.png";
import logoLSE from "@/assets/logo-lse-new.png";
import logoGoldmanSachs from "@/assets/logo-goldman-sachs.png";
import logoMcKinsey from "@/assets/logo-mckinsey-new.png";
import logoGoogle from "@/assets/logo-google.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";

const coaches = [
  {
    id: "sarah-k",
    name: "Sarah K.",
    image: coachSarah,
    university: "Oxford PPE '24",
    role: "Incoming Analyst, Goldman Sachs",
    tagline: "I'll help you land a Spring Week — from CV to final interview",
    universityLogo: logoOxford,
    companyLogo: logoGoldmanSachs,
    specialties: ["Spring Week Prep", "CV Review", "Mock Interviews"],
    packageName: "Spring Week Conversion",
    packageSessions: 5,
    perSessionPrice: 30,
  },
  {
    id: "david-w",
    name: "David W.",
    image: coachDavid,
    university: "Cambridge Economics",
    role: "Summer Associate, McKinsey",
    tagline: "From case study basics to offer — I'll coach you through the entire pipeline",
    universityLogo: logoCambridge,
    companyLogo: logoMcKinsey,
    specialties: ["Case Studies", "Behavioural Prep", "Consulting Strategy"],
    packageName: "Consulting Offer Sprint",
    packageSessions: 4,
    perSessionPrice: 35,
  },
  {
    id: "james-l",
    name: "James L.",
    image: coachJames,
    university: "Imperial Computing",
    role: "Software Engineer, Google",
    tagline: "I'll get you interview-ready for top tech — DSA, system design, and behavioural",
    universityLogo: logoImperial,
    companyLogo: logoGoogle,
    specialties: ["Coding Interview", "System Design", "Tech Applications"],
    packageName: "Tech Interview Ready",
    packageSessions: 5,
    perSessionPrice: 35,
  },
  {
    id: "emily-r",
    name: "Emily R.",
    image: coachEmily,
    university: "LSE Law",
    role: "Trainee Solicitor, Clifford Chance",
    tagline: "Vac scheme applications demystified — I got offers from 4 magic circle firms",
    universityLogo: logoLSE,
    companyLogo: logoCliffordChance,
    specialties: ["Vac Scheme Apps", "Interview Prep", "Cover Letters"],
    packageName: "Vac Scheme Secured",
    packageSessions: 3,
    perSessionPrice: 30,
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
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground tracking-tight">
              Featured coaches
            </h2>
            <p className="text-muted-foreground text-sm font-light mt-1.5">
              Handpicked for Spring Week & application season
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full border-border hover:bg-card w-10 h-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full border-border hover:bg-card w-10 h-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Coach Cards Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto overflow-y-visible scrollbar-hide py-4 -mx-4 px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="flex-shrink-0 w-[310px] md:w-[340px] bg-card rounded-2xl border border-border/50 group cursor-pointer transition-all duration-300 hover:border-foreground/15 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 flex flex-col font-sans overflow-hidden"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Top section — photo, name, logos */}
              <div className="p-5 pb-0">
                <div className="flex items-start gap-3.5 mb-4">
                  {/* Coach photo with ring */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[56px] h-[56px] rounded-full ring-2 ring-border overflow-hidden">
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Availability dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] text-foreground leading-tight truncate">
                      {coach.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                      {coach.university}
                    </p>
                    {/* Credential with company logo inline */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <img
                        src={coach.companyLogo}
                        alt=""
                        className="w-[14px] h-[14px] rounded-sm object-contain flex-shrink-0"
                      />
                      <span className="text-[12px] font-medium text-foreground truncate">
                        {coach.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tagline — italic, personal voice */}
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-3.5 line-clamp-2 font-light">
                  <span className="text-foreground/30">"</span>
                  {coach.tagline}
                  <span className="text-foreground/30">"</span>
                </p>

                {/* Service tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {coach.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-[5px] text-[11px] font-medium text-foreground/70 bg-secondary/80 rounded-full transition-colors group-hover:bg-secondary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Package strip — highlighted */}
              <div className="mx-5 mb-4 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/40 px-4 py-3 border border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground leading-tight">
                      {coach.packageName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {coach.packageSessions} sessions included
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-lg font-bold text-foreground tracking-tight">
                      £{coach.perSessionPrice}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      /session
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs — full width bottom bar */}
              <div className="mt-auto px-5 pb-5 flex items-center justify-between gap-3">
                <Link
                  to={`/coach/${coach.id}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-light text-foreground hover:text-foreground/70 transition-colors duration-200 group/link"
                >
                  View profile
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                </Link>
                <Button
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90 text-[12px] px-4 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  Book free intro
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoaches;
