# AI Collaboration Workflow

This project can be worked on by multiple AI clients, but they should not coordinate through chat transcripts. The stable coordination surface is Git, branches, task files, and review notes.

## Roles

Codex / GPT:

- Owns product direction.
- Writes task specs.
- Defines architecture and acceptance criteria.
- Reviews implementation diffs.
- Performs final integration and GitHub push when needed.

Gemini / Antigravity:

- Implements frontend tasks.
- Works from task files only.
- Keeps changes scoped.
- Runs build verification.
- Commits implementation work on a task branch.

User:

- Chooses priorities.
- Starts each client.
- Approves final merge direction.

## Recommended Branch Model

Main branch:

- `main`
- Must remain buildable.
- Only reviewed changes should land here.

Task branches:

- `ai/gemini-v05-redesign`
- `ai/gemini-component-refactor`
- `ai/codex-review-fixes`

If Antigravity is pointed at the same working directory as Codex, do not let both tools edit at the same time. Finish one tool's turn, commit or discard its work, then let the other tool inspect.

Safer advanced setup:

```powershell
git fetch origin
git switch main
git pull
git worktree add -b ai/gemini-v05-redesign ..\LCARS-gemini main
git worktree add -b ai/codex-review ..\LCARS-review main
```

Use the Gemini worktree for implementation and the review worktree for Codex review.

## Task File Protocol

Every frontend implementation task should have a file under:

```text
docs/ai-tasks/
```

The task file must define:

- Context.
- Files Gemini may edit.
- Files Gemini should not edit.
- Exact implementation requirements.
- Acceptance criteria.
- Commit instructions.
- Review checklist.

Gemini should be instructed to read the task file and implement only that task.

## Review Protocol

After Gemini finishes:

1. Confirm its branch and commits:

   ```powershell
   git status --short --branch
   git log --oneline -5
   ```

2. If it worked in a scratch clone, push its branch:

   ```powershell
   git push -u origin ai/gemini-v05-redesign
   ```

3. Codex reviews diff against `main`:

   ```powershell
   git fetch origin
   git diff --stat main..ai/gemini-v05-redesign
   git diff main..ai/gemini-v05-redesign
   npm run build
   ```

4. Codex either:

   - Approves and merges.
   - Requests fixes.
   - Applies minimal review fixes and commits them.

## No-Go Rules

- Do not allow Gemini to push directly to `main` unless explicitly requested.
- Do not let two agents modify the same working tree concurrently.
- Do not use copied Titan.DS/Star Trek assets.
- Do not add runtime network dependencies for V0/V0.5.
- Do not let implementation agents change the product scope without updating the task file.

## Current Immediate Task

Use:

```text
docs/ai-tasks/TASK-001-v05-frontend-redesign.md
```

Gemini should implement it on:

```text
ai/gemini-v05-redesign
```

Codex will review after Gemini commits.

