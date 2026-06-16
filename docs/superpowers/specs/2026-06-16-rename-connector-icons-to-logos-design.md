# Rename icon category `connector` → `logo` (non-breaking)

Date: 2026-06-16
Status: approved (design); pending implementation
Package: `@ship-it-ui/icons` (+ docs-site consumer)

## Goal

Rename the icons package's brand-logo category from `connector` to `logo`. The
category has grown well beyond "data-source connectors" (recent influx of
social, tech, and car-manufacturer brand marks), so `logo` now describes it
more honestly. Ship it as a **non-breaking** change: new `logo` names are
canonical, old `connector` names continue to work as `@deprecated` aliases.

## Scope boundary (critical)

"connector" is overloaded across the repo. This rename touches **only the icon
category**. It must NOT touch:

- `@ship-it-ui/shipit` `ConnectorCard` (`packages/shipit/src/data/ConnectorCard.tsx`,
  its docs page `apps/docs-site/app/(docs)/shipit/connector-card/`, and examples).
- `@ship-it-ui/ui` connector-line references in `Stepper`, `Timeline`,
  `structuredData`.
- Example files that use `ConnectorCard` (wizard-dialog, footer, alert,
  onboarding-checklist, mobile-screens, timeline).

The only icon-category consumers in the docs site are the iconography page and
`IconCatalog.tsx`.

## Naming

Mirror the existing `glyph` vocabulary (`glyphManifest` / `GlyphName`):

| Old (now deprecated alias)   | New (canonical) |
| ---------------------------- | --------------- |
| `connectorManifest`          | `logoManifest`  |
| `ConnectorName`              | `LogoName`      |
| `kind="connector"`           | `kind="logo"`   |
| data-key prefix `connector:` | `logo:`         |

Docs heading `## Connector logos` → `## Logos` (keep the "brand marks" copy).

## Backward compatibility

Chosen strategy: **rename + deprecated aliases** (non-breaking; aliases removed
at 1.0). The package is pre-1.0 (`0.0.x`), but a clean alias layer costs little
and protects any external consumer already on the `connector` names.

1. **Exports** — `logoManifest` / `LogoName` are canonical. Keep
   `export const connectorManifest = logoManifest` and
   `export type ConnectorName = LogoName`, both `@deprecated` with a
   "use logoManifest/LogoName" note.
2. **`kind` prop** — union becomes `'default' | 'logo' | 'connector'`. `connector`
   is `@deprecated`. `lookupIcon` normalizes **both** `'logo'` and `'connector'`
   to the `logo:` data key, so old callers keep resolving.
3. **Generated data keys** — `icon-data.ts` is regenerated with `logo:` keys
   only (no dual keys — the legacy `kind` maps onto them at lookup time, keeping
   the data file from doubling).
4. **`iconToSvgDataUrl`** — a literal `connector:<name>` argument still resolves
   by mapping a leading `connector:` to `logo:` before lookup. Update the JSDoc
   to document `logo:<name>` as canonical.
5. **Back-compat test** — explicit coverage that `kind="connector"`,
   `connectorManifest`, and a `connector:`-prefixed data-url name all still
   resolve to the same icon as their `logo` equivalents.

## Files to touch

### `packages/icons` (rename core)

- `src/icon-manifest.ts` — rename `connectorManifest` (line 489) → `logoManifest`
  and `ConnectorName` (line 807) → `LogoName`; add the two deprecated aliases;
  fix the header doc comment (lines 5–13) that references `ConnectorName` /
  `kind="connector"` / "brand logos for connectors".
- `src/IconGlyph.tsx` — `kind` union + `@deprecated` note on `connector`;
  `lookupIcon` normalizes `'logo'|'connector'` → `logo:`; import `LogoName`
  (keep `name: GlyphName | LogoName`); update the `kind` JSDoc and the
  `kind="connector"` usage example.
- `src/index.ts` — export `logoManifest` / `type LogoName` (canonical) and keep
  deprecated `connectorManifest` / `ConnectorName` re-exports.
- `scripts/build-icon-data.ts` — import `logoManifest`; the second loop emits
  `logo:${name}` keys; update the error-prefix string (`connector "..."` →
  `logo "..."`).
- `src/icon-data.ts` — **regenerated** by the build. The 241 `connector:` keys
  become `logo:` keys; sort order shifts. Verified by the drift test.
- `scripts/build-icon-data.test.ts` — update `connector:` assertions → `logo:`.
- `src/IconGlyph.test.tsx` — switch primary tests to `kind="logo"`; add
  back-compat test for `kind="connector"`.
- `src/icon-to-data-url.ts` — fallback `iconData[`connector:${name}`]` →
  `logo:`; add legacy `connector:` literal normalization; update JSDoc.
- `src/icon-to-data-url.test.ts` — update connector assertions + a legacy case.
- `README.md` — connector→logo wording (6 refs); add one line on the deprecated
  alias.

### `apps/docs-site` (icon-category consumers only)

- `app/(docs)/foundations/iconography/page.mdx` — import `logoManifest`;
  `## Connector logos` → `## Logos`; `logoItems` via `Object.keys(logoManifest)`;
  `kind: 'logo'`; `searchPlaceholder="Search logos…"`; the inline
  `<IconGlyph kind="connector" name="github" />` example (line ~182) → `kind="logo"`.
- `components/docs/IconCatalog.tsx` — the item `kind` literal `'connector'` →
  `'logo'` (still tolerate `'connector'` if the type is a union, since data
  resolves either way).
- `public/search-index.json` — **regenerated** via `pnpm --filter docs-site generate`
  (or repo `pnpm generate`), not hand-edited.

## Out of scope

`ConnectorCard` and all its docs/examples; `Stepper`/`Timeline`/`structuredData`
connector-line refs; unrelated example files. No changes to `packages/ui` or
`packages/shipit`.

## Changeset

One `patch` changeset for `@ship-it-ui/icons` (per the v0.0.x patch policy —
features and renames stay `patch` while pre-1.0). `docs-site` is not published.
Describe it as: "Rename the `connector` icon category to `logo`; the old
`connectorManifest` export and `kind=\"connector\"` continue to work as
deprecated aliases."

## Verification gate

1. `pnpm --filter @ship-it-ui/icons build` — regenerates `icon-data.ts`.
2. `git status --short` — confirm the ONLY generated file that changed is
   `src/icon-data.ts` (codegen-drift scar tripwire). If anything else regenerated
   unexpectedly, stop.
3. `pnpm --filter @ship-it-ui/icons typecheck && ... lint && ... test` — full
   icons suite incl. the new back-compat test.
4. `pnpm --filter docs-site generate` then typecheck docs-site so the
   iconography page + search index pick up `logoManifest`.

## Risks / notes

- The drift test (`build-icon-data.test.ts`) is the safety net: if the manifest
  loop and the generated keys disagree, it fails CI. Update its expectations in
  lockstep (see `icons-readme-codegen-drift` + `drift-test-for-codegen`).
- Keep `name: GlyphName | LogoName` typed — don't widen to `string`; static
  typo-catching on `<IconGlyph>` is a deliberate feature.
