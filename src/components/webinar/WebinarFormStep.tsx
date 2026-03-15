import { cn } from "@/lib/utils";

interface WebinarFormStepProps {
  children: React.ReactNode;
  isActive: boolean;
  direction: "forward" | "backward";
}

export function WebinarFormStep({
  children,
  isActive,
  direction,
}: WebinarFormStepProps) {
  if (!isActive) return null;

  return (
    <div
      className={cn(
        "w-full animate-in fade-in duration-500",
        direction === "forward"
          ? "slide-in-from-bottom-4"
          : "slide-in-from-top-4",
      )}
      style={{
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
