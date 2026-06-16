---
'@ship-it-ui/icons': patch
---

Add automotive + premium glyphs and solid icon variants, and harden the
post-rename logo lookup.

- New glyphs: `brakeDisc`, `tire`, `suspension` (via Solar, a new
  `@iconify-json/solar` source), and `gem`.
- New solid/filled glyph names sourced from Phosphor's `fill` weight —
  `phoneFill`, `starFill`, `heartFill`, `bellFill` — since the stroke-first
  default set (Lucide) has no filled weight.
- `IconGlyph` `kind` now discriminates the valid `name` set: `kind="logo"`
  (or the deprecated `kind="connector"`) requires a `LogoName`, default requires
  a `GlyphName`. Mismatches like `<IconGlyph kind="logo" name="ask" />` are now a
  compile error instead of silently rendering the empty text fallback.
- `iconToSvgDataUrl` lookup JSDoc corrected: a bare name resolves to a semantic
  glyph first, so addressing a brand logo unambiguously requires the explicit
  `logo:<name>` prefix (five names — `box`, `github`, `pagerduty`, `signal`,
  `snowflake` — exist in both namespaces).
