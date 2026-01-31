import { Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  welcome: {
    title: "Welcome",
    links: [
      { name: "Get started", href: "#" },
      { name: "Log in", href: "#" },
      { name: "Become a coach", href: "#" },
    ],
  },
  categories: {
    title: "Categories",
    links: [
      { name: "Banking", href: "#" },
      { name: "Consulting", href: "#" },
      { name: "Law", href: "#" },
      { name: "Oxbridge", href: "#" },
      { name: "UCAT", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "Careers", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Privacy", href: "#" },
      { name: "Support", href: "#" },
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
            <a href="/" className="text-2xl font-sans mb-6 block">
              <span className="font-light">Early</span><span className="font-bold">Edge</span>
            </a>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-dark-foreground/60 hover:text-dark-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-dark-foreground/60 hover:text-dark-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-dark-foreground/60 hover:text-dark-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
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
                    <a
                      href={link.href}
                      className="text-sm text-dark-foreground/60 hover:text-dark-foreground transition-colors font-sans font-light"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-dark-foreground/10">
          <p className="text-sm text-dark-foreground/40 font-sans font-light">
            © 2025 EarlyEdge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
