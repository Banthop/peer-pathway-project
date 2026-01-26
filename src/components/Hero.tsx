import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const popularCategories = [
  "Investment Banking",
  "Consulting",
  "Spring Weeks",
  "Oxbridge",
  "Law",
];

// Floating elements data
const leftLogos = [
  { name: "Oxford", style: "top-[15%] left-[5%] rotate-[-8deg]" },
  { name: "UCL", style: "top-[35%] left-[8%] rotate-[5deg]" },
  { name: "Imperial", style: "top-[55%] left-[3%] rotate-[-3deg]" },
  { name: "LSE", style: "top-[70%] left-[12%] rotate-[8deg]" },
];

const rightLogos = [
  { name: "J.P. Morgan", style: "top-[12%] right-[8%] rotate-[6deg]" },
  { name: "Clifford Chance", style: "top-[40%] right-[5%] rotate-[-5deg]" },
  { name: "McKinsey", style: "top-[55%] right-[12%] rotate-[3deg]" },
  { name: "Meta", style: "top-[72%] right-[6%] rotate-[-8deg]" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Floating Logos - Left Side */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-1/4">
        {leftLogos.map((logo, index) => (
          <div
            key={logo.name}
            className={`absolute ${logo.style} animate-float`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <div className="bg-card px-4 py-2 rounded-lg card-shadow text-muted-foreground/60 font-medium text-sm">
              {logo.name}
            </div>
          </div>
        ))}
        
        {/* Coach Card - Left */}
        <div 
          className="absolute top-[42%] left-[18%] rotate-[3deg] animate-float-reverse"
          style={{ animationDelay: "1s" }}
        >
          <div className="bg-card rounded-xl card-shadow p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              SK
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Sarah K.</p>
              <p className="text-xs text-primary">Oxford PPE '24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Logos - Right Side */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/4">
        {rightLogos.map((logo, index) => (
          <div
            key={logo.name}
            className={`absolute ${logo.style} animate-float-reverse`}
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            <div className="bg-card px-4 py-2 rounded-lg card-shadow text-muted-foreground/60 font-medium text-sm">
              {logo.name}
            </div>
          </div>
        ))}
        
        {/* Coach Card - Right */}
        <div 
          className="absolute top-[28%] right-[18%] rotate-[-4deg] animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="bg-card rounded-xl card-shadow p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              DW
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">David W.</p>
              <p className="text-xs text-muted-foreground">Goldman Sachs Analyst</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground mb-6 animate-fade-up">
          Your edge, unlocked.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Learn from students who just landed the offers you want.
        </p>

        {/* Search Bar */}
        <div 
          className="relative max-w-xl mx-auto mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for coaches..."
            className="w-full pl-12 pr-4 py-6 text-base rounded-full border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Popular Categories */}
        <div 
          className="flex flex-wrap justify-center gap-2 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          {popularCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="px-4 py-2 text-sm font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
