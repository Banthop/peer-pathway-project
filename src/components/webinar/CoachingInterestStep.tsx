import { Button } from "@/components/ui/button";
import { COACHING_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CoachingInterestStepProps {
    coachingInterest: string;
    onUpdate: (field: "coachingInterest", value: string) => void;
    onContinue: () => string | null;
}

export function CoachingInterestStep({
    coachingInterest,
    onUpdate,
    onContinue,
}: CoachingInterestStepProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
                    Interested in 1-to-1 coaching?
                </h2>
                <p className="text-sm text-muted-foreground font-sans font-light">
                    Get personalised help with applications, cold emails, and interview prep
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {COACHING_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onUpdate("coachingInterest", option.value)}
                        className={cn(
                            "text-left px-6 py-4 rounded-xl border font-sans transition-all duration-200",
                            coachingInterest === option.value
                                ? "border-2 border-foreground bg-foreground/[0.03] shadow-sm"
                                : "border-border hover:border-foreground/30 hover:shadow-sm",
                        )}
                    >
                        <span className="block text-sm font-medium text-foreground">
                            {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground font-light mt-0.5">
                            {option.description}
                        </span>
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
