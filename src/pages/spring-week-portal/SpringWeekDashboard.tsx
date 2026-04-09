import { Link } from "react-router-dom";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import {
  SPEAKERS,
  SW_EVENT_DATE,
} from "@/data/springWeekData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Play,
  BookOpen,
  Users,
  Lock,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Star,
  AlertTriangle,
  Phone,
  Clock,
  Shield,
} from "lucide-react";

// April 12, 2026 at 2pm BST = UTC 1pm
const EVENT_ISO = "2026-04-12T13:00:00Z";

function isPostEvent(): boolean {
  return Date.now() > new Date(EVENT_ISO).getTime();
}

/* ---- Tier badge ---- */

interface TierBadgeProps {
  tier: "free" | "watch" | "prepare" | "convert";
}

function TierBadge({ tier }: TierBadgeProps) {
  const config: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    convert: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    prepare: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    watch: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
    free: { bg: "bg-white", text: "text-slate-400", border: "border-slate-200", dot: "bg-slate-300" },
  };

  const labels: Record<string, string> = {
    convert: "Convert",
    prepare: "Prepare",
    watch: "Watch",
    free: "Free",
  };

  const c = config[tier];

  return (
    <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {labels[tier]}
    </span>
  );
}

/* ---- Live Panel card ---- */

function LivePanelCard({ hasAccess }: { hasAccess: boolean }) {
  const postEvent = isPostEvent();

  if (!hasAccess) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center space-y-3 px-8 max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F0F0] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-[#AAA]" />
            </div>
            <p className="text-[14px] font-semibold text-[#111]">Live panel access required</p>
            <p className="text-[12px] text-[#888] font-light leading-relaxed">
              Watch students who converted share exactly what they did differently.
            </p>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#111] text-white text-[12px] font-semibold hover:bg-[#222] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              See upgrade options
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className="opacity-20 pointer-events-none select-none bg-white border border-[#E0E0E0] rounded-2xl p-6">
          <LivePanelCardContent postEvent={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <LivePanelCardContent postEvent={postEvent} />
    </div>
  );
}

