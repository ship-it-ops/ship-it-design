---
'@ship-it-ui/shipit': patch
---

Four ShipIt-AI gap-closure additions to the entity/list and AI surfaces:

- **`actions` slot on `EntityListRow*`.** Trailing action group for rows that
  need a Datadog deeplink, runbook button, source URL, etc. Renders as a
  peer sibling of the row's interactive label region, mirroring the
  `nested-interactive`-safe pattern already used by `ConnectorCard` and
  `OnboardingChecklist`. When `actions` is absent the rendered DOM is
  unchanged from before. Available on `EntityListRow`, `EntityListRowButton`,
  and `EntityListRowDiv`.
- **New `<EntityList>` container** (folds in the proposed
  `EntityListSection`). Wraps `EntityListRow*` children with a rounded
  border, auto-dividers, and an optional title/subtitle header. Pass
  `collapsible` to render as native `<details>`/`<summary>` for zero-JS
  expand. Keyboard navigation (j/k or arrows) is intentionally not wired
  yet — surface reserved for a follow-up rather than ship a half-built
  version.
- **`<StalenessChip>` promoted into the AI module** alongside
  `ConfidenceIndicator` as the "data trust" component family. Props:
  `ageSeconds`, `thresholds` (default `[3600, 86400]`), `prefix`, `tooltip`.
  Renders a tier-coloured `Badge` with humanised age ("Updated 3h ago"). The
  pure `formatAge(seconds)` helper is also exported for non-chip uses. When
  `tooltip` is provided the chip is wrapped in the `SimpleTooltip`
  convenience.
- **`EntityBadge` size pass-through verified.** Adds a regression test
  asserting `size="sm"` reaches the underlying `<Badge>`. No production
  change; documents the contract.
