# @ship-it-ui/tokens

## 0.0.4

### Patch Changes

- 01246b3: Add a `lint:fix` npm script to both packages so `pnpm --filter
@ship-it-ui/icons lint:fix` (and the equivalent for tokens) runs
  `eslint src --fix`. Mirrors the script already present in the other
  publishable packages — no runtime or published-artifact change.

## 0.0.3

### Patch Changes

- 597a705: Internal hardening of the tokens package — no consumer-visible token values
  change.
  - `colorSemanticLight` now `satisfies Record<keyof typeof colorSemanticDark, string>`,
    so a missing or extra key in either theme is a compile error. The two
    themes can no longer drift silently.
  - `scripts/build-css.ts` test replaces the previous string-`toContain` checks
    with a snapshot of the full generated `tokens.css`. Any unintended drift in
    token names or values now fails CI.
  - README corrected: semantic color tokens live in `src/color.ts`, not in
    `@ship-it-ui/ui`'s `globals.css` (that file only re-binds them into
    Tailwind v4's `@theme inline` block).

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.

## 0.0.1

### Patch Changes

- 1035968: v0 launch
