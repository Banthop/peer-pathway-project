import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { SpringWeekPrepWelcome } from "@/components/spring-week/SpringWeekPrepWelcome";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { SpringWeekIndustry } from "@/components/spring-week/SpringWeekIndustry";
import { SpringWeekPrepConversion } from "@/components/spring-week/SpringWeekPrepConversion";
import { saveWebinarLead } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import { matchFirmsToNights } from "@/data/springWeekData";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";

/* ---- Success screen shown after free doc request ---- */
function PrepSuccessScreen({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-light text-foreground">
            You're all set{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed max-w-sm mx-auto">
            Your free Spring Week Conversion Notes are on their way to your inbox.
            Check your email in the next few minutes.
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-sans font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your notes are being prepared
          </div>
          <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
            We will send your free conversion notes to the email you provided.
            In the meantime, explore the Spring Week Portal for more resources.
          </p>
        </div>

        <div className="text-center space-y-3">
          <a
            href="/spring-week-portal"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold text-sm rounded-xl py-3 px-6 transition-all shadow-md hover:shadow-lg"
          >
            Go to the Spring Week Portal
          </a>
          <div>
            <a
              href="/"
              className="inline-block text-sm text-muted-foreground underline underline-offset-4 font-sans font-light hover:text-foreground/70 transition-colors"
            >
              Back to EarlyEdge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Personalised transition screen between industry and conversion ---- */
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
        <Loader2 className="h-8 w-8 mx-auto text-emerald-600 animate-spin" />
        <div className="space-y-2">
          <h2 className="text-xl font-sans font-light text-foreground">
            Tailoring your options{firstName ? `, ${firstName}` : ""}...
          </h2>
        </div>
        <div className="space-y-3 text-left">
          {lines.map((line, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-2.5 text-sm font-sans transition-all duration-300",
                i < visibleLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
            >
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-foreground/80 font-light">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpringWeekPrep() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Spring Week Conversion Notes (Free)";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", "Free spring week conversion notes from students who turned their spring weeks into return offers at Goldman, Citi, Barclays and more.");
    setMeta("og:title", "Spring Week Conversion Notes (Free) - EarlyEdge");
    setMeta("og:description", "Free notes from students who converted their spring weeks into return offers at top banks and consulting firms.");
    setMeta("og:type", "website");
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Spring Week Conversion Notes (Free) - EarlyEdge");
    setMeta("twitter:description", "Free notes from students who converted their spring weeks into return offers at top banks and consulting firms.");

    return () => {
      document.title = prev;
    };
  }, []);

  const isSuccess = searchParams.get("success") === "true";

  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);

  if (isSuccess) {
    const saved = localStorage.getItem("spring_week_prep_signup") || sessionStorage.getItem("spring_week_prep_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const name = parsed?.firstName ?? "";
    return <PrepSuccessScreen name={name} />;
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
        tags: ["spring_week_prep_form_started"],
        metadata: { form_step: 1, product_type: "spring_week_prep", webinar_type: "spring_week" },
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
        tags: ["spring_week_prep_form_started"],
        metadata: {
          form_step: 2,
          year_of_study: form.formData.yearOfStudy,
          product_type: "spring_week_prep",
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
        tags: ["spring_week_prep_form_started", "spring_week_prep_checkout"],
        metadata: {
          form_step: 4,
          industry: form.formData.industry,
          spring_week_firms: form.formData.springWeekFirms,
          biggest_concern: form.formData.biggestConcern,
          product_type: "spring_week_prep",
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

  const handleGetFreeDoc = () => {
    // Save to CRM with free doc tag
    saveCrmContact({
      email: form.formData.email,
      firstName: form.formData.firstName,
      lastName: form.formData.lastName,
      university: form.formData.university,
      source: "webinar",
      tags: ["spring_week_prep_form_started", "spring_week_prep_checkout", "spring_week_free_doc_requested"],
      metadata: {
        product_type: "spring_week_prep",
        webinar_type: "spring_week",
        industry: form.formData.industry,
        spring_week_firms: form.formData.springWeekFirms,
        biggest_concern: form.formData.biggestConcern,
      },
    });

    // Persist signup data for success screen
    const signupData = JSON.stringify({
      ...form.formData,
      productType: "spring_week_prep",
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("spring_week_prep_signup", signupData);
    sessionStorage.setItem("spring_week_prep_signup", signupData);

    // Navigate to the portal
    navigate("/spring-week-portal");
  };

  if (showTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
        <div className="fixed top-0 left-0 right-0 z-40">
          <Progress
            value={form.progress}
            className="h-1.5 rounded-none bg-secondary [&>div]:bg-emerald-600"
          />
        </div>
        <div className="absolute top-5 left-6 z-50">
          <Logo to="#" className="text-xl pointer-events-none" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress
          value={form.progress}
          className="h-1.5 rounded-none bg-secondary [&>div]:bg-emerald-600"
        />
      </div>

      {/* Logo */}
      <div className="absolute top-5 left-6 z-50">
        <Logo to="#" className="text-xl pointer-events-none" />
      </div>

      {/* Step counter */}
      {form.step > 0 && (
        <div className="absolute top-6 right-6 z-50">
          <span className="text-xs text-muted-foreground font-sans font-light">
            {form.step} of {form.totalSteps - 1}
          </span>
        </div>
      )}

      {/* Back button */}
      {form.step > 0 && (
        <button
          type="button"
          onClick={form.prevStep}
          className="absolute top-14 left-6 z-50 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans font-light flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Form steps */}
      <main className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-xl mx-auto">
          <WebinarFormStep isActive={form.step === 0} direction={form.direction}>
            <SpringWeekPrepWelcome onContinue={handleContinue} />
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
            <SpringWeekPrepConversion
              formData={form.formData}
              onGetFreeDoc={handleGetFreeDoc}
            />
          </WebinarFormStep>
        </div>
      </main>
    </div>
  );
}
