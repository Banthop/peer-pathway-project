import { useState, useRef, useEffect, useCallback } from "react";
import { useBuyerAuth, PROGRESS_KEY } from "@/contexts/BuyerAuthContext";
import { Play, Clock, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";

/* ─── Chapter data ─────────────────────────────────────────────
   Update these timestamps once you have the final recording.
   startSeconds = where the chapter begins in the video.
   ──────────────────────────────────────────────────────────── */

interface Chapter {
  id: string;
  title: string;
  description: string;
  startSeconds: number;
  duration: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    title: "Welcome & Introduction",
    description: "Meet Uthman and what we'll cover today",
    startSeconds: 0,
    duration: "5 min",
  },
  {
    id: "why-cold-email",
    title: "Why Cold Email Works",
    description: "The hidden job market and why smaller firms respond",
    startSeconds: 300,
    duration: "10 min",
  },
  {
    id: "finding-firms",
    title: "Finding the Right Firms",
    description: "Using Apollo.io to find MDs and CEOs at lean firms",
    startSeconds: 900,
    duration: "12 min",
  },
  {
    id: "export-leads",
    title: "Exporting Leads",
    description: "Getting verified emails into a clean spreadsheet",
    startSeconds: 1620,
    duration: "8 min",
  },
  {
    id: "first-lines",
    title: "Personalised First Lines",
    description: "The 2-minute method for every single email",
    startSeconds: 2100,
    duration: "10 min",
  },
  {
    id: "email-template",
    title: "The Cold Email Template",
    description: "The 5-part structure that gets replies",
    startSeconds: 2700,
    duration: "15 min",
  },
  {
    id: "mail-merge",
    title: "Sending via Mail Merge",
    description: "Step-by-step setup and the 9:03 AM rule",
    startSeconds: 3600,
    duration: "12 min",
  },
  {
    id: "responses",
    title: "Handling Responses",
    description: "What to do when someone actually replies",
    startSeconds: 4320,
    duration: "10 min",
  },
  {
    id: "follow-ups",
    title: "Follow-Ups & Scaling",
    description: "The fortune is in the follow-up",
    startSeconds: 4920,
    duration: "10 min",
  },
  {
    id: "qa",
    title: "Live Q&A",
    description: "Audience questions answered",
    startSeconds: 5520,
    duration: "20 min",
  },
];

/*
 * ═══════════════════════════════════════════════════════════════
 *  VIDEO PLATFORM: Using Vimeo with iframe embed
 *
 *  WHY VIMEO:
 *  - Domain-restricted embeds (only your site can show the video)
 *  - Auto-captions available on paid plans (Starter $12/mo)
 *  - No YouTube branding/recommendations
 *  - Player API for seeking + progress tracking
 *  - Upload SRT/VTT subtitle files for manual captions
 *
 *  ALTERNATIVE: Bunny.net Stream ($1/mo per 1000 mins stored)
 *  - Cheaper, more control, auto-captions, no branding
 *  - Requires separate account setup
 *
 *  TO SET UP:
 *  1. Upload to Vimeo
 *  2. Go to video settings > Embed > restrict domain to yourearlyedge.co.uk
 *  3. Enable captions (Settings > Distribution > Subtitles)
 *  4. Replace VIMEO_VIDEO_ID below with the video ID
 * ═══════════════════════════════════════════════════════════════
 */
