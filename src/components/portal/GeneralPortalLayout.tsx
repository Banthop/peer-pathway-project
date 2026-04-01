import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Play, BookOpen, UserCheck, LogOut, Menu, X, Lock } from "lucide-react";
import { useState } from "react";

const ALLOWED_EMAIL = "demo@earlyedge.co.uk";

const navItems = [
  { to: "/general-portal", icon: Play, label: "Recording", end: true },
  { to: "/general-portal/resources", icon: BookOpen, label: "Resources" },
  { to: "/general-portal/book-andrew", icon: UserCheck, label: "Book Andrew" },
  { to: "/general-portal/book-mohammad", icon: UserCheck, label: "Book Mohammad" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/general-portal" className="text-lg" />
          <span className="text-[13px] font-light text-[#999] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Portal</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-[#888] hover:text-[#111]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

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

      <div className="px-3 py-4 border-t border-[#E8E8E8]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#111] flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#111] truncate">{name}</p>
            <p className="text-[10px] text-[#999] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#666] hover:bg-[#F5F5F5] hover:text-[#111] transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function AccessDenied() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-[#999]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#111]">Access restricted</h1>
          <p className="text-sm text-[#888] font-light mt-2 leading-relaxed">
            This portal is only available to authorised demo accounts.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#222] transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={signOut}
            className="w-full py-3 rounded-xl bg-[#F5F5F5] text-[#666] text-sm font-medium hover:bg-[#EBEBEB] transition-colors"
          >
            Sign in with a different account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GeneralPortalLayout() {
  const { user, loading: authLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#111]/10 border-t-[#111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login?redirect=/general-portal" replace />;

  // STRICT ACCESS CONTROL: Only allow demo user
  if (user.email?.toLowerCase() !== ALLOWED_EMAIL) {
    return <AccessDenied />;
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-[#E8E8E8] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8E8E8] flex flex-col z-10">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E8E8E8]">
          <button onClick={() => setMobileOpen(true)} className="p-1 text-[#888] hover:text-[#111]">
            <Menu className="w-5 h-5" />
          </button>
          <Logo to="/general-portal" className="text-base" />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
