import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SpringWeekTier = "part1" | "part2" | "bundle" | "premium" | null;

interface SpringWeekAccess {
  tier: SpringWeekTier;
  hasPart1: boolean;
  hasPart2: boolean;
  hasPlaybook: boolean;
  hasCoaching: boolean;
  loading: boolean;
}

export function useSpringWeekAccess(): SpringWeekAccess {
  const { user } = useAuth();
  const [access, setAccess] = useState<SpringWeekAccess>({
    tier: null,
    hasPart1: false,
    hasPart2: false,
    hasPlaybook: false,
    hasCoaching: false,
    loading: true,
  });

  useEffect(() => {
    if (!user?.email) {
      setAccess({
        tier: null,
        hasPart1: false,
        hasPart2: false,
        hasPlaybook: false,
        hasCoaching: false,
        loading: false,
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

        if (!data || data.length === 0) {
          setAccess({
            tier: null,
            hasPart1: false,
            hasPart2: false,
            hasPlaybook: false,
            hasCoaching: false,
            loading: false,
          });
          return;
        }

        const tags: string[] = (data[0].tags as string[]) || [];

        // Determine highest tier
        let tier: SpringWeekTier = null;
        if (tags.includes("spring_week_premium")) tier = "premium";
        else if (tags.includes("spring_week_bundle")) tier = "bundle";
        else if (tags.includes("spring_week_part2")) tier = "part2";
        else if (tags.includes("spring_week_part1")) tier = "part1";

        // Also accept generic spring week buyer tag
        const isSpringWeekBuyer =
          tier !== null ||
          tags.includes("spring_week_buyer") ||
          tags.includes("stripe_customer");

        if (!isSpringWeekBuyer) {
          setAccess({
            tier: null,
            hasPart1: false,
            hasPart2: false,
            hasPlaybook: false,
            hasCoaching: false,
            loading: false,
          });
          return;
        }

        // Fallback: if they're a stripe_customer with no specific tier, grant bundle access
        if (tier === null && tags.includes("stripe_customer")) {
          tier = "bundle";
        }

        setAccess({
          tier,
          hasPart1: tier === "premium" || tier === "bundle" || tier === "part1",
          hasPart2: tier === "premium" || tier === "bundle" || tier === "part2",
          hasPlaybook: tier === "premium" || tier === "bundle",
          hasCoaching: tier === "premium",
          loading: false,
        });
      } catch {
        setAccess({
          tier: null,
          hasPart1: false,
          hasPart2: false,
          hasPlaybook: false,
          hasCoaching: false,
          loading: false,
        });
      }
    })();
  }, [user?.email]);

  return access;
}

const navItems = [
  { to: "/spring-week-portal", icon: LayoutDashboard, label: "Dashboard", end: true },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();
  const name =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Student";

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

function NotABuyer() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-[#999]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#111]">
            Purchase required
          </h1>
          <p className="text-sm text-[#888] font-light mt-2 leading-relaxed">
            This portal is only available to Spring Week Conversion Panel
            ticket holders. If you purchased with a different email, please
            sign in with that account.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/spring-week")}
            className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#222] transition-colors"
          >
            Get a Ticket
          </button>
          <button
            onClick={signOut}
            className="w-full py-3 rounded-xl bg-[#F5F5F5] text-[#666] text-sm font-medium hover:bg-[#EBEBEB] transition-colors"
          >
            Sign in with a different account
          </button>
        </div>
        <p className="text-xs text-[#BBB] font-light">
          Having trouble? Email{" "}
          <a
            href="mailto:d.awotwi@lse.ac.uk"
            className="text-[#888] underline underline-offset-2"
          >
            d.awotwi@lse.ac.uk
          </a>
        </p>
      </div>
    </div>
  );
}

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

  if (!access.tier) {
    return <NotABuyer />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] bg-white border-r border-[#E8E8E8] flex-col flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
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
            <SidebarContent onClose={() => setMobileOpen(false)} />
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
