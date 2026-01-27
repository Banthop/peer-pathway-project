import logoGoldmanSachs from "@/assets/logo-goldman-sachs.png";
import logoMckinsey from "@/assets/logo-mckinsey-new.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";
import logoJpmorgan from "@/assets/logo-jpmorgan-new.png";
import logoMeta from "@/assets/logo-meta.png";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoImperial from "@/assets/logo-imperial-new.png";

interface LogoTile {
  name: string;
  logo: string;
  bgColor: string;
  darkColor: string;
  rotation: { x: number; y: number };
  position: { top: string; left: string };
}

const logoTiles: LogoTile[] = [
  {
    name: "Goldman Sachs",
    logo: logoGoldmanSachs,
    bgColor: "#10539A",
    darkColor: "#0a3560",
    rotation: { x: 15, y: -12 },
    position: { top: "8%", left: "8%" },
  },
  {
    name: "McKinsey",
    logo: logoMckinsey,
    bgColor: "#052D5A",
    darkColor: "#021a35",
    rotation: { x: -12, y: 18 },
    position: { top: "15%", left: "28%" },
  },
  {
    name: "Oxford",
    logo: logoOxford,
    bgColor: "#002147",
    darkColor: "#00112a",
    rotation: { x: 18, y: 8 },
    position: { top: "5%", left: "52%" },
  },
  {
    name: "Meta",
    logo: logoMeta,
    bgColor: "#0668E1",
    darkColor: "#0450a8",
    rotation: { x: -10, y: -15 },
    position: { top: "18%", left: "75%" },
  },
  {
    name: "Cambridge",
    logo: logoCambridge,
    bgColor: "#A3C1AD",
    darkColor: "#7a9a84",
    rotation: { x: 14, y: 12 },
    position: { top: "45%", left: "5%" },
  },
  {
    name: "J.P. Morgan",
    logo: logoJpmorgan,
    bgColor: "#1A1A1A",
    darkColor: "#0a0a0a",
    rotation: { x: -15, y: -10 },
    position: { top: "55%", left: "22%" },
  },
  {
    name: "Clifford Chance",
    logo: logoCliffordChance,
    bgColor: "#E31837",
    darkColor: "#a31028",
    rotation: { x: 10, y: -18 },
    position: { top: "48%", left: "48%" },
  },
  {
    name: "Imperial",
    logo: logoImperial,
    bgColor: "#002A4E",
    darkColor: "#001528",
    rotation: { x: -18, y: 14 },
    position: { top: "52%", left: "72%" },
  },
];

const FloatingTile = ({ tile, index }: { tile: LogoTile; index: number }) => {
  const depth = 12; // thickness of the tile in pixels
  
  return (
    <div
      className="absolute"
      style={{
        top: tile.position.top,
        left: tile.position.left,
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tile.rotation.x}deg) rotateY(${tile.rotation.y}deg)`,
        animation: `float-tile-3d ${3.5 + (index % 3) * 0.4}s ease-in-out infinite`,
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {/* Main tile face */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center p-4 relative"
        style={{
          backgroundColor: tile.bgColor,
          transformStyle: "preserve-3d",
          transform: `translateZ(${depth / 2}px)`,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.4),
            0 12px 24px -8px rgba(0, 0, 0, 0.3)
          `,
        }}
      >
        <img
          src={tile.logo}
          alt={tile.name}
          className="w-full h-full object-contain"
          style={{
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* Right side edge */}
      <div
        className="absolute top-0 rounded-r-lg"
        style={{
          width: `${depth}px`,
          height: "80px",
          backgroundColor: tile.darkColor,
          transform: `rotateY(90deg) translateZ(${80 - depth / 2}px) translateX(${depth / 2}px)`,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      />

      {/* Bottom side edge */}
      <div
        className="absolute left-0 rounded-b-lg"
        style={{
          width: "80px",
          height: `${depth}px`,
          backgroundColor: tile.darkColor,
          transform: `rotateX(-90deg) translateZ(${80 - depth / 2}px) translateY(-${depth / 2}px)`,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          opacity: 0.85,
        }}
      />
    </div>
  );
};

const FloatingLogosSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Label */}
        <p
          className="text-center text-xs md:text-sm tracking-widest text-muted-foreground uppercase mb-16"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Get into organizations like
        </p>

        {/* Floating Tiles Container */}
        <div className="relative h-80 md:h-96 max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
          {logoTiles.map((tile, index) => (
            <FloatingTile key={tile.name} tile={tile} index={index} />
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes float-tile-3d {
          0%, 100% {
            transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(0px) translateZ(0px);
          }
          50% {
            transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-8px) translateZ(5px);
          }
        }
      `}</style>
    </section>
  );
};

export default FloatingLogosSection;
