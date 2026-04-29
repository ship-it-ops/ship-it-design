/**
 * Spacing scale — 4px base with an irregular ramp.
 *
 * The handoff explicitly skips `7` (28px → step 6) to discourage hand-tuned 7px values.
 * Every layout decision must pick a token from this list; arbitrary values are a smell.
 */

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '22px',
  6: '28px',
  // intentionally no 7
  8: '40px',
} as const;

export type SpacingToken = keyof typeof spacing;
