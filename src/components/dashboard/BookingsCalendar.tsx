import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { upcomingSessions, pastBookings } from "@/data/dashboardData";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Parse the display date strings into comparable day keys (YYYY-MM-DD). */
function parseDateKey(dateStr: string): string | null {
  // Handle "Tomorrow" → use tomorrow's date
  if (dateStr === "Tomorrow") {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Handle "Sun, Feb 8" style (current year assumed)
  const shortMatch = dateStr.match(/^[A-Z][a-z]+,?\s+([A-Z][a-z]+)\s+(\d+)$/);
  if (shortMatch) {
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const m = monthMap[shortMatch[1]];
    if (m !== undefined) {
      const year = new Date().getFullYear();
      return `${year}-${String(m + 1).padStart(2, "0")}-${String(Number(shortMatch[2])).padStart(2, "0")}`;
    }
  }

  // Handle "Jan 30, 2026" style
  const longMatch = dateStr.match(/^([A-Z][a-z]+)\s+(\d+),?\s+(\d{4})$/);
  if (longMatch) {
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const m = monthMap[longMatch[1]];
    if (m !== undefined) {
      return `${longMatch[3]}-${String(m + 1).padStart(2, "0")}-${String(Number(longMatch[2])).padStart(2, "0")}`;
    }
  }

  // Handle "Dec 18, 2025" style
  const decMatch = dateStr.match(/^([A-Z][a-z]+)\s+(\d+),\s+(\d{4})$/);
  if (decMatch) {
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const m = monthMap[decMatch[1]];
    if (m !== undefined) {
      return `${decMatch[3]}-${String(m + 1).padStart(2, "0")}-${String(Number(decMatch[2])).padStart(2, "0")}`;
    }
  }

  return null;
}

interface BookingEntry {
  id: number;
  coach: string;
  type: string;
  date: string;
  time?: string;
  duration?: string;
  dateKey: string;
  kind: "upcoming" | "past";
}

export function BookingsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // Feb 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map of dateKey → bookings
  const bookingMap = useMemo(() => {
    const map: Record<string, BookingEntry[]> = {};

    for (const s of upcomingSessions) {
      const key = parseDateKey(s.date);
      if (key) {
        const entry: BookingEntry = {
          id: s.id,
          coach: s.coach,
          type: s.type,
          date: s.date,
          time: s.time,
          duration: s.duration,
          dateKey: key,
          kind: "upcoming",
        };
        (map[key] ??= []).push(entry);
      }
    }

    for (const s of pastBookings) {
      const key = parseDateKey(s.date);
      if (key) {
        const entry: BookingEntry = {
          id: s.id + 1000,
          coach: s.coach,
          type: s.type,
          date: s.date,
          dateKey: key,
          kind: "past",
        };
        (map[key] ??= []).push(entry);
      }
    }

    return map;
  }, []);

  // Build days grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const days: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const selectedBookings = selectedDate ? bookingMap[selectedDate] || [] : [];

  return (
    <div className="bg-background border border-border rounded-xl p-5">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-9" />;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasBooking = !!bookingMap[dateKey];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={`h-9 w-full flex flex-col items-center justify-center rounded-md text-xs font-medium transition-all duration-150 relative ${
                isSelected
                  ? "bg-foreground text-background"
                  : isToday
                    ? "bg-muted text-foreground font-bold"
                    : "text-foreground hover:bg-muted/50"
              }`}
            >
              {day}
              {hasBooking && (
                <div
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    isSelected ? "bg-background" : "bg-foreground"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-border">
          {selectedBookings.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              No bookings on this day
            </p>
          ) : (
            <div className="space-y-2.5">
              {selectedBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-1.5 h-8 rounded-full ${
                      b.kind === "upcoming" ? "bg-foreground" : "bg-border"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {b.type}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      with {b.coach}
                      {b.time && ` · ${b.time}`}
                      {b.duration && ` · ${b.duration}`}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      b.kind === "upcoming"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.kind === "upcoming" ? "Upcoming" : "Past"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
