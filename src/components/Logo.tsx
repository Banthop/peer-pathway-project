import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  to?: string;
  className?: string;
}

export function Logo({ to = "/", className }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        "text-[22px] tracking-tight text-foreground",
        className
      )}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <span style={{ fontWeight: 300 }}>Early</span>
      <span style={{ fontWeight: 700 }}>Edge</span>
    </Link>
  );
}
