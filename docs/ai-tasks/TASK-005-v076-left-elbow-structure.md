# TASK-005: V0.76 Left Elbow Structural Fix

## Role

Gemini / Antigravity owns frontend implementation only.

Codex / GPT owns task definition and review.

This is local-first. Do not push to GitHub unless the user explicitly asks.

## Base Branch

Continue from the local V0.75 branch:

```text
ai/gemini-v075-visual-polish
```

Create or switch to a local implementation branch:

```text
ai/gemini-v076-left-elbow
```

## Objective

V0.76 is a narrow visual structure fix. The user's latest screenshot shows the top-left LCARS elbow still reads as a broken/cut frame. The circled area must be rebuilt so it reads as one continuous LCARS corner assembly.

Do not redesign the whole dashboard.

## Problem

The current top-left element visually looks like:

- a separate left vertical strip,
- a separate top horizontal strip,
- a large empty black cavity,
- and a missing/unfinished elbow corner.

It does not read like a continuous LCARS bent rail.

## Required Visual Result

The top-left corner must read as one connected LCARS structure:

- continuous outer radius,
- continuous left vertical rail,
- continuous top horizontal rail,
- deliberate inner black cavity,
- no missing chunk at the curved corner,
- no accidental clipping by parent overflow,
- no visible gap between the elbow, left rail, and top rail area.

The shape should reference the user's PPT LCARS corner language and the Titan DS style, but it must remain original for this project.

## Implementation Guidance

Prefer fixing the reusable primitive and layout relationship instead of adding a one-off patch.

Inspect and adjust:

```text
src/components/lcars/LcarsElbow.tsx
src/app/App.tsx
src/styles/layout.css
src/styles/responsive.css
```

Recommended approach:

- Treat the elbow as a full-size SVG or CSS mask, not a border hack.
- Make the inner cutout explicit and centered by geometry, not by an absolute rectangle that can cut the wrong area.
- Allow the elbow width to fill the left rail column cleanly.
- Tune `railWidth`, `barHeight`, and `outerRadius` as a coordinated set.
- If needed, add a page-specific class such as `.primary-elbow`, but keep the reusable `LcarsElbow` clean.

Avoid:

- Changing dashboard content layout.
- Reworking right rail, views, audio, or data.
- Reintroducing title ellipsis.
- Using broad wildcard color selectors.
- Copying external SVG assets.

## Acceptance Criteria

Run:

```text
npm run build
```

Then visually verify at desktop width:

- The circled top-left area no longer looks broken.
- The outer curve is continuous and smooth.
- The top bar and left vertical rail visually connect.
- The black inner cavity looks intentional.
- The brand block below remains aligned.
- The mode tabs and top rail are not shifted into overlap.
- V0.75 fixes remain intact:
  - no desktop title ellipsis,
  - right rail labels visible,
  - quick action labels visible.

## Allowed Files

```text
src/components/lcars/LcarsElbow.tsx
src/app/App.tsx
src/styles/layout.css
src/styles/responsive.css
docs/dev-log.md
```

Do not modify:

```text
package.json
package-lock.json
vite.config.ts
tsconfig*
src/assets/*
```

## Commit

If committing locally, use:

```text
fix(ui): repair V0.76 left LCARS elbow structure
```

Do not push.
