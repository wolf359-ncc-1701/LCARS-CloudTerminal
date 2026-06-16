# TASK-003: V0.7 Style System Redesign

## Role Split

Gemini / Antigravity owns frontend implementation only.

Codex / GPT owns architecture, design constraints, review, and merge.

Do not change Git strategy, build tooling, package manager, TypeScript config, or repository policy.

## Background

V0.6 improved density, but user review found that the interface still misses the intended LCARS feel in several ways:

- Some typography still falls back to the old look.
- Tabs and many controls are too square.
- Some elements are misaligned.
- Some same-value color combinations are hard to read.
- The top-right title overflows and collides with tabs/module areas.
- The typed command mode does not fit the intended interaction model.

V0.7 should make the design language more deliberate. Use the user's PPT and videos as reference for rounded LCARS forms, negative space, parameter rows, and fast segmented animation. Do not clone the PPT exactly.

Read first:

- `docs/v0.7-reference-analysis.md`
- `docs/style-roadmap-v05-v09.md`
- `docs/resource-policy.md`
- `ASSETS.md`

## Core Goal

V0.7 is a style-system cleanup pass:

1. Fix typography consistency.
2. Replace square tab/card language with rounded LCARS capsule/elbow language.
3. Fix title overflow and visual collisions.
4. Replace typed command mode with direct action execution.
5. Add user-provided response audio.
6. Improve animation primitives based on the PPT videos.

Do not add backend features.

## Required UX Changes

### 1. Replace Command Mode With Action Matrix

User-facing mode label should change:

- From: `COMMAND`
- To: `ACTIONS`

Internal mode ID can remain `command` if that reduces risk, but the user-facing screen must no longer be a command-line input surface.

Remove or hide:

- `ENTER SYSTEM COMMANDS` text input.
- `EXECUTE` input button.
- Syntax reference panel designed around typed commands.

Replace with:

- Direct action grid / action matrix.
- Scene buttons: cinema, sleep, living lights, all lights off.
- System buttons: red alert, resume normal, audio toggle, auto mode toggle, dim display, soft glow.
- Optional module jump buttons.

Each action should be clickable and should produce immediate feedback.

### 2. Fix Tabs

Current top tabs feel like square web tabs. Redesign them as LCARS module selectors:

- Rounded/capsule start or end caps.
- Attached black gutters.
- Unequal segment widths are allowed.
- Active tab should feel like a selected LCARS block, not a generic selected tab.
- Labels must not clip.
- Long mode code labels such as `NCC-01`, `HAB-22`, `EPS-47`, `MEM-09`, `ACT-11` should have fixed positions.

### 3. Fix Top-Right Title Collision

Current top-right titles can overflow and overlap with tabs/right rail.

Implement a safe title zone:

- Constrain title max width.
- Use CSS class, not inline.
- Allow two-line title only when intentional.
- Ensure `LCARS CLOUD TERMINAL`, `HOME MODULE`, `ENERGY MODULE`, `MEMORY MODULE`, `ACTIONS MODULE` do not overlap the right rail or tab strip.
- At narrow widths, reduce font size or stack title above status dots.

### 4. Improve Typography Coverage

Create role-based typography classes:

- `.type-display-title`
- `.type-module-label`
- `.type-numeric`
- `.type-micro-code`
- `.type-body-log`

Use `"LCARS Microgramma"` for display titles, labels, buttons, rail numbers, mode labels, and readouts.

Do not rely on one giant selector list. Refactor gradually toward semantic typography classes.

### 5. Improve Shape Grammar

Add or extend LCARS primitives:

- `LcarsCapsule`
- `LcarsSegmentStack`
- `LcarsActionButton`
- `LcarsMediaFrame`
- `LcarsParameterRow`

You do not have to implement every component as a separate file if that would be too much, but repeated shape patterns should not be one-off inline blocks.

Visual direction:

- More large round caps.
- More thick gutters.
- More black inset windows.
- Fewer generic cards.
- Fewer equal rectangular blocks.
- Preserve high density but reintroduce black breathing space.

### 6. Fix Color Readability

Use explicit text-on-color rules:

- Cyan panel text: dark navy or black where appropriate.
- Orange panel text: black or deep red.
- Dark gray panel text: light gray or cyan.
- Avoid gray text on gray panels when values are close.
- Keep red/orange warning colors readable.

Add tokens if useful:

- `--text-on-cyan`
- `--text-on-orange`
- `--text-muted`
- `--panel-border`

### 7. Add Audio Assets

Use committed user-provided audio files:

- `src/assets/audio/accessinglibrarycomputerdata_clean.mp3`
- `src/assets/audio/computerbeep_29.mp3`
- `src/assets/audio/computerbeep_54.mp3`
- `src/assets/audio/computerbeep_73.mp3`
- `src/assets/audio/processing3.mp3`
- `src/assets/audio/scrscroll3.mp3`

Suggested mapping:

- Soft click: `computerbeep_54.mp3`
- Confirm / mode select: `computerbeep_29.mp3`
- Red alert / urgent: `computerbeep_73.mp3`
- Action execution / scene start: `processing3.mp3`
- Tab/page transition: `scrscroll3.mp3`
- Memory/archive/info access: `accessinglibrarycomputerdata_clean.mp3`

Implementation rules:

- Respect `audioEnabled`.
- Do not autoplay before user interaction.
- Keep volume modest.
- Catch playback failures.
- Keep existing Web Audio synthesis as fallback if needed.
- Avoid hover sounds.

### 8. Update Animation Library

Add or refine CSS motion primitives:

- `rail-snap-in`
- `capsule-slide-in`
- `matrix-decode`
- `text-decode`
- `status-dot-wave`
- `media-frame-open`
- `parameter-row-lock`
- `action-confirm-flash`

Motion style:

- Fast and crisp.
- Segmented mechanical steps.
- 120ms-360ms micro animations.
- Avoid slow full-page fades.
- Idle animations should be subtle.
- Respect `prefers-reduced-motion`.

## Required Implementation Notes

Allowed files:

- `src/app/App.tsx`
- `src/app/modes.ts`
- `src/components/lcars/*`
- `src/components/dashboard/*`
- `src/hooks/useSynthAudio.ts`
- `src/hooks/usePersistentSettings.ts`
- `src/styles/*.css`
- `src/data/mock.ts`
- `docs/dev-log.md`

Avoid modifying:

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig*`
- GitHub settings

## Acceptance Criteria

1. `npm run build` passes.
2. No package/config changes unless explicitly justified.
3. No external runtime assets or CDN calls.
4. User-facing `COMMAND` mode is replaced with `ACTIONS` or equivalent direct action mode.
5. No command text input remains in the primary UI.
6. Top tabs are rounded/capsule LCARS selectors, not generic rectangles.
7. Top-right title no longer overlaps right rail or tab strip.
8. Typography is consistent and uses role-based classes.
9. Audio assets are wired through the existing audio setting.
10. Motion respects `prefers-reduced-motion`.
11. 390px, 768px, 1440px, and 1920px layouts do not visibly overlap.
12. The app still feels like LCARS Cloud Terminal, not a direct clone of the user's PPT.

## Branch And Commit

Work on:

```text
ai/gemini-v07-style-system
```

Recommended commit:

```text
feat(ui): implement V0.7 LCARS style system cleanup
```

Do not merge `main`. Push the branch and report the commit hash for Codex review.
