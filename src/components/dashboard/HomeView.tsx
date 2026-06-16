import React from "react";
import { rooms } from "../../data/mock";
import { LcarsMeter, LcarsBracket, LcarsFrame } from "../lcars";

interface HomeViewProps {
  telemetry: number[];
}

export const HomeView: React.FC<HomeViewProps> = ({ telemetry }) => {
  return (
    <div className="view panel-enter" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%", position: "relative" }}>
      {/* Decorative coordinate marks */}
      <LcarsFrame.Cross x="6px" y="6px" size={10} color="gray-light" />
      <LcarsFrame.Cross x="calc(100% - 16px)" y="6px" size={10} color="gray-light" />

      {/* Grid of rooms */}
      <div className="room-grid" style={{ flex: 1 }}>
        {rooms.map((room, index) => {
          const motionValue = room.motion ? (telemetry[index + 3] ?? 12) : 8;
          const statusColor = room.status === "active" ? "cyan-bright" : room.status === "standby" ? "orange-light" : "gray";
          const tempVal = room.temperature;
          const humVal = room.humidity;

          return (
            <LcarsBracket key={room.id} title={`DECK-0${room.deck}`} color={statusColor}>
              <article className="room-card-content" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "8px 0", height: "100%" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{room.name}</strong>
                  <span style={{ fontSize: "0.68rem", color: `var(--${statusColor})` }}>NOMINAL-0{index + 1}</span>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" }}>
                  {/* Circular Dial for Light Level */}
                  <div style={{ position: "relative", justifySelf: "center", width: "100px", height: "100px" }}>
                    <div
                      className="room-ring"
                      style={{
                        "--value": `${room.light}%`,
                        width: "86px",
                        height: "86px",
                        fontSize: "1.34rem",
                      } as React.CSSProperties}
                    >
                      {room.light}%
                    </div>
                    <span style={{ position: "absolute", bottom: "-2px", left: "0", right: "0", textAlign: "center", fontSize: "0.65rem", color: "var(--gray-light)", letterSpacing: "0.5px" }}>
                      LIGHT SENSOR
                    </span>
                  </div>

                  {/* Micro SVG sparkline graph for Temp/Hum */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--gray-white)" }}>
                      <span style={{ color: "var(--orange-light)", fontWeight: "bold" }}>{tempVal.toFixed(1)}°C</span>
                      <span style={{ color: "var(--gray)", margin: "0 4px" }}>/</span>
                      <span style={{ color: "var(--cyan-light)", fontWeight: "bold" }}>{humVal}% RH</span>
                    </div>

                    {/* Sparkline line graph */}
                    <svg width="100" height="28" style={{ background: "var(--panel)", border: "1px solid var(--gray-dark)" }}>
                      <path
                        d={`M 0,${28 - (telemetry[index + 2] / 4)} L 20,${28 - (telemetry[index + 4] / 4)} L 40,${28 - (telemetry[index + 6] / 4)} L 60,${28 - (telemetry[index + 8] / 4)} L 80,${28 - (telemetry[index + 10] / 4)} L 100,${28 - (telemetry[index + 12] / 4)}`}
                        fill="none"
                        stroke={`var(--${statusColor})`}
                        strokeWidth="1.5"
                      />
                      <path
                        d={`M 0,28 L 0,${28 - (telemetry[index + 2] / 4)} L 20,${28 - (telemetry[index + 4] / 4)} L 40,${28 - (telemetry[index + 6] / 4)} L 60,${28 - (telemetry[index + 8] / 4)} L 80,${28 - (telemetry[index + 10] / 4)} L 100,${28 - (telemetry[index + 12] / 4)} L 100,28 Z`}
                        fill={`var(--${statusColor})`}
                        opacity="0.12"
                      />
                    </svg>
                    <span style={{ fontSize: "0.6rem", color: "var(--gray-light)" }}>TEMP-LOG CH-0{index + 1}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                  <LcarsMeter label="LUMEN" value={room.light} color={statusColor} />
                  <LcarsMeter label="MOTION" value={motionValue} color={statusColor} danger={room.motion && motionValue > 70} />
                </div>
              </article>
            </LcarsBracket>
          );
        })}
      </div>
    </div>
  );
};
