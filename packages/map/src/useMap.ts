'use client';

import { useRef } from 'react';

import type { MapHandle } from './Map';

/**
 * Convenience hook that creates a stable `ref` for the imperative `MapHandle`.
 * Use when you need to programmatically `flyTo` or reach the raw MapLibre
 * instance.
 *
 * ```tsx
 * const mapRef = useMap();
 * <Map ref={mapRef} center={[-122.4, 37.8]} />
 * mapRef.current?.flyTo({ center: [-118.2, 34.0], zoom: 10 });
 * ```
 */
export function useMap() {
  return useRef<MapHandle | null>(null);
}
