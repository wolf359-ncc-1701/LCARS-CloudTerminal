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
      
      {/* Power Distribution Diagram */}
      <LcarsBracket title="PRIMARY EPS INDUCTION CORE" color="orange">
        <div style={{ position: "relative", height: "100%", minHeight: "340px", display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
          
          <div className="type-micro-code" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--orange-light)" }}>
            <span>EPS-CONTR: NOMINAL GATE</span>
            <span>FREQ: 60.01 HZ BUS</span>
          </div>

          <div style={{ display: "flex", gap: "14px", flex: 1, minHeight: 0 }}>
            {/* SVG Original Power Distribution Bus Diagram */}
            <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
              <svg
                viewBox="0 0 320 250"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#05070a",
                  border: "1.5px solid var(--gray-dark)",
                  borderRadius: "8px",
                  padding: "6px"
                }}
              >
                <defs>
                  <linearGradient id="bus-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="var(--orange-light)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Left: Capacitor Bank Stack (电容充能电轨组) */}
                <text x="10" y="16" fill="var(--gray-lighter)" fontSize="8" fontWeight="bold" fontFamily="var(--font-lcars)">CAPACITOR STACK</text>
                {Array.from({ length: 8 }).map((_, i) => {
                  const capLoad = (telemetry[18] ?? 60) - i * 8;
                  const isCharged = capLoad > 0;
                  return (
                    <g key={i}>
                      <rect
                        x="10"
                        y={26 + i * 25}
                        width="36"
                        height="14"
                        rx="2"
                        fill={isCharged ? (i % 2 === 0 ? "var(--orange-light)" : "var(--orange)") : "var(--gray-dark)"}
                        opacity={isCharged ? 0.9 : 0.3}
                        style={{ animation: isCharged ? "blink-soft 3.2s ease infinite" : "none", animationDelay: `${i * -0.15}s` }}
                      />
                      <text x="15" y={35 + i * 25} fill="#000" fontSize="7" fontWeight="bold" fontFamily="var(--font-lcars)">CAP-0{i+1}</text>
                    </g>
                  );
                })}

                {/* Center Main EPS Power Bus (发光脉冲主配电电轨) */}
                <line x1="72" y1="28" x2="72" y2="225" stroke="var(--gray)" strokeWidth="6" strokeLinecap="round" />
                <line x1="72" y1="28" x2="72" y2="225" stroke="url(#bus-glow)" strokeWidth="3" strokeLinecap="round" strokeDasharray="5, 10" className="bus-flow-pulse" />
                <text x="72" y="240" fill="var(--orange-light)" fontSize="8" fontWeight="bold" fontFamily="var(--font-lcars)" textAnchor="middle">EPS BUS</text>

                {/* Grid Load Distribution paths */}
                {loads.map((loadName, idx) => {
                  const yPos = 38 + idx * 40;
                  const val = telemetry[idx + 8] ?? 30;
                  const isOverload = val > 75;
                  const pathColor = isOverload ? "var(--orange)" : "var(--cyan-bright)";

                  return (
                    <g key={loadName}>
                      {/* Connection rail lines */}
                      <line x1="72" y1={yPos} x2="132" y2={yPos} stroke={pathColor} strokeWidth="2.5" />
                      <line
                        x1="72"
                        y1={yPos}
                        x2="132"
                        y2={yPos}
                        stroke="#fff"
                        strokeWidth="1.2"
                        strokeDasharray="4, 8"
                        className="branch-pulse"
                        style={{ animationDuration: `${2.2 - (val / 100) * 1.7}s` }}
                      />

                      {/* Breaker switch card node (负载门断路开关) */}
                      <rect
                        x="132"
                        y={yPos - 5}
                        width="16"
                        height="10"
                        rx="1.5"
                        fill={isOverload ? "var(--orange-dark)" : "var(--success)"}
                      />
                      <text x="140" y={yPos + 3} fill="#000" fontSize="6.5" fontWeight="bold" fontFamily="var(--font-lcars)" textAnchor="middle">
                        {isOverload ? "ERR" : "ON"}
                      </text>

                      {/* Output rails to branch */}
                      <line x1="148" y1={yPos} x2="205" y2={yPos} stroke={pathColor} strokeWidth="2.5" />
                      <line
                        x1="148"
                        y1={yPos}
                        x2="205"
                        y2={yPos}
                        stroke="#fff"
                        strokeWidth="1.2"
                        strokeDasharray="4, 8"
                        className="branch-pulse"
                        style={{ animationDuration: `${2.2 - (val / 100) * 1.7}s` }}
                      />

                      {/* Distribution Port Labels */}
                      <rect x="205" y={yPos - 8} width="105" height="16" rx="2" fill="var(--panel)" stroke="var(--gray-dark)" strokeWidth="1" />
                      <text x="210" y={yPos + 3} fill={pathColor} fontSize="7.5" fontWeight="bold" fontFamily="var(--font-lcars)">{loadName}</text>
                      <text x="305" y={yPos + 3} fill="var(--gray-white)" fontSize="7.5" fontWeight="bold" fontFamily="var(--font-lcars)" textAnchor="end">{val}%</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Diagnostic parameters stack next to reactor */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "90px", fontSize: "0.68rem", color: "var(--gray-lighter)" }}>
              <div>
                <span className="type-micro-code" style={{ color: "var(--orange-light)", display: "block" }}>THERMAL IND.</span>
                <LcarsMeter value={telemetry[18] ?? 60} showValue={false} color="orange" style={{ height: "8px", marginTop: "4px" }} />
              </div>
              <div>
                <span className="type-micro-code" style={{ color: "var(--cyan-light)", display: "block" }}>MAG FIELD</span>
                <LcarsMeter value={telemetry[19] ?? 80} showValue={false} color="cyan" style={{ height: "8px", marginTop: "4px" }} />
              </div>
              <div>
                <span className="type-micro-code" style={{ color: "var(--gray-white)", display: "block" }}>CORE CHARGE</span>
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
          <div className="type-micro-code" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", color: "var(--cyan-light)", marginBottom: "-10px" }}>
            <span>DISTRIBUTION MATRIX</span>
            <span>BUS CORE: NCC-01</span>
          </div>

          {loads.map((label, index) => {
            const loadVal = telemetry[index + 8] ?? 30;
            const code = `EPS-CH-${index * 12 + 10}A`;

            return (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--gray-light)" }}>
                  <span className="type-numeric" style={{ color: "var(--gray-white)", fontWeight: "bold" }}>{code}</span>
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
