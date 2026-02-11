import { useState } from "react";
import { Star, Users } from "lucide-react";
import {
  freeEvents,
  eventCategories,
  type FreeEvent,
} from "@/data/eventsData";

function formatStartsIn(dateStr: string): string {
  const eventDate = new Date(dateStr);
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  if (diffMs < 0) return "Past";
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `${diffDays} days`;
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function EventCard({ event }: { event: FreeEvent }) {
  const [registered, setRegistered] = useState(false);
  const startsIn = formatStartsIn(event.date);

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md group">
      {/* Image / gradient area */}
      <div
        className={`relative h-44 bg-gradient-to-br ${event.gradient} px-5 py-4 flex flex-col justify-between`}
      >
        {/* Top badges */}
        <div className="flex items-start justify-between">
          <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Starts in {startsIn}
          </span>
        </div>

        {/* Title on image */}
        <div>
          <h3 className="text-white text-base font-semibold leading-snug mb-1.5 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-white/60 text-xs">
            {formatEventDate(event.date)} · {event.time} · {event.duration}
          </p>
        </div>

        {/* Registered count badge */}
        <div className="absolute bottom-4 right-5 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
          <Users className="w-3 h-3" />
          {event.registered} registered
        </div>
      </div>

      {/* Bottom strip */}
      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground flex-shrink-0">
            {event.host.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate">
              {event.host.name}
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-foreground text-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {event.host.rating} ({event.host.reviews})
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setRegistered(!registered)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
            registered
              ? "bg-muted text-foreground border border-border"
              : "bg-foreground text-background hover:opacity-90"
          }`}
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>
    </div>
  );
}

export default function DashboardEvents() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents =
    selectedCategory === "All"
      ? freeEvents
      : freeEvents.filter((e) => e.category === selectedCategory);

  const popularCategories = [
    "Investment Banking",
    "Consulting",
    "Law",
    "UCAT",
    "Oxbridge",
    "Software Engineering",
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-0 md:px-10 lg:px-12">
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground mb-1">
          Free Events
        </h1>
        <p className="text-sm text-muted-foreground">
          Live sessions, workshops, and AMAs — all free
        </p>
      </div>

      {/* Popular quick-filter links */}
      <div className="px-6 md:px-10 lg:px-12 mt-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium mr-1">
            Popular:
          </span>
          {popularCategories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "All" : cat)
              }
              className={`text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Category dropdown filter */}
      <div className="px-6 md:px-10 lg:px-12 mt-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-background border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground cursor-pointer font-sans appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          {eventCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Event Grid */}
      <div className="px-6 md:px-10 lg:px-12 mt-6 pb-10">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-base font-medium mb-2">No events found</p>
            <p className="text-[13px]">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
