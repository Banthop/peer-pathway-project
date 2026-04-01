import { Calendar, Clock, Users } from "lucide-react";

const SESSIONS = [
  { name: "30-min Strategy Call", duration: "30 min", price: "£TBD", desc: "A focused session to get your questions answered." },
  { name: "60-min Deep Dive", duration: "60 min", price: "£TBD", desc: "Full walkthrough of your personal situation and action plan." },
  { name: "Group Session", duration: "90 min", price: "£TBD", desc: "Small-group workshop format.", isGroup: true },
];

export default function BookMohammad() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <div className="bg-gradient-to-br from-[#FAFAF7] to-[#F0EDE8] px-6 pt-10 pb-10 md:px-10 lg:px-12 border-b border-[#E8E8E8]">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#444] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ring-4 ring-white shadow-lg">
            M
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Available for sessions
            </p>
            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-[#111]">
              Book a Session with Mohammad
            </h1>
            <p className="text-sm text-[#666] mt-1.5 font-light max-w-lg">
              Choose a session type below. This is a template — update the name, bio, and booking links when running a real webinar.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-12 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-2xl">
          <p className="text-sm text-amber-800 font-light">
            <span className="font-semibold">Placeholder:</span> Connect real cal.com booking links when this template is used for a live webinar.
          </p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          {SESSIONS.map((session) => (
            <div key={session.name} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-[#111]">{session.name}</h3>
                  <p className="text-[13px] text-[#666] mt-1 font-light leading-relaxed">{session.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
                      <Clock className="w-3.5 h-3.5" /> {session.duration}
                    </span>
                    {session.isGroup && (
                      <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
                        <Users className="w-3.5 h-3.5" /> Group format
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-[#111]">{session.price}</p>
                </div>
              </div>
              <button
                onClick={() => alert("Booking link placeholder — connect a real cal.com URL here.")}
                className="mt-4 w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Select Time Slot (Placeholder)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
