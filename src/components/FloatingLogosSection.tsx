import logoGoldmanSachs from "@/assets/logo-goldman-sachs.png";

const FloatingLogosSection = () => {
  const depth = 10;
  
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
        <div className="relative h-96 md:h-[450px] max-w-4xl mx-auto flex items-center justify-center" style={{ perspective: "1000px" }}>
          
          {/* Goldman Sachs Tile */}
          <div
            className="transition-transform duration-300 hover:scale-105"
            style={{
              transformStyle: "preserve-3d",
              transform: "perspective(800px) rotateX(12deg) rotateY(-15deg)",
            }}
          >
            {/* Main tile face - Blue background */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center p-5 relative"
              style={{
                backgroundColor: "#6B9AC4", // Goldman Sachs light blue
                transformStyle: "preserve-3d",
                transform: `translateZ(${depth}px)`,
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 12px 24px -8px rgba(0, 0, 0, 0.15),
                  0 4px 8px rgba(0, 0, 0, 0.1)
                `,
              }}
            >
              <img
                src={logoGoldmanSachs}
                alt="Goldman Sachs"
                className="w-full h-full object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Right side edge - Darker blue */}
            <div
              className="absolute top-0"
              style={{
                width: `${depth}px`,
                height: "96px",
                backgroundColor: "#4A7BA7", // Darker blue for depth
                transform: `rotateY(90deg) translateZ(${96 - depth}px) translateX(${depth / 2}px)`,
                borderTopRightRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            />

            {/* Bottom side edge - Even darker blue */}
            <div
              className="absolute left-0"
              style={{
                width: "96px",
                height: `${depth}px`,
                backgroundColor: "#3D6A94", // Even darker for bottom
                transform: `rotateX(-90deg) translateZ(${96 - depth}px) translateY(-${depth / 2}px)`,
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default FloatingLogosSection;
