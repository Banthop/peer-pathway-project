import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, School } from "lucide-react";

const DA_YEAR_OPTIONS = [
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
  "Gap Year",
  "Apprentice",
  "Other",
];

interface DaSchoolStepProps {
  school: string;
  yearOfStudy: string;
  onUpdate: (field: "university" | "yearOfStudy", value: string) => void;
  onContinue: () => string | null;
}

export function DaSchoolStep({
  school,
  yearOfStudy,
  onUpdate,
  onContinue,
}: DaSchoolStepProps) {
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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* School Name */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-medium text-foreground tracking-tight">
          Where do you study?
        </h2>
        <div className="relative">
          <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/60 pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your School or Sixth Form name..."
            value={school}
            onChange={(e) => onUpdate("university", e.target.value)}
            className="font-sans text-base h-14 border-border pl-11 rounded-xl shadow-sm"
            autoComplete="off"
            required
          />
        </div>
      </div>

      {/* Year */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-sans font-medium text-foreground tracking-tight">
          What stage are you at?
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {DA_YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onUpdate("yearOfStudy", year)}
              className={cn(
                "px-5 py-3 text-sm rounded-xl border font-sans font-medium transition-all duration-200",
                yearOfStudy === year
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105"
                  : "bg-white text-foreground border-border hover:border-emerald-500/40 hover:bg-emerald-50",
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
        className="bg-[#111] text-white hover:bg-emerald-600 font-sans font-medium px-8 py-6 text-base rounded-xl w-full sm:w-auto shadow-md transition-all group"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
}
