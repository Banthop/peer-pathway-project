import iconInvestmentBanking from "@/assets/icon-investment-banking.png";
import iconConsulting from "@/assets/icon-consulting.png";
import iconLaw from "@/assets/icon-law.png";
import iconUniApplications from "@/assets/icon-uni-applications.png";
import iconOxbridge from "@/assets/icon-oxbridge.png";
import iconUcat from "@/assets/icon-ucat.png";
import iconSoftwareEngineering from "@/assets/icon-software-engineering.png";
import iconStep from "@/assets/icon-step.png";
import iconQuantFinance from "@/assets/icon-quant-finance.png";
import iconInternship from "@/assets/icon-internship.png";

const categories = [
  { name: "Investment Banking", image: iconInvestmentBanking },
  { name: "Consulting", image: iconConsulting },
  { name: "Law", image: iconLaw },
  { name: "Uni Applications", image: iconUniApplications },
  { name: "Oxbridge Applications", image: iconOxbridge },
  { name: "UCAT", image: iconUcat },
  { name: "Software Engineering", image: iconSoftwareEngineering },
  { name: "STEP", image: iconStep },
  { name: "Quant Finance", image: iconQuantFinance },
  { name: "Internship Conversion", image: iconInternship },
];

const PopularCategories = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-foreground mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
          Popular categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`#${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category icon */}
              <div className="mb-4 flex justify-center">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              {/* Category name */}
              <p className="text-sm text-foreground group-hover:text-primary transition-colors text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
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
