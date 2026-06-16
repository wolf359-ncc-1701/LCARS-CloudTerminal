import React from "react";
import type { EventLogItem } from "../../types";

interface EventLogProps {
  events: EventLogItem[];
  limit?: number;
  className?: string;
}

export const EventLog: React.FC<EventLogProps> = ({ events, limit, className = "" }) => {
  const displayEvents = limit ? events.slice(0, limit) : events;

  return (
    <div className={`bridge-log ${className}`}>
      {displayEvents.map((event) => (
        <article key={event.id} data-tone={event.tone}>
          <span>{event.time}</span>
          <strong>{event.label}</strong>
          <span className="log-detail">{event.detail}</span>
        </article>
      ))}
    </div>
  );
};
