/**
 * Token-driven placeholder tile for docs-site examples.
 *
 * Most examples don't have real images to demo — Lightbox, Carousel, Sheet
 * heroes, etc. We previously stood these in with raw OKLCH literals, which
 * made the first slide land on an orange-red rectangle and read as a bug.
 * `DemoTile` produces a theme-aware card (panel background + subtle accent
 * gradient + IconGlyph + caption) so demos look like real product surfaces
 * in both light and dark themes and reskin with `--accent-h`.
 */

import { IconGlyph, type GlyphName } from '@ship-it-ui/icons';
import type { CSSProperties, ReactNode } from 'react';

export interface DemoTileProps {
  icon: GlyphName;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Compact thumbnail mode: smaller icon, no subtitle, tighter padding. */
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function DemoTile({
  icon,
  title,
  subtitle,
  compact = false,
  className,
  style,
}: DemoTileProps) {
  const iconBoxSize = compact ? 32 : 64;
  const iconSize = compact ? 16 : 32;

  return (
    <div
      className={[
        'border-border-strong bg-panel-2 text-text flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border',
        compact ? 'gap-1.5' : 'gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top, color-mix(in oklch, var(--color-accent) 18%, transparent), transparent 60%)',
        ...style,
      }}
    >
      <div
        className="bg-accent/15 text-accent grid place-items-center rounded-full"
        style={{ width: iconBoxSize, height: iconBoxSize }}
      >
        <IconGlyph name={icon} size={iconSize} />
      </div>
      {(title || subtitle) && !compact && (
        <div className="text-center">
          {title && <div className="text-lg font-medium">{title}</div>}
          {subtitle && <div className="text-text-muted mt-1 text-[13px]">{subtitle}</div>}
        </div>
      )}
      {compact && title && <div className="text-text-muted text-[11px]">{title}</div>}
    </div>
  );
}
