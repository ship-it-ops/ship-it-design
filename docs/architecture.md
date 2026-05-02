# Architecture

How the pieces of the Ship-It design system fit together. Read this first.

## The 30-second mental model

```
            ┌─────────────────────┐
            │   @ship-it-ui/tokens   │   Source of truth for design decisions.
            │   (TS → CSS vars)   │   Emits styles/tokens.css (dark-first).
            └──────────┬──────────┘
                       │ imported as CSS variables
        ┌──────────────┼──────────────┐
        ▼                             ▼
┌─────────────────────┐   ┌─────────────────────┐
│   @ship-it-ui/icons    │   │     @ship-it-ui/ui     │   Generic primitives,
│ IconGlyph + SVGR    │──▶│  React + Tailwind   │   patterns, hooks.
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           └────────────┬────────────┘
                        ▼
            ┌─────────────────────┐
            │   @ship-it-ui/shipit   │   ShipIt-AI domain composites
            │ AI · Graph · Entity │   (AskBar, GraphNode, …) built
            │ Marketing · Data    │   on top of @ship-it-ui/ui.
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │      apps/docs      │   Storybook — playground + docs.
            │     (Storybook)     │   Stories live in each package.
            └─────────────────────┘
```

## Why four packages, not one?

The split reflects how change propagates and who consumes what.

- **`@ship-it-ui/tokens`** changes when design changes a value (a brand color, a
  spacing unit). Every consumer sees the change with no component code edits.
- **`@ship-it-ui/icons`** changes when a designer adds or updates an SVG, or when
  the glyph vocabulary expands. Ships independently.
- **`@ship-it-ui/ui`** changes when generic primitive / pattern behavior or markup
  changes. Depends on tokens (and optionally icons), never the reverse.
- **`@ship-it-ui/shipit`** changes when ShipIt-AI's product surface evolves. It
  imports from `@ship-it-ui/ui` for chrome and contributes the domain layer
  (AskBar, CopilotMessage, GraphNode, EntityCard, …). This separation keeps
  generic UI reusable by other products without dragging product-specific
  semantics with it.

A consuming app may install only what it needs:

| Use case                    | Install                                        |
| --------------------------- | ---------------------------------------------- |
| Marketing site, tokens only | `@ship-it-ui/tokens`                           |
| Generic React app           | `@ship-it-ui/ui` (+ `@ship-it-ui/tokens` peer) |
| ShipIt-AI product surface   | `@ship-it-ui/shipit` (pulls ui + tokens)       |

## Theming model — dark-first OKLCH

The token CSS is dark-first: `:root` defines the dark theme; opting into light
is a single attribute on the root element.

```text
<!-- default (dark) -->
<html>

<!-- light theme -->
<html data-theme="light">
```

Every accent shade resolves through one variable, `--accent-h`. Override it at
runtime to reskin the entire UI in a single declaration:

```css
:root {
  --accent-h: 280;
} /* purple instead of the default 200 cyan-blue */
```

The semantic tokens (`--color-bg`, `--color-text`, `--color-accent`,
`--color-border-strong`, …) are what components actually consume. Primitives
(`oklch(…)` ramps) live behind them and are never imported directly.

## How styling works (Tailwind v4 + CSS variables)

The chain:

1. `packages/tokens/src/*.ts` — TypeScript token definitions.
2. `packages/tokens/scripts/build-css.ts` — generates `styles/tokens.css` with
   CSS variables for every token. Emits `:root { … }` (dark + theme-invariant)
   and `[data-theme="light"] { … }` (light overrides only).
3. `packages/ui/src/styles/globals.css` — imports `tokens.css`, then uses
   Tailwind v4's `@theme inline` directive to expose the CSS variables as
   Tailwind utilities. `bg-accent`, `text-text`, `border-border-strong` resolve
   to the right token at runtime.
4. Apps consuming `@ship-it-ui/ui` `import '@ship-it-ui/ui/styles/globals.css'`
   once at their entrypoint. That single import brings in tokens and Tailwind
   utilities; no extra Tailwind config required in the consumer.

