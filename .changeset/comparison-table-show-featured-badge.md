---
'@ship-it-ui/ui': patch
---

`ComparisonTable`: decouple the auto "recommended" pill from `featured: true`.

The pill, the accent column tint, the accent left/right border, and the
`data-featured="true"` attribute were all gated on the same flag, so consumers
who wanted the column to read as visually distinct **without** the explicit
"recommended" pill had to override DS CSS — and in Tailwind v4 layered setups
that override didn't always win.

New table-level prop `showFeaturedBadge?: boolean` (default `true`) suppresses
the auto pill globally while keeping the tint and border. Per-column
`ComparisonOption.badge` still wins over the table-level toggle:

1. `badge: <node>` on an option → render that node (overrides the toggle).
2. `badge: null` on an option → no pill, even when `featured: true`.
3. `featured: true` + table `showFeaturedBadge !== false` → auto
   "recommended" pill.
4. otherwise → no pill.

JSDoc on `featured` and `badge` now spells out that precedence and warns
that the default "recommended" label can read self-promotional on own-brand
comparisons. No behavior change for existing consumers — `featured: true`
without `badge` and without `showFeaturedBadge` still renders the pill.
