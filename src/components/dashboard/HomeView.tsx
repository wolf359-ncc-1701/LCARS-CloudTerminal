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
          const displayName = room.name === "SLEEP QUARTERS" ? "SLEEP QTRS" : room.name;

          return (
            <LcarsBracket key={room.id} title={`DECK-0${room.deck}`} color={statusColor}>
              <article className="room-card-content" data-surface={statusColor === "gray" ? "dark" : "bright"}>
                <header className="room-card-header">
                  <strong className="room-card-title">{displayName}</strong>
                  <span className="room-card-code" style={{ color: `var(--${statusColor})` }}>NOMINAL-0{index + 1}</span>
                </header>

                <div className="room-card-body">
                  {/* Circular Dial for Light Level */}
                  <div className="room-card-dial-container">
                    <div
                      className="room-ring"
                      style={{
                        "--value": `${room.light}%`,
                      } as React.CSSProperties}
                    >
                      {room.light}%
                    </div>
                    <span className="room-card-sensor-label">
                      LIGHT SENSOR
                    </span>
                  </div>

                  {/* Micro SVG sparkline graph for Temp/Hum */}
                  <div className="room-card-sparkline-container">
                    <div className="room-card-climate">
                      <span className="room-card-temp">{tempVal.toFixed(1)} C</span>
                      <span className="room-card-climate-divider">/</span>
                      <span className="room-card-humidity">{humVal}% RH</span>
                    </div>

                    {/* Sparkline line graph */}
                    <svg width="100" height="28" className="room-card-sparkline-svg">
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
                    <span className="room-card-sparkline-label">TEMP-LOG CH-0{index + 1}</span>
                  </div>
                </div>

                <div className="room-card-meters">
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
