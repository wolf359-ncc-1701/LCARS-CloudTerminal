import React from "react";

interface LcarsFrameProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsFrame: React.FC<LcarsFrameProps> & {
  Cross: React.FC<CrossProps>;
  Ruler: React.FC<RulerProps>;
  TickBar: React.FC<TickBarProps>;
} = ({ children, className = "", style }) => {
  return (
    <div className={`lcars-frame ${className}`} style={style}>
      {children}
    </div>
  );
};

interface CrossProps {
  x?: number | string;
  y?: number | string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Cross: React.FC<CrossProps> = ({ x, y, size = 12, color = "gray", className = "", style }) => {
  const cssColor = `var(--${color})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`lcars-cross ${className}`}
      style={{
        position: (x !== undefined || y !== undefined) ? "absolute" : "relative",
        left: x,
        top: y,
        display: "block",
        pointerEvents: "none",
        ...style,
      }}
    >
      <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke={cssColor} strokeWidth="1.5" />
      <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={cssColor} strokeWidth="1.5" />
    </svg>
  );
};

interface RulerProps {
  direction?: "horizontal" | "vertical";
  ticks?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

const Ruler: React.FC<RulerProps> = ({ direction = "horizontal", ticks = 20, color = "gray", style, className = "" }) => {
  const cssColor = `var(--${color})`;
  return (
    <div
      className={`lcars-ruler direction-${direction} ${className}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: direction === "horizontal" ? "100%" : "8px",
        height: direction === "horizontal" ? "6px" : "100%",
        ...style,
      }}
    >
      {Array.from({ length: ticks }).map((_, idx) => (
        <span
          key={idx}
          className="ruler-tick"
          style={{
            display: "block",
            background: cssColor,
            width: direction === "horizontal" ? "1.5px" : "100%",
            height: direction === "horizontal" ? "100%" : "1.5px",
            opacity: idx % 5 === 0 ? 0.75 : 0.35,
          }}
        />
      ))}
    </div>
  );
};

interface TickBarProps {
  label?: string;
  count?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

const TickBar: React.FC<TickBarProps> = ({ label, count = 10, color = "cyan", style, className = "" }) => {
  return (
    <div className={`lcars-tick-bar ${className}`} style={{ display: "flex", alignItems: "center", gap: "6px", ...style }}>
      {label && <span className="tick-bar-label" style={{ fontSize: "0.7rem", color: `var(--${color})`, fontFamily: "var(--font-lcars)", fontWeight: "bold" }}>{label}</span>}
      <div className="ticks-container" style={{ display: "flex", gap: "2px" }}>
        {Array.from({ length: count }).map((_, idx) => (
          <span
            key={idx}
            className="tick-bar-dot"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: `var(--${color})`,
              opacity: idx % 3 === 0 ? 0.8 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

LcarsFrame.Cross = Cross;
LcarsFrame.Ruler = Ruler;
LcarsFrame.TickBar = TickBar;
