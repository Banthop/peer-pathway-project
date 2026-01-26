import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoUcl from "@/assets/logo-ucl-new.png";
import logoLse from "@/assets/logo-lse-new.png";
import logoImperial from "@/assets/logo-imperial-new.png";
import logoMckinsey from "@/assets/logo-mckinsey-new.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";
import logoOxford from "@/assets/logo-oxford.png";
import logoJpmorgan from "@/assets/logo-jpmorgan-new.png";
import logoMeta from "@/assets/logo-meta.png";
import logoGoldmanSachs from "@/assets/logo-goldman-sachs.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import coachSarahCard from "@/assets/coach-sarah-card.png";
import coachDavidCard from "@/assets/coach-david-card.png";

const popularCategories = [
  "Investment Banking",
  "Consulting",
  "Spring Weeks",
  "Oxbridge",
  "Law",
  "University Applications",
  "Personal Statements",
  "Software Engineering",
  "UCAT",
  "Quantitative Finance",
];

// Floating Coach Card Image Component
const FloatingCoachCard = ({ 
  imageSrc,
  className,
  style
}: { 
  imageSrc: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div 
    className={`absolute ${className}`}
    style={{
      filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))',
      ...style
    }}
  >
    <img 
      src={imageSrc} 
      alt="Coach card"
      className="w-full h-auto"
    />
  </div>
);


// Floating Logo Component
const FloatingLogo = ({ 
  children, 
  className,
  style
}: { 
  children: React.ReactNode; 
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div 
    className={`absolute ${className}`}
    style={{
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15)) drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
      ...style
    }}
  >
    {children}
  </div>
);

const Hero = () => {
  return (
    <section 
      className="relative flex items-center justify-center pt-20 pb-12 overflow-hidden"
      style={{ minHeight: '78vh', maxHeight: '820px' }}
    >
      {/* Background Layer - Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* LEFT CLUSTER - Universities */}
        
        {/* Oxford Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float"
          style={{ top: '22%', left: '14%', width: '170px', transform: 'rotate(-12deg)', animationDelay: '0s' }}
        >
          <img src={logoOxford} alt="University of Oxford" className="w-full h-auto" />
        </FloatingLogo>

        {/* Cambridge Logo - left of Sarah */}
        <FloatingLogo 
          className="hidden lg:block animate-float"
          style={{ top: '38%', left: '6%', width: '130px', transform: 'rotate(8deg)', animationDelay: '0.2s' }}
        >
          <img src={logoCambridge} alt="University of Cambridge" className="w-full h-auto" />
        </FloatingLogo>

        {/* Sarah Coach Card */}
        <FloatingCoachCard 
          className="hidden lg:block animate-float-reverse"
          imageSrc={coachSarahCard}
          style={{ 
            top: '42%', 
            left: '16%', 
            width: '220px',
            transform: 'rotate(-12deg)',
          }}
        />

        {/* UCL Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '68%', left: '16%', width: '150px', transform: 'rotate(10deg)', animationDelay: '0.5s' }}
        >
          <img src={logoUcl} alt="UCL" className="w-full h-auto" />
        </FloatingLogo>

        {/* Imperial Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '82%', left: '10%', width: '160px', transform: 'rotate(-8deg)', animationDelay: '1s' }}
        >
          <img src={logoImperial} alt="Imperial College London" className="w-full h-auto" />
        </FloatingLogo>

        {/* LSE Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '88%', left: '24%', width: '70px', transform: 'rotate(-18deg)', animationDelay: '1.5s' }}
        >
          <img src={logoLse} alt="LSE" className="w-full h-auto" />
        </FloatingLogo>

        {/* RIGHT CLUSTER - Companies */}
        
        {/* Goldman Sachs Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float"
          style={{ top: '18%', right: '14%', width: '200px', transform: 'rotate(10deg)', animationDelay: '0.3s' }}
        >
          <img src={logoGoldmanSachs} alt="Goldman Sachs" className="w-full h-auto" />
        </FloatingLogo>

        {/* David Coach Card */}
        <FloatingCoachCard 
          className="hidden lg:block animate-float"
          imageSrc={coachDavidCard}
          style={{ 
            top: '48%', 
            right: '16%', 
            width: '280px',
            transform: 'rotate(12deg)',
          }}
        />

        {/* J.P. Morgan Logo - right of David */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '50%', right: '5%', width: '150px', transform: 'rotate(-8deg)', animationDelay: '0.4s' }}
        >
          <img src={logoJpmorgan} alt="J.P. Morgan" className="w-full h-auto" style={{ opacity: 0.7 }} />
        </FloatingLogo>

        {/* Clifford Chance Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '68%', right: '16%', width: '180px', transform: 'rotate(-10deg)', animationDelay: '0.8s' }}
        >
          <img src={logoCliffordChance} alt="Clifford Chance" className="w-full h-auto" />
        </FloatingLogo>

        {/* McKinsey Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '82%', right: '10%', width: '190px', transform: 'rotate(8deg)', animationDelay: '1.2s' }}
        >
          <img src={logoMckinsey} alt="McKinsey & Company" className="w-full h-auto" />
        </FloatingLogo>

        {/* Meta Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '88%', right: '24%', width: '140px', transform: 'rotate(15deg)', animationDelay: '1.6s' }}
        >
          <img src={logoMeta} alt="Meta" className="w-full h-auto" />
        </FloatingLogo>

      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center">
        <h1 
          className="text-foreground mb-6 animate-fade-up mx-auto"
          style={{ 
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontWeight: 600,
            fontSize: 'clamp(40px, 8vw, 84px)', 
            lineHeight: '0.98',
            width: 'fit-content'
          }}
        >
          Your edge, unlocked.
        </h1>
        
        <p 
          className="text-foreground/80 mb-10 max-w-xl mx-auto animate-fade-up" 
          style={{ animationDelay: "0.1s", fontSize: '19px', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          Learn from students who just landed the offers you want.
        </p>

        {/* Search Bar */}
        <div 
          className="relative max-w-xl mx-auto mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            type="text"
            placeholder="Search for coaches..."
            className="w-full pl-12 pr-4 py-6 text-base rounded-full border-2 border-primary bg-card shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-primary/70"
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
              variant="outline"
              className="px-4 py-2 text-sm font-medium cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors"
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
