import { Calendar, Clock, Users, PiggyBank } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { quickStats } from "@/data/dashboardData";
import type { QuickStat } from "@/data/dashboardData";

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  users: Users,
  piggybank: PiggyBank,
};

function StatCard({ stat }: { stat: QuickStat }) {
  const animatedValue = useCountUp(stat.value);
  const Icon = iconMap[stat.icon];

  return (
    <div className={`${stat.bgTint} rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${stat.color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: stat.color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        {stat.icon === "piggybank" && "£"}
        {animatedValue}
        {stat.suffix}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
      <p className="text-[10px] mt-1.5" style={{ color: stat.color }}>
        {stat.trend}
      </p>
    </div>
  );
}

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickStats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
