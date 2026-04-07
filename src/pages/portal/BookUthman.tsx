import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Users,
  Trophy,
  ChevronDown,
  ArrowRight,
  X as XIcon,
  Zap,
  Target,
} from "lucide-react";

const CAL_USERNAME = "yourearlyedge";

/* ─── Session types ─── */

interface SessionType {
  id: string;
  name: string;
  duration: string;
  price: string;
  priceLabel: string;
  description: string;
  includes: string[];
  calSlug: string;
  popular?: boolean;
  isGroup?: boolean;
  maxParticipants?: number;
  testimonial?: { text: string; name: string; uni: string };
}

const SESSION_TYPES: SessionType[] = [
  {
    id: "strategy-call",
    name: "Strategy Call",
    duration: "30 min",
    price: "£35",
    priceLabel: "per session",
    description:
      "Quick, focused session to review your cold email strategy, get template feedback, or ask Uthman anything about landing internships.",
    includes: [
      "Personalised email review",
      "Strategy feedback & template fixes",
      "Clear action plan for your next steps",
    ],
    calSlug: "strategy-call",
    testimonial: {
      text: "Fixed my subject lines and got 3 replies in the first week",
      name: "Priya M.",
      uni: "LSE",
    },
  },
  {
    id: "deep-dive",
    name: "Deep Dive Session",
    duration: "60 min",
    price: "£59",
    priceLabel: "per session",
    description:
      "Full session covering your complete outreach strategy. Walk away with custom templates, a lead list, and a personalised action plan.",
    includes: [
      "Full outreach audit",
      "Custom email templates written for you",
      "Lead sourcing walkthrough",
      "Personalised follow-up sequences",
      "7-day email support after the session",
    ],
    calSlug: "deep-dive-session",
    popular: true,
    testimonial: {
      text: "Had my call on Monday, fixed my templates the same day, and immediately started seeing higher open rates.",
      name: "Jake L.",
      uni: "Warwick",
    },
  },
];

/* ─── Package ─── */

const PACKAGE = {
  name: "3x Deep Dive Bundle",
  sessions: "3 × 60-min Deep Dive sessions",
  price: "£140",
  originalPrice: "£177",
  priceLabel: "save £37",
  description:
    "Three Deep Dive sessions. Book your first slot below, and we'll schedule the remaining two sessions together on our first call. Full outreach audit, custom templates, and ongoing accountability.",
  journey: ["Week 1: Strategy & Templates", "Week 2: Pipeline Building", "Week 3: First Replies & Iteration"],
  calSlug: "3x-deep-dive-bundle",
};

/* ─── Testimonials ─── */

const TESTIMONIALS = [
  {
    text: "Before my call I had 0 replies from 30 generic emails. Uthman's system completely changed my approach. I re-sent exactly as he advised and got 4 replies in the first week.",
    name: "Jake L.",
    uni: "Warwick",
    year: "2nd Year",
    rating: 5,
  },
  {
    text: "Genuinely the most practical session I've had. Uthman doesn't give vague advice - he literally wrote my templates with me on the call. Sent them the same day.",
    name: "Priya M.",
    uni: "LSE",
    year: "2nd Year",
    rating: 5,
  },
  {
    text: "I was terrified of cold emailing. One call with Uthman and I had a system, a list of 40 firms, and zero excuses left. Got my first reply within 3 days.",
    name: "Sophie K.",
    uni: "Bristol",
    year: "1st Year",
    rating: 5,
  },
  {
    text: "The group workshop was incredible value for £20. I left with a complete email sequence and a lead list I started using the very next day.",
    name: "Amina R.",
    uni: "UCL",
    year: "3rd Year",
    rating: 5,
  },
  {
    text: "Booked the 3-session bundle. Within a week I had 12 replies and 2 interview invitations. This isn't advice - it's a service that gets results.",
    name: "Rahul D.",
    uni: "LSE",
    year: "3rd Year",
    rating: 5,
  },
];

/* ─── FAQ ─── */

