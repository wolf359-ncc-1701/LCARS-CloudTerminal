import type React from "react";

interface LcarsReadoutProps {
  label: string;
  value: React.ReactNode;
  subLabel?: React.ReactNode;
  color?: string; // defaults to "cyan"
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsReadout: React.FC<LcarsReadoutProps> = ({
  label,
  value,
  subLabel,
  color = "cyan",
  className = "",
  style,
}) => {
  const cssColor = `var(--${color})`;

  return (
    <div
      className={`lcars-readout ${className}`}
      style={{ ...style, borderLeftColor: cssColor } as React.CSSProperties}
    >
      <span className="readout-label" style={{ color: `var(--gray-lighter)` }}>
        {label}
      </span>
      <strong className="readout-value">{value}</strong>
      {subLabel && <em className="readout-sub-label">{subLabel}</em>}
    </div>
  );
};
