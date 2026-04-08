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
  NETWORK_FIRMS,
  type NetworkFirm,
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
    title: "Tell us your firm, division, and what you want to know",
    description:
      "Fill in the form below with your target firm, division, and the specific questions you most want answered.",
  },
  {
    number: "2",
    title: "We source the perfect match from our network of converters",
    description:
      "We pair you with someone who converted at your exact firm. You receive their contact details by email within 48 hours.",
  },
  {
    number: "3",
    title: "Get on a 30-min Zoom call and get firm-specific insider knowledge",
    description:
      "Get your questions answered by someone with real, first-hand experience at your firm. No generic advice.",
  },
];

// --------------- Firm network tabs ---------------

type NetworkCategory = NetworkFirm["category"];

const CATEGORY_ORDER: NetworkCategory[] = [
  "Investment Banking",
  "Trading & Quant",
  "Asset Management & PE",
  "Consulting & Big 4",
];

function FirmNetworkDisplay() {
  const [activeCategory, setActiveCategory] = useState<NetworkCategory>("Investment Banking");

  const firmsByCategory = CATEGORY_ORDER.reduce<Record<NetworkCategory, NetworkFirm[]>>(
    (acc, cat) => {
      acc[cat] = NETWORK_FIRMS.filter((f) => f.category === cat);
      return acc;
    },
    {} as Record<NetworkCategory, NetworkFirm[]>
  );

  const totalFirms = NETWORK_FIRMS.length;

  const SHORT_LABELS: Record<NetworkCategory, string> = {
    "Investment Banking": "Investment Banking",
    "Trading & Quant": "Trading & Quant",
    "Asset Management & PE": "Asset Management & PE",
    "Consulting & Big 4": "Consulting & Big 4",
    "Other": "Other",
  };

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F0F0F0]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[14px] font-semibold text-[#111]">Firms we cover</h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {totalFirms}+ firms across 4 sectors
          </span>
        </div>
        <p className="text-[12px] text-[#888] font-light mt-2">
          Our network of converters spans every major firm. We source your match from the right person for your exact firm and division.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto border-b border-[#F0F0F0] px-4 gap-1 pt-3 pb-0 scrollbar-none">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 py-2 text-[12px] font-semibold rounded-t-lg transition-all whitespace-nowrap border-b-2 -mb-px ${
              activeCategory === cat
                ? "text-indigo-700 border-indigo-600 bg-indigo-50"
                : "text-[#888] border-transparent hover:text-[#444] hover:bg-[#FAFAFA]"
            }`}
          >
            {SHORT_LABELS[cat]}
            <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              activeCategory === cat ? "bg-indigo-100 text-indigo-700" : "bg-[#F0F0F0] text-[#999]"
            }`}>
              {firmsByCategory[cat].length}
            </span>
          </button>
        ))}
      </div>

      {/* Firms grid */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {firmsByCategory[activeCategory].map((firm) => (
            <div
              key={firm.name}
              className="group relative inline-flex items-center gap-1 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-2.5 py-1 text-[11px] font-medium text-[#444] hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800 transition-all cursor-default"
            >
              {firm.name}
              {firm.conversionRate && (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded-full ml-0.5">
                  {firm.conversionRate}
                </span>
              )}
            </div>
          ))}
        </div>
        {firmsByCategory[activeCategory].some((f) => f.conversionRate) && (
          <p className="text-[10px] text-[#BBB] mt-3 font-light">
            Conversion rates shown where available from public data.
          </p>
        )}
      </div>
    </div>
  );
}

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
            <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Insider Access</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111] leading-tight">
            Talk to someone who already converted at your firm
          </h1>
          <p className="text-[15px] text-[#666] mt-3 font-light leading-relaxed max-w-xl">
            We source from an extensive network of spring week converters across 80+ firms. Tell us your firm and division, and we'll connect you 1-on-1 with someone who's been through it and came out with an offer.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-full px-4 py-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="text-[12px] text-[#555] font-medium">
              £50 per session
              {access.hasFreeMatch && (
                <span className="text-emerald-700 font-bold ml-2">- FREE with your Premium tier</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-3xl mx-auto mt-8 space-y-8">

        {/* ---- Firms we cover ---- */}
        <FirmNetworkDisplay />

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
                You have 1 free insider access session included with Premium
              </p>
              <p className="text-[12px] text-emerald-700 font-light mt-0.5">
                Your session is free of charge. Fill in the form below and we'll arrange it within 48 hours.
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
              We've received your request. We'll source your match from the network and send you the Zoom details within 48 hours.
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
                <p className="text-[14px] font-semibold text-[#111]">Request an insider access session</p>
              </div>
              {!user?.email && (
                <p className="text-[12px] text-[#888] mt-1 font-light">
                  You need to be signed in to submit a request.
                </p>
              )}
            </div>

            <div className="px-6 py-6 space-y-5">

              {/* Firm */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#555] uppercase tracking-wider">
                  Which firm is your spring week at?
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
                  Which division?
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
                  When does your spring week start?
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
                    What do you most want to know?
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
                      Use your free insider access session
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Submit and pay £50
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
                Premium includes 1 free insider access session (worth £50)
              </p>
              <p className="text-[12px] text-indigo-700 font-light mt-0.5">
                Upgrade to Premium for the handbook, free insider access, and priority coaching.
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
            <h2 className="text-[14px] font-semibold text-[#111]">Your insider access requests</h2>
            {matchesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#111]/10 border-t-[#111] rounded-full animate-spin" />
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 text-center">
                <p className="text-[13px] text-[#888] font-light">No requests yet.</p>
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
