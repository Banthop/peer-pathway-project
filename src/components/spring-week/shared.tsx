import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { TARGET_FIRMS } from "@/data/springWeekData";

/* ---- Countdown to Night 1 ---- */
export function useCountdown(targetISO: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return timeLeft;
}

/* ---- Animated counter ---- */
export function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const dur = 1800;
    const start = performance.now();
    (function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    })(start);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

/* ---- Firm ticker marquee ---- */
export function FirmTicker() {
  const firms = TARGET_FIRMS;
  return (
    <div className="relative w-full overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      <div className="flex animate-marquee-left gap-3 whitespace-nowrap">
        {[...firms, ...firms].map((firm, i) => (
          <span
            key={`${firm}-${i}`}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-full px-3.5 py-1.5 shrink-0"
          >
            <Building2 className="h-3 w-3 text-slate-500" />
            {firm}
          </span>
        ))}
      </div>
    </div>
  );
}
