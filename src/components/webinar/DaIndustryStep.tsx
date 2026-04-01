import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REFERRAL_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight, Trophy, CheckCircle2 } from "lucide-react";

interface DaIndustryStepProps {
  industry: string;
  industryDetail: string;
  referralSource: string;
  onUpdate: (field: "industry" | "industryDetail" | "referralSource", value: string) => void;
  onContinue: () => string | null;
}

const DA_INDUSTRIES = [
  "Finance & Banking",
  "Accounting & Audit",
  "Engineering",
  "Technology / Software",
  "Consulting",
  "Law",
  "Other",
];

export function DaIndustryStep({
  industry,
  industryDetail,
  referralSource,
  onUpdate,
  onContinue,
}: DaIndustryStepProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    industry ? industry.split(", ").filter(Boolean) : []
  );

  const toggleIndustry = (option: string) => {
    let newSelection = [...selectedIndustries];
    if (newSelection.includes(option)) {
      newSelection = newSelection.filter((i) => i !== option);
    } else {
      newSelection.push(option);
    }
    setSelectedIndustries(newSelection);
    onUpdate("industry", newSelection.join(", "));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndustries.length === 0) {
      alert("Please select at least one industry.");
      return;
    }
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* DA motivation stat */}
      <div className="flex items-start gap-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-4 py-4 shadow-sm">
        <Trophy className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-sm font-sans font-medium text-emerald-900 leading-relaxed">
          Top Degree Apprenticeships get over <strong className="font-bold">5,000+ applications</strong> for just 20 spots.
          The frameworks taught in this Masterclass have helped students secure offers against those exact odds.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-medium text-foreground tracking-tight">
          What industries are you targeting?
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          You can select multiple options
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {DA_INDUSTRIES.map((option) => {
          const isSelected = selectedIndustries.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleIndustry(option)}
              className={cn(
                "px-5 py-3 text-[13px] rounded-xl border font-sans font-medium transition-all duration-200 flex items-center gap-2",
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-[1.02]"
                  : "bg-white text-foreground border-border hover:border-emerald-500/40 hover:bg-emerald-50",
              )}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              {option}
            </button>
          );
        })}
      </div>

      {/* Detail field */}
      {selectedIndustries.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <label className="text-sm text-foreground font-sans font-medium">
            Any specific firms in mind? <span className="text-muted-foreground font-light">(optional)</span>
          </label>
          <Input
            type="text"
            placeholder="e.g. Goldman Sachs, BAE Systems, Google..."
            value={industryDetail}
            onChange={(e) => onUpdate("industryDetail", e.target.value)}
            className="font-sans text-base h-14 border-border rounded-xl shadow-sm"
          />
        </div>
      )}

      {/* Referral source */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <h2 className="text-lg font-sans font-medium text-foreground tracking-tight">
          How did you hear about us?
        </h2>
        <div className="flex flex-wrap gap-2">
          {REFERRAL_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onUpdate("referralSource", option)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg border font-sans font-light transition-all duration-200",
                referralSource === option
                  ? "bg-[#111] text-white border-[#111] shadow-sm"
                  : "bg-white text-foreground border-border hover:border-[#111]/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="bg-[#111] text-white hover:bg-emerald-600 font-sans font-medium px-8 py-6 text-base rounded-xl w-full sm:w-auto shadow-md transition-all group"
      >
        Gain Instant Access
        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
}
