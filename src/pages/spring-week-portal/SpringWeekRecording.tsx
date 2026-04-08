import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Lock, CalendarDays, Clock, ArrowRight, Zap } from "lucide-react";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import {
  SW_EVENT_DATE,
  SW_EVENT_TIME,
  SW_EVENT_PLATFORM,
  STRIPE_SW_WEBINAR,
  STRIPE_SW_BUNDLE,
  STRIPE_SW_PREMIUM,
  SPRING_WEEK_NIGHTS,
} from "@/data/springWeekData";

// --------------- Config ---------------

// Flip to true after the event to show the recording player
const RECORDING_LIVE = false;

// Replace with real Vimeo ID once uploaded
const VIMEO_VIDEO_ID = "000000000";

// Event target - April 12 2026 at 14:00 BST (UTC+1)
const EVENT_TARGET_MS = new Date("2026-04-12T13:00:00Z").getTime();

// --------------- Countdown hook ---------------

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function useCountdown(targetMs: number): CountdownParts {
  const calc = (): CountdownParts => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, expired: false };
  };

  const [parts, setParts] = useState<CountdownParts>(calc);

  useEffect(() => {
    const interval = setInterval(() => setParts(calc()), 1000);
    return () => clearInterval(interval);
  });

  return parts;
}

