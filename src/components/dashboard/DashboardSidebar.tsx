import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import student1 from "@/assets/student-1.jpg";

const navItems = [
  { title: "Overview", url: "/dashboard", end: true },
  { title: "Browse Coaches", url: "/", end: false },
  { title: "My Bookings", url: "/dashboard/bookings", end: false },
  { title: "Saved Coaches", url: "/dashboard/saved", end: false },
];

const userData = {
  name: "Alex Chen",
  email: "alex@example.com",
  photo: student1,
};

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <NavLink to="/" className="text-xl tracking-tight text-foreground font-sans">
          <span className="font-light">Early</span>
          <span className="font-bold">Edge</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                end={item.end}
                className="block px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground font-medium border-l-2 border-foreground -ml-px"
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-border px-4 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted transition-colors outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData.photo} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userData.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <NavLink to="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/login" className="flex items-center gap-2 cursor-pointer">
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
