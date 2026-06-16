import type React from "react";
import { LcarsElement } from "./LcarsElement";

interface LcarsCapsuleProps {
  color?: string;
  onClick?: (e: React.MouseEvent) => void;
  beepType?: "soft" | "confirm" | "alert" | "action" | "transition" | "archive" | "none";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LcarsCapsule: React.FC<LcarsCapsuleProps> = ({
  color = "gray",
  onClick,
  beepType = "soft",
  className = "",
  style,
  children,
}) => {
  return (
    <LcarsElement
      color={color}
      onClick={onClick}
      beepType={onClick ? beepType : "none"}
      className={`lcars-capsule-element ${className}`}
      style={{
        borderRadius: "22px",
        padding: "0 18px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "36px",
        ...style,
      }}
    >
      {children}
    </LcarsElement>
  );
};
