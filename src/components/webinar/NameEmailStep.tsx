import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface NameEmailStepProps {
  firstName: string;
  email: string;
  onUpdate: (field: "firstName" | "email", value: string) => void;
  onContinue: () => string | null;
}

export function NameEmailStep({
  firstName,
  email,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* First name */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          What's your first name?
        </h2>
        <Input
          ref={inputRef}
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          className="font-sans text-base h-12 border-border"
          autoComplete="given-name"
        />
      </div>

      {/* Email */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground">
          And your email?
        </h2>
        <Input
          type="email"
          placeholder="you@university.ac.uk"
          value={email}
          onChange={(e) => onUpdate("email", e.target.value)}
          className="font-sans text-base h-12 border-border"
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground font-sans font-light">
          We'll send your ticket confirmation here
        </p>
      </div>

      {/* Continue */}
      <Button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/90 font-sans font-light px-8 py-3 text-sm rounded-lg w-full sm:w-auto"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
