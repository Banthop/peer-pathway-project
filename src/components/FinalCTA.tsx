import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extralight text-foreground mb-8">
          Your future self will thank you.
        </h2>

        <Link to="/dashboard/browse">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-sans font-extralight"
          >
            Book a Free Intro
          </Button>
        </Link>

        {/* Trust Indicators */}
        <p className="mt-6 text-sm text-muted-foreground font-sans font-light">
          No commitment required &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;

