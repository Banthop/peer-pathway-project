import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase, supabaseAvailable } from "@/integrations/supabase/client";
import {
  WEBINAR_TITLE,
} from "@/data/webinarData";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  HelpCircle,
  Loader2,
} from "lucide-react";

/* ---- Success Screen ---- */
function SuccessScreen({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md animate-in fade-in duration-500">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-sans font-light text-foreground">
          Question submitted{name ? `, ${name}` : ""}!
        </h1>
        <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed">
          Thanks for your question. The EarlyEdge team will get back to you via
          email as soon as possible.
        </p>
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="font-sans font-light rounded-xl px-6"
          >
            Ask another question
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---- Main Page ---- */
export default function WebinarQuestions() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "EarlyEdge - Ask a Question";
    return () => {
      document.title = prev;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!firstName.trim()) {
      toast({ title: "Please enter your first name", variant: "destructive" });
      return;
    }
    if (!lastName.trim()) {
      toast({ title: "Please enter your last name", variant: "destructive" });
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    if (!question.trim() || question.trim().length < 10) {
      toast({
        title: "Please write a question (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (!supabaseAvailable || !supabase) {
        console.log(
          "[WebinarQuestions] Supabase not configured - skipping save"
        );
        // Still show success in demo mode
        setSubmitted(true);
        return;
      }

      const { error } = await supabase.from("webinar_questions").insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        question: question.trim(),
      });

      if (error) {
        console.error("[WebinarQuestions] Save error:", error.message);
        toast({
          title: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[WebinarQuestions] Error:", err);
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessScreen name={firstName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      {/* Logo */}
      <div className="absolute top-5 left-6 z-50">
        <Logo to="#" className="text-xl pointer-events-none" />
      </div>

      {/* Back to webinar */}
      <a
        href="/webinar"
        className="absolute top-6 right-6 z-50 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans font-light flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Webinar
      </a>

      <main className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-emerald-50">
                <HelpCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h1
                className="text-foreground font-sans leading-tight"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Got a question?
              </h1>
              <p className="text-sm text-muted-foreground font-sans font-light max-w-md leading-relaxed">
                Have a question about cold emailing or the recording?
                Submit it here and the EarlyEdge team will reply via email.
              </p>
            </div>



            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4 text-left"
            >
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-xs font-sans font-medium text-foreground/70 uppercase tracking-wider"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Jordan"
                    className="w-full rounded-xl border border-border bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-sans font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-xs font-sans font-medium text-foreground/70 uppercase tracking-wider"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Smith"
                    className="w-full rounded-xl border border-border bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-sans font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-sans font-medium text-foreground/70 uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.ac.uk"
                  className="w-full rounded-xl border border-border bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-sans font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all shadow-sm"
                />
              </div>

              {/* Question */}
              <div className="space-y-1.5">
                <label
                  htmlFor="question"
                  className="text-xs font-sans font-medium text-foreground/70 uppercase tracking-wider"
                >
                  Your question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to ask? e.g. How do I find emails for small boutique firms?"
                  rows={5}
                  className="w-full rounded-xl border border-border bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-sans font-light text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all shadow-sm resize-none"
                />
                <p className="text-[11px] text-muted-foreground/60 font-sans font-light">
                  Be as specific as you can - we'll reply to your email directly.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-sans font-medium px-6 py-4 text-base rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Question
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer note */}
            <p className="text-[11px] text-muted-foreground/50 font-sans font-light pt-2">
              Your details are only used to reply to your question. We don't
              share your data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
