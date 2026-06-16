import { forwardRef, type CSSProperties, type Ref, type SVGAttributes } from 'react';

import { iconData, type IconData } from './icon-data';
import type { GlyphName, LogoName } from './icon-manifest';

interface IconGlyphBaseProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /**
   * Pixel size for both `width` and `height`. Accepts a number (rendered as px)
   * or any CSS length string. Defaults to `1em` so the icon follows the
   * surrounding text size when unset.
   */
  size?: number | string;
  /**
   * Accessible label. If provided, the icon becomes a labelled image to
   * assistive tech (`role="img"`, `aria-label={label}`, plus an embedded
   * `<title>`). If omitted, the icon is `aria-hidden` — use that for
   * decorative usage next to text that already conveys the meaning.
   */
  label?: string;
  /**
   * `default` (semantic glyph) or `logo` (brand-mark logos). `connector` is a
   * `@deprecated` alias for `logo` — it still resolves but new code should use
   * `kind="logo"`.
   */
  kind?: 'default' | 'logo' | 'connector';
}

export interface IconGlyphProps extends IconGlyphBaseProps {
  /**
   * Semantic glyph name (`ask`, `service`, `incident`, …) or a logo name
   * when `kind="logo"`. Names are statically checked against the manifest
   * in `icon-manifest.ts` — typos surface at compile time. For dynamic name
   * strings (server payloads, plugin-registered keys), use
   * `<DynamicIconGlyph>` instead.
   */
  name: GlyphName | LogoName;
}

export interface DynamicIconGlyphProps extends IconGlyphBaseProps {
  /**
   * Arbitrary glyph name. The renderer looks up the manifest first; unknown
   * names render as centered `<text>` inside an SVG so the caller still gets
   * a square icon-shaped element. Reach for this when the name is computed
   * at runtime; prefer `<IconGlyph>` for static literals.
   */
  name: string;
}

const FALLBACK_VIEWBOX = '0 0 24 24';

function lookupIcon(name: string, kind: 'default' | 'logo' | 'connector'): IconData | null {
  // `connector` is a deprecated alias for `logo` — both resolve to the `logo:`
  // data key so legacy callers keep working off the renamed data file.
  const key = kind === 'default' ? name : `logo:${name}`;
  return iconData[key] ?? null;
}

function renderGlyph(
  {
    name,
    size = '1em',
    label,
    kind = 'default',
    style,
    ...rest
  }: IconGlyphBaseProps & { name: string },
  ref: Ref<SVGSVGElement>,
) {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const composedStyle: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    color: 'currentColor',
    flexShrink: 0,
    ...style,
  };
  const ariaProps = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  const icon = lookupIcon(name, kind);
  if (icon) {
    return (
      <svg
        ref={ref}
        width={dimension}
        height={dimension}
        viewBox={icon.viewBox}
        fill="currentColor"
        style={composedStyle}
        {...ariaProps}
        {...rest}
      >
        {label ? <title>{label}</title> : null}
        <g dangerouslySetInnerHTML={{ __html: icon.body }} />
      </svg>
    );
  }

  // Unknown name — only reachable via `<DynamicIconGlyph>`. Render the literal
  // string as centered SVG text so the ref type stays `SVGSVGElement` and the
  // caller still gets something square-shaped to lay out against.
  return (
    <svg
      ref={ref}
      width={dimension}
      height={dimension}
      viewBox={FALLBACK_VIEWBOX}
      fill="currentColor"
      style={composedStyle}
      {...ariaProps}
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="18"
        fill="currentColor"
      >
        {name}
      </text>
    </svg>
  );
}

/**
 * Renders a Ship-It icon as inline SVG. `name` is statically typed against the
 * manifest in `icon-manifest.ts` — typos are caught at compile time. The SVG
 * body is sourced from `src/icon-data.ts` (auto-generated from the manifest);
 * rendered with `fill="currentColor"` so it follows surrounding text color.
 *
 * Usage:
 *   <IconGlyph name="ask" size={14} />                       // decorative
 *   <IconGlyph name="incident" size={20} label="Incident" /> // labelled for screen readers
 *   <IconGlyph name="github" kind="logo" />                  // brand-logo glyph
 *
 * For runtime-dynamic names use `<DynamicIconGlyph>`, which accepts any string
 * and falls back to a centered `<text>` glyph for unregistered names.
 */
export const IconGlyph = forwardRef<SVGSVGElement, IconGlyphProps>(function IconGlyph(props, ref) {
  return renderGlyph(props, ref);
});

IconGlyph.displayName = 'IconGlyph';

/**
 * Runtime-dynamic variant of `<IconGlyph>`. Accepts any string for `name` and
 * falls back to drawing the literal name as centered SVG text when no icon
 * is registered. Reach for this when the name is computed at runtime; prefer
 * `<IconGlyph>` for static literals so typos are caught at compile time.
 */
export const DynamicIconGlyph = forwardRef<SVGSVGElement, DynamicIconGlyphProps>(
  function DynamicIconGlyph(props, ref) {
    return renderGlyph(props, ref);
  },
);

DynamicIconGlyph.displayName = 'DynamicIconGlyph';
