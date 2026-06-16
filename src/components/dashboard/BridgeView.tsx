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
    <div className="view bridge-view panel-enter">
      {/* Hero Header Readout */}
    <div className="hero-readout-container">
        <LcarsReadout
          label="LOCAL SYSTEM BRIDGE"
          value={currentTime}
          subLabel={`${activeRoom.toUpperCase()} ACTIVE`}
          color="cyan-bright"
          style={{ flex: 1, marginRight: "16px" }}
        />
        <div className="header-status-indicator" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--gray-lighter)" }}>SYSTEM COMPILATION</span>
          <LcarsStatusDots count={12} color="cyan-bright" />
        </div>
      </div>

      {/* Left Column: Telemetry & Event Log */}
      <div className="bridge-left-column" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <LcarsBracket title="MONITORING STACK" color="gray">
          <TelemetryStack telemetry={telemetry} />
        </LcarsBracket>

        <LcarsBracket title="RECENT EVENT FEEDS" color="cyan">
          <EventLog events={events} limit={4} />
        </LcarsBracket>
      </div>

      {/* Middle Column: Abstract SVG Network Diagram */}
      <div className="bridge-middle-column" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <LcarsBracket
          title="SYSTEM NODE TOPOLOGY"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 8px", fontSize: "0.72rem" }}>
              <span>LINK STATE: ACTIVE</span>
              <span>GRID EPS: {telemetry[14]}%</span>
            </div>
          }
          color="cyan-bright"
        >
          <div style={{ minHeight: "410px", height: "100%" }}>
            <SystemDiagram telemetry={telemetry} />
          </div>
        </LcarsBracket>
      </div>

      {/* Right Column: Key readouts & metrics */}
      <div className="bridge-right-column" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <LcarsBracket title="METRIC INDEX" color="orange">
          <div className="summary-grid">
            <LcarsReadout label="DEVICES ONLINE" value={`${onlineDevices}/7`} color="cyan-light" />
            <LcarsReadout label="CORE LOAD" value={`${telemetry[1]}%`} color="orange-light" />
            <LcarsReadout label="ENV INDEX" value={`${telemetry[6]}%`} color="cyan" />
            <LcarsReadout label="AI WATCH" value="STANDBY" color="gray" />
          </div>
        </LcarsBracket>

        <div className="side-bar-decorator" style={{ display: "flex", gap: "4px", height: "12px", overflow: "hidden" }}>
          <LcarsBar color="gray-dark" style={{ flex: 3 }} />
          <LcarsBar color="orange" style={{ flex: 1 }} />
          <LcarsBar color="cyan" style={{ flex: 2 }} />
        </div>
      </div>

      <div className="scene-control-section">
        <LcarsBracket title="INTEGRATED SCENE OVERLAY CONTROLS" color="gray-light">
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
                }}
              >
                <span style={{ fontSize: "0.7rem", opacity: 0.75 }}>{scene.code}</span>
                <strong style={{ fontSize: "1.05rem", fontWeight: 800 }}>{scene.name.toUpperCase()}</strong>
              </LcarsElement>
            ))}
          </div>
        </LcarsBracket>
      </div>
    </div>
  );
};
