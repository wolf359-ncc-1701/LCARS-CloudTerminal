import React from "react";

interface TelemetryStackProps {
  telemetry: number[];
}

export const TelemetryStack: React.FC<TelemetryStackProps> = ({ telemetry }) => {
  const labels = ["ODN", "EPS", "SIF", "LIFE", "AI", "MUX"];

  return (
    <div className="telemetry-stack">
      {labels.map((label, index) => {
        const val = telemetry[index + 10] ?? 50;
        return (
          <div key={label} className="telemetry-row">
            <span>{label}</span>
            <div className="telemetry-bar-bg">
              <i style={{ width: `${val}%`, background: index % 2 === 0 ? "var(--cyan-light)" : "var(--orange-dark)" }} />
            </div>
            <em>{val}</em>
          </div>
        );
      })}
    </div>
  );
};
