import React from "react";
import type { EventLogItem } from "../../types";
import { MemoryView } from "./MemoryView";
import { LcarsElement, LcarsBracket } from "../lcars";

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
  return (
    <div className="view command-view panel-enter" style={{ display: "flex", flexDirection: "column", gap: "18px", height: "100%" }}>
      <LcarsBracket title="PARSER INTERFACE" color="orange">
        <label className="command-line" style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: "12px", alignItems: "center", padding: "10px 0" }}>
          <span style={{ color: "var(--orange-light)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "bold" }}>
            MOCK VOICE / TERMINAL
          </span>
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") runCommand();
            }}
            placeholder="ENTER LCARS QUERY"
            style={{
              minWidth: 0,
              height: "44px",
              padding: "0 16px",
              color: "var(--gray-white)",
              border: "1.5px solid var(--cyan)",
              background: "#000",
              textTransform: "uppercase",
              fontSize: "0.95rem",
              fontFamily: "var(--font-family)",
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
            }}
          >
            Execute
          </LcarsElement>
        </label>
      </LcarsBracket>

      <div style={{ flex: 1, minHeight: 0 }}>
        <MemoryView events={events.slice(0, 5)} />
      </div>
    </div>
  );
};
