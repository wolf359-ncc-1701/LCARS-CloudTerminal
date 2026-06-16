import React from "react";
import { rooms } from "../../data/mock";
import { LcarsMeter, LcarsBracket } from "../lcars";

interface HomeViewProps {
  telemetry: number[];
}

export const HomeView: React.FC<HomeViewProps> = ({ telemetry }) => {
  return (
    <div className="view panel-enter">
      <div className="room-grid">
        {rooms.map((room, index) => {
          const motionValue = room.motion ? (telemetry[index + 3] ?? 12) : 8;
          const statusColor = room.status === "active" ? "cyan-bright" : room.status === "standby" ? "orange-light" : "gray";

          return (
            <LcarsBracket key={room.id} title={`DECK ${room.deck}`} color={statusColor}>
              <article className="room-card-content" style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "10px 0" }}>
                <header>
                  <strong style={{ fontSize: "1.34rem", textTransform: "uppercase" }}>{room.name}</strong>
                </header>
                <div
                  className="room-ring"
                  style={{
                    "--value": `${room.light}%`,
                    alignSelf: "center",
                  } as React.CSSProperties}
                >
                  {room.light}%
                </div>
                <div className="room-temp-humidity" style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--gray-white)" }}>
                  {room.temperature.toFixed(1)}°C / {room.humidity}% RH
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <LcarsMeter label="LIGHT" value={room.light} color={statusColor} />
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
