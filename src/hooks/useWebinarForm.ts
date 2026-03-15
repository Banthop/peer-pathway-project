import { useState, useCallback } from "react";

export interface WebinarFormData {
  firstName: string;
  email: string;
  university: string;
  yearOfStudy: string;
  industry: string;
  selectedTicket: "webinar-only" | "bundle";
}

const TOTAL_STEPS = 5; // 0-4

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step: number, data: WebinarFormData): string | null {
  switch (step) {
    case 0:
      return null; // welcome — always valid
    case 1:
      if (!data.firstName.trim()) return "Please enter your first name.";
      if (!EMAIL_RE.test(data.email)) return "Please enter a valid email.";
      return null;
    case 2:
      if (!data.university.trim()) return "Please enter your university.";
      if (!data.yearOfStudy) return "Please select your year of study.";
      return null;
    case 3:
      if (!data.industry) return "Please pick an industry.";
      return null;
    case 4:
      return null; // ticket always has a default
    default:
      return null;
  }
}

export function useWebinarForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<WebinarFormData>({
    firstName: "",
    email: "",
    university: "",
    yearOfStudy: "",
    industry: "",
    selectedTicket: "bundle", // pre-selected
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
