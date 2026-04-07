import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { useBuyerAuth, PROGRESS_KEY } from "@/contexts/BuyerAuthContext";
import { Play, ChevronRight, Target, Zap, ArrowRight, Check, Lock, ShieldCheck, BookOpen, Presentation, Info, X as XIcon } from "lucide-react";

const STRIPE_RECORDING_URL = "https://buy.stripe.com/4gM7sK8iUcK55qGbl22400d";
const STRIPE_BUNDLE_URL = "https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e";

/* ─── Chapter data ─── */
interface Chapter {
  id: string;
  title: string;
  description: string;
  startSeconds: number;
  duration: string;
}

const CHAPTERS: Chapter[] = [
  { id: "intro", title: "Welcome & Introduction", description: "Meet Uthman and what we'll cover today", startSeconds: 0, duration: "5 min" },
  { id: "why-cold-email", title: "Why Cold Email Works", description: "The hidden job market and why smaller firms respond", startSeconds: 300, duration: "10 min" },
  { id: "finding-firms", title: "Finding the Right Firms", description: "Using Apollo.io to find MDs and CEOs at lean firms", startSeconds: 900, duration: "12 min" },
  { id: "export-leads", title: "Exporting Leads", description: "Getting verified emails into a clean spreadsheet", startSeconds: 1620, duration: "8 min" },
  { id: "first-lines", title: "Personalised First Lines", description: "The 2-minute method for every single email", startSeconds: 2100, duration: "10 min" },
  { id: "email-template", title: "The Cold Email Template", description: "The 5-part structure that gets replies", startSeconds: 2700, duration: "15 min" },
  { id: "mail-merge", title: "Sending via Mail Merge", description: "Step-by-step setup and the 9:03 AM rule", startSeconds: 3600, duration: "12 min" },
  { id: "responses", title: "Handling Responses", description: "What to do when someone actually replies", startSeconds: 4320, duration: "10 min" },
  { id: "follow-ups", title: "Follow-Ups & Scaling", description: "The fortune is in the follow-up", startSeconds: 4920, duration: "10 min" },
  { id: "qa", title: "Live Q&A", description: "Audience questions answered", startSeconds: 5520, duration: "20 min" },
];

const VIMEO_VIDEO_ID = "1178276210";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface WatchProgress {
  lastTime: number;
  chaptersWatched: string[];
  lastUpdated: string;
}

function loadProgress(): WatchProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { lastTime: 0, chaptersWatched: [], lastUpdated: new Date().toISOString() };
}

function saveProgress(progress: WatchProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...progress, lastUpdated: new Date().toISOString() }));
}

/* ─── Recording includes items (shared between paywall dropdown and upgrade page) ─── */
const RECORDING_INCLUDES = [
  "Watch the full cold email process done live - not just the theory, see it executed start to finish in real time",
  "Live Apollo demo - watch us find real decision-maker emails at target firms on screen",
  "Mail merge demo - see real cold emails get sent in real time (including the 9:03 AM send rule and why it works)",
  "Live Q&A with real student questions - hear the edge-case questions other students asked",
  "The commentary you can't get from slides - the reasoning behind every strategy, what to tweak",
  "Follow-up sequences broken down - exactly what to send on Day 3, Day 7, and Day 14",
  "Watch anytime on any device - lifetime access, rewatch as many times as you want",
];

