import React from "react";
import type { EventLogItem } from "../../types";
import { MemoryView } from "./MemoryView";
import { LcarsElement, LcarsBracket, LcarsFrame } from "../lcars";

interface CommandViewProps {
  command: string;
  setCommand: (value: string) => void;
  runCommand: () => void;
  events: EventLogItem[];
}

export const CommandView: React.FC<CommandViewProps> = ({
  command,
  setCommand,
  runCommand,
  events,
}) => {
  const availableCommands = [
    { cmd: "RED ALERT", desc: "Elevate console alarm" },
    { cmd: "RESUME NORMAL", desc: "Return to nominal state" },
    { cmd: "CINEMA MODE", desc: "Trigger cinema scenes" },
    { cmd: "SLEEP MODE", desc: "Trigger quarters sleep scene" },
  ];

  return (
    <div className="view command-view panel-enter" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "28px", height: "100%", position: "relative" }}>
      {/* Decorative coordinate cross */}
      <LcarsFrame.Cross x="6px" y="6px" size={10} color="gray-light" />

      {/* Left Column: Terminal Input and Log */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", minHeight: 0 }}>
        <LcarsBracket title="MOCK TERMINAL INTERFACE / VOICE ROUTING" color="orange">
          <div style={{ padding: "4px 0" }}>
            <label className="command-line" style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: "12px", alignItems: "center" }}>
              <span style={{ color: "var(--orange-light)", textTransform: "uppercase", fontSize: "0.82rem", fontWeight: "bold", fontFamily: "var(--font-lcars)" }}>
                MOCK CONSOLE
              </span>
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") runCommand();
                }}
                placeholder="ENTER SYSTEM COMMANDS"
                style={{
                  minWidth: 0,
                  height: "44px",
                  padding: "0 16px",
                  color: "var(--gray-white)",
                  border: "1.5px solid var(--cyan)",
                  background: "#000",
                  textTransform: "uppercase",
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-lcars)",
                  fontWeight: "bold",
                }}
              />
              <LcarsElement
                color="cyan-bright"
                onClick={runCommand}
                beepType="confirm"
                style={{
                  height: "44px",
                  padding: "0 22px",
                  fontWeight: 800,
                  borderRadius: "4px",
                  fontFamily: "var(--font-lcars)"
                }}
              >
                Execute
              </LcarsElement>
            </label>
          </div>
        </LcarsBracket>

        {/* Console Event log list */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <MemoryView events={events.slice(0, 5)} />
        </div>
      </div>

      {/* Right Column: Commands Reference Panel */}
      <LcarsBracket title="SYSTEM UTILITIES DIRECTORY" color="cyan">
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "6px 0", height: "100%", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--cyan-bright)", display: "block", marginBottom: "8px", fontFamily: "var(--font-lcars)", fontWeight: "bold" }}>
              SYNTAX REFERENCE LIST
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {availableCommands.map((item) => (
                <button
                  type="button"
                  key={item.cmd}
                  onClick={() => setCommand(item.cmd.toLowerCase())}
                  style={{
                    background: "var(--panel-2)",
                    border: "1px solid var(--gray-dark)",
                    padding: "10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border 0.2s, background 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan-bright)";
                    e.currentTarget.style.background = "var(--panel)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--gray-dark)";
                    e.currentTarget.style.background = "var(--panel-2)";
                  }}
                >
                  <strong style={{ fontSize: "0.85rem", color: "var(--cyan-bright)", fontFamily: "var(--font-lcars)", display: "block" }}>{item.cmd}</strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--gray-lighter)", display: "block", marginTop: "2px" }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <LcarsFrame.Ruler ticks={20} color="cyan-dark" style={{ marginBottom: "10px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--gray-light)" }}>
              <span>TERM CH-5591</span>
              <span>NOMINAL BUS</span>
            </div>
          </div>
        </div>
      </LcarsBracket>
    </div>
  );
};
