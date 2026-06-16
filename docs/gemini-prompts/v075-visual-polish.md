# Gemini Prompt: V0.75 Visual Regression Polish

Please work in the local repository and do NOT push to GitHub:
C:\Users\user\Documents\LCARS

Please create a local branch based on the current V0.7 implementation:
ai/gemini-v075-visual-polish

This is a corrective iteration for V0.75 visual regressions, not a new feature iteration. Refer to:
docs/ai-tasks/TASK-004-v075-visual-regression-polish.md
docs/v0.75-screenshot-regression-analysis.md

CRITICAL BLOCKER TO INVESTIGATE & FIX:
1. Right rail menu and bottom-right quick actions: Color blocks are present but the text is disappeared/invisible or unreadable.
2. Check text colors, inheritance chain, overflow, active state, and the combination of bright backgrounds with dark text.
3. Check if there are overly broad wildcard rules modifying nested panels (e.g. bright brackets turning inner small cards, right rail menu text, or quick action text into black).
4. After fix, the right rail must satisfy:
   - Menu item texts are always visible.
   - Active state only changes colors, not sizes.
   - All items have consistent heights.
   - RED ALERT / RESUME NORMAL / CINEMA MODE do not clip or disappear.

Fix the following visual bugs:
1. Log/event typography is inconsistent; narrow panels wrap log sentences into vertical word stacks.
2. Energy/Power core diagram is meaningless (looks like a black hole). Replace it with an original power distribution / energy-bus diagram.
3. Poor text contrast on cyan, orange, and gray panels.
4. Top-left LCARS elbow is missing/clipped.
5. Top-right title must not display ellipsis (e.g., no "LCARS CLOUD T..." or "COMMAND MOD..."). Use short titles: LCARS CLOUD / HOME / ENERGY / MEMORY / ACTIONS.
6. Right menu and quick action panels must be stable in alignment, size, and readability across different modes.

Constraints:
- DO NOT push to GitHub.
- DO NOT merge main.
- DO NOT change package.json, Vite configuration, or TS configuration.
- DO NOT add new external dependencies.
- DO NOT reintroduce command input box interactions.
- DO NOT remove audio support.

Allowed modifications:
src/app/App.tsx
src/app/modes.ts
src/components/dashboard/*
src/components/lcars/*
src/styles/*.css
docs/dev-log.md

After completion, run:
npm run build

If the build succeeds, commit locally:
fix(ui): polish V0.75 visual regressions

DO NOT push. Report the commit hash, modified files, and confirm the fixes.
