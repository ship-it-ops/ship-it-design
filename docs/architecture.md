# Architecture

This document explains how the pieces of the Ship-It design system fit together.
If you're new, read this first.

## The 30-second mental model

```
                    ┌─────────────────────┐
                    │   @ship-it/tokens   │   Source of truth for design decisions.
                    │   (TS → CSS vars)   │   Emits styles/tokens.css.
                    └──────────┬──────────┘
                               │ imported as CSS variables
              ┌────────────────┼────────────────┐
              ▼                                 ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │   @ship-it/icons    │         │     @ship-it/ui     │   Components consume
    │   (SVG → React)     │ used by │  (React + Tailwind) │   tokens via Tailwind
    └─────────────────────┘         └──────────┬──────────┘   utilities + CSS vars.
                                               │
                                               ▼
                                  ┌─────────────────────┐
                                  │      apps/docs      │   Storybook — a live
                                  │     (Storybook)     │   playground + docs.
                                  └─────────────────────┘
```

## Why three packages, not one?

Splitting them reflects how change propagates and who consumes what.

- **`@ship-it/tokens`** changes when design changes a value (a brand color, a spacing
  unit). Every consumer sees the change, but no component code is touched.
- **`@ship-it/icons`** changes whenever a designer adds or updates an SVG. It can
  ship independently of the components.
- **`@ship-it/ui`** changes when behavior or markup changes. It depends on tokens
  and (optionally) icons, never the reverse.

A consuming app may only need tokens (e.g., a marketing site). It can install just
`@ship-it/tokens` without pulling in the UI code.

## How styling works (Tailwind v4 + CSS variables)

The chain:

1. `packages/tokens/src/*.ts` — TypeScript token definitions.
2. `packages/tokens/scripts/build-css.ts` — generates `styles/tokens.css` with CSS
   variables for every token.
3. `packages/ui/src/styles/globals.css` — imports `tokens.css`, then uses Tailwind v4's
   `@theme` directive to expose the CSS variables as Tailwind utilities. Now
   `bg-brand` and `text-text` resolve to the right token at runtime.
4. Apps consuming `@ship-it/ui` `import '@ship-it/ui/styles/globals.css'` once at
   their entrypoint. That single import brings tokens *and* Tailwind utilities.

Light/dark theming is a class toggle:

```html
<html class="dark">  <!-- swaps semantic tokens; no component re-render needed -->
```

## Build pipeline

Orchestrated by Turborepo (`turbo.json`). `pnpm build` from the repo root runs:

1. `@ship-it/tokens build` — `tsup` compiles TS, then `build-css.ts` writes `tokens.css`.
2. `@ship-it/icons build` — `build.ts` runs SVGR over every SVG in `src/svg/`, then
   `tsup` compiles to `dist/`.
3. `@ship-it/ui build` — `tsup` compiles TS to ESM + CJS + `.d.ts`. (No CSS bundling
   here — apps import the source `globals.css` directly so they pick up Tailwind's
   build pipeline.)
4. `apps/docs build` — Storybook static build.

Turbo handles topological ordering automatically via the `dependsOn: ["^build"]` rule.

## Testing strategy

- **Unit tests** (`packages/ui`) — Vitest + `@testing-library/react`. One test file per
  component, co-located.
- **A11y tests** — every component test asserts `axe` violations === 0.
- **Visual review** — Storybook stories serve as the visual reference. (We can layer
  Chromatic on top later for visual regression if we want.)

## Versioning & release

- [Changesets](https://github.com/changesets/changesets) drives version bumps.
- Every PR that changes a publishable package must include a `.changeset/*.md` file.
- On merge to `main`, the `Release` workflow either opens a "Version Packages" PR
  (when changesets are pending) or publishes to npm (when that PR merges).
