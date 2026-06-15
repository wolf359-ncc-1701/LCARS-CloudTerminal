# Frontend Agent Brief

This brief is intended for another frontend-focused agent, such as Gemini, continuing the LCARS Cloud Terminal UI.

## Role

You are the frontend implementation agent.

Codex owns:

- Product direction.
- Architecture.
- Scope control.
- Acceptance criteria.
- Repository handoff docs.

Your job is to improve the React/Vite frontend implementation within these constraints.

## Project Goal

Build an original LCARS-inspired personal smart-home command center.

The UI should feel like:

- A high-density sci-fi operations console.
- A local home/AI "bridge" system.
- Inspired by LCARS and meWho/Titan.DS interaction density.

It should not become:

- A direct clone of Titan.DS.
- A Star Trek asset reproduction.
- A generic SaaS dashboard with orange styling.
- A landing page.

## Required Reading

Before editing code, read:

- `README.md`
- `docs/agent-handoff.md`
- `docs/v0-plan.md`
- `docs/v0.5-lcars-grammar.md`
- `docs/titan-ds-style-analysis.md`
- `docs/resource-policy.md`
- `docs/dev-guide.md`
- `docs/dev-log.md`

## Current Stack

- Vite
- React
- TypeScript
- Plain layered CSS
- Mock data only
- No backend yet

Run:

```powershell
npm install
npm run dev
npm run build
```

## Hard Constraints

- Do not add copyrighted third-party assets.
- Do not download or commit Titan.DS resources.
- Do not add Star Trek logos, ship diagrams, faction emblems, or official LCARS art.
- Do not introduce a backend.
- Do not replace the project stack.
- Do not turn the first screen into a marketing/landing page.
- Keep `npm run build` passing.
- Commit changes to `main` with clear messages.

## V0.5 Design Problem

The current V0.5 is closer, but it still needs more LCARS grammar and less dashboard feel.

Primary issues:

- `src/App.tsx` is too large and should be split into components.
- The Bridge view still has too much empty negative space in some viewport sizes.
- LCARS elements are not yet formalized as reusable components.
- Main display visuals need stronger hierarchy: frame, brackets, telemetry, controls, system diagram.
- Mobile layout is functional but not designed as a true LCARS mobile grammar.

## Target Component Architecture

Refactor toward:

```text
src/
  app/
    App.tsx
    modes.ts
  components/
    lcars/
      LcarsShell.tsx
      LcarsBar.tsx
      LcarsElement.tsx
      LcarsElbow.tsx
      LcarsBracket.tsx
      LcarsMeter.tsx
      LcarsStatusDots.tsx
      LcarsReadout.tsx
    dashboard/
      BridgeView.tsx
      HomeView.tsx
      EnergyView.tsx
      MemoryView.tsx
      CommandView.tsx
      SystemDiagram.tsx
      TelemetryStack.tsx
      EventLog.tsx
  data/
  hooks/
  styles/
```

Do not over-abstract prematurely. Extract components when they correspond to the LCARS grammar:

- Bar
- Element
- Elbow
- Bracket
- Text box/readout
- Meter
- Status dots
- Special visual element

## Visual Requirements

Bridge view should include:

- Dense LCARS left rail.
- Segmented top bars.
- Main framed display with bracket/elbow geometry.
- Active module navigation.
- System diagram in the main display.
- Telemetry stack.
- Event/status log.
- Bottom control strip.
- Scene buttons.
- Red alert state.

The UI should use:

- Large black background areas.
- Strong structural gray blocks.
- Cyan for system/telemetry.
- Orange/red for alerts and action states.
- Small random-looking numbers and indicators.
- Lots of tiny status lights, but not enough to hurt readability.

## Interaction Requirements

Keep or improve:

- Mode switching.
- Red Alert toggle.
- Settings overlay.
- Info overlay.
- Command parser mock.
- Auto Mode skeleton.
- Synthesized sounds and mute.

Suggested additions:

- Persist settings in `localStorage`.
- Add visible module intro animation.
- Add `?mode=bridge|home|energy|memory|command` support.
- Add an Info Overlay that visually labels LCARS element categories.

## Acceptance Criteria

Before committing:

- `npm run build` passes.
- No TypeScript errors.
- No console errors in browser.
- Desktop viewport looks intentionally dense, not sparse.
- Mobile viewport is usable and not text-overlapping.
- No third-party copyrighted assets are added.
- README/dev-log updated if behavior changes.

## Preferred Commit Style

Use small commits:

- `Refactor LCARS components`
- `Improve bridge display density`
- `Add persistent settings`
- `Polish mobile LCARS layout`

Each commit should be buildable.

