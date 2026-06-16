import React from "react";
import type { EventLogItem } from "../../types";
import { LcarsBracket, LcarsFrame, LcarsReadout, LcarsMeter } from "../lcars";

interface MemoryViewProps {
  events: EventLogItem[];
}

export const MemoryView: React.FC<MemoryViewProps> = ({ events }) => {
  return (
    <div className="view memory-view panel-enter">
      {/* Decorative coordinate mark */}
      <LcarsFrame.Cross x="6px" y="6px" size={10} color="gray-light" />

      {/* Left Column: Event Logs */}
      <LcarsBracket title="LOCAL MEMORY MATRIX CORE / ARCHIVE LOG" color="cyan" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "8px", padding: "6px 0" }}>
          <div className="event-log" style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
            {events.map((event) => (
              <article key={event.id} data-tone={event.tone} style={{ padding: "8px 12px" }}>
                <time className="type-numeric">{event.time}</time>
                <strong className="type-module-label">{event.label}</strong>
                <span className="type-body-log">{event.detail}</span>
              </article>
            ))}
          </div>
          <LcarsFrame.Ruler ticks={30} color="cyan-dark" style={{ marginTop: "4px" }} />
        </div>
      </LcarsBracket>

      {/* Right Column: Memory Core Hardware Diagnostics */}
      <LcarsBracket title="HARDWARE CORE SECTORS" color="cyan-bright">
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "6px 0", height: "100%", justifyContent: "space-between" }}>
          
          {/* Readout statistics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <LcarsReadout label="TOTAL CAPACITY" value="512 TB" color="cyan-light" subLabel="SECTOR-44 MAPPED" />
            <LcarsReadout label="BUFFER STATE" value="NOMINAL" color="success" subLabel="CACHE FREQ SYNC" />
          </div>

          {/* Sector grid simulation */}
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--gray-lighter)", display: "block", marginBottom: "6px", fontFamily: "var(--font-lcars)", fontWeight: "bold" }}>
              PHYSICAL MATRIX SECTORS (TRK-0 to TRK-8)
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "4px", background: "var(--panel)", padding: "10px", border: "1px solid var(--gray-dark)" }}>
              {Array.from({ length: 32 }).map((_, idx) => {
                const isActive = idx % 3 === 0 || idx % 7 === 0;
                const isWarning = idx % 11 === 0;
                const color = isWarning ? "var(--orange)" : isActive ? "var(--cyan-bright)" : "var(--gray-dark)";
                return (
                  <span
                    key={idx}
                    style={{
                      height: "14px",
                      background: color,
                      borderRadius: "1px",
                      opacity: isActive ? 0.95 : 0.45,
                      animation: isActive ? "blink-soft 4s ease infinite" : "none",
                      animationDelay: `${idx * -0.15}s`
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Ticks and meters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <LcarsMeter label="IND-SECT" value={78} color="cyan" />
            <LcarsMeter label="MAG-BIAS" value={34} color="orange" danger={false} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--gray-light)", marginTop: "4px" }}>
              <span>SECTOR BUS: 47-957</span>
              <LcarsFrame.TickBar count={6} color="cyan-bright" />
            </div>
          </div>

        </div>
      </LcarsBracket>
    </div>
  );
};
