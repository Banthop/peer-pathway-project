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
import { ReferralStep } from "@/components/webinar/ReferralStep";
import { TicketStep } from "@/components/webinar/TicketStep";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

function SuccessScreen({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600" />
        <h1 className="text-3xl font-sans font-light text-foreground">
          You're in{name ? `, ${name}` : ""}!
        </h1>
        <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed">
          Check your email for the confirmation and calendar invite. We'll send
          a reminder 24 hours before the webinar.
        </p>
        <a
          href="/"
          className="inline-block text-sm text-foreground underline underline-offset-4 font-sans font-light hover:text-foreground/70 transition-colors"
        >
          Back to EarlyEdge
        </a>
      </div>
    </div>
  );
}

export default function Webinar() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const form = useWebinarForm();
  const { toast } = useToast();

  // If returning from Stripe checkout
  if (isSuccess) {
    const saved = localStorage.getItem("webinar_signup");
    const name = saved ? JSON.parse(saved)?.firstName ?? "" : "";
    return <SuccessScreen name={name} />;
  }

  const handleContinue = (): string | null => {
    const currentStep = form.step;
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
    } else if (currentStep === 4) {
      // User just passed the referral step - save lead to Supabase
      saveWebinarLead(form.formData);
    }
    return error;
  };

  const handleCheckout = () => {
    const ticket =
      form.formData.selectedTicket === "bundle"
        ? TICKETS.bundle
        : TICKETS.webinarOnly;

    // Persist form data
    localStorage.setItem(
      "webinar_signup",
      JSON.stringify({
        ...form.formData,
        timestamp: new Date().toISOString(),
      }),
    );

    // Mark lead as proceeding to checkout
    markLeadCheckout(form.formData.email);

    // Build Stripe Payment Link URL with prefilled email
    const url = new URL(ticket.stripeLink);
    url.searchParams.set("prefilled_email", form.formData.email);
    url.searchParams.set("client_reference_id", form.formData.email);

    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress
          value={form.progress}
          className="h-1 rounded-none bg-secondary"
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
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 4} direction={form.direction}>
            <ReferralStep
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 5} direction={form.direction}>
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
