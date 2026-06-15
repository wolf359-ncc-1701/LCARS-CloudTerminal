export type Mode = "bridge" | "home" | "energy" | "memory" | "command";
export type AlertLevel = "normal" | "caution" | "red";
export type VisualMode = "default" | "soft-glow" | "grayscale" | "dim";

export interface Room {
  id: string;
  name: string;
  deck: string;
  temperature: number;
  humidity: number;
  light: number;
  motion: boolean;
  status: "nominal" | "standby" | "active";
}

export interface Device {
  id: string;
  roomId: string;
  name: string;
  type: "light" | "climate" | "media" | "shade" | "plug";
  online: boolean;
  value: number;
}

export interface EventLogItem {
  id: string;
  time: string;
  tone: "info" | "success" | "warning" | "danger";
  label: string;
  detail: string;
}

export interface Scene {
  id: string;
  name: string;
  code: string;
  accent: "cyan" | "orange" | "gray";
}

