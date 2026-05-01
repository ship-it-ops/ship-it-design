import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { connectorGlyphs, glyphs, type ConnectorName, type GlyphName } from './glyphs';

export interface IconGlyphProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Semantic glyph name (`ask`, `service`, `incident`, …) or a connector name when
   * `kind="connector"`. See `glyphs.ts` for the full inventory.
   */
  name: GlyphName | ConnectorName | string;
  /**
   * Pixel size. Renders as `font-size`, so the glyph inherits color from `currentColor`.
   * Defaults to `1em` so the glyph follows the surrounding text size when unset.
   */
  size?: number | string;
  /**
   * Accessible label. If provided, the glyph becomes a labelled image to assistive
   * tech (`role="img"`, `aria-label={label}`). If omitted, the glyph is `aria-hidden`
   * — use that for decorative usage next to text that already conveys the meaning.
   */
  label?: string;
  /**
   * `default` (semantic glyph) or `connector` (connector-specific palette).
   */
  kind?: 'default' | 'connector';
}

/**
 * Renders a Ship-It glyph as styled text.
 *
 * Usage:
 *   <IconGlyph name="ask" size={14} />                  // decorative
 *   <IconGlyph name="incident" size={20} label="Incident" />   // labelled for screen readers
 *   <IconGlyph name="github" kind="connector" />        // connector glyph
 */
export const IconGlyph = forwardRef<HTMLSpanElement, IconGlyphProps>(function IconGlyph(
  { name, size = '1em', label, kind = 'default', style, ...rest },
  ref,
) {
  const map = kind === 'connector' ? connectorGlyphs : glyphs;
  const glyph = (map as Record<string, string>)[name] ?? name;
  const fontSize = typeof size === 'number' ? `${size}px` : size;

  const composedStyle: CSSProperties = {
    display: 'inline-block',
    lineHeight: 1,
    fontSize,
    color: 'currentColor',
    ...style,
  };

  if (label) {
    return (
      <span ref={ref} role="img" aria-label={label} style={composedStyle} {...rest}>
        {glyph}
      </span>
    );
  }

  return (
    <span ref={ref} aria-hidden="true" style={composedStyle} {...rest}>
      {glyph}
    </span>
  );
});
