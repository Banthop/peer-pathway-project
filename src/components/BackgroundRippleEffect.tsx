import { useState, useMemo, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  borderColor?: string;
  fillColor?: string;
  shadowColor?: string;
  opacity?: number;
  hoverOpacity?: number;
  animationDuration?: number;
  animationDelay?: number;
  showShadow?: boolean;
  interactive?: boolean;
  shapeType?: "square" | "circle" | "triangle" | "hexagon";
  className?: string;
}

const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
  borderColor = "#E5E5E5",
  fillColor = "#F5F5F5",
  shadowColor = "#CCCCCC",
  opacity = 40,
  hoverOpacity = 80,
  animationDuration = 200,
  animationDelay = 55,
  showShadow = true,
  interactive = true,
  shapeType = "square",
  className,
}: BackgroundRippleEffectProps) => {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "100px" });

  // Optimize for large grids
  const maxCells = 1000;
  const totalCells = rows * cols;
  const shouldVirtualize = totalCells > maxCells;
  const actualRows = shouldVirtualize ? Math.min(rows, Math.floor(maxCells / cols)) : rows;
  const actualCols = shouldVirtualize ? Math.min(cols, Math.floor(maxCells / rows)) : cols;

  const cells = useMemo(
    () => Array.from({ length: actualRows * actualCols }, (_, idx) => idx),
    [actualRows, actualCols]
  );

  const handleCellClick = useCallback(
    (rowIdx: number, colIdx: number) => {
      if (!interactive) return;
      setClickedCell({ row: rowIdx, col: colIdx });
      setRippleKey((k) => k + 1);
    },
    [interactive]
  );

  const getShapeStyles = (shape: string) => {
    const baseSize = cellSize - 2;
    switch (shape) {
      case "circle":
        return { borderRadius: "50%", width: baseSize, height: baseSize };
      case "triangle":
        return {
          width: 0,
          height: 0,
          borderLeft: `${baseSize / 2}px solid transparent`,
          borderRight: `${baseSize / 2}px solid transparent`,
          borderBottom: `${baseSize}px solid ${fillColor}`,
          background: "transparent",
        };
      case "hexagon":
        return {
          width: baseSize,
          height: baseSize * 0.577,
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        };
      default:
        return { width: baseSize, height: baseSize };
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${actualCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${actualRows}, ${cellSize}px)`,
          width: actualCols * cellSize,
          height: actualRows * cellSize,
          willChange: "transform",
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        {cells.map((_, idx) => {
          const rowIdx = Math.floor(idx / actualCols);
          const colIdx = idx % actualCols;

          // Calculate ripple delay based on distance from clicked cell
          let delay = 0;
          if (clickedCell) {
            const distance = Math.hypot(
              rowIdx - clickedCell.row,
              colIdx - clickedCell.col
            );
            delay = distance * animationDelay;
          }

          const shapeStyles = getShapeStyles(shapeType);

          return (
            <motion.div
              key={`${idx}-${rippleKey}`}
              onClick={() => handleCellClick(rowIdx, colIdx)}
              initial={{ scale: 1, opacity: opacity / 100 }}
              animate={
                clickedCell && isInView
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [opacity / 100, hoverOpacity / 100, opacity / 100],
                    }
                  : { scale: 1, opacity: opacity / 100 }
              }
              transition={{
                duration: animationDuration / 1000,
                delay: delay / 1000,
                ease: "easeOut",
              }}
              whileHover={interactive ? { opacity: hoverOpacity / 100, scale: 1.1 } : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: interactive ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  ...shapeStyles,
                  backgroundColor: shapeType !== "triangle" ? fillColor : undefined,
                  border: shapeType !== "triangle" ? `1px solid ${borderColor}` : undefined,
                  boxShadow: showShadow ? `2px 2px 4px ${shadowColor}` : undefined,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BackgroundRippleEffect;