/* ─── Paywall overlay shown to non-buyers ─── */
function PaywallOverlay({ showIncludes, setShowIncludes }: { showIncludes: boolean; setShowIncludes: (v: boolean) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start z-20 px-4 pt-4 pb-6 overflow-y-auto">
      {/* Social proof bar */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5 text-center">
        <p className="text-[11px] text-white/90 font-semibold tracking-wide">
          150+ students have watched this. LSE, Warwick, UCL, Bristol, Imperial.
        </p>
      </div>

      {/* Main paywall card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/50">
        <h2 className="text-xl md:text-2xl font-bold text-[#111] text-center mb-1 leading-tight">
          This recording is locked
        </h2>
        <p className="text-sm text-[#666] text-center mb-5 leading-relaxed">
          Unlock the full system Uthman used to land internships at firms that nobody else applies to.
        </p>

        {/* Curiosity-gap chapter preview */}
        <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-4 md:p-5 mb-5">
          <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest mb-2">What you unlock</p>
          <ul className="space-y-2.5">
            {[
              "The 5-part template that gets replies",
              "Step-by-step Mail Merge setup and the 9:03 AM rule",
              "What to do when someone actually replies",
              "How to find verified emails for MDs and CEOs",
              "The follow-up sequence that doubles your hit rate",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                <span className="text-[13px] text-[#444] leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>



        {/* CTAs */}
        <Link
          to="/portal/upgrade"
          className="block w-full bg-[#111] text-white text-center text-base font-bold py-4 rounded-xl mb-2 hover:bg-[#333] transition-colors shadow-md"
        >
          Upgrade Access
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowIncludes(true);
          }}
          className="w-full border-2 border-[#DDD] text-[#111] text-center text-base font-semibold py-4 rounded-xl hover:bg-[#F5F5F5] hover:border-[#BBB] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          See What's Included
          <Info className="w-5 h-5 text-[#999]" />
        </button>

        {/* Guarantee */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <p className="text-[10px] text-[#999]">
            Not useful? Email us within 24 hours for a full refund.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Locked chapter row for non-buyers ─── */
interface LockedChapterRowProps {
  chapter: Chapter;
  idx: number;
  isFirst: boolean;
}

const LockedChapterRow = memo(function LockedChapterRow({ chapter, idx, isFirst }: LockedChapterRowProps) {
  return (
    <div
      className={`w-full text-left p-3 mb-1 rounded-xl ${
        isFirst ? "bg-emerald-50 ring-1 ring-emerald-200" : "opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          {isFirst ? (
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-[#D0D0D0] flex items-center justify-center bg-[#F0F0F0]">
              <Lock className="w-3 h-3 text-[#AAA]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-bold truncate ${isFirst ? "text-emerald-900" : "text-[#555]"}`}>
            {chapter.title}
          </p>
          <p className={`text-[11px] mt-0.5 leading-snug ${isFirst ? "text-emerald-700/80" : "text-[#888]"}`}>
            {chapter.description}
          </p>
          {isFirst && (
            <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full">
              <span className="text-[9px] font-bold uppercase tracking-wider">FREE PREVIEW</span>
            </div>
          )}
        </div>
        {!isFirst && (
          <div className="text-[10px] text-[#BBB] font-mono font-medium pt-1 flex-shrink-0">
            {chapter.duration}
          </div>
        )}
      </div>
    </div>
  );
});

/* ─── "See What's Included" modal (positioned over video container) ─── */
function RecordingIncludesModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-[50] flex items-center justify-center bg-black/70 rounded-xl px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90%] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-[#111] uppercase tracking-wide">
              What's Inside the Recording
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#F5F5F5] rounded-lg transition-colors cursor-pointer">
            <XIcon className="w-5 h-5 text-[#999]" />
          </button>
        </div>

        <ul className="space-y-3">
          {RECORDING_INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="h-5 w-5 mt-0.5 shrink-0 text-blue-500" />
              <span className="text-[15px] text-[#333] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-5 border-t border-[#E8E8E8]">
          <Link
            to="/portal/upgrade"
            className="block w-full bg-[#111] text-white text-center text-[15px] font-bold py-4 rounded-xl hover:bg-[#333] transition-colors shadow-md"
          >
            Upgrade Access
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PortalRecording() {
  const { buyerStatus } = useBuyerAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRef = useRef(0);
  const activeChapterRef = useRef(CHAPTERS[0].id);
  const lastRenderTickRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<WatchProgress>(loadProgress);
  const [resumed, setResumed] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [showIncludes, setShowIncludes] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  // Load Vimeo SDK
  useEffect(() => {
    if (document.getElementById("vimeo-player-sdk")) {
      initPlayer();
      return;
    }
    const script = document.createElement("script");
    script.id = "vimeo-player-sdk";
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = initPlayer;
    document.head.appendChild(script);

    return () => {
      if (playerRef.current) {
        try { playerRef.current.off("timeupdate"); } catch {}
        try { playerRef.current.off("play"); } catch {}
        try { playerRef.current.off("pause"); } catch {}
      }
    };
  }, []);

  const initPlayer = () => {
    const iframe = iframeRef.current;
    if (!iframe || !(window as any).Vimeo || playerRef.current) return;
    const player = new (window as any).Vimeo.Player(iframe);
    playerRef.current = player;

    player.on("timeupdate", (data: any) => {
      currentTimeRef.current = data.seconds;
      const ch = [...CHAPTERS].reverse().find((c) => data.seconds >= c.startSeconds);
      if (ch) activeChapterRef.current = ch.id;

      // Only update state (trigger re-render) at most once per second
      const now = Date.now();
      if (now - lastRenderTickRef.current > 1000) {
        lastRenderTickRef.current = now;
        setCurrentTime(data.seconds);
        if (ch) setActiveChapter(ch.id);
      }
    });
    player.on("play", () => setIsPlaying(true));
    player.on("pause", () => setIsPlaying(false));
    player.ready().then(() => setPlayerReady(true));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const time = currentTimeRef.current;
      if (time > 0) {
        const ch = [...CHAPTERS].reverse().find((c) => time >= c.startSeconds);
        const newWatched = [...new Set([...progress.chaptersWatched, ...(ch ? [ch.id] : [])])];
        if (newWatched.length !== progress.chaptersWatched.length || Math.abs(time - progress.lastTime) > 5) {
          const updated = { lastTime: time, chaptersWatched: newWatched, lastUpdated: new Date().toISOString() };
          setProgress(updated);
          saveProgress(updated);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [progress.chaptersWatched, progress.lastTime]);

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (player) {
      player.setCurrentTime(seconds).then(() => player.play());
    }
    const ch = [...CHAPTERS].reverse().find((c) => seconds >= c.startSeconds);
    if (ch) setActiveChapter(ch.id);
    setCurrentTime(seconds);
    setIsPlaying(true);
  }, []);

  const handleResume = useCallback(() => {
    seekTo(progress.lastTime);
    setResumed(true);
  }, [progress.lastTime, seekTo]);

  const isBuyer = buyerStatus?.isBuyer ?? false;
  const isBundle = buyerStatus?.isBundle ?? false;
  // While buyerStatus is null (loading), treat as not-yet-known - show nothing extra
  const isLoading = buyerStatus === null;

  const vimeoUrl = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?api=1&player_id=vimeo-player&title=0&byline=0&portrait=0&texttrack=en&color=10b981`;
  const completedCount = progress.chaptersWatched.length;
  const progressPercent = Math.round((completedCount / CHAPTERS.length) * 100);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen" style={{ willChange: "transform" }}>
      {/* ════════ HEADER (Cold Email Masterclass) ════════ */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-6 md:px-10 lg:px-12 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                Status: In Training
              </p>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111]">
              Cold Email Masterclass
            </h1>
            <p className="text-sm text-[#666] mt-1.5 font-light">
              Master the Cold Email system. Watch the modules, then use the resources to execute.
            </p>
          </div>

          {/* Gamified Progress Bar - buyers only */}
          {isBuyer && (
            <div className="w-full xl:w-[380px] bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-4 flex-shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-[#111] uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  Progress
                </p>
                <p className="text-[14px] font-bold text-emerald-600">{progressPercent}%</p>
              </div>

              <div className="flex gap-1 h-3.5 mb-2">
                {CHAPTERS.map((ch) => {
                  const isWatched = progress.chaptersWatched.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      className={`flex-1 rounded-sm transition-all duration-300 ${isWatched ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-[#E0E0E0]"}`}
                    />
                  )
                })}
              </div>
              <p className="text-[11px] text-[#888] font-medium text-right">
                {completedCount} of {CHAPTERS.length} steps completed
              </p>
            </div>
          )}

          {/* Free slides banner - replaces progress bar for free users */}
          {!isBuyer && !isLoading && buyerStatus?.tier === "free" && (
            <Link
              to="/portal/resources"
              className="w-full xl:w-[420px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-6 py-5 transition-all shadow-lg hover:shadow-xl group flex-shrink-0 block"
            >
              <div className="flex items-center gap-4">
                <Presentation className="w-8 h-8 text-blue-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-lg md:text-xl font-bold tracking-tight block">
                    Access Your Free Cold-Email Webinar Slides Here
                  </span>
                  <p className="text-sm text-blue-200 font-light mt-1">
                    The frameworks, templates, and sequences from the 90-min live webinar - yours for free.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-200 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Resume banner - buyers only */}
      {isBuyer && progress.lastTime > 30 && !resumed && (
        <div className="px-6 md:px-10 lg:px-12 mt-6">
          <button
            onClick={handleResume}
            className="w-full bg-gradient-to-r from-[#111] to-[#222] text-white rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-lg transition-all group border border-[#333]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-inner">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide">Resume Training Sequence</p>
                <p className="text-xs text-white/60 mt-0.5">
                  Jump back into "{CHAPTERS.find(c => progress.lastTime >= c.startSeconds && [...CHAPTERS].reverse().find(r => progress.lastTime >= r.startSeconds)?.id === c.id)?.title}"
                </p>
              </div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 group-hover:bg-white/20 transition-colors">
              <span className="text-[11px] font-semibold tracking-wider">RESUME AT {formatTime(progress.lastTime)}</span>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* ════════ VIDEO + MASTERY STEPS ════════ */}
      <div className="px-6 md:px-10 lg:px-12 mt-6 pb-12 overflow-x-hidden">
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Left: Video Player Center */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Cinematic Container */}
            <div ref={videoRef} className="relative bg-[#0A0A0A] p-2 md:p-4 rounded-2xl shadow-2xl ring-1 ring-black/5">
              <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-inner" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  ref={iframeRef}
                  id="vimeo-player"
                  src={vimeoUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                />

                {/* Non-buyer gate: gradient blur overlay + paywall card */}
                {!isLoading && !isBuyer && (
                  <div className="absolute inset-0 z-10 pointer-events-auto">
                    {/* Gradient blur: clear at top, fully blurred by ~30% down */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0.98) 100%)",
                      }}
                    />
                    <PaywallOverlay showIncludes={showIncludes} setShowIncludes={setShowIncludes} />
                  </div>
                )}
              </div>
              
              {isBuyer && (
                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      {isPlaying && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                      {CHAPTERS.find((c) => c.id === activeChapter)?.title || "Loading..."}
                    </h3>
                    <p className="text-[#888] text-sm mt-0.5">
                      {CHAPTERS.find((c) => c.id === activeChapter)?.description}
                    </p>
                  </div>
                </div>
              )}

              {/* "See What's Included" modal — positioned over the video container */}
              {showIncludes && (
                <RecordingIncludesModal onClose={() => setShowIncludes(false)} />
              )}
            </div>

            {/* ════════ CONTEXTUAL UPSELL - recording-only buyers see bundle CTA, bundle buyers see coaching CTA ════════ */}
            {isBuyer && !isBundle && (
              <div className="relative mt-6 rounded-2xl overflow-hidden shadow-lg border border-emerald-200/30" style={{ background: "linear-gradient(135deg, #0f1a12 0%, #122118 30%, #0d1f17 60%, #0a1a13 100%)" }}>
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-400/8 rounded-full blur-[60px] pointer-events-none" />

                {/* Header */}
                <div className="relative px-6 pt-6 pb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Next Step</span>
                    </div>
                    <div className="bg-amber-500/15 border border-amber-500/25 rounded-full px-2.5 py-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Save £10</span>
                    </div>
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-white leading-snug mb-1.5">
                    The recording shows you <span className="text-emerald-400">what</span> to do.
                    <br className="hidden sm:block" />{" "}
                    The guide shows you exactly <span className="text-emerald-400">how</span>.
                  </h3>
                  <p className="text-[13px] text-white/50 font-light leading-relaxed max-w-lg">
                    Go from watching to actually sending. The Cold Email Guide is the execution layer.
                  </p>
                </div>

                {/* Content */}
                <div className="relative px-6 py-5">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
                    {[
                      { text: "50-page written guide", icon: BookOpen },
                      { text: "Copy-paste email templates", icon: BookOpen },
                      { text: "200 UK firms to cold email", icon: Target },
                      { text: "Outreach tracker spreadsheet", icon: Target },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-[12px] text-white/80 font-medium leading-tight">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price anchor */}
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3.5 mb-4 text-center backdrop-blur-sm">
                    <p className="text-[12px] text-white/60 font-light">
                      You've already paid <span className="text-white/90 font-medium">£10</span> for the recording. Upgrade for just{" "}
                      <span className="text-emerald-400 font-bold text-[14px]">£19 more</span>{" "}
                      <span className="text-white/40">·</span>{" "}
                      <span className="text-white/40 line-through">£29</span>
                    </p>
                  </div>

                  {/* CTA button with shine animation */}
                  <Link
                    to="/portal/upgrade"
                    className="group relative block w-full text-center text-[14px] font-bold py-4 rounded-xl transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)" }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      Upgrade to Recording + Guide - £19
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    {/* Animated shine */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                        animation: "shine 2s ease-in-out infinite",
                      }}
                    />
                  </Link>

                  <p className="text-center mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/60" />
                    <span className="text-[10px] text-white/30 font-light">Full refund within 24 hours if not useful</span>
                  </p>
                </div>

                {/* CSS for shine animation */}
                <style>{`
                  @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
              </div>
            )}

            {/* ════════ BUNDLE BUYERS: coaching CTA ════════ */}
            {isBuyer && isBundle && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden group mt-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-10 transition-opacity" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-emerald-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      Need these templates applied to YOUR specific situation?
                    </h3>
                    <p className="text-[13px] text-emerald-800 mt-1.5 max-w-xl leading-relaxed font-light">
                      Watching the system is Step 1. Applying it flawlessly is Step 2. Get Uthman to personally write your templates, audit your lead list, and build your pipeline on a 1-on-1 Deep Dive.
                    </p>
                  </div>
                  <Link
                    to="/portal/book-uthman"
                    className="w-full md:w-auto flex-shrink-0 bg-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    Book 1-on-1 Coaching
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Right: Steps Panel */}
          <div className="xl:w-[380px] flex-shrink-0 w-full mt-6 xl:mt-0">
            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden sticky top-6 shadow-sm">
              <div className="bg-[#111] px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold text-white tracking-wide uppercase">
                    Steps
                  </h2>
                  <p className="text-[11px] text-[#AAA] mt-0.5 font-light">
                    {isBuyer ? "Finish modules to unlock your blueprint" : "Unlock to access all modules"}
                  </p>
                </div>
                {isBuyer ? (
                  <div className="bg-white/10 text-emerald-400 text-[11px] font-bold px-2 py-1.5 rounded-md shadow-inner">
                    {completedCount}/{CHAPTERS.length} Done
                  </div>
                ) : (
                  <div className="bg-white/10 text-[#AAA] text-[11px] font-bold px-2 py-1.5 rounded-md shadow-inner flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </div>
                )}
              </div>

              <div className="max-h-[600px] overflow-y-auto overflow-x-hidden bg-white p-2">
                {!isBuyer ? (
                  /* Non-buyer: show first chapter unlocked, rest locked */
                  CHAPTERS.map((chapter, idx) => (
                    <LockedChapterRow
                      key={chapter.id}
                      chapter={chapter}
                      idx={idx}
                      isFirst={idx === 0}
                    />
                  ))
                ) : (
                  /* Buyer: full interactive chapter list */
                  CHAPTERS.map((chapter, idx) => {
                    const isActive = activeChapter === chapter.id;
                    const isWatched = progress.chaptersWatched.includes(chapter.id);

                    return (
                      <button
                        key={chapter.id}
                        onClick={() => seekTo(chapter.startSeconds)}
                        className={`w-full text-left p-3 mb-1 rounded-xl transition-all ${
                          isActive
                            ? "bg-emerald-50 ring-1 ring-emerald-200 pointer-events-none"
                            : "hover:bg-[#F8F8F8] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Icon Indicator */}
                          <div className="mt-1 flex-shrink-0">
                            {isWatched ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </div>
                            ) : isActive ? (
                              <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white shadow-inner">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-[#E0E0E0] flex items-center justify-center bg-[#F5F5F5]">
                                <span className="text-[10px] font-bold text-[#999]">{idx + 1}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-bold truncate ${
                              isActive ? "text-emerald-900" : isWatched ? "text-[#111]" : "text-[#555]"
                            }`}>
                              {chapter.title}
                            </p>
                            <p className={`text-[11px] mt-0.5 leading-snug ${
                              isActive ? "text-emerald-700/80" : "text-[#888]"
                            }`}>
                              {chapter.description}
                            </p>
                            {isActive && (
                              <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-bold uppercase tracking-wider">IN PROGRESS</span>
                              </div>
                            )}
                          </div>

                          {!isActive && (
                            <div className="text-[10px] text-[#BBB] font-mono font-medium pt-1 flex-shrink-0">
                              {chapter.duration}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Non-buyer sticky CTA at panel bottom */}
              {!isBuyer && !isLoading && (
                <div className="border-t border-[#E8E8E8] p-4 bg-[#FAFAFA]">
                  <Link
                    to="/portal/upgrade"
                    className="block w-full bg-[#111] text-white text-center text-[12px] font-bold py-2.5 rounded-xl mb-2 hover:bg-[#333] transition-colors"
                  >
                    Upgrade Access
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowIncludes(true)}
                    className="block w-full border border-[#CCC] text-[#333] text-center text-[11px] font-semibold py-2 rounded-xl hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                  >
                    See What's Included
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}
