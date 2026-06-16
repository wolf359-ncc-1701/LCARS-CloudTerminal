import type React from "react";

interface LcarsStatusDotsProps {
  count?: number;
  color?: string; // defaults to gray-lighter, can override
  className?: string;
  style?: React.CSSProperties;
}

export const LcarsStatusDots: React.FC<LcarsStatusDotsProps> = ({
  count = 12,
  color,
  className = "",
  style,
}) => {
  return (
    <div className={`lcars-status-dots ${className}`} style={style} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => {
        // Create slightly varying animation delays for a more natural mock-processing feel
        const delay = `${(index * -0.23).toFixed(2)}s`;
        const itemColor = color
          ? `var(--${color})`
          : index % 3 === 0
            ? "var(--gray)"
            : index % 5 === 0
              ? "var(--gray-white)"
              : "var(--gray-lighter)";

        return (
          <span
            key={index}
            style={{
              animationDelay: delay,
              background: itemColor,
            }}
          />
        );
      })}
    </div>
  );
};
