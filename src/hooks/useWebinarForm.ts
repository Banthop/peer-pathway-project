import { useState, useCallback } from "react";

export interface WebinarFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  university: string;
  yearOfStudy: string;
  industry: string;
  industryDetail: string;
  referralSource: string;
  coachingInterest: string;
  selectedTicket: "webinar-only" | "bundle";
}

// Steps: 0=Welcome, 1=Details, 2=University, 3=Industry+Referral, 4=Ticket
const TOTAL_STEPS = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step: number, data: WebinarFormData): string | null {
  switch (step) {
    case 0:
      return null;
    case 1:
      if (!data.firstName.trim()) return "Please enter your first name.";
      if (!data.lastName.trim()) return "Please enter your last name.";
      if (!EMAIL_RE.test(data.email)) return "Please enter a valid email.";
      return null;
    case 2:
      if (!data.university.trim()) return "Please enter your university.";
      if (!data.yearOfStudy) return "Please select your year of study.";
      return null;
    case 3:
      if (!data.industry) return "Please pick an industry.";
      if (!data.referralSource) return "Please select how you heard about us.";
      return null;
    case 4:
      return null;
    default:
      return null;
  }
}

export function useWebinarForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<WebinarFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "gb:+44",
    phone: "",
    university: "",
    yearOfStudy: "",
    industry: "",
    industryDetail: "",
    referralSource: "",
    coachingInterest: "",
    selectedTicket: "bundle",
  });

  const updateField = useCallback(
    <K extends keyof WebinarFormData>(field: K, value: WebinarFormData[K]) => {
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

  return {
    step,
    totalSteps: TOTAL_STEPS,
    formData,
    updateField,
    nextStep,
    prevStep,
    progress,
    direction,
  };
}
