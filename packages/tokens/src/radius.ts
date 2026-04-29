/**
 * Border-radius tokens. Pixel-based to match the handoff exactly.
 *
 * Use the semantic name in components, never the raw px value.
 *   - `xs` for tight inputs and inline code
 *   - `sm` for small buttons + inputs
 *   - `md` for buttons
 *   - `base` for cards + popovers
 *   - `lg` for modals
 *   - `xl` for large modals + featured surfaces
 *   - `full` for pills + circular avatars
 */

export const radius = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  base: '10px',
  lg: '14px',
  xl: '18px',
  full: '9999px',
} as const;

export type RadiusToken = keyof typeof radius;
