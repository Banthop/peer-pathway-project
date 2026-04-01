import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { SPRING_WEEK_TICKETS } from "@/data/springWeekData";
import type { SpringWeekTicketId } from "@/data/springWeekData";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { SpringWeekWelcome } from "@/components/spring-week/SpringWeekWelcome";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { SpringWeekIndustry } from "@/components/spring-week/SpringWeekIndustry";
import { SpringWeekTickets } from "@/components/spring-week/SpringWeekTickets";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import {
  ChevronLeft,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Lock,
  Zap,
  BookOpen,
} from "lucide-react";

const BUNDLE_UPGRADE_LINK = SPRING_WEEK_TICKETS.bundle.stripeLink;

function SuccessScreen({
  name,
  ticket,
}: {
  name: string;
  ticket: string;
}) {
  const isSinglePart = ticket === "part1" || ticket === "part2";
  const partLabel = ticket === "part1" ? "Part 1" : ticket === "part2" ? "Part 2" : "";
  const [showBundleDetails, setShowBundleDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-light text-foreground">
            You're all set{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed max-w-sm mx-auto">
            Check your email for your ticket confirmation.
            We'll send you the live session details closer to the date.
          </p>
        </div>

        {/* Confirmation card */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-sans font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your spot is secured
          </div>
          <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
            {isSinglePart
              ? `You have access to ${partLabel} of the Spring Week Conversion Panel. Live dates will be confirmed via email.`
              : ticket === "premium"
                ? "You have Premium access: both panel sessions, The Spring Week Playbook, and a 1-on-1 coaching session. We'll be in touch to schedule your coaching."
                : "You have the Bundle: both panel sessions and The Spring Week Playbook. Everything will be sent to your inbox."}
          </p>
        </div>

        {isSinglePart ? (
          <>
            {/* UPSELL: single part buyers to bundle */}
            <div className="relative bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/40 border-2 border-emerald-600/40 rounded-2xl p-6 md:p-8 space-y-5 shadow-lg">
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full shadow-sm">
                  <Zap className="h-3 w-3" />
                  Upgrade Offer
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-xl font-sans font-semibold text-foreground">
                  Don't miss the other half of the story
                </h2>
                <p className="text-sm font-sans font-light text-foreground/80 leading-relaxed">
                  Each part covers <strong>different firms and different speakers</strong>.
                  The Bundle gives you both parts plus The Spring Week Playbook - the insider
                  guide with write-ups from real spring weekers at top firms.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBundleDetails(!showBundleDetails)}
                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-emerald-700 uppercase tracking-wider hover:text-emerald-800 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                What's in the Bundle
                {showBundleDetails ? (
                  <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5 -rotate-90" />
                )}
              </button>

              {showBundleDetails && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    "Both Part 1 and Part 2 live panel sessions",
                    "Recordings of both sessions",
                    "The Spring Week Playbook - insider write-ups from real spring weekers",
                    "Firm-by-firm breakdown of what to expect",
                    "How to convert your spring week into a return offer",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                      <span className="text-sm font-sans font-light text-foreground/80 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <a
                href={BUNDLE_UPGRADE_LINK}
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold text-base rounded-xl py-4 px-6 transition-all shadow-md hover:shadow-lg"
              >
                Upgrade to Bundle for £29
                <ArrowRight className="h-4 w-4" />
              </a>

              <p className="text-center text-[11px] text-muted-foreground font-sans font-light flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secure checkout via Stripe
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Bundle/Premium buyer confirmation */}
            <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-sans font-semibold text-foreground">
                  {ticket === "premium"
                    ? "Your Premium package is confirmed"
                    : "The Spring Week Playbook is on its way"}
                </h2>
              </div>
              <p className="text-sm font-sans font-light text-foreground/80 leading-relaxed">
                {ticket === "premium"
                  ? "You'll receive The Spring Week Playbook in your inbox shortly. We'll also reach out to schedule your 1-on-1 coaching session with one of our panellists."
                  : "You'll receive The Spring Week Playbook in your inbox shortly. Use it to prepare before the live sessions."}
              </p>
            </div>
          </>
        )}

        <div className="text-center">
          <a
            href="/"
            className="inline-block text-sm text-muted-foreground underline underline-offset-4 font-sans font-light hover:text-foreground/70 transition-colors"
          >
            Back to EarlyEdge
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---- Transition screen between industry and checkout ---- */
function PreparingCheckout({ firstName }: { firstName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-5 animate-in fade-in duration-500">
        <Loader2 className="h-8 w-8 mx-auto text-emerald-600 animate-spin" />
        <div className="space-y-2">
          <h2 className="text-xl font-sans font-light text-foreground">
            Preparing your options{firstName ? `, ${firstName}` : ""}...
          </h2>
          <p className="text-sm text-muted-foreground font-sans font-light">
            Finding the best deal for you
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SpringWeekWebinar() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Spring Week Conversion Webinar";
    return () => {
      document.title = prev;
    };
  }, []);

  const isSuccess = searchParams.get("success") === "true";

  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);

  if (isSuccess) {
    const saved = localStorage.getItem("spring_week_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const name = parsed?.firstName ?? "";
    const ticket = parsed?.selectedTicket ?? "bundle";
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
      form.prevStep();
      setShowTransition(true);
      setTimeout(() => {
        form.nextStep();
        setTimeout(() => {
          setShowTransition(false);
        }, 400);
      }, 1000);
    }

    return null;
  };

  const handleCheckout = () => {
    const ticketId = form.formData.selectedTicket as SpringWeekTicketId;
    const ticket =
      ticketId in SPRING_WEEK_TICKETS
        ? SPRING_WEEK_TICKETS[ticketId]
        : SPRING_WEEK_TICKETS.bundle;

    localStorage.setItem(
      "spring_week_signup",
      JSON.stringify({
        ...form.formData,
        productType: "spring_week",
        timestamp: new Date().toISOString(),
      }),
    );

    markLeadCheckout(form.formData.email);

    const url = new URL(ticket.stripeLink);
    url.searchParams.set("prefilled_email", form.formData.email);
    url.searchParams.set("client_reference_id", form.formData.email);

    window.open(url.toString(), "_blank");
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
        <PreparingCheckout firstName={form.formData.firstName} />
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
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 4} direction={form.direction}>
            <SpringWeekTickets
              selectedTicket={form.formData.selectedTicket as SpringWeekTicketId}
              onSelect={(id) => form.updateField("selectedTicket", id)}
              onCheckout={handleCheckout}
              formData={form.formData}
            />
          </WebinarFormStep>
        </div>
      </main>
    </div>
  );
}
