import { cn } from "@/lib/utils";

interface RippleEffectProps {
  className?: string;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

const RippleEffect = ({
  className,
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
}: RippleEffectProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;

        return (
          <div
            key={i}
            className="animate-ripple absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 shadow-xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.max(opacity, 0),
              animationDelay,
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "hsl(var(--foreground) / 0.1)",
            }}
          />
        );
      })}
    </div>
  );
};

export default RippleEffect;
