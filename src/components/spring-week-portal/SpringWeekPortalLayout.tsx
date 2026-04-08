import {
  NavLink,
  Outlet,
  Navigate,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  Play,
  BookOpen,
  Users,
  CalendarCheck,
  ArrowUpCircle,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_SW_WATCH, STRIPE_SW_PREPARE, STRIPE_SW_CONVERT } from "@/data/springWeekData";

// -- Tier types --

export type SwPortalTier = "free" | "watch" | "prepare" | "convert";

// Backward-compat alias used by legacy SpringWeekPortal.tsx
export type SpringWeekTier = "part1" | "part2" | "bundle" | "premium" | null;

export interface SwAccess {
  tier: SwPortalTier;
  hasWebinar: boolean;
  hasHandbook: boolean;
  /** Alias for hasHandbook - used by legacy SpringWeekPlaybook.tsx */
  hasPlaybook: boolean;
  hasFreeMatch: boolean;
  hasCoachingDiscount: boolean;
  loading: boolean;
  tags: string[];
}

// -- Access hook --

export function useSpringWeekAccess(): SwAccess {
  const { user } = useAuth();
  const [access, setAccess] = useState<SwAccess>({
    tier: "free",
    hasWebinar: false,
    hasHandbook: false,
    hasPlaybook: false,
    hasFreeMatch: false,
    hasCoachingDiscount: false,
    loading: true,
    tags: [],
  });

  useEffect(() => {
    if (!user?.email) {
      setAccess({
        tier: "free",
        hasWebinar: false,
        hasHandbook: false,
        hasPlaybook: false,
        hasFreeMatch: false,
        hasCoachingDiscount: false,
        loading: false,
        tags: [],
      });
      return;
    }

    const emailKey = user.email.toLowerCase().trim();

    (async () => {
      try {
        const { data } = await supabase
          .from("crm_contacts")
          .select("tags")
          .eq("email", emailKey)
          .limit(1);

        const tags: string[] = data && data.length > 0
          ? ((data[0].tags as string[]) || [])
          : [];

        // Tier resolution - new tags take priority, old tags kept for backward compat
        let tier: SwPortalTier = "free";
        if (
          tags.includes("spring_week_convert") ||
          tags.includes("spring_week_premium")
        ) {
          tier = "convert";
        } else if (
          tags.includes("spring_week_prepare") ||
          tags.includes("spring_week_bundle")
        ) {
          tier = "prepare";
        } else if (
          tags.includes("spring_week_watch") ||
          tags.includes("spring_week_webinar")
        ) {
          tier = "watch";
        }

        const handbookAccess = tier === "prepare" || tier === "convert";

        setAccess({
          tier,
          hasWebinar: tier !== "free",
          hasHandbook: handbookAccess,
          hasPlaybook: handbookAccess,
          hasFreeMatch: tier === "convert",
          hasCoachingDiscount: handbookAccess,
          loading: false,
          tags,
        });
      } catch {
        setAccess({
          tier: "free",
          hasWebinar: false,
          hasHandbook: false,
          hasPlaybook: false,
          hasFreeMatch: false,
          hasCoachingDiscount: false,
          loading: false,
          tags: [],
        });
      }
    })();
  }, [user?.email]);

  return access;
}

// -- Convenience hook for child routes --

export function useSwAccess(): SwAccess {
  return useOutletContext<{ access: SwAccess }>().access;
}

// -- Nav items --

