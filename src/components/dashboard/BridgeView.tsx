import React from "react";
import type { EventLogItem } from "../../types";
import { scenes } from "../../data/mock";
import { SystemDiagram } from "./SystemDiagram";
import { TelemetryStack } from "./TelemetryStack";
import { EventLog } from "./EventLog";
import {
  LcarsBracket,
  LcarsReadout,
  LcarsElement,
  LcarsStatusDots,
  LcarsBar,
  LcarsFrame,
} from "../lcars";

interface BridgeViewProps {
  currentTime: string;
  activeRoom: string;
  onlineDevices: number;
  events: EventLogItem[];
  telemetry: number[];
  onScene: (sceneId: string) => void;
}

export const BridgeView: React.FC<BridgeViewProps> = ({
  currentTime,
  activeRoom,
  onlineDevices,
  events,
  telemetry,
  onScene,
}) => {
  return (
    <div className="view bridge-view panel-enter" style={{ position: "relative" }}>
      {/* Decorative coordinate cross hairs in corners */}
      <LcarsFrame.Cross x="4px" y="4px" size={10} color="gray-light" />
      
      {/* Hero Header Readout Redesigned */}
      <div className="hero-readout-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <LcarsReadout
            label="LOCAL SMART-HOME COMMAND BRIDGE"
            value={currentTime}
            subLabel={
              <div style={{ display: "flex", gap: "14px", alignItems: "center", textTransform: "uppercase" }}>
                <span style={{ color: "var(--orange-light)" }}>{activeRoom} ACTIVE</span>
                <span style={{ color: "var(--gray-light)" }}>|</span>
                <span style={{ color: "var(--cyan-light)" }}>BUS-47 / SEC-5591</span>
              </div>
            }
            color="cyan-bright"
            style={{ marginRight: "16px" }}
          />
          <LcarsFrame.Ruler ticks={40} color="cyan-dark" style={{ marginTop: "4px", width: "90%" }} />
        </div>
        
        <div className="header-status-indicator" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.7rem", color: "var(--gray-lighter)" }}>
            <span style={{ letterSpacing: "1px" }}>CPU CYCLE STATUS</span>
            <span style={{ color: "var(--success)", fontWeight: "bold" }}>ONLINE</span>
          </div>
          <LcarsStatusDots count={14} color="cyan-bright" />
          <LcarsFrame.TickBar label="TRK-9" count={6} color="orange" style={{ marginTop: "2px" }} />
        </div>
      </div>

      {/* Left Column: Telemetry & Event Log */}
      <div className="bridge-left-column" style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative" }}>
        <LcarsBracket title="MONITORING TELEMETRY STACK" color="gray">
          <div style={{ padding: "4px 0" }}>
            <TelemetryStack telemetry={telemetry} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--gray-light)", marginTop: "10px", padding: "0 4px" }}>
              <span>REF-442 / EPS</span>
              <span>NOMINAL SCALE</span>
            </div>
          </div>
        </LcarsBracket>

        <LcarsBracket title="RECENT EVENT MATRIX FEEDS" color="cyan">
          <div style={{ padding: "4px 0" }}>
            <EventLog events={events} limit={4} />
          </div>
        </LcarsBracket>
      </div>

      {/* Middle Column: Abstract SVG Network Diagram */}
      <div className="bridge-middle-column" style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
        {/* Decorative corner ticks for display windows */}
        <LcarsFrame.Cross x="10px" y="24px" size={8} color="cyan-light" />
        <LcarsFrame.Cross x="calc(100% - 18px)" y="24px" size={8} color="cyan-light" />
        
        <LcarsBracket
          title="SYSTEM NODE NET TOPOLOGY"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 8px", fontSize: "0.72rem", color: "var(--cyan-light)" }}>
              <span style={{ fontWeight: "bold" }}>LINK STATE: STABLE</span>
              <LcarsFrame.TickBar count={8} color="cyan-bright" />
              <span style={{ fontWeight: "bold" }}>GRID EPS: {telemetry[14]}%</span>
            </div>
          }
          color="cyan-bright"
        >
          <div style={{ minHeight: "410px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <LcarsFrame.Ruler ticks={25} color="cyan-dark" style={{ marginBottom: "6px" }} />
            <div style={{ flex: 1 }}>
              <SystemDiagram telemetry={telemetry} />
            </div>
            <LcarsFrame.Ruler ticks={25} color="cyan-dark" style={{ marginTop: "6px" }} />
          </div>
        </LcarsBracket>
      </div>

      {/* Right Column: Key readouts & metrics */}
      <div className="bridge-right-column" style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
        <LcarsBracket title="METRIC ARCHIVE INDEX" color="orange">
          <div className="summary-grid" style={{ padding: "4px 0" }}>
            <LcarsReadout label="DEVICES ONLINE" value={`${onlineDevices}/7`} color="cyan-light" subLabel="PORT 80/443 EST." />
            <LcarsReadout label="CORE LOAD" value={`${telemetry[1]}%`} color="orange-light" subLabel="CYCLE SPEED NOM" />
            <LcarsReadout label="ENV INDEX" value={`${telemetry[6]}%`} color="cyan" subLabel="HAB STABILITY 1.0" />
            <LcarsReadout label="AI WATCH" value="STANDBY" color="gray" subLabel="CORE LISTENER STANDBY" />
          </div>
        </LcarsBracket>

        <div className="side-bar-decorator" style={{ display: "flex", gap: "4px", height: "12px", overflow: "hidden" }}>
          <LcarsBar color="gray-dark" style={{ flex: 3 }} />
          <LcarsBar color="orange" style={{ flex: 1 }} />
          <LcarsBar color="cyan" style={{ flex: 2 }} />
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.68rem", color: "var(--gray-light)" }}>
          <span>NODE CLOUD // NCC-01</span>
          <span>47-957</span>
        </div>
      </div>

      {/* Bottom Row: Local Scene Control Strip */}
      <div className="scene-control-section" style={{ marginTop: "8px" }}>
        <LcarsBracket title="INTEGRATED SCENE OVERLAY CONTROLS / CORE TRIGGERS" color="gray-light">
          <div className="scene-grid" style={{ paddingTop: "8px" }}>
            {scenes.map((scene) => (
              <LcarsElement
                key={scene.id}
                color={scene.accent === "orange" ? "orange-light" : scene.accent === "cyan" ? "cyan-light" : "gray"}
                onClick={() => onScene(scene.id)}
                beepType="confirm"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  minHeight: "64px",
                  padding: "0 18px",
                  borderRadius: "4px",
                  textAlign: "left",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", opacity: 0.75 }}>{scene.code}</span>
                  <LcarsFrame.TickBar count={3} color={scene.accent === "orange" ? "orange-dark" : scene.accent === "cyan" ? "cyan-dark" : "gray-dark"} />
                </div>
                <strong style={{ fontSize: "1.05rem", fontWeight: 800 }}>{scene.name.toUpperCase()}</strong>
              </LcarsElement>
            ))}
          </div>
        </LcarsBracket>
      </div>
    </div>
  );
};
