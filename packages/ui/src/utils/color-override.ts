const HEX = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNCTIONAL =
  /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\([^()]*(?:\([^()]*\)[^()]*)*\)$/;
const KEYWORDS = new Set([
  'transparent',
  'currentColor',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  'red',
  'green',
  'blue',
  'black',
  'white',
  'gray',
  'grey',
  'orange',
  'yellow',
  'purple',
  'pink',
  'brown',
  'cyan',
  'magenta',
]);

/**
 * Pure gating check. Always runs in both dev and prod so the component's
 * fallback path activates uniformly when the override is unusable.
 */
const isValid = (value: string): boolean => {
  const v = value.trim();
  if (!v) return false;
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return CSS.supports('color', v);
  }
  return HEX.test(v) || FUNCTIONAL.test(v) || KEYWORDS.has(v);
};

/**
 * Returns true if the value is a usable CSS color, false otherwise.
 * In dev, also logs a warning naming the component and the offending value.
 * In prod, the validator still gates (so invalid colors fall back to the
 * default variant rather than rendering broken CSS) but the console.warn
 * call is stripped by the bundler's NODE_ENV dead-code elimination.
 */
export const warnIfInvalidColor = (value: string, component: string): boolean => {
  if (isValid(value)) return true;
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[${component}] Invalid color value "${value}". Falling back to the default variant. Use a hex, rgb/rgba, hsl, oklch, lab/lch, color(), color-mix(), or a CSS color keyword.`,
    );
  }
  return false;
};

/**
 * The Badge/Tag/Chip tint recipe: 15%-opacity background using `color-mix`,
 * full-color text. Centralized so all three components stay visually consistent
 * when a `color` override is applied.
 */
export const tintStyle = (color: string): { background: string; color: string } => ({
  background: `color-mix(in oklab, ${color}, transparent 85%)`,
  color,
});
