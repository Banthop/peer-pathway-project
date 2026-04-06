import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Contains an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Contains a lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "Contains a number", test: (pw: string) => /\d/.test(pw) },
];

const IS_WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

// UK universities for the dropdown
const UK_UNIVERSITIES = [
  "University of Bath",
  "University of Birmingham",
  "University of Bristol",
  "University of Cambridge",
  "Durham University",
  "University of Edinburgh",
  "University of Exeter",
  "Imperial College London",
  "King's College London",
  "London School of Economics",
  "University of Manchester",
  "University of Nottingham",
  "University of Oxford",
  "University of St Andrews",
  "University College London",
  "University of Warwick",
  "Other",
];

const YEARS_OF_STUDY = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Masters",
  "Graduate",
  "Other",
];

const INDUSTRIES = [
  "Investment Banking",
  "Consulting",
  "Asset Management",
  "Private Equity",
  "Trading / Quant",
  "Big 4",
  "Tech",
  "Law",
  "Not Sure Yet",
];

const COLD_EMAIL_EXPERIENCE = [
  "Haven't started yet",
  "Sent a few but no replies",
  "Getting some replies",
  "Already landed interviews / offers",
];

const REFERRAL_SOURCES = [
  "LinkedIn",
  "WhatsApp group",
  "Friend / word of mouth",
  "Instagram",
  "Other",
];

