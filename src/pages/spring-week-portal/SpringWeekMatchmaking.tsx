import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock, ArrowRight, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  MATCHMAKING_FIRMS,
  MATCHMAKING_DIVISIONS,
  STRIPE_SW_MATCH,
} from "@/data/springWeekData";

// --------------- Types ---------------

interface MatchRecord {
  id: string;
  firm: string;
  division: string;
  spring_week_date: string;
  want_to_know: string;
  status: "pending" | "paid" | "matched" | "scheduled" | "completed";
  created_at: string;
}

type StatusKey = MatchRecord["status"];

// --------------- Helpers ---------------

const STATUS_LABELS: Record<StatusKey, string> = {
  pending: "Pending payment",
  paid: "Paid - awaiting match",
  matched: "Match found",
  scheduled: "Zoom scheduled",
  completed: "Completed",
};

const STATUS_COLORS: Record<StatusKey, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  matched: "bg-indigo-100 text-indigo-800",
  scheduled: "bg-emerald-100 text-emerald-800",
  completed: "bg-[#F0F0F0] text-[#666]",
};

// --------------- How it works data ---------------

const STEPS = [
  {
    number: "1",
    title: "Tell us your firm and what you want to know",
    description:
      "Fill in the form below with your target firm, division, and the questions you most want answered.",
  },
  {
    number: "2",
    title: "We match you within 48 hours",
    description:
      "We pair you with a speaker who has done the spring week at your exact firm. You receive their contact details by email.",
  },
  {
    number: "3",
    title: "30-minute Zoom call with your match",
    description:
      "Get your questions answered by someone with real, first-hand experience at your firm. No generic advice.",
  },
];

// --------------- Main component ---------------

