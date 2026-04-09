import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Play, BookOpen, UserCheck, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  TEST PORTAL LAYOUT - Generic template portal
 *
 *  This is a stripped-down version of PortalLayout with
 *  NO auth, NO buyer check. Drop-in for any webinar.
 *
 *  To customise for a new webinar:
 *  1. Change the `portalLabel` to match the webinar topic
 *  2. Update `navItems` with the correct paths and labels
 * ═══════════════════════════════════════════════════════════════
 */

const portalLabel = "Template Portal";

const navItems = [
  { to: "/test", icon: Play, label: "Recording", end: true },
  { to: "/test/resources", icon: BookOpen, label: "Resources" },
  { to: "/test/book-person-1", icon: UserCheck, label: "Book Person 1" },
  { to: "/test/book-person-2", icon: UserCheck, label: "Book Person 2" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/test" className="text-lg" />
          <span
            className="text-[13px] font-light text-[#999] tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {portalLabel}
          </span>
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
      </nav>

      {/* Template badge */}
      <div className="mx-3 mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Settings className="w-3 h-3 text-amber-600" />
          <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
            Template Mode
          </p>
        </div>
        <p className="text-[10px] text-amber-600/80 leading-relaxed">
          This is a blank webinar template. Fill in video, resources, and coach
          details to make it live.
        </p>
      </div>

      {/* Placeholder user */}
      <div className="border-t border-[#E8E8E8] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8E8E8] flex items-center justify-center text-[11px] font-semibold text-[#999]">
            ?
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-[#999]">Demo Viewer</p>
            <p className="text-[11px] text-[#CCC]">no auth required</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestPortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] bg-white border-r border-[#E8E8E8] flex-col flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#E8E8E8] z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo to="/test" className="text-lg" />
          <span
            className="text-[13px] font-light text-[#999] tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {portalLabel}
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
        <Outlet />
      </main>
    </div>
  );
}
