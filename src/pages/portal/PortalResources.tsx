import { Link } from "react-router-dom";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { BookOpen, CheckSquare, ExternalLink, Table, List, HelpCircle, X, ShieldAlert, Lock, ArrowRight, Sparkles, Presentation, Star, Zap } from "lucide-react";

const GUIDE_LINK = "/portal/cold-email-guide";
const CHECKLIST_LINK = "https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist";
const TRACKER_LINK = "https://docs.google.com/spreadsheets/d/19ZPYW15MrrZ-0Wnr-yAbthWA5tPMD0QsZl_jU0e4gkE/edit?gid=1156363533#gid=1156363533";
const FIRMS_LIST_LINK = "https://earlyedge-1758913924.subpage.co/1581-2e5bf708";
const INTERVIEW_QUESTIONS_LINK = "https://docs.google.com/document/d/1zt-sHu-iNZ7GuR9XwZPtECGoBTA6yhLoY7pFaMpJxf8/edit?tab=t.0";
const WEBINAR_SLIDES_LINK = "https://drive.google.com/file/d/1GtHhkNGEQqKnE8NCzZn4hCcBvyBPDCYf/view?usp=sharing";

type ResourceTier = "free" | "recording" | "bundle";

const TIER_ORDER: Record<ResourceTier, number> = { free: 0, recording: 1, bundle: 2 };

function isUnlocked(requiredTier: ResourceTier, userTier: ResourceTier): boolean {
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
}

