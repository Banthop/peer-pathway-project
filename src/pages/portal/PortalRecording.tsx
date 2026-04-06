import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useBuyerAuth, PROGRESS_KEY } from "@/contexts/BuyerAuthContext";
import { Play, Clock, CheckCircle2, ChevronRight, RotateCcw, Target, Zap, ArrowRight, Check, Lock, ShieldCheck, BookOpen } from "lucide-react";

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

/* ─── Paywall overlay shown to non-buyers ─── */
function PaywallOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 py-6">
      {/* Social proof bar */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5 text-center">
        <p className="text-[11px] text-white/90 font-semibold tracking-wide">
          150+ students have watched this. LSE, Warwick, UCL, Bristol, Imperial.
        </p>
      </div>

      {/* Main paywall card */}
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/50">
        <h2 className="text-[17px] font-bold text-[#111] text-center mb-1 leading-tight">
          This recording is locked
        </h2>
        <p className="text-[12px] text-[#666] text-center mb-5 leading-relaxed">
          Unlock the full system Uthman used to land internships at lean firms nobody else applies to.
        </p>

        {/* Curiosity-gap chapter preview */}
        <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl p-3 mb-5">
          <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest mb-2">What you unlock</p>
          <ul className="space-y-1.5">
            {[
              "The 5-part template that gets replies",
              "Step-by-step Mail Merge setup and the 9:03 AM rule",
              "What to do when someone actually replies",
              "How to find verified emails for MDs and CEOs",
              "The follow-up sequence that doubles your hit rate",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                <span className="text-[11px] text-[#444] leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Loss aversion + anchor */}
        <p className="text-[11px] text-[#555] text-center leading-relaxed mb-1">
          Every week you wait is a week of internship applications going to someone else.
        </p>
        <p className="text-[11px] text-[#888] text-center leading-relaxed mb-4">
          Professional career coaching costs £150-300/hr. This entire system is <span className="font-bold text-[#111]">£10</span>.
        </p>

        {/* CTAs */}
        <a
          href={STRIPE_RECORDING_URL}
          className="block w-full bg-[#111] text-white text-center text-[13px] font-bold py-3 rounded-xl mb-2 hover:bg-[#333] transition-colors shadow-md"
        >
          Unlock the Full Recording - £10
        </a>
        <a
          href={STRIPE_BUNDLE_URL}
          className="block w-full border border-[#CCC] text-[#111] text-center text-[13px] font-semibold py-3 rounded-xl hover:bg-[#F5F5F5] transition-colors"
        >
          Get Recording + Cold Email Guide - £29
        </a>

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

function LockedChapterRow({ chapter, idx, isFirst }: LockedChapterRowProps) {
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
}

export default function PortalRecording() {
  const { buyerStatus } = useBuyerAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<WatchProgress>(loadProgress);
  const [resumed, setResumed] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

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
      setCurrentTime(data.seconds);
      const ch = [...CHAPTERS].reverse().find((c) => data.seconds >= c.startSeconds);
      if (ch) setActiveChapter(ch.id);
    });
    player.on("play", () => setIsPlaying(true));
    player.on("pause", () => setIsPlaying(false));
    player.ready().then(() => setPlayerReady(true));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTime > 0) {
        const ch = [...CHAPTERS].reverse().find((c) => currentTime >= c.startSeconds);
        const newWatched = [...new Set([...progress.chaptersWatched, ...(ch ? [ch.id] : [])])];
        if (newWatched.length !== progress.chaptersWatched.length || Math.abs(currentTime - progress.lastTime) > 5) {
          const updated = { lastTime: currentTime, chaptersWatched: newWatched, lastUpdated: new Date().toISOString() };
          setProgress(updated);
          saveProgress(updated);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTime, progress.chaptersWatched, progress.lastTime]);

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
    <div className="w-full bg-[#FAFAFA] min-h-screen">
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

          {/* Free resource banner - only for free accounts */}
          {buyerStatus && buyerStatus.tier === "free" && (
            <Link
              to="/portal/resources"
              className="hidden md:inline-flex items-center gap-2.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-xl px-5 py-3.5 transition-colors group flex-shrink-0 self-center shadow-sm hover:shadow-md"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-[13px] font-semibold text-blue-700">Access Your Free Cold-Email Webinar Slides Here</span>
              <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Gamified Progress Bar */}
          <div className="w-full xl:w-[380px] bg-[#F8F8F8] border border-[#E8E8E8] rounded-2xl p-4 flex-shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-semibold text-[#111] uppercase tracking-wide flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Progress
              </p>
              <p className="text-[14px] font-bold text-emerald-600">{progressPercent}%</p>
            </div>
            
            {/* Segmented progress form */}
            <div className="flex gap-1 h-3.5 mb-2">
              {CHAPTERS.map((ch, idx) => {
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
            <div className="bg-[#0A0A0A] p-2 md:p-4 rounded-2xl shadow-2xl ring-1 ring-black/5">
              <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-inner" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  ref={iframeRef}
                  id="vimeo-player"
                  src={vimeoUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                />

                {/* Non-buyer gate: gradient blur overlay + paywall card */}
                {!isLoading && !isBuyer && (
                  <div className="absolute inset-0 z-10 pointer-events-auto">
                    {/* Gradient blur: clear at top, fully blurred by ~30% down */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        maskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
                        background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 30%)",
                      }}
                    />
                    <PaywallOverlay />
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
            </div>

            {/* ════════ CONTEXTUAL UPSELL - recording-only buyers see bundle CTA, bundle buyers see coaching CTA ════════ */}
            {isBuyer && !isBundle && (
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden mt-6 shadow-sm">
                <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1F1F1F] px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Next Step</p>
                      <h3 className="text-[16px] font-bold text-white leading-tight">
                        The recording shows you what to do. The guide shows you exactly how.
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-[#666] font-light leading-relaxed mb-5">
                    The Cold Email Guide includes the exact email templates, the 200-firm outreach list, the
                    tracking spreadsheet, and the follow-up sequences. Everything you need to go from watching
                    to actually sending.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                      "50-page written guide",
                      "Copy-paste email templates",
                      "200 UK firms to cold email",
                      "Outreach tracker spreadsheet",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" strokeWidth={3} />
                        <span className="text-[12px] text-[#444]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl p-3 mb-4 text-center">
                    <p className="text-[11px] text-[#888] font-light">
                      You've already paid £10 for the recording. Upgrade to the full bundle for just{" "}
                      <strong className="text-[#111]">£19 more</strong> - the guide alone is worth £29.
                    </p>
                  </div>
                  <a
                    href="https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e"
                    className="block w-full bg-[#111] text-white text-center text-[13px] font-bold py-3.5 rounded-xl hover:bg-[#333] transition-colors shadow-md"
                  >
                    Upgrade to Recording + Guide - £29
                  </a>
                </div>
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
                  <a
                    href={STRIPE_RECORDING_URL}
                    className="block w-full bg-[#111] text-white text-center text-[12px] font-bold py-2.5 rounded-xl mb-2 hover:bg-[#333] transition-colors"
                  >
                    Unlock All Modules - £10
                  </a>
                  <a
                    href={STRIPE_BUNDLE_URL}
                    className="block w-full border border-[#CCC] text-[#333] text-center text-[11px] font-semibold py-2 rounded-xl hover:bg-[#F0F0F0] transition-colors"
                  >
                    Bundle + Guide - £29
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
