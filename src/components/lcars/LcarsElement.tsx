import type React from "react";
import { useLcars } from "./LcarsContext";

interface LcarsElementProps {
  color?: string; // e.g. "gray", "cyan", "orange", "success"
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  beepType?: "soft" | "confirm" | "alert" | "none";
  children?: React.ReactNode;
}

export const LcarsElement: React.FC<LcarsElementProps> = ({
  color = "gray",
  active = false,
  disabled = false,
  onClick,
  className = "",
  style,
  beepType = "soft",
  children,
}) => {
  const { beep } = useLcars();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (beepType !== "none") {
      beep(beepType);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const classes = [
    "lcars-element",
    `color-${color}`,
    active ? "state-active" : "",
    disabled ? "state-disabled" : "",
    onClick ? "element-clickable" : "element-static",
    className,
  ].filter(Boolean).join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        style={style}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};
