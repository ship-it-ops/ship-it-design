# @ship-it-ui/shipit

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
  - @ship-it-ui/ui@0.0.5

## 0.0.4

### Patch Changes

- 01246b3: **`EntityType` is now an open string with a runtime registry.** The six
  built-in types — `service`, `person`, `document`, `deployment`, `incident`,
  `ticket` — keep their visuals unchanged. Consumers can now extend the
  vocabulary without a DS PR:

  ```ts
  import { registerEntityTypes } from '@ship-it-ui/shipit';

  registerEntityTypes({
    repository: {
      glyph: '◆',
      label: 'Repository',
      toneClass: 'text-accent',
      toneBg: 'bg-accent-dim',
      colorVar: 'var(--color-accent)',
      badgeVariant: 'accent',
    },
    pipeline: {
      glyph: '⇄',
      label: 'Pipeline',
      toneClass: 'text-ok',
      toneBg: 'bg-panel-2',
      colorVar: 'var(--color-ok)',
      badgeVariant: 'ok',
    },
  });
  ```

  `EntityBadge`, `EntityCard`, `EntityListRow`, `EntityTable`, `GraphNode`, and
  `GraphLegend` now resolve glyph / label / color through the registry — pass a
  registered string for `type` and the visuals match. Unregistered values fall
  back to the `service` visuals and forward a `data-entity-type` attribute for
  CSS hooking.

  New exports: `getEntityTypeMeta`, `registerEntityType`, `registerEntityTypes`,
  `resetEntityTypeRegistry`, `listEntityTypes`, `EntityTypeMeta`,
  `KnownEntityType`, `EntityBadgeVariant`. `listEntityTypes()` returns the
  registry as `[type, meta]` tuples — `@ship-it-ui/cytoscape` consumes it to
  emit one Cytoscape selector per registered type, so registering a custom
  entity type automatically colors the graph node. The legacy
  `ENTITY_GLYPH`/`ENTITY_LABEL`/`ENTITY_TONE_CLASS`/`ENTITY_TONE_BG` records
  remain for the six built-ins and are marked `@deprecated` in favor of
  `getEntityTypeMeta`.

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

- Updated dependencies [01246b3]
- Updated dependencies [01246b3]
- Updated dependencies [01246b3]
  - @ship-it-ui/icons@0.0.4
  - @ship-it-ui/ui@0.0.4

## 0.0.3

### Patch Changes

- 597a705: `PricingCard` gains an optional `priceUnit` prop for per-period suffixes
  (e.g. `/ user / mo`). The unit renders next to the headline price, baseline-
  aligned, and wraps cleanly when the card is narrow.

  The card now also establishes a CSS container, so the price font-size scales
  with the card's own inline-size rather than the viewport. Three cards
  crowded into a narrow column no longer blow out the layout — the price
  steps down to 22px below the `@sm` container breakpoint.

  **Visual change for existing consumers:** the price is now horizontally
  centered within the card (it was previously left-flush in the implicit
  block layout). This pairs better with the new `priceUnit` slot, but if
  your app relied on the previous left alignment you'll need to override the
  inner price container.

- Updated dependencies [597a705]
  - @ship-it-ui/ui@0.0.3

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.
- Updated dependencies [3b7a79a]
  - @ship-it-ui/ui@0.0.2

## 0.0.1

### Patch Changes

- 1035968: v0 launch
- Updated dependencies [1035968]
  - @ship-it-ui/icons@0.0.1
  - @ship-it-ui/ui@0.0.1
