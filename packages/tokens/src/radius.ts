/**
 * Border-radius tokens. Use semantic names in components; only the design
 * handoff defines which numeric value each role maps to.
 */

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export type RadiusToken = keyof typeof radius;