const VIMEO_VIDEO_ID = "1178276210";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Watch progress helpers ─── */

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

  // Load Vimeo Player SDK
  useEffect(() => {
    if (document.getElementById("vimeo-player-sdk")) return;
    const script = document.createElement("script");
    script.id = "vimeo-player-sdk";
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = () => {
      const iframe = iframeRef.current;
      if (!iframe || !(window as any).Vimeo) return;
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
    document.head.appendChild(script);

    return () => {
      if (playerRef.current) {
        try { playerRef.current.off("timeupdate"); } catch {}
        try { playerRef.current.off("play"); } catch {}
        try { playerRef.current.off("pause"); } catch {}
      }
    };
  }, []);

  // Also init player if SDK already loaded (e.g. hot reload)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || playerRef.current) return;
    if ((window as any).Vimeo) {
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
    }
  }, []);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTime > 0) {
        const ch = [...CHAPTERS].reverse().find((c) => currentTime >= c.startSeconds);
        const newWatched = [...new Set([...progress.chaptersWatched, ...(ch ? [ch.id] : [])])];
        const updated = { lastTime: currentTime, chaptersWatched: newWatched, lastUpdated: new Date().toISOString() };
        setProgress(updated);
        saveProgress(updated);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTime, progress.chaptersWatched]);

  // Seek using SDK (instant)
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

  // Resume from last position
  const handleResume = useCallback(() => {
    seekTo(progress.lastTime);
    setResumed(true);
  }, [progress.lastTime, seekTo]);

  const vimeoUrl = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?api=1&player_id=vimeo-player&title=0&byline=0&portrait=0&texttrack=en`;
  const completedCount = progress.chaptersWatched.length;
  const progressPercent = Math.round((completedCount / CHAPTERS.length) * 100);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 md:px-10 lg:px-12">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-[#999] font-medium uppercase tracking-wider mb-1">
              Webinar Recording
            </p>
            <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-[#111]">
              Cold Email Masterclass
            </h1>
            <p className="text-sm text-[#888] mt-1 font-light">
              How Uthman landed 20 internship offers using cold email
            </p>
          </div>

          {/* Progress badge */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#F0F0F0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="#111"
                  strokeWidth="3" strokeDasharray={`${progressPercent} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#111]">
                {progressPercent}%
              </span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#111]">{completedCount}/{CHAPTERS.length} chapters</p>
              <p className="text-[10px] text-[#999]">watched</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume banner */}
      {progress.lastTime > 30 && !resumed && (
        <div className="mx-6 md:mx-10 lg:mx-12 mt-3">
          <button
            onClick={handleResume}
            className="w-full bg-[#111] text-white rounded-xl px-5 py-3.5 flex items-center justify-between hover:bg-[#222] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium">Resume where you left off</p>
                <p className="text-xs text-white/50">
                  {formatTime(progress.lastTime)} into "{CHAPTERS.find(c => progress.lastTime >= c.startSeconds && [...CHAPTERS].reverse().find(r => progress.lastTime >= r.startSeconds)?.id === c.id)?.title || "the recording"}"
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>
        </div>
      )}

      {/* Video + Chapters layout */}
      <div className="px-6 md:px-10 lg:px-12 mt-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video player */}
          <div className="flex-1 min-w-0">
            <div className="relative w-full bg-[#111] rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: "56.25%" }}>
              <iframe
                ref={iframeRef}
                id="vimeo-player"
                src={vimeoUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
              />
            </div>

            {/* Now playing */}
            {isPlaying && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#888]">
                <div className="flex gap-0.5">
                  <span className="w-1 h-3 bg-[#111] rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-[#111] rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1 h-3 bg-[#111] rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                </div>
                Now playing: {CHAPTERS.find((c) => c.id === activeChapter)?.title}
              </div>
            )}

            {/* Captions note */}
            <div className="mt-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3">
              <p className="text-[11px] text-[#999] font-light">
                <strong className="text-[#666] font-medium">Tip:</strong> Captions are available. Click the CC button on the video player to enable them.
              </p>
            </div>
          </div>

          {/* Chapter list */}
          <div className="lg:w-[320px] flex-shrink-0">
            <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden sticky top-4">
              <div className="px-4 py-3 border-b border-[#E8E8E8]">
                <h2 className="text-[13px] font-semibold text-[#111]">Chapters</h2>
                <p className="text-[11px] text-[#999] mt-0.5">Click to jump to any section</p>
              </div>

              <div className="max-h-[520px] overflow-y-auto divide-y divide-[#F5F5F5]">
                {CHAPTERS.map((chapter, idx) => {
                  const isActive = activeChapter === chapter.id;
                  const isWatched = progress.chaptersWatched.includes(chapter.id);

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => seekTo(chapter.startSeconds)}
                      className={`w-full text-left px-4 py-3 transition-all hover:bg-[#F8F8F8] group ${
                        isActive ? "bg-[#F5F5F5]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold transition-all ${
                            isActive
                              ? "bg-[#111] text-white"
                              : isWatched
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-[#F5F5F5] text-[#999]"
                          }`}
                        >
                          {isWatched && !isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-[13px] font-medium truncate ${isActive ? "text-[#111]" : "text-[#444]"}`}>
                              {chapter.title}
                            </p>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#111] flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#999] truncate mt-0.5">
                            {chapter.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[#BBB] font-mono">
                              {formatTime(chapter.startSeconds)}
                            </span>
                            <span className="text-[10px] text-[#DDD]">&middot;</span>
                            <span className="text-[10px] text-[#BBB]">{chapter.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
