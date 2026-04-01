import { NavLink, Outlet } from "react-router-dom";
import { Shield, Users, Target, BarChart3, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const adminNavItems = [
    { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
    { to: "/admin/coaches", label: "Coach Profiles", icon: Users, end: false },
    { to: "/admin/outreach", label: "Outreach", icon: Target, end: false },
    { to: "/admin/linkedin", label: "LinkedIn Auto", icon: Linkedin, end: false },
];

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-[220px] border-r border-border bg-background fixed top-16 bottom-0 z-30">
                    <div className="px-5 py-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-foreground" />
                            <span className="text-sm font-bold text-foreground tracking-tight">Admin Panel</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Manage your platform</p>
                    </div>

                    <nav className="flex-1 px-3 space-y-0.5">
                        {adminNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-foreground text-background"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Mobile nav bar */}
                <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-background border-b border-border px-4 py-2 flex gap-2 overflow-x-auto">
                    {adminNavItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${isActive
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground bg-muted"
                                }`
                            }
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                {/* Main content */}
                <main className="flex-1 md:ml-[220px] pt-[104px] md:pt-[72px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
