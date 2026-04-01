import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SPRING_WEEK_INDUSTRY_OPTIONS,
  SPRING_WEEK_INDUSTRY_REINFORCEMENT,
  REFERRAL_OPTIONS,
} from "@/data/springWeekData";
import { cn } from "@/lib/utils";
import { ArrowRight, Target, AlertTriangle } from "lucide-react";

interface SpringWeekIndustryProps {
  industry: string;
  industryDetail: string;
  referralSource: string;
  onUpdate: (field: "industry" | "industryDetail" | "referralSource", value: string) => void;
  onContinue: () => string | null;
}

export function SpringWeekIndustry({
  industry,
  industryDetail,
  referralSource,
  onUpdate,
  onContinue,
}: SpringWeekIndustryProps) {
  const [showDetail, setShowDetail] = useState(!!industry);

  const handleSelectIndustry = (option: string) => {
    onUpdate("industry", option);
    setShowDetail(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Pain-point stat */}
      <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm font-sans font-light text-amber-800 leading-snug">
          Most spring weekers <strong className="font-semibold">never hear back</strong> after their programme ends.
          Our panellists did - and they'll show you how.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Which area of finance are you targeting?
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          Pick the one closest to your spring week
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPRING_WEEK_INDUSTRY_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelectIndustry(option)}
            className={cn(
              "px-5 py-2.5 text-sm rounded-full border font-sans font-light transition-all duration-200",
              industry === option
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-background text-foreground border-border hover:border-foreground/40",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Micro-reinforcement based on industry */}
      {industry && SPRING_WEEK_INDUSTRY_REINFORCEMENT[industry] && (
        <div
          className="flex items-start gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <Target className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="font-sans font-light leading-snug">
            {SPRING_WEEK_INDUSTRY_REINFORCEMENT[industry]}
          </span>
        </div>
      )}

      {/* Detail field */}
      {showDetail && industry && (
        <div
          className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <label className="text-sm text-muted-foreground font-sans font-light">
            Which firm(s) are you doing a spring week at? (optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. Goldman Sachs, JPMorgan, Barclays"
            value={industryDetail}
            onChange={(e) => onUpdate("industryDetail", e.target.value)}
            className="font-sans text-base h-12 border-border rounded-xl"
          />
        </div>
      )}

      {/* REFERRAL SOURCE */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <h2 className="text-lg font-sans font-light text-foreground">
          How did you hear about us?
        </h2>
        <div className="flex flex-wrap gap-2">
          {REFERRAL_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onUpdate("referralSource", option)}
              className={cn(
                "px-4 py-2 text-sm rounded-full border font-sans font-light transition-all duration-200",
                referralSource === option
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-background text-foreground border-border hover:border-foreground/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-8 py-3 text-sm rounded-xl w-full sm:w-auto"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
