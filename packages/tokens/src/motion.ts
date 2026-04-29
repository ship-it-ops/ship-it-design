/**
 * Motion tokens — durations and easing curves.
 *
 * All component animations should use these. Respecting `prefers-reduced-motion`
 * is the consumer's responsibility (handled in `ui` globals.css).
 */

export const duration = {
  instant: '0ms',
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
  deliberate: '480ms',
} as const;

export const easing = {
  linear: 'linear',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
