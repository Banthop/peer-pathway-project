import { useState, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { useWebinarForm } from "@/hooks/useWebinarForm";
import { useToast } from "@/hooks/use-toast";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { DaWelcomeStep } from "@/components/webinar/DaWelcomeStep";
import { NameEmailStep } from "@/components/webinar/NameEmailStep";
import { DaSchoolStep } from "@/components/webinar/DaSchoolStep";
import { DaIndustryStep } from "@/components/webinar/DaIndustryStep";
import { saveWebinarLead, markLeadCheckout } from "@/utils/webinarTracking";
import { saveCrmContact } from "@/utils/crmTracking";
import { ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";

const PANELLISTS = [
  { name: "Sarah J.", firm: "Goldman Sachs", role: "Software Engineering DA", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "David K.", firm: "Google", role: "Data DA", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Priya M.", firm: "Rolls-Royce", role: "Engineering DA", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Tom H.", firm: "J.P. Morgan", role: "Finance DA", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Aisha R.", firm: "KPMG", role: "Audit DA", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
];

function DaSuccessScreen({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-start justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-light text-foreground">
            You're all set{name ? `, ${name}` : ""}!
          </h1>
          <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed max-w-sm mx-auto">
            Your free spot for the Degree Apprenticeship Masterclass has been secured. We've sent the details to your email.
          </p>
        </div>

        {/* Confirmation card */}
        <div className="bg-white border border-border rounded-2xl p-6 md:p-8 space-y-3 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center gap-2 text-sm font-sans font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Registration Confirmed
          </div>
          <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
            Please check your inbox immediately for the calendar invite link. Important updates prior to the event will also be sent there. Make sure to check spam just in case!
          </p>
        </div>

        {/* Panellists */}
        <div className="pt-6 border-t border-slate-200/60">
          <p className="text-xs uppercase tracking-widest text-emerald-800 font-sans font-semibold mb-6 text-center">
            You just secured access to:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PANELLISTS.slice(0, 4).map((panellist) => (
              <div key={panellist.name} className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform w-[130px]">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img src={panellist.image} alt={panellist.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-[13px] font-bold text-foreground font-sans leading-tight">{panellist.name}</h4>
                <p className="text-[9px] text-muted-foreground font-sans font-medium uppercase tracking-wide mt-1">{panellist.firm}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="inline-block text-sm text-muted-foreground underline underline-offset-4 font-sans font-light hover:text-foreground/70 transition-colors">
            Back to EarlyEdge
          </a>
        </div>
      </div>
    </div>
  );
}

function PreparingTicket({ firstName }: { firstName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-5 animate-in fade-in duration-500">
        <Loader2 className="h-8 w-8 mx-auto text-emerald-600 animate-spin" />
        <div className="space-y-2">
          <h2 className="text-xl font-sans font-light text-foreground">
            Securing your spot{firstName ? `, ${firstName}` : ""}...
          </h2>
          <p className="text-sm text-muted-foreground font-sans font-light">
            Generating your free ticket
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DaWebinar() {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Degree Apprenticeship Masterclass";
    return () => { document.title = prev; };
  }, []);

  const form = useWebinarForm();
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Show loading while auth check is in progress
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // STRICT ACCESS CONTROL: Only allow demo user
  if (!user || user.email?.toLowerCase() !== "demo@earlyedge.co.uk") {
    return <Navigate to="/dashboard" replace />;
  }

  // If completing the free process internally, or query param is set
  if (isSuccess || searchParams.get("success") === "true") {
    const saved = localStorage.getItem("webinar_signup");
    const parsed = saved ? JSON.parse(saved) : {};
    const name = parsed?.firstName ?? "";
    return <DaSuccessScreen name={name} />;
  }

  const handleContinue = (): string | null => {
    const currentStep = form.step;
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }

    if (currentStep === 1) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        phone: form.formData.phoneCode ? `+${form.formData.phoneCode}${form.formData.phone}` : form.formData.phone,
        source: "webinar",
        tags: ["form_started", "da_interest"],
        metadata: { form_step: 1, source_override: "da_webinar" },
      });
    }

    if (currentStep === 2) {
      saveCrmContact({
        email: form.formData.email,
        firstName: form.formData.firstName,
        lastName: form.formData.lastName,
        university: form.formData.university,
        source: "webinar",
        tags: ["form_started", "da_interest"],
        metadata: { form_step: 2, year_of_study: form.formData.yearOfStudy, source_override: "da_webinar" },
      });
    }

    if (currentStep === 3) {
      saveWebinarLead({ ...form.formData, selectedTicket: "webinar-only" });

      localStorage.setItem(
        "webinar_signup",
        JSON.stringify({
          ...form.formData,
          selectedTicket: "webinar-only",
          timestamp: new Date().toISOString(),
        }),
      );

      markLeadCheckout(form.formData.email);

      form.prevStep();
      setShowTransition(true);
      setTimeout(() => {
        setIsSuccess(true);
        setShowTransition(false);
      }, 1500);
    }

    return null;
  };

  if (showTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
        <div className="fixed top-0 left-0 right-0 z-40">
          <Progress value={100} className="h-1.5 rounded-none bg-secondary [&>div]:bg-emerald-600" />
        </div>
        <div className="absolute top-5 left-6 z-50">
          <Logo to="#" className="text-xl pointer-events-none" />
        </div>
        <PreparingTicket firstName={form.formData.firstName} />
      </div>
    );
  }

  const daProgress = (form.step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      <div className="fixed top-0 left-0 right-0 z-40">
        <Progress value={daProgress} className="h-1.5 rounded-none bg-secondary [&>div]:bg-emerald-600" />
      </div>

      <div className="absolute top-5 left-6 z-50">
        <Logo to="#" className="text-xl pointer-events-none" />
      </div>

      {form.step > 0 && (
        <div className="absolute top-6 right-6 z-50">
          <span className="text-xs text-muted-foreground font-sans font-light">
            {form.step} of 3
          </span>
        </div>
      )}

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

      <main className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-xl mx-auto">
          <WebinarFormStep isActive={form.step === 0} direction={form.direction}>
            <DaWelcomeStep onContinue={handleContinue} />
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
            <DaSchoolStep
              school={form.formData.university}
              yearOfStudy={form.formData.yearOfStudy}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 3} direction={form.direction}>
            <DaIndustryStep
              industry={form.formData.industry}
              industryDetail={form.formData.industryDetail}
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>
        </div>
      </main>
    </div>
  );
}
