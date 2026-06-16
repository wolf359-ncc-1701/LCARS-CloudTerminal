import type { Mode } from "../types";

export interface ModeConfig {
  id: Mode;
  label: string;
  code: string;
}

export const MODES: ModeConfig[] = [
  { id: "bridge", label: "Bridge", code: "NCC-01" },
  { id: "home", label: "Habitat", code: "HAB-22" },
  { id: "energy", label: "Power", code: "EPS-47" },
  { id: "memory", label: "Memory", code: "MEM-09" },
  { id: "command", label: "Command", code: "CMD-11" },
];
