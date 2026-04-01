import { Play } from "lucide-react";

export default function GeneralRecording() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-[#111] relative isolate">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#222_0%,#111_100%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

        <div className="relative h-full flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-semibold tracking-wider uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              On-Demand Masterclass
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
              [Insert Masterclass Title Here]
            </h1>
            <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
              Welcome to the recording portal. [Add a small generic description here about the webinar content]
            </p>
          </div>

          {/* Video Container Placeholder */}
          <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-150">
            <div className="aspect-video bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group flex items-center justify-center">
              <p className="text-white/40 text-sm font-medium flex flex-col items-center gap-2">
                <Play className="w-10 h-10 text-white/20 mb-2" />
                Vimeo Video Embed Placeholder
                <span className="text-xs text-white/20 font-light">Insert iframe here</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
