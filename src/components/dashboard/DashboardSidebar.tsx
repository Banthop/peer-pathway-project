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
import { Settings, LogOut, ChevronDown, ArrowRightLeft } from "lucide-react";
import { pastBookings, conversations } from "@/data/dashboardData";

const unreviewedCount = pastBookings.filter((s) => !s.reviewed).length;
const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

const navItems = [
  { title: "Overview", url: "/dashboard", end: true, dot: false },
  { title: "Browse Coaches", url: "/dashboard/browse", end: false, dot: false },
  { title: "Free Events", url: "/dashboard/events", end: false, dot: false },
  {
    title: "My Bookings",
    url: "/dashboard/bookings",
    end: false,
    dot: unreviewedCount > 0,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    end: false,
    dot: totalUnread > 0,
  },
];

const userData = {
  name: "Alex Chen",
  email: "alex@example.com",
};

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="px-7 py-8">
        <Logo />
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
            {item.dot && (
              <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-border px-5 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted transition-colors outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground truncate">
                {userData.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {userData.email}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <NavLink
                to="/dashboard/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink
                to="/coach-dashboard"
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Switch to Coach
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink
                to="/login"
                className="flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
