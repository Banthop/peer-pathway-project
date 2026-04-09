import { useState } from "react";
import {
  Play,
  Clock,
  ChevronRight,
  Upload,
  Film,
  Plus,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  TEMPLATE RECORDING PAGE
 *
 *  Empty video placeholder + empty chapter slots.
 *  To use for a real webinar:
 *  1. Replace WEBINAR_TITLE and WEBINAR_SUBTITLE
 *  2. Add your Vimeo/YouTube embed URL to VIDEO_EMBED_URL
 *  3. Fill in the CHAPTERS array with real timestamps
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIGURE THESE ───
const WEBINAR_TITLE = "Webinar Title";
const WEBINAR_SUBTITLE = "Brief description of what this webinar covers";
const VIDEO_EMBED_URL = ""; // e.g. "https://player.vimeo.com/video/123456789?..."

interface Chapter {
  id: string;
  title: string;
  description: string;
  startSeconds: number;
  duration: string;
}

// Empty chapter slots - fill these in for each webinar
const CHAPTERS: Chapter[] = [
  {
    id: "chapter-1",
    title: "Chapter 1",
    description: "Add description here",
    startSeconds: 0,
    duration: "- min",
  },
  {
    id: "chapter-2",
    title: "Chapter 2",
    description: "Add description here",
    startSeconds: 0,
    duration: "- min",
  },
  {
    id: "chapter-3",
    title: "Chapter 3",
    description: "Add description here",
    startSeconds: 0,
    duration: "- min",
  },
  {
    id: "chapter-4",
    title: "Chapter 4",
    description: "Add description here",
    startSeconds: 0,
    duration: "- min",
  },
  {
    id: "chapter-5",
    title: "Chapter 5",
    description: "Add description here",
    startSeconds: 0,
    duration: "- min",
  },
];

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TemplateRecording() {
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0]?.id || "");

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
              {WEBINAR_TITLE}
            </h1>
            <p className="text-sm text-[#888] mt-1 font-light">
              {WEBINAR_SUBTITLE}
            </p>
          </div>

          {/* Progress badge */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#F0F0F0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="#111"
                  strokeWidth="3" strokeDasharray="0 100"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#111]">
                0%
              </span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#111]">0/{CHAPTERS.length} chapters</p>
              <p className="text-[10px] text-[#999]">watched</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video + Chapters layout */}
      <div className="px-6 md:px-10 lg:px-12 mt-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video player area */}
          <div className="flex-1 min-w-0">
            {VIDEO_EMBED_URL ? (
              <div className="relative w-full bg-[#111] rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={VIDEO_EMBED_URL}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Empty video placeholder */
              <div
                className="relative w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden shadow-lg flex items-center justify-center"
                style={{ paddingBottom: "56.25%" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                  }} />

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                      <Upload className="w-9 h-9 text-white/30" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-[15px] font-medium">No video uploaded yet</p>
                      <p className="text-white/30 text-[12px] mt-1 font-light">
                        Add a Vimeo or YouTube embed URL to display the recording
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                        <Film className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[11px] text-white/40 font-medium">Vimeo</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                        <Play className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[11px] text-white/40 font-medium">YouTube</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Captions note */}
            <div className="mt-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-4 py-3">
              <p className="text-[11px] text-[#999] font-light">
                <strong className="text-[#666] font-medium">Tip:</strong> Captions are available.
                Click the CC button on the video player to enable them.
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

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => setActiveChapter(chapter.id)}
                      className={`w-full text-left px-4 py-3 transition-all hover:bg-[#F8F8F8] group ${
                        isActive ? "bg-[#F5F5F5]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold transition-all ${
                            isActive
                              ? "bg-[#111] text-white"
                              : "bg-[#F5F5F5] text-[#999]"
                          }`}
                        >
                          {idx + 1}
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

                {/* Add chapter slot */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 text-[#CCC]">
                    <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#E8E8E8] flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[12px] font-medium text-[#CCC]">Add more chapters...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
