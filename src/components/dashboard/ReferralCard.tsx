import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { referralInfo } from "@/data/dashboardData";

export function ReferralCard() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(referralInfo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Hey! Use my code ${referralInfo.code} to get ${referralInfo.discount}% off your first session on EarlyEdge — peer coaching from people who just got the offers you're aiming for.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="gradient-hero rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-4 h-4 text-white/70" />
        <h3 className="text-[13px] font-semibold">
          Invite friends, save {referralInfo.discount}%
        </h3>
      </div>
      <p className="text-[11px] text-white/50 mb-3">Share your referral code</p>
      <div className="bg-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between mb-3">
        <span className="text-sm font-semibold tracking-wider">
          {referralInfo.code}
        </span>
        <button
          onClick={copyCode}
          className="text-white/60 hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyCode}
          className="flex-1 bg-white/10 hover:bg-white/15 text-white text-xs font-medium py-2 rounded-lg transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex-1 bg-white text-[#111] text-xs font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors"
        >
          Share on WhatsApp
        </button>
      </div>
      <p className="text-[10px] text-white/30 mt-3 text-center">
        {referralInfo.friendsInvited} friends invited
      </p>
    </div>
  );
}
