import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WebinarFormStep } from "@/components/webinar/WebinarFormStep";
import { PhoneInput } from "@/components/webinar/PhoneInput";
import { UniversityStep } from "@/components/webinar/UniversityStep";
import { IndustryStep } from "@/components/webinar/IndustryStep";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ArrowRight, Shield, Check, X } from "lucide-react";

const IS_WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Contains an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Contains a lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "Contains a number", test: (pw: string) => /\d/.test(pw) },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Form data ──
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  university: string;
  yearOfStudy: string;
  industry: string;
  industryDetail: string;
  referralSource: string;
}

// Steps: 0=Details+Password, 1=University, 2=Industry+Referral
const TOTAL_STEPS = 3;

function validateStep(step: number, data: SignupFormData): string | null {
  switch (step) {
    case 0: {
      if (!data.firstName.trim()) return "Please enter your first name.";
      if (!data.lastName.trim()) return "Please enter your last name.";
      if (!EMAIL_RE.test(data.email)) return "Please enter a valid email.";
      if (!PASSWORD_RULES.every((r) => r.test(data.password)))
        return "Password doesn't meet requirements.";
      if (data.password !== data.confirmPassword)
        return "Passwords don't match.";
      return null;
    }
    case 1:
      if (!data.university.trim()) return "Please enter your university.";
      if (!data.yearOfStudy) return "Please select your year of study.";
      return null;
    case 2:
      if (!data.industry) return "Please pick an industry.";
      if (!data.referralSource) return "Please select how you heard about us.";
      return null;
    default:
      return null;
  }
}

function useSignupForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "gb:+44",
    phone: "",
    password: "",
    confirmPassword: "",
    university: "",
    yearOfStudy: "",
    industry: "",
    industryDetail: "",
    referralSource: "",
  });

  const updateField = useCallback(
    <K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const nextStep = useCallback((): string | null => {
    const error = validateStep(step, formData);
    if (error) return error;
    if (step < TOTAL_STEPS - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    }
    return null;
  }, [step, formData]);

  const prevStep = useCallback(() => {
    if (step > 0) {
      setDirection("backward");
      setStep((s) => s - 1);
    }
  }, [step]);

  const progress = TOTAL_STEPS > 1 ? (step / (TOTAL_STEPS - 1)) * 100 : 0;

  return { step, totalSteps: TOTAL_STEPS, formData, updateField, nextStep, prevStep, progress, direction };
}

// ── Step 1: Details + Password ──
function DetailsStep({
  formData,
  onUpdate,
  onContinue,
}: {
  formData: SignupFormData;
  onUpdate: <K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => void;
  onContinue: () => string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const handleGoogle = async () => {
    const googleRedirect = redirectTo
      ? `${window.location.origin}${redirectTo}`
      : IS_WEBINAR_ONLY
      ? `${window.location.origin}/portal`
      : undefined;
    const { error } = await signInWithGoogle(googleRedirect);
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
    }
  };

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formData.password));
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Names row */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          This takes about 60 seconds
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            ref={inputRef}
            type="text"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            className="font-sans text-base h-12 border-border rounded-xl"
            autoComplete="given-name"
          />
          <Input
            type="text"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            className="font-sans text-base h-12 border-border rounded-xl"
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          className="font-sans text-base h-12 border-border rounded-xl"
          autoComplete="email"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <PhoneInput
          phoneCode={formData.phoneCode}
          phone={formData.phone}
          onCodeChange={(code) => onUpdate("phoneCode", code)}
          onPhoneChange={(val) => onUpdate("phone", val)}
        />
        <p className="text-xs text-muted-foreground font-sans font-light">
          Phone <span className="text-amber-600 font-medium">(optional)</span> - for reminders and last-minute updates only
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => onUpdate("password", e.target.value)}
          className="font-sans text-base h-12 border-border rounded-xl"
          autoComplete="new-password"
        />
        {formData.password.length > 0 && (
          <div className="pt-1 space-y-1">
            {PASSWORD_RULES.map((rule) => {
              const passed = rule.test(formData.password);
              return (
                <div key={rule.label} className="flex items-center gap-1.5">
                  {passed ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <X className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-sans ${passed ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => onUpdate("confirmPassword", e.target.value)}
          className="font-sans text-base h-12 border-border rounded-xl"
          autoComplete="new-password"
        />
        {formData.confirmPassword.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {passwordsMatch ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-sans text-emerald-600">Passwords match</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3 text-red-400" />
                <span className="text-xs font-sans text-red-500">Passwords don't match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Continue */}
      <div className="space-y-3">
        <Button
          type="submit"
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-8 py-3 text-sm rounded-xl w-full sm:w-auto"
          disabled={!allRulesPassed || !passwordsMatch}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-sans font-light">
          <Shield className="h-3.5 w-3.5" />
          Your data is private and never shared
        </p>
      </div>

      {/* Google OAuth divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 px-2 text-muted-foreground font-sans">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full font-sans font-light h-12 rounded-xl"
        onClick={handleGoogle}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="text-center">
        <p className="text-sm font-sans text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}

// ── Root Signup Page ──
const Signup = () => {
  const form = useSignupForm();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const destination = redirectTo || (IS_WEBINAR_ONLY ? "/portal" : "/dashboard");
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = (): string | null => {
    const error = form.nextStep();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }
    return null;
  };

  const handleFinalSubmit = async () => {
    // Validate last step
    const error = validateStep(form.step, form.formData);
    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const d = form.formData;
    const fullName = `${d.firstName} ${d.lastName}`.trim();

    const { error: signUpError } = await signUp(d.email, d.password, fullName, "student");
    if (signUpError) {
      setSubmitting(false);
      toast({ title: "Sign up failed", description: signUpError.message, variant: "destructive" });
      return;
    }

    // Save profiling data to user_metadata
    if (supabase) {
      try {
        const phoneStr = d.phoneCode && d.phone ? `+${d.phoneCode.split(":")[1]?.replace("+", "")}${d.phone}` : undefined;
        await supabase.auth.updateUser({
          data: {
            first_name: d.firstName,
            last_name: d.lastName,
            phone: phoneStr,
            university: d.university,
            year_of_study: d.yearOfStudy,
            target_industry: d.industry,
            industry_detail: d.industryDetail || undefined,
            referral_source: d.referralSource,
          },
        });
      } catch (_err) {
        // Non-fatal
      }
    }

    setSubmitting(false);
    navigate(destination);
  };

  // The IndustryStep's onContinue triggers the final submit instead of advancing
  const handleIndustryContinue = (): string | null => {
    const error = validateStep(form.step, form.formData);
    if (error) {
      toast({ title: error, variant: "destructive" });
      return error;
    }
    handleFinalSubmit();
    return null;
  };

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
            {form.step + 1} of {form.totalSteps}
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
            <DetailsStep
              formData={form.formData}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 1} direction={form.direction}>
            <UniversityStep
              university={form.formData.university}
              yearOfStudy={form.formData.yearOfStudy}
              onUpdate={form.updateField}
              onContinue={handleContinue}
            />
          </WebinarFormStep>

          <WebinarFormStep isActive={form.step === 2} direction={form.direction}>
            <IndustryStep
              industry={form.formData.industry}
              industryDetail={form.formData.industryDetail}
              referralSource={form.formData.referralSource}
              onUpdate={form.updateField}
              onContinue={handleIndustryContinue}
            />
          </WebinarFormStep>
        </div>
      </main>

      {/* Loading overlay for final submit */}
      {submitting && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 mx-auto border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-sans font-light">Creating your account...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
