# @ship-it-ui/map

## 0.0.8

### Patch Changes

- 19b6dbd: Bump dev dependencies via dependabot patches group (#79):
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

- Updated dependencies [19b6dbd]
- Updated dependencies [19b6dbd]
- Updated dependencies [19b6dbd]
  - @ship-it-ui/ui@0.0.14
  - @ship-it-ui/icons@0.0.12

## 0.0.7

### Patch Changes

- Updated dependencies [a8ebcce]
- Updated dependencies [a8ebcce]
- Updated dependencies [a8ebcce]
  - @ship-it-ui/ui@0.0.13

## 0.0.6

### Patch Changes

- Updated dependencies [206fa53]
- Updated dependencies [206fa53]
  - @ship-it-ui/ui@0.0.12

## 0.0.5

### Patch Changes

- a793daa: Bump devDependency `maplibre-gl` 4.7.1 → 5.24.0. The package's
  peerDependency range already declared `^4.0.0 || ^5.0.0` — consumers
  on v5 were already supported. No source changes; build output
  unchanged.
- Updated dependencies [a793daa]
- Updated dependencies [a793daa]
  - @ship-it-ui/ui@0.0.11
  - @ship-it-ui/icons@0.0.11

## 0.0.4

### Patch Changes

- 1ba01f1: React 19 baseline. Peer range tightened to `react ^19.0.0` /
  `react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
  React 19.2. Drops React 18 from the supported matrix — consumers must be on
  React 19 to install.

  `@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
  latest 1.x. Each one now declares explicit React 19 peer support and ships
  the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
  Radix v2 migration in this release; only patch-level moves within 1.x.

- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
  - @ship-it-ui/icons@0.0.10
  - @ship-it-ui/ui@0.0.10

## 0.0.3

### Patch Changes

- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
  - @ship-it-ui/icons@0.0.9
  - @ship-it-ui/ui@0.0.9

## 0.0.2

### Patch Changes

- e2b569e: Initial release of `@ship-it-ui/map` — a thin React wrapper around
  [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/) with styled
  `MapMarker` overlays that consume design-system tokens.

  Shipped as a **separate optional package** so MapLibre's ~700 KB doesn't
  land in `@ship-it-ui/ui`'s bundle for consumers that don't need a map.

  **API**:
  - `<Map>` — lng/lat + zoom + tile URL + markers. Default tile URL is
    OpenStreetMap raster so the component works out of the box; configure
    `tileUrl` for production traffic.
  - `<MapMarker>` — styled marker pin with `default` / `accent` / `sale`
    variants, optional icon and label.
  - `useMap()` — convenience hook returning the imperative `MapHandle` (with
    `flyTo` and a `raw` escape hatch for unsupported MapLibre features).

  Use cases: car-rental "cars near me" map, hotel search results, any
  geographic marketplace surface. Pair with `SegmentedControl` so users can
  toggle between Map and List views over the same data.

- Updated dependencies [e2b569e]
- Updated dependencies [e2b569e]
  - @ship-it-ui/icons@0.0.8
  - @ship-it-ui/ui@0.0.8