// Reusable pill toggle button
function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm font-sans px-3.5 py-2 rounded-full border transition-all cursor-pointer select-none ${
        selected
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground border-border hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

// Progress bar shown across all 3 steps
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-sans text-muted-foreground">
          Step {step} of 3
        </span>
        <span className="text-xs font-sans text-muted-foreground">
          {step === 1 ? "Account" : step === 2 ? "About you" : "Where you're at"}
        </span>
      </div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Step 1: account basics
function StepAccount({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (!allRulesPassed) {
      toast({
        title: "Password doesn't meet requirements",
        description: "Check the requirements below the password field.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name, "student");
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      onSuccess();
    }
  };

  const handleGoogle = async () => {
    // Google OAuth goes straight to the portal - skip profiling steps
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

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-sans font-light text-foreground">Create your account</h1>
        {redirectTo === "/portal" && (
          <p className="text-sm font-sans text-muted-foreground mt-2">
            Free access to cold email resources, webinar slides, and more.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-sans font-light">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-sans"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-sans font-light">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-sans"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-sans font-light">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="font-sans"
            disabled={loading}
          />
          {password.length > 0 && (
            <div className="pt-1 space-y-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <div key={rule.label} className="flex items-center gap-1.5">
                    {passed ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <X className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-sans ${
                        passed ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-sans font-light">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="font-sans"
            disabled={loading}
          />
          {confirmPassword.length > 0 && (
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

        <Button
          type="submit"
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
          disabled={loading || !allRulesPassed || !passwordsMatch}
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </form>

      {/* Google OAuth */}
      <div className="mt-4">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-sans">or</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full font-sans font-light"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-sans text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}

// Step 2: about you
function StepAboutYou({
  onNext,
  onSkip,
}: {
  onNext: (data: { university: string; otherUniversity: string; yearOfStudy: string; industries: string[] }) => void;
  onSkip: () => void;
}) {
  const [university, setUniversity] = useState("");
  const [otherUniversity, setOtherUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);

  const toggleIndustry = (industry: string) => {
    setIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const canContinue = university !== "" && yearOfStudy !== "" && industries.length > 0;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-sans font-light text-foreground">Tell us about yourself</h2>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          Helps us personalise your experience. Takes 30 seconds.
        </p>
      </div>

      <div className="space-y-6">
        {/* University */}
        <div className="space-y-2">
          <Label className="font-sans font-light">Which university are you at?</Label>
          <select
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              if (e.target.value !== "Other") setOtherUniversity("");
            }}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-sans ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>Select your university</option>
            {UK_UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>
          {university === "Other" && (
            <Input
              placeholder="Enter your university"
              value={otherUniversity}
              onChange={(e) => setOtherUniversity(e.target.value)}
              className="font-sans mt-2"
            />
          )}
        </div>

        {/* Year of study */}
        <div className="space-y-2">
          <Label className="font-sans font-light">Year of study</Label>
          <div className="flex flex-wrap gap-2">
            {YEARS_OF_STUDY.map((year) => (
              <Pill
                key={year}
                label={year}
                selected={yearOfStudy === year}
                onClick={() => setYearOfStudy(year)}
              />
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="space-y-2">
          <Label className="font-sans font-light">What industry are you targeting?</Label>
          <p className="text-xs font-sans text-muted-foreground">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => (
              <Pill
                key={industry}
                label={industry}
                selected={industries.includes(industry)}
                onClick={() => toggleIndustry(industry)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
          disabled={!canContinue}
          onClick={() => onNext({ university, otherUniversity, yearOfStudy, industries })}
        >
          Continue
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}

// Step 3: where you're at
function StepWhereYouAreAt({
  onFinish,
  onSkip,
}: {
  onFinish: (data: { coldEmailExperience: string; referralSource: string }) => void;
  onSkip: () => void;
}) {
  const [coldEmailExperience, setColdEmailExperience] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const canFinish = coldEmailExperience !== "" && referralSource !== "";

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-sans font-light text-foreground">Last step</h2>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          Two quick questions so we can help you better.
        </p>
      </div>

      <div className="space-y-6">
        {/* Cold emailing experience */}
        <div className="space-y-2">
          <Label className="font-sans font-light">Where are you with cold emailing?</Label>
          <div className="flex flex-col gap-2">
            {COLD_EMAIL_EXPERIENCE.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColdEmailExperience(option)}
                className={`text-left text-sm font-sans px-4 py-3 rounded-xl border transition-all ${
                  coldEmailExperience === option
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground/40"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Referral source */}
        <div className="space-y-2">
          <Label className="font-sans font-light">How did you hear about us?</Label>
          <div className="flex flex-wrap gap-2">
            {REFERRAL_SOURCES.map((source) => (
              <Pill
                key={source}
                label={source}
                selected={referralSource === source}
                onClick={() => setReferralSource(source)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
          disabled={!canFinish}
          onClick={() => onFinish({ coldEmailExperience, referralSource })}
        >
          Finish setup
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}

// Root component

type ProfileData = {
  university?: string;
  other_university?: string;
  year_of_study?: string;
  target_industries?: string[];
  cold_email_experience?: string;
  referral_source?: string;
};

const Signup = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const destination = redirectTo || (IS_WEBINAR_ONLY ? "/portal" : "/dashboard");

  // Update Supabase user_metadata with whatever profiling data we have collected
  const saveProfile = async (extra: ProfileData) => {
    const merged = { ...profileData, ...extra };
    if (supabase) {
      try {
        await supabase.auth.updateUser({ data: merged });
      } catch (_err) {
        // Non-fatal - user is already created, just metadata missing
      }
    }
  };

  const handleAccountCreated = () => {
    setStep(2);
  };

  const handleAboutYouNext = async (data: {
    university: string;
    otherUniversity: string;
    yearOfStudy: string;
    industries: string[];
  }) => {
    const update: ProfileData = {
      university: data.university,
      year_of_study: data.yearOfStudy,
      target_industries: data.industries,
    };
    if (data.university === "Other" && data.otherUniversity) {
      update.other_university = data.otherUniversity;
    }
    setProfileData((prev) => ({ ...prev, ...update }));
    await saveProfile(update);
    setStep(3);
  };

  const handleFinish = async (data: {
    coldEmailExperience: string;
    referralSource: string;
  }) => {
    const update: ProfileData = {
      cold_email_experience: data.coldEmailExperience,
      referral_source: data.referralSource,
    };
    await saveProfile(update);
    navigate(destination);
  };

  const handleSkip = () => {
    if (step === 2) {
      setStep(3);
    } else {
      navigate(destination);
    }
  };

  return (
    <AuthLayout>
      {/* Only show progress bar on steps 2 and 3 */}
      {step > 1 && <ProgressBar step={step} />}

      {step === 1 && <StepAccount onSuccess={handleAccountCreated} />}
      {step === 2 && (
        <StepAboutYou onNext={handleAboutYouNext} onSkip={handleSkip} />
      )}
      {step === 3 && (
        <StepWhereYouAreAt onFinish={handleFinish} onSkip={handleSkip} />
      )}
    </AuthLayout>
  );
};

export default Signup;
