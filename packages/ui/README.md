# @ship-it-ui/ui

The React component library for the Ship-It design system.

## Architecture

```
src/
├── components/          Atomic primitives (Button, Input, Avatar, Dialog, …)
│   └── Button/
│       ├── Button.tsx           Component + cva variant definitions
│       ├── Button.stories.tsx   Storybook stories (also serve as autodocs)
│       ├── Button.test.tsx      Vitest + Testing Library + vitest-axe
│       └── index.ts             Re-exports the component + types
├── patterns/            Composites of primitives (Tabs, Combobox, DataTable, …)
├── hooks/               useEscape, useOutsideClick, useTheme, useDisclosure,
│                          useControllableState, useKeyboardList
├── primitives/          Thin wrappers over Radix when we want a Ship-It-flavored API
├── utils/
│   └── cn.ts            clsx + tailwind-merge
├── styles/
│   ├── globals.css      Tailwind v4 entrypoint + token CSS-var bridge
│   └── animations.css   Keyframes (spin, pulse, indeterminate, dialogIn, …)
├── test/
│   └── setup.ts         Vitest global setup (jsdom polyfills + vitest-axe)
└── index.ts             Public API barrel — only re-exports
```

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

- **Always consume semantic tokens**, never primitive ones. `bg-brand`, not `bg-indigo-600`.
- **Forward refs**. Every component uses `forwardRef` so consumers can attach refs and
  Radix integrations can wire focus management.
- **`asChild` polymorphism**. Use `@radix-ui/react-slot` for components that should be
  able to render as a different element (e.g., a `Link`).
- **A11y is non-negotiable**. Tests assert `axe` violations === 0. Use
  `@testing-library/user-event` (not `fireEvent`) so interactions match real user input.
- **Styling**: Tailwind classes consuming token CSS variables. Keep all variant logic
  inside `cva` — no inline conditional classNames in JSX.
