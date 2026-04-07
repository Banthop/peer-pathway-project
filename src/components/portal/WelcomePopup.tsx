import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { ArrowRight } from "lucide-react";

export function WelcomePopup() {
  const { buyerStatus, markWelcomeShown } = useBuyerAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  // Only show for free-tier users who haven't seen the popup yet
  if (!buyerStatus || buyerStatus.tier !== "free" || buyerStatus.welcomePopupShown || !visible) {
    return null;
  }

  const handleCtaClick = async () => {
    await markWelcomeShown();
    navigate("/portal/resources");
  };

  const handleDismiss = async () => {
    await markWelcomeShown();
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/20 p-10 md:p-14 animate-in fade-in zoom-in-95 duration-300">
        {/* Top badge */}
        <div className="flex justify-center mb-5">
          <span className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            Welcome to EarlyEdge
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#111] text-center mb-4">
          Your free slides are ready.
        </h2>

        {/* Stats pill */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#111] text-white rounded-xl px-5 py-3 text-sm font-medium text-center">
            1,062 cold emails &middot; 223 responses &middot; 20 internship offers
          </div>
        </div>

        {/* Body copy */}
        <p className="text-[15px] text-[#444] font-light leading-relaxed text-center mb-2">
          Access the full slide deck from our live 90-minute cold-email webinar - see the exact frameworks, templates, and sequences that Uthman used.
        </p>
        <p className="text-[15px] text-[#444] font-medium leading-relaxed text-center mb-8">
          Finance, Tech, Consulting, Law. It applies across all industries.
        </p>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleCtaClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Access Your Free Slides
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary dismiss */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-[13px] text-[#999] hover:text-[#666] cursor-pointer underline underline-offset-2 transition-colors"
          >
            I'll explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
