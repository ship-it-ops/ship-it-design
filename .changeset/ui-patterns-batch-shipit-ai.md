---
'@ship-it-ui/ui': patch
---

**Five new primitives + patterns** surfaced by ShipIt-AI's first consumer pass:

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
