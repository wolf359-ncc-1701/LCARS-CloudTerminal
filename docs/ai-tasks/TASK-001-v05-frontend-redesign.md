# TASK-001: V0.5 Frontend Redesign

Owner: Gemini / Antigravity  
Reviewer: Codex / GPT  
Branch: `ai/gemini-v05-redesign`

## Context

The project is an original LCARS-inspired personal smart-home command center. Codex created the initial architecture and V0/V0.5 prototype. The current UI is functional but still feels too much like a themed dashboard rather than a mature LCARS control surface.

Your job is to implement a focused V0.5 frontend redesign using reusable LCARS components and the existing React + TypeScript + Vite stack.

## Required Reading

Read these before editing:

- `README.md`
- `docs/frontend-agent-brief.md`
- `docs/component-architecture.md`
- `docs/v0.5-lcars-grammar.md`
- `docs/titan-ds-style-analysis.md`
- `docs/resource-policy.md`
- `docs/dev-guide.md`

## Scope

You may edit:

- `src/App.tsx`
- `src/components/**`
- `src/app/**`
- `src/styles/**`
- `src/hooks/**` only if needed for UI state/audio/settings
- `docs/dev-log.md`

You may create:

- LCARS component files under `src/components/lcars/`
- Dashboard view files under `src/components/dashboard/`
- App state/mode files under `src/app/`
- A short implementation note if useful

Do not edit:

- `package.json` unless absolutely necessary
- `package-lock.json` unless dependencies are intentionally changed
- `vite.config.ts`
- `tsconfig*.json`
- `docs/resource-policy.md`
- unrelated planning docs

## Hard Constraints

- Do not copy or download Titan.DS resources.
- Do not use Star Trek logos, ship drawings, faction emblems, official LCARS art, MP3s, WebPs, or SVGs.
- Do not add runtime network dependencies.
- Do not import Google Fonts or other external CSS at runtime.
- Do not add a backend.
- Do not introduce a large UI framework.
- Keep `npm run build` passing.
- Keep the app usable without internet after dependencies are installed.

## Design Target

Use the LCARS grammar described in `docs/v0.5-lcars-grammar.md`.

The UI should feel more like:

- A dense operations console.
- A reusable LCARS component system.
- A home/AI command bridge with live mock telemetry.

It should feel less like:

- A generic dashboard.
- A static mockup.
- A direct Titan.DS clone.

## Required Implementation

### 1. Componentize LCARS Grammar

Create or refine reusable components:

- `LcarsBar`
- `LcarsElement`
- `LcarsElbow`
- `LcarsBracket`
- `LcarsMeter`
- `LcarsStatusDots`
- `LcarsReadout`
- `LcarsOverlay`

Keep component APIs simple. Use string union props for tone/direction/variant where helpful.

### 2. Refactor App Structure

Reduce `src/App.tsx` responsibility.

Preferred structure:

```text
src/app/App.tsx
src/app/modes.ts
src/components/lcars/*
src/components/dashboard/*
```

If moving `App.tsx`, keep `src/main.tsx` import working.

### 3. Bridge View Redesign

Bridge view is the most important screen.

It must include:

- LCARS left rail.
- Segmented top rail / double bar.
- Main bracketed display.
- System diagram.
- Telemetry stack.
- Recent event/status log.
- Scene control strip.
- Bottom telemetry/control strip.
- Red alert visual state.

Reduce large empty areas. Add readable density, not random clutter.

### 4. System Diagram

Implement an original abstract home/system network diagram.

Allowed:

- SVG nodes/lines.
- CSS animation.
- Canvas if kept simple.

Required:

- Hover/focus state for nodes.
- Mock tooltip/readout for room/device telemetry.
- Animated data flow lines.

Do not use ship silhouettes or copied diagrams.

### 5. Settings And Info

Keep existing settings and info overlays functional.

Preferred improvements:

- Persist settings with `localStorage`.
- Info overlay should explain LCARS element categories in-app.

### 6. Responsive Behavior

Check at:

- 390px mobile
- 768px tablet
- 1440px desktop

Do not allow text overlap in buttons, rails, cards, or readouts.

## Acceptance Criteria

Before final response:

- `npm run build` succeeds.
- No TypeScript errors.
- No new runtime network imports.
- No third-party copyrighted assets committed.
- UI remains usable with existing mock data.
- `docs/dev-log.md` is updated with what changed.
- Changes are committed to `ai/gemini-v05-redesign`, not directly to `main`, unless the user explicitly asks otherwise.

## Commit Guidance

Use small commits:

1. `feat(ui): add reusable LCARS component grammar`
2. `style(layout): redesign shell density and rails`
3. `feat(views): rebuild bridge view with system diagram`

If fewer commits are more natural, that is fine, but each commit should build.

## Final Response Required From Gemini

Report:

- Branch name.
- Commit hashes.
- Files changed.
- Whether `npm run build` passed.
- Any known limitations.
- Whether anything needs Codex review.

