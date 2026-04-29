/**
 * Elevation / shadow tokens.
 *
 * Dark and light themes need different shadow recipes. Dark surfaces need denser,
 * blacker shadows or they vanish into the panel; light surfaces need very subtle
 * tints to avoid muddying the page.
 */

export const shadowDark = {
  sm: '0 1px 2px rgba(0,0,0,0.3)',
  base: '0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
  lg: '0 40px 120px -20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)',
} as const;

export const shadowLight = {
  sm: '0 1px 2px rgba(0,0,0,0.04)',
  base: '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.03)',
  lg: '0 8px 40px rgba(0,0,0,0.08)',
} as const;

export type ShadowToken = keyof typeof shadowDark;
