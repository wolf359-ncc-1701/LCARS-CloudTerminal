# Style Roadmap V0.5-V0.9

This roadmap defines the design-stabilization phase before the project moves into heavier backend/cloud/database features.

## Goal

V0.5-V0.9 should establish a durable LCARS Cloud Terminal visual system:

- Component grammar.
- Shape language.
- Typography roles.
- Animation primitives.
- Audio interaction vocabulary.
- Responsive safety rules.
- Asset governance.

## V0.5 - Component Split And LCARS Grammar

Status: complete.

Purpose:

- Move away from a monolithic prototype.
- Introduce reusable LCARS primitives.
- Establish basic modes and mock telemetry.

Result:

- `src/components/lcars/*`
- Dashboard views.
- Initial shell, rails, meters, readouts, status dots.

## V0.6 - Titan DS Inspired Density

Status: complete.

Purpose:

- Increase operational density.
- Add Microgramma font.
- Add richer topology, energy, memory, and command surfaces.

Result:

- Stronger high-density visual style.
- Better animation primitives.
- More complete mode screens.

Known remaining issues:

- Some elements still look too square.
- Typography coverage is inconsistent.
- Command mode feels unnecessary.
- Some title and tab zones collide.
- Color contrast is uneven.

## V0.7 - Shape, Typography, Action, Audio Cleanup

Status: next.

Purpose:

- Replace square dashboard language with LCARS-style rounded/capsule/elbow grammar.
- Apply typography roles consistently.
- Replace typed command mode with direct action matrix.
- Add user-provided response audio.
- Fix title overflow, tab shape, color readability, and misalignment.

Primary references:

- Current V0.6 screenshots.
- User PPT reference.
- User PPT animation videos.
- `docs/v0.7-reference-analysis.md`

Deliverable:

- A cleaner, more deliberate style system that still keeps Titan DS density.

## V0.8 - Module Semantics And Personal Cloud Metaphor

Purpose:

- Make each mode feel meaningfully different, not just reskinned panels.
- Bridge: system overview and live topology.
- Habitat: rooms, devices, scenes.
- Power: energy bus and load balancing.
- Memory: file/archive/media/data retrieval.
- Actions: one-click command execution and scene control.

Potential work:

- Add a shared `ActionDefinition` model.
- Add a shared `ModuleStatus` model.
- Turn mock data into schema-shaped fixtures that can later map to real services.
- Build a first version of a user-owned data catalog.

## V0.9 - Responsive Polish And Style Freeze

Purpose:

- Freeze the front-end visual grammar before V1 backend work.
- Clean up CSS debt.
- Convert recurring inline layout into CSS classes or components.
- Verify desktop, tablet, and phone.
- Verify accessibility basics and reduced-motion mode.

Exit criteria:

- No obvious overlap at 390px, 768px, 1440px, 1920px.
- No unreadable same-value color combinations.
- No direct external resource calls.
- Asset provenance documented.
- Audio can be disabled.
- Motion respects `prefers-reduced-motion`.
- README and dev docs explain how another agent should continue.

## After V0.9

V1 should shift focus from style discovery to actual system architecture:

- Local-first database.
- Personal cloud sync.
- Auth and device integration.
- File/archive ingestion.
- AI assistant module.
- Local server vs hosted deployment decisions.
