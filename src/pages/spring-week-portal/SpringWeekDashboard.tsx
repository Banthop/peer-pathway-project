import { Link } from "react-router-dom";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import {
  SPEAKERS,
  SW_EVENT_DATE,
  SW_EVENT_TIME,
  SW_EVENT_PLATFORM,
  STRIPE_SW_BUNDLE,
  STRIPE_SW_PREMIUM,
} from "@/data/springWeekData";
import {
  Play,
  BookOpen,
  Users,
  Lock,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star,
} from "lucide-react";

// April 12, 2026 at 2pm BST = UTC 1pm
const EVENT_ISO = "2026-04-12T13:00:00Z";

// Simple post-event check
function isPostEvent(): boolean {
  return Date.now() > new Date(EVENT_ISO).getTime();
}

/* ---- Tier badge ---- */

interface TierBadgeProps {
  tier: "free" | "webinar" | "bundle" | "premium";
}

function TierBadge({ tier }: TierBadgeProps) {
  const styles: Record<string, string> = {
    premium:
      "bg-emerald-100 text-emerald-800 border border-emerald-200",
    bundle:
      "bg-blue-100 text-blue-800 border border-blue-200",
    webinar:
      "bg-slate-100 text-slate-700 border border-slate-200",
    free:
      "bg-white text-slate-500 border border-slate-300",
  };

  const labels: Record<string, string> = {
    premium: "Premium",
    bundle: "Bundle",
    webinar: "Webinar",
    free: "Free",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles[tier]}`}
    >
      {tier === "premium" && <Star className="w-3 h-3 fill-current" />}
      {labels[tier]}
    </span>
  );
}

/* ---- Webinar card ---- */

function WebinarCard({ hasAccess }: { hasAccess: boolean }) {
  const postEvent = isPostEvent();

  if (!hasAccess) {
    return (
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
          <div className="text-center space-y-3 px-6">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-[#999]" />
            </div>
            <p className="text-[13px] font-semibold text-[#111]">Webinar access not included</p>
            <p className="text-[12px] text-[#888] font-light">
              Upgrade to Webinar, Bundle, or Premium to watch live and get the recording.
            </p>
            <a
              href={STRIPE_SW_BUNDLE}
              className="inline-block px-5 py-2 rounded-xl bg-[#111] text-white text-[12px] font-semibold hover:bg-[#222] transition-colors"
            >
              Upgrade now
            </a>
          </div>
        </div>
        {/* Blurred background content */}
        <div className="opacity-30 pointer-events-none select-none">
          <WebinarCardContent postEvent={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <WebinarCardContent postEvent={postEvent} />
    </div>
  );
}

function WebinarCardContent({ postEvent }: { postEvent: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Play className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">
              Spring Week Conversion Webinar
            </p>
            <p className="text-[11px] text-[#888] font-light mt-0.5">
              {postEvent ? "Recording now available" : "Live event"}
            </p>
          </div>
        </div>
        {postEvent ? (
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-wider">
            Watch now
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Upcoming
          </span>
        )}
      </div>

      {postEvent ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#555] font-light">
            The live session has ended. Access your full recording below.
          </p>
          <Link
            to="/spring-week-portal/recording"
            className="flex items-center justify-between bg-[#111] text-white rounded-xl px-4 py-3 text-[13px] font-semibold hover:bg-[#222] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch recording
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#FAFAFA] rounded-xl p-3 text-center">
              <Calendar className="w-4 h-4 text-[#888] mx-auto mb-1" />
              <p className="text-[11px] text-[#888] font-light">Date</p>
              <p className="text-[12px] font-semibold text-[#111]">{SW_EVENT_DATE}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-[#888] mx-auto mb-1" />
              <p className="text-[11px] text-[#888] font-light">Time</p>
              <p className="text-[12px] font-semibold text-[#111]">{SW_EVENT_TIME}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-xl p-3 text-center">
              <Video className="w-4 h-4 text-[#888] mx-auto mb-1" />
              <p className="text-[11px] text-[#888] font-light">Platform</p>
              <p className="text-[12px] font-semibold text-[#111]">{SW_EVENT_PLATFORM}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[12px] text-blue-800 font-medium">
              Zoom link shared 1 hour before the event
            </p>
            <p className="text-[11px] text-blue-600 font-light mt-0.5">
              Check your email - it will be sent to your registered address.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Handbook card ---- */

function HandbookCard({ hasAccess }: { hasAccess: boolean }) {
  if (!hasAccess) {
    return (
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4 text-[#BBB]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">Spring Week Handbook</p>
            <p className="text-[11px] text-[#888] font-light mt-0.5">45+ firms covered</p>
          </div>
        </div>
        <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
          Firm-by-firm breakdown of what to expect, 6-phase conversion checklist,
          networking scripts, and insider tactics for every major firm.
        </p>
        <a
          href={STRIPE_SW_BUNDLE}
          className="flex items-center justify-between w-full bg-[#F5F5F5] text-[#111] rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-[#EBEBEB] transition-colors border border-[#E0E0E0]"
        >
          <span>Upgrade to Bundle to unlock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#111]">Spring Week Handbook</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Unlocked</p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
        Your complete insider guide covering 45+ firms. Includes 6-phase checklist,
        networking scripts, and firm-specific conversion intel.
      </p>
      <Link
        to="/spring-week-portal/handbook"
        className="flex items-center justify-between w-full bg-[#111] text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-[#222] transition-colors"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          Access your handbook
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ---- Matchmaking card ---- */

function MatchmakingCard({
  hasFreeMatch,
}: {
  hasFreeMatch: boolean;
}) {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#111]">Matchmaking</p>
          <p className="text-[11px] text-[#888] font-light mt-0.5">
            Get matched with a speaker from your target firm
          </p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
        We pair you 1-to-1 with a spring weeker who converted at your target firm.
        They know the exact culture, format, and what the assessors looked for.
      </p>
      {hasFreeMatch && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-[12px] text-emerald-800 font-medium">
            You have 1 free match included with Premium
          </p>
        </div>
      )}
      <Link
        to="/spring-week-portal/matchmaking"
        className="flex items-center justify-between w-full bg-indigo-600 text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-indigo-700 transition-colors"
      >
        <span>Find your match</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ---- Speaker directory ---- */

function SpeakerDirectory() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[14px] font-semibold text-[#111]">Your speakers</h2>
        <span className="text-[11px] text-[#888] font-light">
          {SPEAKERS.length} panellists confirmed
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPEAKERS.map((speaker) => (
          <div
            key={speaker.name}
            className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3.5"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
                {speaker.name[0]}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111]">{speaker.name}</p>
                {speaker.university && (
                  <p className="text-[11px] text-[#888] font-light">{speaker.university}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {speaker.firms.slice(0, 3).map((firm) => (
                <span
                  key={firm}
                  className="text-[10px] bg-white border border-[#E8E8E8] text-[#555] px-2 py-0.5 rounded-full font-medium"
                >
                  {firm}
                </span>
              ))}
              {speaker.firms.length > 3 && (
                <span className="text-[10px] text-[#BBB] px-1 py-0.5 font-light">
                  +{speaker.firms.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Upgrade banner ---- */

function UpgradeBanner({ tier }: { tier: "webinar" | "bundle" }) {
  if (tier === "bundle") {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#111]">
              Add Premium for 1 free matchmaking session
            </p>
            <p className="text-[12px] text-[#888] font-light mt-1 leading-relaxed">
              Premium includes a 1-to-1 match with a converter from your target firm,
              plus priority coaching booking and discounted rates.
            </p>
            <a
              href={STRIPE_SW_PREMIUM}
              className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Upgrade to Premium
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-blue-700" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#111]">
            Unlock the full bundle
          </p>
          <p className="text-[12px] text-[#888] font-light mt-1 leading-relaxed">
            Add the Spring Week Handbook (45+ firms) and 1-to-1 matchmaking.
            Upgrade to Bundle or Premium.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href={STRIPE_SW_BUNDLE}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            >
              Bundle - £39
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <span className="text-[#DDD]">|</span>
            <a
              href={STRIPE_SW_PREMIUM}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-700 hover:text-indigo-800 transition-colors"
            >
              Premium - £64
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */

export default function SpringWeekDashboard() {
  const access = useSwAccess();

  const firstName =
    typeof window !== "undefined"
      ? undefined
      : undefined; // resolved via auth context if needed

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 md:px-8 py-6">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
              Spring Week Portal
            </h1>
            <p className="text-[13px] text-[#888] font-light mt-1">
              April 12, 2026 - How Students Converted Their Spring Weeks Into Return Offers
            </p>
          </div>
          <TierBadge tier={access.tier} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-4">
        {/* Access summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Webinar", active: access.hasWebinar },
            { label: "Handbook", active: access.hasHandbook },
            { label: "1 Free Match", active: access.hasFreeMatch },
            { label: "Coaching Discount", active: access.hasCoachingDiscount },
          ].map(({ label, active }) => (
            <div
              key={label}
              className={`rounded-xl px-3 py-2.5 text-center border ${
                active
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-[#FAFAFA] border-[#F0F0F0]"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 mx-auto mb-1 ${
                  active ? "text-emerald-500" : "text-[#DDD]"
                }`}
              />
              <p
                className={`text-[11px] font-medium leading-tight ${
                  active ? "text-emerald-800" : "text-[#BBB]"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Free checklist preview for free/webinar users */}
        {(access.tier === "free" || access.tier === "webinar") && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111]">Free: Spring Week Conversion Checklist</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">4 Phases, 60+ Action Items</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {[
                "Find 2-3 people who did your exact spring week last year",
                "Learn technicals to summer internship level, not spring week level",
                "Prepare 2-3 tailored questions per team you'll meet",
                "Follow up every meaningful conversation within 24 hours",
                "Have a compelling personal story ready for senior interviews",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-[#555] font-light leading-relaxed">{item}</p>
                </div>
              ))}
              <p className="text-[11px] text-[#BBB] italic pl-5">...and 55+ more action items in the full handbook</p>
            </div>
            <Link
              to="/spring-week-portal/handbook"
              className="flex items-center justify-between w-full bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-emerald-700 transition-colors"
            >
              <span>View the checklist preview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Webinar card */}
        <WebinarCard hasAccess={access.hasWebinar} />

        {/* Handbook card */}
        <HandbookCard hasAccess={access.hasHandbook} />

        {/* Matchmaking card */}
        <MatchmakingCard hasFreeMatch={access.hasFreeMatch} />

        {/* Speaker directory */}
        <SpeakerDirectory />

        {/* Upgrade banner for non-premium */}
        {access.tier === "free" && <UpgradeBanner tier="webinar" />}
        {access.tier === "webinar" && <UpgradeBanner tier="webinar" />}
        {access.tier === "bundle" && <UpgradeBanner tier="bundle" />}

        {/* Footer note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-[#CCC]">
            Questions?{" "}
            <a
              href="mailto:d.awotwi@lse.ac.uk"
              className="text-[#AAA] underline underline-offset-2"
            >
              d.awotwi@lse.ac.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
