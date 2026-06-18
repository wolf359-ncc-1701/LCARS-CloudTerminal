# TASK-009: V0.851 Memory Rail Controls

Current DEV baseline: `DEV V.0.851`.

Use `npm run sync:dev` after changing `config/dev-version.json` so the UI corner label, generated `src/app/devVersion.ts`, and `docs/current-dev.md` stay synchronized.

## Goal

Memory mode should use the left LCARS tile matrix as the file-management control surface. The old bottom action blocks below the vertical meters must not appear in Memory mode.

## Functional Requirements

- In Memory mode, replace the random-looking left tile labels with operational controls.
- Required controls:
  - `OPEN`: open the current Memory index/default item.
  - `CLOSE`: close the active reader.
  - `BACK`: leave the reader or clear local selection.
  - `FIND`: focus the archive search field.
  - `ZOOM+`: increase reader font scale.
  - `ZOOM-`: decrease reader font scale.
  - `MANUAL`: switch source to the TNG manual archive.
  - `WORK`: switch source to project files.
  - `RESET`: clear filters and search.
- Keep the same two-column LCARS tile grammar and color rhythm from the numbered rail matrix.
- Non-Memory modes must keep the original numbered rail matrix and the old lower action buttons.
- Memory mode must not show the lower `OPEN INDEX / CLOSE READER / FILTER RESET` action stack.

## Design Constraints

- Buttons must feel like LCARS color blocks, not web-form buttons.
- Do not add rounded cards or nested panels.
- Keep the left rail width and elbow geometry stable.
- Do not move archive controls back into the right rail.
- Reader zoom must affect only reader document text, not the entire application shell.

## Verification

- `npm run sync:dev`
- `npm run api -- --check`
- `npm run build`
- Confirm Memory mode shows actionable rail tiles and no lower Memory action stack.
