const logos = [
  "Oxford",
  "Cambridge",
  "Goldman Sachs",
  "McKinsey",
  "Clifford Chance",
  "Meta",
  "J.P. Morgan",
  "Bain",
];

const LogosBar = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Label */}
        <p className="text-center text-xs md:text-sm tracking-widest text-muted-foreground uppercase mb-10">
          Get into organizations like
        </p>

        {/* Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-muted-foreground/50 font-medium text-sm md:text-base"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogosBar;
