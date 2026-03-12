import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-20 md:py-32 bg-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extralight text-background mb-4">
          Your future self will thank you.
        </h2>
        <p className="text-base font-sans font-light text-background/60 mb-10 max-w-lg mx-auto">
          Book a free intro call with a coach who's been exactly where you are — and got to where you want to be.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/browse">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-base font-sans font-medium"
            >
              Find a Coach
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/become-a-coach">
            <Button
              size="lg"
              variant="outline"
              className="border-background/30 text-background hover:bg-background/10 px-8 py-6 text-base font-sans font-light"
            >
              Become a Coach
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <p className="mt-8 text-sm text-background/40 font-sans font-light">
          Free intro call &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