const FAQ = [
  {
    q: "What happens on the call?",
    a: "You share your situation - what firms you're targeting, any emails you've written, your CV. Uthman then builds or fixes your templates on the call, shows you how to find decision-makers, and gives you a step-by-step plan to follow. You'll leave knowing exactly what to do next.",
  },
  {
    q: "I haven't started cold emailing yet - is that okay?",
    a: "Absolutely. Most students book before they've sent a single email. Uthman will build your strategy from scratch - including which firms to target, how to find emails, and what to write. Starting from zero is often better because there are no bad habits to undo.",
  },
  {
    q: "Is this worth it if I already have the guide?",
    a: "The guide teaches the system. The call applies it to YOUR specific situation - your target industry, your experience, your university. Uthman will write templates tailored to you and review your lead list. Most students say the call is where everything 'clicks.'",
  },
  {
    q: "I'm a first-year - is it too early?",
    a: "It's never too early. First-years who start cold emailing now have 2-3 years of runway. The firms you reach out to remember you. Starting early is the single biggest advantage you can have.",
  },
  {
    q: "What if something comes up?",
    a: "You can reschedule up to 24 hours before your session. Just use the link in your confirmation email.",
  },
  {
    q: "What if it doesn't help me?",
    a: "If you're not satisfied, email us within 24 hours and we'll arrange a follow-up or full refund.",
  },
];

/* ─── Main Component ─── */

