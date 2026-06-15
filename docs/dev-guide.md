# Development Guide

This guide is written for future coding agents and contributors.

## Current Repo State

The repo currently contains planning documents only. There is no application scaffold yet.

Recommended first implementation step:

```powershell
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

If the repo already has app files when you read this, inspect the package scripts first.

## V0 Implementation Rules

- Build the real app surface, not a marketing page.
- First screen should be the LCARS home bridge dashboard.
- Use mock data only.
- Do not connect real devices.
- Do not require network access at runtime.
- Use original UI assets.
- Keep Star Trek-specific names out of app-facing core names unless clearly user-owned/fan-project context is intended.

## Suggested File Structure

```text
src/
  app/
    App.tsx
    modes.ts
  components/
    lcars/
      LcarsShell.tsx
      LcarsButton.tsx
      LcarsPanel.tsx
      LcarsMeter.tsx
      LcarsStatusDots.tsx
    dashboard/
      BridgeView.tsx
      HomeView.tsx
      EnergyView.tsx
      MemoryView.tsx
      CommandView.tsx
  data/
    rooms.ts
    devices.ts
    events.ts
    scenes.ts
    telemetry.ts
  hooks/
    useAutoMode.ts
    useMockTelemetry.ts
    useSynthAudio.ts
  styles/
    tokens.css
    layout.css
    lcars.css
    animations.css
    responsive.css
```

## CSS Principles

Use layered CSS:

1. `tokens.css` for colors, fonts, timing, sizes.
2. `layout.css` for shell layout.
3. `lcars.css` for reusable shapes.
4. `animations.css` for motion primitives.
5. `responsive.css` for smaller screens.

Root state should be reflected in data attributes:

```tsx
<main data-mode={mode} data-alert={alert} data-visual={visual}>
```

This mirrors the reference's state-machine style while keeping the implementation original.

## Motion Principles

Implement small reusable animations:

- Soft blink.
- Hard blink.
- Data dash flow.
- Meter pulse.
- Scan line.
- Panel enter.
- Red alert bars.

Avoid giant one-off animations in components. Compose primitives.

## Accessibility And Control

Even though the UI is visual and dense:

- Buttons must be keyboard reachable.
- Provide a mute toggle.
- Provide reduced motion handling through `prefers-reduced-motion`.
- Avoid text that overflows buttons on mobile.
- Keep contrast high.

## Verification Checklist

Before calling V0 complete:

- App launches with `npm run dev`.
- No console errors.
- Desktop layout is complete.
- Mobile layout is usable.
- Buttons have hover/active/focus states.
- Auto Mode starts after idle and exits on user input.
- Red alert toggles on and off.
- Settings overlay opens and closes.
- No third-party copyrighted assets are committed.

