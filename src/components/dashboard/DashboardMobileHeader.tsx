import { useState } from "react";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import student1 from "@/assets/student-1.jpg";

const navItems = [
  { title: "Overview", url: "/dashboard", end: true },
  { title: "Browse Coaches", url: "/dashboard/browse", end: false },
  { title: "Free Events", url: "/dashboard/events", end: false },
  { title: "My Bookings", url: "/dashboard/bookings", end: false },
  { title: "Messages", url: "/dashboard/messages", end: false },
];

const userData = {
  name: "Alex Chen",
  email: "alex@example.com",
  photo: student1,
};

export function DashboardMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <Logo className="text-lg" />
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={userData.photo} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {isOpen && (
        <nav className="border-b border-border bg-background px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-foreground font-medium"
            >
              {item.title}
            </NavLink>
          ))}
          <div className="border-t border-border pt-3 mt-3 space-y-1">
            <NavLink
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" /> Settings
            </NavLink>
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Log out
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
}
