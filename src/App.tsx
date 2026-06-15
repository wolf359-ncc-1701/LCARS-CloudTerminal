import { useCallback, useMemo, useState } from "react";
import type React from "react";
import { commandHints, devices, initialEvents, rooms, scenes } from "./data/mock";
import { useAutoMode } from "./hooks/useAutoMode";
import { useMockTelemetry } from "./hooks/useMockTelemetry";
import { useSynthAudio } from "./hooks/useSynthAudio";
import type { AlertLevel, EventLogItem, Mode, VisualMode } from "./types";

const modes: Array<{ id: Mode; label: string; code: string }> = [
  { id: "bridge", label: "Bridge", code: "NCC-01" },
  { id: "home", label: "Habitat", code: "HAB-22" },
  { id: "energy", label: "Power", code: "EPS-47" },
  { id: "memory", label: "Memory", code: "MEM-09" },
  { id: "command", label: "Command", code: "CMD-11" },
];

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function App() {
  const [mode, setMode] = useState<Mode>("bridge");
  const [alert, setAlert] = useState<AlertLevel>("normal");
  const [visual, setVisual] = useState<VisualMode>("default");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [events, setEvents] = useState<EventLogItem[]>(initialEvents);
  const [command, setCommand] = useState("");
  const telemetry = useMockTelemetry(34);
  const { beep } = useSynthAudio(audioEnabled);

  const setModeWithAudio = useCallback(
    (nextMode: Mode) => {
      setMode(nextMode);
      beep("soft");
    },
    [beep],
  );

  const autoActive = useAutoMode(true, setMode);

  const activeRoom = useMemo(() => rooms.find((room) => room.status === "active") ?? rooms[0], []);
  const onlineDevices = devices.filter((device) => device.online).length;
  const currentTime = timeFormatter.format(new Date());

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
    const scene = scenes.find((item) => item.id === sceneId);
    if (!scene) return;
    beep("confirm");
    pushEvent("success", `SCENE ${scene.name.toUpperCase()}`, `${scene.code} accepted by local mock core.`);
  };

  const runCommand = () => {
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;

    if (normalized.includes("red alert")) {
      setAlert("red");
      beep("alert");
      pushEvent("danger", "RED ALERT", "Manual command elevated the console alert state.");
    } else if (normalized.includes("normal") || normalized.includes("resume")) {
      setAlert("normal");
      beep("confirm");
      pushEvent("success", "STATUS NORMAL", "Alert state returned to nominal operation.");
    } else if (normalized.includes("cinema")) {
      executeScene("cinema");
    } else if (normalized.includes("sleep")) {
      executeScene("sleep");
    } else {
      beep("soft");
      pushEvent("info", "COMMAND PARSED", `"${command}" routed to V0 mock interpreter.`);
    }

    setCommand("");
  };

  return (
    <main className="lcars-app" data-mode={mode} data-alert={alert} data-visual={visual}>
      <div className="ambient-grid" aria-hidden="true" />
      <aside className="left-rail" aria-label="Primary controls">
        <div className="rail-crook rail-crook-top" />
        <div className="brand-block">
          <span>TITAN.LOCAL</span>
          <button type="button" className="icon-dot" onClick={() => setInfoOpen(true)} aria-label="Open info">
            i
          </button>
        </div>
        <RailNumbers />
        <div className="vertical-meter">
          <span style={{ height: `${telemetry[2]}%` }} />
          <span style={{ height: `${telemetry[9]}%` }} />
        </div>
        <div className="rail-actions">
          <button type="button" onClick={() => setSettingsOpen(true)} className="pill cyan">
            Settings
          </button>
          <button type="button" className="pill gray" data-active={autoActive}>
            Auto Mode
          </button>
          <button
            type="button"
            className="pill red"
            onClick={() => {
              setAlert((current) => (current === "red" ? "normal" : "red"));
              beep("alert");
            }}
          >
            Red Alert
          </button>
        </div>
      </aside>

      <section className="main-stage">
        <header className="top-rail">
          <div className="top-bar">
            <span />
            <span />
            <span />
          </div>
          <StatusDots count={18} />
          <div className="mission-title">
            {mode === "bridge" ? "LCARS CLOUD TERMINAL" : `${mode.toUpperCase()} MODULE`}
          </div>
        </header>

        <nav className="mode-strip" aria-label="Display modes">
          {modes.map((item) => (
            <button
              type="button"
              key={item.id}
              className="mode-button"
              data-active={mode === item.id}
              onClick={() => setModeWithAudio(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.code}</span>
            </button>
          ))}
        </nav>

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
              command={command}
              setCommand={setCommand}
              runCommand={runCommand}
              events={events}
            />
          )}
        </section>

        <footer className="bottom-telemetry">
          <Meter label="SIGMA" value={telemetry[4]} />
          <Meter label="PSI" value={telemetry[7]} danger />
          <Meter label="EPS" value={telemetry[14]} />
          <div className="footer-blocks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="tiny-bars">
            {telemetry.slice(0, 16).map((value, index) => (
              <span key={`${value}-${index}`} style={{ width: `${Math.max(5, value / 2)}%` }} />
            ))}
          </div>
        </footer>
      </section>

      <aside className="right-rail" aria-label="Module controls">
        <StatusDots count={24} />
        <div className="module-title">SYSTEM INDEX / AL-52169</div>
        <div className="right-stack">
          {modes.map((item) => (
            <button
              type="button"
              key={item.id}
              className="stack-button"
              data-active={mode === item.id}
              onClick={() => setModeWithAudio(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="command-hints">
          <h2>COMMAND HINTS</h2>
          {commandHints.map((hint) => (
            <button
              type="button"
              key={hint}
              onClick={() => {
                setCommand(hint);
                setMode("command");
              }}
            >
              {hint}
            </button>
          ))}
        </div>
      </aside>

      {settingsOpen && (
        <Overlay title="Settings" onClose={() => setSettingsOpen(false)}>
          <Toggle label="Audio" active={audioEnabled} onClick={() => setAudioEnabled((value) => !value)} />
          <Toggle
            label="Soft Glow"
            active={visual === "soft-glow"}
            onClick={() => setVisual((value) => (value === "soft-glow" ? "default" : "soft-glow"))}
          />
          <Toggle
            label="Gray Scale"
            active={visual === "grayscale"}
            onClick={() => setVisual((value) => (value === "grayscale" ? "default" : "grayscale"))}
          />
          <Toggle
            label="Dimmer"
            active={visual === "dim"}
            onClick={() => setVisual((value) => (value === "dim" ? "default" : "dim"))}
          />
        </Overlay>
      )}

      {infoOpen && (
        <Overlay title="Info Overlay" onClose={() => setInfoOpen(false)}>
          <p>
            V0 is a local mock console. It uses original CSS/SVG-like primitives, synthesized sounds, and
            generated telemetry. Real devices arrive in V2.
          </p>
          <p>Idle Auto Mode starts after 60 seconds and rotates display modules.</p>
        </Overlay>
      )}
    </main>
  );
}

function RailNumbers() {
  const labels = ["44-600", "10-667", "82-464", "47-957", "50-409", "19-274", "66-766", "28-605", "83-260"];
  return (
    <div className="rail-numbers">
      {labels.map((label, index) => (
        <span key={label} data-accent={index % 5 === 0 ? "orange" : index % 3 === 0 ? "cyan" : "gray"}>
          {label}
        </span>
      ))}
    </div>
  );
}

function StatusDots({ count }: { count: number }) {
  return (
    <div className="status-dots" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} style={{ animationDelay: `${index * -0.19}s` }} />
      ))}
    </div>
  );
}

