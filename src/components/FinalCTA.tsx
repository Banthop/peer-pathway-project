import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extralight text-foreground mb-8">
          Your future self will thank you.
        </h2>
        
        <Button
          size="lg"
          className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-sans font-extralight"
        >
          Find Your Coach
        </Button>

        {/* Trust Indicators */}
        <p className="mt-6 text-sm text-muted-foreground font-sans font-light">
          Free intro call · No commitment · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
