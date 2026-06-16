import React from "react";
import { LcarsMeter, LcarsBracket } from "../lcars";

interface EnergyViewProps {
  telemetry: number[];
}

export const EnergyView: React.FC<EnergyViewProps> = ({ telemetry }) => {
  const loads = ["LIGHTING", "CLIMATE", "MEDIA", "STANDBY", "AUX"];

  return (
    <div className="view energy-view panel-enter">
      {/* Warp core simulated power distribution */}
      <LcarsBracket title="PRIMARY POWER REACTOR" color="orange">
        <div style={{ position: "relative", height: "100%", minHeight: "340px", display: "flex", flexDirection: "column" }}>
          <div className="warp-core" style={{ flex: 1 }}>
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} style={{ animationDelay: `${index * -0.12}s` }} />
            ))}
          </div>
        </div>
      </LcarsBracket>

      {/* Grid Load Distribution */}
      <LcarsBracket title="EPS LOAD ROUTING INDEX" color="cyan">
        <div className="energy-board" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "28px", padding: "10px 0" }}>
          {loads.map((label, index) => {
            const loadVal = telemetry[index + 8] ?? 30;
            return (
              <LcarsMeter
                key={label}
                label={label}
                value={loadVal}
                color="cyan"
                danger={index === 1 || loadVal > 80}
              />
            );
          })}
        </div>
      </LcarsBracket>
    </div>
  );
};
