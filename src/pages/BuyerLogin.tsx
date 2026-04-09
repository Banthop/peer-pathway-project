import { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { Logo } from "@/components/Logo";
import { Loader2, Mail, ArrowRight } from "lucide-react";

export default function BuyerLogin() {
  const { buyer, verifyEmail, error } = useBuyerAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in - redirect to portal
  if (buyer) return <Navigate to="/portal" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    await verifyEmail(email.trim());
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Logo to="#" className="text-2xl pointer-events-none inline-block" />
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-[#111] tracking-tight">
              Access your content
            </h1>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Enter the email you used to purchase. We'll verify it and let you straight in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl text-sm text-[#111] placeholder:text-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#111]/20 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 font-light animate-in fade-in slide-in-from-top-2 duration-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full py-3.5 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#BBB] font-light">
          Having trouble? Email{" "}
          <a href="mailto:support@yourearlyedge.co.uk" className="text-[#888] underline underline-offset-2">
            support@yourearlyedge.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
