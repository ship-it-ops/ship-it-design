# @ship-it-ui/ui

The React component library for the Ship-It design system.

## How this fits in

Part of the [Ship-It Design System](../../docs/architecture.md). See the
architecture overview for how `@ship-it-ui/tokens`, `@ship-it-ui/icons`,
`@ship-it-ui/ui`, and `@ship-it-ui/shipit` compose.

## Architecture

```
src/
├── components/          Atomic components (Button, Input, Avatar, Dialog, …)
│   └── Button/
│       ├── Button.tsx           Component + cva variant definitions
│       ├── Button.stories.tsx   Storybook stories (also serve as autodocs)
│       ├── Button.test.tsx      Vitest + Testing Library + vitest-axe
│       └── index.ts             Re-exports the component + types
├── patterns/            Composites of components (Tabs, Combobox, DataTable, …)
├── hooks/               useEscape, useOutsideClick, useTheme, useDisclosure,
│                          useControllableState, useKeyboardList
├── utils/
│   └── cn.ts            clsx + tailwind-merge
├── styles/
│   ├── globals.css           Consumer entry — base + @source at this pkg's dist
│   ├── globals.base.css      Shared base (fonts, tokens, Tailwind, @theme)
│   ├── globals.workspace.css In-repo entry — base + @source at workspace src
│   └── animations.css        Keyframes (spin, pulse, indeterminate, dialogIn, …)
├── test/
│   └── setup.ts         Vitest global setup (jsdom polyfills + vitest-axe)
└── index.ts             Public API barrel — only re-exports
```

## Consuming the styles (Tailwind v4)

Import the stylesheet once at your app entry:

```css
/* your app's globals.css */
@import '@ship-it-ui/ui/styles/globals.css';
```

This sets up the fonts, design tokens, the `@theme` token→utility bridge, and —
critically — a `@source` directive pointing at this package's **compiled output**
(`dist`). Tailwind v4 only generates the utility classes it can find in scanned
files, so without that, the DS components would render **unstyled** (a silent
failure — nothing throws). The published `globals.css` handles `@ship-it-ui/ui`'s
own classes for you.

You must add `@source` lines yourself for anything Tailwind can't see from this
file:

```css
@import '@ship-it-ui/ui/styles/globals.css';

/* if you also use @ship-it-ui/shipit */
@source '../node_modules/@ship-it-ui/shipit/dist/**/*.js';

/* your own components that use DS/Tailwind classes */
@source './src/**/*.{ts,tsx}';
```

`@source` paths are relative to the CSS file that contains them.

> **Migration note (from earlier 0.0.x):** previous versions shipped a
> `globals.css` whose `@source` lines pointed at monorepo-relative paths that
> don't exist in a published install, so DS components rendered unstyled for npm
> consumers. The entry is now self-contained for `@ship-it-ui/ui`'s own classes;
> add the `@source` lines above for shipit and your own code. Apps **inside this
> monorepo** import `@ship-it-ui/ui/styles/globals.workspace.css` instead (it
> scans the live workspace `src`).

## Component anatomy

Every component follows the same shape — open `Button/` to see the canonical example:

| File            | What it contains                                              |
| --------------- | ------------------------------------------------------------- |
| `Component.tsx` | The implementation. Variants via `cva`. Tokens via Tailwind.  |
| `*.stories.tsx` | One story per variant + a "Sizes" / "States" composite story. |
| `*.test.tsx`    | Render, interaction, and `axe` a11y tests.                    |
| `index.ts`      | Re-exports the component and any related types.               |

## Adding a new component

See [`docs/adding-a-component.md`](../../docs/adding-a-component.md) for the
step-by-step guide. In short:

1. Copy `src/components/Button/` and rename to your component.
2. Replace the implementation, story, and tests.
3. Add a re-export line to `src/index.ts`.
4. `pnpm --filter @ship-it-ui/ui test` — make sure tests pass and axe is clean.
5. Run Storybook (`pnpm dev`) and visually verify.
6. `pnpm changeset` — describe the new component as a `minor` bump.

## Conventions

- **Always consume semantic tokens**, never primitive ones. `bg-accent`, not `bg-indigo-600`.
- **Forward refs**. Every component uses `forwardRef` so consumers can attach refs and
  Radix integrations can wire focus management.
- **`asChild` polymorphism**. Use `@radix-ui/react-slot` for components that should be
  able to render as a different element (e.g., a `Link`).
- **A11y is non-negotiable**. Tests assert `axe` violations === 0. Use
  `@testing-library/user-event` (not `fireEvent`) so interactions match real user input.
- **Styling**: Tailwind classes consuming token CSS variables. Keep all variant logic
  inside `cva` — no inline conditional classNames in JSX.
