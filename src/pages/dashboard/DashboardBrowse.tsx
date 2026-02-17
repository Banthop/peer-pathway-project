import { useState, useEffect } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { categories, categoryColorMap } from "@/data/dashboardData";
import { getAllBrowseCoaches } from "@/data/coachStore";
import { CoachCard } from "@/components/dashboard/CoachCard";

export default function DashboardBrowse() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const [allCoaches, setAllCoaches] = useState(getAllBrowseCoaches());

  useEffect(() => {
    setAllCoaches(getAllBrowseCoaches());
  }, []);

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
        ) ||
        c.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.rate - b.rate;
      if (sortBy === "price-high") return b.rate - a.rate;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.sessions - a.sessions;
    });

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="px-6 pt-8 pb-0 md:px-10 lg:px-12">
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground mb-1">
          Welcome to EarlyEdge
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's get you started with your first coaching session
        </p>
      </div>

      {/* Seasonal Banner */}
      <div className="px-6 md:px-10 lg:px-12 mt-5">
        <div className="flex items-center justify-between bg-background border border-border rounded-xl px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-background" />
            </div>
            <p className="text-sm text-foreground">
              <span className="font-medium">Spring Week season is open</span>
              <span className="text-muted-foreground">. applications close in 6 weeks</span>
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline whitespace-nowrap">
            View coaches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Browse Coaches Title */}
      <div className="px-6 md:px-10 lg:px-12 mt-8 mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Browse Coaches
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Find the right coach for your goals
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6 md:px-10 lg:px-12 mb-4">
        <div className="flex gap-3 items-center">
          <div className="flex-1 max-w-md flex items-center gap-2.5 bg-background border border-border rounded-lg px-4 py-2.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coaches, skills, or firms..."
              className="border-none outline-none text-[13px] flex-1 bg-transparent font-sans text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:block bg-background border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground cursor-pointer font-sans appearance-none pr-8"
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
      <div className="px-6 md:px-10 lg:px-12 mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const catColor = cat !== "All" ? categoryColorMap[cat] : undefined;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-all duration-200 font-sans ${selectedCategory === cat
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
      </div>

      {/* Coach Grid. full width */}
      <div className="px-6 md:px-10 lg:px-12 pb-10">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    </div>
  );
}
