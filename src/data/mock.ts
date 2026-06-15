import type { Device, EventLogItem, Room, Scene } from "../types";

export const rooms: Room[] = [
  {
    id: "living",
    name: "Living Deck",
    deck: "01",
    temperature: 23.6,
    humidity: 42,
    light: 68,
    motion: true,
    status: "active",
  },
  {
    id: "work",
    name: "Work Bay",
    deck: "02",
    temperature: 22.1,
    humidity: 39,
    light: 84,
    motion: true,
    status: "active",
  },
  {
    id: "sleep",
    name: "Sleep Quarters",
    deck: "03",
    temperature: 21.4,
    humidity: 46,
    light: 12,
    motion: false,
    status: "standby",
  },
  {
    id: "entry",
    name: "Entry Lock",
    deck: "04",
    temperature: 24.2,
    humidity: 44,
    light: 35,
    motion: false,
    status: "nominal",
  },
];

export const devices: Device[] = [
  { id: "living-main", roomId: "living", name: "Main Array", type: "light", online: true, value: 68 },
  { id: "living-media", roomId: "living", name: "Media Core", type: "media", online: true, value: 72 },
  { id: "work-desk", roomId: "work", name: "Desk Beam", type: "light", online: true, value: 84 },
  { id: "work-plug", roomId: "work", name: "Aux Outlet", type: "plug", online: true, value: 31 },
  { id: "sleep-climate", roomId: "sleep", name: "Climate Loop", type: "climate", online: true, value: 45 },
  { id: "sleep-shade", roomId: "sleep", name: "Shade Motor", type: "shade", online: false, value: 12 },
  { id: "entry-lock", roomId: "entry", name: "Access Sensor", type: "plug", online: true, value: 91 },
];

export const scenes: Scene[] = [
  { id: "cinema", name: "Cinema", code: "44-600", accent: "orange" },
  { id: "sleep", name: "Sleep", code: "10-667", accent: "gray" },
  { id: "away", name: "Away", code: "66-766", accent: "orange" },
  { id: "home", name: "Return", code: "19-274", accent: "cyan" },
];

export const initialEvents: EventLogItem[] = [
  {
    id: "evt-001",
    time: "22:31",
    tone: "success",
    label: "BRIDGE ONLINE",
    detail: "Interface matrix loaded from local mock core.",
  },
  {
    id: "evt-002",
    time: "22:33",
    tone: "info",
    label: "AUTO MODE READY",
    detail: "Idle routines will rotate modules after 60 seconds.",
  },
  {
    id: "evt-003",
    time: "22:34",
    tone: "warning",
    label: "ASSET POLICY",
    detail: "Reference media locked out. Original UI primitives only.",
  },
];

export const commandHints = [
  "cinema mode",
  "sleep mode",
  "open living lights",
  "close all lights",
  "red alert",
  "resume normal",
];

