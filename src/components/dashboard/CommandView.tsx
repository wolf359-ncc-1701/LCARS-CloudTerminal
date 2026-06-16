import React from "react";
import type { AlertLevel, EventLogItem } from "../../types";
import { LcarsActionButton, LcarsParameterRow, LcarsMediaFrame, useLcars } from "../lcars";

interface CommandViewProps {
  events: EventLogItem[];
  alert: AlertLevel;
  setAlert: (level: AlertLevel) => void;
  autoModeEnabled: boolean;
  setAutoModeEnabled: (enabled: boolean) => void;
  executeScene: (sceneId: string) => void;
}

export const CommandView: React.FC<CommandViewProps> = ({
  events,
  alert,
  setAlert,
  autoModeEnabled,
  setAutoModeEnabled,
  executeScene,
}) => {
  const { audioEnabled, setAudioEnabled, visual, setVisual, beep } = useLcars();

  // Handle direct actions
  const triggerRedAlert = () => {
    setAlert("red");
    beep("alert");
  };

  const triggerNormal = () => {
    setAlert("normal");
    beep("confirm");
  };

  const handleSceneClick = (sceneId: string, soundType: "action" | "confirm" | "alert" = "action") => {
    executeScene(sceneId);
    beep(soundType);
  };

  return (
    <div className="view command-view panel-enter">
      {/* Left Column: Actions Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        {/* Section 1: Scenes Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="type-micro-code" style={{ color: "var(--orange-light)", fontWeight: "bold" }}>
            ENVIRONMENTAL SCENES CONFIGURATION
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <LcarsActionButton
              label="Cinema Mode"
              subLabel="ENV-100: Mute audio & dim arrays"
              color="orange-light"
              onClick={() => handleSceneClick("cinema", "action")}
              beepType="none"
            />
            <LcarsActionButton
              label="Sleep Mode"
              subLabel="ENV-200: Quarters night mode pulse"
              color="gray"
              onClick={() => handleSceneClick("sleep", "action")}
              beepType="none"
            />
            <LcarsActionButton
              label="Living Lights"
              subLabel="ENV-300: High intensity deck layout"
              color="cyan-light"
              onClick={() => handleSceneClick("living_lights", "confirm")}
              beepType="none"
            />
            <LcarsActionButton
              label="All Lights Off"
              subLabel="ENV-400: Disable primary light load"
              color="orange-dark"
              onClick={() => handleSceneClick("all_lights_off", "alert")}
              beepType="none"
            />
          </div>
        </div>

        {/* Section 2: System Settings Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
          <span className="type-micro-code" style={{ color: "var(--cyan-bright)", fontWeight: "bold" }}>
            SYSTEM CORE OVERRIDES
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <LcarsActionButton
              label="Red Alert"
              subLabel="SYS-911: Engage warning flashers"
              color="orange-dark"
              active={alert === "red"}
              onClick={triggerRedAlert}
              beepType="none"
            />
            <LcarsActionButton
              label="Resume Normal"
              subLabel="SYS-100: Nominal bus levels"
              color="cyan"
              active={alert === "normal"}
              onClick={triggerNormal}
              beepType="none"
            />
            <LcarsActionButton
              label={`Audio: ${audioEnabled ? "ENABLED" : "MUTED"}`}
              subLabel="SYS-202: Core audio synth core"
              color={audioEnabled ? "cyan-bright" : "gray-dark"}
              active={audioEnabled}
              onClick={() => {
                setAudioEnabled((v) => !v);
                beep("confirm");
              }}
              beepType="none"
            />
            <LcarsActionButton
              label={`Auto mode: ${autoModeEnabled ? "ACTIVE" : "STANDBY"}`}
              subLabel="SYS-303: Idle module rotation"
              color={autoModeEnabled ? "cyan-bright" : "gray-dark"}
              active={autoModeEnabled}
              onClick={() => {
                setAutoModeEnabled(!autoModeEnabled);
                beep("confirm");
              }}
              beepType="none"
            />
            <LcarsActionButton
              label={`Atmospheric Glow: ${visual === "soft-glow" ? "ON" : "OFF"}`}
              subLabel="SYS-404: Soft shader overlay"
              color={visual === "soft-glow" ? "cyan-bright" : "gray-dark"}
              active={visual === "soft-glow"}
              onClick={() => {
                setVisual(visual === "soft-glow" ? "default" : "soft-glow");
                beep("confirm");
              }}
              beepType="none"
            />
            <LcarsActionButton
              label={`Dimmer: ${visual === "dim" ? "ON" : "OFF"}`}
              subLabel="SYS-505: Low brightness display"
              color={visual === "dim" ? "cyan-bright" : "gray-dark"}
              active={visual === "dim"}
              onClick={() => {
                setVisual(visual === "dim" ? "default" : "dim");
                beep("confirm");
              }}
              beepType="none"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Console Log Frame & Parameters */}
      <LcarsMediaFrame title="SYSTEM ACTIONS TELEMETRY LOG" color="cyan" style={{ minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: "12px" }}>
          <div className="event-log compact" style={{ flex: 1, overflowY: "auto" }}>
            {events.slice(0, 5).map((event) => (
              <article key={event.id} data-tone={event.tone}>
                <div className="log-header">
                  <time className="type-numeric">{event.time}</time>
                  <strong className="type-module-label">{event.label}</strong>
                </div>
                <span className="type-body-log log-detail">{event.detail}</span>
              </article>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <LcarsParameterRow label="Local Console Node" value="CH-5591" labelColor="gray-dark" valueColor="cyan-dark" />
            <LcarsParameterRow label="Alert Hierarchy" value={alert.toUpperCase()} labelColor="gray-dark" valueColor={alert === "red" ? "orange" : "cyan-bright"} />
            <LcarsParameterRow label="Active Shader Overlay" value={visual.toUpperCase()} labelColor="gray-dark" valueColor="orange" />
          </div>
        </div>
      </LcarsMediaFrame>
    </div>
  );
};
