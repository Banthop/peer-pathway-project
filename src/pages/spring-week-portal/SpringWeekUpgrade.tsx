import { useAuth } from "@/contexts/AuthContext";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { SW_TICKETS, type SwTierId } from "@/data/springWeekData";
import { Check, ArrowRight, Star, ShieldCheck, Lock, Phone, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---- Helpers ---- */

function buildCheckoutUrl(baseUrl: string, email: string): string {
  try {
    const url = new URL(baseUrl);
    if (email) {
      url.searchParams.set("prefilled_email", email);
      url.searchParams.set("client_reference_id", email);
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/* ---- Tier order for upgrade display ---- */

const TIER_ORDER: SwTierId[] = ["watch", "prepare", "convert"];

function tiersToShow(currentTier: string): SwTierId[] {
  if (currentTier === "convert") return [];
  if (currentTier === "prepare") return ["convert"];
  if (currentTier === "watch") return ["prepare", "convert"];
  // free - show all
  return ["watch", "prepare", "convert"];
}

/* ---- Single tier card ---- */

interface TierCardProps {
  id: SwTierId;
  isCurrent: boolean;
  email: string;
}

function TierCard({ id, isCurrent, email }: TierCardProps) {
  const ticket = SW_TICKETS[id];
  const isPrepare = id === "prepare";
  const isConvert = id === "convert";

  const checkoutUrl = buildCheckoutUrl(ticket.stripeLink, email);

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl p-6 shadow-sm flex flex-col",
        isCurrent
          ? "border-2 border-emerald-400 ring-1 ring-emerald-100"
          : isPrepare
          ? "border-2 border-[#111] shadow-md"
          : isConvert
          ? "border-2 border-emerald-300"
          : "border border-[#E8E8E8]",
      )}
    >
      {/* Badge */}
      {isCurrent && (
        <span className="absolute -top-3 left-5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
          Current plan
        </span>
      )}
      {!isCurrent && ticket.badge && (
        <span className={cn(
          "absolute -top-3 left-5 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase",
          isPrepare ? "bg-[#111]" : "bg-emerald-600"
        )}>
          {ticket.badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-[16px] font-bold text-[#111]">{ticket.name}</h3>
          {isConvert && !isCurrent && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              Best for conversion
            </span>
          )}
        </div>
        <p className="text-[12px] text-indigo-700 font-semibold italic">{ticket.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-[#111]">
            £{ticket.price}
          </span>
          <span className="text-[13px] text-[#888] mb-1">one-time</span>
        </div>
        {isConvert && (
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Includes free prep call (worth £50)
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {ticket.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#555]">
            <Check
              className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                isPrepare ? "text-[#111]" : isConvert ? "text-emerald-600" : "text-[#AAA]",
              )}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 text-[13px] font-semibold text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          You have this plan
        </div>
      ) : (
        <a
          href={checkoutUrl}
          className={cn(
            "block w-full py-3 rounded-xl text-[13px] font-bold text-center transition-colors flex items-center justify-center gap-2",
            isPrepare
              ? "bg-[#111] text-white hover:bg-[#222]"
              : isConvert
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB] border border-[#E0E0E0]",
          )}
        >
          {isConvert ? (
            <>
              <Phone className="w-3.5 h-3.5" />
              Get Convert
            </>
          ) : (
            <>
              Get {ticket.name}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </a>
      )}
    </div>
  );
}

/* ---- Comparison table ---- */

const ALL_FEATURES = [
  { label: "Live panel - April 12", tiers: ["watch", "prepare", "convert"] },
  { label: "Full recording after the event", tiers: ["watch", "prepare", "convert"] },
  { label: "Speaker directory", tiers: ["watch", "prepare", "convert"] },
  { label: "Spring Week Handbook (45+ firms)", tiers: ["prepare", "convert"] },
  { label: "Firm-specific conversion rates and AC formats", tiers: ["prepare", "convert"] },
  { label: "Networking scripts and follow-up templates", tiers: ["prepare", "convert"] },
  { label: "Division-specific technical prep guides", tiers: ["prepare", "convert"] },
  { label: "1 free prep call with a converter (worth £50)", tiers: ["convert"] },
  { label: "Priority booking for additional prep calls", tiers: ["convert"] },
] as const;

const TIER_LABELS: Record<SwTierId, string> = {
  watch: "Watch",
  prepare: "Prepare",
  convert: "Convert",
};

function ComparisonTable() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#E8E8E8]">
        <h3 className="text-[13px] font-semibold text-[#111]">What's included at each tier</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="text-left px-5 py-3 text-[11px] text-[#888] font-semibold uppercase tracking-wider w-1/2">
                Feature
              </th>
              {TIER_ORDER.map((tier) => (
                <th key={tier} className="text-center px-3 py-3 text-[11px] text-[#888] font-semibold uppercase tracking-wider">
                  {TIER_LABELS[tier]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_FEATURES.map(({ label, tiers }) => (
              <tr key={label} className="border-b border-[#F9F9F9] last:border-0">
                <td className="px-5 py-3 text-[12px] text-[#555] font-light">{label}</td>
                {TIER_ORDER.map((tier) => (
                  <td key={tier} className="text-center px-3 py-3">
                    {(tiers as readonly string[]).includes(tier) ? (
                      <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#DDD] mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#FAFAFA] border-t border-[#E8E8E8]">
              <td className="px-5 py-3 text-[12px] font-semibold text-[#111]">Price</td>
              {TIER_ORDER.map((tier) => (
                <td key={tier} className="text-center px-3 py-3 text-[13px] font-bold text-[#111]">
                  £{SW_TICKETS[tier].price}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ---- Main ---- */

export default function SpringWeekUpgrade() {
  const { user } = useAuth();
  const access = useSwAccess();

  const email = user?.email ?? "";
  const firstName =
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "there";

  const tiers = tiersToShow(access.tier);
  const isConvert = access.tier === "convert";

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 md:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {isConvert ? (
            <>
              <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
                You're on Convert, {firstName}
              </h1>
              <p className="text-[13px] text-[#888] font-light mt-1">
                You have full access to everything in the portal.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
                Students who prepare convert at 2-3x the rate
              </h1>
              <p className="text-[13px] text-[#888] font-light mt-1 leading-relaxed">
                Only 30-40% of spring weekers get a return offer. The ones who do aren't smarter. They just knew what to expect.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-6">

        {/* Social proof bar */}
        {!isConvert && (
          <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-[#666] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              Students from LSE, Imperial, Warwick, UCL, Oxford, Cambridge, Bristol and 15+ other universities
            </div>
          </div>
        )}

        {/* Urgency notice */}
        {!isConvert && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-900 font-medium">
              Spring weeks start Monday April 13. Assessment centres happen on the last day.
              There is no time to figure it out when you arrive.
            </p>
          </div>
        )}

        {/* Tier cards */}
        {isConvert ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-[15px] font-semibold text-[#111]">All features unlocked</p>
            <p className="text-[13px] text-[#888] font-light mt-1">
              You have access to the live panel, firm intel, free prep call, and priority support.
            </p>
          </div>
        ) : (
          <div className={cn("grid gap-4", tiers.length === 1 ? "sm:grid-cols-1 max-w-md" : "sm:grid-cols-2 lg:grid-cols-3")}>
            {(["watch", "prepare", "convert"] as SwTierId[]).map((id) => {
              const isCurrent = id === access.tier;
              if (!isCurrent && !tiers.includes(id)) return null;
              return (
                <TierCard
                  key={id}
                  id={id}
                  isCurrent={isCurrent}
                  email={email}
                />
              );
            })}
          </div>
        )}

        {/* Risk reversal */}
        <div className="flex items-center justify-center gap-2 text-[12px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          Full refund if you're not satisfied - just email us
        </div>

        {/* Comparison table */}
        <ComparisonTable />

        {/* Footer */}
        <p className="text-[11px] text-[#CCC] text-center">
          Questions?{" "}
          <a
            href="mailto:d.awotwi@lse.ac.uk"
            className="text-[#AAA] underline underline-offset-2"
          >
            d.awotwi@lse.ac.uk
          </a>
        </p>
      </div>
    </div>
  );
}
