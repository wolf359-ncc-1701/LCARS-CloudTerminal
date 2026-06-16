import type React from "react";

interface LcarsSegmentStackProps {
  segments: Array<{
    height?: number | string;
    color?: string;
    label?: string;
    value?: string | number;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsSegmentStack: React.FC<LcarsSegmentStackProps> = ({
  segments,
  className = "",
  style,
}) => {
  return (
    <div className={`lcars-segment-stack ${className}`} style={{ display: "flex", flexDirection: "column", gap: "4px", ...style }}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`lcars-segment-stack-item color-${seg.color || "gray"}`}
          style={{
            height: seg.height || "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            fontFamily: "var(--font-lcars)",
            textTransform: "uppercase",
          }}
        >
          {seg.label && <span>{seg.label}</span>}
          {seg.value && <span style={{ opacity: 0.85 }}>{seg.value}</span>}
        </div>
      ))}
    </div>
  );
};
