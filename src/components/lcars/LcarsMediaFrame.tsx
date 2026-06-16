import type React from "react";

interface LcarsMediaFrameProps {
  title?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LcarsMediaFrame: React.FC<LcarsMediaFrameProps> = ({
  title,
  color = "cyan",
  className = "",
  style,
  children,
}) => {
  return (
    <div
      className={`lcars-media-frame ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid var(--gray-dark)",
        borderRadius: "36px 0 0 0",
        padding: "8px",
        background: "#000",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <div
          className={`color-${color} type-module-label`}
          style={{
            height: "24px",
            width: "120px",
            borderTopLeftRadius: "28px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "24px",
            fontSize: "0.75rem",
            color: "#000",
          }}
        >
          {title || "MEDIA 310"}
        </div>
        <div className={`color-${color}`} style={{ height: "4px", flex: 1, opacity: 0.8 }} />
      </div>
      <div
        className="lcars-media-content"
        style={{
          flex: 1,
          background: "#05070a",
          border: "1.5px dashed var(--gray-dark)",
          position: "relative",
          overflow: "auto",
          padding: "12px",
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
