import { NavLink, Outlet, Navigate, useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { Logo } from "@/components/Logo";
import { WelcomePopup } from "@/components/portal/WelcomePopup";
import { Play, BookOpen, UserCheck, LogOut, Menu, X, ShieldAlert, Lock, Presentation, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/portal", icon: Play, label: "Recording", end: true },
  { to: "/portal/resources", icon: BookOpen, label: "Resources" },
  { to: "/portal/book-uthman", icon: UserCheck, label: "Book Uthman" },
];

const freeNavItems = [
  { to: "/portal/slides", icon: Presentation, label: "Slides", end: true },
];

function SidebarContent({ onClose, tier = "free" }: { onClose?: () => void; tier?: string }) {
  const { user, signOut } = useAuth();
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const showUpgrade = tier !== "bundle";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/portal" className="text-lg" />
          <span className="text-[13px] font-light text-[#999] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Cold Email</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-[#888] hover:text-[#111]">
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

        {/* Upgrade CTA for non-bundle users */}
        {showUpgrade && (
          <div className="pt-3">
            <NavLink
              to="/portal/upgrade"
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
          This content is licensed to your account only. We monitor for
          shared access and accounts found sharing will be permanently
          removed without refund.
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

/* Not-a-buyer screen */
function NotABuyer() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const STRIPE_RECORDING_URL = "https://buy.stripe.com/8x29AS56I8tPaL09cU2400l";
  const STRIPE_BUNDLE_URL = "https://buy.stripe.com/eVqeVcbv6dO9bP4exe2400m";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        {/* Slides nudge */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
            <Presentation className="w-6 h-6 text-violet-600" />
          </div>
          <p className="text-[13px] font-semibold text-[#111] mb-1">
            Start with the free slides
          </p>
          <p className="text-[12px] text-[#888] font-light leading-relaxed mb-3">
            The full slide deck from the 90-minute webinar is free to view.
            No purchase needed.
          </p>
          <button
            onClick={() => navigate("/portal/slides")}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-[13px] font-semibold hover:bg-violet-700 transition-colors"
          >
            View the Slides (Free)
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E8E8E8]" />
          <span className="text-[11px] text-[#BBB] font-medium uppercase tracking-wider">or unlock the full system</span>
          <div className="flex-1 h-px bg-[#E8E8E8]" />
        </div>

        {/* Purchase options */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-[#999]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#111]">Recording access required</p>
              <p className="text-[12px] text-[#888] font-light mt-0.5 leading-relaxed">
                This portal is only available to customers who have purchased access.
                If you purchased with a different email, sign in with that account.
              </p>
            </div>
          </div>
          <a
            href={STRIPE_RECORDING_URL}
            className="block w-full py-3 rounded-xl bg-[#111] text-white text-[13px] font-bold text-center hover:bg-[#222] transition-colors"
          >
            Get the Recording - £10
          </a>
          <a
            href={STRIPE_BUNDLE_URL}
            className="block w-full py-3 rounded-xl border border-[#CCC] text-[#111] text-[13px] font-semibold text-center hover:bg-[#F5F5F5] transition-colors"
          >
            Recording + Guide + Tracker - £29
          </a>
        </div>

        <button
          onClick={signOut}
          className="w-full py-2.5 rounded-xl bg-[#F5F5F5] text-[#666] text-[13px] font-medium hover:bg-[#EBEBEB] transition-colors"
        >
          Sign in with a different account
        </button>

        <p className="text-[11px] text-[#BBB] font-light text-center">
          Having trouble? Email{" "}
          <a href="mailto:d.awotwi@lse.ac.uk" className="text-[#888] underline underline-offset-2">
            d.awotwi@lse.ac.uk
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PortalLayout() {
  const { user, loading: authLoading } = useAuth();
  const { buyerStatus, loading: buyerLoading, checkBuyerStatus } = useBuyerAuth();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const verifyingRef = useRef(false);

  // Handle ?upgraded=true - verify purchase with Stripe then refresh tier
  useEffect(() => {
    if (searchParams.get("upgraded") !== "true") return;
    if (verifyingRef.current) return;
    verifyingRef.current = true;

    // Remove the query param immediately
    searchParams.delete("upgraded");
    setSearchParams(searchParams, { replace: true });

    const email = user?.email;
    if (!email || !supabase) return;

    // Call verify-purchase edge function with the user's email.
    // It searches Stripe for completed sessions matching this email,
    // finds the product, and upserts crm_contacts with the right tags.
    // Works even if there's no existing crm_contacts row.
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-purchase", {
          body: { email },
        });

        if (error) console.error("verify-purchase error:", error.message);

        // Refresh buyer status from DB (verify-purchase updated it)
        await checkBuyerStatus();

        const upgraded = data?.updated === true || data?.tier !== "free";
        toast({
          title: upgraded
            ? "You're upgraded! Your new content is now unlocked."
            : "Payment received! Your content will unlock shortly.",
        });
      } catch (e: any) {
        console.error("verify-purchase failed:", e.message);
        // Still refresh - webhook may have worked
        await checkBuyerStatus();
        toast({ title: "Payment received! Your content will unlock shortly." });
      }
    })();
  }, []);

  const tier = buyerStatus?.tier || "free";

  // Show loading while auth or buyer check is in progress
  if (authLoading || buyerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#111]/10 border-t-[#111] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in - redirect to the standard login page with return URL
  if (!user) return <Navigate to="/login?redirect=/portal" replace />;

  // No longer blocking free users - they get tiered access inside the portal

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] bg-white border-r border-[#E8E8E8] flex-col flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent tier={tier} />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#E8E8E8] z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/portal" className="text-lg" />
          <span className="text-[13px] font-light text-[#999] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Cold Email</span>
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
            <SidebarContent onClose={() => setMobileOpen(false)} tier={tier} />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-[220px] pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>

      {/* Welcome popup for first-time free users */}
      <WelcomePopup />
    </div>
  );
}