const PHASES = [
  {
    id: "phase-1",
    title: "Phase 1: The Foundation",
    description: "Master the strategy and templates before sending a single email.",
    resources: [
      {
        id: "guide",
        title: "The Cold Email Guide 2.0",
        description: "The complete 50-page written playbook Uthman used to land 20 internship offers. Step-by-step email templates, follow-up sequences, lead generation with Apollo.io, and the exact strategies that work.",
        icon: BookOpen,
        link: GUIDE_LINK,
        gradient: "from-zinc-800 to-black",
        requiredTier: "bundle" as ResourceTier,
        type: "Master Guide",
        actionText: "Access The Vault"
      },
      {
        id: "webinar-slides",
        title: "The Cold Email Webinar Slides",
        description: "The slides from our 90-minute live webinar where Uthman walked through his entire cold email system - the frameworks, templates, and sequences behind his 20 internship offers.",
        icon: Presentation,
        link: WEBINAR_SLIDES_LINK,
        gradient: "from-violet-600 to-indigo-900",
        requiredTier: "free" as ResourceTier,
        type: "Free Resource",
        actionText: "Download Slides"
      }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2: The Arsenal",
    description: "Build your pipeline and track your entire campaign.",
    resources: [
      {
        id: "tracker",
        title: "EarlyEdge Cold Email Tracker",
        description: "Your all-in-one outreach spreadsheet. Clean your leads, track sends, log responses, and monitor your stats - all in one place. Includes 'How to Use' sheet.",
        icon: Table,
        link: TRACKER_LINK,
        gradient: "from-blue-600 to-indigo-900",
        requiredTier: "bundle" as ResourceTier,
        type: "Tracker System",
        actionText: "Launch Tracker",
        includedInGuide: true,
      },
      {
        id: "firms",
        title: "200 UK Firms to Cold Email",
        description: "A curated list of 200 firms across PE, VC, IB, Law, Consulting, and more - all UK-based, all with small teams. Your ready-made starting point.",
        icon: List,
        link: FIRMS_LIST_LINK,
        gradient: "from-amber-600 to-orange-900",
        requiredTier: "free" as ResourceTier,
        type: "Lead Data",
        actionText: "Open Lead List"
      }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3: Execution",
    description: "Launch your campaign and prepare for the interviews.",
    resources: [
      {
        id: "checklist",
        title: "Cold Email Checklist",
        description: "A quick reference checklist covering every step from finding leads to sending your first batch. Print it out and tick off each step.",
        icon: CheckSquare,
        link: CHECKLIST_LINK,
        gradient: "from-emerald-600 to-teal-900",
        requiredTier: "free" as ResourceTier,
        type: "Execution",
        actionText: "View Checklist"
      },
      {
        id: "questions",
        title: "Spring Week & Interview Questions",
        description: "The exact HireVue and interview questions asked at JPMorgan, Jane Street, Morgan Stanley, Citi, Maven, and more.",
        icon: HelpCircle,
        link: INTERVIEW_QUESTIONS_LINK,
        gradient: "from-purple-600 to-fuchsia-900",
        requiredTier: "free" as ResourceTier,
        type: "Interview Prep",
        actionText: "Study Questions"
      }
    ]
  }
];

export default function PortalResources() {
  const { buyerStatus } = useBuyerAuth();
  const tier = (buyerStatus?.tier ?? "free") as ResourceTier;
  const isBundle = tier === "bundle";

  // Count exactly how many resources are unlocked vs locked for gamification
  const totalResources = PHASES.reduce((acc, phase) => acc + phase.resources.length, 0);
  const unlockedResources = PHASES.reduce(
    (acc, phase) => acc + phase.resources.filter(r => isUnlocked(r.requiredTier, tier)).length, 0
  );

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">

      {/* ════════ HEADER (The Execution Blueprint) ════════ */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-8 md:px-10 lg:px-12 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                Execution Blueprint
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111]">
              Your Asset Vault
            </h1>
            <p className="text-sm text-[#666] mt-1.5 font-light max-w-lg">
              Follow the Phases below. Mastering Phase 1 makes Phase 2 easier. Executing Phase 2 makes Phase 3 a breeze. Let's get to work.
            </p>
          </div>

          {/* Gamified Ownership Badge */}
          <div className="w-full md:w-auto bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-4 flex flex-col justify-center">
            <p className="text-[11px] font-bold text-[#888] uppercase tracking-wide mb-1 text-right">
              Vault Access Level
            </p>
            <div className="flex items-end justify-end gap-2">
              <p className="text-2xl font-black text-[#111]">{unlockedResources}<span className="text-[#999] text-base font-medium">/{totalResources}</span></p>
              <p className="text-[13px] font-medium text-[#666] mb-1">assets unlocked</p>
            </div>
            {tier !== "bundle" && (
              <div className="mt-2 inline-flex justify-end">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {tier === "free" ? "Free Tier" : "Partial Access"}
                </span>
              </div>
            )}
            {tier === "bundle" && (
              <div className="mt-2 inline-flex justify-end">
                <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Full Access
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════ FREE SLIDES HIGHLIGHT BANNER (for free-tier users) ════════ */}
      {tier === "free" && (
        <div className="px-6 md:px-10 lg:px-12 mt-8 max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Presentation className="w-5 h-5 text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Free Access</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Your Free Webinar Slides Are Ready</h3>
                <p className="text-sm text-blue-100 mt-1 font-light opacity-90">
                  Download the complete cold email strategy slides from our 90-minute live webinar. No purchase required.
                </p>
              </div>
              <a
                href={WEBINAR_SLIDES_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
              >
                <Presentation className="w-4 h-4" />
                Download Slides Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ════════ THE GUIDED PATHWAY ════════ */}
      <div className="px-6 md:px-10 lg:px-12 mt-10 max-w-5xl">
        <div className="space-y-12">
          {PHASES.map((phase, phaseIdx) => (
            <div key={phase.id} className="relative">
              {/* Pathway connecting line (visual only, for left side if wanted, but doing a clean block layout instead) */}
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#111]">{phase.title}</h2>
                <p className="text-sm text-[#666] mt-1">{phase.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phase.resources.map((resource) => {
                  const locked = !isUnlocked(resource.requiredTier, tier);
                  const Icon = resource.icon;

                  if (locked) {
                    // ════════ LOCKED CARD WITH TEASER ════════
                    const upgradeLabel = resource.requiredTier === "bundle" ? "Bundle" : "Recording";
                    return (
                      <div
                        key={resource.id}
                        className="relative bg-black rounded-2xl overflow-hidden group border border-[#222] shadow-2xl shadow-black/10"
                      >
                        {/* Background blurry glow */}
                        <div className={`absolute -inset-20 bg-gradient-to-br ${resource.gradient} opacity-20 blur-[60px] group-hover:opacity-40 transition-opacity duration-700`} />

                        <div className="relative p-6 flex flex-col h-full z-10">
                          <div className="flex items-center gap-2 flex-wrap mb-8">
                            <span className="bg-white/10 text-white/50 border border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                              <Lock className="w-3 h-3 text-red-400" />
                              {resource.type}
                            </span>
                            {"includedInGuide" in resource && resource.includedInGuide && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Included in Guide
                              </span>
                            )}
                          </div>

                          <div className="flex-1 text-center flex flex-col items-center justify-center py-6">
                            <Lock className="w-10 h-10 text-red-500/80 mb-4" />
                            <h3 className="text-white text-lg font-bold mb-2">
                              {resource.title}
                            </h3>
                            <p className="text-[#888] text-[13px] leading-relaxed max-w-xs mx-auto">
                              {resource.description}
                            </p>
                            <p className="text-[#666] text-[11px] mt-3">
                              Join 150+ students who already have access
                            </p>
                          </div>

                          <div className="mt-8">
                            <a
                              href="https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e"
                              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-900 to-red-600 text-white text-[13px] font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5 duration-300"
                            >
                              Upgrade to Full Bundle - £29
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // ════════ PREMIUM UNLOCKED STYLING ════════
                  const isFreeResource = resource.requiredTier === "free";
                  return (
                    <div
                      key={resource.id}
                      className={`group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
                        isFreeResource
                          ? "border-2 border-dashed border-blue-400 ring-1 ring-blue-100"
                          : "border border-[#E8E8E8] hover:border-[#CCC]"
                      }`}
                    >
                      {/* Gradient Header Pattern */}
                      <div className={`h-2 relative bg-gradient-to-r ${resource.gradient} w-full`} />
                      
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-5">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.gradient} p-0.5 shadow-md group-hover:shadow-lg transition-shadow`}>
                            <div className="w-full h-full bg-[#111]/10 rounded-[10px] flex items-center justify-center mix-blend-overlay">
                              <Icon className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                          </div>
                          {isFreeResource ? (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-200">
                              ✓ Free Resource
                            </span>
                          ) : (
                            <span className="bg-[#F5F5F5] text-[#555] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                              {resource.type}
                            </span>
                          )}
                        </div>

                        <h3 className="text-[18px] font-bold text-[#111] leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                        
                        <p className="text-[13px] text-[#666] leading-relaxed font-light mb-8 flex-1">
                          {resource.description}
                        </p>



                        <div className="space-y-2.5 mt-auto">
                          {resource.link.startsWith("/") ? (
                            <Link
                              to={resource.link}
                              className="w-full py-3.5 rounded-xl bg-[#111] text-white text-[13px] font-bold hover:bg-[#222] hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5 duration-300 no-underline"
                            >
                              {resource.actionText}
                              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ) : (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3.5 rounded-xl bg-[#111] text-white text-[13px] font-bold hover:bg-[#222] hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5 duration-300"
                            >
                              {resource.actionText}
                              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bundle upgrade prompt for recording-only buyers */}
        {!isBundle && (
          <div className="mt-16 bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl border border-white/10">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Upgrade Available</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  {tier === "free" ? "Unlock the full Cold Email system" : "You're halfway there"}
                </h3>
                <p className="text-[15px] text-white/60 font-light mt-3 leading-relaxed max-w-xl">
                  {tier === "free"
                    ? "Get the 90-minute recording, the 50-page Cold Email Guide, templates, and the full outreach system. Everything you need to land offers."
                    : "You have the recording. Add the Cold Email Guide to get the exact templates, follow-up sequences, and the 200+ firm outreach list."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl text-[14px] font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Unlock the Full Bundle - £29
                    <Lock className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-3 flex-shrink-0 opacity-80 rotate-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm w-64">
                  <div className="h-2 bg-white/20 rounded w-1/3 mb-4" />
                  <div className="h-2 bg-white/10 rounded w-full mb-2" />
                  <div className="h-2 bg-white/10 rounded w-5/6 mb-2" />
                  <div className="h-2 bg-white/10 rounded w-4/6" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm w-64 -translate-x-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center"><Lock className="w-3 h-3 text-white" /></div>
                    <div className="h-2 bg-white/20 rounded w-1/2" />
                  </div>
                  <div className="h-2 bg-white/10 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coaching upsell for bundle buyers - they have everything, next step is 1-on-1 */}
        {isBundle && (
          <div className="mt-16 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-10 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Final Step</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-emerald-900">
                  You have the system. Now apply it with Uthman.
                </h3>
                <p className="text-[15px] text-emerald-800/70 font-light mt-3 leading-relaxed max-w-xl">
                  The guide and templates give you everything to do it yourself. A 1-on-1 session with Uthman
                  means he reviews YOUR specific emails, YOUR lead list, and YOUR target firms - and fixes
                  them on the spot. Most students say this is where everything finally clicks.
                </p>

                {/* Inline testimonial */}
                <div className="mt-5 bg-white/70 border border-emerald-100 rounded-xl p-4 max-w-lg">
                  <div className="flex gap-0.5 mb-1.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] text-emerald-800 font-light italic leading-relaxed">
                    "I had the guide and thought I knew what I was doing. One call with Uthman and he found 5
                    things in my emails I was doing wrong. Got 4 replies the week after."
                  </p>
                  <p className="text-[12px] text-emerald-700 font-semibold mt-1.5">Priya M., LSE</p>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3 flex-shrink-0">
                <Link
                  to="/portal/book-uthman"
                  className="w-full md:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl text-[14px] font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book a 1-on-1 Session
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-emerald-700/60 text-center">
                  Strategy Call from £35 - Deep Dive from £59
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