function LivePanelCardContent({ postEvent }: { postEvent: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Play className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111] tracking-tight">Live Panel</p>
            <p className="text-[11px] text-[#999] font-light mt-0.5">
              {postEvent ? "Recording now available" : "April 12, 2026 at 2:00 PM BST"}
            </p>
          </div>
        </div>
        {postEvent ? (
          <span className="text-[10px] font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Watch now
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-blue-500 text-white px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live soon
          </span>
        )}
      </div>

      {postEvent ? (
        <div className="space-y-4">
          <p className="text-[13px] text-[#555] font-light leading-[1.7]">
            The live session has ended. Your full recording is ready. Students who converted at Goldman, JP Morgan, Barclays, Lazard, and more share exactly what they did differently.
          </p>
          <Link
            to="/spring-week-portal/recording"
            className="flex items-center justify-between bg-gradient-to-r from-[#111] to-[#222] text-white rounded-xl px-5 py-3.5 text-[13px] font-semibold hover:from-[#222] hover:to-[#333] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch the recording
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[13px] text-[#555] font-light leading-[1.7]">
            Students who converted at Goldman, JP Morgan, Barclays, Lazard, and more share exactly what they did differently. You'll hear the specific mistakes that cost students their offers and the strategies that got others the return offer.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-5 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-[12px] text-blue-800 font-semibold">{SW_EVENT_DATE}, 2:00 PM BST on Zoom</p>
            </div>
            <p className="text-[11px] text-blue-600/80 font-light">
              Zoom link sent to your email 1 hour before. Check your inbox.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Firm Intel card ---- */

function FirmIntelCard({ hasAccess }: { hasAccess: boolean }) {
  if (!hasAccess) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4 text-[#BBB]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111] tracking-tight">Firm Intel</p>
            <p className="text-[11px] text-[#999] font-light mt-0.5">45+ firms. Conversion rates. AC formats.</p>
          </div>
        </div>
        <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[18px] font-bold text-[#111]">70%</p>
              <p className="text-[10px] text-[#888] font-light">Barclays</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#111]">10%</p>
              <p className="text-[10px] text-[#888] font-light">JP Morgan</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#111]">3%</p>
              <p className="text-[10px] text-[#888] font-light">Blackstone</p>
            </div>
          </div>
        </div>
        <p className="text-[12px] text-[#888] font-light leading-relaxed mb-4">
          The handbook tells you exactly why these rates are so different, and what to do about it at your specific firm.
        </p>
        <Link
          to="/spring-week-portal/upgrade"
          className="flex items-center justify-between w-full bg-[#F5F5F5] text-[#111] rounded-xl px-5 py-3 text-[12px] font-semibold hover:bg-[#EBEBEB] transition-all border border-[#E0E0E0]"
        >
          <span>Unlock with Prepare - from £39</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#111] tracking-tight">Firm Intel</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Unlocked
          </p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-4">
        45+ firms covered. Phase-by-phase checklist, firm-specific conversion intel, and everything you need to know before your spring week starts.
      </p>
      <Link
        to="/spring-week-portal/handbook"
        className="flex items-center justify-between w-full bg-gradient-to-r from-[#111] to-[#222] text-white rounded-xl px-5 py-3 text-[12px] font-semibold hover:from-[#222] hover:to-[#333] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          Open your handbook
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ---- Matchmaking card ---- */

function MatchmakingCard({ hasFreeMatch }: { hasFreeMatch: boolean }) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Users className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#111] tracking-tight">Matchmaking</p>
          <p className="text-[11px] text-[#999] font-light mt-0.5">
            {hasFreeMatch ? "1 free call included with Convert" : "£60 per call"}
          </p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-4">
        30 minutes with someone who did your exact spring week and came out with the offer. They'll tell you what the week is really like, what caught people off guard, and what got them the return offer.
      </p>
      {hasFreeMatch && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-[12px] text-emerald-800 font-medium">
            You have 1 free prep call included
          </p>
        </div>
      )}
      <Link
        to="/spring-week-portal/matchmaking"
        className="flex items-center justify-between w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl px-5 py-3 text-[12px] font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
      >
        <span>Get matched with a converter</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ---- Speaker directory ---- */

function SpeakerDirectory() {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[#111] tracking-tight">Your panel</h2>
            <p className="text-[11px] text-[#999] font-light mt-0.5">
              {SPEAKERS.length} students who converted. All confirmed for April 12.
            </p>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {SPEAKERS.length} speakers
          </span>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPEAKERS.map((speaker) => (
            <div
              key={speaker.name}
              className="group bg-[#FAFAFA] hover:bg-white border border-[#F0F0F0] hover:border-[#E0E0E0] rounded-xl p-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222] to-[#444] flex items-center justify-center text-[13px] font-semibold text-white flex-shrink-0 shadow-sm">
                  {speaker.name[0]}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">{speaker.name}</p>
                  {speaker.university && (
                    <p className="text-[11px] text-[#AAA] font-light">{speaker.university}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {speaker.firms.map((firm) => (
                  <span
                    key={firm}
                    className="text-[10px] bg-white border border-[#E8E8E8] text-[#666] px-2.5 py-1 rounded-lg font-medium group-hover:border-[#DDD] transition-colors"
                  >
                    {firm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Upgrade banner ---- */

function UpgradeBanner({ tier }: { tier: "watch" | "prepare" }) {
  if (tier === "prepare") {
    return (
      <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/60 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl -translate-y-8 translate-x-8" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#111] tracking-tight">
              Talk to someone who already converted at your firm
            </p>
            <p className="text-[12px] text-[#777] font-light mt-1.5 leading-relaxed">
              Convert tier includes 1 free prep call (worth £60). 30 minutes, firm-specific, no generic advice.
              Slots are limited.
            </p>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Upgrade to Convert - £69
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/60 rounded-2xl p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl -translate-y-8 translate-x-8" />
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#111] tracking-tight">
            Students who prepare convert at 2-3x the rate
          </p>
          <p className="text-[12px] text-[#777] font-light mt-1.5 leading-relaxed">
            Know the AC format, the questions they ask, and how many students convert at your firm before you walk in.
          </p>
          <div className="flex items-center gap-2.5 mt-3">
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] text-white text-[12px] font-semibold hover:bg-[#222] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Prepare - £39
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDD] text-[#555] text-[12px] font-semibold hover:bg-white hover:border-[#BBB] transition-all"
            >
              Convert - £69
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Portal intro for free users ---- */

function PortalIntro({ firstName }: { firstName: string }) {
  return (
    <div className="relative bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-3xl -translate-y-12 translate-x-12" />
      <div className="relative">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#111] tracking-tight">
              {firstName ? `${firstName}, you` : "You"} have a spring week. Now convert it.
            </p>
          </div>
        </div>
        <p className="text-[13px] text-[#666] font-light leading-[1.7] mb-4">
          Spring weeks have 10-70% conversion rates depending on the firm. Most students who don't get the
          offer weren't less talented - they just weren't prepared.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {[
            { label: "Live panel + recording", tier: "Watch - £19", locked: true },
            { label: "Firm intel (45+ firms)", tier: "Prepare - £39", locked: true },
            { label: "Free prep call", tier: "Convert - £69", locked: true },
            { label: "Free checklist preview", tier: "Free", locked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 bg-[#FAFAFA] rounded-lg px-3 py-2 border border-[#F0F0F0]">
              <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${item.locked ? "bg-[#F0F0F0]" : "bg-emerald-100"}`}>
                {item.locked
                  ? <Lock className="w-2 h-2 text-[#BBB]" />
                  : <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                }
              </span>
              <span className="text-[12px] text-[#555] flex-1">{item.label}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${item.locked ? "bg-[#F0F0F0] text-[#AAA]" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                {item.tier}
              </span>
            </div>
          ))}
        </div>
        <Link
          to="/spring-week-portal/upgrade"
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          View all tiers
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ---- Free checklist card ---- */

function FreeChecklistCard() {
  return (
    <div className="bg-white border border-amber-200/60 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">
              5 things that cost students their spring week offers
            </p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5 uppercase tracking-wider">
              Free preview
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-2.5 mb-4">
          {[
            "Not researching previous spring weekers at their firm beforehand",
            "Treating the spring week like a job shadow instead of an audition",
            "Failing to follow up with seniors within 24 hours",
            "Preparing to summer internship level instead of spring week level",
            "Not having a clear personal story ready when seniors ask why finance",
          ].map((item, i) => (
            <div key={item} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 font-bold text-[10px]">{i + 1}</span>
              </span>
              <p className="text-[12px] text-[#555] font-light leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg px-4 py-2.5 mb-4">
          <p className="text-[11px] text-[#AAA] font-light">
            ...and 55+ more action items in the full handbook
          </p>
        </div>
        <Link
          to="/spring-week-portal/handbook"
          className="flex items-center justify-between w-full bg-[#111] text-white rounded-xl px-5 py-3 text-[12px] font-semibold hover:bg-[#222] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
        >
          <span>See the full checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ---- Main ---- */

export default function SpringWeekDashboard() {
  const access = useSwAccess();
  const { user } = useAuth();

  const firstName =
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "";

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] md:text-[26px] font-bold text-[#111] tracking-tight leading-tight">
                Spring Week Portal
              </h1>
              <p className="text-[13px] text-[#999] font-light mt-1.5">
                Everything you need to convert your spring week. April 13 is Monday.
              </p>
            </div>
            <TierBadge tier={access.tier} />
          </div>

          {/* Access summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
            {[
              { label: "Live Panel", active: access.hasWebinar, icon: Play },
              { label: "Firm Intel", active: access.hasHandbook, icon: BookOpen },
              { label: "Matchmaking", active: access.hasFreeMatch, icon: Users },
              { label: "Member Rates", active: access.hasCoachingDiscount, icon: Shield },
            ].map(({ label, active, icon: Icon }) => (
              <div
                key={label}
                className={`rounded-xl px-3 py-3 text-center border transition-all ${
                  active
                    ? "bg-emerald-50/80 border-emerald-100"
                    : "bg-[#F8F8F8] border-[#F0F0F0]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mx-auto mb-1.5 ${
                    active ? "text-emerald-500" : "text-[#DDD]"
                  }`}
                />
                <p
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    active ? "text-emerald-700" : "text-[#CCC]"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-5">
        {/* Portal intro for free users */}
        {access.tier === "free" && <PortalIntro firstName={firstName} />}

        {/* Free checklist card */}
        {(access.tier === "free" || access.tier === "watch") && <FreeChecklistCard />}

        {/* Live panel card */}
        <LivePanelCard hasAccess={access.hasWebinar} />

        {/* Firm Intel card */}
        <FirmIntelCard hasAccess={access.hasHandbook} />

        {/* Matchmaking card */}
        <MatchmakingCard hasFreeMatch={access.hasFreeMatch} />

        {/* Speaker directory */}
        <SpeakerDirectory />

        {/* Upgrade banners for non-convert */}
        {(access.tier === "free" || access.tier === "watch") && (
          <UpgradeBanner tier="watch" />
        )}
        {access.tier === "prepare" && <UpgradeBanner tier="prepare" />}

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[11px] text-[#CCC]">
            Questions?{" "}
            <a
              href="mailto:support@yourearlyedge.co.uk"
              className="text-[#AAA] underline underline-offset-2 hover:text-[#888] transition-colors"
            >
              support@yourearlyedge.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