const navItems = [
  { to: "/spring-week-portal", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/spring-week-portal/recording", icon: Play, label: "Recording" },
  { to: "/spring-week-portal/handbook", icon: BookOpen, label: "Handbook" },
  { to: "/spring-week-portal/matchmaking", icon: Users, label: "Prep Calls" },
  { to: "/spring-week-portal/coaching", icon: CalendarCheck, label: "Book Coaching" },
];

// -- Sidebar --

function SidebarContent({
  onClose,
  access,
}: {
  onClose?: () => void;
  access: SwAccess;
}) {
  const { user, signOut } = useAuth();
  const name =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  const showUpgrade = access.tier !== "convert";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/spring-week-portal" className="text-lg" />
          <span
            className="text-[13px] font-light text-[#999] tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Spring Week
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 text-[#888] hover:text-[#111]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-[#111] text-white"
                  : "text-[#666] hover:bg-[#F5F5F5] hover:text-[#111]"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}

        {/* Upgrade CTA */}
        {showUpgrade && (
          <div className="pt-3">
            <NavLink
              to="/spring-week-portal/upgrade"
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-bold bg-gradient-to-r text-white transition-all ${
                  isActive
                    ? "from-emerald-700 to-emerald-600 ring-2 ring-emerald-300 ring-offset-2 shadow-lg"
                    : "from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-sm hover:shadow-md"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full" />
                  )}
                  <Zap className="w-4 h-4" />
                  Upgrade Access
                </>
              )}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Anti-sharing notice */}
      <div className="mx-3 mb-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldAlert className="w-3 h-3 text-[#999]" />
          <p className="text-[10px] text-[#999] font-semibold uppercase tracking-wider">
            Licensed to you
          </p>
        </div>
        <p className="text-[10px] text-[#BBB] leading-relaxed">
          This portal is licensed to your account only. Accounts found sharing
          access will be permanently removed without refund.
        </p>
      </div>

      {/* User section */}
      <div className="border-t border-[#E8E8E8] px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-[11px] font-semibold text-white">
            {name[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-[#111] truncate">{name}</p>
            <p className="text-[11px] text-[#999] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-[12px] text-[#999] hover:text-[#111] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// -- Free tier welcome screen (replaces hard block) --

function FreeTierWelcome() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto">
            <ArrowUpCircle className="w-7 h-7 text-[#666]" />
          </div>
          <h1 className="text-xl font-semibold text-[#111]">
            You're in. Don't leave empty-handed.
          </h1>
          <p className="text-sm text-[#888] font-light leading-relaxed">
            You have a free account. Spring weeks start in days. Every student
            who doesn't prepare is one more person taking the offer you came for.
          </p>
        </div>

        {/* Loss aversion framing */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-[12px] font-semibold text-amber-800 mb-2">
            What unprepared students get wrong:
          </p>
          <ul className="space-y-1.5">
            {[
              "Not knowing the AC format before they walk in",
              "Missing the 24-hour follow-up window after meeting seniors",
              "Treating the spring week like a job shadow, not an audition",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12px] text-amber-900">
                <span className="mt-0.5 text-amber-500 font-bold">x</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade options */}
        <div className="space-y-3">
          <a
            href={STRIPE_SW_WATCH}
            className="block w-full py-3 rounded-xl border border-[#CCC] text-[#111] text-[13px] font-semibold text-center hover:bg-[#F5F5F5] transition-colors"
          >
            Watch - £19 (see how they converted)
          </a>
          <a
            href={STRIPE_SW_PREPARE}
            className="block w-full py-3 rounded-xl bg-[#111] text-white text-[13px] font-bold text-center hover:bg-[#222] transition-colors"
          >
            Prepare - £39 (most students choose this)
          </a>
          <a
            href={STRIPE_SW_CONVERT}
            className="block w-full py-3 rounded-xl border border-emerald-400 text-emerald-700 text-[13px] font-semibold text-center hover:bg-emerald-50 transition-colors"
          >
            Convert - £69 (includes free prep call)
          </a>
        </div>

        <button
          onClick={() => navigate("/spring-week-portal/upgrade")}
          className="w-full py-2.5 rounded-xl bg-[#F5F5F5] text-[#666] text-[13px] font-medium hover:bg-[#EBEBEB] transition-colors"
        >
          Compare all tiers
        </button>

        <button
          onClick={signOut}
          className="w-full py-2 text-[12px] text-[#BBB] hover:text-[#888] transition-colors"
        >
          Sign in with a different account
        </button>

        <p className="text-[11px] text-[#BBB] font-light text-center">
          Already purchased with a different email?{" "}
          <a
            href="mailto:d.awotwi@lse.ac.uk"
            className="text-[#888] underline underline-offset-2"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

// -- Layout --

export default function SpringWeekPortalLayout() {
  const { user, loading: authLoading } = useAuth();
  const access = useSpringWeekAccess();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading || access.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#111]/10 border-t-[#111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/spring-week-portal" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] bg-white border-r border-[#E8E8E8] flex-col flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent access={access} />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#E8E8E8] z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/spring-week-portal" className="text-lg" />
          <span
            className="text-[13px] font-light text-[#999] tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Spring Week
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-[#666] hover:text-[#111]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-0 right-0 w-[260px] h-screen bg-white z-50 shadow-xl animate-in slide-in-from-right duration-200">
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              access={access}
            />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-[220px] pt-14 md:pt-0 min-h-screen">
        <Outlet context={{ access }} />
      </main>
    </div>
  );
}
