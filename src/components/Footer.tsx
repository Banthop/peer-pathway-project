import { Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const footerLinks = {
  welcome: {
    title: "Welcome",
    links: [
      { name: "Get started", href: "/signup" },
      { name: "Log in", href: "/login" },
      { name: "Become a coach", href: "/become-a-coach" },
    ],
  },
  explore: {
    title: "Explore",
    links: [
      { name: "Browse coaches", href: "/browse" },
      { name: "Free events", href: "/events" },
      { name: "Resources", href: "/resources" },
      { name: "Guarantee", href: "/guarantee" },
    ],
  },
  categories: {
    title: "Categories",
    links: [
      { name: "Investment Banking", href: "/browse" },
      { name: "Consulting", href: "/browse" },
      { name: "Law", href: "/browse" },
      { name: "Oxbridge", href: "/browse" },
      { name: "UCAT", href: "/browse" },
    ],
  },
};

const Footer = () => {
  return (
    <footer className="bg-dark text-dark-foreground py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Logo & Socials */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-2xl mb-3 block !text-dark-foreground" />
            <p className="text-[13px] text-dark-foreground/40 font-light mb-5 leading-relaxed">Peer coaching for students<br />who want the edge.</p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/company/earlyedge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center text-dark-foreground/50 hover:text-dark-foreground hover:bg-dark-foreground/10 transition-all duration-200"
              >
                <Linkedin className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://instagram.com/earlyedge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center text-dark-foreground/50 hover:text-dark-foreground hover:bg-dark-foreground/10 transition-all duration-200"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://twitter.com/earlyedge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full flex items-center justify-center text-dark-foreground/50 hover:text-dark-foreground hover:bg-dark-foreground/10 transition-all duration-200"
              >
                <Twitter className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((column) => (
            <div key={column.title}>
              <h4 className="font-sans font-medium text-dark-foreground mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-dark-foreground/60 hover:text-dark-foreground transition-colors font-sans font-light"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-dark-foreground/10">
          <p className="text-sm text-dark-foreground/40 font-sans font-light">
            © 2026 EarlyEdge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
