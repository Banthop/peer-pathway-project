import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { TICKETS } from "@/data/webinarData";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { WelcomeStep } from "@/components/webinar/WelcomeStep";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { IndustryStep } from "@/components/webinar/IndustryStep";
import { TicketStep } from "@/components/webinar/TicketStep";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import { ChevronLeft, CheckCircle2, Loader2, Zap, BookOpen, ArrowRight, Lock } from "lucide-react";

const GUIDE_UPGRADE_LINK = "https://buy.stripe.com/3cI14m1Uw11n4mC4WE2400c";

function SuccessScreen({ name, ticket }: { name: string; ticket: string }) {
  const isWebinarOnly = ticket !== "bundle";
  const [showGuideDetails, setShowGuideDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-light text-foreground">
            You're in{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed max-w-sm mx-auto">
            Check your email for your Zoom link and confirmation details.
            We'll send a reminder before we go live.
          </p>
        </div>

        {/* Webinar details card */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-sans font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your webinar details
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-sans">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Date</p>
              <p className="font-medium text-foreground">Saturday 28th March</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Time</p>
              <p className="font-medium text-foreground">7:00 PM GMT</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-sans font-light">
            Zoom link sent to your email. Recording included if you can't make it live.
          </p>
        </div>

        {isWebinarOnly ? (
          <>
            {/* ── UPSELL CARD for webinar-only buyers ── */}
            <div className="relative bg-gradient-to-br from-blue-50/60 via-white to-emerald-50/40 border-2 border-emerald-600/40 rounded-2xl p-6 md:p-8 space-y-5 shadow-lg">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full shadow-sm">
                  <Zap className="h-3 w-3" />
                  Limited-Time Offer
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-xl font-sans font-semibold text-foreground">
                  Want the exact templates before Saturday?
                </h2>
                <p className="text-sm font-sans font-light text-foreground/80 leading-relaxed">
                  Most students who attend the webinar <strong>without</strong> the guide don't
                  know what to do next. The ones who have it? They come to the live session
                  already prepared, ask better questions, and start sending emails the same night.
                </p>
              </div>

              {/* What's in the guide */}
              <button
                type="button"
                onClick={() => setShowGuideDetails(!showGuideDetails)}
                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-emerald-700 uppercase tracking-wider hover:text-emerald-800 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                What's inside the guide
                {showGuideDetails ? (
                  <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5 -rotate-90" />
                )}
              </button>

              {showGuideDetails && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    "Copy-paste email templates for any industry",
                    "200+ firms actively hiring, with decision-maker contacts",
                    "The 9:03 AM Rule and proven send-time strategy",
                    "Step-by-step Mail Merge setup (no spam filters)",
                    "Follow-up sequences that get replies",
                    "Ready-to-use tracking spreadsheet",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                      <span className="text-sm font-sans font-light text-foreground/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Proof snippet */}
              <div className="flex items-center gap-3 bg-white/70 rounded-xl border border-slate-200 p-3">
                <img
                  src="/email-proof.png"
                  alt="Real offer email"
                  className="w-16 h-16 rounded-lg object-cover object-top border border-slate-200"
                />
                <div>
                  <p className="text-xs font-sans font-semibold text-foreground">
                    "This guide helped me land my summer in PE."
                  </p>
                  <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
                    Birkaran P, LSE
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href={GUIDE_UPGRADE_LINK}
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold text-base rounded-xl py-4 px-6 transition-all shadow-md hover:shadow-lg"
              >
                Get the Guide for £12
                <ArrowRight className="h-4 w-4" />
              </a>

              <p className="text-center text-[11px] text-muted-foreground font-sans font-light flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secure checkout via Stripe. Instant access.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ── BUNDLE BUYER: Guide access card ── */}
            <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-sans font-semibold text-foreground">
                  Your Cold Email Guide is ready
                </h2>
              </div>
              <p className="text-sm font-sans font-light text-foreground/80 leading-relaxed">
                Read through it before Saturday so you can follow along perfectly during the live session.
                The guide link has been sent to your email.
              </p>
              <a
                href="/resources/cold-email-guide"
                className="flex items-center justify-center gap-2 w-full bg-foreground hover:bg-foreground/90 text-background font-sans font-medium text-sm rounded-xl py-3 px-6 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Open the Guide
              </a>
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

export default function Webinar() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Cold-Emailing Webinar";
    return () => { document.title = prev; };
  }, []);
  const isSuccess = searchParams.get("success") === "true";

  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);

  if (isSuccess) {
    const saved = localStorage.getItem("webinar_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const name = parsed?.firstName ?? "";
    const ticket = parsed?.selectedTicket ?? "webinar-only";
    return <SuccessScreen name={name} ticket={ticket} />;
  }

  const handleContinue = (): string | null => {
    const currentStep = form.step;
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }

    // If transitioning from details (step 1) to university (step 2),
    // save email + name to CRM immediately so we capture abandoners
    if (currentStep === 1) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        phone: form.formData.phoneCode ? `+${form.formData.phoneCode}${form.formData.phone}` : form.formData.phone,
        source: "webinar",
        tags: ["form_started"],
        metadata: { form_step: 1 },
      });
    }

    // If transitioning from university (step 2) to industry (step 3),
    // update CRM with university data
    if (currentStep === 2) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: ["form_started"],
        metadata: { form_step: 2, year_of_study: form.formData.yearOfStudy },
      });
    }

    // If transitioning from industry (step 3) to checkout (step 4),
    // show a brief loading screen to make it feel more considered
    if (currentStep === 3) {
      saveWebinarLead(form.formData);
      // Go back one step to hold position, show transition, then advance
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
    const ticket =
      form.formData.selectedTicket === "bundle"
        ? TICKETS.bundle
        : TICKETS.webinarOnly;

    localStorage.setItem(
      "webinar_signup",
      JSON.stringify({
        ...form.formData,
        timestamp: new Date().toISOString(),
      }),
    );

    markLeadCheckout(form.formData.email);

    const url = new URL(ticket.stripeLink);
    url.searchParams.set("prefilled_email", form.formData.email);
    url.searchParams.set("client_reference_id", form.formData.email);

    window.location.href = url.toString();
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
            <WelcomeStep onContinue={handleContinue} />
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
            <IndustryStep
              industry={form.formData.industry}
              industryDetail={form.formData.industryDetail}
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 4} direction={form.direction}>
            <TicketStep
              selectedTicket={form.formData.selectedTicket}
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
