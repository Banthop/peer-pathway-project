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
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-xl px-4 py-3">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
        <p className="text-sm font-sans font-light text-amber-100/90 leading-snug">
          Most spring weekers <strong className="font-medium text-amber-400">never hear back</strong> after their programme ends.
          Our panellists did - and they'll show you how.
        </p>
      </div>

      {/* Section: Industry */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-white">
          About your spring week
        </h2>
        <p className="text-sm text-white/50 font-sans font-light">
          What area are you targeting?
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
                ? "bg-emerald-500 text-black border-emerald-500 font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02] z-10 relative"
                : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Micro-reinforcement based on industry */}
      {industry && SPRING_WEEK_INDUSTRY_REINFORCEMENT[industry] && (
        <div
          className="flex items-start gap-2.5 text-sm text-emerald-100/90 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <Target className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
          <span className="font-sans font-light leading-snug">
            {SPRING_WEEK_INDUSTRY_REINFORCEMENT[industry]}
          </span>
        </div>
      )}

      {/* Section: Which spring weeks have you landed? */}
      <div className={cn("grid transition-all duration-500 ease-in-out", showDetail && industry ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none")}>
        <div className="overflow-hidden">
          <div className="space-y-6 pt-2 pb-2">
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
                      ? "bg-emerald-500 text-black border-emerald-500 font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.01] z-10 relative"
                      : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]",
                  )}
                >
                  {option}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onUpdate("biggestConcern", "Other")}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm rounded-xl border font-sans font-light transition-all duration-200",
                  biggestConcern.startsWith("Other")
                    ? "bg-emerald-500 text-black border-emerald-500 font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.01] z-10 relative"
                    : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]",
                )}
              >
                Other (please specify)
              </button>
              {biggestConcern.startsWith("Other") && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    type="text"
                    placeholder="Type your biggest concern here..."
                    value={biggestConcern.startsWith("Other: ") ? biggestConcern.replace("Other: ", "") : ""}
                    onChange={(e) => onUpdate("biggestConcern", e.target.value ? `Other: ${e.target.value}` : "Other")}
                    className="font-sans text-base h-12 border-border rounded-xl w-full"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Legacy detail field - hidden but still tracked */}
          {industryDetail && (
            <input type="hidden" value={industryDetail} />
          )}
          </div>
        </div>
      </div>

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
                  ? "bg-emerald-500 text-black border-emerald-500 font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02] z-10 relative"
                  : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]",
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
