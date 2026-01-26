import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoUcl from "@/assets/logo-ucl-new.png";
import logoLse from "@/assets/logo-lse-new.png";
import logoImperial from "@/assets/logo-imperial.png";
import logoMckinsey from "@/assets/logo-mckinsey-new.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";
import coachSarahCard from "@/assets/coach-sarah-card.png";
import coachDavidCard from "@/assets/coach-david-card.png";

const popularCategories = [
  "Investment Banking",
  "Consulting",
  "Spring Weeks",
  "Oxbridge",
  "Law",
];

// Oxford Logo SVG Component
const OxfordLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 240 80" fill="currentColor">
    <g>
      <circle cx="30" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
      <text x="28" y="35" fontSize="8" textAnchor="middle" fontFamily="serif">⚜</text>
      <text x="28" y="50" fontSize="6" textAnchor="middle" fontFamily="serif">OXON</text>
      <text x="80" y="28" fontSize="10" fontFamily="sans-serif" letterSpacing="2">UNIVERSITY OF</text>
      <text x="80" y="55" fontSize="24" fontFamily="serif" fontWeight="400" letterSpacing="1">OXFORD</text>
    </g>
  </svg>
);

// JP Morgan Logo SVG Component
const JPMorganLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 50" fill="currentColor">
    <text x="0" y="38" fontSize="36" fontFamily="Georgia, serif" fontWeight="400" letterSpacing="-1">
      J.P.Morgan
    </text>
  </svg>
);

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
      opacity: 0.6,
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

// Meta Logo SVG Component
const MetaLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 40" fill="currentColor">
    <path d="M10 30C10 18 16 10 24 10C30 10 34 14 38 20L42 26C46 32 50 36 58 36C70 36 78 26 78 16C78 8 74 4 68 4" 
          fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <text x="85" y="30" fontSize="26" fontFamily="Arial, sans-serif" fontWeight="400">Meta</text>
  </svg>
);

// Coach Card Component
const CoachCard = ({ 
  name, 
  subtitle, 
  imageUrl,
  className 
}: { 
  name: string; 
  subtitle: string; 
  imageUrl: string;
  className?: string;
}) => (
  <div 
    className={`bg-white rounded-[14px] p-3 flex items-center gap-3 ${className}`}
    style={{ 
      boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
      minWidth: '220px'
    }}
  >
    <img 
      src={imageUrl} 
      alt={name}
      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
    />
    <div className="min-w-0">
      <p className="font-semibold text-sm text-[#111111] leading-tight">{name}</p>
      <p className="text-xs text-[#111111] leading-tight mt-0.5">{subtitle}</p>
    </div>
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
      opacity: 0.6,
      filter: 'grayscale(100%) contrast(1.05) drop-shadow(0 1px 1px rgba(0,0,0,0.18)) drop-shadow(0 -1px 1px rgba(0,0,0,0.08))',
      ...style
    }}
  >
    {children}
  </div>
);
    className={`absolute ${className}`}
    style={{
      opacity: 0.65,
      filter: 'grayscale(100%) contrast(1.05) drop-shadow(0 1px 1px rgba(0,0,0,0.18)) drop-shadow(0 -1px 1px rgba(0,0,0,0.08))',
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
          style={{ top: '22%', left: '10%', width: '170px', animationDelay: '0s' }}
        >
          <OxfordLogo className="w-full h-auto text-gray-700" />
        </FloatingLogo>

        {/* UCL Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '44%', left: '6%', width: '150px', transform: 'rotate(-8deg)', animationDelay: '0.5s' }}
        >
          <img src={logoUcl} alt="UCL" className="w-full h-auto" />
        </FloatingLogo>

        {/* Imperial Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '70%', left: '7%', width: '220px', animationDelay: '1s' }}
        >
          <img src={logoImperial} alt="Imperial College London" className="w-full h-auto" />
        </FloatingLogo>

        {/* LSE Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '78%', left: '18%', width: '90px', transform: 'rotate(-10deg)', animationDelay: '1.5s' }}
        >
          <img src={logoLse} alt="LSE" className="w-full h-auto" />
        </FloatingLogo>

        {/* Sarah Coach Card */}
        <div 
          className="hidden lg:block absolute animate-float-reverse"
          style={{ 
            top: '50%', 
            left: '18%', 
            transform: 'rotate(-8deg)',
            animationDelay: '0.7s'
          }}
        >
          <CoachCard 
            name="Sarah K."
            subtitle="Oxford PPE '24"
            imageUrl="https://i.pravatar.cc/80?img=12"
          />
        </div>

        {/* RIGHT CLUSTER - Companies */}
        
        {/* J.P. Morgan Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float"
          style={{ top: '26%', right: '10%', width: '210px', animationDelay: '0.3s' }}
        >
          <JPMorganLogo className="w-full h-auto text-gray-600" />
        </FloatingLogo>

        {/* David Coach Card */}
        <div 
          className="hidden lg:block absolute animate-float"
          style={{ 
            top: '46%', 
            right: '15%', 
            transform: 'rotate(6deg)',
            animationDelay: '0.4s'
          }}
        >
          <CoachCard 
            name="David W."
            subtitle="Goldman Sachs Summer Analyst"
            imageUrl="https://i.pravatar.cc/80?img=33"
          />
        </div>

        {/* Clifford Chance Logo */}
        <FloatingLogo 
          className="hidden lg:block animate-float-reverse"
          style={{ top: '64%', right: '13%', width: '200px', animationDelay: '0.8s' }}
        >
          <CliffordChanceLogo className="w-full h-auto text-gray-600" />
        </FloatingLogo>

        {/* McKinsey Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float"
          style={{ top: '69%', right: '6%', width: '180px', animationDelay: '1.2s' }}
        >
          <img src={logoMckinsey} alt="McKinsey & Company" className="w-full h-auto" />
        </FloatingLogo>

        {/* Meta Logo */}
        <FloatingLogo 
          className="hidden xl:block animate-float-reverse"
          style={{ top: '78%', right: '20%', width: '120px', animationDelay: '1.6s' }}
        >
          <MetaLogo className="w-full h-auto text-gray-600" />
        </FloatingLogo>

      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
        <h1 
          className="font-serif font-semibold text-foreground mb-6 animate-fade-up"
          style={{ 
            fontSize: 'clamp(56px, 5.2vw, 84px)', 
            lineHeight: '0.98' 
          }}
        >
          Your edge, unlocked.
        </h1>
        
        <p 
          className="text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up" 
          style={{ animationDelay: "0.1s", fontSize: '19px' }}
        >
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
