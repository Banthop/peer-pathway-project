import { useAuth } from "@/contexts/AuthContext";
import { useSwAccess } from "@/components/spring-week-portal/SpringWeekPortalLayout";
import { SW_TICKETS, type SwTierId } from "@/data/springWeekData";
import { Check, ArrowRight, Zap, Star, ShieldCheck, Lock } from "lucide-react";
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

const TIER_ORDER: SwTierId[] = ["webinar", "bundle", "premium"];

function tiersToShow(currentTier: string): SwTierId[] {
  if (currentTier === "premium") return [];
  if (currentTier === "bundle") return ["premium"];
  if (currentTier === "webinar") return ["bundle", "premium"];
  // free - show all
  return ["webinar", "bundle", "premium"];
}

/* ---- Single tier card ---- */

interface TierCardProps {
  id: SwTierId;
  isCurrent: boolean;
  email: string;
}

function TierCard({ id, isCurrent, email }: TierCardProps) {
  const ticket = SW_TICKETS[id];
  const isRecommended = id === "bundle";
  const isPremium = id === "premium";

  const checkoutUrl = buildCheckoutUrl(ticket.stripeLink, email);

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl p-6 shadow-sm flex flex-col",
        isCurrent
          ? "border-2 border-emerald-400 ring-1 ring-emerald-100"
          : isRecommended
          ? "border-2 border-[#111] shadow-md"
          : isPremium
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
        <span className="absolute -top-3 left-5 bg-[#111] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
          {ticket.badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[15px] font-semibold text-[#111]">{ticket.name}</h3>
          {isPremium && !isCurrent && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              Best for conversion
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#888] font-light">{ticket.description}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-[#111]">
            £{ticket.price}
          </span>
          <span className="text-[13px] text-[#888] mb-1">one-time</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {ticket.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#555]">
            <Check
              className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                isRecommended ? "text-[#111]" : "text-emerald-500",
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
            isRecommended
              ? "bg-[#111] text-white hover:bg-[#222]"
              : isPremium
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB] border border-[#E0E0E0]",
          )}
        >
          Get access
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

/* ---- Comparison table ---- */

const ALL_FEATURES = [
  { label: "Live webinar - April 12", tiers: ["webinar", "bundle", "premium"] },
  { label: "Full recording after the event", tiers: ["webinar", "bundle", "premium"] },
  { label: "Speaker directory", tiers: ["webinar", "bundle", "premium"] },
  { label: "Spring Week Handbook (45+ firms)", tiers: ["bundle", "premium"] },
  { label: "6-phase conversion checklist", tiers: ["bundle", "premium"] },
  { label: "1 free matchmaking session", tiers: ["premium"] },
  { label: "Priority coaching booking", tiers: ["premium"] },
  { label: "Discounted coaching rates", tiers: ["bundle", "premium"] },
] as const;

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
                <th key={tier} className="text-center px-3 py-3 text-[11px] text-[#888] font-semibold uppercase tracking-wider capitalize">
                  {tier}
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
  const isPremium = access.tier === "premium";

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] px-6 md:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {isPremium ? (
            <>
              <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
                You're on Premium, {firstName}
              </h1>
              <p className="text-[13px] text-[#888] font-light mt-1">
                You have full access to everything in the portal.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-semibold text-[#111]">
                Upgrade Your Access
              </h1>
              <p className="text-[13px] text-[#888] font-light mt-1">
                You're on{" "}
                <span className="font-semibold text-[#111] capitalize">{access.tier}</span>.
                {tiers.length > 0 && " Upgrade below to unlock more."}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-6 space-y-6">
        {/* Social proof */}
        {!isPremium && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5" />
              Spring week apps open now - act fast
            </div>
          </div>
        )}

        {/* Tier cards */}
        {isPremium ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-[15px] font-semibold text-[#111]">All features unlocked</p>
            <p className="text-[13px] text-[#888] font-light mt-1">
              You have access to the webinar, handbook, free matchmaking, and priority coaching.
            </p>
          </div>
        ) : (
          <div className={cn("grid gap-4", tiers.length === 1 ? "sm:grid-cols-1 max-w-md" : "sm:grid-cols-2 lg:grid-cols-3")}>
            {/* Show current tier card first if it exists in full tier list */}
            {(["webinar", "bundle", "premium"] as SwTierId[]).map((id) => {
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
