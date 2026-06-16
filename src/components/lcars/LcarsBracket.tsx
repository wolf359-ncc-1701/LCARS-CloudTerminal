import type React from "react";

interface LcarsBracketProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  color?: string; // e.g. "cyan", "gray", "orange"
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const LcarsBracket: React.FC<LcarsBracketProps> = ({
  title,
  footer,
  color = "cyan",
  className = "",
  style,
  children,
}) => {
  const cssColor = `var(--${color})`;
  const classes = [`lcars-bracket`, `color-${color}`, className].join(" ");

  return (
    <div className={classes} style={{ ...style, borderColor: cssColor } as React.CSSProperties}>
      {(title !== undefined) && (
        <div className="lcars-bracket-header">
          <span className="lcars-bracket-tick top-left" style={{ background: cssColor }} />
          {typeof title === "string" ? (
            <span className="lcars-bracket-title" style={{ color: cssColor }}>{title}</span>
          ) : (
            title
          )}
          <span className="lcars-bracket-tick top-right" style={{ background: cssColor }} />
        </div>
      )}
      <div className="lcars-bracket-content">{children}</div>
      {(footer !== undefined) && (
        <div className="lcars-bracket-footer">
          <span className="lcars-bracket-tick bottom-left" style={{ background: cssColor }} />
          {typeof footer === "string" ? (
            <span className="lcars-bracket-footer-text" style={{ color: cssColor }}>{footer}</span>
          ) : (
            footer
          )}
          <span className="lcars-bracket-tick bottom-right" style={{ background: cssColor }} />
        </div>
      )}
    </div>
  );
};
