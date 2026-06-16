import React from "react";
import { LcarsMeter, LcarsBracket, LcarsFrame, LcarsBar } from "../lcars";

interface EnergyViewProps {
  telemetry: number[];
}

export const EnergyView: React.FC<EnergyViewProps> = ({ telemetry }) => {
  const loads = ["LIGHTING", "CLIMATE", "MEDIA", "STANDBY", "AUX"];

  return (
    <div className="view energy-view panel-enter">
      {/* Decorative coordinate cross */}
      <LcarsFrame.Cross x="4px" y="4px" size={10} color="gray-light" />
      
      {/* Warp core / EPS Reactor Core */}
      <LcarsBracket title="PRIMARY EPS INDUCTION CORE" color="orange">
        <div style={{ position: "relative", height: "100%", minHeight: "340px", display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
          
          {/* Reactor metrics readout overlay */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--orange-light)" }}>
            <span>EPS-CONTR: LOCK</span>
            <span>FREQ: 60.01 HZ</span>
          </div>

          <div style={{ display: "flex", gap: "14px", flex: 1, minHeight: 0 }}>
            {/* Warp core simulated container */}
            <div className="warp-core" style={{ flex: 1, position: "relative" }}>
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} style={{ animationDelay: `${index * -0.12}s`, height: "14px" }} />
              ))}
            </div>

            {/* Diagnostic parameters stack next to reactor */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "90px", fontSize: "0.68rem", color: "var(--gray-lighter)" }}>
              <div>
                <span style={{ color: "var(--orange-light)" }}>THERMAL IND.</span>
                <LcarsMeter value={telemetry[18] ?? 60} showValue={false} color="orange" style={{ height: "8px", marginTop: "4px" }} />
              </div>
              <div>
                <span style={{ color: "var(--cyan-light)" }}>MAG FIELD</span>
                <LcarsMeter value={telemetry[19] ?? 80} showValue={false} color="cyan" style={{ height: "8px", marginTop: "4px" }} />
              </div>
              <div>
                <span style={{ color: "var(--gray-white)" }}>CORE CHARGE</span>
                <LcarsMeter value={telemetry[20] ?? 92} showValue={false} color="gray-white" style={{ height: "8px", marginTop: "4px" }} />
              </div>
              <LcarsFrame.TickBar count={5} color="orange" style={{ alignSelf: "center", marginTop: "8px" }} />
            </div>
          </div>

          <LcarsFrame.Ruler ticks={25} color="orange-dark" style={{ marginTop: "4px" }} />
        </div>
      </LcarsBracket>

      {/* EPS Grid Load Distribution */}
      <LcarsBracket title="GRID DISTRIBUTIVE INJECTORS" color="cyan">
        <div className="energy-board" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px", padding: "6px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", color: "var(--cyan-light)", marginBottom: "-10px" }}>
            <span>DISTRIBUTION MATRIX</span>
            <span>BUS CORE: NCC-01</span>
          </div>

          {loads.map((label, index) => {
            const loadVal = telemetry[index + 8] ?? 30;
            const code = `EPS-CH-${index * 12 + 10}A`;

            return (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--gray-light)" }}>
                  <span style={{ color: "var(--gray-white)", fontWeight: "bold" }}>{code}</span>
                  <LcarsFrame.TickBar count={4} color={index === 1 ? "orange" : "cyan-light"} />
                </div>
                <LcarsMeter
                  label={label}
                  value={loadVal}
                  color="cyan"
                  danger={index === 1 || loadVal > 80}
                />
              </div>
            );
          })}
          
          <div style={{ display: "flex", gap: "4px", height: "6px", overflow: "hidden", marginTop: "6px" }}>
            <LcarsBar color="cyan" style={{ flex: 4 }} />
            <LcarsBar color="gray" style={{ flex: 1 }} />
            <LcarsBar color="orange" style={{ flex: 2 }} />
          </div>
        </div>
      </LcarsBracket>
    </div>
  );
};
