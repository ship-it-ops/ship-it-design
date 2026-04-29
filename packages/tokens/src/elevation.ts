/**
 * Elevation accents — the inset top-highlight that fakes a glass edge on elevated
 * dark surfaces (used by Card, Dialog headers, etc).
 *
 * On light theme this is intentionally a no-op; the highlight only reads correctly
 * on near-black backgrounds.
 */

export const elevation = {
  insetHighlightDark: 'inset 0 1px 0 rgba(255,255,255,0.02)',
  insetHighlightLight: 'inset 0 1px 0 rgba(255,255,255,0)',
} as const;

export type ElevationToken = keyof typeof elevation;
