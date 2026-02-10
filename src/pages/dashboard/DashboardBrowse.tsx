import { useState } from "react";
import { Search } from "lucide-react";
import { allCoaches, categories, categoryColorMap } from "@/data/dashboardData";
import { CoachCard } from "@/components/dashboard/CoachCard";

export default function DashboardBrowse() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);

  const filteredCoaches = allCoaches
    .filter((c) => {
      const matchCategory =
        selectedCategory === "All" || c.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.credential.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.rate - b.rate;
      if (sortBy === "price-high") return b.rate - a.rate;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.sessions - a.sessions;
    });

  return (
    <div className="px-6 py-8 md:px-10 lg:px-12 max-w-[1100px]">
      {/* Hero Banner */}
      <div className="gradient-hero rounded-2xl px-8 py-10 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-serif font-normal tracking-tight text-white mb-1.5">
            Find your coach
          </h1>
          <p className="text-sm text-white/50">
            {filteredCoaches.length} coaches ready to help you succeed
          </p>
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/[0.03]" />
      </div>

      {/* Search + Sort — sticky */}
      <div className="sticky top-0 z-20 bg-muted/30 backdrop-blur-sm -mx-6 px-6 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12 py-3 mb-5">
        <div className="flex gap-3 items-center max-w-[1100px]">
          <div className="flex-1 flex items-center gap-2.5 bg-background border border-border rounded-lg px-4 py-2.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coaches, skills, or companies..."
              className="border-none outline-none text-[13px] flex-1 bg-transparent font-sans text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground cursor-pointer font-sans appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest rated</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {categories.map((cat) => {
          const catColor = cat !== "All" ? categoryColorMap[cat] : undefined;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-all duration-200 font-sans ${
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              {catColor && selectedCategory !== cat && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ backgroundColor: catColor }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Coach Grid */}
      {filteredCoaches.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-base font-medium mb-2">No coaches found</p>
          <p className="text-[13px]">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              hovered={hoveredCoach === coach.id}
              onHover={setHoveredCoach}
              large
            />
          ))}
        </div>
      )}
    </div>
  );
}
