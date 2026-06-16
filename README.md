# LCARS Cloud Terminal

LCARS Cloud Terminal is a planned personal smart-home command center inspired by LCARS-style fictional interfaces and the high-density animated display language of meWho/Titan.DS.

The project goal is not to clone Titan.DS. It is to build an original, self-hostable "home bridge" UI that can eventually connect to Home Assistant, MQTT devices, voice control, and AI command orchestration.

## Current Status

This repository now contains the first runnable V0 frontend prototype.

Existing documents:

- `docs/dev-log.md` - chronological development notes.
- `docs/frontend-agent-brief.md` - instructions for frontend-focused agents.
- `docs/ai-workflow.md` - Git/branch/task-file workflow for multiple AI clients.
- `docs/component-architecture.md` - target frontend component architecture.
- `docs/v0-plan.md` - V0 product and implementation plan.
- `docs/titan-ds-style-analysis.md` - style and motion-language analysis based on user-provided references.
- `docs/architecture.md` - target system architecture.
- `docs/dev-guide.md` - development guide for future agents and contributors.
- `docs/agent-handoff.md` - concise continuation brief for other coding agents.
- `docs/resource-policy.md` - copyright and asset strategy.
- `docs/roadmap.md` - phased roadmap.

## Product Direction

V0 should be a static, mock-data web prototype:

- LCARS-inspired high-density command surface.
- meWho/Titan.DS-style animated system feel.
- Personal smart-home dashboard as the first screen.
- Mock rooms, devices, events, telemetry, scenes, and AI command logs.
- Minimal Auto Mode so the console feels alive when idle.
- Settings and info overlay skeletons.

Later versions can connect to:

- FastAPI backend.
- WebSocket real-time status.
- SQLite/PostgreSQL.
- MQTT / Mosquitto.
- Home Assistant.
- Whisper or Vosk ASR.
- Piper or browser TTS.
- PWA / local desktop / wall display modes.

## Recommended V0 Stack

- Vite
- React
- TypeScript
- CSS Modules or layered plain CSS
- Web Audio API for original synthesized UI sounds
- No backend for V0

## Run Locally

Install dependencies:

```powershell
npm install
```

Start the dev server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Then open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173
```

## Repository Philosophy

This repository should remain agent-friendly:

- Keep planning docs current.
- Use clear task lists.
- Avoid hidden assumptions.
- Prefer original assets over copied third-party resources.
- Keep V0 simple enough that another agent can resume without needing Codex-specific context.

## Quick Start For Future Work

1. Read `docs/agent-handoff.md`.
2. Read `docs/frontend-agent-brief.md` if working on frontend implementation.
3. Read `docs/v0-plan.md`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Continue from the V0 prototype and keep commits pushed to GitHub.

## Important Legal Note

The reference site and Star Trek/LCARS-adjacent visuals may involve copyrighted or trademarked material. This project should use the references only for design study and should create original UI shapes, diagrams, icons, audio, and imagery.

