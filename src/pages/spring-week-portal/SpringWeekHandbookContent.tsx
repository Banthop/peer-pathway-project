import { useState, useRef, useMemo } from "react";
import { ChevronDown, ChevronRight, Building2, User, Clock, MapPin, Lock, ArrowRight } from "lucide-react";

// --------------- Types ---------------

interface FirmEntry {
  id: string;
  firm: string;
  speaker: string;
  speakerConverted?: string;
  division: string;
  category: "ib" | "markets" | "multi";
  structure: string;
  dayByDay: string;
  keyActivities: string;
  culture: string;
  insiderTips: string;
  howToPrepare: string;
  assessment?: string;
}

// --------------- Firm data ---------------

const FIRMS: FirmEntry[] = [
  {
    id: "jane-street",
    firm: "Jane Street",
    speaker: "Joel",
    division: "Trading / Quant",
    category: "markets",
    structure:
      "There are no division allocations at Jane Street. Everyone rotates through quant trading, cognitive development, and SMP (strategy and product). The programme is designed to expose you to how the firm actually thinks, not to slot you into a desk.",
    dayByDay:
      "The week is built around market-making games, probability puzzles, and trading simulations. You will spend time in sessions on trading psychology and applied statistics, with firm-wide talks from senior traders. There is also an office tour where you get a feel for the pace and personality of the floor.",
    keyActivities:
      "Market-making games are the centrepiece. You will also work through probability and expected value problems, attend talks on statistics and trading psychology, and tour the trading floor. The firm famously employs some of the sharpest quantitative minds in the world, including the world's top female poker player who works as a quant trader.",
    culture:
      "Fast-paced, intellectually intense, and deeply meritocratic. Jane Street rewards speed of thought and genuine curiosity. The atmosphere is competitive but collaborative. People enjoy solving hard problems together.",
    insiderTips:
      "The interviews and games are heavily focused on expected value and probability. If you are not comfortable with these concepts, you will struggle. Practice market-making games before you arrive. The firm values clear, logical reasoning over flashy answers.",
    howToPrepare:
      "Drill probability and expected value problems until they feel natural. Play market-making simulation games online. Brush up on basic statistics and combinatorics. Jane Street cares less about financial knowledge and more about how you think under uncertainty.",
  },
  {
    id: "bank-of-america",
    firm: "Bank of America",
    speaker: "Joel and Indiana",
    division: "Global Markets / GPS / Credit",
    category: "multi",
    structure:
      "The spring week runs Monday to Friday. Day 1 is a general introduction with no division allocation. Days 2 and 3 place you in your first and second choice divisions respectively. Day 4 is a preparation day. Day 5 is the assessment centre. You are assigned a mentor before and during the week.",
    dayByDay:
      "Day 1 covers how the bank makes money across its divisions. Days 2-3 are full immersion in your preferred divisions: Excel activities, Amplify Me simulations, case studies, and networking with desk members. Day 4 is set aside for AC preparation. Day 5 is the assessment centre itself.",
    keyActivities:
      "Trading examinations, quizzes on markets (futures, options, derivatives), Amplify Me simulations, Excel-based activities, case studies, and structured networking sessions. The mentor relationship is a key part of the experience.",
    culture:
      "Less cutthroat than some American banks, but still intense. Bank of America is big on internal mobility, so people move between divisions more freely than at many competitors. The GPS and Credit divisions have a collaborative feel.",
    insiderTips:
      "Know which division you want to interview for before the spring week starts. The AC is on Friday, so if you have already identified your target division, you can spend Day 4 preparing specifically for that interview. Do not leave this decision until the last minute.",
    howToPrepare:
      "Understand the basics of futures, options, and derivatives if you are targeting Global Markets. For GPS or Credit, focus on how the bank structures its lending and advisory businesses. Have a clear view on why you prefer one division over another.",
    assessment:
      "The AC takes place on Day 5. Format varies by division but typically includes competency interviews, a technical component, and a group exercise. Preparation day on Day 4 is critical.",
  },
  {
    id: "houlihan-lokey",
    firm: "Houlihan Lokey",
    speaker: "Aashay",
    division: "M&A / Investment Banking",
    category: "ib",
    structure:
      "Throughout the week, you work on a single presentation project. You are given a company and told you are the sell-side advisor. Your job is to build a full pitch: deep dive into the company's financials, competitive positioning, and identify the best potential buyer, whether a strategic acquirer or financial sponsor.",
    dayByDay:
      "Each day you work on your presentation alongside daily coaching sessions on financial modelling and accounting. The week culminates in a final presentation to senior bankers. This presentation is the primary assessment.",
    keyActivities:
      "Company analysis, financial modelling sessions, accounting workshops, buyer identification exercises, and the final sell-side advisory presentation. The coaching sessions are genuinely educational, not just filler.",
    culture:
      "Friendly and close-knit. The office is small and cosy, and everyone knows each other. Houlihan Lokey operates in unique sectors like dedicated fintech advisory, rather than lumping everything into a generic financials bucket like larger banks.",
    insiderTips:
      "Learn PowerPoint shortcuts before you arrive. The presentation is everything, and being able to build clean slides quickly gives you a real edge. Also, have a solid understanding of accounting fundamentals and basic technicals. The coaching sessions help, but you will stand out if you already have a foundation.",
    howToPrepare:
      "Brush up on accounting (income statement, balance sheet, cash flow statement linkages), basic valuation methods (DCF, comps, precedent transactions), and PowerPoint efficiency. Understand what makes a good strategic acquirer versus a financial sponsor.",
  },
  {
    id: "barclays",
    firm: "Barclays",
    speaker: "Aashay",
    division: "Investment Banking",
    category: "ib",
    structure:
      "The spring week at Barclays is very short. It is essentially one day of networking and panels, followed by the assessment centre the next day. There are no extended working sessions or group projects during the spring week itself.",
    dayByDay:
      "Day 1 consists of networking events, panel discussions with current analysts and associates, and an introduction to the bank's divisions. Day 2 is the assessment centre.",
    keyActivities:
      "Panels, networking, and the AC. The spring week is more of a gateway to the AC than an immersive work experience.",
    culture:
      "Barclays is the largest bank in the UK and carries significant prestige in London. The culture is professional and polished. Barclays converts a high percentage of spring weekers, so the AC is your real opportunity.",
    insiderTips:
      "Because the spring week is so short, the AC carries almost all of the weight. Come prepared with strong technicals from day one. Do not treat the networking day as a warm-up. The people you meet on Day 1 may feed into your evaluation.",
    howToPrepare:
      "Focus heavily on accounting, technicals, modelling, valuation, M&A concepts, and recent Barclays deals. The AC is a standard investment banking assessment: competency interviews, technical questions, and likely a group exercise.",
    assessment:
      "Standard IB assessment centre on Day 2. Expect strong accounting and technical questions, valuation methodology, M&A discussion, and awareness of recent deals the bank has worked on.",
  },
  {
    id: "macquarie",
    firm: "Macquarie",
    speaker: "Ike",
    division: "Multi-division (IB, S&T, Infrastructure, Risk, AM)",
    category: "multi",
    structure:
      "Five days, each focused on a different division: Investment Banking, Sales and Trading, Infrastructure, Risk, and Asset Management. The programme is a mix of presentations, panels, interactive work, and case studies. At the end of the week, you rank your preferred divisions, and they rank you in a two-way matching process.",
    dayByDay:
      "Each day immerses you in a different division. You will hear from senior leaders, work through division-specific case studies, and participate in interactive sessions. The final day includes the ranking exercise.",
    keyActivities:
      "Division-specific presentations, panels with senior staff, interactive case studies, and networking across multiple business lines. Macquarie's principal and advisory model means the firm invests its own capital alongside advising clients, which gives the sessions a different flavour from pure advisory banks.",
    culture:
      "Relaxed, with a strong Australian influence. Less rigid than many London banks, very international, and genuinely welcoming. People are approachable and the hierarchy feels flatter than at most competitors.",
    insiderTips:
      "Be engaged in every session, not just the divisions you think you want. The two-way matching means your behaviour across all five days matters. Be clear and confident when you speak. Take every division seriously, even the ones you would not normally consider.",
    howToPrepare:
      "Understand Macquarie's principal investment model and how it differs from pure advisory firms. Read up on their infrastructure business, which is a major differentiator. Have a basic understanding of each division so you can ask informed questions on each day.",
  },
  {
    id: "lazard",
    firm: "Lazard",
    speaker: "Ike",
    division: "Pure Advisory (M&A and Restructuring)",
    category: "ib",
    structure:
      "Three days focused entirely on M&A and restructuring. Day 2 includes an external Financial Edge training session covering Excel, financial modelling, and valuation. There is a group case study where you are given a buy-side mandate and must present your recommendation at the end.",
    dayByDay:
      "Day 1 introduces the firm and its advisory philosophy. Day 2 is the Financial Edge training day, which is hands-on and practical. Day 3 is the group case study presentation and wrap-up.",
    keyActivities:
      "Financial Edge training (Excel, modelling, valuation), group case study on a buy-side mandate covering strategic rationale, industry overview, and risk analysis. A VP or Associate oversees your group and feeds directly into the evaluation.",
    culture:
      "Analytical, intellectually driven, and lean. Teams are small and cultural fit matters enormously. Lazard is particularly strong in restructuring, including sovereign restructuring, which is a niche most banks cannot match.",
    insiderTips:
      "Prioritise the group project early. Have the bulk of your work done by the morning of the final day so you have time to rehearse the presentation. The VP or Associate watching your group is actively evaluating you, so how you collaborate matters as much as what you present.",
    howToPrepare:
      "Understand M&A fundamentals, buy-side versus sell-side dynamics, and basic restructuring concepts. Familiarise yourself with Lazard's recent advisory mandates. Excel proficiency will help you on the Financial Edge training day.",
  },
  {
    id: "bnp-paribas",
    firm: "BNP Paribas",
    speaker: "Ike",
    division: "Global Markets",
    category: "markets",
    structure:
      "Three days. Days 1 and 2 cover learning about the firm with sessions from Fixed Income, Structuring, and DCM teams. You visit the trading floor and spend time with different desks. Day 3 is the assessment centre, which everyone progresses to.",
    dayByDay:
      "Days 1-2 include desk visits, trading floor tours, an asset management simulation (portfolio allocation with live news feeds), and a sales and trading simulation (market making). Day 3 is the AC: a one-on-one newsflash interview with a trader, a maths test, and a group case study.",
    keyActivities:
      "Asset management simulation with live market news, sales and trading market-making simulation, trading floor visits, desk rotations across Fixed Income, Structuring, and DCM. The AC on Day 3 includes three distinct components.",
    culture:
      "European, collaborative, and less intense than American banks. BNP Paribas is strong in fixed income and has a growing reputation in sustainable finance. The atmosphere is professional but not aggressive.",
    insiderTips:
      "For the newsflash interview, use structured thinking. The trader will give you a market scenario and ask for your view. Walk through your reasoning step by step. For the maths test, practise mental arithmetic and logical reasoning problems. These are not complex financial maths, but they require speed and composure.",
    howToPrepare:
      "Practise mental maths (percentages, ratios, quick calculations), logical reasoning puzzles, and structured market analysis. Understand the basics of fixed income products, credit markets, and how a trading desk operates.",
    assessment:
      "Day 3 AC has three parts: a one-on-one newsflash interview with a trader (market scenario discussion), a financial maths and logical reasoning test, and a group case study. Everyone from the spring week progresses to the AC.",
  },
  {
    id: "hsbc",
    firm: "HSBC",
    speaker: "Ike, Indiana, and Ayo",
    division: "CIB (Corporate and Institutional Banking)",
    category: "multi",
    structure:
      "Four days. Days 1 to 3 feature panels, desk insights, and interactive sessions from IB, Sales and Trading, and Payments teams. The final day includes a mock AC with mock interviews, live demos, and feedback, followed by a division split.",
    dayByDay:
      "Days 1-3 are a rotation of panels, team-run interactive activities (not just presentations), and networking. Day 4 is a mock assessment centre with real feedback, then you split by your preferred division. Everyone progresses to the next stage, which is a HireVue-style interview.",
    keyActivities:
      "Interactive sessions run by actual teams, panel discussions, desk insight rotations, mock AC with live feedback, and structured networking. The emphasis is on learning by doing, not just listening.",
    culture:
      "Collaborative and globally connected. HSBC is the dominant player in Asia and a leader in FX markets. The bank is undergoing significant restructuring under CEO Georges Elhedery, which creates both opportunity and change. Strong in DCM.",
    insiderTips:
      "Brush up on commercial awareness, especially around HSBC's Asia business and FX markets. Prepare complex, thoughtful networking questions that show you have researched the firm. The mock AC on Day 4 is genuinely useful, so take the feedback seriously.",
    howToPrepare:
      "Understand HSBC's global footprint, particularly its dominance in Asia-Pacific. Know the basics of FX markets, DCM, and the current restructuring story. Have questions ready that go beyond surface-level research.",
    assessment:
      "Day 4 includes a mock AC with feedback. After the spring week, everyone progresses to a HireVue-style interview. The mock AC helps you prepare, but the real evaluation happens in the subsequent interview round.",
  },
  {
    id: "morgan-stanley",
    firm: "Morgan Stanley",
    speaker: "Ayo",
    division: "IBD / GCM",
    category: "ib",
    structure:
      "Day 1 brings everyone together regardless of division. Days 2 and 3 are division-specific. The last day includes a team networking event. The week is heavily focused on networking and relationship-building.",
    dayByDay:
      "Day 1 is a firm-wide introduction with all spring weekers together. Days 2-3 move into your assigned division with workshops and team activities. The final day wraps with a team networking event. Workshops include a charity ad pitch (a fun group activity) and an Amplify Me IPO workshop.",
    keyActivities:
      "Charity ad pitch workshop, Amplify Me IPO workshop, division-specific sessions, and extensive networking. The spring week is designed to help you understand the firm's culture as much as its technical work.",
    culture:
      "Very open, down to earth, and genuinely approachable. People at Morgan Stanley are incredibly smart but do not wear it as armour. The culture is expressive and welcoming. Multiple speakers described it as one of the most comfortable spring week environments.",
    insiderTips:
      "Have clear reasons for why you want to work in finance and why Morgan Stanley specifically. Be ready to learn and participate actively. There is nothing technical assessed during the spring week itself, so focus on showing curiosity, energy, and interpersonal skills.",
    howToPrepare:
      "This is a relationship-driven spring week. Prepare your personal story, know why finance, why Morgan Stanley, and why your chosen division. Read up on the firm's recent deals and strategic priorities. Technical prep is less important here than at other firms.",
  },
  {
    id: "evercore",
    firm: "Evercore",
    speaker: "Ayo",
    division: "Investment Banking",
    category: "ib",
    structure:
      "The most immersive spring week of any firm. The cohort is deliberately small, which means exceptional networking opportunities. The programme includes a Wall Street Prep technical skills workshop, a case study based on an actual past deal, team talks with in-depth deal walkthroughs, and team shadowing with networking rotations.",
    dayByDay:
      "The week moves between structured learning and hands-on work. You will attend the Wall Street Prep workshop on Excel and technical skills, then work through a case study built from a real Evercore deal with a thick book of pitch materials, broker reports, and analysis. Group presentations follow, with detailed follow-up questions from senior bankers.",
    keyActivities:
      "Wall Street Prep technical workshop, real deal case study with full pitch materials, group presentation with Q&A, team talks with deal walkthroughs, and team shadow and networking rotations. The case study is the centrepiece.",
    culture:
      "Down to earth, fast-thinking, and driven by a genuine vibe of excellence. People at Evercore are friendly, expressive, and deeply passionate about advisory work. The small cohort size creates a more personal experience than at larger banks.",
    insiderTips:
      "Prepare your Excel shortcuts before you arrive. The Wall Street Prep workshop will be more valuable if you already know the basics. Participate well in the case study, as it carries significant weight. Know the wider M&A market and be ready to discuss recent transactions.",
    howToPrepare:
      "Drill Excel shortcuts and basic financial modelling. Understand M&A fundamentals, valuation methods, and how to read a pitch book. Research Evercore's recent advisory mandates and have a view on at least one recent deal.",
  },
  {
    id: "nomura",
    firm: "Nomura",
    speaker: "Serena",
    division: "Markets (Trading, Sales, Structuring)",
    category: "markets",
    structure:
      "A women's spring week running 4-5 days. Three days are structured: learning about investment banking, Excel training, networking, and public speaking workshops. The remaining days are spent freely shadowing the trading floor.",
    dayByDay:
      "The structured days cover IB fundamentals, Excel skills, networking techniques, and public speaking. On the shadowing days, you have freedom to move around the trading floor, sit with different desks, and observe how traders, salespeople, and structurers work in real time.",
    keyActivities:
      "IB overview sessions, Excel training, networking workshops, public speaking practice, and free-form trading floor shadowing. The shadowing component is unusually open compared to other firms.",
    culture:
      "Very relaxed. Traders tend to leave by 5pm, and the overall atmosphere is calm and welcoming. Nomura has a reputation for being one of the more laid-back environments in London banking.",
    insiderTips:
      "Arrive before the employees and leave after them. It is a simple signal of enthusiasm that gets noticed. Use the shadowing days to build genuine relationships with people on the desks you are interested in.",
    howToPrepare:
      "Understand the basics of trading, sales, and structuring. Know what each role does on a trading floor. Have questions ready for the people you shadow. Basic Excel skills will help you stand out in the training sessions.",
  },
  {
    id: "rbc",
    firm: "RBC Capital Markets",
    speaker: "Serena",
    division: "Multi-division (Markets, IB, Private Banking, Risk)",
    category: "multi",
    structure:
      "A broad programme covering markets, investment banking, private banking, risk, and back office functions. The week is a mix of presentations from different areas and structured networking sessions.",
    dayByDay:
      "Each day features presentations from different divisions alongside networking sessions. You get exposure to the full breadth of the bank rather than deep-diving into one area.",
    keyActivities:
      "Division presentations, networking sessions, and Q&A panels across markets, IB, private banking, risk, and operations.",
    culture:
      "The IB team in particular is very passionate about their work. People genuinely love their jobs and it comes through in how they present. The bank has a friendly, approachable atmosphere.",
    insiderTips:
      "Have questions prepared for every session. The converting process after the spring week involves interviews that are genuinely difficult, so focus on interview preparation from the very start. The spring week is your chance to learn what to prepare for.",
    howToPrepare:
      "Focus on converting interview preparation rather than spring week content. Understand the basics of each division so you can ask informed questions. Research RBC's position in the market and what differentiates it from larger competitors.",
    assessment:
      "The interviews after the spring week are reportedly very challenging. Use the spring week to gather intelligence on what the interviews will cover, then prepare accordingly.",
  },
];

