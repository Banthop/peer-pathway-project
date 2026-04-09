import { STRIPE_SW_WATCH, STRIPE_SW_PREPARE, STRIPE_SW_CONVERT } from "@/data/springWeekData";
import { Check, CheckCircle2, Users, Shield, Sparkles, Crown, Mic2, ArrowRight } from "lucide-react";

interface SpringWeekPrepConversionProps {
  formData: {
    firstName: string;
    email: string;
    springWeekFirms: string;
    biggestConcern: string;
    industry: string;
  };
  onGetFreeDoc: () => void;
}

function buildStripeLink(base: string, email: string): string {
  try {
    const url = new URL(base);
    url.searchParams.set("prefilled_email", email);
    return url.toString();
  } catch {
    return "#";
  }
}

export function SpringWeekPrepConversion({
  formData,
  onGetFreeDoc,
}: SpringWeekPrepConversionProps) {
  const { firstName, email, springWeekFirms: firm } = formData;

  const watchLink = buildStripeLink(STRIPE_SW_WATCH, email);
  const prepareLink = buildStripeLink(STRIPE_SW_PREPARE, email);
  const convertLink = buildStripeLink(STRIPE_SW_CONVERT, email);

  const prepCallLine = firm
    ? `1x prep call with someone who converted at ${firm} (worth £50)`
    : "1x prep call with someone who converted at YOUR firm (worth £50)";

  return (
    <div className="mx-auto max-w-xl px-4 py-10 space-y-6 font-sans">
      {/* Section 1: Personalised Header */}
      <div className="text-center space-y-2 animate-fade-up">
        <h1 className="text-2xl font-light tracking-tight text-foreground">
          Here's your plan, {firstName}
        </h1>
        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mx-auto">
          {firm
            ? `Your spring week at ${firm} starts soon. The free checklist covers the basics. Here's how to go further.`
            : "Your spring week starts soon. The free checklist covers the basics. Here's how to go further."}
        </p>
      </div>

      {/* Section 2: You Already Have */}
      <div
        className="bg-emerald-50/60 border border-emerald-200 rounded-xl px-5 py-4 space-y-1.5 animate-fade-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold text-emerald-800">You already have</span>
        </div>
        <p className="text-sm font-light text-emerald-900 leading-relaxed pl-6">
          Spring Week Conversion Checklist - key takeaways, common mistakes, division-specific tips
        </p>
        <p className="text-xs text-emerald-600/70 pl-6">Delivering to your inbox now</p>
      </div>

      {/* Section 3: Tier Cards */}
      <div className="space-y-4">
        {/* Card 1: Watch - £19 */}
        <div
          className="bg-white border border-border rounded-2xl p-6 space-y-4 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Mic2 className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold text-foreground">Watch</h2>
              <span className="text-2xl font-bold text-foreground">£19</span>
            </div>
          </div>
          <p className="text-sm font-light text-muted-foreground">See how they did it, live</p>
          <ul className="space-y-2.5">
            {[
              "Live panel this Sunday, April 12, 7pm BST",
              "10+ speakers from Morgan Stanley, JP Morgan, Jane Street, and more",
              "Direct Q&A - ask about YOUR specific firm",
              "Full recording if you can't make it live",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm font-light text-foreground/80">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a href={watchLink} className="block pt-1">
            <button className="w-full border border-foreground text-foreground bg-transparent hover:bg-foreground/5 font-semibold text-sm rounded-xl px-5 py-3 transition-colors">
              Get Watch
              <ArrowRight className="inline ml-2 h-3.5 w-3.5" />
            </button>
          </a>
        </div>

        {/* Card 2: Prepare - £39 (RECOMMENDED) */}
        <div
          className="relative border-2 border-emerald-500 rounded-2xl p-6 space-y-4 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
            <Sparkles className="h-3 w-3" />
            RECOMMENDED
          </span>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold text-foreground">Prepare</h2>
              <span className="text-2xl font-bold text-foreground">£39</span>
            </div>
          </div>
          <p className="text-sm font-light text-muted-foreground">Know exactly what to expect at your firm</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Everything in Watch, plus:</p>
          <ul className="space-y-2.5">
            {[
              "Spring Week Handbook: 45+ firms broken down phase by phase",
              "Firm-specific intel: what the AC looks like, what questions they ask",
              "Know your firm's conversion rate before you walk in",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm font-light text-foreground/80">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a href={prepareLink} className="block pt-1">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl px-5 py-3 transition-colors">
              Get Prepare
              <ArrowRight className="inline ml-2 h-3.5 w-3.5" />
            </button>
          </a>
        </div>

        {/* Card 3: Convert - £79 (PREMIUM) */}
        <div
          className="relative bg-slate-900 text-white rounded-2xl p-6 space-y-4 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-slate-900">
            BEST VALUE
          </span>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Crown className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold text-white">Convert</h2>
              <span className="text-2xl font-bold text-white">£79</span>
            </div>
          </div>
          <p className="text-sm font-light text-slate-400">Walk in ready to get the offer</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Everything in Prepare, plus:</p>
          <ul className="space-y-2.5">
            {[
              prepCallLine,
              "They'll tell you what the week is actually like, what surprised them, and what got them the offer",
              "Priority booking for additional prep calls",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm font-light text-slate-200">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs font-light text-slate-400">
            Panel (£19) + Handbook (£39) + Prep Call (£50) = £108 value for £79
          </p>
          <a href={convertLink} className="block pt-1">
            <button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm rounded-xl px-5 py-3 transition-colors">
              Get Convert
              <ArrowRight className="inline ml-2 h-3.5 w-3.5" />
            </button>
          </a>
        </div>
      </div>

      {/* Section 4: Social Proof */}
      <div
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-light animate-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <Users className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Students from LSE, Warwick, UCL, Imperial, Bristol, Oxford & Cambridge</span>
      </div>

      {/* Section 5: Risk Reversal */}
      <div
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-light animate-fade-up"
        style={{ animationDelay: "0.28s" }}
      >
        <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span>Not what you expected? Full refund.</span>
      </div>

      {/* Section 6: Free Escape Hatch */}
      <div
        className="text-center animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={onGetFreeDoc}
          className="text-xs text-muted-foreground underline hover:text-foreground/60 transition-colors bg-transparent border-none cursor-pointer"
        >
          Just want the free checklist? Skip to portal
        </button>
      </div>
    </div>
  );
}
