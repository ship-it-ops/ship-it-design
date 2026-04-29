# @ship-it/tokens

The single source of truth for design tokens used across the Ship-It design system.

## What's a token?

A token is a named design decision — `color.brand`, `space.4`, `radius.md`. Components
consume tokens, **never raw values**. Changing a token in one place updates every
component that uses it.

## Two layers of color

We use a two-layer color system:

1. **Primitive** (`colorPrimitive`) — the raw palette: `neutral-50`, `brand-500`, etc.
   Components must **not** import these directly.
2. **Semantic** (`colorSemanticLight`, `colorSemanticDark`) — role-based aliases like
   `background`, `text`, `border`, `brand`. Components import these.

This decoupling means we can reskin the system (swap palettes) without changing a
single component.

## How tokens reach your components

```
src/*.ts                     scripts/build-css.ts                styles/tokens.css
TypeScript token modules ───────────────► CSS variables ───────────► consumed by
                                                                       Tailwind v4
                                                                       (@ship-it/ui)
```

Token consumers have two options:

```ts
// Option A — TypeScript (e.g., for inline styles, tests, or theme objects)
import { spacing, colorSemanticLight } from '@ship-it/tokens';

// Option B — CSS variables (preferred inside components)
import '@ship-it/tokens/styles/tokens.css';
// then use var(--color-text), var(--space-4), etc. — or Tailwind utilities
// like `text-text` and `p-4` since the @ship-it/ui Tailwind config is wired
// to these variables.
```

## Adding or changing a token

1. Edit the relevant module in `src/` (e.g., `src/spacing.ts`).
2. Run `pnpm --filter @ship-it/tokens build` to regenerate `styles/tokens.css`.
3. If you renamed a token, search the monorepo for the old name and update consumers.
4. Add a Changeset describing the bump:
   - **patch** — internal cleanup, no consumer-visible change
   - **minor** — new token added
   - **major** — token renamed or removed (breaking change)

## Files

| File                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `src/color.ts`         | Primitive palette + light/dark semantic color aliases     |
| `src/typography.ts`    | Font families, sizes, weights, line-heights, tracking     |
| `src/spacing.ts`       | 4px-based spacing scale                                   |
| `src/radius.ts`        | Border-radius tokens                                      |
| `src/shadow.ts`        | Light + dark elevation shadows                            |
| `src/motion.ts`        | Durations + easing curves                                 |
| `src/breakpoint.ts`    | Responsive breakpoints                                    |
| `src/z-index.ts`       | Named stacking layers                                     |
| `scripts/build-css.ts` | Emits `styles/tokens.css` from TS sources                 |
| `styles/tokens.css`    | **Generated.** Imported by `@ship-it/ui/styles/globals.css` |
