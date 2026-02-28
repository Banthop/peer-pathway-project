import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, userType, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = userType === "coach" ? "/coach-dashboard" : "/dashboard";

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate("/");
  };

  const initials = profile?.name
    ? profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-border/30">
      <div className="w-full px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo and Navigation - left side */}
          <div className="flex items-center gap-8">
            <Logo className="text-xl md:text-2xl" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard/browse"
                className="text-sm text-foreground hover:text-primary transition-colors font-sans font-light"
              >
                Browse
              </Link>
              <Link
                to="/become-a-coach"
                className="text-sm text-foreground hover:text-primary transition-colors font-sans font-light"
              >
                Become a Coach
              </Link>
            </nav>
          </div>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              /* Logged-in state */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                    {initials}
                  </div>
                  <span className="text-sm font-sans font-medium text-foreground max-w-[120px] truncate">
                    {profile?.name || "Account"}
                  </span>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        to={dashboardPath}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans hover:bg-secondary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        to={`${dashboardPath}/edit-profile`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans hover:bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans hover:bg-secondary transition-colors w-full text-left text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Logged-out state */
              <>
                <Button variant="ghost" size="sm" className="text-foreground font-sans font-light" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-light" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                to="/dashboard/browse"
                className="text-sm text-foreground font-sans font-light"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to="/become-a-coach"
                className="text-sm text-foreground font-sans font-light"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Coach
              </Link>

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" className="justify-start font-sans font-light" asChild>
                      <Link to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start font-sans font-light text-red-500" onClick={handleSignOut}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start font-sans font-light" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button className="bg-primary text-primary-foreground font-sans font-light" asChild>
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
