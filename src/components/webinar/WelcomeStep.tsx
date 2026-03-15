import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  WEBINAR_TITLE,
  WEBINAR_SUBTITLE,
  WEBINAR_DATE,
  WEBINAR_TIME,
  WEBINAR_DURATION,
  SPOTS_TOTAL,
  SPOTS_TAKEN,
} from "@/data/webinarData";
import { ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  const spotsLeft = SPOTS_TOTAL - SPOTS_TAKEN;
  const fillPercent = (SPOTS_TAKEN / SPOTS_TOTAL) * 100;

  return (
    <div className="flex flex-col items-center text-center space-y-8">
      {/* Tiny label */}
      <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground font-sans">
        Live Webinar
      </span>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-sans font-light text-foreground leading-tight max-w-lg">
        {WEBINAR_TITLE}
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-muted-foreground font-sans font-light max-w-md leading-relaxed">
        {WEBINAR_SUBTITLE}
      </p>

      {/* Metadata pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground font-sans">
        <span className="border border-border rounded-full px-3 py-1">
          {WEBINAR_DATE}
        </span>
        <span className="border border-border rounded-full px-3 py-1">
          {WEBINAR_TIME}
        </span>
        <span className="border border-border rounded-full px-3 py-1">
          {WEBINAR_DURATION}
        </span>
      </div>

      {/* Scarcity bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground font-sans">
          <span>
            {SPOTS_TAKEN} students signed up
          </span>
          <span>
            {spotsLeft} spots left
          </span>
        </div>
        <Progress value={fillPercent} className="h-1.5 rounded-full" />
      </div>

      {/* CTA */}
      <Button
        onClick={onContinue}
        className="bg-foreground text-background hover:bg-foreground/90 font-sans font-light px-8 py-3 text-sm rounded-lg"
      >
        Register Now
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {/* Low-friction reassurance */}
      <span className="text-[11px] text-muted-foreground font-sans font-light">
        Takes 30 seconds
      </span>
    </div>
  );
}