`prefers-reduced-motion: reduce` zeros the duration tokens automatically.

## Inside `@ship-it-ui/ui`

Three concerns, three folders:

```
packages/ui/src/
├── components/   Atomic primitives (Button, Input, Dialog, Avatar, …)
├── patterns/     Composites of primitives (Tabs, Combobox, DataTable,
│                  CommandPalette, Sidebar, Topbar, …)
└── hooks/        Reusable behaviors (useEscape, useOutsideClick, useTheme,
                   useDisclosure, useControllableState, useKeyboardList)
```

Components and patterns share the same authoring shape — see
[`adding-a-component.md`](./adding-a-component.md). Patterns are just
"components that compose other components"; the line is fluid.

## Inside `@ship-it-ui/shipit`

```
packages/shipit/src/
├── ai/           AskBar, CopilotMessage, Citation, ReasoningBlock,
│                 ToolCallCard, SuggestionChip, ConfidenceIndicator
├── entity/       EntityBadge, EntityCard, EntityListRow + types
├── graph/        GraphNode, GraphEdge, GraphLegend, GraphMinimap,
│                 GraphInspector, PathOverlay
├── marketing/    Hero, FeatureGrid, Testimonial, PricingCard, CTAStrip, Footer
└── data/         EntityTable (DataTable wrapper, pre-typed for ShipIt entities)
```

Same authoring conventions as `@ship-it-ui/ui`. These are deliberately product-
specific — they encode ShipIt's vocabulary (entity types, glyphs, AI bubble
chrome). Don't add anything generic here; it belongs in `@ship-it-ui/ui`.

## Build pipeline

Orchestrated by Turborepo (`turbo.json`). `pnpm build` from the repo root runs
in topological order:

1. `@ship-it-ui/tokens build` — `tsup` compiles TS, then `build-css.ts` writes
   `styles/tokens.css`. Cache outputs include `dist/**` and `styles/**`.
2. `@ship-it-ui/icons build` — `build.ts` runs SVGR over every SVG in `src/svg/`
   into `src/components/`, then `tsup` compiles to `dist/`.
3. `@ship-it-ui/ui build` — `tsup` compiles TS to ESM + CJS + `.d.ts`. (No CSS
   bundling — apps import `globals.css` from source so they pick up Tailwind's
   own pipeline.)
4. `@ship-it-ui/shipit build` — same as ui.
5. `apps/docs build` — Storybook static build (consumes the freshly-built libs
   via workspace links).

Turbo's `dependsOn: ["^build"]` rule wires upstream-first ordering automatically.
For lib packages, `tsup.config.ts` points at a per-package `tsconfig.build.json`
(`composite: false`) — tsup's DTS step otherwise chokes on the workspace root's
`composite: true`.

## Testing strategy

- **Unit tests** — Vitest + `@testing-library/react`. One `*.test.tsx` per
  component, co-located with the source.
- **A11y tests** — every component test asserts
  `expect(await axe(container)).toHaveNoViolations()` via `vitest-axe`. (Not
  `jest-axe` — its matcher signature is incompatible with Vitest's expect.)
- **Interactions** — `@testing-library/user-event`, never `fireEvent`. Keyboard
  paths matter — keyboard users need to use this.
- **Visual review** — Storybook stories serve as the visual reference. Optional
  Chromatic / visual-regression tooling can layer on top later.

`pnpm test` is turbo-cached; if you suspect a stale cache hit, run
`pnpm test:force`.

## Versioning & release

- [Changesets](https://github.com/changesets/changesets) drives version bumps.
- Every PR that changes a publishable package must include a `.changeset/*.md`
  file. The `changeset-check` workflow flags missing changesets at PR time.
- On merge to `main`, the `Release` workflow either opens a "Version Packages"
  PR (when changesets are pending) or publishes to npm (when that PR merges).
- A `Snapshot` workflow (manual dispatch) can publish a `0.0.0-snap-<sha>`
  build under the `snap` dist-tag for one-off integration testing.
