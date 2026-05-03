/**
 * Color tokens.
 *
 * Two layers + a master hue knob:
 *
 *   1. `accentH` — the OKLCH hue that drives every accent shade (default 200, cyan-blue).
 *      Override at runtime via the CSS variable `--accent-h: 280` to reskin the whole UI
 *      to purple in one declaration. No component code changes.
 *
 *   2. `colorPrimitive` — raw OKLCH ramps for the companion palette: ok / warn / err /
 *      purple / pink. Never used directly in components.
 *
 *   3. `colorSemanticDark` (default) and `colorSemanticLight` — role-based aliases that
 *      components actually consume: `bg`, `panel`, `panel2`, `border`, `borderStrong`,
 *      `text`, `textMuted`, `textDim`, `accent`, `accentText`, `accentDim`, `accentGlow`,
 *      `ok`, `warn`, `err`, `purple`, `pink`.
 *
 * The accent CSS variable references `var(--accent-h)` directly, so swapping the hue
 * propagates harmonically across `accent`, `accentText`, `accentDim`, and `accentGlow`.
 */

/** Master hue for the OKLCH accent. Override via `--accent-h` CSS variable at runtime. */
export const accentH = 200;

/**
 * Companion palette — OKLCH ramps for non-accent semantic states. These are NOT consumed
 * directly by components; the semantic maps below alias them.
 */
export const colorPrimitive = {
  ok: 'oklch(0.82 0.17 150)',
  warn: 'oklch(0.82 0.16 75)',
  err: 'oklch(0.72 0.19 25)',
  purple: 'oklch(0.78 0.14 300)',
  pink: 'oklch(0.78 0.15 0)',
} as const;

/** Dark theme — the default. Lives in `:root`. */
export const colorSemanticDark = {
  bg: '#0a0a0b',
  panel: '#111113',
  /** Second-tier panel (slightly lighter). Hyphenated key matches the handoff CSS var name. */
  'panel-2': '#16161a',
  border: '#1f1f24',
  borderStrong: '#2a2a31',

  text: '#ededef',
  textMuted: '#8a8a94',
  textDim: '#7c7c86',

  // Accents reference the runtime `--accent-h` knob.
  accent: 'oklch(0.82 0.12 var(--accent-h))',
  accentText: 'oklch(0.9 0.1 var(--accent-h))',
  accentDim: 'oklch(0.82 0.12 var(--accent-h) / 0.12)',
  accentGlow: 'oklch(0.82 0.12 var(--accent-h) / 0.4)',

  ok: colorPrimitive.ok,
  warn: colorPrimitive.warn,
  err: colorPrimitive.err,
  purple: colorPrimitive.purple,
  pink: colorPrimitive.pink,
} as const;

/** Light theme — applied via `[data-theme="light"]`. Overrides only what changes. */
export const colorSemanticLight = {
  bg: '#fbfbfa',
  panel: '#ffffff',
  'panel-2': '#f5f5f3',
  border: '#e8e8e4',
  borderStrong: '#d6d6d0',

  text: '#0e0e10',
  textMuted: '#5a5a63',
  textDim: '#6f6f78',

  accent: 'oklch(0.45 0.13 var(--accent-h))',
  accentText: 'oklch(0.38 0.13 var(--accent-h))',
  accentDim: 'oklch(0.72 0.13 var(--accent-h) / 0.10)',
  accentGlow: 'oklch(0.72 0.13 var(--accent-h) / 0.25)',

  // Companion palette is theme-invariant — same OKLCH values look right in both themes.
} as const;

export type ColorSemantic = typeof colorSemanticDark;
export type ColorSemanticToken = keyof ColorSemantic;
