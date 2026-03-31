import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Trophy,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  Video,
  Download,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
 *  CONFIG - Update these as needed
 * ═══════════════════════════════════════════════════════════════ */

const SUPABASE_URL = "https://cidnbhphbmwvbozdxqhe.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZG5iaHBoYm13dmJvemR4cWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODEwOTEsImV4cCI6MjA4NjM1NzA5MX0.KsyJZ3qD-Fw1Dl9Hx1wxMFYyINarKiqPRHXnHICR5nE";

// ── Cal.com Integration ──
// Set Uthman's Cal.com username below to enable Cal.com scheduling.
// When set, the manual date/time picker is replaced with Cal.com's embed.
// Leave empty to keep using the manual picker.
const CAL_USERNAME = ""; // e.g. "uthman" or "uthman-ahmed-xyz"

// Custom meeting link — Uthman will send the final link via confirmation email
// This is a default placeholder; the actual link is confirmed per booking
const DEFAULT_MEETING_LINK = "";

// Available days (0=Sun, 1=Mon ... 6=Sat)
const AVAILABLE_DAYS = [1, 2, 3, 4, 5]; // Mon-Fri

// Available time slots
const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00",
];

/* ─── Session types ─── */

interface SessionType {
  id: string;
  name: string;
  duration: string;
  price: string;
  pricePennies: number;
  priceLabel: string;
  description: string;
  includes: string[];
  popular?: boolean;
  isGroup?: boolean;
  maxParticipants?: number;
  isBundle?: boolean;
  bundleSessions?: number;
}

const SESSION_TYPES: SessionType[] = [
  {
    id: "strategy-call",
    name: "Strategy Call",
    duration: "30 min",
    price: "£35",
    pricePennies: 3500,
    priceLabel: "per session",
    description:
      "Quick, focused session to review your cold email strategy, get template feedback, or ask Uthman anything about landing internships.",
    includes: [
      "Personalised email review",
      "Strategy feedback",
      "Action plan for next steps",
    ],
  },
  {
    id: "deep-dive",
    name: "Deep Dive Session",
    duration: "60 min",
    price: "£59",
    pricePennies: 5900,
    priceLabel: "per session",
    description:
      "Full session covering your complete outreach strategy. Walk away with custom templates, a lead list, and a personalised action plan.",
    includes: [
      "Full outreach audit",
      "Custom email templates written for you",
      "Lead sourcing walkthrough",
      "Personalised follow-up sequences",
      "7-day email support after the session",
    ],
    popular: true,
  },
  {
    id: "group-workshop",
    name: "Group Cold Email Workshop",
    duration: "90 min",
    price: "£20",
    pricePennies: 2000,
    priceLabel: "per person",
    description:
      "Small-group session (max 8 people) where Uthman walks through the full cold email system live. Great if you want a more affordable option and learn from others' questions.",
    includes: [
      "Full system walkthrough",
      "Live template building",
      "Group Q&A",
      "Recording of the session",
    ],
    isGroup: true,
    maxParticipants: 8,
  },
];

/* ─── Package ─── */

const PACKAGE: SessionType = {
  id: "3-deep-dive-bundle",
  name: "3x Deep Dive Bundle",
  duration: "3 x 60 min",
  price: "£140",
  pricePennies: 14000,
  priceLabel: "save £37",
  description:
    "Three Deep Dive sessions spread over 3-4 weeks. Full outreach audit, custom templates, lead sourcing, and ongoing accountability as you build your pipeline. Uthman reviews your progress between sessions.",
  includes: [
    "3 full Deep Dive sessions",
    "Custom templates each session",
    "Progress reviews between sessions",
    "Access to Uthman's private network for referrals",
  ],
  isBundle: true,
  bundleSessions: 3,
};

/* ─── FAQ ─── */

const FAQ = [
  {
    q: "How do sessions work?",
    a: "After paying, you'll pick a date and time. Uthman will send you a Zoom link before your session. Sessions are 1-on-1 Zoom calls (or group for workshops) where Uthman works through your specific situation.",
  },
  {
    q: "What should I prepare?",
    a: "Bring your current CV, any cold emails you've drafted, and a list of target firms or industries. The more Uthman knows, the more useful the session.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes, just email uthman6696@gmail.com at least 24 hours before your session and he'll find a new time.",
  },
  {
    q: "What about the group workshop?",
    a: "Group workshops run with 4-8 people. Dates are posted when enough interest builds. Book your spot and you'll be notified when the next one is confirmed.",
  },
  {
    q: "Refund policy?",
    a: "Not satisfied? Email us within 24 hours of your session and we'll arrange a follow-up or full refund. No questions asked.",
  },
];

