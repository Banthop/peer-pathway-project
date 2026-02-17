import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, ChevronDown, ExternalLink, ArrowRightLeft } from "lucide-react";
import { coachProfile } from "@/data/coachDashboardData";

const navItems = [
    { title: "Overview", url: "/coach-dashboard", end: true },
    { title: "My Sessions", url: "/coach-dashboard/sessions", end: false },
    { title: "Earnings", url: "/coach-dashboard/earnings", end: false },
    { title: "Reviews", url: "/coach-dashboard/reviews", end: false },
    { title: "Edit Profile", url: "/coach-dashboard/edit-profile", end: false },
    { title: "Analytics", url: "/coach-dashboard/analytics", end: false },
];

export function CoachDashboardSidebar() {
    return (
        <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-background">
            {/* Logo */}
            <div className="px-7 py-8">
                <Logo />
            </div>

            {/* Coach badge */}
            <div className="px-7 pb-5">
                <span className="inline-block px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
                    Coach
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.title}
                        to={item.url}
                        end={item.end}
                        className="flex items-center justify-between px-7 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground border-l-2 border-transparent tracking-tight"
                        activeClassName="text-foreground font-semibold !border-foreground"
                    >
                        {item.title}
                    </NavLink>
                ))}
            </nav>

            {/* View public profile link */}
            <div className="px-5 pb-3">
                <NavLink
                    to={`/coach/${coachProfile.slug}`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View public profile
                </NavLink>
            </div>

            {/* User section at bottom */}
            <div className="border-t border-border px-5 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted transition-colors outline-none">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                                {coachProfile.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">
                                {coachProfile.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                                {coachProfile.email}
                            </p>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem asChild>
                            <NavLink
                                to="/coach-dashboard/edit-profile"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <NavLink
                                to="/dashboard"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <ArrowRightLeft className="h-4 w-4" />
                                Switch to Student
                            </NavLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}
