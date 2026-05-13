# @ship-it-ui/ui

## 0.0.5

### Patch Changes

- 40c58e6: Mobile support — first cut. Brings the Claude Design "Mobile Library" into the
  published packages so apps can build touch-targeted surfaces without forking.

  **Tokens** (`@ship-it-ui/tokens`): adds touch sizing (`--touch-min`, `--row-h`,
  `--tabbar-h`, `--navbar-h`, `--screen-pad`, …), mobile-bumped type scale
  (`--font-size-m-body: 15px`, h1 30px, etc.), and mobile radii
  (`--radius-m-card`, `--radius-m-sheet`, `--radius-m-tab`). All additive — no
  desktop variables changed. Bridged into Tailwind as `h-touch`, `text-m-body`,
  `rounded-m-card`, etc.

  **Primitives** (`@ship-it-ui/ui`): new `density="touch"` prop on Button,
  IconButton, Input, SearchInput, Switch, Checkbox, Card, Chip. Swaps the
  component to 44pt-min dimensions consuming mobile tokens; default remains
  `'comfortable'` so no caller breaks.

  **Patterns** (`@ship-it-ui/ui`): new mobile-only patterns — `TabBar` (5-slot
  bottom nav with optional elevated center action), `LargeTitle` (iOS large
  headline + eyebrow), `PullToRefresh` (controlled visual indicator).
  `Topbar` extended with `back`, `eyebrow`, and `density="touch"` for the
  mobile page-header use case. `Drawer` extended with `side="bottom"` + `handle`
  prop to cover bottom-sheet visuals.

  **Domain** (`@ship-it-ui/shipit`): `density="touch"` on AskBar and
  CopilotMessage. New `NotifRow` composite under
  `packages/shipit/src/notifications/` for the mobile Inbox list (no desktop
  sibling).

  Density on the remaining primitives (FAB, SplitButton, Textarea, Select,
  Radio, OTP, Slider, Toast, Tag, StatusDot, Avatar) and the remaining shipit
  composites (GraphNode, EntityListRow, HealthScore) is deferred to a follow-up.

- Updated dependencies [40c58e6]
  - @ship-it-ui/tokens@0.0.5

## 0.0.4

### Patch Changes

- 01246b3: **`ActivityTimeline` variant alongside `Timeline`.** Typed-event timeline
  with `icon`, `actor` (name + avatar slot), `title`, `at` timestamp, and an
  optional collapsed `payload` preview. Renders relative timestamps via the new
  exported `formatRelative(date, now?)` helper. Pass `relativeNow` for
  deterministic SSR / test output. Reuses the shared marker tones from
  `Timeline`.

  **`ConnectorCard` composite for integration hubs (shipit).** Logo (sourced
  from `@ship-it-ui/icons` connector glyphs) + name + status dot + relative
  last-synced timestamp + summary + actions slot. Status drives the dot tone
  (`connected` → ok, `syncing` → sync + pulse, `error` → err,
  `disconnected` → off). When `onClick` is provided the entire card becomes
  keyboard-focusable (`role="button"`, Enter/Space activate); the card's
  own click and key handlers ignore events that originate inside the
  actions slot (matched via a `data-connector-actions` marker), so nested
  action buttons fire on their own without double-triggering the card.

  The package now lists `@ship-it-ui/icons` as a peer dependency.

- 01246b3: **Five new primitives + patterns** surfaced by ShipIt-AI's first consumer pass:
  - **`ScrollArea` component** — Radix-backed scroll viewport with token-styled
    scrollbars. Defaults to `type="hover"` (scrollbars fade in on hover) and
    `orientation="vertical"`; pass `"horizontal"` or `"both"` to enable axis
    scrollbars. Includes a `viewportClassName` escape hatch for the inner
    viewport.
  - **`FilterPanel` pattern** — Multi-facet checkbox filter panel. Pass
    `facets: FilterFacet[]` and the panel renders a header with a reset action
    plus a labelled checkbox group per facet. Each facet is collapsible by
    default. Selections are a `Record<facetId, string[]>` supported in both
    controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
    modes. Per-option `counts` render as trailing tabular numbers.
  - **`WizardDialog` pattern** — Dialog + Stepper + Next/Back footer driven by
    a `steps` array. Each step's `content` may be a node or a render function
    receiving the wizard context (`goNext`, `goBack`, `goTo`, `isFirst`,
    `isLast`). A `canAdvance` predicate gates the Next button per step. The
    last step's Next becomes `Done` and fires `onComplete`.
  - **`HealthScore` pattern** — RadialProgress + delta indicator + optional
    breakdown tooltip. Signed `delta` drives the arrow direction and tone;
    positive flows to `ok`, negative to `err`. When a `breakdown` array is
    supplied the score wraps in a HoverCard revealing per-bucket
    contributions.
  - **`OnboardingChecklist` pattern** — Getting-started task list keyed to
    remote progress. Each item carries a `status` (`pending` /
    `in-progress` / `done`) plus an optional `action` slot. The header shows
    aggregate progress as a token-styled bar; `progressLabel` overrides the
    default "N of M complete" text.

- Updated dependencies [01246b3]
  - @ship-it-ui/tokens@0.0.4

## 0.0.3

### Patch Changes

- 597a705: **`NavBar` pattern (new).** Renders primary app navigation as either a
  horizontal top bar (`orientation="horizontal"`) or a vertical side rail
  (`orientation="vertical"`), driven by a flat `items: NavBarItem[]` tree.
  Items can carry nested `children` to produce dropdowns on horizontal and
  expand-collapse groups on vertical. Below `md` the bar collapses to a
  hamburger that opens a Drawer with the items rendered vertically (set
  `responsive={false}` to opt out). Active state can be controlled
  (`value` + `onValueChange`) or uncontrolled (`defaultValue`); items with
  `href` render as anchors, others as buttons. New exports: `NavBar`,
  `NavBarItem`, `NavBarOrientation`, `NavBarProps`.

  **`Sidebar.NavSection` is now collapsible.** Six new optional props on
  `NavSection`, all backwards-compatible (existing consumers keep the static
  eyebrow):
  - `collapsible` — turns the eyebrow into a button that toggles the body.
  - `open` / `defaultOpen` / `onOpenChange` — controlled and uncontrolled open
    state, mirroring our other disclosure components.
  - `icon` — leading glyph next to the eyebrow.
  - `indent` — pixel indent for nested sections, with a subtle left rail.

  **`Slider` `showValue` follows the thumb when uncontrolled.** Previously the
  displayed number was computed once from `defaultValue` and never updated, so
  only fully-controlled sliders (`value` + `onValueChange`) showed live values.
  The fix tracks the live value internally when uncontrolled and forwards every
  change through `onValueChange`, preserving scalar-vs-array shape.

- Updated dependencies [597a705]
  - @ship-it-ui/tokens@0.0.3

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.
- Updated dependencies [3b7a79a]
  - @ship-it-ui/tokens@0.0.2

## 0.0.1

### Patch Changes

- 1035968: v0 launch
