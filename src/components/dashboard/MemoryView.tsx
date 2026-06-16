import React from "react";
import type { EventLogItem } from "../../types";
import { LcarsBracket } from "../lcars";

interface MemoryViewProps {
  events: EventLogItem[];
}

export const MemoryView: React.FC<MemoryViewProps> = ({ events }) => {
  return (
    <div className="view panel-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <LcarsBracket title="LOCAL MEMORY MATRIX CORE / ARCHIVE LOG" color="cyan" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="event-log" style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
          {events.map((event) => (
            <article key={event.id} data-tone={event.tone}>
              <time>{event.time}</time>
              <strong style={{ textTransform: "uppercase" }}>{event.label}</strong>
              <span>{event.detail}</span>
            </article>
          ))}
        </div>
      </LcarsBracket>
    </div>
  );
};
