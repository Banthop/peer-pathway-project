import categoryInvestmentBanking from "@/assets/category-investment-banking.png";
import categoryConsulting from "@/assets/category-consulting.png";

const categories = [
  { name: "Investment Banking", image: categoryInvestmentBanking },
  { name: "Consulting", image: categoryConsulting },
  { name: "Law" },
  { name: "Uni Applications" },
  { name: "Oxbridge Applications" },
  { name: "UCAT" },
  { name: "Software Engineering" },
  { name: "STEP" },
  { name: "Quant Finance" },
  { name: "Internship Conversion" },
];

const PopularCategories = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-foreground mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Popular categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category image */}
              <div className="mb-4">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-32 object-cover object-center rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Coming soon</span>
                  </div>
                )}
              </div>
              
              {/* Category name */}
              <p className="text-sm text-foreground group-hover:text-primary transition-colors text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
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
