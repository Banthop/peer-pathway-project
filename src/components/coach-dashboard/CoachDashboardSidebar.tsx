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
import {
    Settings, ChevronDown, ExternalLink, LogOut,
    LayoutDashboard, CalendarDays, Ticket, BookOpen,
    MessageSquare, Wallet, CreditCard, Star, UserPen, BarChart2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachProfile } from "@/hooks/useCoachProfile";
import { useUnreadCount } from "@/hooks/useMessages";

const navItems = [
    { title: "Overview",     url: "/coach-dashboard",               end: true,  Icon: LayoutDashboard },
    { title: "My Sessions",  url: "/coach-dashboard/sessions",      end: false, Icon: CalendarDays },
    { title: "Events",       url: "/coach-dashboard/events",        end: false, Icon: Ticket },
    { title: "Resources",    url: "/coach-dashboard/resources",     end: false, Icon: BookOpen },
    { title: "Messages",     url: "/coach-dashboard/messages",      end: false, Icon: MessageSquare },
    { title: "Earnings",     url: "/coach-dashboard/earnings",      end: false, Icon: Wallet },
    { title: "Payout Setup", url: "/coach-dashboard/payouts",       end: false, Icon: CreditCard },
    { title: "Reviews",      url: "/coach-dashboard/reviews",       end: false, Icon: Star },
    { title: "Edit Profile", url: "/coach-dashboard/edit-profile",  end: false, Icon: UserPen },
    { title: "Analytics",    url: "/coach-dashboard/analytics",     end: false, Icon: BarChart2 },
];

export function CoachDashboardSidebar() {
    const { user, signOut } = useAuth();
    const { data: profile } = useCoachProfile();
    const { data: unreadCount = 0 } = useUnreadCount();

    const coachName = profile?.user?.name || user?.email?.split('@')[0] || 'Coach';
    const coachEmail = user?.email || '';
    const coachAvatar = coachName.substring(0, 2).toUpperCase();
    const coachSlug = profile?.id || 'demo';

    return (
        <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-background">
            {/* Logo */}
            <div className="px-7 py-8">
                <Logo />
            </div>

            {/* Coach badge - gradient */}
            <div className="px-7 pb-5">
                <span className="inline-block px-2.5 py-1 rounded-md gradient-cta text-white text-[10px] font-semibold uppercase tracking-wider">
                    Coach
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isMessages = item.title === "Messages";
                    const badge = isMessages && unreadCount > 0 ? unreadCount : 0;
                    return (
                        <NavLink
                            key={item.title}
                            to={item.url}
                            end={item.end}
                            className="flex items-center gap-2.5 justify-between px-5 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground border-l-2 border-transparent tracking-tight group"
                            activeClassName="text-foreground font-semibold !border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                        >
                            <span className="flex items-center gap-2.5">
                                <item.Icon className="w-4 h-4 shrink-0 opacity-60 group-[.active]:opacity-100" />
                                {item.title}
                            </span>
                            {badge > 0 && (
                                <span className="bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                    {badge > 9 ? "9+" : badge}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* View public profile link */}
            <div className="px-5 pb-3">
                <NavLink
                    to={`/coach/${coachSlug}`}
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
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-semibold">
                                {coachAvatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">
                                {coachName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                                {coachEmail}
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
                        <DropdownMenuItem
                            onClick={async () => { await signOut(); window.location.href = "/login"; }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}
