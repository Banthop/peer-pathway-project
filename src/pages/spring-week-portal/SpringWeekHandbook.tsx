import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { STRIPE_SW_BUNDLE, STRIPE_SW_PREMIUM } from "@/data/springWeekData";

// --------------- Data ---------------

interface ActionItem {
  text: string;
  tip?: string; // EarlyEdge tip callout
}

interface SubSection {
  title: string;
  items: ActionItem[];
  table?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
}

interface Phase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  sections: SubSection[];
}

const HANDBOOK_PHASES: Phase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "Pre-Spring Week Preparation",
    subtitle: "What to do before you arrive",
    sections: [
      {
        title: "A: Have the Right Conversations",
        items: [
          { text: "Email your recruiter to confirm logistics: dress code, start time, building access" },
          { text: "Research the 2-3 seniors you know will be on your desk" },
          { text: "Prepare 3 tailored questions for your manager based on their deal history" },
          { text: "Reach out to any alumni who've done the spring week at the same firm" },
          {
            text: "Practice your 60-second personal story: who you are, why this firm, why finance",
            tip: "Don't start with your degree. Start with the moment you decided finance was for you. It's more memorable.",
          },
          { text: "Book a mock networking conversation with a friend the week before" },
        ],
      },
      {
        title: "B: Build Your Technical Foundations",
        items: [
          { text: "Refresh your understanding of DCF and LBO modelling basics" },
          { text: "Know the 3 financial statements and how they link" },
          { text: "Read the firm's most recent annual report: key metrics, strategy priorities" },
          {
            text: "Learn 1-2 recent deals the firm has announced and be ready to discuss them",
            tip: "Look at the firm's press releases from the last 6 months. Pick the deal that most interests you and prepare a 30-second view on why it was smart.",
          },
          { text: "Brush up on current macro context: interest rates, M&A market, key themes" },
        ],
        table: {
          caption: "Technical focus by division",
          headers: ["Division", "Must-know topics", "Nice to know"],
          rows: [
            ["Investment Banking", "DCF, LBO, comps, deal structures", "Leveraged finance, restructuring basics"],
            ["Sales & Trading", "Options P&L, Greeks, macro drivers", "Rates products, credit spreads"],
            ["Asset Management", "Portfolio construction, factor models", "ESG frameworks, alternatives"],
            ["Consulting", "MECE, issue trees, case maths", "Industry-specific KPIs"],
            ["Audit / Tax", "Audit methodology, IFRS basics", "Transfer pricing, VAT"],
            ["Quant / Tech", "Probability, statistics, coding basics", "ML concepts, backtesting"],
          ],
        },
      },
      {
        title: "C: Build Awareness and Prepare Questions",
        items: [
          { text: "Read 3 industry pieces the week before (FT, Bloomberg, WSJ)" },
          { text: "Identify the firm's key competitors and how the firm differentiates" },
          { text: "Understand the team structure you'll be sitting in" },
          {
            text: "Prepare 5 questions you actually want answered - not performative ones",
            tip: "The best questions show you've done research. 'What's the biggest misconception about your team from the outside?' always lands well.",
          },
          { text: "Know the firm's culture values and have 1 example that aligns with each" },
          { text: "Follow 2-3 seniors on LinkedIn and note anything recent they've published" },
        ],
      },
      {
        title: "D: Logistics and Mindset",
        items: [
          { text: "Plan your route to the office: know the entry, floor, and who to ask for" },
          { text: "Prepare your outfit the night before - business formal unless told otherwise" },
          {
            text: "Set two alarms. Arrive 10 minutes early, not 30",
            tip: "Arriving 30+ minutes early creates awkwardness for the hosts. 10 minutes is the sweet spot - professional, not anxious.",
          },
          { text: "Charge your phone and laptop fully the night before" },
          { text: "Write down 3 things you want to accomplish by the end of the week" },
          { text: "Remind yourself: everyone around you is also trying to impress. Breathe." },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    number: 2,
    title: "During the Spring Week",
    subtitle: "Day-to-day execution",
    sections: [
      {
        title: "A: Daily Non-Negotiables",
        items: [
          { text: "Be the first one in and last to leave your cohort - not the building" },
          {
            text: "Write down 3 names every day: one senior, one peer, one person you want to follow up with",
            tip: "Use the Notes app, not a physical notebook. You'll thank yourself when you're writing follow-up emails at 10pm.",
          },
          { text: "Contribute at least once in every group setting. Quality over quantity." },
          { text: "Ask your buddy or line manager for feedback at the end of day 2 and day 4" },
          { text: "Eat lunch with different people each day. Don't always sit with your cohort." },
          { text: "Review your 3 goals each morning. One sentence each." },
        ],
      },
      {
        title: "B: Building Relationships",
        items: [
          { text: "Introduce yourself to 2 people outside your immediate desk every day" },
          {
            text: "Have at least one 1-on-1 conversation with a senior analyst or associate each day",
            tip: "Ask them about their career path - not their deals. People love talking about their own journey and it's far more memorable than discussing tombstones.",
          },
          { text: "Remember personal details: spouse, kids, hobbies. Reference them later." },
          { text: "Send a short thank-you LinkedIn connection request to anyone who spent real time with you" },
          { text: "Don't talk about other firms you're interviewing with. Ever." },
          { text: "Be the person who makes the group project easier, not just the loudest voice" },
        ],
      },
      {
        title: "C: Evening Reflection Routine",
        items: [
          { text: "Write 3 bullet points: what went well, what you'd improve, one insight from the day" },
          { text: "Send any follow-up emails before 10pm while it's still same-day" },
          {
            text: "Draft your next morning's conversation starters based on today's news or firm updates",
            tip: "Set a Google Alert for the firm name. Check it every morning at breakfast. Referencing a same-day news piece is an immediate differentiator.",
          },
          { text: "Review your relationship tracker: who did you speak to, what did you learn" },
          { text: "Get 7+ hours sleep. Performance compounds over the week." },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    number: 3,
    title: "The Conversion Assessment Centre",
    subtitle: "The final hurdle",
    sections: [
      {
        title: "A: Group Case Study",
        items: [
          { text: "Read the brief fully before saying anything. Others won't. Use that." },
          {
            text: "Structure your initial recommendation within the first 2 minutes of group discussion",
            tip: "You don't need to be right. You need to move the group forward. 'I suggest we tackle X first because it unlocks Y' shows leadership without arrogance.",
          },
          { text: "Invite quiet group members in: 'Alex, you haven't had a chance to share your view'" },
          { text: "Manage the clock audibly: 'We have 8 minutes left, let's make sure we hit the recommendation'" },
          { text: "Don't dominate - assessors are counting your airtime ratio against peers" },
          { text: "Summarise the group's conclusion confidently in the last 60 seconds if no one does" },
          { text: "Use a clear framework: Problem - Analysis - Recommendation - Risks" },
        ],
        table: {
          caption: "AC focus areas by firm type",
          headers: ["Firm type", "Key AC format", "What they're testing"],
          rows: [
            ["Bulge Bracket IBD", "Group case + senior interview", "Leadership, commercial instinct"],
            ["Boutique", "1-on-1 interviews + deal discussion", "Technical depth, intellectual curiosity"],
            ["S&T", "Markets quiz + group discussion", "Risk awareness, quick thinking"],
            ["Consulting", "Case study + fit interview", "Structure, communication, poise"],
            ["Big 4", "Group exercise + partner interview", "Collaboration, ethics, professionalism"],
          ],
        },
      },
      {
        title: "B: Senior Interviews",
        items: [
          {
            text: "Open with energy. Your body language in the first 10 seconds sets the tone.",
            tip: "Stand up when your interviewer enters (if in-person). Shake hands. Smile. It sounds basic but most candidates sit passively and let the interviewer lead.",
          },
          { text: "Use the STAR method for all competency questions: Situation, Task, Action, Result" },
          { text: "Have 3 firm-specific reasons ready: why this firm over Goldman, JPMorgan, etc." },
          { text: "Prepare for 'Tell me about a deal you'd pitch us' - have a real answer, not a textbook one" },
          { text: "End every interview with a genuine question - not 'What's the culture like'" },
          { text: "Send a thank-you email within 2 hours of finishing" },
        ],
      },
      {
        title: "C: Maths Test",
        items: [
          {
            text: "Practice mental arithmetic: percentages, ratios, multiples, basis points",
            tip: "The maths test is about speed and composure under pressure. Do 10 minutes of mental maths every morning in the week before the AC.",
          },
          { text: "Know key multiples by sector: tech (20-30x EV/EBITDA), banking (8-12x P/E), retail (6-10x)" },
          { text: "If you get stuck, narrate your reasoning. Assessors credit process, not just answer." },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    number: 4,
    title: "After the Spring Week",
    subtitle: "Locking in the return offer",
    sections: [
      {
        title: "A: Immediate Follow-Up",
        items: [
          {
            text: "Email your line manager within 24 hours: 3 sentences - grateful, specific, forward-looking",
            tip: "Mention one specific thing they said or did that helped you. 'Your comment about XYZ on day 2 really reframed how I thought about the sector' is far more powerful than 'Thank you for your time.'",
          },
          { text: "Connect on LinkedIn with every senior who spent real time with you" },
          { text: "Write down every firm, every name, and every conversation while it's fresh" },
          { text: "Send a brief note to HR confirming your continued interest in a return offer" },
        ],
      },
      {
        title: "B: Ongoing Relationship Building",
        items: [
          { text: "Message 1-2 seniors per month with something relevant: an article, a deal, a market view" },
          {
            text: "If you're waiting on a decision, follow up once after 2 weeks - politely, directly",
            tip: "Subject line: 'Spring Week follow-up - [Your Name]'. One paragraph. Don't apologise for emailing. You're demonstrating the same persistence that makes a good banker.",
          },
          { text: "Stay visible on LinkedIn: comment on the firm's posts, share relevant content" },
          { text: "If you get a return offer, respond within 24 hours even if you need more time to decide" },
        ],
      },
    ],
  },
];

// --------------- Phase badge colours ---------------

const PHASE_COLORS = [
  { border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  { border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
];

// --------------- Sub-components ---------------

function TipCallout({ tip }: { tip: string }) {
  return (
    <div className="mt-2 flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
      <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-[12px] text-amber-800 leading-relaxed font-light">
        <span className="font-semibold">EarlyEdge tip:</span> {tip}
      </p>
    </div>
  );
}

function DataTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-[#E8E8E8]">
      <table className="w-full text-[12px]">
        <caption className="text-[11px] text-[#AAA] text-left px-3 py-1.5 font-medium uppercase tracking-wider border-b border-[#F0F0F0]">
          {caption}
        </caption>
        <thead>
          <tr className="bg-[#F8F8F8] border-b border-[#F0F0F0]">
            {headers.map((h) => (
              <th key={h} className="text-left px-3 py-2 font-semibold text-[#555]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-[#666] border-t border-[#F5F5F5]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhaseBlock({ phase, colorIndex }: { phase: Phase; colorIndex: number }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "0": true });
  const colors = PHASE_COLORS[colorIndex % PHASE_COLORS.length];

  const toggle = (idx: number) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className={`bg-white border ${colors.border} rounded-2xl overflow-hidden shadow-sm`}>
      {/* Phase header */}
      <div className="px-6 py-5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <span className={`${colors.badge} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
            Phase {phase.number}
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-[#111]">{phase.title}</h2>
            <p className="text-[12px] text-[#888] font-light">{phase.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-[#F5F5F5]">
        {phase.sections.map((section, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="text-[13px] font-semibold text-[#222]">{section.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#AAA]">{section.items.length} items</span>
                {openSections[idx]
                  ? <ChevronUp className="w-4 h-4 text-[#AAA]" />
                  : <ChevronDown className="w-4 h-4 text-[#AAA]" />
                }
              </div>
            </button>

            {openSections[idx] && (
              <div className="px-6 pb-5 space-y-2">
                {section.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${colors.dot.replace("bg-", "text-")}`} />
                      <p className="text-[13px] text-[#333] leading-relaxed">{item.text}</p>
                    </div>
                    {item.tip && <TipCallout tip={item.tip} />}
                  </div>
                ))}

                {section.table && (
                  <DataTable
                    caption={section.table.caption}
                    headers={section.table.headers}
                    rows={section.table.rows}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------- Paywall ---------------

function HandbookPaywall() {
  const navigate = useNavigate();

  const PREVIEW_ITEMS = [
    "Email your recruiter to confirm logistics: dress code, start time, building access",
    "Research the 2-3 seniors you know will be on your desk",
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-8 md:px-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#BBB] rounded-full" />
            <p className="text-xs text-[#888] font-bold uppercase tracking-wider">Spring Week Handbook</p>
          </div>
          <h1 className="text-2xl font-bold text-[#111]">Spring Week Handbook</h1>
          <p className="text-[14px] text-[#666] mt-1.5 font-light">
            Your complete guide to converting your spring week into a return offer.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-8 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "4", label: "Phases" },
            { value: "60+", label: "Action Items" },
            { value: "6", label: "Division Guides" },
            { value: "45+", label: "Firms Covered" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E8E8E8] rounded-xl p-3 text-center">
              <p className="text-xl font-black text-[#111]">{stat.value}</p>
              <p className="text-[11px] text-[#888] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Preview section */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Preview - Phase 1A
            </span>
          </div>
          <div className="px-6 py-4 space-y-2">
            {PREVIEW_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <p className="text-[13px] text-[#333] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          {/* Blurred rows */}
          <div className="relative px-6 pb-4 space-y-2 overflow-hidden">
            <div className="space-y-2 blur-sm select-none pointer-events-none">
              {[
                "Prepare 3 tailored questions for your manager based on their deal history",
                "Reach out to any alumni who've done the spring week at the same firm",
                "Practice your 60-second personal story",
                "Book a mock networking conversation with a friend",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                  <p className="text-[13px] text-[#333] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Lock notice */}
          <div className="px-6 pb-6 pt-2 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#AAA]" />
              <p className="text-[12px] text-[#888]">The full handbook is locked to Bundle and Premium</p>
            </div>
          </div>
        </div>

        {/* Paywall CTA */}
        <div className="bg-[#111] rounded-2xl p-7 space-y-4">
          <div>
            <p className="text-white font-bold text-lg leading-tight">Unlock the full handbook</p>
            <p className="text-[#888] text-[13px] mt-1.5 font-light leading-relaxed">
              4 Phases, 60+ Action Items, 6 Division Guides, 45+ firm-specific intel. Everything you
              need to convert your spring week into a return offer.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px] text-[#666]">
            {[
              "Phase 1: Pre-week preparation",
              "Phase 2: Daily execution",
              "Phase 3: Assessment Centre",
              "Phase 4: Follow-up strategy",
              "Division-specific tables",
              "EarlyEdge insider tips",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#555] flex-shrink-0" />
                <span className="text-[#888]">{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            <a
              href={STRIPE_SW_BUNDLE}
              className="block w-full py-3 rounded-xl bg-white text-[#111] text-[13px] font-bold text-center hover:bg-[#F5F5F5] transition-colors"
            >
              Upgrade to Bundle - 39
            </a>
            <a
              href={STRIPE_SW_PREMIUM}
              className="block w-full py-3 rounded-xl border border-emerald-500 text-emerald-400 text-[13px] font-semibold text-center hover:bg-emerald-500/10 transition-colors"
            >
              Premium (Bundle + 1 free match) - 64
            </a>
            <button
              onClick={() => navigate("/spring-week-portal/upgrade")}
              className="w-full py-2.5 text-[12px] text-[#666] hover:text-[#999] transition-colors"
            >
              Compare all tiers
              <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------- Main component ---------------

export default function SpringWeekHandbook() {
  const access = useSwAccess();

  if (!access.hasHandbook) {
    return <HandbookPaywall />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-8 md:px-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Spring Week Handbook</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111] leading-tight">Spring Week Handbook</h1>
          <p className="text-[14px] text-[#666] mt-1.5 font-light">
            Your complete guide to converting your spring week into a return offer.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              { value: "4", label: "Phases" },
              { value: "60+", label: "Action Items" },
              { value: "6", label: "Division Guides" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className="text-lg font-black text-[#111]">{stat.value}</span>
                <span className="text-[12px] text-[#888]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading tip */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-6">
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-800 font-light leading-relaxed">
            Click any section header to expand or collapse it. EarlyEdge tips appear highlighted
            in amber - these are the insights most students miss.
          </p>
        </div>
      </div>

      {/* Phases */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-6 space-y-5">
        {HANDBOOK_PHASES.map((phase, idx) => (
          <PhaseBlock key={phase.id} phase={phase} colorIndex={idx} />
        ))}
      </div>

      {/* Footer CTA - coaching */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-10">
        <div className="bg-gradient-to-r from-[#111] to-[#222] rounded-2xl p-7 text-center space-y-3">
          <p className="text-white font-bold text-[15px]">Want someone to walk through this with you?</p>
          <p className="text-[#888] text-[13px] font-light">
            Book a 1-on-1 coaching session with a speaker who's already converted at your firm.
          </p>
          <a
            href="/spring-week-portal/coaching"
            className="inline-block mt-1 px-6 py-2.5 rounded-xl bg-white text-[#111] text-[13px] font-bold hover:bg-[#F5F5F5] transition-colors"
          >
            Book coaching
          </a>
        </div>
      </div>
    </div>
  );
}
