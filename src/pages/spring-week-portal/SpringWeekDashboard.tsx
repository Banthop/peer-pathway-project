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
  Zap,
  Star,
  AlertTriangle,
  Phone,
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
  const styles: Record<string, string> = {
    convert: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    prepare: "bg-blue-100 text-blue-800 border border-blue-200",
    watch: "bg-slate-100 text-slate-700 border border-slate-200",
    free: "bg-white text-slate-500 border border-slate-300",
  };

  const labels: Record<string, string> = {
    convert: "Convert",
    prepare: "Prepare",
    watch: "Watch",
    free: "Free",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles[tier]}`}
    >
      {tier === "convert" && <Star className="w-3 h-3 fill-current" />}
      {labels[tier]}
    </span>
  );
}

/* ---- Live Panel card ---- */

function LivePanelCard({ hasAccess }: { hasAccess: boolean }) {
  const postEvent = isPostEvent();

  if (!hasAccess) {
    return (
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
          <div className="text-center space-y-3 px-6">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-[#999]" />
            </div>
            <p className="text-[13px] font-semibold text-[#111]">Live panel access required</p>
            <p className="text-[12px] text-[#888] font-light">
              Watch students who converted share exactly what they did differently.
              Upgrade to Watch, Prepare, or Convert to access.
            </p>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-block px-5 py-2 rounded-xl bg-[#111] text-white text-[12px] font-semibold hover:bg-[#222] transition-colors"
            >
              See upgrade options
            </Link>
          </div>
        </div>
        {/* Blurred background content */}
        <div className="opacity-30 pointer-events-none select-none">
          <LivePanelCardContent postEvent={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <LivePanelCardContent postEvent={postEvent} />
    </div>
  );
}

function LivePanelCardContent({ postEvent }: { postEvent: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Play className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">Live Panel</p>
            <p className="text-[11px] text-[#888] font-light mt-0.5">
              {postEvent ? "Recording now available" : "April 12, 2026"}
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
          <p className="text-[13px] text-[#555] font-light leading-relaxed">
            The live session has ended. Your full recording is ready. Students who converted at Goldman, JP Morgan, Barclays, Lazard, and more share exactly what they did differently.
          </p>
          <Link
            to="/spring-week-portal/recording"
            className="flex items-center justify-between bg-[#111] text-white rounded-xl px-4 py-3 text-[13px] font-semibold hover:bg-[#222] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch the recording
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] text-[#555] font-light leading-relaxed">
            Students who converted at Goldman, JP Morgan, Barclays, Lazard, and more share exactly what they did differently. You'll hear the specific mistakes that cost students their offers and the exact strategies that got others the return offer.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-[12px] text-blue-800 font-semibold">{SW_EVENT_DATE}, 2:00 PM BST on Zoom</p>
            </div>
            <p className="text-[11px] text-blue-600 font-light">
              Zoom link sent to your email 1 hour before. Check your inbox.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Firm Intel card (was Handbook) ---- */

function FirmIntelCard({ hasAccess }: { hasAccess: boolean }) {
  if (!hasAccess) {
    return (
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4 text-[#BBB]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">Firm Intel</p>
            <p className="text-[11px] text-[#888] font-light mt-0.5">45+ firms. Conversion rates. AC formats.</p>
          </div>
        </div>
        <p className="text-[12px] text-[#888] font-light leading-relaxed mb-2">
          Barclays converts 70% of spring weekers. JP Morgan converts 10%. Blackstone converts 3%. The handbook tells you exactly why, and what to do about it at your specific firm.
        </p>
        <p className="text-[12px] text-[#666] font-medium mb-3">
          Includes the AC format for your firm, what questions they ask, and the networking moves that actually work.
        </p>
        <Link
          to="/spring-week-portal/upgrade"
          className="flex items-center justify-between w-full bg-[#F5F5F5] text-[#111] rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-[#EBEBEB] transition-colors border border-[#E0E0E0]"
        >
          <span>Unlock with Prepare - from £39</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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
          <p className="text-[13px] font-semibold text-[#111]">Firm Intel</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Unlocked</p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
        45+ firms covered. Phase-by-phase checklist, firm-specific conversion intel, networking scripts, and division-specific technical prep.
      </p>
      <Link
        to="/spring-week-portal/handbook"
        className="flex items-center justify-between w-full bg-[#111] text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-[#222] transition-colors"
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

/* ---- Prep Call card (was Matchmaking) ---- */

function PrepCallCard({ hasFreeMatch }: { hasFreeMatch: boolean }) {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Phone className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#111]">Prep Call</p>
          <p className="text-[11px] text-[#888] font-light mt-0.5">
            {hasFreeMatch ? "1 free call included with Convert" : "£50 per call"}
          </p>
        </div>
      </div>
      <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
        30 minutes with someone who did your exact spring week and came out with the offer. They'll tell you what the week is really like, what caught people off guard, and exactly what got them the return offer.
      </p>
      {hasFreeMatch && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-[12px] text-emerald-800 font-medium">
            You have 1 free prep call included with Convert
          </p>
        </div>
      )}
      <Link
        to="/spring-week-portal/matchmaking"
        className="flex items-center justify-between w-full bg-indigo-600 text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-indigo-700 transition-colors"
      >
        <span>Book a prep call</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ---- Speaker directory (now "Your panel") ---- */

function SpeakerDirectory() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[14px] font-semibold text-[#111]">Your panel</h2>
        <span className="text-[11px] text-[#888] font-light">
          {SPEAKERS.length} converters confirmed
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
              {speaker.firms.map((firm) => (
                <span
                  key={firm}
                  className="text-[10px] bg-white border border-[#E8E8E8] text-[#555] px-2 py-0.5 rounded-full font-medium"
                >
                  {firm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Upgrade banner ---- */

function UpgradeBanner({ tier }: { tier: "watch" | "prepare" }) {
  if (tier === "prepare") {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#111]">
              Spring weeks start in days. Talk to someone who already converted at your firm.
            </p>
            <p className="text-[12px] text-[#888] font-light mt-1 leading-relaxed">
              Convert tier includes 1 free prep call (worth £50). 30 minutes, firm-specific, no generic advice.
              Slots are limited - converters only take a few calls per week.
            </p>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
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
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#111]">
            Spring weeks start in days. Students who prepare convert at 2-3x the rate of those who don't.
          </p>
          <p className="text-[12px] text-[#888] font-light mt-1 leading-relaxed">
            The Prepare tier gives you firm-specific conversion intel for 45+ firms. Know the AC format,
            the questions they ask, and how many students convert - before you walk in.
            Most students choose Prepare (£39).
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Prepare - £39
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#DDD]">|</span>
            <Link
              to="/spring-week-portal/upgrade"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-orange-700 hover:text-orange-800 transition-colors"
            >
              Convert (with prep call) - £69
              <ArrowRight className="w-3.5 h-3.5" />
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
    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#111] mb-1">
            {firstName ? `${firstName}, you` : "You"} have a spring week. Now you have to convert it.
          </p>
          <p className="text-[13px] text-[#666] font-light leading-relaxed mb-3">
            Spring weeks have 10-70% conversion rates depending on the firm. Most students who don't get the
            offer weren't less talented. They just weren't prepared. This portal exists to close that gap.
            You currently have a free account.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {[
              { label: "Live panel + recording", tier: "Watch - £19", locked: true },
              { label: "Firm intel (45+ firms)", tier: "Prepare - £39", locked: true },
              { label: "Free prep call", tier: "Convert - £69", locked: true },
              { label: "Free checklist preview", tier: "Free", locked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center ${item.locked ? "bg-[#F0F0F0]" : "bg-emerald-100"}`}>
                  {item.locked
                    ? <Lock className="w-2 h-2 text-[#BBB]" />
                    : <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  }
                </span>
                <span className="text-[12px] text-[#555]">{item.label}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0 ${item.locked ? "bg-[#F5F5F5] text-[#AAA]" : "bg-emerald-50 text-emerald-700"}`}>
                  {item.tier}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/spring-week-portal/upgrade"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            View all tiers
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 md:px-8 py-6">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
              Your Spring Week Command Centre
            </h1>
            <p className="text-[13px] text-[#888] font-light mt-1">
              Spring weeks start April 13. Here's everything you need to convert yours.
            </p>
          </div>
          <TierBadge tier={access.tier} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-4">
        {/* Portal intro for free users */}
        {access.tier === "free" && <PortalIntro firstName={firstName} />}

        {/* Access summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Live Panel", active: access.hasWebinar },
            { label: "Firm Intel", active: access.hasHandbook },
            { label: "Prep Call", active: access.hasFreeMatch },
            { label: "Priority Support", active: access.hasCoachingDiscount },
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

        {/* Free checklist card - shown to free and watch tiers */}
        {(access.tier === "free" || access.tier === "watch") && (
          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111]">
                  Free: The 5 things that cost students their spring week offers
                </p>
                <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                  Most students make at least one of these
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {[
                "Not researching previous spring weekers at their firm beforehand",
                "Treating the spring week like a job shadow instead of an audition",
                "Failing to follow up with seniors within 24 hours",
                "Preparing to summer internship level instead of spring week level",
                "Not having a clear personal story ready when seniors ask why finance",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold text-[13px] mt-0.5 flex-shrink-0">x</span>
                  <p className="text-[12px] text-[#555] font-light leading-relaxed">{item}</p>
                </div>
              ))}
              <p className="text-[11px] text-[#BBB] italic pl-4">
                ...and 55+ more action items in the full handbook
              </p>
            </div>
            <Link
              to="/spring-week-portal/handbook"
              className="flex items-center justify-between w-full bg-[#111] text-white rounded-xl px-4 py-2.5 text-[12px] font-semibold hover:bg-[#222] transition-colors"
            >
              <span>See the full checklist preview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Live panel card */}
        <LivePanelCard hasAccess={access.hasWebinar} />

        {/* Firm Intel card */}
        <FirmIntelCard hasAccess={access.hasHandbook} />

        {/* Prep Call card */}
        <PrepCallCard hasFreeMatch={access.hasFreeMatch} />

        {/* Speaker directory */}
        <SpeakerDirectory />

        {/* Upgrade banners for non-convert */}
        {(access.tier === "free" || access.tier === "watch") && (
          <UpgradeBanner tier="watch" />
        )}
        {access.tier === "prepare" && <UpgradeBanner tier="prepare" />}

        {/* Footer */}
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
