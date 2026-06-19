# @ship-it-ui/tokens

## 0.0.9

### Patch Changes

- 2f70665: Make `--color-on-accent` theme-aware (near-black in dark, white in light) so
  `text-on-accent` is legible on the light theme's dark accent.

  `on-accent` is the foreground for components on an accent surface (primary /
  destructive / success Buttons, solid Badges, Switch, Checkbox, active
  Sidebar / NavBar / Calendar / Stepper / TabBar states, MapMarker,
  CopilotMessage). It was previously a hardcoded near-black literal in
  `globals.css`, which is correct on the dark theme's bright accent but failed
  contrast on the light theme's dark accent (near-black text on a dark teal
  surface). It is now a theme-aware semantic token — `#0a0a0b` in dark,
  `#ffffff` in light — emitted into `tokens.css` like every other semantic
  color and bridged through `@theme inline`. No component changes are needed;
  all consumers pick up the theme-aware value through the `text-on-accent` /
  `bg-on-accent` utilities.

## 0.0.8

### Patch Changes

- 52af924: Add three additive, non-breaking token sets:
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

## 0.0.7

### Patch Changes

- 66be20b: Add consumer customization surface: `defineConfig` / `ShipItConfig` (importable from `@ship-it-ui/tokens/config`), a `shipit build-tokens [--watch]` CLI that emits a sparse override CSS at `.ship-it/tokens.css` (default), and the `LineHeightToken` type export. Existing consumers are unaffected — no config file means no override file. See `docs/customizing-tokens.md` for setup.

## 0.0.6

### Patch Changes

- e2b569e: Add consumer-marketplace semantic color tokens and hero display type sizes.

  **Colors** (both `colorSemanticDark` and `colorSemanticLight`, enforced by
  the `satisfies` constraint):
  - `rating` — gold for star fills, distinct from `warn` yellow
  - `ratingDim` — outline color for empty stars
  - `verified` — trust badge (aliases `ok` today; named separately so future
    divergence is cheap)
  - `sale` — promo / discount strike-through color
  - `saleText` — text-on-bg foreground for sale prices in light theme

  **Typography**: adds `displayLg: '72px'` and `displayXl: '96px'` for hero
  sections in consumer marketing pages. Existing `display: '56px'` is
  unchanged.

  Tailwind utility mappings (`--color-rating`, `--text-display-lg`, etc.) are
  wired through `packages/ui/src/styles/globals.css` so consumers get
  `bg-rating`, `text-verified`, `text-display-xl` automatically.

## 0.0.5

### Patch Changes

- 40c58e6: Mobile support — first cut. Brings the Claude Design "Mobile Library" into the
  published packages so apps can build touch-targeted surfaces without forking.

  **Tokens** (`@ship-it-ui/tokens`): adds touch sizing (`--touch-min`, `--row-h`,
  `--tabbar-h`, `--navbar-h`, `--screen-pad`, …), mobile-bumped type scale
  (`--font-size-m-body: 15px`, h1 30px, etc.), and mobile radii
  (`--radius-m-card`, `--radius-m-sheet`, `--radius-m-tab`). All additive — no
  desktop variables changed. Bridged into Tailwind as `h-touch`, `text-m-body`,
  `rounded-m-card`, etc.

  **Primitives** (`@ship-it-ui/ui`): new `density="touch"` prop on Button,
  IconButton, Input, SearchInput, Switch, Checkbox, Card, Chip. Swaps the
  component to 44pt-min dimensions consuming mobile tokens; default remains
  `'comfortable'` so no caller breaks.

  **Patterns** (`@ship-it-ui/ui`): new mobile-only patterns — `TabBar` (5-slot
  bottom nav with optional elevated center action), `LargeTitle` (iOS large
  headline + eyebrow), `PullToRefresh` (controlled visual indicator).
  `Topbar` extended with `back`, `eyebrow`, and `density="touch"` for the
  mobile page-header use case. `Drawer` extended with `side="bottom"` + `handle`
  prop to cover bottom-sheet visuals.

  **Domain** (`@ship-it-ui/shipit`): `density="touch"` on AskBar and
  CopilotMessage. New `NotifRow` composite under
  `packages/shipit/src/notifications/` for the mobile Inbox list (no desktop
  sibling).

  Density on the remaining primitives (FAB, SplitButton, Textarea, Select,
  Radio, OTP, Slider, Toast, Tag, StatusDot, Avatar) and the remaining shipit
  composites (GraphNode, EntityListRow, HealthScore) is deferred to a follow-up.

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
