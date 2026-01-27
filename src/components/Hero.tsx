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
      className="relative flex items-center justify-center pt-20 pb-12 overflow-hidden bg-white"
      style={{ minHeight: '78vh', maxHeight: '820px' }}
    >

      {/* Background Layer - Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        
        {/* LEFT CLUSTER - Universities */}
        
        {/* Oxford Logo - under Sarah, slightly right */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '72%', left: '18%', width: '140px', transform: 'rotate(-8deg)', animationDelay: '0s' }}
        >
          <img src={logoOxford} alt="University of Oxford" className="w-full h-auto" />
        </FloatingLogo>

        {/* Cambridge Logo - upper left */}
        <FloatingLogo 
          className="hidden lg:block animate-float"
          style={{ top: '28%', left: '2%', width: '120px', transform: 'rotate(8deg)', animationDelay: '0.2s' }}
        >
          <img src={logoCambridge} alt="University of Cambridge" className="w-full h-auto" />
        </FloatingLogo>

        {/* Sarah Coach Card - moved more left */}
        <FloatingCoachCard 
          className="hidden xl:block animate-float-reverse"
          imageSrc={coachSarahCard}
          style={{ 
            top: '38%', 
            left: '14%', 
            width: '190px',
            transform: 'rotate(-12deg)',
          }}
        />

        {/* UCL Logo - bottom left corner */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '72%', left: '2%', width: '140px', transform: 'rotate(10deg)', animationDelay: '0.5s' }}
        >
          <img src={logoUcl} alt="UCL" className="w-full h-auto" />
        </FloatingLogo>

        {/* Imperial Logo - far bottom left */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '88%', left: '4%', width: '150px', transform: 'rotate(-8deg)', animationDelay: '1s' }}
        >
          <img src={logoImperial} alt="Imperial College London" className="w-full h-auto" />
        </FloatingLogo>

        {/* LSE Logo - moved more inward bottom */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '85%', left: '22%', width: '65px', transform: 'rotate(-18deg)', animationDelay: '1.5s' }}
        >
          <img src={logoLse} alt="LSE" className="w-full h-auto" />
        </FloatingLogo>

        {/* RIGHT CLUSTER - Companies */}
        
        {/* Goldman Sachs Logo - under David, slightly left */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '65%', right: '16%', width: '160px', transform: 'rotate(8deg)', animationDelay: '0.3s' }}
        >
          <img src={logoGoldmanSachs} alt="Goldman Sachs" className="w-full h-auto" />
        </FloatingLogo>

        {/* J.P. Morgan Logo - upper right */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '28%', right: '2%', width: '130px', transform: 'rotate(-8deg)', animationDelay: '0.4s' }}
        >
          <img src={logoJpmorgan} alt="J.P. Morgan" className="w-full h-auto" style={{ opacity: 0.7 }} />
        </FloatingLogo>

        {/* David Coach Card - moved more right */}
        <FloatingCoachCard 
          className="hidden xl:block animate-float"
          imageSrc={coachDavidCard}
          style={{ 
            top: '42%', 
            right: '12%', 
            width: '220px',
            transform: 'rotate(12deg)',
          }}
        />

        {/* Clifford Chance Logo - bottom right corner */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '72%', right: '2%', width: '160px', transform: 'rotate(-10deg)', animationDelay: '0.8s' }}
        >
          <img src={logoCliffordChance} alt="Clifford Chance" className="w-full h-auto" />
        </FloatingLogo>

        {/* McKinsey Logo - far bottom right */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '88%', right: '4%', width: '170px', transform: 'rotate(8deg)', animationDelay: '1.2s' }}
        >
          <img src={logoMckinsey} alt="McKinsey & Company" className="w-full h-auto" />
        </FloatingLogo>

        {/* Meta Logo - moved more inward bottom */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '85%', right: '22%', width: '120px', transform: 'rotate(15deg)', animationDelay: '1.6s' }}
        >
          <img src={logoMeta} alt="Meta" className="w-full h-auto" />
        </FloatingLogo>

      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center">
        <h1 
          className="text-foreground mb-6 animate-fade-up whitespace-nowrap"
          style={{ 
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontWeight: 600,
            fontSize: 'clamp(40px, 8vw, 84px)', 
            lineHeight: '0.98',
            textAlign: 'center'
          }}
        >
          Your edge, unlocked.
        </h1>
        
        <p 
          className="text-foreground mb-10 max-w-xl mx-auto animate-fade-up" 
          style={{ animationDelay: "0.1s", fontSize: '19px', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          Get prepped for uni applications, tests, and internships.
        </p>

        {/* Search Bar */}
        <div 
          className="relative max-w-2xl w-full mx-auto mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            type="text"
            placeholder="Search for coaches..."
            className="w-full pl-12 pr-4 py-6 text-base rounded-full border-2 border-primary bg-card shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-primary/70"
          />
        </div>

        {/* Popular Categories - 3 rows: 5, 4, 1 */}
        <div 
          className="flex flex-col items-center gap-2 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Row 1: 5 pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {popularCategories.slice(0, 5).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {category}
              </Badge>
            ))}
          </div>
          {/* Row 2: 4 pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {popularCategories.slice(5, 9).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {category}
              </Badge>
            ))}
          </div>
          {/* Row 3: 1 pill */}
          <div className="flex justify-center gap-2">
            {popularCategories.slice(9).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
