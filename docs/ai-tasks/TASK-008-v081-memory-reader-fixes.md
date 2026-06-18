# TASK-008: V0.81 Memory Reader Fixes

Current DEV baseline: `DEV V.0.81`.

Use `npm run sync:dev` after changing `config/dev-version.json` so the UI corner label and the current task baseline stay synchronized.

## Fix Scope

- Memory reader must scroll with the mouse wheel inside the reader pane.
- Clicking a manual outline subsection must scroll the LCARS-native document reader to that subsection.
- The Memory module must stay inside the browser viewport.
- The old PDF page controls should not appear in the native Markdown reader.
- Manual images should render from the local archive API instead of showing placeholder transfer boxes.
- In Memory mode, the lower left rail action blocks become Memory operations: `OPEN INDEX`, `CLOSE READER`, `FILTER RESET`.
- Do not duplicate those action buttons at the bottom of the Memory directory tree.
