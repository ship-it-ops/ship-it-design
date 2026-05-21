---
'@ship-it-ui/map': patch
---

Initial release of `@ship-it-ui/map` — a thin React wrapper around
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
