const categories = [
  { name: "Investment Banking", logos: ["GS", "JPM", "MS"] },
  { name: "Consulting", logos: ["McK", "BCG", "Bain"] },
  { name: "Law", logos: ["CC", "A&O", "Linklaters"] },
  { name: "Uni Applications", logos: ["Ox", "Cam", "UCL"] },
  { name: "Oxbridge Applications", logos: ["Oxford", "Cambridge"] },
  { name: "UCAT", logos: ["Med", "Dent"] },
  { name: "Software Engineering", logos: ["Meta", "Google", "AMZN"] },
  { name: "STEP", logos: ["Math", "Cam"] },
  { name: "Quant Finance", logos: ["Jane St", "Citadel"] },
  { name: "Internship Conversion", logos: ["Convert", "Return"] },
];

const PopularCategories = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-12">
          Popular categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Mini logos */}
              <div className="flex gap-1 mb-4">
                {category.logos.map((logo, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                  >
                    {logo.substring(0, 2)}
                  </div>
                ))}
              </div>
              
              {/* Category name */}
              <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
