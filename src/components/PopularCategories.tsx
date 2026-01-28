import iconInvestmentBanking from "@/assets/icon-investment-banking.png";
import iconConsulting from "@/assets/icon-consulting.png";
import iconSoftwareEngineering from "@/assets/icon-software-engineering.png";
import iconStep from "@/assets/icon-step.png";
import type { LucideIcon } from "lucide-react";
import {
  ChartCandlestick,
  GraduationCap,
  Handshake,
  Landmark,
  Scale,
  Stethoscope,
} from "lucide-react";

type Category = {
  name: string;
  image?: string;
  Icon?: LucideIcon;
};

const categories: Category[] = [
  { name: "Investment Banking", image: iconInvestmentBanking },
  { name: "Consulting", image: iconConsulting },
  { name: "Law", Icon: Scale },
  { name: "Uni Applications", Icon: GraduationCap },
  { name: "Oxbridge Applications", Icon: Landmark },
  { name: "UCAT", Icon: Stethoscope },
  { name: "Software Engineering", image: iconSoftwareEngineering },
  { name: "STEP", image: iconStep },
  { name: "Quant Finance", Icon: ChartCandlestick },
  { name: "Internship Conversion", Icon: Handshake },
];

const PopularCategories = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-foreground mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Popular categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.Icon;

            return (
              <a
                key={category.name}
                href={`#${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group p-5 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Category icon */}
                <div className="mb-4 flex justify-center">
                  {Icon ? (
                    <Icon
                      className="h-16 w-16 text-foreground"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={category.image!}
                      alt={category.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>

                {/* Category name */}
                <p
                  className="text-sm text-foreground group-hover:text-primary transition-colors text-center"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {category.name}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
