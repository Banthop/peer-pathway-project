import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-border/30">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo - pushed to left */}
          <a href="/" className="flex items-center">
            <span className="text-xl md:text-2xl text-foreground">
              <span className="font-sans font-normal">Early</span>
              <span className="font-sans font-bold">Edge</span>
            </span>
          </a>

          {/* Desktop Navigation - centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Browse
              <ChevronDown className="w-4 h-4" />
            </button>
            <a
              href="#become-coach"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Become a Coach
            </a>
          </nav>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-foreground">
              Log In
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
              <button className="flex items-center gap-1 text-sm font-medium text-foreground">
                Browse
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="#become-coach"
                className="text-sm font-medium text-foreground"
              >
                Become a Coach
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start">
                  Log In
                </Button>
                <Button className="bg-primary text-primary-foreground">
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