/* ─── Stats ─── */

const STATS = [
  { icon: Trophy, value: "20+", label: "Offers landed" },
  { icon: Briefcase, value: "PE, IB, VC", label: "Industries" },
  { icon: MessageSquare, value: "200+", label: "Emails sent" },
];

/* ─── Date helpers ─── */

function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  let d = new Date(today);
  d.setDate(d.getDate() + 1); // start from tomorrow
  while (days.length < count) {
    if (AVAILABLE_DAYS.includes(d.getDay())) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/* ─── Calendar .ics helper ─── */

function buildIcsFile(session: SessionType, date: Date, time: string, studentName: string): string {
  // Build start/end datetime in UTC
  const [hours, mins] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hours, mins, 0, 0);

  // Parse duration (e.g. "30 min", "60 min", "90 min", "3 x 60 min")
  const durationMatch = session.duration.match(/(\d+)\s*min/);
  const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const toIcs = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EarlyEdge//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${toIcs(start)}`,
    `DTEND:${toIcs(end)}`,
    `SUMMARY:${session.name} — EarlyEdge`,
    `DESCRIPTION:Session with Uthman. ${session.description}\n\nBooked by: ${studentName}`,
    `ORGANIZER;CN=Uthman:mailto:uthman6696@gmail.com`,
    "STATUS:CONFIRMED",
    `UID:earlyedge-${Date.now()}@yourearlyedge.co.uk`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcsFile(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ─── Send booking confirmation via server-side edge function (broadcast pattern) ─── */

async function sendBookingConfirmation(data: {
  studentEmail: string;
  studentName: string;
  sessionName: string;
  sessionId: string;
  duration: string;
  dateStr: string;
  time: string;
  price: string;
}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-booking-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`,
        "apikey": ANON_KEY,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log("Booking confirmation email result:", result);
    return result;
  } catch (err) {
    console.error("Failed to send booking confirmation emails:", err);
    return { status: "error", errors: [String(err)] };
  }
}

/* ═══════════════════════════════════════════════════════════════
 *  COMPONENT
 * ═══════════════════════════════════════════════════════════════ */

type BookingStep = "select" | "schedule" | "confirm" | "done";

export default function BookUthman() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Booking flow state
  const [step, setStep] = useState<BookingStep>("select");
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Handle Stripe Success Callback
  useEffect(() => {
    const isSuccess = searchParams.get("success") === "true";
    if (isSuccess && user) {
      const pendingBookingStr = localStorage.getItem("earlyedge_pending_booking");
      if (pendingBookingStr) {
        setBooking(true);
        (async () => {
          try {
            const data = JSON.parse(pendingBookingStr);
            const selectedSessionDummy = SESSION_TYPES.find((s) => s.id === data.sessionId) || PACKAGE;

            // Mark visually that we're finalizing
            setSelectedSession(selectedSessionDummy);
            setStep("schedule");

            // Save to Supabase
            if (supabase) {
              await (supabase as any).from("portal_bookings").insert({
                student_email: data.studentEmail,
                student_name: data.studentName,
                session_type: data.sessionId,
                session_date: data.date,
                session_time: data.time,
                price_pennies: data.pricePennies,
                notes: data.notes || null,
                meeting_link: null, // Zoom will be sent separately
              });
            }

            // Send confirmation emails via server-side broadcast
            await sendBookingConfirmation({
              studentEmail: data.studentEmail,
              studentName: data.studentName,
              sessionName: data.sessionName,
              sessionId: data.sessionId,
              duration: selectedSessionDummy.duration,
              dateStr: data.dateStr,
              time: data.time,
              price: selectedSessionDummy.price,
            });

            // Clean up
            localStorage.removeItem("earlyedge_pending_booking");
            // Remove success param from URL so refresh doesn't double-book
            setSearchParams({});

            // Make Date object for confirm screen
            const dateParts = data.date.split("-");
            if (dateParts.length === 3) {
              const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
              setSelectedDate(d);
            }
            setSelectedTime(data.time);

            setBooked(true);
            setStep("done");
          } catch (err) {
            console.error("Error finalizing Stripe booking:", err);
          } finally {
            setBooking(false);
          }
        })();
      }
    }
  }, [searchParams, user, setSearchParams]);

  const availableDates = useMemo(() => getNextDays(21), []);
  const visibleDates = availableDates.slice(weekOffset * 7, weekOffset * 7 + 7);

  const handleSelectSession = (session: SessionType) => {
    setSelectedSession(session);
    setStep("schedule");
  };

  const handleBook = async () => {
    console.log("handleBook called:", { selectedSession: !!selectedSession, selectedDate: !!selectedDate, selectedTime, user: !!user });
    if (!selectedSession || !selectedDate || !selectedTime || !user) {
      console.error("handleBook aborted — missing:", { selectedSession: !selectedSession, selectedDate: !selectedDate, selectedTime: !selectedTime, user: !user });
      return;
    }
    setBooking(true);

    const studentName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
    const dateStr = formatDate(selectedDate);
    const dateISO = formatDateISO(selectedDate);

    // Save booking info to localStorage for retrieval after Stripe redirect
    const bookingData = {
      sessionId: selectedSession.id,
      sessionName: selectedSession.name,
      date: dateISO,
      dateStr,
      time: selectedTime,
      notes: notes || "",
      studentName,
      studentEmail: user.email,
      pricePennies: selectedSession.pricePennies,
    };
    localStorage.setItem("earlyedge_pending_booking", JSON.stringify(bookingData));

    // Request Stripe Checkout via direct fetch to Edge Function
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-booking-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANON_KEY}`,
          "apikey": ANON_KEY,
        },
        body: JSON.stringify({
          sessionName: selectedSession.name,
          pricePennies: selectedSession.pricePennies,
          studentEmail: user.email,
          studentName,
          sessionId: selectedSession.id,
        }),
      });

      const result = await res.json();
      console.log("Stripe checkout response:", result);

      if (result?.url) {
        window.location.href = result.url;
        return;
      } else {
        console.error("No checkout URL:", result);
        alert("Something went wrong creating your checkout. Please try again.");
      }
    } catch (err) {
      console.error("Failed to generate Stripe checkout session:", err);
      alert("Connection error. Please try again.");
    }

    setBooking(false);
  };

  const resetBooking = () => {
    setStep("select");
    setSelectedSession(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes("");
    setBooked(false);
  };

  /* ─── Booking done screen ─── */
  if (step === "done" && booked && selectedSession && selectedDate && selectedTime) {
    const handleDownloadCalendar = () => {
      const icsContent = buildIcsFile(
        selectedSession,
        selectedDate,
        selectedTime,
        user?.user_metadata?.name || user?.email?.split("@")[0] || "Student"
      );
      downloadIcsFile(icsContent, `earlyedge-session-${selectedSession.id}.ics`);
    };

    return (
      <div className="w-full px-6 md:px-10 lg:px-12 py-10">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#111]">You're booked</h1>
            <p className="text-sm text-[#888] mt-2 font-light">
              Check your email for the confirmation details. Uthman will send you a meeting link before your session.
            </p>
          </div>

          <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 text-left space-y-4">
            <div>
              <p className="text-[11px] text-[#999] font-medium uppercase tracking-wider">Session</p>
              <p className="text-[15px] font-semibold text-[#111] mt-1">{selectedSession.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-medium uppercase tracking-wider">Date & Time</p>
              <p className="text-[15px] font-semibold text-[#111] mt-1">{formatDate(selectedDate)} at {selectedTime}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#999] font-medium uppercase tracking-wider">Zoom</p>
              <p className="text-[13px] text-[#666] mt-1 font-light">
                Uthman will send you a Zoom link before the session
              </p>
            </div>
          </div>

          {/* Add to Calendar */}
          <button
            onClick={handleDownloadCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E8E8E8] rounded-xl text-sm font-medium text-[#333] hover:bg-[#F5F5F5] transition-colors"
          >
            <Download className="w-4 h-4" />
            Add to Calendar
          </button>

          <button
            onClick={resetBooking}
            className="block mx-auto text-sm text-[#888] hover:text-[#111] transition-colors"
          >
            Book another session
          </button>
        </div>
      </div>
    );
  }

  /* ─── Schedule step ─── */
  if (step === "schedule" && selectedSession) {
    // ── Cal.com embed mode ──
    if (CAL_USERNAME) {
      // Map session type to Cal.com event slug
      const calEventSlug = selectedSession.id; // assumes Cal.com event types match session IDs
      const calUrl = `https://cal.com/${CAL_USERNAME}/${calEventSlug}?embed=true&theme=light`;

      return (
        <div className="w-full">
          <div className="px-6 pt-8 pb-2 md:px-10 lg:px-12">
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1 text-[13px] text-[#888] hover:text-[#111] mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to sessions
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#111]">{selectedSession.name}</h1>
                <p className="text-[12px] text-[#888]">{selectedSession.duration} &middot; {selectedSession.price}</p>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 lg:px-12 pb-10 mt-4">
            <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden" style={{ minHeight: 600 }}>
              <iframe
                src={calUrl}
                title="Book a session with Uthman"
                className="w-full border-0"
                style={{ height: 650, minHeight: 600 }}
                allow="payment"
              />
            </div>
            <p className="text-[11px] text-[#BBB] mt-3 text-center">
              Powered by Cal.com &middot; Uthman's availability syncs automatically
            </p>
          </div>
        </div>
      );
    }

    // ── Manual picker mode (fallback) ──
    return (
      <div className="w-full">
        <div className="px-6 pt-8 pb-2 md:px-10 lg:px-12">
          <button
            onClick={() => setStep("select")}
            className="flex items-center gap-1 text-[13px] text-[#888] hover:text-[#111] mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to sessions
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#111]">{selectedSession.name}</h1>
              <p className="text-[12px] text-[#888]">{selectedSession.duration} &middot; {selectedSession.price}</p>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-12 pb-10 mt-4 space-y-6">
          {/* Date picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#111]">Pick a date</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                  disabled={weekOffset === 0}
                  className="p-1.5 rounded-lg hover:bg-[#F5F5F5] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#666]" />
                </button>
                <button
                  onClick={() => setWeekOffset(Math.min(2, weekOffset + 1))}
                  disabled={weekOffset >= 2}
                  className="p-1.5 rounded-lg hover:bg-[#F5F5F5] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-[#666]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {visibleDates.map((date) => {
                const isSelected = selectedDate && formatDateISO(date) === formatDateISO(selectedDate);
                return (
                  <button
                    key={formatDateISO(date)}
                    onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                    className={`flex flex-col items-center py-3 px-1 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-[#111] text-white shadow-md"
                        : "bg-white border border-[#E8E8E8] hover:border-[#111] hover:shadow-sm"
                    }`}
                  >
                    <span className={`text-[10px] font-medium uppercase ${isSelected ? "text-white/60" : "text-[#999]"}`}>
                      {date.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                    <span className={`text-lg font-semibold mt-0.5 ${isSelected ? "text-white" : "text-[#111]"}`}>
                      {date.getDate()}
                    </span>
                    <span className={`text-[10px] ${isSelected ? "text-white/50" : "text-[#BBB]"}`}>
                      {date.toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="text-[13px] font-semibold text-[#111] mb-3">Pick a time</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "bg-[#111] text-white shadow-md"
                        : "bg-white border border-[#E8E8E8] text-[#333] hover:border-[#111]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedTime && (
            <div>
              <p className="text-[13px] font-semibold text-[#111] mb-2">Anything Uthman should know? (optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. I'm targeting PE firms, already sent 50 cold emails with no replies..."
                className="w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-[13px] text-[#333] placeholder:text-[#CCC] focus:outline-none focus:border-[#111] resize-none transition-colors"
                rows={3}
              />
            </div>
          )}

          {/* Confirm button */}
          {selectedDate && selectedTime && (
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">{selectedSession.name}</p>
                  <p className="text-[12px] text-[#888]">
                    {formatDate(selectedDate)} at {selectedTime}
                  </p>
                </div>
                <p className="text-xl font-semibold text-[#111]">{selectedSession.price}</p>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-[#888]">
                <Video className="w-3.5 h-3.5" />
                <span>Zoom link sent by Uthman before your session</span>
              </div>

              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full py-3.5 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#222] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {booking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Pay & Book
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Main view: session types ─── */
  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 md:px-10 lg:px-12">
        <p className="text-xs text-[#999] font-medium uppercase tracking-wider mb-1">
          1-on-1 Coaching
        </p>
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-[#111]">
          Book Uthman
        </h1>
        <p className="text-sm text-[#888] mt-1 font-light">
          Get personalised help from the person who built the system
        </p>
      </div>

      <div className="px-6 md:px-10 lg:px-12 pb-10">
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Left: Profile */}
          <div className="lg:w-[340px] flex-shrink-0 space-y-5">
            {/* Profile card */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#111] to-[#444] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  UA
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#111]">Uthman</h2>
                  <p className="text-[13px] text-[#666]">
                    20 Internship Offers via Cold Email
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-[#111] text-[#111]" />
                    <span className="text-[12px] text-[#888]">Webinar Host &middot; Warwick</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F0F0F0] pt-4">
                <p className="text-[13px] text-[#555] leading-relaxed font-light">
                  Uthman landed 20 internship offers across PE, IB, and VC using
                  nothing but cold email. He built the exact system taught in
                  the webinar and cold email guide, and has helped over 100
                  students replicate his approach.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-[#FAFAFA] rounded-lg p-3 text-center">
                    <stat.icon className="w-4 h-4 text-[#888] mx-auto mb-1.5" />
                    <p className="text-sm font-semibold text-[#111]">{stat.value}</p>
                    <p className="text-[10px] text-[#999] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
              <p className="text-[11px] text-[#999] font-medium uppercase tracking-wider mb-3">
                From Students
              </p>
              <div className="space-y-3">
                {[
                  {
                    text: "Genuinely the most practical webinar I've attended. Uthman gives actual templates you can use straight away.",
                    name: "Priya M.",
                    uni: "LSE",
                  },
                  {
                    text: "Had a call with Uthman and sent my first cold emails the same day. Got 3 offers within a week.",
                    name: "Jake L.",
                    uni: "Warwick",
                  },
                  {
                    text: "The group workshop was brilliant. Learned so much from other people's questions too.",
                    name: "Amina R.",
                    uni: "UCL",
                  },
                ].map((review) => (
                  <div key={review.name} className="bg-[#FAFAFA] rounded-lg p-3">
                    <p className="text-[12px] text-[#555] font-light italic leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="text-[11px] text-[#999] mt-2 font-medium">
                      {review.name}, {review.uni}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Session types + FAQ */}
          <div className="flex-1 space-y-6">
            {/* Session types */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#111]">Choose a session</h3>

              {SESSION_TYPES.map((session) => (
                <div
                  key={session.id}
                  className={`relative bg-white border rounded-xl p-6 transition-all hover:shadow-md ${
                    session.popular ? "border-[#111] shadow-sm" : "border-[#E8E8E8]"
                  }`}
                >
                  {session.popular && (
                    <span className="absolute -top-2.5 left-5 bg-[#111] text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#111] flex items-center gap-2">
                        {session.name}
                        {session.isGroup && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Group
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Clock className="w-3.5 h-3.5" />
                          {session.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-[#888]">
                          <Video className="w-3.5 h-3.5" />
                          Zoom
                        </span>
                        {session.maxParticipants && (
                          <span className="flex items-center gap-1 text-[12px] text-[#888]">
                            <Users className="w-3.5 h-3.5" />
                            Max {session.maxParticipants}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-semibold text-[#111]">{session.price}</p>
                      <p className="text-[11px] text-[#999]">{session.priceLabel}</p>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#666] font-light leading-relaxed mb-4">
                    {session.description}
                  </p>

                  <div className="space-y-2 mb-5">
                    {session.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="text-[12px] text-[#555]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectSession(session)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      session.popular
                        ? "bg-[#111] text-white hover:bg-[#222]"
                        : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB]"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Book {session.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Package deal */}
            <div className="relative bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-xl p-6 text-white">
              <div className="absolute -top-2.5 left-5">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Best value
                </span>
              </div>

              <div className="flex items-start justify-between mb-3 pt-2">
                <div>
                  <h4 className="text-[15px] font-semibold">{PACKAGE.name}</h4>
                  <p className="text-[12px] text-white/50 mt-0.5">{PACKAGE.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{PACKAGE.price}</p>
                  <p className="text-[11px] text-amber-400 font-medium">{PACKAGE.priceLabel}</p>
                </div>
              </div>

              <p className="text-[13px] text-white/70 font-light leading-relaxed mb-5">
                {PACKAGE.description}
              </p>

              <button
                onClick={() => handleSelectSession(PACKAGE)}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-[#111] hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Bundle
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8E8E8]">
                <h3 className="text-[13px] font-semibold text-[#111]">
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {FAQ.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-[#111]">{faq.q}</p>
                      <ChevronDown
                        className={`w-4 h-4 text-[#999] transition-transform flex-shrink-0 ml-2 ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFaq === idx && (
                      <p className="text-[12px] text-[#666] font-light leading-relaxed mt-2 pr-6">
                        {faq.a}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