export default function BookUthman() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBookClick = (calSlug: string) => {
    const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
    const name = user?.user_metadata?.name || user?.user_metadata?.full_name || "";
    const nameParam = name ? `${email ? "&" : "?"}name=${encodeURIComponent(name)}` : "";
    window.open(`https://cal.com/${CAL_USERNAME}/${calSlug}${email}${nameParam}`, "_blank");
  };

  return (
    <div className="w-full relative">

      {/* ════════ HERO SECTION ════════ */}
      <div className="bg-gradient-to-br from-[#FAFAF7] to-[#F0EDE8] px-6 pt-10 pb-10 md:px-10 lg:px-12 rounded-b-3xl shadow-sm border-b border-[#E8E8E8]">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full flex-shrink-0 ring-4 ring-white shadow-lg overflow-hidden">
            <img
              src="/images/uthman-profile.jpg"
              alt="Uthman"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Available for 1-on-1 sessions
            </p>
            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-[#111] leading-tight">
              The person who landed 20 offers<br className="hidden md:block" /> will personally fix your cold emails
            </h1>
            <p className="text-sm text-[#666] mt-2 font-light leading-relaxed max-w-xl">
              Uthman has helped students at LSE, Warwick, UCL, and Bristol start getting replies within days.
              He built the exact system in the guide - now he'll apply it to <em>your</em> situation.
            </p>

            {/* Trust signals */}
            <div className="flex items-center flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E8E8] rounded-full px-3 py-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[11px] text-[#666] font-medium">5.0 average rating</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E8E8] rounded-full px-3 py-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-[#888]" />
                <span className="text-[11px] text-[#666] font-medium">20+ offers across PE, IB, VC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-12 pb-10">
        {/* ════════ PAIN SECTION ════════ */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 border-l-[6px] border-l-amber-500 rounded-xl p-6 mt-8 mb-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-[15px] font-semibold text-[#111] mb-3 flex items-center gap-2 relative z-10">
            <Target className="w-4 h-4 text-amber-600" />
            If you recognise any of this...
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
            {[
              "You've drafted cold emails but never sent them",
              "You've sent emails but got zero replies",
              "You don't know which firms to target or who to email",
              "You've watched the recording but feel stuck on execution",
              "You keep researching instead of actually emailing",
              "You're worried your emails sound generic or desperate",
            ].map((pain) => (
              <div key={pain} className="flex items-start gap-2">
                <XIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-[#555] font-light">{pain}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-amber-200/50 relative z-10">
            <p className="text-[14px] font-semibold text-[#111] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              A single call with Uthman fixes this.
            </p>
            <p className="text-[12px] text-[#888] mt-1 font-light">
              Every week you wait is a week of internship applications going to someone else.
            </p>
          </div>
        </div>

        {/* ════════ COMPARISON ANCHOR ════════ */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-5 mb-8 text-center shadow-sm">
          <p className="text-[13px] text-[#888] font-light">
            Professional career coaching firms charge <strong className="text-[#111] font-semibold">£150-300/hr</strong>.
          </p>
          <p className="text-[13px] text-[#888] font-light mt-1">
            A single internship offer can be worth <strong className="text-[#111] font-semibold">£30,000+</strong> in first-year earnings alone.
          </p>
          <p className="text-[14px] text-emerald-700 font-semibold mt-2">
            A Deep Dive Session costs a fraction of what a bad application cycle will.
          </p>
        </div>

        {/* ════════ SESSION CARDS ════════ */}
        <div className="space-y-5">
          <h3 className="text-base font-semibold text-[#111] flex items-center justify-between">
            Choose a session
          </h3>

          {SESSION_TYPES.map((session) => (
            <div
              key={session.id}
              className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                session.popular
                  ? "border-emerald-400 shadow-md border-l-[6px] border-l-emerald-500 ring-1 ring-emerald-100"
                  : session.isGroup
                    ? "border-blue-300 border-l-[6px] border-l-blue-500 hover:border-blue-400"
                    : "border-[#DDD] border-l-[6px] border-l-slate-400 hover:border-[#BBB]"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#111] flex items-center gap-2">
                      {session.name}
                      {session.popular && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          POPULAR
                        </span>
                      )}
                      {session.isGroup && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Group
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[12px] text-[#888]">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-[#888]">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Zoom
                      </span>
                      {session.maxParticipants && (
                        <span className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Users className="w-3.5 h-3.5" />
                          Max {session.maxParticipants}
                        </span>
                      )}

                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-[#111]">{session.price}</p>
                    <p className="text-[10px] text-[#BBB]">{session.priceLabel}</p>
                  </div>
                </div>

                <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
                  {session.description}
                </p>

                {/* What you'll walk away with */}
                <p className="text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-2">
                  What you'll walk away with
                </p>
                <div className="space-y-2 mb-4">
                  {session.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-[12px] text-[#555]">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Inline testimonial */}
                {session.testimonial && (
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg px-4 py-3 mb-4">
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[12px] text-emerald-800 font-light italic leading-relaxed">
                      "{session.testimonial.text}"
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      {session.testimonial.name}, {session.testimonial.uni}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleBookClick(session.calSlug)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    session.popular
                      ? "bg-[#111] text-white hover:bg-[#222] shadow-sm hover:-translate-y-0.5"
                      : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB] border border-[#E0E0E0] hover:-translate-y-0.5"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Select Time Slot
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ════════ BUNDLE PACKAGE ════════ */}
        <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] border-2 border-purple-500/40 rounded-xl p-6 text-white mt-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="flex items-start justify-between mb-3 pt-2">
            <div>
              <h4 className="text-[15px] font-semibold">{PACKAGE.name}</h4>
              <p className="text-[12px] text-white/50 mt-0.5">{PACKAGE.sessions}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-[15px] text-white/40 line-through">{PACKAGE.originalPrice}</p>
                <p className="text-xl font-bold">{PACKAGE.price}</p>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">{PACKAGE.priceLabel}</p>
            </div>
          </div>

          <p className="text-[13px] text-white/70 font-light leading-relaxed mb-4">
            {PACKAGE.description}
          </p>

          {/* Journey steps */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {PACKAGE.journey.map((step, idx) => (
              <div key={step} className="bg-white/10 rounded-lg px-3 py-2.5 text-center">
                <p className="text-[10px] text-white/40 font-semibold mb-0.5">STEP {idx + 1}</p>
                <p className="text-[11px] text-white/80 font-medium">{step}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleBookClick(PACKAGE.calSlug)}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-[#111] hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
          >
            <CalendarIcon className="w-4 h-4" />
            Book Package slots
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ════════ TESTIMONIALS SECTION ════════ */}
        <div className="mt-12 mb-8 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
              Real results from real students
            </p>
            <h3 className="text-lg font-semibold text-[#111]">
              What happened after they booked
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((review) => (
              <div key={review.name} className="bg-[#F0FDF4] border border-emerald-100 rounded-xl p-5">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-[#333] font-light italic leading-relaxed mb-3">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] text-white font-semibold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#111]">{review.name}</p>
                    <p className="text-[11px] text-[#888]">{review.year}, {review.uni}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ FAQ ════════ */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-2 border-slate-300 rounded-xl overflow-hidden mt-8">
          <div className="px-5 py-4 border-b border-[#E8E8E8]">
            <h3 className="text-[13px] font-semibold text-[#111]">
              Common Questions
            </h3>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {FAQ.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-[#111]">{faq.q}</p>
                  <ChevronDown
                    className={`w-4 h-4 text-[#999] transition-transform flex-shrink-0 ml-2 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="text-[12px] text-[#666] font-light leading-relaxed mt-2 pr-6 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
