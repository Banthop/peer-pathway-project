import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-8">
          Ready to get started?
        </h2>
        
        <Button
          size="lg"
          className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
