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
  rotation: { x: number; y: number };
  position: { top: string; left: string };
}

const logoTiles: LogoTile[] = [
  {
    name: "Goldman Sachs",
    logo: logoGoldmanSachs,
    rotation: { x: 12, y: -15 },
    position: { top: "5%", left: "12%" },
  },
  {
    name: "J.P. Morgan",
    logo: logoJpmorgan,
    rotation: { x: -8, y: 12 },
    position: { top: "8%", left: "58%" },
  },
  {
    name: "McKinsey",
    logo: logoMckinsey,
    rotation: { x: 10, y: 18 },
    position: { top: "35%", left: "55%" },
  },
  {
    name: "Clifford Chance",
    logo: logoCliffordChance,
    rotation: { x: -12, y: -10 },
    position: { top: "38%", left: "25%" },
  },
  {
    name: "Meta",
    logo: logoMeta,
    rotation: { x: 8, y: -14 },
    position: { top: "60%", left: "60%" },
  },
  {
    name: "Oxford",
    logo: logoOxford,
    rotation: { x: -10, y: 16 },
    position: { top: "65%", left: "8%" },
  },
  {
    name: "Cambridge",
    logo: logoCambridge,
    rotation: { x: 14, y: -8 },
    position: { top: "68%", left: "35%" },
  },
  {
    name: "Imperial",
    logo: logoImperial,
    rotation: { x: -6, y: 12 },
    position: { top: "12%", left: "32%" },
  },
];

const FloatingTile = ({ tile, index }: { tile: LogoTile; index: number }) => {
  const depth = 8;
  
  return (
    <div
      className="absolute transition-transform duration-300 hover:scale-105"
      style={{
        top: tile.position.top,
        left: tile.position.left,
        transformStyle: "preserve-3d",
        transform: `perspective(800px) rotateX(${tile.rotation.x}deg) rotateY(${tile.rotation.y}deg)`,
        animation: `float-tile-smooth ${4 + (index % 3) * 0.5}s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
      }}
    >
      {/* Main tile face */}
      <div
        className="w-20 h-20 rounded-xl flex items-center justify-center p-4 bg-white"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${depth}px)`,
          boxShadow: `
            0 20px 40px -15px rgba(0, 0, 0, 0.15),
            0 8px 16px -8px rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        <img
          src={tile.logo}
          alt={tile.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Right side edge */}
      <div
        className="absolute top-0"
        style={{
          width: `${depth}px`,
          height: "80px",
          background: "linear-gradient(to right, #e8e8e8, #d8d8d8)",
          transform: `rotateY(90deg) translateZ(${80 - depth}px) translateX(${depth / 2}px)`,
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      />

      {/* Bottom side edge */}
      <div
        className="absolute left-0"
        style={{
          width: "80px",
          height: `${depth}px`,
          background: "linear-gradient(to bottom, #e0e0e0, #d0d0d0)",
          transform: `rotateX(-90deg) translateZ(${80 - depth}px) translateY(-${depth / 2}px)`,
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      />

      {/* Left side edge (for tiles tilted right) */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: `${depth}px`,
          height: "80px",
          background: "linear-gradient(to left, #f0f0f0, #e5e5e5)",
          transform: `rotateY(-90deg) translateZ(0px) translateX(-${depth / 2}px)`,
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      />

      {/* Top side edge (for tiles tilted back) */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: "80px",
          height: `${depth}px`,
          background: "linear-gradient(to top, #f5f5f5, #ebebeb)",
          transform: `rotateX(90deg) translateZ(0px) translateY(${depth / 2}px)`,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
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
        <div className="relative h-96 md:h-[450px] max-w-4xl mx-auto" style={{ perspective: "1000px" }}>
          {logoTiles.map((tile, index) => (
            <FloatingTile key={tile.name} tile={tile} index={index} />
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes float-tile-smooth {
          0%, 100% {
            transform: perspective(800px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(0px);
          }
          50% {
            transform: perspective(800px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
};

export default FloatingLogosSection;
