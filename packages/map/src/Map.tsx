'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { MapMarker } from './MapMarker';
import type { LngLat, MapMarkerData } from './types';

/**
 * Map — thin React wrapper around MapLibre GL JS. Loaded lazily so the
 * ~700 KB library only enters the bundle of consumers that actually use the
 * map.
 *
 * Tile URL defaults to OpenStreetMap raster so the component renders out of
 * the box. For production traffic, set `tileUrl` to a provider you have an
 * agreement with (MapTiler, Mapbox via maplibre style URL, Stadia, etc.).
 */

/**
 * Aliased Map constructor — our exported `Map` component shadows the global
 * `Map` identifier in this module, so direct `new Map()` would try to
 * instantiate the React component. `NativeMap` keeps the type-safe path.
 */
const NativeMap: MapConstructor = globalThis.Map;

export interface MapHandle {
  /** Re-center the viewport. */
  flyTo(opts: { center: LngLat; zoom?: number }): void;
  /** Underlying MapLibre instance — escape hatch for unsupported features. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any | null;
}

export interface MapProps {
  /** Initial center as `[lng, lat]`. */
  center: LngLat;
  /** Initial zoom (0–22). Default 12. */
  zoom?: number;
  /** Tile URL template. Default: OSM raster tiles. */
  tileUrl?: string;
  /** Marker data — re-rendered when the array identity changes. */
  markers?: ReadonlyArray<MapMarkerData>;
  /** Currently selected marker `id`. */
  selectedId?: string;
  /** Fires when a marker is clicked. */
  onSelect?: (marker: MapMarkerData) => void;
  /** Width / height override. */
  style?: CSSProperties;
  className?: string;
  /** Accessible label for the map region. */
  'aria-label'?: string;
}

const DEFAULT_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const Map = forwardRef<MapHandle, MapProps>(function Map(
  {
    center,
    zoom = 12,
    tileUrl = DEFAULT_TILE_URL,
    markers,
    selectedId,
    onSelect,
    style,
    className,
    'aria-label': ariaLabel = 'Map',
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRefs = useRef(new NativeMap<string, { marker: any; root: Root }>());

  useImperativeHandle(
    ref,
    () => ({
      flyTo({ center: c, zoom: z }) {
        mapRef.current?.flyTo({ center: c, zoom: z });
      },
      get raw() {
        return mapRef.current;
      },
    }),
    [],
  );

  // Initialize MapLibre lazily so SSR / non-map consumers don't import it.
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      const maplibre = await import('maplibre-gl').catch(() => null);
      if (!maplibre || cancelled || !containerRef.current) return;

      const map = new maplibre.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [tileUrl],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        center: [...center],
        zoom,
      });
      mapRef.current = map;
    })();

    const markersAtMount = markerRefs.current;
    return () => {
      cancelled = true;
      // Tear down markers first so React roots unmount cleanly.
      markersAtMount.forEach(({ marker, root }) => {
        try {
          root.unmount();
        } catch {
          // ignore unmount race
        }
        marker.remove?.();
      });
      markersAtMount.clear();
      mapRef.current?.remove?.();
      mapRef.current = null;
    };
    // tileUrl is read at init time; consumers should set it once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render / update markers.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markers) return;
    let cancelled = false;

    (async () => {
      const maplibre = await import('maplibre-gl').catch(() => null);
      if (!maplibre || cancelled) return;

      // Diff: remove markers no longer present.
      const next = new Set(markers.map((m) => m.id));
      markerRefs.current.forEach((entry, id) => {
        if (!next.has(id)) {
          try {
            entry.root.unmount();
          } catch {
            // ignore
          }
          entry.marker.remove?.();
          markerRefs.current.delete(id);
        }
      });

      // Upsert each.
      for (const data of markers) {
        const existing = markerRefs.current.get(data.id);
        const el = existing?.marker.getElement() ?? document.createElement('div');
        el.style.cursor = 'pointer';

        const root = existing?.root ?? createRoot(el);
        root.render(
          <MapMarker
            label={data.label}
            icon={data.icon}
            variant={data.variant}
            selected={data.id === selectedId}
            onClick={() => onSelect?.(data)}
          />,
        );

        if (existing) {
          existing.marker.setLngLat([...data.location]);
        } else {
          const marker = new maplibre.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([...data.location])
            .addTo(map);
          markerRefs.current.set(data.id, { marker, root });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [markers, selectedId, onSelect]);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={className}
      style={{ position: 'relative', height: 400, width: '100%', ...style }}
    >
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
});

Map.displayName = 'Map';