export default function SpringWeekMatchmaking() {
  const access = useSwAccess();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [selectedFirm, setSelectedFirm] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [springWeekDate, setSpringWeekDate] = useState<string>("");
  const [wantToKnow, setWantToKnow] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string>("");

  // Existing matches
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Collapsible how-it-works on mobile
  const [howItWorksOpen, setHowItWorksOpen] = useState(true);

  const firstName = user?.user_metadata?.name?.split(" ")[0] ?? "";
  const lastName = user?.user_metadata?.name?.split(" ").slice(1).join(" ") ?? "";
  const studentName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Student";

  // Fetch existing matches
  useEffect(() => {
    if (!user?.email) return;

    setMatchesLoading(true);
    supabase
      .from("spring_week_matches" as never)
      .select("*")
      .eq("student_email", user.email)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setMatches(data as MatchRecord[]);
        setMatchesLoading(false);
      });
  }, [user?.email, submitted]);

  const validate = (): boolean => {
    if (!selectedFirm) { setFormError("Please select a firm."); return false; }
    if (!selectedDivision) { setFormError("Please select a division."); return false; }
    if (!springWeekDate.trim()) { setFormError("Please enter your spring week dates."); return false; }
    if (!wantToKnow.trim()) { setFormError("Please tell us what you want to know."); return false; }
    setFormError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!user?.email) return;
    if (!validate()) return;

    setSubmitting(true);
    setFormError("");

    try {
      const { data, error } = await supabase
        .from("spring_week_matches" as never)
        .insert({
          student_email: user.email,
          student_name: `${firstName} ${lastName}`.trim() || studentName,
          firm: selectedFirm,
          division: selectedDivision,
          spring_week_date: springWeekDate,
          want_to_know: wantToKnow,
          is_free_match: access.hasFreeMatch,
          is_paid: access.hasFreeMatch,
          status: access.hasFreeMatch ? "paid" : "pending",
        } as never)
        .select()
        .single();

      if (error) throw error;

      if (access.hasFreeMatch) {
        // Mark free match used in CRM
        await supabase
          .from("crm_contacts")
          .update({ sw_free_match_used: true } as never)
          .eq("email", user.email);
        setSubmitted(true);
      } else {
        const matchId = (data as { id?: string } | null)?.id ?? "";
        const stripeUrl = `${STRIPE_SW_MATCH}?prefilled_email=${encodeURIComponent(user.email)}&client_reference_id=${encodeURIComponent(`${user.email}|match|${matchId}`)}`;
        window.open(stripeUrl, "_blank");
        setSubmitted(true);
      }
    } catch {
      setFormError("Something went wrong. Please try again or contact us.");
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = wantToKnow.length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">

      {/* ---- Hero ---- */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-8 md:px-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Matchmaking</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111] leading-tight">
            Get matched with someone who did YOUR spring week
          </h1>
          <p className="text-[15px] text-[#666] mt-3 font-light leading-relaxed max-w-xl">
            We connect you 1-on-1 with a student who's already done the spring week at your
            firm. They'll answer your questions, share insider tips, and help you prepare to
            convert.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-full px-4 py-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="text-[12px] text-[#555] font-medium">
              22 per match
              {access.hasFreeMatch && (
                <span className="text-emerald-700 font-bold ml-2">- FREE with your Premium tier</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-8 space-y-8">

        {/* ---- How it works ---- */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setHowItWorksOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-[14px] font-semibold text-[#111]">How it works</span>
            {howItWorksOpen
              ? <ChevronUp className="w-4 h-4 text-[#888]" />
              : <ChevronDown className="w-4 h-4 text-[#888]" />
            }
          </button>

          {howItWorksOpen && (
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#F0F0F0] pt-5">
              {STEPS.map((step) => (
                <div key={step.number} className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <p className="text-[13px] font-semibold text-[#111]">{step.title}</p>
                  <p className="text-[12px] text-[#777] font-light leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Free match badge ---- */}
        {access.hasFreeMatch && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-emerald-800">
                You have 1 free match included with Premium
              </p>
              <p className="text-[12px] text-emerald-700 font-light mt-0.5">
                Your match is free of charge. Fill in the form below and we'll arrange it within 48 hours.
              </p>
            </div>
          </div>
        )}

        {/* ---- Success confirmation ---- */}
        {submitted ? (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-8 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-[#111]">Request received</h2>
            <p className="text-[13px] text-[#666] font-light leading-relaxed max-w-sm mx-auto">
              We've received your request. We'll match you with a speaker within 48 hours and
              send you the Zoom link by email.
            </p>
            <button
              onClick={() => { setSubmitted(false); setSelectedFirm(""); setSelectedDivision(""); setSpringWeekDate(""); setWantToKnow(""); }}
              className="text-[12px] text-[#999] underline underline-offset-2 hover:text-[#666] transition-colors"
            >
              Submit another request
            </button>
          </div>
        ) : (
          /* ---- Form ---- */
          <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#555]" />
                <p className="text-[14px] font-semibold text-[#111]">Request a match</p>
              </div>
              {!user?.email && (
                <p className="text-[12px] text-[#888] mt-1 font-light">
                  You need to be signed in to submit a match request.
                </p>
              )}
            </div>

            <div className="px-6 py-6 space-y-5">

              {/* Firm */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#555] uppercase tracking-wider">
                  Target firm
                </label>
                <select
                  value={selectedFirm}
                  onChange={(e) => setSelectedFirm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] text-[13px] text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#999] transition-all"
                  disabled={!user?.email}
                >
                  <option value="">Select a firm...</option>
                  {MATCHMAKING_FIRMS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#555] uppercase tracking-wider">
                  Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] text-[13px] text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#999] transition-all"
                  disabled={!user?.email}
                >
                  <option value="">Select a division...</option>
                  {MATCHMAKING_DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Spring week dates */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#555] uppercase tracking-wider">
                  When is your spring week?
                </label>
                <input
                  type="text"
                  value={springWeekDate}
                  onChange={(e) => setSpringWeekDate(e.target.value)}
                  placeholder="e.g. April 14-18"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] text-[13px] text-[#111] placeholder-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#999] transition-all"
                  disabled={!user?.email}
                />
              </div>

              {/* What to know */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-[#555] uppercase tracking-wider">
                    What do you want to know?
                  </label>
                  <span className={`text-[11px] font-light ${charCount > 500 ? "text-red-500" : "text-[#BBB]"}`}>
                    {charCount}/500
                  </span>
                </div>
                <textarea
                  value={wantToKnow}
                  onChange={(e) => setWantToKnow(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Tell your match what you most want to know. E.g. how to stand out on the assessment day, what the culture is actually like, how to network with seniors..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] text-[13px] text-[#111] placeholder-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#999] transition-all resize-none leading-relaxed"
                  disabled={!user?.email}
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="text-[12px] text-red-600 font-medium">{formError}</p>
              )}

              {/* Submit */}
              {user?.email ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#111] text-white text-[13px] font-bold hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : access.hasFreeMatch ? (
                    <>
                      Use your free match
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Submit and pay 22
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login?redirect=/spring-week-portal/matchmaking")}
                  className="w-full py-3.5 rounded-xl bg-[#111] text-white text-[13px] font-bold hover:bg-[#222] transition-all"
                >
                  Sign in to submit
                </button>
              )}

              {!access.hasFreeMatch && user?.email && (
                <p className="text-[11px] text-[#BBB] text-center">
                  You'll be taken to a secure Stripe checkout page. After payment, we'll be in touch within 48 hours.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ---- Upgrade prompt for non-premium ---- */}
        {!access.hasFreeMatch && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-indigo-900">
                Premium includes 1 free match (worth 22)
              </p>
              <p className="text-[12px] text-indigo-700 font-light mt-0.5">
                Upgrade to Premium for the handbook, free matchmaking, and priority coaching.
              </p>
            </div>
            <button
              onClick={() => navigate("/spring-week-portal/upgrade")}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Upgrade to Premium
            </button>
          </div>
        )}

        {/* ---- Existing matches ---- */}
        {user?.email && (
          <div className="space-y-3">
            <h2 className="text-[14px] font-semibold text-[#111]">Your match requests</h2>
            {matchesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#111]/10 border-t-[#111] rounded-full animate-spin" />
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 text-center">
                <p className="text-[13px] text-[#888] font-light">No match requests yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-0.5">
                        <p className="text-[14px] font-semibold text-[#111]">{match.firm}</p>
                        <p className="text-[12px] text-[#777]">{match.division}</p>
                        {match.spring_week_date && (
                          <p className="text-[12px] text-[#AAA] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {match.spring_week_date}
                          </p>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_COLORS[match.status]}`}>
                        {STATUS_LABELS[match.status]}
                      </span>
                    </div>
                    {match.want_to_know && (
                      <p className="text-[12px] text-[#888] mt-3 leading-relaxed border-t border-[#F0F0F0] pt-3 font-light line-clamp-2">
                        {match.want_to_know}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
