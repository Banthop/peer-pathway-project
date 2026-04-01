import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  BookOpen,
  Play,
  Users,
  Lock,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Clock,
  Building2,
  ChevronRight,
} from "lucide-react";
import type { SpringWeekTier } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { SPEAKERS, SPRING_WEEK_TICKETS } from "@/data/springWeekData";

/* ---------------------------------------------------------------
   Outlet context type
--------------------------------------------------------------- */
interface PortalContext {
  access: {
    tier: SpringWeekTier;
    hasPart1: boolean;
    hasPart2: boolean;
    hasPlaybook: boolean;
    hasCoaching: boolean;
  };
}

/* ---------------------------------------------------------------
   Tier label helpers
--------------------------------------------------------------- */
const TIER_LABELS: Record<NonNullable<SpringWeekTier>, string> = {
  part1: "Part 1",
  part2: "Part 2",
  bundle: "Bundle",
  premium: "Premium",
};

const TIER_COLORS: Record<NonNullable<SpringWeekTier>, string> = {
  part1: "bg-blue-50 text-blue-700 border-blue-200",
  part2: "bg-indigo-50 text-indigo-700 border-indigo-200",
  bundle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  premium: "bg-amber-50 text-amber-700 border-amber-200",
};

/* ---------------------------------------------------------------
   Section: Your Sessions
--------------------------------------------------------------- */
interface SessionCardProps {
  part: "Part 1" | "Part 2";
  hasAccess: boolean;
  description: string;
  upgradeLabel: string;
  upgradeLink: string;
}

