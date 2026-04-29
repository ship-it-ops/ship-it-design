/**
 * Color tokens.
 *
 * Two layers:
 *   1. `colorPrimitive` — raw palette ("brand-500", "neutral-100"). Never used
 *      directly in components.
 *   2. `colorSemantic` — role-based aliases ("background", "text", "border-strong").
 *      Components MUST consume these so themes can swap palettes without changes
 *      to component code.
 *
 * Values below are placeholders. Replace with the design handoff palette.
 */

export const colorPrimitive = {
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    1000: '#000000',
  },
  brand: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
} as const;

export const colorSemanticLight = {
  background: colorPrimitive.neutral[0],
  surface: colorPrimitive.neutral[50],
  border: colorPrimitive.neutral[200],
  borderStrong: colorPrimitive.neutral[300],
  textMuted: colorPrimitive.neutral[500],
  text: colorPrimitive.neutral[900],
  brand: colorPrimitive.brand[600],
  brandHover: colorPrimitive.brand[700],
  brandSubtle: colorPrimitive.brand[50],
  onBrand: colorPrimitive.neutral[0],
} as const;

export const colorSemanticDark = {
  background: colorPrimitive.neutral[900],
  surface: colorPrimitive.neutral[800],
  border: colorPrimitive.neutral[700],
  borderStrong: colorPrimitive.neutral[600],
  textMuted: colorPrimitive.neutral[400],
  text: colorPrimitive.neutral[50],
  brand: colorPrimitive.brand[400],
  brandHover: colorPrimitive.brand[300],
  brandSubtle: colorPrimitive.neutral[800],
  onBrand: colorPrimitive.neutral[900],
} as const;

export type ColorSemantic = typeof colorSemanticLight;
export type ColorSemanticToken = keyof ColorSemantic;