// --------------- Sub-components ---------------

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-[#111] rounded-xl px-4 py-3 min-w-[64px]">
      <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[#666] uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

interface PaywallBannerProps {
  onUpgrade: () => void;
}

function PaywallBanner({ onUpgrade }: PaywallBannerProps) {
  return (
    <div className="bg-[#111] rounded-2xl p-7 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-[#666]" />
        </div>
        <div>
          <p className="text-white font-bold text-[15px]">Recording requires webinar access</p>
          <p className="text-[#888] text-[13px] font-light mt-1 leading-relaxed">
            Upgrade to any paid tier to watch the recording after the live event on {SW_EVENT_DATE}.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <a
          href={STRIPE_SW_WEBINAR}
          className="block w-full py-3 rounded-xl border border-[#333] text-[#CCC] text-[13px] font-semibold text-center hover:bg-[#1A1A1A] transition-colors"
        >
          Webinar only - 17
        </a>
        <a
          href={STRIPE_SW_BUNDLE}
          className="block w-full py-3 rounded-xl bg-white text-[#111] text-[13px] font-bold text-center hover:bg-[#F5F5F5] transition-colors"
        >
          Bundle (Webinar + Handbook) - 39
        </a>
        <a
          href={STRIPE_SW_PREMIUM}
          className="block w-full py-3 rounded-xl border border-emerald-500 text-emerald-400 text-[13px] font-semibold text-center hover:bg-emerald-500/10 transition-colors"
        >
          Premium (Bundle + 1 free match) - 64
        </a>
        <button
          onClick={onUpgrade}
          className="w-full py-2.5 text-[12px] text-[#555] hover:text-[#888] transition-colors flex items-center justify-center gap-1"
        >
          Compare all tiers
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// --------------- Pre-event state (RECORDING_LIVE = false) ---------------

function PreEventView({ hasAccess }: { hasAccess: boolean }) {
  const countdown = useCountdown(EVENT_TARGET_MS);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Countdown card */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-[12px] font-bold text-[#555] uppercase tracking-wider">Live event countdown</p>
          </div>
        </div>
        <div className="px-6 py-7 flex flex-col items-center text-center space-y-5">
          <div className="flex items-center gap-2 text-[#111]">
            <CalendarDays className="w-4 h-4 text-[#888]" />
            <p className="text-[14px] font-semibold">{SW_EVENT_DATE}</p>
            <span className="text-[#DDD]">|</span>
            <Clock className="w-4 h-4 text-[#888]" />
            <p className="text-[14px] font-semibold">{SW_EVENT_TIME}</p>
          </div>

          {countdown.expired ? (
            <p className="text-[#888] text-[14px] font-medium">The event has started - join on {SW_EVENT_PLATFORM}</p>
          ) : (
            <div className="flex items-center gap-3">
              <CountdownBox value={countdown.days} label="days" />
              <CountdownBox value={countdown.hours} label="hrs" />
              <CountdownBox value={countdown.minutes} label="min" />
              <CountdownBox value={countdown.seconds} label="sec" />
            </div>
          )}

          <p className="text-[12px] text-[#AAA] font-light">
            {SW_EVENT_PLATFORM} - your link will be emailed 24 hours before
          </p>
        </div>
      </div>

      {/* Session breakdown */}
      <div className="space-y-3">
        <h2 className="text-[14px] font-semibold text-[#111]">What's happening on the day</h2>
        <div className="space-y-3">
          {SPRING_WEEK_NIGHTS.map((session) => (
            <div key={session.id} className="bg-white border border-[#E8E8E8] rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: session.accent }}
                    />
                    <p className="text-[13px] font-semibold text-[#111]">{session.label}: {session.theme}</p>
                  </div>
                  <p className="text-[12px] text-[#888] font-light">{session.tagline}</p>
                </div>
                <span className="text-[11px] text-[#AAA] font-medium whitespace-nowrap">{session.date}</span>
              </div>
              {session.id !== "3" && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {session.speakers.map((firm) => (
                    <span key={firm} className="bg-[#F5F5F5] text-[#666] text-[11px] px-2 py-0.5 rounded-md font-medium">
                      {firm}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recording notice */}
      <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl px-5 py-4 flex items-start gap-3">
        <Play className="w-4 h-4 text-[#AAA] flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#888] font-light leading-relaxed">
          The recording will be available here within 24 hours of the live session.
          You'll receive an email notification when it's ready.
        </p>
      </div>

      {/* Paywall for users without webinar access */}
      {!hasAccess && (
        <PaywallBanner onUpgrade={() => navigate("/spring-week-portal/upgrade")} />
      )}
    </div>
  );
}

// --------------- Post-event state (RECORDING_LIVE = true) ---------------

function PostEventView({ hasAccess }: { hasAccess: boolean }) {
  const navigate = useNavigate();

  if (!hasAccess) {
    return (
      <div className="space-y-5">
        {/* Blurred preview */}
        <div className="relative bg-[#111] rounded-2xl overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-white/60" />
              </div>
              <p className="text-white font-semibold text-[14px]">Recording locked</p>
              <p className="text-[#888] text-[12px] font-light">Upgrade to watch</p>
            </div>
          </div>
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A2E] to-[#16213E] opacity-60" />
        </div>
        <PaywallBanner onUpgrade={() => navigate("/spring-week-portal/upgrade")} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Vimeo embed */}
      <div className="bg-[#000] rounded-2xl overflow-hidden shadow-xl">
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?title=0&byline=0&portrait=0&color=ffffff`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Spring Week Conversion Webinar Recording"
          />
        </div>
      </div>

      {/* Video meta */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl px-5 py-4 shadow-sm space-y-1">
        <p className="text-[14px] font-semibold text-[#111]">
          How Students Converted Their Spring Weeks Into Return Offers
        </p>
        <p className="text-[12px] text-[#888] font-light">
          Full recording from {SW_EVENT_DATE} - 6 speakers, 3 hours
        </p>
      </div>

      {/* Session chapters */}
      <div className="space-y-3">
        <h2 className="text-[13px] font-semibold text-[#555] uppercase tracking-wider">Jump to session</h2>
        {SPRING_WEEK_NIGHTS.map((session) => (
          <div key={session.id} className="bg-white border border-[#E8E8E8] rounded-xl px-5 py-3.5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: session.accent }}
              />
              <div>
                <p className="text-[13px] font-semibold text-[#111]">{session.label}</p>
                <p className="text-[11px] text-[#AAA]">{session.date}</p>
              </div>
            </div>
            <span className="text-[11px] text-[#888]">{session.theme}</span>
          </div>
        ))}
      </div>

      {/* Coaching upsell */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-indigo-900">Watched it? Now apply it.</p>
            <p className="text-[12px] text-indigo-700 font-light mt-0.5">
              Book a 1-on-1 with a speaker from your firm to go deeper on what you learned.
            </p>
          </div>
        </div>
        <a
          href="/spring-week-portal/coaching"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Book coaching
        </a>
      </div>
    </div>
  );
}

// --------------- Main component ---------------

export default function SpringWeekRecording() {
  const access = useSwAccess();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-8 md:px-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${RECORDING_LIVE ? "bg-red-500 animate-pulse" : "bg-[#DDD]"}`} />
            <p className={`text-xs font-bold uppercase tracking-wider ${RECORDING_LIVE ? "text-red-600" : "text-[#AAA]"}`}>
              {RECORDING_LIVE ? "Recording available" : "Coming April 12"}
            </p>
          </div>
          <h1 className="text-2xl font-bold text-[#111]">
            {RECORDING_LIVE ? "Webinar Recording" : "Live Webinar - April 12"}
          </h1>
          <p className="text-[14px] text-[#666] mt-1.5 font-light">
            {RECORDING_LIVE
              ? "Full recording from the live session. Watch at your own pace."
              : `${SW_EVENT_DATE} - ${SW_EVENT_TIME} on ${SW_EVENT_PLATFORM}`
            }
          </p>

          {/* Tier badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E0E0E0] rounded-full px-3 py-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${access.hasWebinar ? "bg-emerald-500" : "bg-[#CCC]"}`} />
            <span className="text-[11px] text-[#666] font-medium capitalize">
              {access.hasWebinar ? `${access.tier} tier - recording included` : "No webinar access"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-8">
        {RECORDING_LIVE ? (
          <PostEventView hasAccess={access.hasWebinar} />
        ) : (
          <PreEventView hasAccess={access.hasWebinar} />
        )}
      </div>
    </div>
  );
}