function Meter({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="meter" data-danger={danger}>
      <strong>{label}</strong>
      <div>
        <span style={{ width: `${value}%` }} />
      </div>
      <em>{value}</em>
    </div>
  );
}

function BridgeView({
  currentTime,
  activeRoom,
  onlineDevices,
  events,
  telemetry,
  onScene,
}: {
  currentTime: string;
  activeRoom: string;
  onlineDevices: number;
  events: EventLogItem[];
  telemetry: number[];
  onScene: (sceneId: string) => void;
}) {
  return (
    <div className="view bridge-view panel-enter">
      <div className="hero-readout">
        <span>LOCAL BRIDGE</span>
        <strong>{currentTime}</strong>
        <em>{activeRoom} ACTIVE</em>
      </div>
      <TelemetryStack telemetry={telemetry} />
      <SystemDiagram telemetry={telemetry} />
      <div className="summary-grid">
        <Readout label="DEVICES ONLINE" value={`${onlineDevices}/7`} />
        <Readout label="CORE LOAD" value={`${telemetry[1]}%`} />
        <Readout label="ENV INDEX" value={`${telemetry[6]}%`} />
        <Readout label="AI WATCH" value="STANDBY" />
      </div>
      <div className="bridge-log">
        {events.slice(0, 4).map((event) => (
          <article key={event.id} data-tone={event.tone}>
            <span>{event.time}</span>
            <strong>{event.label}</strong>
          </article>
        ))}
      </div>
      <div className="scene-grid">
        {scenes.map((scene) => (
          <button type="button" key={scene.id} data-accent={scene.accent} onClick={() => onScene(scene.id)}>
            <span>{scene.code}</span>
            <strong>{scene.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function TelemetryStack({ telemetry }: { telemetry: number[] }) {
  const labels = ["ODN", "EPS", "SIF", "LIFE", "AI", "MUX"];
  return (
    <div className="telemetry-stack">
      {labels.map((label, index) => (
        <div key={label} className="telemetry-row">
          <span>{label}</span>
          <i style={{ width: `${telemetry[index + 10]}%` }} />
          <em>{telemetry[index + 10]}</em>
        </div>
      ))}
    </div>
  );
}

function HomeView({ telemetry }: { telemetry: number[] }) {
  return (
    <div className="view panel-enter">
      <div className="room-grid">
        {rooms.map((room, index) => (
          <article key={room.id} className="room-card" data-status={room.status}>
            <header>
              <span>DECK {room.deck}</span>
              <strong>{room.name}</strong>
            </header>
            <div className="room-ring" style={{ "--value": `${room.light}%` } as React.CSSProperties}>
              {room.light}
            </div>
            <p>{room.temperature.toFixed(1)}C / {room.humidity}% RH</p>
            <Meter label="LIGHT" value={room.light} />
            <Meter label="MOTION" value={room.motion ? telemetry[index + 3] : 8} />
          </article>
        ))}
      </div>
    </div>
  );
}

function EnergyView({ telemetry }: { telemetry: number[] }) {
  return (
    <div className="view energy-view panel-enter">
      <div className="warp-core">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ animationDelay: `${index * -0.12}s` }} />
        ))}
      </div>
      <div className="energy-board">
        {["LIGHTING", "CLIMATE", "MEDIA", "STANDBY", "AUX"].map((label, index) => (
          <Meter key={label} label={label} value={telemetry[index + 8]} danger={index === 1} />
        ))}
      </div>
    </div>
  );
}

function MemoryView({ events }: { events: EventLogItem[] }) {
  return (
    <div className="view panel-enter">
      <div className="event-log">
        {events.map((event) => (
          <article key={event.id} data-tone={event.tone}>
            <time>{event.time}</time>
            <strong>{event.label}</strong>
            <span>{event.detail}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function CommandView({
  command,
  setCommand,
  runCommand,
  events,
}: {
  command: string;
  setCommand: (value: string) => void;
  runCommand: () => void;
  events: EventLogItem[];
}) {
  return (
    <div className="view command-view panel-enter">
      <label className="command-line">
        <span>COMPUTER / LOCAL PARSER</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") runCommand();
          }}
          placeholder="enter command"
        />
        <button type="button" onClick={runCommand}>
          Execute
        </button>
      </label>
      <MemoryView events={events.slice(0, 5)} />
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="readout">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SystemDiagram({ telemetry }: { telemetry: number[] }) {
  return (
    <div className="system-diagram" aria-hidden="true">
      <div className="system-grid">
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={`v-${index}`} className="v" style={{ left: `${index * 16}%` }} />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={`h-${index}`} className="h" style={{ top: `${index * 22}%` }} />
        ))}
      </div>
      <div className="nacelle nacelle-top">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="home-outline">
        <span className="room room-a" />
        <span className="room room-b" />
        <span className="room room-c" />
        <span className="room room-d" />
        <span className="core" />
      </div>
      <div className="nacelle nacelle-bottom">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      {telemetry.slice(0, 12).map((value, index) => (
        <i
          key={index}
          style={
            {
              "--x": `${8 + ((index * 17) % 82)}%`,
              "--y": `${12 + ((index * 29) % 70)}%`,
              "--s": `${Math.max(4, value / 10)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Overlay({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="overlay-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <section className="overlay-panel">
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="overlay-body">{children}</div>
      </section>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className="toggle-row" data-active={active} onClick={onClick}>
      <span>{label}</span>
      <strong>{active ? "ON" : "OFF"}</strong>
    </button>
  );
}

export default App;
