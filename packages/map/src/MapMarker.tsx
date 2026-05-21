'use client';

import { DynamicIconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type ReactNode } from 'react';

/**
 * MapMarker — DOM marker styled with design-system tokens. Rendered by the
 * `<Map>` component for each entry in its `markers` prop; you usually don't
 * instantiate it directly. Exported so consumers can render their own
 * markers via the `useMap()` API and `marker.setDOMContent()`.
 */

export interface MapMarkerProps {
  label?: ReactNode;
  icon?: string;
  variant?: 'default' | 'accent' | 'sale';
  selected?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-panel text-text border-border',
  accent: 'bg-accent text-on-accent border-accent',
  sale: 'bg-sale text-on-accent border-sale',
} as const;

export const MapMarker = forwardRef<HTMLButtonElement, MapMarkerProps>(function MapMarker(
  { label, icon, variant = 'default', selected, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold shadow-md',
        'transition-transform duration-(--duration-micro)',
        'cursor-pointer hover:scale-105',
        selected ? 'ring-accent-glow scale-110 ring-2' : '',
        variantClasses[variant],
      ].join(' ')}
    >
      {icon && <DynamicIconGlyph name={icon} size={14} />}
      {label && <span>{label}</span>}
    </button>
  );
});
MapMarker.displayName = 'MapMarker';
