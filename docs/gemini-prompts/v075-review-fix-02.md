# Gemini Prompt: V0.75 Review Fix 02

Work in this local repository only:

```text
C:\Users\user\Documents\LCARS
```

Stay on the current local branch:

```text
ai/gemini-v075-visual-polish
```

Do not push to GitHub. Do not merge into main.

Codex reviewed commit:

```text
5eb8ccb fix(ui): polish right stack layout and bracket contrast overrides
```

The build passes, but the review did not pass. Please make a small corrective patch only. Do not redesign the UI again.

## Blocking Fixes

### 1. Remove desktop title ellipsis regression

File:

```text
src/styles/layout.css
```

Problem:

```css
.safe-title-zone {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

This violates the V0.75 acceptance criteria. Desktop titles must not show ellipsis such as:

```text
LCARS CLOUD T...
COMMAND MOD...
```

Required:

- Desktop title must show the short title fully.
- Use the existing short labels only:
  - `LCARS CLOUD`
  - `HOME`
  - `ENERGY`
  - `MEMORY`
  - `ACTIONS`
- Remove or override desktop `text-overflow: ellipsis`.
- Keep mobile readable. Mobile may wrap if needed.
- Do not let the title overlap `SYSTEM INDEX / AL-52169`.

### 2. Fix the broken Gemini prompt encoding

File:

```text
docs/gemini-prompts/v075-visual-polish.md
```

Problem:

The file is mojibake/garbled. It is not reliable as a collaboration artifact.

Required:

- Rewrite it as valid UTF-8.
- If Chinese encoding is risky in your environment, rewrite it in plain English ASCII.
- Keep the same task meaning.
- Include the right rail label disappearance blocker.
- Include "do not push GitHub".

### 3. Make right rail color rules more robust

File:

```text
src/styles/layout.css
```

Current fix is directionally correct, but it only covers some color classes.

Required:

- Keep right rail labels visible for inactive and active states.
- Keep quick action labels visible.
- Active state must only change color/contrast, not dimensions.
- Avoid relying on broad descendant selectors or accidental inherited text color.
- Prefer explicit rules scoped to `.right-menu-button` and `.quick-action-button`.

## Allowed Files

Only modify:

```text
src/styles/layout.css
docs/gemini-prompts/v075-visual-polish.md
docs/dev-log.md
```

Do not modify package/config/assets.

## Verification

Run:

```text
npm run build
```

Then report:

- commit hash if you commit locally
- changed files
- whether desktop title ellipsis is gone
- whether right rail labels remain visible

Do not push.
