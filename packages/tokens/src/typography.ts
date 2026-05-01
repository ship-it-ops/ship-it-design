/**
 * Typography tokens.
 *
 * UI uses Geist; data, codes, monospaced labels use Geist Mono.
 * Geist is self-hosted via @fontsource-variable in the @ship-it/ui package.
 *
 * Sizes are pixel-based but emitted as `px` strings to match the handoff CSS exactly.
 * (Switch to `rem` later if we want user-zoom scaling.)
 */

// Note: `@fontsource-variable/geist` registers the family as `Geist Variable`
// (and `Geist Mono Variable`). The non-`Variable` aliases are kept as a fallback
// in case a consumer self-hosts the static Geist alongside.
export const fontFamily = {
  sans: '"Geist Variable", "Geist", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono Variable", "Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const fontSize = {
  eyebrow: '10px',
  mono: '11px',
  body: '13px',
  bodyLg: '15px',
  h4: '18px',
  h3: '22px',
  h2: '28px',
  h1: '34px',
  display: '56px',
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.08,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

/** Letter-spacing tokens. Negative for display, positive for monospaced eyebrow labels. */
export const tracking = {
  xtight: '-0.9px',
  tight: '-0.3px',
  normal: '0',
  wide: '1.4px',
  xwide: '1.8px',
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
export type TrackingToken = keyof typeof tracking;
