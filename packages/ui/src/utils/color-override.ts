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

const isValid = (value: string): boolean => {
  const v = value.trim();
  if (!v) return false;
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return CSS.supports('color', v);
  }
  return HEX.test(v) || FUNCTIONAL.test(v) || KEYWORDS.has(v);
};

/**
 * Dev-mode validator. Logs a warning naming the component and the offending value.
 * Returns false on invalid (component should fall back to the default variant).
 * Production-stripped via the NODE_ENV guard so the function call disappears in optimized builds.
 */
export const warnIfInvalidColor = (value: string, component: string): boolean => {
  if (process.env.NODE_ENV === 'production') return true;
  if (isValid(value)) return true;
  console.warn(
    `[${component}] Invalid color value "${value}". Falling back to the default variant. Use a hex, rgb/rgba, hsl, oklch, lab/lch, color(), color-mix(), or a CSS color keyword.`,
  );
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
