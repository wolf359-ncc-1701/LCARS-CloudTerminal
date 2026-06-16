import type React from "react";
import { LcarsElement } from "./LcarsElement";

interface LcarsOverlayProps {
  title: string;
  onClose: () => void;
  color?: string; // defaults to "cyan"
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LcarsOverlay: React.FC<LcarsOverlayProps> = ({
  title,
  onClose,
  color = "cyan",
  className = "",
  style,
  children,
}) => {
  const cssColor = `var(--${color})`;

  return (
    <div
      className={`lcars-overlay-backdrop ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        // Close on clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="lcars-overlay-panel"
        style={{ ...style, borderColor: cssColor } as React.CSSProperties}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2>{title}</h2>
          <LcarsElement
            color="orange-light"
            onClick={onClose}
            beepType="confirm"
            style={{
              minHeight: "34px",
              padding: "0 18px",
              fontWeight: 800,
              fontSize: "0.85rem",
              borderRadius: "4px",
            }}
          >
            Close
          </LcarsElement>
        </header>
        <div className="lcars-overlay-body">{children}</div>
      </section>
    </div>
  );
};
