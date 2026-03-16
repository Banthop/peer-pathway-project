import { Button } from "@/components/ui/button";
import { REFERRAL_OPTIONS } from "@/data/webinarData";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ReferralStepProps {
    referralSource: string;
    onUpdate: (field: "referralSource", value: string) => void;
    onContinue: () => string | null;
}

export function ReferralStep({
    referralSource,
    onUpdate,
    onContinue,
}: ReferralStepProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
                    How did you hear about us?
                </h2>
                <p className="text-sm text-muted-foreground font-sans font-light">
                    This helps us reach more students like you
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {REFERRAL_OPTIONS.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onUpdate("referralSource", option)}
                        className={cn(
                            "px-5 py-2.5 text-sm rounded-full border font-sans font-light transition-all duration-200",
                            referralSource === option
                                ? "bg-foreground text-background border-foreground shadow-sm"
                                : "bg-background text-foreground border-border hover:border-foreground/40",
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <Button
                type="submit"
                className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-3 text-sm rounded-xl w-full sm:w-auto"
            >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </form>
    );
}
