import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Users,
  Trophy,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Sparkles,
  X as XIcon,
  Zap,
  Target,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
 *  CAL.COM CONFIG
 * ═══════════════════════════════════════════════════════════════ */

const CAL_USERNAME = "uthm4n";

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
  nextAvailable?: string;
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
    nextAvailable: "Tomorrow",
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
    nextAvailable: "This week",
  },
  {
    id: "group-workshop",
    name: "Group Cold Email Workshop",
    duration: "90 min",
    price: "£20",
    priceLabel: "per person",
    description:
      "Small-group session (max 8 people) where Uthman walks through the full cold email system live. Great if you want a more affordable option.",
    includes: [
      "Full system walkthrough",
      "Live template building",
      "Group Q&A",
      "Recording of the session",
    ],
    calSlug: "group-workshop",
    isGroup: true,
    maxParticipants: 8,
    testimonial: {
      text: "Brilliant workshop. Learned so much from other people's questions too",
      name: "Amina R.",
      uni: "UCL",
    },
    nextAvailable: "This weekend",
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
  calSlug: "3xdeepdivebundle",
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

  const handleExternalBookClick = (calSlug: string) => {
    const baseUrl = `https://cal.com/${CAL_USERNAME}/${calSlug}?overlayCalendar=true`;

    const params = new URLSearchParams();
    if (user?.email) params.set("email", user.email);
    const name = user?.user_metadata?.name || user?.user_metadata?.full_name || "";
    if (name) params.set("name", name);

    const finalUrl = params.toString() ? `${baseUrl}&${params.toString()}` : baseUrl;
    window.open(finalUrl, "_blank");
  };

  return (
    <div className="w-full relative">

      {/* ════════ HERO SECTION ════════ */}
      <div className="bg-gradient-to-br from-[#FAFAF7] to-[#F0EDE8] px-6 pt-10 pb-10 md:px-10 lg:px-12 rounded-b-3xl shadow-sm border-b border-[#E8E8E8]">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#111] to-[#444] flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0 ring-4 ring-white shadow-lg overflow-hidden">
            UA
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
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-emerald-800 font-semibold">£30,000+ in first-year internship earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-12 pb-10">
        {/* ════════ PAIN SECTION ════════ */}
        <div className="bg-[#FFFBF5] border border-amber-200 rounded-xl p-6 mt-8 mb-8 relative overflow-hidden">
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
            <p className="text-[13px] text-amber-900 font-medium">
              A single session fixes all of this. One call → one focused system → replies in days.
            </p>
          </div>
        </div>

        {/* ════════ SESSION CARDS ════════ */}
        <div className="space-y-4 mb-8">
          <h2 className="text-base font-semibold text-[#111]">Choose a session</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SESSION_TYPES.map((session) => (
              <div
                key={session.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${
                  session.popular ? "border-emerald-300 ring-1 ring-emerald-200" : "border-[#E8E8E8]"
                }`}
              >
                {session.popular && (
                  <div className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 text-center">
                    Most Popular
                  </div>
                )}

                <div className="p-5 flex-shrink-0 space-y-5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-[#111] leading-tight">{session.name}</h3>
                      {session.nextAvailable && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                          {session.nextAvailable}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[12px] text-[#888]">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration}
                      </div>
                      {session.isGroup && (
                        <div className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Users className="w-3.5 h-3.5" />
                          Max {session.maxParticipants}
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] text-[#666] mt-3 leading-relaxed font-light">{session.description}</p>
                  </div>

                  <ul className="space-y-1.5">
                    {session.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[12px] text-[#555] font-light">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {session.testimonial && (
                    <div className="bg-[#FAFAFA] rounded-xl p-3 border border-[#F0F0F0]">
                      <p className="text-[11px] text-[#555] font-light italic leading-relaxed">
                        "{session.testimonial.text}"
                      </p>
                      <p className="text-[10px] text-[#999] mt-1.5 font-medium">
                        — {session.testimonial.name}, {session.testimonial.uni}
                      </p>
                    </div>
                  )}

                  <div className="pt-1">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-2xl font-bold text-[#111]">{session.price}</span>
                      <span className="text-[11px] text-[#999]">{session.priceLabel}</span>
                    </div>

                    <button
                      onClick={() => handleExternalBookClick(session.calSlug)}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                        session.popular
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-[#111] text-white hover:bg-[#222]"
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
        </div>

        {/* ════════ PACKAGE DEAL ════════ */}
        <div className="relative bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-2xl p-6 md:p-8 mb-10 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/30">
                    Best Value
                  </span>
                  <span className="text-white/40 text-[11px] line-through">{PACKAGE.originalPrice}</span>
                  <span className="text-emerald-400 text-[11px] font-bold">{PACKAGE.priceLabel}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{PACKAGE.name}</h3>
                <p className="text-[13px] text-white/60 mt-1 font-light">{PACKAGE.sessions}</p>
                <p className="text-[13px] text-white/70 mt-3 leading-relaxed font-light max-w-lg">
                  {PACKAGE.description}
                </p>

                <div className="mt-4 space-y-2">
                  {PACKAGE.journey.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-emerald-400">{i + 1}</span>
                      </div>
                      <span className="text-[12px] text-white/70 font-light">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-[220px] flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <p className="text-white/50 text-[11px] uppercase tracking-wider mb-1">Bundle price</p>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-3xl font-bold text-white">{PACKAGE.price}</span>
                    <span className="text-white/40 text-xs">total</span>
                  </div>
                  <button
                    onClick={() => handleExternalBookClick(PACKAGE.calSlug)}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Select Time Slot
                  </button>
                  <p className="text-white/30 text-[10px] text-center mt-2">
                    Book first session — remaining 2 scheduled on the call
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ TESTIMONIALS ════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-semibold text-[#111]">What students say</h2>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[12px] text-[#888]">5.0 · {TESTIMONIALS.length} reviews</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-[#444] font-light leading-relaxed italic">"{t.text}"</p>
                <div className="mt-3 pt-3 border-t border-[#F5F5F5]">
                  <p className="text-[12px] font-semibold text-[#111]">{t.name}</p>
                  <p className="text-[11px] text-[#999] font-light">{t.uni} · {t.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ FAQ ════════ */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-[#111] mb-4">Common questions</h2>
          <div className="space-y-2">
            {FAQ.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="text-[13px] font-medium text-[#111]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#999] flex-shrink-0 ml-4 transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4">
                    <p className="text-[13px] text-[#666] font-light leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ════════ BOTTOM CTA ════════ */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
          <Zap className="w-6 h-6 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-[16px] font-bold text-[#111] mb-1">Ready to start getting replies?</h3>
          <p className="text-[13px] text-[#666] font-light mb-5 max-w-md mx-auto leading-relaxed">
            Choose a session above and book directly. Uthman's availability syncs automatically via Cal.com.
          </p>
          <button
            onClick={() => handleExternalBookClick(SESSION_TYPES[1].calSlug)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-md"
          >
            <CalendarIcon className="w-4 h-4" />
            Book a Deep Dive Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
