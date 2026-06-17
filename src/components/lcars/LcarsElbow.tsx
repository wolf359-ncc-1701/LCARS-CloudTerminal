import React, { useLayoutEffect, useRef, useState } from "react";

interface LcarsElbowProps {
  direction?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string; // e.g. "gray", "cyan", "orange"
  width?: number;
  height?: number;
  railWidth?: number;
  barHeight?: number;
  outerRadius?: number;
  innerRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LcarsElbow: React.FC<LcarsElbowProps> = ({
  direction = "top-left",
  color = "gray",
  width: initialWidth = 120,
  height = 80,
  railWidth = 34,
  barHeight = 30,
  outerRadius = 36,
  innerRadius,
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const measuredWidth = entry.contentRect.width;
        if (measuredWidth > 0) {
          setWidth(measuredWidth);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate SVG Path based on parameters
  const getPath = () => {
    const w = width;
    const h = height;
    const bh = barHeight;
    const r = outerRadius;

    const ri = innerRadius !== undefined ? innerRadius : Math.max(0, r - railWidth);

    let rw = railWidth;
    let adjustedRi = ri;
    if (rw + adjustedRi > w) {
      rw = Math.min(railWidth, w * 0.6);
      adjustedRi = Math.min(ri, w - rw - 10);
      if (adjustedRi < 0) adjustedRi = 0;
    }

    switch (direction) {
      case "top-left":
        return `M 0,${h} L 0,${r} A ${r},${r} 0 0 1 ${r},0 L ${w},0 L ${w},${bh} L ${rw + adjustedRi},${bh} A ${adjustedRi},${adjustedRi} 0 0 0 ${rw},${bh + adjustedRi} L ${rw},${h} Z`;
      case "top-right":
        return `M 0,0 L ${w - r},0 A ${r},${r} 0 0 1 ${w},${r} L ${w},${h} L ${w - rw},${h} L ${w - rw},${bh + adjustedRi} A ${adjustedRi},${adjustedRi} 0 0 0 ${w - rw - adjustedRi},${bh} L 0,${bh} Z`;
      case "bottom-left":
        return `M ${rw},0 L ${rw},${h - bh - adjustedRi} A ${adjustedRi},${adjustedRi} 0 0 0 ${rw + adjustedRi},${h - bh} L ${w},${h - bh} L ${w},${h} L ${r},${h} A ${r},${r} 0 0 1 0,${h - r} L 0,0 Z`;
      case "bottom-right":
        return `M 0,${h - bh} L ${w - rw - adjustedRi},${h - bh} A ${adjustedRi},${adjustedRi} 0 0 0 ${w - rw},${h - bh - adjustedRi} L ${w - rw},0 L ${w},0 L ${w},${h - r} A ${r},${r} 0 0 1 ${w - r},${h} L 0,${h} Z`;
    }
  };

  const cssColor = `var(--${color})`;
  const classes = [`lcars-elbow-container`, `elbow-${direction}`, className].join(" ");

  return (
    <div
      ref={containerRef}
      className={classes}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: initialWidth,
        height,
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <path d={getPath()} fill={cssColor} />
      </svg>
      {children && (
        <div
          className="elbow-overlay"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
