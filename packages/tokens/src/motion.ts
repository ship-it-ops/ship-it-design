/**
 * Motion tokens — durations and easing curves.
 *
 * The handoff defines two named durations:
 *   - `micro` (150ms) — hover, press, color transitions, switch toggles
 *   - `step`  (360ms) — entrance animations for dialogs, drawers, sheets, toasts
 *
 * Two easings:
 *   - `out` — entrances (fast settle)
 *   - `in`  — exits (linger then fall)
 *
 * Components must consume these tokens, not hand-rolled values. The
 * `prefers-reduced-motion` block in tokens.css zeroes durations automatically.
 */

export const duration = {
  micro: '150ms',
  step: '360ms',
} as const;

export const easing = {
  out: 'cubic-bezier(.2, .7, .2, 1)',
  in: 'cubic-bezier(.4, .1, .8, .3)',
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
