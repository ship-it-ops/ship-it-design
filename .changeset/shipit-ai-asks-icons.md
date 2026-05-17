---
'@ship-it-ui/icons': patch
---

Tighten `<IconGlyph>` typing and add a runtime-dynamic escape hatch:

- `IconGlyphProps['name']` is now `GlyphName | ConnectorName` (previously
  `GlyphName | ConnectorName | string`). Static call-sites get compile-time
  typo catching — names like `caretUp` / `change` / `book` / `analytics` /
  `cluster` that don't exist in the registry now fail typecheck instead of
  silently rendering the literal string.
- New companion export `<DynamicIconGlyph>` accepts `name: string` for the
  runtime case (server payloads, plugin-registered keys). Same render
  behaviour — falls back to the literal name when the glyph isn't
  registered, which is the right behaviour when the name is genuinely
  dynamic.
- `ConnectorCard` switches to `<DynamicIconGlyph>` internally so its public
  `connector: ConnectorName | (string & {})` surface keeps working
  unchanged.

This is a compile-time-only breaking change for any out-of-tree consumer
passing arbitrary strings to `<IconGlyph name=…>`; the fix is a single-line
swap to `<DynamicIconGlyph>`. Per the v0 patch-only convention this ships as
a patch.
