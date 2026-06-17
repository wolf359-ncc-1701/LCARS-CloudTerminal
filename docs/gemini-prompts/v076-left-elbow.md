# Gemini Prompt: V0.76 Left Elbow Structure

Use this local repository:

```text
C:\Users\user\Documents\LCARS
```

Do not push to GitHub. Do not merge main.

Continue from the current V0.75 local state and create or switch to:

```text
ai/gemini-v076-left-elbow
```

Read this task first:

```text
docs/ai-tasks/TASK-005-v076-left-elbow-structure.md
```

This is a narrow V0.76 structural visual fix. Do not redesign the dashboard.

The latest user screenshot shows the top-left LCARS elbow is still broken. The circled area looks like a separated vertical strip plus a separated horizontal strip with a large accidental black hole. It must read as one continuous LCARS bent corner.

Fix only this area unless a tiny supporting style change is required.

Requirements:

- Rebuild the top-left elbow so the outer curve is continuous and smooth.
- Make the left vertical rail and top horizontal rail visually connect as one LCARS structure.
- Keep the inner black cavity deliberate, not like a missing chunk.
- Avoid clipping caused by parent overflow or wrong SVG geometry.
- Keep the brand block aligned below the elbow.
- Do not shift mode tabs or main content into overlap.
- Preserve V0.75 fixes:
  - no desktop title ellipsis,
  - right rail labels visible,
  - quick action labels visible,
  - prompt file remains readable.

Files you may modify:

```text
src/components/lcars/LcarsElbow.tsx
src/app/App.tsx
src/styles/layout.css
src/styles/responsive.css
docs/dev-log.md
```

Do not modify package/config/assets.

Run:

```text
npm run build
```

If it passes, commit locally:

```text
fix(ui): repair V0.76 left LCARS elbow structure
```

Do not push. Report the commit hash and changed files.
