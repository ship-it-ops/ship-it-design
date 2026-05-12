/**
 * Mobile tokens — touch sizing, layout dimensions, bumped type scale, mobile radii.
 *
 * Additive over the desktop tokens (color and font family are shared). Pulled
 * verbatim from the Mobile Library design canvas; 44pt minimum tap target per
 * Apple HIG, body bumped 13→15 for thumb readability, headline scaled down so
 * the 34px desktop h1 doesn't dominate a 390-wide screen.
 */

/** Touch-target sizes. Use `touch-min` for any tappable region. */
export const touch = {
  min: '44px',
  comfortable: '48px',
} as const;

/**
 * Mobile layout dimensions. Emitted *without* a prefix to match the design
 * canvas verbatim (`--row-h`, `--tabbar-h`, …).
 */
export const mobileLayout = {
  rowH: '56px',
  rowHLg: '64px',
  tabbarH: '64px',
  navbarH: '56px',
  screenPad: '16px',
  screenPadLg: '20px',
} as const;

/**
 * Mobile-bumped type scale.
 *   - body 13→15 (thumb readability)
 *   - body-lg 15→17 (primary chat / important content)
 *   - eyebrow 10→11 (legibility at glance)
 *   - mono 11→12
 *   - h1 34→30 (fits small screens), h2 28→26, h3 22→23, h4 18→19
 */
export const fontSizeMobile = {
  eyebrow: '11px',
  mono: '12px',
  body: '15px',
  bodyLg: '17px',
  h4: '19px',
  h3: '23px',
  h2: '26px',
  h1: '30px',
} as const;

/** Mobile-tuned radii. Larger than desktop to feel thumb-friendly. */
export const radiusMobile = {
  tab: '12px',
  card: '16px',
  sheet: '20px',
} as const;

export type TouchToken = keyof typeof touch;
export type MobileLayoutToken = keyof typeof mobileLayout;
export type FontSizeMobileToken = keyof typeof fontSizeMobile;
export type RadiusMobileToken = keyof typeof radiusMobile;
