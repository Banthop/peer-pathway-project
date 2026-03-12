import { useState } from "react";
import { X, Clock } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * A thin, animated urgency banner that sits at the very top of the landing page.
 * Changes message based on the current month to match seasonal demand.
 */
const SeasonalBanner = () => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    // Seasonal messaging based on current month
    const month = new Date().getMonth(); // 0-indexed

    let message: string;
    let cta: string;

    if (month >= 1 && month <= 3) {
        // Feb–Apr: Spring week + vac scheme deadlines
        message = "Spring Week & Vac Scheme deadlines are closing fast";
        cta = "Get prepped now";
    } else if (month >= 4 && month <= 6) {
        // May–Jul: Summer internship conversion, UCAT prep begins
        message = "UCAT season is here — top scorers started prepping now";
        cta = "Find a UCAT coach";
    } else if (month >= 7 && month <= 9) {
        // Aug–Oct: UCAS, grad scheme apps, autumn recruitment
        message = "Graduate scheme deadlines are approaching — don't miss out";
        cta = "Start preparing";
    } else {
        // Nov–Jan: Internship apps, January exams, assessment centres
        message = "Assessment centre invites are going out — are you ready?";
        cta = "Book a coach";
    }

    return (
        <div className="bg-foreground text-background">
            <div className="container mx-auto px-4 flex items-center justify-center gap-3 py-2.5 text-center relative">
                <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                <p className="text-xs font-medium tracking-wide">
                    {message}
                    <span className="mx-2 opacity-30">·</span>
                    <Link
                        to="/browse"
                        className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                        {cta} →
                    </Link>
                </p>
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Dismiss"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default SeasonalBanner;
