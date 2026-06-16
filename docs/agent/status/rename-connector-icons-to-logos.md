---
type: status
status: active
created: 2026-06-16
updated: 2026-06-16
author: claude-opus-4-8
branch: ds-fixes
agent: claude-session-2026-06-16-rename-logos
tags: [icons, rename, connector, logo, deprecation]
---

# Executing: rename icon category `connector` → `logo` (non-breaking)

## Scope

`packages/icons` — rename `connectorManifest`/`ConnectorName` →
`logoManifest`/`LogoName` (keep `@deprecated` aliases), widen `IconGlyph`
`kind` union to `'default' | 'logo' | 'connector'`, regenerate
`icon-data.ts` with `logo:` keys, normalize legacy `connector:` lookups in
`IconGlyph.lookupIcon` and `iconToSvgDataUrl`. Plus docs-site iconography
page + `IconCatalog.tsx`, README, tests, and a back-compat test.

## Why

Per spec `docs/superpowers/specs/2026-06-16-rename-connector-icons-to-logos-design.md`
(approved). Category outgrew "connector"; `logo` describes the brand-mark
set more honestly. Non-breaking so external consumers on `connector` names
keep working until 1.0.

## State

Implementation complete on branch `ds-fixes`, awaiting review/commit.
`logoManifest`/`LogoName`/`kind="logo"` canonical; `connectorManifest`,
`ConnectorName`, `kind="connector"`, and `iconToSvgDataUrl('connector:…')`
kept as `@deprecated` aliases (removed at 1.0). `icon-data.ts` regenerated
(241 keys `connector:` → `logo:`). Did NOT touch `ConnectorCard`,
Stepper/Timeline connector lines, or unrelated examples (scope boundary).

Verification gate — all green:

- `pnpm --filter @ship-it-ui/icons build` → 600 icons; only `icon-data.ts`
  changed among tracked generated files.
- icons typecheck + lint + test (21 pass, incl. drift test + new
  `kind="connector"` / `connector:` back-compat tests).
- `docs-site` generate + typecheck pass; `search-index.json` (gitignored)
  picks up the "Logos" heading.
- `@ship-it-ui/shipit` typecheck passes — `ConnectorCard` still compiles
  off the deprecated `ConnectorName` alias (proves non-breaking).

Changeset: `.changeset/rename-connector-icons-to-logos.md` (patch).
