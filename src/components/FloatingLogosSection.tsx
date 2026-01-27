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
  rotation: { x: number; y: number };
  position: { top: string; left: string };
}

const logoTiles: LogoTile[] = [
  {
    name: "Goldman Sachs",
    logo: logoGoldmanSachs,
    bgColor: "#10539A", // Goldman Sachs blue
    rotation: { x: 12, y: -8 },
    position: { top: "8%", left: "8%" },
  },
  {
    name: "McKinsey",
    logo: logoMckinsey,
    bgColor: "#052D5A", // McKinsey dark navy
    rotation: { x: -8, y: 12 },
    position: { top: "15%", left: "28%" },
  },
  {
    name: "Oxford",
    logo: logoOxford,
    bgColor: "#002147", // Oxford blue
    rotation: { x: 10, y: 6 },
    position: { top: "5%", left: "52%" },
  },
  {
    name: "Meta",
    logo: logoMeta,
    bgColor: "#0668E1", // Meta blue
    rotation: { x: -6, y: -10 },
    position: { top: "18%", left: "75%" },
  },
  {
    name: "Cambridge",
    logo: logoCambridge,
    bgColor: "#A3C1AD", // Cambridge light green
    rotation: { x: 8, y: 10 },
    position: { top: "45%", left: "5%" },
  },
  {
    name: "J.P. Morgan",
    logo: logoJpmorgan,
    bgColor: "#1A1A1A", // J.P. Morgan dark
    rotation: { x: -10, y: -6 },
    position: { top: "55%", left: "22%" },
  },
  {
    name: "Clifford Chance",
    logo: logoCliffordChance,
    bgColor: "#E31837", // Clifford Chance red
    rotation: { x: 6, y: -12 },
    position: { top: "48%", left: "48%" },
  },
  {
    name: "Imperial",
    logo: logoImperial,
    bgColor: "#002A4E", // Imperial navy
    rotation: { x: -12, y: 8 },
    position: { top: "52%", left: "72%" },
  },
];

const FloatingTile = ({ tile, index }: { tile: LogoTile; index: number }) => {
  return (
    <div
      className="absolute w-20 h-20 rounded-2xl flex items-center justify-center p-3 transition-transform duration-500 hover:scale-110"
      style={{
        backgroundColor: tile.bgColor,
        top: tile.position.top,
        left: tile.position.left,
        transform: `perspective(800px) rotateX(${tile.rotation.x}deg) rotateY(${tile.rotation.y}deg)`,
        boxShadow: `
          0 20px 40px -10px rgba(0, 0, 0, 0.3),
          0 10px 20px -5px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        animation: `float-tile ${3 + (index % 3) * 0.5}s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
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
        <div className="relative h-80 md:h-96 max-w-5xl mx-auto">
          {logoTiles.map((tile, index) => (
            <FloatingTile key={tile.name} tile={tile} index={index} />
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes float-tile {
          0%, 100% {
            transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(0px);
          }
          50% {
            transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default FloatingLogosSection;
