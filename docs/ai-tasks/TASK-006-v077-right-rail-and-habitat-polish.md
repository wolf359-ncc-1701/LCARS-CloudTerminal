# TASK-006: V0.77 Right Rail And Habitat Polish

## Role

Gemini / Antigravity owns frontend implementation only.

Codex / GPT owns task definition and review.

This is local-first. Do not push to GitHub unless the user explicitly asks.

## Base Branch

Continue from the local V0.76 branch:

```text
ai/gemini-v076-left-elbow
```

Create or switch to a local implementation branch:

```text
ai/gemini-v077-right-rail-habitat
```

## Objective

V0.77 fixes five remaining screenshot regressions:

1. Remove the broken `QUICK ACTIONS` block from the right rail.
2. Restore visible labels in the right-side mode rail.
3. Fix Habitat/Home room cards with consistent typography and readable contrast.
4. Sync the `TITAN.LOCAL` info overlay with the current project development state.
5. Refine the top-left corner to match the user's PPT-style LCARS grammar and add the current dev code in the newly created corner space.

This is a corrective visual polish pass, not a redesign.

## Required Fixes

### 1. Remove Quick Actions

Problem:

- The `QUICK ACTIONS` block is clipped and not useful in the current design.
- The user explicitly requested removing it.

Required:

- Remove the bottom-right `QUICK ACTIONS` panel from the UI.
- Remove or safely retire its CSS if unused.
- Do not remove the underlying scene/action functions if other parts still need them.
- The right rail should become a clean mode selector area only.

### 2. Fix Right Rail Labels

Problem:

- The right-side mode rail blocks still render as colored bars, but labels are invisible.

Required:

- Right rail mode labels must be visible for inactive and active states.
- Text must fit inside the right rail item and not sit outside the clipped area.
- Active state should change only color/contrast, not size.
- Do not rely on inherited text color.

Implementation hints:

- Inspect `LcarsElement` rendering and `.right-menu-button` CSS together.
- Consider wrapping the text in a stable child span such as `.right-menu-label`.
- If `LcarsElement` styles fight the right rail, use a more explicit button structure for the right rail only.
- Avoid `justify-content: flex-end` if it pushes text out of the cropped screenshot region.
- Prefer centered or left-aligned labels if that is more robust.

### 3. Fix Habitat Room Cards

Problem:

- Habitat cards still have contrast and typography problems.
- Examples from screenshots:
  - black percentage text disappears inside black circular dials,
  - orange/cyan/gray surfaces use inconsistent text colors,
  - `SLEEP QUARTERS` and `NOMINAL-03` wrap awkwardly,
  - temperature text contains a mojibake degree symbol,
  - inline styles make contrast hard to control.

Required:

- Move important Habitat room-card typography and contrast styling from inline styles into CSS classes.
- Make room title, code, sensor label, percentage, temperature, humidity, sparkline label, and meters readable.
- Use dark text on bright cyan/orange surfaces.
- Use light text on dark gray surfaces.
- The circular dial percentage must always be visible inside the black circle.
- Replace any mojibake degree symbol with a safe display string such as `23.6 C`.
- Keep card proportions stable and LCARS-like.

Implementation hints:

- In `HomeView.tsx`, introduce semantic classes such as:
  - `.room-card-content`
  - `.room-card-header`
  - `.room-card-title`
  - `.room-card-code`
  - `.room-card-dial`
  - `.room-card-dial-value`
  - `.room-card-sensor-label`
  - `.room-card-climate`
  - `.room-card-sparkline-label`
- Use data attributes such as `data-surface="bright"` or `data-status`.
- Do not use broad wildcard selectors such as `.lcars-bracket.color-* *`.

### 4. Sync TITAN.LOCAL Info Overlay With Dev State

Problem:

- The `TITAN.LOCAL` info overlay still describes an old V0.5 grammar state.
- The user wants this panel to reflect the project's current development/dev status.

Required:

- Update the info overlay opened from the `TITAN.LOCAL` info button.
- It should describe the current project as a V0.77 LCARS Cloud Terminal development console.
- It should summarize the current development focus:
  - LCARS grammar and component taxonomy,
  - V0.75 title/right rail readability fixes,
  - V0.76 left elbow structural fix,
  - V0.77 right rail and Habitat polish,
  - local-first multi-agent workflow with Codex as architecture/review and Gemini as frontend implementation.
- Keep it concise and in the same LCARS-style overlay language.
- Do not put long documentation text into the main dashboard.

### 5. Refine Titan-Style Corner Label Placement

Problem:

- The top-left corner is closer after V0.76, but the user wants the corner grammar to match the PPT reference more closely.
- The desired corner is not a uniform tube. It should feel like a wider lower/left rail turning into a narrower right/top segment.
- The first V0.77 attempt placed `DEV V.0.77` inside the black inner cavity. That is wrong.
- The label should follow the user's Titan DS reference: text sits inside the gray LCARS structural material near the lower-left/bottom area of the elbow block, like a panel identity label.

Required:

- Refine the top-left LCARS corner so it reads like the user's PPT style:
  - thicker lower/left body,
  - narrower right/top continuation,
  - smooth continuous turn,
  - deliberate black inner cavity.
- Add visible development code text inside the gray LCARS structural panel area, not floating in the black cavity:

```text
DEV V.0.77
```

- The text should visually behave like the Titan DS `TITAN.DS` label in the reference screenshot:
  - positioned near the lower-left/bottom portion of the elbow block,
  - inside gray material,
  - horizontally readable,
  - paired naturally with the small info button if possible.
- Do not place the label inside the black inner cutout.
- Do not make it an orange floating label in the empty black area.
- The text must not overlap the mode tabs, brand block, or main stage.
- The dev code should use the LCARS font role and remain readable at desktop size.
- Preserve the V0.76 continuity improvement.

## Preserve Existing Fixes

Do not break:

- V0.76 left elbow structure.
- V0.75 desktop title no-ellipsis fix.
- Audio support.
- Main mode navigation.

## Allowed Files

```text
src/app/App.tsx
src/components/lcars/LcarsElbow.tsx
src/components/dashboard/HomeView.tsx
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

## Verification

Run:

```text
npm run build
```

Then visually verify:

- Right rail labels are visible.
- `QUICK ACTIONS` is gone.
- Habitat cards are readable on cyan, orange, and gray cards.
- Dial percentages are visible.
- `TITAN.LOCAL` info overlay reflects V0.77/current dev status.
- Top-left corner follows the Titan/PPT-style wider-body/narrower-extension grammar.
- `DEV V.0.77` appears inside the gray corner material area, not inside the black cavity, and does not overlap other UI.
- No title ellipsis regression.
- Left elbow remains continuous.

## Commit

If committing locally, use:

```text
fix(ui): polish V0.77 right rail and habitat cards
```

Do not push.
