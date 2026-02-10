import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { monthlySessionData, spendingSummary } from "@/data/dashboardData";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs shadow-lg">
        <p className="font-semibold">{data.sessions} sessions</p>
        <p className="text-white/60">£{data.spent} spent</p>
      </div>
    );
  }
  return null;
}

export function SessionChart() {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5">
      <h3 className="text-[13px] font-semibold text-foreground mb-4">
        Sessions per month
      </h3>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySessionData} barCategoryGap="25%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#999" }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
              {monthlySessionData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === monthlySessionData.length - 1
                      ? "#3B82F6"
                      : "#E0E7FF"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-3 pt-3 border-t border-border">
        <div>
          <p className="text-[11px] text-muted-foreground">Total spent</p>
          <p className="text-sm font-semibold text-foreground">
            £{spendingSummary.total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">This month</p>
          <p className="text-sm font-semibold text-foreground">
            £{spendingSummary.thisMonth}
          </p>
        </div>
      </div>
    </div>
  );
}