// --------------- Category groupings ---------------

interface CategoryGroup {
  label: string;
  id: string;
  firmIds: string[];
}

const CATEGORIES: CategoryGroup[] = [
  {
    label: "Investment Banking",
    id: "ib",
    firmIds: ["morgan-stanley", "evercore", "houlihan-lokey", "barclays", "lazard"],
  },
  {
    label: "Global Markets / Trading",
    id: "markets",
    firmIds: ["jane-street", "bnp-paribas", "nomura"],
  },
  {
    label: "Multi-Division",
    id: "multi",
    firmIds: ["macquarie", "bank-of-america", "hsbc", "rbc"],
  },
];

// --------------- Upcoming firms ---------------

const UPCOMING_FIRMS = [
  "Goldman Sachs", "JPMorgan", "Citi", "Deutsche Bank", "UBS",
  "Rothschild", "Jefferies", "PJT Partners", "Blackstone", "Citadel",
  "D.E. Shaw", "BlackRock", "Schroders", "Deloitte", "EY", "KPMG", "PwC",
];

// --------------- Sub-components ---------------

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-[13px] font-semibold text-emerald-400 uppercase tracking-wider">
        {title}
      </h4>
      <p className="text-[13.5px] text-slate-300 leading-relaxed font-light">{children}</p>
    </div>
  );
}

