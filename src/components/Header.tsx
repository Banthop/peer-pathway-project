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
              <span className="text-xl md:text-2xl text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span style={{ fontWeight: 400 }}>Early</span>
                <span style={{ fontWeight: 700 }}>Edge</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                Browse
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="#become-coach"
                className="text-sm text-foreground hover:text-primary transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                Become a Coach
              </a>
            </nav>
          </div>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-foreground" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              Log In
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
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
              <button className="flex items-center gap-1 text-sm text-foreground" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                Browse
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="#become-coach"
                className="text-sm text-foreground"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                Become a Coach
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Log In
                </Button>
                <Button className="bg-primary text-primary-foreground" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
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
