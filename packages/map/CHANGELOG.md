# @ship-it-ui/map

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
