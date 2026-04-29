/**
 * Breakpoint tokens. Mobile-first — each value is the *minimum* width at which
 * the breakpoint applies.
 */

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type BreakpointToken = keyof typeof breakpoint;
