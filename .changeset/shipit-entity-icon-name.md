---
'@ship-it-ui/shipit': patch
---

`EntityTypeMeta.iconName` replaces the deprecated `glyph` field. Every
registered entity type now declares an icon name from `@ship-it-ui/icons`
(any string — registered names resolve to SVG via `IconGlyph`,
unregistered ones render as centered SVG text). The six built-ins
(`service`, `person`, `document`, `deployment`, `incident`, `ticket`) now
render through `<IconGlyph>` in `EntityBadge`, `EntityListRow`,
`EntityCard`, `GraphNode`, and `EntityTable.entityColumn`.

**Removed (breaking for any external consumer that registered custom
types or read the deprecated maps)**:

- `EntityTypeMeta.glyph` field — drop unicode chars from custom-type
  registrations; set `iconName` instead. Pass any string — the icons
  package falls back to text rendering for names it doesn't know.
- `ENTITY_GLYPH` deprecated export.

**Migration for custom entity types**:

```ts
// Before
registerEntityType('repository', {
  glyph: '◆',
  label: 'Repository',
  // …
});

// After
registerEntityType('repository', {
  iconName: 'brand', // any name from @ship-it-ui/icons, or any string for text fallback
  label: 'Repository',
  // …
});
```

Visual: built-in entity types look noticeably crisper at small sizes (no
more box-drawing characters rendering inconsistently across OS font
stacks).
