---
'@ship-it-ui/tokens': patch
'@ship-it-ui/ui': patch
---

Add three additive, non-breaking token sets:

- **Soft-accent surface pair** — new `accentSoft` (a soft tinted plate
  surface) and `accentSoftText` (the readable accent foreground to use on
  that plate, aliasing `accentText`) semantic colors in both themes,
  wired through `@theme inline` so `bg-accent-soft` and
  `text-accent-soft-text` utilities resolve.
- **1px hairline spacing token** — new `px: '1px'` step at the bottom of
  the spacing scale for decorative rules/borders, exposed as the
  `--spacing-px` Tailwind spacing utility.
- **Sanctioned display font families** — new `displayTech`
  (Space Grotesk), `displayBold` (Archivo), and `displaySerif`
  (Fraunces) families, self-hosted in `@ship-it-ui/ui` via
  `@fontsource-variable/*` runtime dependencies and wired through
  `@theme inline` so `font-display-tech`, `font-display-bold`, and
  `font-display-serif` utilities resolve.

All three are purely additive — no existing token names, values, or
utilities change.
