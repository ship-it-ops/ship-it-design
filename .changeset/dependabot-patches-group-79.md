---
'@ship-it-ui/cytoscape': patch
'@ship-it-ui/graph-editor': patch
'@ship-it-ui/icons': patch
'@ship-it-ui/map': patch
'@ship-it-ui/next': patch
'@ship-it-ui/shipit': patch
---

Bump dev dependencies via dependabot patches group (#79):

- `react` / `react-dom` 19.2.6 → 19.2.7 (fixes a `FormData`-entries
  regression introduced in 19.2.6's Server Actions; also backported in
  `next@16.2.7` as "Don't drop FormData entries").
- `@types/react` 19.2.15 → 19.2.16.
- `@iconify-json/simple-icons` 1.2.84 → 1.2.85 (icons only).

Dev-only bumps; published tarballs are functionally unchanged. Five of
these packages (cytoscape, graph-editor, map, next, shipit) would
patch-cascade alongside `@ship-it-ui/ui` regardless per
`updateInternalDependencies`; the explicit entry exists so the
changeset-required gate sees coverage for the bundled dependabot patch
group, and so `icons` (which isn't a ui-dependent and wouldn't cascade)
picks up the upstream alignment.
