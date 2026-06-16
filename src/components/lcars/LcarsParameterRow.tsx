import type React from "react";

interface LcarsParameterRowProps {
  label: string;
  value: string | number;
  labelColor?: string;
  valueColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsParameterRow: React.FC<LcarsParameterRowProps> = ({
  label,
  value,
  labelColor = "gray",
  valueColor = "cyan-bright",
  className = "",
  style,
}) => {
  return (
    <div
      className={`lcars-parameter-row ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "32px",
        gap: "6px",
        ...style,
      }}
    >
      <div
        className={`lcars-param-label color-${labelColor} type-module-label`}
        style={{
          flex: 1,
          padding: "6px 14px",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>
      <div
        className={`lcars-param-value color-${valueColor} type-numeric`}
        style={{
          padding: "6px 16px",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "80px",
          textAlign: "center",
          fontSize: "0.85rem",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
};
