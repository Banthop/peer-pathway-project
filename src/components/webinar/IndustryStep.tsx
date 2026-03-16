import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INDUSTRY_OPTIONS, REFERRAL_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight, Target, TrendingDown, AlertTriangle } from "lucide-react";

interface IndustryStepProps {
  industry: string;
  industryDetail: string;
  referralSource: string;
  onUpdate: (field: "industry" | "industryDetail" | "referralSource", value: string) => void;
  onContinue: () => string | null;
}

const INDUSTRY_REINFORCEMENT: Record<string, string> = {
  Finance: "Great pick. The webinar covers exactly how to email investment banks, hedge funds, and PE firms.",
  Law: "Perfect. You'll learn how to reach partners and associates at top law firms directly.",
  Consulting: "Solid choice. Cold emailing is one of the most effective ways into MBB and Big 4.",
  Tech: "Smart. The guide includes templates tailored for tech PMs, engineers, and startup founders.",
  "Marketing / Media": "Great choice. Cold emailing is incredibly effective for landing roles in agencies and media companies.",
  Healthcare: "Nice. The framework applies perfectly to healthcare firms and research institutions.",
  "Not sure yet": "No worries. This framework works across every industry, so you'll be covered wherever you end up.",
  Other: "This framework works across every industry, we'll show you how to adapt it.",
};

export function IndustryStep({
  industry,
  industryDetail,
  referralSource,
  onUpdate,
  onContinue,
}: IndustryStepProps) {
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
      {/* Constant pain-point stat */}
      <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-3">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm font-sans font-light text-amber-800 leading-snug">
          Only <strong className="font-semibold">2% of cold emails</strong> get replies.
          The average student sends 100 and gets 2.
          This framework gets you <strong className="font-semibold text-emerald-700">21%</strong>.
        </p>
      </div>

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
      {industry && INDUSTRY_REINFORCEMENT[industry] && (
        <div
          className="flex items-start gap-2.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <Target className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="font-sans font-light leading-snug">
            {INDUSTRY_REINFORCEMENT[industry]}
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
            If possible, please specify (optional)
          </label>
          <Input
            type="text"
            placeholder={
              industry === "Finance"
                ? "e.g. Investment Banking, Private Equity, Asset Management"
                : industry === "Tech"
                  ? "e.g. Software Engineering, Product Management, Data Science"
                  : industry === "Law"
                    ? "e.g. Corporate Law, Commercial Law, Criminal Law"
                    : industry === "Consulting"
                      ? "e.g. Strategy, Management, Technology Consulting"
                      : "e.g. specific role or area"
            }
            value={industryDetail}
            onChange={(e) => onUpdate("industryDetail", e.target.value)}
            className="font-sans text-base h-12 border-border rounded-xl"
          />
        </div>
      )}

      {/* REFERRAL SOURCE - merged here */}
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
