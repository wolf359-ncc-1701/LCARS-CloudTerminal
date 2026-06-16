# Frontend Component Architecture

This document defines the desired V0.5/V0.6 frontend structure. It is a target architecture for the implementation agent.

## Current Problem

The prototype started as a single large `src/App.tsx` with CSS-driven layout. It now needs a clearer LCARS grammar so future modules can be expanded without making the app brittle.

## Target Structure

```text
src/
  app/
    App.tsx
    modes.ts
    appState.ts
  components/
    lcars/
      LcarsShell.tsx
      LcarsRail.tsx
      LcarsBar.tsx
      LcarsElement.tsx
      LcarsElbow.tsx
      LcarsBracket.tsx
      LcarsMeter.tsx
      LcarsStatusDots.tsx
      LcarsReadout.tsx
      LcarsOverlay.tsx
    dashboard/
      BridgeView.tsx
      HomeView.tsx
      EnergyView.tsx
      MemoryView.tsx
      CommandView.tsx
      SystemDiagram.tsx
      TelemetryStack.tsx
      EventLog.tsx
      SceneControls.tsx
  data/
    mock.ts
  hooks/
    useAutoMode.ts
    useMockTelemetry.ts
    usePersistentSettings.ts
    useSynthAudio.ts
  styles/
    tokens.css
    animations.css
    lcars.css
    layout.css
    responsive.css
```

## Component Rules

LCARS components should be semantic, not decorative one-offs.

`LcarsBar`:

- Horizontal or vertical bar segments.
- Optional left/right cap.
- Optional label.
- Uses theme tokens only.

`LcarsElement`:

- Clickable or static unit block.
- Supports color tone, active state, disabled state, compact state.
- Can play synthesized beep through context/hook.

`LcarsElbow`:

- Four directions.
- Used for major LCARS corners and rails.
- Should not hard-code page-specific text.

`LcarsBracket`:

- Frames a module region.
- Allows children.
- Supports title slot and footer slot.

`LcarsReadout`:

- Large numeric/text value.
- Small label.
- Optional accent color and status.

`LcarsMeter`:

- Horizontal and vertical variants.
- Dash/tick styling.
- Numeric value may be shown or hidden.

`SystemDiagram`:

- App-specific special element.
- May use SVG.
- Must remain original, not based on copyrighted ship diagrams.

## State Rules

Global UI state:

- `mode`: `bridge | home | energy | memory | command`
- `alert`: `normal | caution | red`
- `visual`: `default | soft-glow | grayscale | dim`
- `audioEnabled`: boolean
- `autoModeEnabled`: boolean

Root DOM should keep data attributes:

```tsx
<main data-mode={mode} data-alert={alert} data-visual={visual}>
```

## Styling Rules

- Use `tokens.css` for palette and dimensions.
- Use `lcars.css` for reusable LCARS components.
- Use `layout.css` for page-specific composition.
- Use `animations.css` for motion primitives.
- Use `responsive.css` for breakpoints.

Do not put large layout rules inside component files unless the project later moves to CSS Modules.

## V0.5 Priority

For the immediate V0.5 redo, implement enough of this architecture to reduce `App.tsx` complexity and make Bridge view look intentional. Do not attempt a full framework rewrite if it risks breaking the build.

