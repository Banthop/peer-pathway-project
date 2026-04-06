import { NavLink, Outlet, Navigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { Logo } from "@/components/Logo";
import { Play, BookOpen, UserCheck, LogOut, Menu, X, ShieldAlert, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const navItems = [
  { to: "/portal", icon: Play, label: "Recording", end: true },
  { to: "/portal/resources", icon: BookOpen, label: "Resources" },
  { to: "/portal/book-uthman", icon: UserCheck, label: "Book Uthman" },
];

function SidebarContent({ onClose, tier }: { onClose?: () => void; tier?: string }) {
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
            <Link
              to="/portal/upgrade"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md"
            >
              <Zap className="w-4 h-4" />
              Upgrade Access
            </Link>
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

export default function PortalLayout() {
  const { user, loading: authLoading } = useAuth();
  const { buyerStatus, loading: buyerLoading, checkBuyerStatus } = useBuyerAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle ?upgraded=true - refresh buyer status and show success toast
  useEffect(() => {
    if (searchParams.get("upgraded") !== "true") return;

    // Remove the query param immediately
    searchParams.delete("upgraded");
    setSearchParams(searchParams, { replace: true });

    // Force refresh buyer status
    checkBuyerStatus();

    // If the webhook hasn't fired yet, poll for up to 60s
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      await checkBuyerStatus();
      if (attempts >= 20) {
        if (pollRef.current) clearInterval(pollRef.current);
        toast.success("You're upgraded! Your new content is now unlocked.");
      }
    }, 3000);

    toast.success("You're upgraded! Your new content is now unlocked.");

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Stop polling once tier upgrades past free
  useEffect(() => {
    if (buyerStatus && buyerStatus.tier !== "free" && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [buyerStatus?.tier]);

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
    </div>
  );
}
