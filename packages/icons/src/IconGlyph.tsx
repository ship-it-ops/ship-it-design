import { forwardRef, type CSSProperties, type HTMLAttributes, type Ref } from 'react';

import { connectorGlyphs, glyphs, type ConnectorName, type GlyphName } from './glyphs';

interface IconGlyphBaseProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
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

export interface IconGlyphProps extends IconGlyphBaseProps {
  /**
   * Semantic glyph name (`ask`, `service`, `incident`, …) or a connector name when
   * `kind="connector"`. Names are statically checked against the registries in
   * `glyphs.ts` — typos surface at compile time. For dynamic name strings (server
   * payloads, plugin-registered keys), use `<DynamicIconGlyph>` instead.
   */
  name: GlyphName | ConnectorName;
}

export interface DynamicIconGlyphProps extends IconGlyphBaseProps {
  /**
   * Arbitrary glyph name. The resolver falls back to rendering the literal string
   * when the name doesn't match a registered glyph, so this is the right escape
   * hatch when the name is only known at runtime.
   */
  name: string;
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
  ref: Ref<HTMLSpanElement>,
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
}

/**
 * Renders a Ship-It glyph as styled text. `name` is statically typed against the
 * `glyphs` / `connectorGlyphs` registries — typos are caught at compile time.
 *
 * Usage:
 *   <IconGlyph name="ask" size={14} />                       // decorative
 *   <IconGlyph name="incident" size={20} label="Incident" /> // labelled for screen readers
 *   <IconGlyph name="github" kind="connector" />             // connector glyph
 *
 * For runtime-dynamic names (server payloads, user-registered keys) use
 * `<DynamicIconGlyph>`, which accepts any string and falls back to rendering the
 * literal name when it isn't registered.
 */
export const IconGlyph = forwardRef<HTMLSpanElement, IconGlyphProps>(
  function IconGlyph(props, ref) {
    return renderGlyph(props, ref);
  },
);

IconGlyph.displayName = 'IconGlyph';

/**
 * Runtime-dynamic variant of `<IconGlyph>`. Accepts any string for `name` and
 * renders the literal name as a fallback when no glyph is registered. Reach for
 * this when the name is computed at runtime; prefer `<IconGlyph>` for static
 * literals so typos are caught at compile time.
 */
export const DynamicIconGlyph = forwardRef<HTMLSpanElement, DynamicIconGlyphProps>(
  function DynamicIconGlyph(props, ref) {
    return renderGlyph(props, ref);
  },
);

DynamicIconGlyph.displayName = 'DynamicIconGlyph';
