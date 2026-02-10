import { Link } from "react-router-dom";
import { deadlines } from "@/data/dashboardData";

export function DeadlineTimeline() {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5">
      <h3 className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Upcoming Deadlines
      </h3>
      <div className="space-y-3.5">
        {deadlines.map((d) => (
          <Link
            key={d.id}
            to={`/dashboard/browse?category=${encodeURIComponent(d.category)}`}
            className="flex items-center gap-3 group"
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${d.urgency === "closing" ? "animate-pulse-dot" : ""}`}
              style={{ backgroundColor: d.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground group-hover:underline">
                {d.title}
              </p>
              <p className="text-[11px] text-muted-foreground">{d.timeLeft}</p>
            </div>
            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
