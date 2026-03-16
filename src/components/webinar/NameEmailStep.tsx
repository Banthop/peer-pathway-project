import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/webinar/PhoneInput";
import { ArrowRight, Shield } from "lucide-react";

interface NameEmailStepProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  onUpdate: (field: "firstName" | "lastName" | "email" | "phoneCode" | "phone", value: string) => void;
  onContinue: () => string | null;
}

export function NameEmailStep({
  firstName,
  lastName,
  email,
  phoneCode,
  phone,
  onUpdate,
  onContinue,
}: NameEmailStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Names row */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          Let's start with your details
        </h2>
        <p className="text-sm text-muted-foreground font-sans font-light">
          This takes about 30 seconds
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            ref={inputRef}
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            className="font-sans text-base h-12 border-border rounded-xl"
            autoComplete="given-name"
          />
          <Input
            type="text"
            placeholder="Last name"
            value={lastName}
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
          value={email}
          onChange={(e) => onUpdate("email", e.target.value)}
          className="font-sans text-base h-12 border-border rounded-xl"
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground font-sans font-light">
          We'll send your ticket confirmation here
        </p>
      </div>

      {/* Phone with country code - OPTIONAL */}
      <div className="space-y-2">
        <PhoneInput
          phoneCode={phoneCode}
          phone={phone}
          onCodeChange={(code) => onUpdate("phoneCode", code)}
          onPhoneChange={(val) => onUpdate("phone", val)}
        />
        <p className="text-xs text-muted-foreground font-sans font-light">
          Phone <span className="text-amber-600 font-medium">(optional)</span> - for reminders and last-minute updates only
        </p>
      </div>

      {/* Continue */}
      <div className="space-y-3">
        <Button
          type="submit"
          className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-8 py-3 text-sm rounded-xl w-full sm:w-auto"
        >
          Save My Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Trust signal */}
        <p className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-sans font-light">
          <Shield className="h-3.5 w-3.5" />
          Your data is private and never shared
        </p>
      </div>
    </form>
  );
}
