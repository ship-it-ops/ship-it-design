# @ship-it-ui/icons

## 0.0.5

### Patch Changes

- 0796a75: Add `caretUp` (▴) and `caretDown` (⌄) glyphs to complete the caret family —
  previously only `caretLeft` (‹) and `caretRight` (›) existed. Useful for sort
  indicators, dropdown toggles, and collapsible-section affordances. `caretUp`
  uses U+25B4 (BLACK UP-POINTING SMALL TRIANGLE) to stay in the same
  small-triangle family as the existing `expand: '▸'` / `collapse: '▾'` glyphs,
  leaving U+2303 (`⌃`) reserved for the macOS Control-key role when the
  interaction-keys section adds `ctrl` alongside `cmd`, `shift`, `option`, and
  `escape`.

## 0.0.4

### Patch Changes

- 01246b3: Add a `lint:fix` npm script to both packages so `pnpm --filter
@ship-it-ui/icons lint:fix` (and the equivalent for tokens) runs
  `eslint src --fix`. Mirrors the script already present in the other
  publishable packages — no runtime or published-artifact change.

## 0.0.3

### Patch Changes

- 597a705: Adds five new glyphs to the `glyphs` map: `info` (ⓘ), `moreVertical` (⋮),
  `edit` (✎), `copy` (⧉), and `refresh` (↻). Existing glyph names are
  unchanged.

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.

## 0.0.1

### Patch Changes

- 1035968: v0 launch
