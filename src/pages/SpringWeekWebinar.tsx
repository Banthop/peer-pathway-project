import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { SPRING_WEEK_COMBOS, STRIPE_SW_PREPARE, STRIPE_SW_CONVERT } from "@/data/springWeekData";
import type { NightComboKey } from "@/data/springWeekData";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { SpringWeekWelcome } from "@/components/spring-week/SpringWeekWelcome";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { SpringWeekIndustry } from "@/components/spring-week/SpringWeekIndustry";
import { SpringWeekNightPicker } from "@/components/spring-week/SpringWeekNightPicker";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import { matchFirmsToNights } from "@/data/springWeekData";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Lock,
  Zap,
  BookOpen,
  Check,
} from "lucide-react";

const BUNDLE_UPGRADE_LINK = SPRING_WEEK_COMBOS["1,2,3"].stripeLink;

function SuccessScreen({
  name,
  ticket,
}: {
  name: string;
  ticket: string;
}) {
  const tier = ticket === "prepare" || ticket === "1,2,3+handbook"
    ? "prepare"
    : ticket === "convert" || ticket === "premium"
    ? "convert"
    : "watch";

  const hasHandbook = tier === "prepare" || tier === "convert";
  const hasPrepCall = tier === "convert";
  const isWatch = tier === "watch";

  return (
    <div className="funnel-dark flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-white">
            You're all set{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-white/50 font-light text-sm leading-relaxed max-w-sm mx-auto">
            Check your email for your confirmation.
            We'll send you the Zoom link before Sunday April 12.
          </p>
        </div>

        {/* What you're getting */}
        <div className="funnel-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Here's what's coming your way
          </div>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" />
              <span className="text-sm font-light text-white/60">
                Live panel on Sunday April 12, 2-5pm BST (Zoom link by email)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" />
              <span className="text-sm font-light text-white/60">
                Full recording after the event
              </span>
            </div>
            {hasHandbook && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
                <span className="text-sm font-light text-white/60">
                  Spring Week Handbook (45+ firms) - being finalized by the speakers, landing in your inbox before April 12
                </span>
              </div>
            )}
            {hasPrepCall && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-violet-400" />
                <span className="text-sm font-light text-white/60">
                  1x free prep call with a converter at your firm - we'll email you to match you with the right speaker
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Free checklist for everyone */}
        <div className="funnel-card rounded-2xl p-5 space-y-3" style={{ borderColor: "rgba(52,211,153,0.15)" }}>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Free bonus: Spring Week Conversion Checklist</span>
          </div>
          <p className="text-sm font-light text-white/50">
            Your step-by-step checklist for before, during, and after your spring week.
          </p>
          <a
            href="/spring-week-conversion-checklist.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-colors no-underline"
          >
            Download Checklist (PDF)
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Upsell for Watch buyers */}
        {isWatch && (
          <div className="relative funnel-card rounded-2xl p-6 md:p-8 space-y-5" style={{ borderColor: "rgba(52,211,153,0.2)" }}>
            <div className="absolute -top-3 left-6">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-black text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full">
                <Zap className="h-3 w-3" />
                Upgrade
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl font-semibold text-white">
                Want the full picture?
              </h2>
              <p className="text-sm font-light text-white/60 leading-relaxed">
                Upgrade to <strong className="font-semibold text-white/80">Prepare</strong> for firm-specific intel on 45+ firms,
                or <strong className="font-semibold text-white/80">Convert</strong> for a 1-on-1 prep call with someone who converted at your firm.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={STRIPE_SW_PREPARE}
                target="_blank"
                rel="noopener noreferrer"
                className="funnel-cta no-underline"
              >
                Upgrade to Prepare - £39
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={STRIPE_SW_CONVERT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white/60 border border-white/10 hover:border-white/20 transition-colors no-underline"
              >
                Upgrade to Convert - £79
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        <div className="text-center">
          <a
            href="/"
            className="inline-block text-sm text-white/40 underline underline-offset-4 font-light hover:text-white/60 transition-colors"
          >
            Back to EarlyEdge
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---- Personalised transition screen between industry and checkout ---- */
function PreparingCheckout({
  firstName,
  springWeekFirms,
  industry,
}: {
  firstName: string;
  springWeekFirms: string;
  industry: string;
}) {
  const firmMatches = matchFirmsToNights(springWeekFirms);
  const [visibleLines, setVisibleLines] = useState(0);

  // Build personalised lines
  const lines: Array<{ text: string; done: boolean }> = [];
  if (firmMatches.length > 0) {
    const firstMatch = firmMatches[0];
    lines.push({
      text: `${firstMatch.firm} covered on ${firstMatch.nightLabel}`,
      done: false,
    });
  }
  if (industry) {
    lines.push({ text: `Matching ${industry} content`, done: false });
  }
  lines.push({ text: "Building your personalised recommendation", done: false });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 500 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-in fade-in duration-500 max-w-md">
        <Loader2 className="h-8 w-8 mx-auto text-emerald-400 animate-spin" />
        <div className="space-y-2">
          <h2 className="text-xl font-light text-white">
            Tailoring your options{firstName ? `, ${firstName}` : ""}...
          </h2>
        </div>
        <div className="space-y-3 text-left">
          {lines.map((line, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-2.5 text-sm transition-all duration-300",
                i < visibleLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-white/70 font-light">{line.text}</span>
            </div>
          ))}
        </div>
        {firmMatches.length > 0 && visibleLines >= lines.length && (
          <p className="text-xs text-emerald-400 font-medium animate-in fade-in duration-300 pt-2">
            We recommend the 3-night pass so you don't miss any relevant content.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SpringWeekWebinar() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Spring Week Conversion Webinar";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", "Learn how students at Goldman, Citi, Barclays and more converted their spring weeks into return offers. Live 2-part panel webinar with real spring weekers who did it.");
    setMeta("og:title", "Spring Week Conversion Webinar - EarlyEdge");
    setMeta("og:description", "Learn how students at Goldman, Citi, Barclays and more turned 1-2 week spring weeks into return offers. Live 2-part panel webinar.");
    setMeta("og:type", "website");
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Spring Week Conversion Webinar - EarlyEdge");
    setMeta("twitter:description", "Learn how students at Goldman, Citi, Barclays and more turned 1-2 week spring weeks into return offers. Live 2-part panel webinar.");

    return () => {
      document.title = prev;
    };
  }, []);

  const isSuccess = searchParams.get("success") === "true";

  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);

  if (isSuccess) {
    const saved = localStorage.getItem("spring_week_signup") || sessionStorage.getItem("spring_week_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const ticketParam = searchParams.get("ticket");
    const name = parsed?.firstName ?? "";
    const ticket = ticketParam || (parsed?.selectedTicket ?? "bundle");
    return <SuccessScreen name={name} ticket={ticket} />;
  }

  const handleContinue = (): string | null => {
    const currentStep = form.step;
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }

    // Save email + name to CRM immediately on step 1 transition
    if (currentStep === 1) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        phone: form.formData.phoneCode
          ? `+${form.formData.phoneCode}${form.formData.phone}`
          : form.formData.phone,
        source: "webinar",
        tags: ["spring_week_form_started"],
        metadata: { form_step: 1, product_type: "spring_week", webinar_type: "spring_week" },
      });
    }

    // Update CRM with university data on step 2 transition
    if (currentStep === 2) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: ["spring_week_form_started"],
        metadata: {
          form_step: 2,
          year_of_study: form.formData.yearOfStudy,
          product_type: "spring_week",
          webinar_type: "spring_week",
        },
      });
    }

    // Save lead and show transition on step 3 to 4
    if (currentStep === 3) {
      saveWebinarLead({
        ...form.formData,
      }, "spring_week");
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: ["spring_week_form_started", "spring_week_checkout_started"],
        metadata: {
          form_step: 4,
          industry: form.formData.industry,
          spring_week_firms: form.formData.springWeekFirms,
          biggest_concern: form.formData.biggestConcern,
          product_type: "spring_week",
          webinar_type: "spring_week",
        },
      });
      form.prevStep();
      setShowTransition(true);
      setTimeout(() => {
        form.nextStep();
        setTimeout(() => {
          setShowTransition(false);
        }, 400);
      }, 2500);
    }

    return null;
  };

  const handleCheckout = (comboKey: NightComboKey, stripeLink: string) => {
    form.updateField("selectedTicket", comboKey);

    const signupData = JSON.stringify({
      ...form.formData,
      selectedTicket: comboKey,
      productType: "spring_week",
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem("spring_week_signup", signupData);
    sessionStorage.setItem("spring_week_signup", signupData);

    markLeadCheckout(form.formData.email);

    const url = new URL(stripeLink);
    url.searchParams.set("prefilled_email", form.formData.email);
    url.searchParams.set("client_reference_id", `${form.formData.email}|${comboKey}`);

    window.open(url.toString(), "_blank");
  };

  if (showTransition) {
    return (
      <div className="funnel-dark relative">
        <div className="fixed top-0 left-0 right-0 z-40">
          <Progress
            value={form.progress}
            className="h-1 rounded-none bg-white/[0.06] [&>div]:bg-emerald-500"
          />
        </div>
        <div className="absolute top-5 left-6 z-50">
          <span className="text-sm font-light text-white/40">Early<span className="font-bold text-white/70">Edge</span></span>
        </div>
        <PreparingCheckout
          firstName={form.formData.firstName}
          springWeekFirms={form.formData.springWeekFirms}
          industry={form.formData.industry}
        />
      </div>
    );
  }

  return (
    <div className="funnel-dark relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress
          value={form.progress}
          className="h-1 rounded-none bg-white/[0.06] [&>div]:bg-emerald-500"
        />
      </div>

      {/* Logo */}
      <div className="absolute top-5 left-6 z-50">
        <span className="text-sm font-light text-white/40">Early<span className="font-bold text-white/70">Edge</span></span>
      </div>

      {/* Step counter */}
      {form.step > 0 && (
        <div className="absolute top-6 right-6 z-50">
          <span className="text-xs text-white/30 font-light">
            {form.step} of {form.totalSteps - 1}
          </span>
        </div>
      )}

      {/* Back button */}
      {form.step > 0 && (
        <button
          type="button"
          onClick={form.prevStep}
          className="absolute top-14 left-6 z-50 text-sm text-white/40 hover:text-white/70 transition-colors font-light flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Form steps */}
      <main className={`min-h-screen flex ${form.step === 0 ? 'items-start pt-28 md:pt-32' : 'items-center'} justify-center px-4 py-8`}>
        <div className={`w-full mx-auto ${form.step === 0 ? 'max-w-2xl' : 'max-w-xl'}`}>
          <WebinarFormStep isActive={form.step === 0} direction={form.direction}>
            <SpringWeekWelcome onContinue={handleContinue} />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 1} direction={form.direction}>
            <NameEmailStep
              firstName={form.formData.firstName}
              lastName={form.formData.lastName}
              email={form.formData.email}
              phoneCode={form.formData.phoneCode}
              phone={form.formData.phone}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 2} direction={form.direction}>
            <UniversityStep
              university={form.formData.university}
              yearOfStudy={form.formData.yearOfStudy}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 3} direction={form.direction}>
            <SpringWeekIndustry
              industry={form.formData.industry}
              industryDetail={form.formData.industryDetail}
              springWeekFirms={form.formData.springWeekFirms}
              biggestConcern={form.formData.biggestConcern}
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 4} direction={form.direction}>
            <SpringWeekNightPicker
              formData={form.formData}
              onCheckout={handleCheckout}
            />
          </WebinarFormStep>
        </div>
      </main>
    </div>
  );
}
