import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Clock, Video, Euro, CalendarIcon, ArrowRight, CheckCircle2 } from "lucide-react";

const ANDREW_SESSIONS = [
  {
    id: "strategy-call",
    name: "Strategy Call",
    duration: "30 min",
    price: "£35",
    popular: false,
    description: "A quick 1-on-1 session to discuss your current trajectory and answer any specific questions.",
  },
  {
    id: "deep-dive",
    name: "Deep Dive Session",
    duration: "1 hour",
    price: "£59",
    popular: true,
    description: "An intensive walkthrough of your application, CV review, or mock interview practice.",
  },
];

const ANDREW_PACKAGE = {
  name: "3x Deep Dive Bundle",
  sessions: "3 × 1 Hour Sessions",
  price: "£149",
  originalPrice: "£177",
  priceLabel: "Save £28",
  description: "Perfect for comprehensive preparation. Use these sessions for a mix of CV review, mock interviews, and assessment centre prep.",
  journey: ["Strategy", "Mock Test", "Final Polish"],
};

export default function BookAndrew() {
  const { user } = useAuth();
  
  const handleDummyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("This is a placeholder page. Booking is disabled here.");
  };

  return (
    <div className="w-full relative">
      {/* ════════ HERO SECTION ════════ */}
      <div className="bg-gradient-to-br from-[#FAFAF7] to-[#F0EDE8] px-6 pt-10 pb-10 md:px-10 lg:px-12 rounded-b-3xl shadow-sm border-b border-[#E8E8E8]">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#111] text-white flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white shrink-0">
            A
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[11px] font-semibold tracking-wider text-[#666] uppercase mb-3 border border-[#E8E8E8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for Booking
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#111] tracking-tight mb-2">
              Book Andrew
            </h1>
            <p className="text-base text-[#666] max-w-xl leading-relaxed font-light mb-4">
              Andrew is offering exclusive 1-on-1 coaching sessions. Reserve your time below to get personalized guidance on your applications.
            </p>
          </div>
        </div>
      </div>

      {/* ════════ BOOKING SECTION ════════ */}
      <div className="px-6 py-10 md:px-10 lg:px-12 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-[#111] mb-6 flex items-center gap-2">
          Select your session type
          <span className="text-xs px-2 py-0.5 bg-[#F5F5F5] text-[#888] rounded-full font-medium">Step 1 of 2</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {ANDREW_SESSIONS.map((session) => (
            <div
              key={session.id}
              className={`relative bg-white rounded-2xl p-6 transition-all duration-300 border ${
                session.popular 
                  ? "border-[#111] shadow-md ring-1 ring-[#111]/5" 
                  : "border-[#E8E8E8] shadow-sm hover:shadow-md hover:border-[#DDD]"
              }`}
            >
              {session.popular && (
                <div className="absolute -top-3 right-6 bg-[#111] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#111] mb-1">{session.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#666] mb-3 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#999]" /> {session.duration}</span>
                    <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-[#999]" /> Video Call</span>
                    <span className="flex items-center gap-1.5 text-[#111]"><Euro className="w-4 h-4" /> {session.price}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#666] font-light">
                    {session.description}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <button
                    onClick={handleDummyClick}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${
                      session.popular
                        ? "bg-[#111] text-white hover:bg-[#222] shadow-sm"
                        : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB] border border-[#E0E0E0]"
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Select Time Slot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ════════ BUNDLE PACKAGE ════════ */}
        <div className="relative bg-[#111] border border-[#222] rounded-xl p-6 text-white mt-6">
          <div className="flex items-start justify-between mb-3 pt-2">
            <div>
              <h4 className="text-[15px] font-semibold">{ANDREW_PACKAGE.name}</h4>
              <p className="text-[12px] text-white/50 mt-0.5">{ANDREW_PACKAGE.sessions}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-[15px] text-white/40 line-through">{ANDREW_PACKAGE.originalPrice}</p>
                <p className="text-xl font-bold">{ANDREW_PACKAGE.price}</p>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">{ANDREW_PACKAGE.priceLabel}</p>
            </div>
          </div>

          <p className="text-[13px] text-white/70 font-light leading-relaxed mb-6">
            {ANDREW_PACKAGE.description}
          </p>

          <button
            onClick={handleDummyClick}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-[#111] hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
          >
            <CalendarIcon className="w-4 h-4" />
            Book Package slots
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
