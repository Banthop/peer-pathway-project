import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-border/30">
      <div className="w-full px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo and Navigation - left side */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center">
              <span className="text-xl md:text-2xl text-foreground font-sans">
                <span className="font-light">Early</span>
                <span className="font-bold">Edge</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors font-sans font-light">
                Browse
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="#become-coach"
                className="text-sm text-foreground hover:text-primary transition-colors font-sans font-light"
              >
                Become a Coach
              </a>
            </nav>
          </div>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-foreground font-sans font-light">
              Log In
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-light">
              Get Started
            </Button>
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
              <button className="flex items-center gap-1 text-sm text-foreground font-sans font-light">
                Browse
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="#become-coach"
                className="text-sm text-foreground font-sans font-light"
              >
                Become a Coach
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start font-sans font-light">
                  Log In
                </Button>
                <Button className="bg-primary text-primary-foreground font-sans font-light">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