function FirmCard({ entry }: { entry: FirmEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={entry.id} className="scroll-mt-24">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-4 hover:border-slate-700 transition-colors text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Building2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-white truncate">{entry.firm}</h3>
            <p className="text-[12px] text-slate-500 truncate">
              {entry.division} - via {entry.speaker}
              {entry.speakerConverted ? ` (converted at ${entry.speakerConverted})` : ""}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="mt-1 bg-slate-900/50 border border-slate-800/60 rounded-xl px-5 py-5 space-y-5">
          <SectionBlock title="Programme Structure">{entry.structure}</SectionBlock>
          <SectionBlock title="Day-by-Day">{entry.dayByDay}</SectionBlock>
          <SectionBlock title="Key Activities">{entry.keyActivities}</SectionBlock>
          <SectionBlock title="Culture and Vibe">{entry.culture}</SectionBlock>
          <SectionBlock title="Insider Tips">{entry.insiderTips}</SectionBlock>
          <SectionBlock title="How to Prepare">{entry.howToPrepare}</SectionBlock>
          {entry.assessment && (
            <SectionBlock title="Assessment">{entry.assessment}</SectionBlock>
          )}
        </div>
      )}
    </div>
  );
}

// --------------- Access check ---------------

const ALLOWED_TICKETS = ["prepare", "convert", "1,2,3+handbook", "bundle", "premium"];

