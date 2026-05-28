import { iconData, type GlyphName } from '@ship-it-ui/icons';
import { type CSSProperties, type ReactElement } from 'react';

const GRADIENT_ID = 'ship-example-photo-gradient';

/**
 * Docs-site placeholder for a listing photo. Renders inline SVG (real
 * DOM, not a data URI) so the panel and icon inherit the page's CSS
 * scope:
 *
 *   - Panel uses a `var(--color-panel-2)` → `var(--color-panel)` gradient
 *   - Icon body uses `currentColor`, which we set to `var(--color-text-muted)`
 *
 * Result: the placeholder follows the theme toggle without rebuilding.
 *
 * Pair with `<ListingCard renderPhoto={…}>` / `<ListingDetail renderPhoto={…}>`
 * to bypass the components' default `<img src>` wrapper.
 */
export function ExamplePhoto({
  icon,
  className,
  style,
  mode = 'cover',
}: {
  icon: GlyphName;
  className?: string;
  style?: CSSProperties;
  /** `cover` for inline gallery cells, `contain` for fullscreen lightbox. */
  mode?: 'cover' | 'contain';
}): ReactElement {
  const data = iconData[icon];
  const W = 800;
  const H = 500;
  const iconBoxSize = 220;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={mode === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        color: 'var(--color-text-muted)',
        ...style,
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-panel-2)" />
          <stop offset="100%" stopColor="var(--color-panel)" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${GRADIENT_ID})`} />
      {data && (
        <g
          transform={`translate(${(W - iconBoxSize) / 2} ${(H - iconBoxSize) / 2}) scale(${
            iconBoxSize / 24
          })`}
          opacity={0.55}
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      )}
    </svg>
  );
}
