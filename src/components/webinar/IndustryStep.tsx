import { Button } from "@/components/ui/button";
import { INDUSTRY_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface IndustryStepProps {
  industry: string;
  onUpdate: (field: "industry", value: string) => void;
  onContinue: () => string | null;
}

export function IndustryStep({
  industry,
  onUpdate,
  onContinue,
}: IndustryStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          What industry are you targeting?
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          Pick the one you're most interested in
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INDUSTRY_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onUpdate("industry", option)}
            className={cn(
              "px-5 py-2.5 text-sm rounded-full border font-sans font-light transition-colors duration-200",
              industry === option
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground/40",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/90 font-sans font-light px-8 py-3 text-sm rounded-lg w-full sm:w-auto"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
