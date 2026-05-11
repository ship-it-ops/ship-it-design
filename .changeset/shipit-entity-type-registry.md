---
'@ship-it-ui/shipit': patch
---

**`EntityType` is now an open string with a runtime registry.** The six
built-in types — `service`, `person`, `document`, `deployment`, `incident`,
`ticket` — keep their visuals unchanged. Consumers can now extend the
vocabulary without a DS PR:

```ts
import { registerEntityTypes } from '@ship-it-ui/shipit';

registerEntityTypes({
  repository: {
    glyph: '◆', label: 'Repository',
    toneClass: 'text-accent', toneBg: 'bg-accent-dim',
    colorVar: 'var(--color-accent)', badgeVariant: 'accent',
  },
  pipeline: {
    glyph: '⇄', label: 'Pipeline',
    toneClass: 'text-ok', toneBg: 'bg-panel-2',
    colorVar: 'var(--color-ok)', badgeVariant: 'ok',
  },
});
```

`EntityBadge`, `EntityCard`, `EntityListRow`, `EntityTable`, `GraphNode`, and
`GraphLegend` now resolve glyph / label / color through the registry — pass a
registered string for `type` and the visuals match. Unregistered values fall
back to the `service` visuals and forward a `data-entity-type` attribute for
CSS hooking.

New exports: `getEntityTypeMeta`, `registerEntityType`, `registerEntityTypes`,
`resetEntityTypeRegistry`, `EntityTypeMeta`, `KnownEntityType`,
`EntityBadgeVariant`. The legacy `ENTITY_GLYPH`/`ENTITY_LABEL`/
`ENTITY_TONE_CLASS`/`ENTITY_TONE_BG` records remain for the six built-ins and
are marked `@deprecated` in favor of `getEntityTypeMeta`.
