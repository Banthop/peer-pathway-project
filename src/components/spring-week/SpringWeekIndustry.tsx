import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SPRING_WEEK_INDUSTRY_OPTIONS,
  SPRING_WEEK_INDUSTRY_REINFORCEMENT,
  BIGGEST_CONCERN_OPTIONS,
  REFERRAL_OPTIONS,
} from "@/data/springWeekData";
import { cn } from "@/lib/utils";
import { ArrowRight, Target, AlertTriangle, Building2, ShieldAlert } from "lucide-react";

interface SpringWeekIndustryProps {
  industry: string;
  industryDetail: string;
  springWeekFirms: string;
  biggestConcern: string;
  referralSource: string;
  onUpdate: (
    field: "industry" | "industryDetail" | "springWeekFirms" | "biggestConcern" | "referralSource",
    value: string,
  ) => void;
  onContinue: () => string | null;
}

export function SpringWeekIndustry({
  industry,
  industryDetail,
  springWeekFirms,
  biggestConcern,
  referralSource,
  onUpdate,
  onContinue,
}: SpringWeekIndustryProps) {
  const [showDetail, setShowDetail] = useState(!!industry);

  // Support multi-select: industry is stored as comma-separated string
  const selectedIndustries = industry ? industry.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const handleSelectIndustry = (option: string) => {
    const isSelected = selectedIndustries.includes(option);
    const next = isSelected
      ? selectedIndustries.filter((s) => s !== option)
      : [...selectedIndustries, option];
    onUpdate("industry", next.join(", "));
    if (next.length > 0) setShowDetail(true);
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

      {/* Section: Industry */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-white">
          About your spring week
        </h2>
        <p className="text-sm text-white/50 font-sans font-light">
          What area(s) are you targeting? Select all that apply.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPRING_WEEK_INDUSTRY_OPTIONS.map((option) => {
          const isActive = selectedIndustries.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelectIndustry(option)}
              className={cn(
                "px-5 py-2.5 text-sm rounded-full border font-sans font-light transition-all duration-200",
                isActive
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20"
                  : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selectedIndustries.length > 0 && (
        <p className="text-[11px] text-white/40 font-light -mt-4">
          {selectedIndustries.length} selected - tap to add or remove
        </p>
      )}

      {/* Micro-reinforcement based on first selected industry */}
      {selectedIndustries.length > 0 && SPRING_WEEK_INDUSTRY_REINFORCEMENT[selectedIndustries[selectedIndustries.length - 1]] && (
        <div
          className="flex items-start gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <Target className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="font-sans font-light leading-snug">
            {SPRING_WEEK_INDUSTRY_REINFORCEMENT[selectedIndustries[selectedIndustries.length - 1]]}
          </span>
        </div>
      )}

      {/* Section: Which spring weeks have you landed? */}
      {showDetail && selectedIndustries.length > 0 && (
        <div
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-sans font-medium text-white">
              <Building2 className="h-4 w-4 text-white/50" />
              Which firm(s) have you got a spring week at?
            </label>
            <Input
              type="text"
              placeholder="e.g. Goldman Sachs, Barclays"
              value={springWeekFirms}
              onChange={(e) => onUpdate("springWeekFirms", e.target.value)}
              className="font-sans text-base h-12 border-border rounded-xl"
            />
            <p className="text-[11px] text-white/50 font-sans font-light">
              We'll tailor our recommendation to your specific firms
            </p>
          </div>

          {/* Section: Biggest concern */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-sm font-sans font-medium text-white">
              <ShieldAlert className="h-4 w-4 text-white/50" />
              What's your biggest concern about your spring week?
            </label>
            <div className="space-y-2">
              {BIGGEST_CONCERN_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onUpdate("biggestConcern", option)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm rounded-xl border font-sans font-light transition-all duration-200",
                    biggestConcern === option
                      ? "bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20"
                      : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Legacy detail field - hidden but still tracked */}
          {industryDetail && (
            <input type="hidden" value={industryDetail} />
          )}
        </div>
      )}

      {/* REFERRAL SOURCE */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <h2 className="text-lg font-sans font-light text-white">
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
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20"
                  : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20",
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
        Find My Best Option
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