function useHandbookAccess(): boolean {
  return useMemo(() => {
    try {
      const raw = localStorage.getItem("spring_week_signup");
      if (!raw) return false;
      const data = JSON.parse(raw);
      const ticket = (data.selectedTicket ?? "").toLowerCase();
      return ALLOWED_TICKETS.includes(ticket);
    } catch {
      return false;
    }
  }, []);
}

// --------------- Sample firm ID for preview ---------------

const SAMPLE_FIRM_ID = "bank-of-america";

// --------------- Locked firm card (preview mode) ---------------

function LockedFirmCard({ entry }: { entry: FirmEntry }) {
  return (
    <div id={entry.id} className="scroll-mt-24 relative">
      <div className="w-full flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-4 opacity-60">
        <div className="flex items-center gap-3 min-w-0">
          <Building2 className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-white truncate">{entry.firm}</h3>
            <p className="text-[12px] text-slate-500 truncate">{entry.division}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 flex-shrink-0">
          <Lock className="w-4 h-4" />
          <span className="text-[11px] font-medium">Unlock with Prepare or Convert</span>
        </div>
      </div>
    </div>
  );
}

// --------------- Main component ---------------

export default function SpringWeekHandbookContent() {
  const tocRef = useRef<HTMLDivElement>(null);
  const hasAccess = useHandbookAccess();

  const scrollToFirm = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="px-6 py-10 md:px-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {hasAccess ? "Premium Content" : "Preview"}
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            The Spring Week Handbook
          </h1>
          <p className="text-[14px] text-slate-400 mt-2 font-light leading-relaxed">
            Written by students who converted. Updated as we add more firms.
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-[12px]">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Building2 className="w-3.5 h-3.5" /> 12 firms covered
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <User className="w-3.5 h-3.5" /> 7 speakers
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" /> Last updated: April 2026
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-3xl mx-auto">
        {/* Table of Contents - always visible */}
        <div ref={tocRef} className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h2 className="text-[14px] font-bold text-white mb-4">Table of Contents</h2>
          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.firmIds.map((fid) => {
                    const firm = FIRMS.find((f) => f.id === fid);
                    if (!firm) return null;
                    return (
                      <button
                        key={fid}
                        onClick={() => scrollToFirm(fid)}
                        className="text-[12px] text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {firm.firm}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-buyer banner */}
        {!hasAccess && (
          <div className="mt-6 bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-5 py-4">
            <p className="text-[13px] text-emerald-300 font-medium mb-1">
              You are viewing a preview of the handbook
            </p>
            <p className="text-[12px] text-slate-400 font-light leading-relaxed">
              The full Bank of America chapter is unlocked below as a sample. All other firms require a Prepare or Convert tier ticket.
            </p>
          </div>
        )}

        {/* Firm sections by category */}
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-slate-800" />
              <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider px-2">
                {cat.label}
              </h2>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <div className="space-y-3">
              {cat.firmIds.map((fid) => {
                const firm = FIRMS.find((f) => f.id === fid);
                if (!firm) return null;
                if (hasAccess || fid === SAMPLE_FIRM_ID) {
                  return <FirmCard key={fid} entry={firm} />;
                }
                return <LockedFirmCard key={fid} entry={firm} />;
              })}
            </div>
          </div>
        ))}

        {/* CTA for non-buyers */}
        {!hasAccess && (
          <div className="mt-10 bg-slate-900/60 border border-emerald-800/20 rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-2">
              Want the full handbook?
            </h2>
            <p className="text-[13px] text-slate-400 font-light leading-relaxed mb-5 max-w-md mx-auto">
              Get firm-by-firm breakdowns for all 12 firms, including day-by-day schedules, insider tips, assessment formats, and preparation strategies.
            </p>
            <a
              href="/spring-week"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black no-underline hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #6EE7B7, #34D399)" }}
            >
              Get the Handbook
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* More firms coming soon */}
        <div className="mt-12 bg-slate-900/40 border border-slate-800/60 rounded-xl p-6">
          <h2 className="text-[15px] font-bold text-white mb-2">More firms coming soon</h2>
          <p className="text-[13px] text-slate-400 font-light leading-relaxed mb-4">
            We are actively adding intel from students at more firms. Here is what is in progress:
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {UPCOMING_FIRMS.map((name) => (
              <span
                key={name}
                className="text-[11px] text-slate-500 bg-slate-800/40 border border-slate-800 px-2.5 py-1 rounded-md"
              >
                {name}
              </span>
            ))}
          </div>
          <a
            href="mailto:dylan@yourearlyedge.co.uk?subject=Handbook%20-%20Request%20a%20Firm"
            className="inline-block text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Request a firm &rarr;
          </a>
        </div>

        {/* Last updated */}
        <p className="mt-8 text-center text-[11px] text-slate-600">
          Last updated: April 10, 2026
        </p>
      </div>
    </div>
  );
}
