import { useCallback, useMemo, useState, useEffect } from "react";
import type React from "react";

import { devices, initialEvents, rooms, scenes } from "../data/mock";
import { useAutoMode } from "../hooks/useAutoMode";
import { useMockTelemetry } from "../hooks/useMockTelemetry";
import type { AlertLevel, EventLogItem, Mode } from "../types";

import { MODES } from "./modes";
import {
  LcarsBar,
  LcarsElement,
  LcarsElbow,
  LcarsBracket,
  LcarsMeter,
  LcarsStatusDots,
  LcarsReadout,
  LcarsOverlay,
  LcarsProvider,
  useLcars,
  LcarsShell,
  LcarsFrame,
} from "../components/lcars";
import {
  BridgeView,
  HomeView,
  EnergyView,
  MemoryView,
  CommandView,
} from "../components/dashboard";

const modeTitleMap: Record<Mode, string> = {
  bridge: "LCARS CLOUD",
  home: "HOME",
  energy: "ENERGY",
  memory: "MEMORY",
  command: "ACTIONS",
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function AppContent() {
  const { audioEnabled, setAudioEnabled, visual, setVisual, beep } = useLcars();

  // Load initial mode from URL search param or fallback to "bridge"
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode") as Mode;
    if (urlMode && ["bridge", "home", "energy", "memory", "command"].includes(urlMode)) {
      return urlMode;
    }
    return "bridge";
  });

  const [alert, setAlert] = useState<AlertLevel>("normal");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [events, setEvents] = useState<EventLogItem[]>(initialEvents);
  const [autoModeEnabled, setAutoModeEnabled] = useState(true);

  const telemetry = useMockTelemetry(34);

  // Sync mode state to URL query parameter
  const syncModeToUrl = useCallback((targetMode: Mode) => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", targetMode);
    window.history.replaceState(null, "", url.pathname + url.search);
  }, []);

  const setModeWithAudio = useCallback(
    (nextMode: Mode) => {
      setMode(nextMode);
      syncModeToUrl(nextMode);
    },
    [syncModeToUrl],
  );

  // Handle auto cycling of modes
  const autoActive = useAutoMode(autoModeEnabled, (nextMode) => {
    setMode(nextMode);
    syncModeToUrl(nextMode);
  });

  // Track the room status
  const activeRoom = useMemo(() => rooms.find((room) => room.status === "active") ?? rooms[0], []);
  const onlineDevices = devices.filter((device) => device.online).length;
  const [currentTime, setCurrentTime] = useState(() => timeFormatter.format(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(timeFormatter.format(new Date()));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const pushEvent = (tone: EventLogItem["tone"], label: string, detail: string) => {
    setEvents((current) => [
      {
        id: crypto.randomUUID(),
        time: timeFormatter.format(new Date()),
        tone,
        label,
        detail,
      },
      ...current.slice(0, 9),
    ]);
  };

  const executeScene = (sceneId: string) => {
    if (sceneId === "living_lights") {
      pushEvent("success", "LIVING LIGHTS", "Living Deck lights set to 100% intensity.");
      return;
    }
    if (sceneId === "all_lights_off") {
      pushEvent("warning", "ALL LIGHTS OFF", "Power bus shut down for all light arrays.");
      return;
    }
    const scene = scenes.find((item) => item.id === sceneId);
    if (!scene) return;
    pushEvent("success", `SCENE ${scene.name.toUpperCase()}`, `${scene.code} accepted by local mock core.`);
  };

  return (
    <LcarsShell mode={mode} alert={alert} visual={visual}>

      {/* Left Rail Layout */}
      <aside className="left-rail" aria-label="Primary controls">
        <LcarsElbow
          direction="top-left"
          color="gray"
          width={246}
          height={148}
          railWidth={80}
          barHeight={34}
          outerRadius={120}
          className="primary-elbow"
        >
          <div className="elbow-dev-code">DEV V.0.77</div>
        </LcarsElbow>
        
        <div className="brand-block">
          <span>TITAN.LOCAL</span>
          <button type="button" className="icon-dot" onClick={() => setInfoOpen(true)} aria-label="Open info">
            i
          </button>
        </div>

        <div className="rail-numbers">
          {["44-600", "10-667", "82-464", "47-957", "50-409", "19-274", "66-766", "28-605", "83-260"].map((label, index) => (
            <span key={label} data-accent={index % 5 === 0 ? "orange" : index % 3 === 0 ? "cyan" : "gray"}>
              {label}
            </span>
          ))}
        </div>

        <div className="vertical-meter">
          <LcarsMeter direction="vertical" value={telemetry[2] ?? 50} showValue={false} color="cyan" />
          <LcarsMeter direction="vertical" value={telemetry[9] ?? 40} showValue={false} color="orange" />
        </div>

        <div className="rail-actions">
          <LcarsElement color="cyan-light" onClick={() => setSettingsOpen(true)} beepType="confirm">
            Settings
          </LcarsElement>
          <LcarsElement color="gray" active={autoActive} beepType="soft">
            Auto Mode
          </LcarsElement>
          <LcarsElement
            color="orange-dark"
            active={alert === "red"}
            onClick={() => {
              setAlert((current) => (current === "red" ? "normal" : "red"));
            }}
            beepType="alert"
          >
            Red Alert
          </LcarsElement>
        </div>
      </aside>

      {/* Main Content Stage */}
      <section className="main-stage">
        <header className="top-rail">
          <div className="top-bar">
            <LcarsBar color="gray-dark" style={{ height: "100%" }} />
            <LcarsBar color="gray" style={{ height: "100%" }} />
            <LcarsBar color="gray-dark" style={{ height: "100%" }} />
          </div>
          <LcarsStatusDots count={18} color="cyan-light" />
          <div className="safe-title-zone type-display-title">
            {modeTitleMap[mode]}
          </div>
        </header>

        <nav className="mode-strip" aria-label="Display modes">
          {MODES.map((item) => (
            <LcarsElement
              key={item.id}
              color={mode === item.id ? "cyan-bright" : "gray-dark"}
              active={mode === item.id}
              onClick={() => setModeWithAudio(item.id)}
              className="mode-tab"
              beepType="transition"
            >
              <span className="tab-label">{item.label}</span>
              <span className="tab-code">{item.code}</span>
            </LcarsElement>
          ))}
        </nav>

        {/* Outer Bracket wrapping the Active View */}
        <section className="display-window">
          <div className="scan-line" aria-hidden="true" />
          {mode === "bridge" && (
            <BridgeView
              currentTime={currentTime}
              activeRoom={activeRoom.name}
              onlineDevices={onlineDevices}
              events={events}
              telemetry={telemetry}
              onScene={executeScene}
            />
          )}
          {mode === "home" && <HomeView telemetry={telemetry} />}
          {mode === "energy" && <EnergyView telemetry={telemetry} />}
          {mode === "memory" && <MemoryView events={events} />}
          {mode === "command" && (
            <CommandView
              events={events}
              alert={alert}
              setAlert={setAlert}
              autoModeEnabled={autoModeEnabled}
              setAutoModeEnabled={setAutoModeEnabled}
              executeScene={executeScene}
            />
          )}
        </section>

        {/* Bottom Status Telemetry Footer Bar */}
        <footer className="bottom-telemetry">
          <LcarsFrame.Ruler ticks={45} color="cyan-dark" style={{ gridColumn: "1 / -1", height: "4px", marginBottom: "8px" }} />
          <LcarsMeter label="SIGMA" value={telemetry[4] ?? 50} color="cyan" />
          <LcarsMeter label="PSI" value={telemetry[7] ?? 30} color="orange" danger={telemetry[7] > 75} />
          <LcarsMeter label="EPS" value={telemetry[14] ?? 60} color="cyan" />
          <div className="footer-blocks" aria-hidden="true">
            <LcarsBar color="gray" />
            <LcarsBar color="cyan" />
            <LcarsBar color="gray" />
            <LcarsBar color="orange-light" />
            <LcarsBar color="cyan" />
          </div>
          <div className="tiny-bars">
            {telemetry.slice(0, 16).map((value, index) => (
              <span key={`${value}-${index}`} style={{ width: `${Math.max(5, value / 2)}%` }} />
            ))}
          </div>
        </footer>
      </section>

      <aside className="right-rail" aria-label="Module controls">
        <LcarsStatusDots count={24} />
        <div className="module-title">SYSTEM INDEX / AL-52169</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", margin: "4px 0" }}>
          <LcarsFrame.TickBar count={6} color="orange" />
          <LcarsFrame.Cross size={8} color="gray" />
        </div>
        <div className="right-stack">
          {MODES.map((item) => (
            <LcarsElement
              key={item.id}
              color={mode === item.id ? "orange-light" : "gray-dark"}
              active={mode === item.id}
              onClick={() => setModeWithAudio(item.id)}
              className="right-menu-button"
            >
              <span className="right-menu-label">{item.label.toUpperCase()}</span>
            </LcarsElement>
          ))}
        </div>
      </aside>

      {/* Settings Overlay dialog */}
      {settingsOpen && (
        <LcarsOverlay title="Settings Panel" onClose={() => setSettingsOpen(false)}>
          <LcarsElement
            active={audioEnabled}
            color={audioEnabled ? "cyan-bright" : "gray-dark"}
            onClick={() => setAudioEnabled((value) => !value)}
            beepType="soft"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "52px",
              padding: "0 18px",
              width: "100%",
              borderRadius: "4px",
              color: audioEnabled ? "#000" : "var(--gray-white)"
            }}
          >
            <span>Audio Core synthesize beeps</span>
            <strong>{audioEnabled ? "ON" : "OFF"}</strong>
          </LcarsElement>
          
          <LcarsElement
            active={visual === "soft-glow"}
            color={visual === "soft-glow" ? "cyan-bright" : "gray-dark"}
            onClick={() => setVisual((value) => (value === "soft-glow" ? "default" : "soft-glow"))}
            beepType="soft"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "52px",
              padding: "0 18px",
              width: "100%",
              borderRadius: "4px",
              color: visual === "soft-glow" ? "#000" : "var(--gray-white)"
            }}
          >
            <span>Atmospheric Soft Glow shader</span>
            <strong>{visual === "soft-glow" ? "ON" : "OFF"}</strong>
          </LcarsElement>

          <LcarsElement
            active={visual === "grayscale"}
            color={visual === "grayscale" ? "cyan-bright" : "gray-dark"}
            onClick={() => setVisual((value) => (value === "grayscale" ? "default" : "grayscale"))}
            beepType="soft"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "52px",
              padding: "0 18px",
              width: "100%",
              borderRadius: "4px",
              color: visual === "grayscale" ? "#000" : "var(--gray-white)"
            }}
          >
            <span>Console Grayscale monochromatic filters</span>
            <strong>{visual === "grayscale" ? "ON" : "OFF"}</strong>
          </LcarsElement>

          <LcarsElement
            active={visual === "dim"}
            color={visual === "dim" ? "cyan-bright" : "gray-dark"}
            onClick={() => setVisual((value) => (value === "dim" ? "default" : "dim"))}
            beepType="soft"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "52px",
              padding: "0 18px",
              width: "100%",
              borderRadius: "4px",
              color: visual === "dim" ? "#000" : "var(--gray-white)"
            }}
          >
            <span>Night-mode Dimmer filters</span>
            <strong>{visual === "dim" ? "ON" : "OFF"}</strong>
          </LcarsElement>
        </LcarsOverlay>
      )}

      {/* Info/Taxonomy Overlay dialog */}
      {infoOpen && (
        <LcarsOverlay title="TITAN.LOCAL SYSTEM INFO" onClose={() => setInfoOpen(false)}>
          <div style={{ color: "var(--gray-white)", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ margin: 0, color: "var(--cyan-bright)", fontWeight: "bold" }}>
              V0.77 LCARS Cloud Terminal Development Console
            </p>
            <p style={{ margin: 0 }}>
              System console running active telemetry and environmental controls, polished according to standard LCARS specifications.
            </p>
            
            <div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
              <div style={{ borderLeft: "4px solid var(--orange-light)", paddingLeft: "10px" }}>
                <strong style={{ color: "var(--orange-light)" }}>Grammar & Taxonomy:</strong> Semantic primitives including LcarsBar, LcarsElement, LcarsElbow, LcarsBracket, and LcarsMeter.
              </div>
              <div style={{ borderLeft: "4px solid var(--cyan-bright)", paddingLeft: "10px" }}>
                <strong style={{ color: "var(--cyan-bright)" }}>V0.75 Readability Fixes:</strong> Clean desktop title rendering and stable right-rail layout overrides.
              </div>
              <div style={{ borderLeft: "4px solid var(--cyan-bright)", paddingLeft: "10px" }}>
                <strong style={{ color: "var(--cyan-bright)" }}>V0.76 Structural Polish:</strong> Reconstructed left elbow curvature to eliminate visual gaps.
              </div>
              <div style={{ borderLeft: "4px solid var(--cyan-bright)", paddingLeft: "10px" }}>
                <strong style={{ color: "var(--cyan-bright)" }}>V0.77 Right Rail & Habitat:</strong> Quick Actions removed, mode button labels restored, Habitat card contrast and typography optimized.
              </div>
              <div style={{ borderLeft: "4px solid var(--orange)", paddingLeft: "10px" }}>
                <strong style={{ color: "var(--orange)" }}>Agent Workflow:</strong> Local-first multi-agent workflow with Codex driving architecture/review and Gemini delivering frontend implementation.
              </div>
            </div>
            
            <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem", color: "var(--gray-light)" }}>
              System operating in local-only development mode. Automatic display mode cycling active after 60s idle.
            </p>
          </div>
        </LcarsOverlay>
      )}
    </LcarsShell>
  );
}

export default function App() {
  return (
    <LcarsProvider>
      <AppContent />
    </LcarsProvider>
  );
}
