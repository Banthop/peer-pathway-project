export default function GeneralRecording() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-6 md:px-10 lg:px-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Recording</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111]">
            Webinar Recording
          </h1>
          <p className="text-sm text-[#666] mt-1.5 font-light">
            Watch the full masterclass recording below.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-12 py-8">
        {/* Video placeholder */}
        <div className="bg-[#0A0A0A] p-2 md:p-4 rounded-2xl shadow-2xl ring-1 ring-black/5 max-w-4xl">
          <div
            className="relative w-full bg-[#111] rounded-xl overflow-hidden flex items-center justify-center"
            style={{ paddingBottom: "56.25%" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-mono tracking-wider uppercase opacity-60">Insert Vimeo Recording Here</p>
            </div>
          </div>
        </div>

        {/* Placeholder note */}
        <div className="mt-6 max-w-4xl bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-light">
            <span className="font-semibold">Template:</span> Replace the placeholder above with your Vimeo embed URL. Update the <code className="bg-amber-100 px-1 rounded text-xs font-mono">VIMEO_VIDEO_ID</code> constant in <code className="bg-amber-100 px-1 rounded text-xs font-mono">PortalRecording.tsx</code> to match your video.
          </p>
        </div>
      </div>
    </div>
  );
}
