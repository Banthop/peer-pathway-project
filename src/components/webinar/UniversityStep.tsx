import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { YEAR_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface UniversityStepProps {
  university: string;
  yearOfStudy: string;
  onUpdate: (field: "university" | "yearOfStudy", value: string) => void;
  onContinue: () => string | null;
}

export function UniversityStep({
  university,
  yearOfStudy,
  onUpdate,
  onContinue,
}: UniversityStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* University */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Where do you study?
        </h2>
        <Input
          ref={inputRef}
          type="text"
          placeholder="e.g. University of Manchester"
          value={university}
          onChange={(e) => onUpdate("university", e.target.value)}
          className="font-sans text-base h-12 border-border"
          autoComplete="organization"
        />
      </div>

      {/* Year of study */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          What year are you in?
        </h2>
        <div className="flex flex-wrap gap-2">
          {YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onUpdate("yearOfStudy", year)}
              className={cn(
                "px-4 py-2 text-sm rounded-full border font-sans font-light transition-colors duration-200",
                yearOfStudy === year
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground/40",
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Continue */}
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
