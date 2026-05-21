/**
 * Public types for `@ship-it-ui/map`.
 */

/** A `[longitude, latitude]` pair. MapLibre uses lng/lat ordering. */
export type LngLat = readonly [number, number];

export interface MapMarkerData {
  /** Stable identifier — used as React key. */
  id: string;
  /** Marker coordinate. */
  location: LngLat;
  /** Optional label shown next to the pin (e.g. a price). */
  label?: string;
  /** Optional icon name (`@ship-it-ui/icons` glyph). */
  icon?: string;
  /** Visual variant. Default `'default'`. */
  variant?: 'default' | 'accent' | 'sale';
}
