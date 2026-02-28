import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import logoUcl from "@/assets/logo-ucl-new.png";
import logoLse from "@/assets/logo-lse-new.png";
import logoImperial from "@/assets/logo-imperial-new.png";
import logoMckinsey from "@/assets/logo-mckinsey-new.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";
import logoOxford from "@/assets/logo-oxford.png";
import logoGoldmanSachs from "@/assets/logo-goldman-sachs.png";
import logoJaneStreet from "@/assets/logo-jane-street.png";
import logoGoogle from "@/assets/logo-google.png";
import logoCambridge from "@/assets/logo-cambridge.png";

// Reordered for current seasonal relevance (Feb–Apr 2026)
const popularCategories = [
  "Law",
  "Assessment Centre Prep",
  "Cold Emailing",
  "Consulting",
  "Investment Banking",
  "UCAT",
  "Graduate Schemes",
  "Oxbridge",
  "Software Engineering",
  "Personal Statements",
];

// 3D Logo Box Component — thick floating tile with visible edges
const LogoBox = ({
  src,
  alt,
  size = 72,
  tiltX = 0,
  tiltY = 0,
  className = "",
  animationClass = "animate-float",
  delay = "0s",
  style,
}: {
  src: string;
  alt: string;
  size?: number;
  tiltX?: number;
  tiltY?: number;
  className?: string;
  animationClass?: string;
  delay?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`absolute hidden lg:block ${animationClass}`}
      style={{
        animationDelay: delay,
        perspective: '600px',
        ...style,
      }}
    >
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face with glassy effect */}
        <div
          className={`absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center ${className}`}
          style={{
            border: '2.5px solid rgba(0,0,0,0.18)',
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.9),
              inset 0 -2px 6px rgba(0,0,0,0.05),
              0 2px 4px rgba(0,0,0,0.06),
              0 8px 16px rgba(0,0,0,0.08),
              0 20px 40px -8px rgba(0,0,0,0.12),
              0 32px 64px -12px rgba(0,0,0,0.1)
            `,
          }}
        >
          {/* Angled Glass Reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)',
              borderRadius: '10px',
            }}
          />
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain relative z-[1]"
            style={{ borderRadius: '10px' }}
          />
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative flex items-center justify-center pt-20 pb-12 overflow-hidden bg-white"
      style={{ minHeight: "78vh", maxHeight: "820px" }}
    >
      {/* Background Layer - Floating 3D Logo Boxes */}
      <div className="absolute inset-0 pointer-events-none z-[1]">

        {/* ───── LEFT CLUSTER — Universities ───── */}

        {/* Oxford — mid-left */}
        <LogoBox
          src={logoOxford}
          alt="University of Oxford"
          size={92}
          tiltX={-6}
          tiltY={14}
          animationClass="animate-float-gentle"
          delay="0s"
          className="hidden xl:flex"
          style={{ top: "62%", left: "14%" }}
        />

        {/* Cambridge — lower-left */}
        <LogoBox
          src={logoCambridge}
          alt="University of Cambridge"
          size={92}
          tiltX={-10}
          tiltY={12}
          animationClass="animate-float-slow"
          delay="1.2s"
          style={{ top: "58%", left: "4%" }}
        />

        {/* UCL — upper left */}
        <LogoBox
          src={logoUcl}
          alt="UCL"
          size={100}
          tiltX={10}
          tiltY={16}
          animationClass="animate-float"
          delay="0.6s"
          style={{ top: "28%", left: "1%" }}
        />

        {/* Imperial — far bottom left */}
        <LogoBox
          src={logoImperial}
          alt="Imperial College London"
          size={88}
          tiltX={-12}
          tiltY={8}
          animationClass="animate-float-slow"
          delay="2s"
          className="hidden xl:flex"
          style={{ top: "84%", left: "3%" }}
        />

        {/* LSE — inward bottom left */}
        <LogoBox
          src={logoLse}
          alt="LSE"
          size={88}
          tiltX={-8}
          tiltY={14}
          animationClass="animate-float-gentle"
          delay="1.5s"
          className="hidden xl:flex"
          style={{ top: "82%", left: "20%" }}
        />

        {/* ───── RIGHT CLUSTER — Companies ───── */}

        {/* Goldman Sachs — mid-right */}
        <LogoBox
          src={logoGoldmanSachs}
          alt="Goldman Sachs"
          size={92}
          tiltX={-6}
          tiltY={-14}
          animationClass="animate-float-slow"
          delay="0.4s"
          className="hidden xl:flex"
          style={{ top: "62%", right: "14%" }}
        />

        {/* Jane Street — lower right */}
        <LogoBox
          src={logoJaneStreet}
          alt="Jane Street"
          size={92}
          tiltX={-10}
          tiltY={-12}
          animationClass="animate-float"
          delay="1s"
          style={{ top: "58%", right: "4%" }}
        />

        {/* Clifford Chance — upper right */}
        <LogoBox
          src={logoCliffordChance}
          alt="Clifford Chance"
          size={100}
          tiltX={10}
          tiltY={-16}
          animationClass="animate-float-gentle"
          delay="1.4s"
          style={{ top: "28%", right: "1%" }}
        />

        {/* McKinsey — inward bottom right */}
        <LogoBox
          src={logoMckinsey}
          alt="McKinsey & Company"
          size={88}
          tiltX={-8}
          tiltY={-14}
          animationClass="animate-float"
          delay="1.8s"
          className="hidden xl:flex"
          style={{ top: "82%", right: "20%" }}
        />

        {/* Google — far bottom right */}
        <LogoBox
          src={logoGoogle}
          alt="Google"
          size={88}
          tiltX={-12}
          tiltY={-8}
          animationClass="animate-float-slow"
          delay="2.2s"
          className="hidden xl:flex"
          style={{ top: "84%", right: "3%" }}
        />

      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center">
        <h1
          className="text-foreground mb-6 animate-fade-up whitespace-nowrap font-sans"
          style={{
            fontWeight: 700,
            fontSize: "clamp(40px, 8vw, 84px)",
            lineHeight: "0.98",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          Your edge, unlocked.
        </h1>

        <div
          className="mb-10 max-w-xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-foreground text-lg font-sans font-light">
            1-on-1 coaching from students who just landed the offers you want
          </p>
          <p className="text-muted-foreground mt-1 text-sm font-sans font-light">
            Get prepped for uni applications, tests, and internships.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="relative max-w-2xl w-full mx-auto mb-4 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            type="text"
            placeholder="Search for coaches..."
            className="w-full pl-12 pr-4 py-6 text-base rounded-full border-2 border-primary bg-card shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-primary/70 cursor-pointer"
            readOnly
            onClick={() => navigate("/dashboard/browse")}
          />
        </div>

        {/* Pricing Hint — updated with packages anchor */}
        <p
          className="text-muted-foreground mb-6 animate-fade-up text-sm font-sans font-light"
          style={{ animationDelay: "0.25s" }}
        >
          <span className="text-green-600 font-medium">
            Book a free intro call
          </span>
          <span className="mx-2">•</span>
          Sessions from £25
          <span className="mx-2">•</span>
          Packages from £99
        </p>

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
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors font-sans font-light"
                onClick={() => navigate("/dashboard/browse")}
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
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors font-sans font-light"
                onClick={() => navigate("/dashboard/browse")}
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
                className="px-4 py-2 text-sm cursor-pointer bg-background text-foreground border-foreground hover:bg-foreground hover:text-background transition-colors font-sans font-light"
                onClick={() => navigate("/dashboard/browse")}
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
