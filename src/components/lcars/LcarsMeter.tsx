import type React from "react";

interface LcarsMeterProps {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  direction?: "horizontal" | "vertical";
  color?: string; // e.g. "cyan", "orange", "gray"
  danger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsMeter: React.FC<LcarsMeterProps> = ({
  value,
  label,
  showValue = true,
  direction = "horizontal",
  color = "cyan",
  danger = false,
  className = "",
  style,
}) => {
  const activeColor = danger ? "orange-dark" : color;
  const classes = [
    "lcars-meter",
    `direction-${direction}`,
    danger ? "state-danger" : "",
    className,
  ].filter(Boolean).join(" ");

  if (direction === "vertical") {
    return (
      <div className={classes} style={style} title={label ? `${label}: ${value}%` : undefined}>
        {label && <span className="meter-label">{label}</span>}
        <div className="meter-track-v">
          <span
            className="meter-fill-v"
            style={{
              height: `${Math.min(100, Math.max(0, value))}%`,
              background: danger ? "var(--orange-dark)" : `var(--${color})`,
            }}
          />
        </div>
        {showValue && <em className="meter-value-v">{value}</em>}
      </div>
    );
  }

  // Horizontal meter
  return (
    <div className={classes} style={style}>
      {label && <strong className="meter-label-h">{label}</strong>}
      <div className="meter-track-h">
        <span
          className="meter-fill-h"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: danger ? "var(--orange-dark)" : `var(--${color})`,
          }}
        />
      </div>
      {showValue && <em className="meter-value-h">{value}</em>}
    </div>
  );
};
