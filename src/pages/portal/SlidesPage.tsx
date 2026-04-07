import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import {
  Play,
  BookOpen,
  ArrowRight,
  Check,
  ShieldCheck,
  Star,
  Presentation,
  Lock,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const STRIPE_RECORDING_URL = "https://buy.stripe.com/8x29AS56I8tPaL09cU2400l";
const STRIPE_BUNDLE_URL = "https://buy.stripe.com/eVqeVcbv6dO9bP4exe2400m";
const CAL_LINK = "https://cal.com/yourearlyedge";
const SLIDES_EMBED_URL = "https://drive.google.com/file/d/1GtHhkNGEQqKnE8NCzZn4hCcBvyBPDCYf/preview";

/* ─── Data ─── */

const STEPS = [
  { label: "View Slides", done: true, current: false },
  { label: "Watch Recording", done: false, current: true },
  { label: "Get the Guide", done: false, current: false },
  { label: "Book Coaching", done: false, current: false },
];

const CHECKLIST = [
  {
    step: 1,
    title: "Identify your target firm type",
    detail: "Focus on boutique PE/VC, IB advisory, or lean consulting firms with 5-50 employees. Big banks don't respond to cold email. Small firms do.",
  },
  {
    step: 2,
    title: "Find the decision-maker's name",
    detail: "Use LinkedIn to identify the MD, Partner, or CEO. You're emailing them directly - not HR.",
  },
  {
    step: 3,
    title: "Get their email via Apollo.io",
    detail: "Sign up for Apollo.io free tier. Search the firm, find the person, export their verified email address.",
  },
  {
    step: 4,
    title: "Write a personalised first line",
    detail: "Spend 2 minutes on their LinkedIn. Reference something specific: a recent deal, a post, a firm milestone. One sentence.",
  },
  {
    step: 5,
    title: "Use the 5-part email structure",
    detail: "Intro (1 line). Why you're reaching out. Specific ask (coffee chat or call). Your credentials. Sign-off. Keep it under 120 words.",
  },
  {
    step: 6,
    title: "Set up Google Mail Merge",
    detail: "Use YAMM or Mailmeteor with a Google Sheet. Personalise the first line column. Never send a batch cold email from Outlook.",
  },
  {
    step: 7,
    title: "Send at 9:03 AM on a Tuesday",
    detail: "Open rates drop sharply on Mondays and Fridays. Tuesday 9:03 AM is the sweet spot. Schedule your sends the night before.",
  },
  {
    step: 8,
    title: "Follow up exactly once, 5 days later",
    detail: "One follow-up doubles your reply rate. Keep it short: 'Just bumping this up in case it got buried.' No more than that.",
  },
  {
    step: 9,
    title: "Handle the reply within 2 hours",
    detail: "When someone replies, respond fast. Propose 3 specific time slots. Confirm the format (call/Zoom/coffee). Be brief and professional.",
  },
  {
    step: 10,
    title: "Track everything in a spreadsheet",
    detail: "Log: firm name, contact name, email, date sent, date followed up, response status. This is how you scale to 100+ firms.",
  },
];

const BLUEPRINT_CHAPTERS = [
  { title: "Chapter 1: The Hidden Job Market", teaser: "Why 80% of internships are never posted publicly" },
  { title: "Chapter 2: Building Your Lead List", teaser: "Apollo.io walkthrough: 200 verified contacts in 30 minutes" },
  { title: "Chapter 3: The Cold Email Formula", teaser: "The exact 5-part template with 12 firm-specific examples" },
  { title: "Chapter 4: Personalisation at Scale", teaser: "The 2-minute first line method that makes mass email feel personal" },
  { title: "Chapter 5: Mail Merge Setup", teaser: "Step-by-step YAMM setup, scheduling, and the 9:03 AM rule" },
  { title: "Chapter 6: Follow-Up Sequences", teaser: "The exact follow-up wording that doubles your reply rate" },
  { title: "Chapter 7: Handling Responses", teaser: "Word-for-word scripts for every reply type you'll receive" },
  { title: "Chapter 8: Interview Prep", teaser: "What to say when they actually want to meet you" },
];

const TESTIMONIALS = [
  {
    text: "Sent cold emails the same week as the webinar. Got 3 replies within 5 days. This is genuinely the best resource I've found for internship applications.",
    name: "Jake L.",
    uni: "Warwick, 2nd Year",
    result: "3 replies in 5 days",
  },
  {
    text: "I was sceptical about cold email before this. Uthman's system is so specific - not vague advice, actual steps. Got a coffee chat at a PE firm within 10 days.",
    name: "Priya M.",
    uni: "LSE, 2nd Year",
    result: "Coffee chat in 10 days",
  },
  {
    text: "Applied to 4 spring week programmes through the portal and got 2 interviews. The cold email guide is what actually got me moving. Worth every penny.",
    name: "Amir K.",
    uni: "UCL, 1st Year",
    result: "2 spring week interviews",
  },
];

/* ─── Sub-components ─── */

function ProgressSteps() {
  return (
    <div className="bg-white border-b border-[#E8E8E8] px-6 py-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-0">
          {STEPS.map((step, idx) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${
                  step.done
                    ? "bg-emerald-500 text-white"
                    : step.current
                    ? "bg-[#111] text-white ring-2 ring-[#111] ring-offset-2"
                    : "bg-[#F0F0F0] text-[#BBB]"
                }`}>
                  {step.done ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    <span className="text-[11px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight hidden sm:block ${
                  step.done ? "text-emerald-600" : step.current ? "text-[#111]" : "text-[#BBB]"
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 -mt-4 ${step.done ? "bg-emerald-300" : "bg-[#E8E8E8]"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#888] mt-2 font-light hidden sm:block">
          Step 1 of 4 complete. Watch the recording next to see every slide brought to life.
        </p>
      </div>
    </div>
  );
}

function ChecklistSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm mt-6">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mb-0.5">Free Resource</p>
            <h3 className="text-[16px] font-bold text-white leading-tight">
              The Cold Email Checklist
            </h3>
            <p className="text-[12px] text-emerald-200/80 font-light mt-0.5">
              10 steps. Use this before you send a single email.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#F0F0F0]">
        {CHECKLIST.map((item) => (
          <div key={item.step} className="group">
            <button
              onClick={() => setExpanded(expanded === item.step ? null : item.step)}
              className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-700">{item.step}</span>
              </div>
              <span className="flex-1 text-[13px] font-semibold text-[#111] leading-snug">{item.title}</span>
              {expanded === item.step ? (
                <ChevronUp className="w-4 h-4 text-[#999] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#BBB] flex-shrink-0 group-hover:text-[#999]" />
              )}
            </button>
            {expanded === item.step && (
              <div className="px-5 pb-4 pt-0">
                <div className="ml-9 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <p className="text-[12px] text-emerald-900 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-[#FAFAFA] border-t border-[#F0F0F0]">
        <p className="text-[11px] text-[#888] font-light text-center">
          Students who used this checklist sent their first batch within 48 hours of the webinar.
        </p>
      </div>
    </div>
  );
}

function LockedRecordingSection() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4.5 h-4.5 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Step 2</p>
            <h3 className="text-[16px] font-bold text-white leading-tight">Watch the Full Recording</h3>
            <p className="text-[12px] text-white/50 font-light mt-0.5">90 minutes. Nothing held back.</p>
          </div>
          <div className="ml-auto flex-shrink-0 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Locked</p>
          </div>
        </div>
      </div>

      {/* Blurred video thumbnail */}
      <div className="relative bg-[#0A0A0A] overflow-hidden" style={{ paddingBottom: "40%" }}>
        {/* Dark blurred overlay suggesting video content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#111]" />
          {/* Fake video chapter bars */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex gap-1">
            {[35, 20, 28, 18, 25, 22, 30, 24, 20, 18].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded-full bg-white/20"
                style={{ width: `${w}px`, opacity: i < 3 ? 0.5 : 0.15 }}
              />
            ))}
          </div>
          {/* Blurred play button */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
              style={{ filter: "blur(2px)" }}
            >
              <Play className="w-6 h-6 text-white/50 ml-0.5" />
            </div>
            <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
              <p className="text-[11px] text-white/70 font-semibold">Unlock to watch</p>
            </div>
          </div>
          {/* Chapter labels fading in background */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 gap-1.5" style={{ filter: "blur(3px)", opacity: 0.25 }}>
            {["Why Cold Email Works", "Finding Firms with Apollo.io", "The 5-Part Template", "Mail Merge Setup"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white/30" />
                <p className="text-[12px] text-white font-semibold">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof + CTA */}
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-900 leading-relaxed font-medium">
              Students who bought the recording sent their first cold emails within{" "}
              <strong>48 hours</strong>. Students who only viewed the slides averaged 11 days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {[
            "See every slide explained live, step by step",
            "Live Apollo.io screen share from scratch",
            "Mail Merge setup in real time with Uthman",
            "The exact 9:03 AM rule and why it works",
            "Real student Q&A: 20 minutes of edge cases",
            "The follow-up template word for word",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[12px] text-[#444] leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Price anchor */}
        <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-4 mb-5 text-center">
          <p className="text-[12px] text-[#666] font-light">
            1-on-1 career coaching: <span className="line-through text-[#999]">£59/hr</span>
            <span className="text-[#111] font-bold ml-1">This entire system: £10</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/portal/upgrade"
            className="flex-1 bg-[#111] text-white text-center text-[13px] font-bold py-3.5 rounded-xl hover:bg-[#333] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Get the Recording - £10
          </Link>
          <Link
            to="/portal/upgrade"
            className="flex-1 border border-[#CCC] text-[#111] text-center text-[13px] font-semibold py-3.5 rounded-xl hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Recording + Guide - £29
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <p className="text-[11px] text-[#999]">
            Not useful? Email us within 24 hours for a full refund.
          </p>
        </div>
      </div>
    </div>
  );
}

function LockedBlueprintSection() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm mt-6">
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-950 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-white/60" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Step 3</p>
            <h3 className="text-[16px] font-bold text-white leading-tight">The Cold Email Blueprint</h3>
            <p className="text-[12px] text-white/50 font-light mt-0.5">
              47 templates. 200 UK firms. Full execution guide.
            </p>
          </div>
          <div className="ml-auto flex-shrink-0 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Locked</p>
          </div>
        </div>
      </div>

      {/* Chapter preview - visible but locked */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[11px] font-bold text-[#999] uppercase tracking-wider mb-3">What's inside</p>
        <div className="space-y-2">
          {BLUEPRINT_CHAPTERS.map((ch, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                idx < 2
                  ? "border-[#E8E8E8] bg-[#FAFAFA]"
                  : "border-[#F0F0F0] bg-[#FAFAFA] opacity-50"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#E8E8E8] flex items-center justify-center flex-shrink-0">
                {idx < 2 ? (
                  <span className="text-[9px] font-bold text-[#666]">{idx + 1}</span>
                ) : (
                  <Lock className="w-2.5 h-2.5 text-[#AAA]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#111] truncate">{ch.title}</p>
                {idx < 2 ? (
                  <p className="text-[11px] text-[#888] font-light leading-tight mt-0.5">{ch.teaser}</p>
                ) : (
                  <p className="text-[11px] text-[#BBB] font-light leading-tight mt-0.5">Unlock to read</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pt-4 pb-5">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { num: "47", label: "Email templates" },
            { num: "200", label: "UK firms listed" },
            { num: "50+", label: "Pages of strategy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl py-3">
              <p className="text-[18px] font-black text-[#111]">{stat.num}</p>
              <p className="text-[10px] text-[#888] font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <Link
          to="/portal/upgrade"
          className="block w-full bg-[#111] text-white text-center text-[13px] font-bold py-3.5 rounded-xl hover:bg-[#333] transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Unlock Recording + Blueprint - £29
        </Link>
        <p className="text-[11px] text-[#999] text-center mt-2 font-light">
          Includes the full recording and every template.
        </p>
      </div>
    </div>
  );
}

function LockedCoachingSection() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm mt-6">
      <div className="px-6 py-5 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-0.5">Step 4</p>
            <h3 className="text-[16px] font-bold text-emerald-900 leading-tight">1-on-1 Coaching with Uthman</h3>
            <p className="text-[12px] text-emerald-700/70 font-light mt-0.5">He'll review your emails and fix them.</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Scarcity */}
        <div className="bg-white border border-emerald-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[12px] font-bold text-emerald-800">Limited availability</p>
          </div>
          <p className="text-[12px] text-emerald-700 font-light leading-relaxed">
            Uthman only takes <strong>5 coaching students per week</strong>. Sessions book up
            quickly around application season.
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { icon: MessageSquare, text: "Uthman reads your draft emails and rewrites them live" },
            { icon: TrendingUp, text: "He audits your lead list and tells you who to target first" },
            { icon: Zap, text: "You leave with a complete, send-ready campaign" },
            { icon: Calendar, text: "30-min Strategy Call (£35) or 60-min Deep Dive (£59)" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <p className="text-[12px] text-emerald-800 font-light leading-snug">{text}</p>
            </div>
          ))}
        </div>

        {/* Inline testimonial */}
        <div className="bg-white/80 border border-emerald-100 rounded-xl p-4 mb-5">
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-[12px] text-emerald-800 font-light italic leading-relaxed">
            "I had the guide and thought I knew what I was doing. One call with Uthman and he found 5 things
            in my emails I was doing wrong. Got 4 replies the week after."
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">Priya M., LSE 2nd Year</p>
        </div>

        <a
          href={CAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-600 text-white text-center text-[13px] font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Book a Session with Uthman
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-[11px] text-emerald-700/60 text-center mt-2 font-light">
          Strategy Call from £35 - Deep Dive from £59
        </p>
      </div>
    </div>
  );
}

function ResultsSection() {
  return (
    <div className="mt-8">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { num: "107", label: "attended live", sub: "from 8 universities" },
          { num: "23", label: "sent emails", sub: "within 2 weeks" },
          { num: "8", label: "got replies", sub: "within 30 days" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#E8E8E8] rounded-2xl p-4 text-center shadow-sm">
            <p className="text-[24px] font-black text-[#111] leading-none">{stat.num}</p>
            <p className="text-[11px] font-semibold text-[#555] mt-1">{stat.label}</p>
            <p className="text-[10px] text-[#AAA] font-light mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[12px] text-[#444] font-light italic leading-relaxed mb-4 flex-1">
              "{t.text}"
            </p>
            <div className="border-t border-[#F0F0F0] pt-3 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-[#111]">{t.name}</p>
                <p className="text-[11px] text-[#999]">{t.uni}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1">
                <p className="text-[10px] font-bold text-emerald-700">{t.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Sticky CTA bar ─── */

function StickyUpgradeBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6">
      <div className="max-w-2xl mx-auto bg-[#111] text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-3 border border-white/10">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold leading-snug">
            Get the recording + full guide for{" "}
            <span className="text-emerald-400">£29</span>
          </p>
          <p className="text-[11px] text-white/50 font-light mt-0.5 leading-tight">
            47 templates, 200 firms, 90-min walkthrough. Everything you need to send today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/portal/upgrade"
            className="bg-white text-[#111] text-[12px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#F0F0F0] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            Get Full Access
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/40 hover:text-white/70 text-[11px] font-medium transition-colors whitespace-nowrap px-1"
            aria-label="Dismiss"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar value ladder ─── */

function ValueLadderSidebar() {
  return (
    <div className="space-y-4">
      {/* What's in the recording */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#111] px-5 py-4">
          <h3 className="text-[13px] font-bold text-white uppercase tracking-wide">In the recording</h3>
          <p className="text-[11px] text-[#AAA] mt-0.5 font-light">90 minutes. Uthman on screen.</p>
        </div>
        <div className="p-4 space-y-2.5">
          {[
            "Why cold email works when everything else fails",
            "Finding decision-maker emails via Apollo.io",
            "The 5-part template that gets replies",
            "The 9:03 AM rule for better open rates",
            "Personalised first lines in 2 minutes",
            "Mail Merge setup step by step",
            "Follow-up sequences that double reply rate",
            "Live Q&A: real scenarios answered",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#F5F5F5] border border-[#E8E8E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-[#888]">{idx + 1}</span>
              </div>
              <span className="text-[12px] text-[#444] leading-snug">{item}</span>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <Link
            to="/portal/upgrade"
            className="block w-full bg-[#111] text-white text-center text-[13px] font-bold py-3 rounded-xl hover:bg-[#333] transition-colors"
          >
            Watch the Recording - £10
          </Link>
        </div>
      </div>

      {/* Value ladder */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
        <p className="text-[11px] font-bold text-[#999] uppercase tracking-wider mb-4">The full system</p>
        <div className="space-y-2.5">
          {/* Tier 1 - current (free) */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Presentation className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-emerald-900">Slides + Checklist</p>
              <p className="text-[11px] text-emerald-700">You are here</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">Free</span>
          </div>

          {/* Tier 2 */}
          <div className="flex items-center gap-3 p-3 bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111]">Recording</p>
              <p className="text-[11px] text-[#888]">Live walkthrough, 90 min</p>
            </div>
            <span className="text-[11px] font-bold text-[#555] bg-white border border-[#E0E0E0] px-2 py-0.5 rounded-full flex-shrink-0">£10</span>
          </div>

          {/* Tier 3 - best value */}
          <div className="flex items-center gap-3 p-3 bg-[#F8F8F8] border-2 border-[#111] rounded-xl relative">
            <div className="absolute -top-2.5 left-3">
              <span className="bg-[#111] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Best value</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#444] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111]">Recording + Guide</p>
              <p className="text-[11px] text-[#888]">Templates, tracker, 200 firms</p>
            </div>
            <span className="text-[11px] font-bold text-[#111] bg-white border border-[#DDD] px-2 py-0.5 rounded-full flex-shrink-0">£29</span>
          </div>

          {/* Tier 4 */}
          <div className="flex items-center gap-3 p-3 bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-white">1:1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111]">Coaching</p>
              <p className="text-[11px] text-[#888]">Uthman reviews your emails</p>
            </div>
            <span className="text-[11px] font-bold text-[#555] bg-white border border-[#E0E0E0] px-2 py-0.5 rounded-full flex-shrink-0">£35+</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
          <Link
            to="/portal/upgrade"
            className="block w-full bg-[#111] text-white text-center text-[12px] font-bold py-2.5 rounded-xl hover:bg-[#333] transition-colors mb-2"
          >
            Get Recording + Guide - £29
          </Link>
          <Link
            to="/portal/upgrade"
            className="block w-full border border-[#DDD] text-[#555] text-center text-[12px] font-medium py-2.5 rounded-xl hover:bg-[#F5F5F5] transition-colors"
          >
            Just the Recording - £10
          </Link>
        </div>
      </div>

      {/* Loss aversion nudge */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
        <p className="text-[11px] font-bold text-[#999] uppercase tracking-wider mb-3">The cost of waiting</p>
        <div className="space-y-3">
          {[
            { icon: Calendar, text: "Spring week applications are open now. First-mover advantage is real." },
            { icon: TrendingUp, text: "Every week you wait is a week of applications someone else is sending." },
            { icon: Users, text: "107 students attended this webinar. The ones who acted got replies." },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5">
              <Icon className="w-3.5 h-3.5 text-[#999] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#666] font-light leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */

class SlidesErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <pre className="text-xs text-left bg-red-50 p-4 rounded-lg overflow-auto max-h-60 text-red-800">{this.state.error.message}{'\n'}{this.state.error.stack}</pre>
            <button onClick={() => window.location.reload()} className="mt-4 bg-[#111] text-white px-4 py-2 rounded-lg text-sm">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SlidesPageInner() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { user, loading } = useAuth();

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-[#999] text-sm">Loading...</div>
      </div>
    );
  }

  /* ─── Signup gate: show teaser then require free account ─── */
  if (!user) {
    return (
      <div
        className="min-h-screen bg-[#FAFAFA] flex flex-col"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <div className="bg-white border-b border-[#E8E8E8] px-5 py-3.5 flex items-center justify-between">
          <Logo to="/" className="text-lg" />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-4 py-1.5 rounded-full">
              <Presentation className="w-4 h-4" /> FREE ACCESS
            </div>

            <h1 className="text-3xl font-bold text-[#111] tracking-tight leading-tight">
              Uthman's Cold Email Slides
            </h1>

            <p className="text-[15px] text-[#555] leading-relaxed">
              1,062 cold emails. 223 responses. 20 offers in 3 weeks. Get the exact slides from the live webinar that 150+ students attended.
            </p>

            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-3">
                <div className="text-xl font-bold text-[#111]">107</div>
                <div className="text-[11px] text-[#888]">Students attended</div>
              </div>
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-3">
                <div className="text-xl font-bold text-[#111]">23</div>
                <div className="text-[11px] text-[#888]">Sent cold emails</div>
              </div>
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-3">
                <div className="text-xl font-bold text-[#111]">8</div>
                <div className="text-[11px] text-[#888]">Got responses</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/signup?redirect=/portal/slides"
                className="block w-full bg-[#111] text-white text-[14px] font-semibold py-3.5 rounded-xl hover:bg-[#222] transition-colors"
              >
                Create free account to access
              </Link>
              <Link
                to="/login?redirect=/portal/slides"
                className="block text-[13px] text-[#888] hover:text-[#555] transition-colors"
              >
                Already have an account? Log in
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 text-[12px] text-[#999]">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% free</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> No card required</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Instant access</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] pb-28"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
    >
      {/* Top bar */}
      <div className="bg-white border-b border-[#E8E8E8] px-5 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo to="/" className="text-lg" />
          <span className="text-[13px] font-light text-[#999] tracking-tight hidden sm:block">
            Cold Email
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/portal/upgrade"
            className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-[#555] hover:text-[#111] transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Recording - £10
          </Link>
          <Link
            to="/portal/upgrade"
            className="bg-[#111] text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-1.5"
          >
            Full Access - £29
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Social proof banner */}
      <div className="bg-emerald-600 text-white text-center py-2.5 px-4">
        <p className="text-[12px] font-semibold tracking-wide">
          107 students attended live. 23 sent cold emails within 2 weeks. 8 landed responses.
          LSE, Warwick, UCL, Bristol, Imperial.
        </p>
      </div>

      {/* Progress steps */}
      <ProgressSteps />

      {/* Page header */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 py-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Presentation className="w-4 h-4 text-violet-600" />
            <span className="text-[12px] font-bold text-violet-700 uppercase tracking-wider">Step 1 of 4 - Free</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111] tracking-tight leading-tight">
            Cold Email Masterclass: The Slides
          </h1>
          <p className="text-[15px] text-[#666] mt-2 font-light max-w-2xl leading-relaxed">
            The complete slide deck from Uthman's 90-minute live session. Use the checklist below
            to start sending. Watch the recording to see every step executed live.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-3 py-1.5">
              <span className="text-[11px] text-[#666] font-medium">Free to view</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-3 py-1.5">
              <span className="text-[11px] text-[#666] font-medium">90-min masterclass</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-3 py-1.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-[#666] font-medium">5.0 from attendees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* Left: Main content column */}
          <div className="flex-1 min-w-0">

            {/* Slides viewer */}
            <div className="bg-[#111] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#1A1A1A] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="ml-3 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded text-[11px] text-white/40">
                  <Presentation className="w-3 h-3" />
                  Cold Email Masterclass Slides
                </div>
              </div>
              <div className="relative" style={{ paddingBottom: "66.25%" }}>
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin mb-3" />
                    <p className="text-[12px] text-white/40">Loading slides...</p>
                  </div>
                )}
                <iframe
                  src={SLIDES_EMBED_URL}
                  className="absolute inset-0 w-full h-full border-0"
                  onLoad={() => setIframeLoaded(true)}
                  title="Cold Email Masterclass Slides"
                  allow="autoplay; fullscreen"
                />
              </div>
            </div>

            {/* Free checklist */}
            <ChecklistSection />

            {/* Results / social proof */}
            <ResultsSection />

            {/* Locked: recording */}
            <LockedRecordingSection />

            {/* Locked: blueprint guide */}
            <LockedBlueprintSection />

            {/* Locked: coaching */}
            <LockedCoachingSection />

          </div>

          {/* Right: Value ladder sidebar */}
          <div className="xl:w-[300px] flex-shrink-0">
            <div className="xl:sticky xl:top-[130px]">
              <ValueLadderSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky upgrade bar */}
      <StickyUpgradeBar />
    </div>
  );
}


export default function SlidesPage() {
  return (
    <SlidesErrorBoundary>
      <SlidesPageInner />
    </SlidesErrorBoundary>
  );
}
