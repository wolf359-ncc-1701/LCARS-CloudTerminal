import type React from "react";

interface LcarsBarProps {
  color?: string; // e.g. "gray-dark", "cyan", "orange", etc.
  direction?: "horizontal" | "vertical";
  cap?: "left" | "right" | "both" | "none";
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LcarsBar: React.FC<LcarsBarProps> = ({
  color = "gray",
  direction = "horizontal",
  cap = "none",
  label,
  className = "",
  style,
  children,
}) => {
  const classes = [
    "lcars-bar",
    `direction-${direction}`,
    `cap-${cap}`,
    `color-${color}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style}>
      {label && <span className="lcars-bar-label">{label}</span>}
      {children}
    </div>
  );
};
