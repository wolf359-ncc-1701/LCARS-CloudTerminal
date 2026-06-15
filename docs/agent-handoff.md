# Agent Handoff

Read this first if you are another coding agent continuing the project.

## User Intent

The user wants to build a personal LCARS-inspired cloud/local smart-home command center, visually inspired by meWho/Titan.DS, but adapted into a practical personal AI/home dashboard.

The user may lose access to Codex, so this repo should be self-explanatory for future agents.

## What Exists

Planning docs exist. No app scaffold has been created yet.

Key files:

- `README.md`
- `docs/v0-plan.md`
- `docs/titan-ds-style-analysis.md`
- `docs/architecture.md`
- `docs/dev-guide.md`
- `docs/resource-policy.md`
- `docs/roadmap.md`

## Design Direction

Build a usable first-screen command center, not a landing page.

V0 should feel like:

- LCARS-style home bridge.
- meWho/Titan.DS-style high-density animated system.
- Personal smart-home and AI operations console.

Do not directly clone or copy Titan.DS assets. Use original CSS/SVG/canvas primitives.

## First Coding Task

Scaffold:

```powershell
npm create vite@latest . -- --template react-ts
npm install
```

Then implement:

- `LcarsShell`
- `BridgeView`
- mock data
- basic mode switching
- settings overlay
- info overlay
- red alert toggle
- auto mode skeleton

## Important Constraints

- Keep edits scoped.
- Preserve docs and update them when decisions change.
- Do not add copied MP3/WebP/SVG assets from meWho/Titan.DS.
- Use generated or hand-authored original assets.
- Keep the UI operational on desktop and usable on mobile.

## Future Backend

Future stack:

- FastAPI
- WebSocket
- SQLite first, PostgreSQL later
- MQTT / Mosquitto
- Home Assistant integration
- ASR/TTS as optional services

## Good Next Milestone

Deliver a V0 visual prototype that runs locally and has enough animated mock telemetry to feel alive.

