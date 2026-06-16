# TASK-004: V0.75 Visual Regression Polish

## Role

Gemini / Antigravity owns frontend implementation only.

Codex / GPT owns task definition and review.

This task is local-first for now. Do not push to GitHub unless the user explicitly asks.

## Base Branch

Start from the current V0.7 implementation branch:

```text
ai/gemini-v07-style-system
```

Create a local implementation branch:

```text
ai/gemini-v075-visual-polish
```

## Read First

Read these files before editing:

```text
docs/v0.75-screenshot-regression-analysis.md
docs/v0.7-reference-analysis.md
docs/ai-tasks/TASK-003-v07-style-system-redesign.md
```

## Objective

V0.75 is a corrective polish pass based on the user's screenshots. Do not add major features. Fix the specific visual regressions:

1. Font inconsistency and bad log wrapping.
2. Energy module's unclear core diagram.
3. Low contrast on cyan/orange/gray panels.
4. Missing/cut top-left LCARS elbow corner.
5. Top-right title ellipsis and lingering `COMMAND` wording.
6. Right rail menu size and alignment inconsistency.

## Required Fixes

### 1. Log Typography And Wrapping

Problem:

- Event/log text looks like a different app.
- In narrow panels, sentences wrap into tall word stacks.

Required:

- Introduce compact log styles such as `.event-log.compact` or `.memory-log.compact`.
- Use consistent typography role classes.
- Keep short log entries readable in narrow side panels.
- Do not let log messages break into 5-8 short lines.

Implementation hints:

- Rework `.event-log article` grid for nested/narrow contexts.
- For compact logs, use `grid-template-columns: auto 1fr` or a single-column layout with controlled line clamp.
- Add `line-height`, `min-width: 0`, and sensible `overflow-wrap`.
- If necessary, show timestamp + label prominently and detail as one or two lines.

### 2. Replace Unclear Energy Core

Problem:

- The current energy core looks like an orange block with a black hole.

Required:

- Replace it with an original smart-home power distribution diagram.
- Suggested structure:
  - vertical/circular capacitor stack,
  - central EPS/power bus,
  - output rails to LIGHTING / CLIMATE / MEDIA / STANDBY / AUX,
  - breaker bars and load gates,
  - animated flow pulses.
- Keep it original; do not copy Star Trek warp-core art.

Implementation hints:

- Create a local component if useful, e.g. `EnergyBusDiagram.tsx`.
- Use CSS/SVG primitives.
- Keep labels readable.

### 3. Fix Contrast

Problem:

- Text on cyan/orange/gray blocks is often too low contrast.

Required:

- Apply `--text-on-cyan` and `--text-on-orange` consistently.
- Essential text on bright panels must be dark.
- Essential text on dark panels must be light.
- Decorative micro text may stay muted only if nonessential.

Surfaces to inspect:

- Home room cards.
- Energy distribution panel.
- Action buttons.
- Parameter rows.
- Event logs.

### 4. Repair Top-Left Elbow

Problem:

- The top-left rail appears cut/missing a corner.

Required:

- Make the top-left LCARS elbow continuous.
- Avoid clipping by parent overflow or wrong geometry.
- The internal black cavity should be clean and deliberate.

Implementation hints:

- Prefer a dedicated CSS class or adjust `LcarsElbow`.
- Avoid absolute inset hacks that cut away the wrong piece.
- Test at 1440px and 1920px.

### 5. Remove Desktop Title Ellipsis

Problem:

- Desktop titles still show `LCARS CLOUD T...` or `COMMAND MOD...`.

Required:

- No desktop title ellipsis.
- Use shorter display labels:
  - `LCARS CLOUD`
  - `HOME`
  - `ENERGY`
  - `MEMORY`
  - `ACTIONS`
- Do not show `COMMAND MODULE` in user-facing title.
- Separate title and `SYSTEM INDEX / AL-52169` so they do not collide.
- On mobile, wrapping is acceptable.

Implementation hints:

- Add a mode title map instead of using `${mode.toUpperCase()} MODULE`.
- Avoid `white-space: nowrap` on small widths.
- Desktop can use smaller font rather than ellipsis.

### 6. Stabilize Right Rail Menu

Problem:

- Right menu item heights and active states vary across modes.
- Quick action labels can clip.

Required:

- Fixed menu item heights.
- Active state only changes color/contrast, not dimensions.
- Labels align consistently.
- `RESUME NORMAL` and `CINEMA MODE` must fit.
- Right rail should use CSS classes instead of repeated inline style where practical.

Implementation hints:

- Introduce `.right-menu-button`.
- Use `min-height` and `height` deliberately.
- Use `font-size: clamp(...)` only if needed, not viewport-wide scaling.
- Consider `text-align: right` for rail labels if it better matches LCARS.

## Constraints

Allowed files:

```text
src/app/App.tsx
src/app/modes.ts
src/components/dashboard/*
src/components/lcars/*
src/styles/*.css
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

Do not add new external dependencies.

Do not push to GitHub.

## Acceptance Criteria

Run:

```text
npm run build
```

Then verify:

- No desktop title ellipsis.
- No user-facing `COMMAND MODULE`.
- Right rail menu item sizes remain stable across modes.
- Home and Energy labels are readable.
- Energy diagram communicates power distribution.
- Event logs no longer wrap into unreadable vertical word stacks.
- Top-left elbow is continuous.
- No external resources added.
- No package/config changes.

## Commit

If committing locally, use:

```text
fix(ui): polish V0.75 visual regressions
```

Do not push the commit.
