import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { trendingCategories } from "@/data/dashboardData";

export function TrendingCategories() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="text-[11px] font-medium">Trending:</span>
      </div>
      {trendingCategories.map((cat) => (
        <Link
          key={cat.name}
          to={`/dashboard/browse?category=${encodeURIComponent(cat.category)}`}
          className="shrink-0 flex items-center gap-1 px-3 py-1 bg-surface-subtle rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: cat.color }}
          />
          {cat.name}
          <span style={{ color: cat.color }}>↑{cat.trend}%</span>
        </Link>
      ))}
    </div>
  );
}