function SessionCard({
  part,
  hasAccess,
  description,
  upgradeLabel,
  upgradeLink,
}: SessionCardProps) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 transition-all ${
        hasAccess ? "border-[#E8E8E8]" : "border-[#E8E8E8] opacity-75"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              hasAccess ? "bg-emerald-50" : "bg-[#F5F5F5]"
            }`}
          >
            {hasAccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lock className="w-5 h-5 text-[#CCC]" />
            )}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111]">
              Spring Week Conversion Panel - {part}
            </p>
            <p className="text-[12px] text-[#888] mt-0.5">Date TBC - check your email for updates</p>
          </div>
        </div>
        {hasAccess && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wider flex-shrink-0">
            Access Confirmed
          </span>
        )}
      </div>

      <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
        {description}
      </p>

      {hasAccess ? (
        <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#999] flex-shrink-0" />
          <p className="text-[12px] text-[#888] font-light">
            Live session details will be sent to your inbox closer to the date.
            The Zoom link will arrive 24 hours before.
          </p>
        </div>
      ) : (
        <a
          href={upgradeLink}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
        >
          {upgradeLabel}
          <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Section: Playbook
--------------------------------------------------------------- */
function PlaybookSection({ hasAccess }: { hasAccess: boolean }) {
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden ${
        hasAccess ? "border-[#E8E8E8]" : "border-[#E8E8E8]"
      }`}
    >
      <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#888]" />
          <h2 className="text-[14px] font-semibold text-[#111]">
            The Spring Week Playbook
          </h2>
        </div>
        {hasAccess && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wider">
            Included
          </span>
        )}
      </div>

      <div className="p-5">
        {hasAccess ? (
          <div className="space-y-4">
            <p className="text-[13px] text-[#666] font-light leading-relaxed">
              The Spring Week Playbook is being compiled from write-ups by
              real spring weekers across Goldman, Citi, Barclays, Optiver,
              and more. It covers what each programme involved, insider tips,
              the interview process, how to convert, and the mistakes to
              avoid. It will be sent to your inbox once finalised.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <p className="text-[12px] text-amber-800 font-light leading-relaxed">
                The Playbook is in production. You will receive it by email
                before the live sessions.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13px] text-[#666] font-light leading-relaxed">
              The Spring Week Playbook is a master guide compiled from
              first-hand write-ups by students who completed spring weeks at
              top firms. Firm-by-firm breakdowns, insider tips, conversion
              strategies, and mistakes to avoid.
            </p>
            <a
              href={SPRING_WEEK_TICKETS.bundle.stripeLink}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
            >
              Upgrade to Bundle to unlock
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Section: Recordings
--------------------------------------------------------------- */
function RecordingsSection({ hasPart1, hasPart2 }: { hasPart1: boolean; hasPart2: boolean }) {
  const hasAny = hasPart1 || hasPart2;

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center gap-2">
        <Play className="w-4 h-4 text-[#888]" />
        <h2 className="text-[14px] font-semibold text-[#111]">Your Recordings</h2>
      </div>

      <div className="p-5">
        {hasAny ? (
          <div className="space-y-3">
            {hasPart1 && (
              <div className="flex items-center justify-between bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#111]">Part 1 Recording</p>
                    <p className="text-[11px] text-[#888]">Available after the live session</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#BBB] font-medium">Coming soon</span>
              </div>
            )}
            {hasPart2 && (
              <div className="flex items-center justify-between bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#111]">Part 2 Recording</p>
                    <p className="text-[11px] text-[#888]">Available after the live session</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#BBB] font-medium">Coming soon</span>
              </div>
            )}
            <p className="text-[12px] text-[#999] font-light">
              Recordings are published to this portal within 24 hours of each live session.
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-[#888] font-light">
            You do not currently have access to any recordings. Purchase a ticket
            to unlock recording access after the live sessions.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Section: Book Coaching
--------------------------------------------------------------- */
function CoachingSection({ hasAccess }: { hasAccess: boolean }) {
  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        hasAccess
          ? "bg-white border-[#E8E8E8]"
          : "bg-white border-[#E8E8E8] opacity-75"
      }`}
    >
      <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#888]" />
          <h2 className="text-[14px] font-semibold text-[#111]">Book Coaching</h2>
        </div>
        {!hasAccess && (
          <span className="text-[10px] font-semibold text-[#999] bg-[#F5F5F5] border border-[#E8E8E8] px-2 py-1 rounded-full uppercase tracking-wider">
            Premium Only
          </span>
        )}
      </div>

      <div className="p-5">
        {hasAccess ? (
          <div className="space-y-4">
            <p className="text-[13px] text-[#666] font-light leading-relaxed">
              Your Premium ticket includes a 1-on-1 coaching session with one
              of the panellists. This is a direct call with someone who
              completed and converted a spring week at a top firm.
            </p>
            <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3">
              <p className="text-[12px] text-[#888] font-light leading-relaxed">
                We will reach out to you by email to schedule your coaching
                session after the live panels are confirmed. Prefer a specific
                firm? Let us know by replying to that email.
              </p>
            </div>
            <a
              href="mailto:d.awotwi@lse.ac.uk?subject=Spring%20Week%20Coaching%20-%20Premium%20Session"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors"
            >
              Contact us to schedule
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13px] text-[#666] font-light leading-relaxed">
              Upgrade to Premium to unlock a 1-on-1 coaching session with one
              of the panellists. Get personalised advice from someone who
              converted their spring week into a return offer.
            </p>
            <a
              href={SPRING_WEEK_TICKETS.premium.stripeLink}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
            >
              Upgrade to Premium - 49
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Section: Speakers
--------------------------------------------------------------- */
function SpeakersSection() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#888]" />
          <h2 className="text-[14px] font-semibold text-[#111]">Your Speakers</h2>
        </div>
        <span className="text-[12px] text-[#999] font-light">
          {SPEAKERS.length} confirmed
        </span>
      </div>

      <div className="divide-y divide-[#F5F5F5]">
        {SPEAKERS.map((speaker, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[11px] font-semibold text-[#888] flex-shrink-0">
                {speaker.firm.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#111]">
                  {speaker.firm}
                </p>
                {speaker.note && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    {speaker.note}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#BBB] font-light">
                Speaker TBC
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#DDD]" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#E8E8E8]">
        <p className="text-[11px] text-[#BBB] font-light">
          Speaker names will be confirmed and updated here as they are
          finalised. All speakers have completed spring weeks at their listed
          firm.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Main page
--------------------------------------------------------------- */
export default function SpringWeekPortal() {
  const { access } = useOutletContext<PortalContext>();
  const { user } = useAuth();

  const name =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there";

  const tier = access.tier as NonNullable<SpringWeekTier>;
  const tierLabel = TIER_LABELS[tier];
  const tierColorClass = TIER_COLORS[tier];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 md:px-10 lg:px-12 border-b border-[#E8E8E8] bg-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-[#999] font-medium uppercase tracking-wider mb-1">
              Spring Week Conversion Panel
            </p>
            <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-[#111]">
              Welcome back{name !== "there" ? `, ${name.split(" ")[0]}` : ""}.
            </h1>
            <p className="text-sm text-[#888] mt-1 font-light">
              Here is everything included in your purchase.
            </p>
          </div>

          {/* Tier badge */}
          <div className={`border rounded-xl px-4 py-3 flex-shrink-0 ${tierColorClass}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Your Tier
            </p>
            <p className="text-[16px] font-semibold mt-0.5">{tierLabel}</p>
          </div>
        </div>

        {/* What's included summary */}
        <div className="mt-5 flex flex-wrap gap-2">
          {access.hasPart1 && (
            <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#444] text-[12px] font-medium px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Part 1
            </span>
          )}
          {access.hasPart2 && (
            <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#444] text-[12px] font-medium px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Part 2
            </span>
          )}
          {access.hasPlaybook && (
            <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#444] text-[12px] font-medium px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Spring Week Playbook
            </span>
          )}
          {access.hasCoaching && (
            <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#444] text-[12px] font-medium px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1-on-1 Coaching
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 md:px-10 lg:px-12">
        <div className="max-w-4xl space-y-6">

          {/* Sessions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#888]" />
              <h2 className="text-[15px] font-semibold text-[#111]">Your Sessions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                part="Part 1"
                hasAccess={access.hasPart1}
                description="3-4 panellists from different firms covering how they approached their spring week from day one. What they did differently, how they stood out, and what most students get wrong."
                upgradeLabel="Upgrade to access Part 1"
                upgradeLink={SPRING_WEEK_TICKETS.bundle.stripeLink}
              />
              <SessionCard
                part="Part 2"
                hasAccess={access.hasPart2}
                description="A different set of panellists from complementary firms. Focuses on the final weeks of the spring week, conversion conversations, and how to turn a good performance into a formal offer."
                upgradeLabel="Upgrade to access Part 2"
                upgradeLink={SPRING_WEEK_TICKETS.bundle.stripeLink}
              />
            </div>
          </section>

          {/* Playbook + Recordings side by side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaybookSection hasAccess={access.hasPlaybook} />
            <RecordingsSection
              hasPart1={access.hasPart1}
              hasPart2={access.hasPart2}
            />
          </div>

          {/* Coaching */}
          <CoachingSection hasAccess={access.hasCoaching} />

          {/* Speakers */}
          <SpeakersSection />

          {/* Upgrade prompt for part1 or part2 only buyers */}
          {(tier === "part1" || tier === "part2") && (
            <div className="bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-2xl p-7 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-2">
                Upgrade
              </p>
              <h3 className="text-xl font-semibold mb-2">
                Get both parts and the Playbook
              </h3>
              <p className="text-[13px] text-white/60 font-light leading-relaxed mb-5 max-w-lg">
                The Bundle gives you both Part 1 and Part 2 plus The Spring
                Week Playbook. Each part features different firms and
                different speakers. The firms are split deliberately so you
                get the full picture only with the Bundle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={SPRING_WEEK_TICKETS.bundle.stripeLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] font-semibold transition-colors"
                >
                  Upgrade to Bundle - 29
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={SPRING_WEEK_TICKETS.premium.stripeLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium transition-colors"
                >
                  Go Premium (includes coaching) - 49
                </a>
              </div>
            </div>
          )}

          {/* Upgrade prompt for bundle buyers to premium */}
          {tier === "bundle" && (
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold text-[#111] mb-1">
                    Want a 1-on-1 with a panellist?
                  </h3>
                  <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
                    Upgrade to Premium to add a direct coaching session with
                    one of the panellists. Get personalised advice from
                    someone who converted at the firm you are targeting.
                  </p>
                  <a
                    href={SPRING_WEEK_TICKETS.premium.stripeLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] text-white text-[13px] font-semibold hover:bg-[#222] transition-colors"
                  >
                    Upgrade to Premium - 49
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
