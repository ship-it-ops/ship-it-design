---
'@ship-it-ui/icons': patch
---

Add `caretUp` (▴) and `caretDown` (⌄) glyphs to complete the caret family —
previously only `caretLeft` (‹) and `caretRight` (›) existed. Useful for sort
indicators, dropdown toggles, and collapsible-section affordances. `caretUp`
uses U+25B4 (BLACK UP-POINTING SMALL TRIANGLE) to stay in the same
small-triangle family as the existing `expand: '▸'` / `collapse: '▾'` glyphs,
leaving U+2303 (`⌃`) reserved for the macOS Control-key role when the
interaction-keys section adds `ctrl` alongside `cmd`, `shift`, `option`, and
`escape`.
