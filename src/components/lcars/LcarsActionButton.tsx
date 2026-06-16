import type React from "react";
import { LcarsElement } from "./LcarsElement";

interface LcarsActionButtonProps {
  label: string;
  subLabel?: string;
  color?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  beepType?: "soft" | "confirm" | "alert" | "action" | "transition" | "archive" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsActionButton: React.FC<LcarsActionButtonProps> = ({
  label,
  subLabel,
  color = "gray-dark",
  active = false,
  disabled = false,
  onClick,
  beepType = "soft",
  className = "",
  style,
}) => {
  return (
    <LcarsElement
      color={color}
      active={active}
      disabled={disabled}
      onClick={onClick}
      beepType={beepType}
      className={`lcars-action-button-element ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "8px 16px 8px 18px",
        borderRadius: "16px",
        borderLeft: "6px solid var(--orange)",
        minHeight: "50px",
        textAlign: "left",
        width: "100%",
        ...style,
      }}
    >
      <div className="type-module-label" style={{ fontSize: "0.85rem", color: active ? "#000" : "inherit" }}>
        {label}
      </div>
      {subLabel && (
        <div className="type-micro-code" style={{ fontSize: "0.68rem", opacity: 0.75, marginTop: "2px", color: active ? "#000" : "inherit" }}>
          {subLabel}
        </div>
      )}
    </LcarsElement>
  );
};
