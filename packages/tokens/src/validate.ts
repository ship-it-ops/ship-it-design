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
  // Common named colors — not exhaustive, but covers the popular set so we
  // don't reject legitimate strings.
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
 * Best-effort CSS color validator. Used by the build step to fail loudly on
 * obvious typos before writing invalid CSS to disk. Not a full parser —
 * exotic-but-valid values may slip through, and the browser is the final arbiter.
 */
export const isValidCssColor = (value: string): boolean => {
  const v = value.trim();
  if (!v) return false;
  if (HEX.test(v)) return true;
  if (FUNCTIONAL.test(v)) return true;
  if (KEYWORDS.has(v)) return true;
  return false;
};
