# Adding a component

Use `Button` (`packages/ui/src/components/Button/`) as the canonical reference.
Every component — primitive, pattern, or shipit composite — follows its shape.

## Where does it go?

| Kind                     | Location                                 | Examples                                  |
| ------------------------ | ---------------------------------------- | ----------------------------------------- |
| Atomic primitive         | `packages/ui/src/components/<Name>/`     | Button, Input, Avatar, Dialog, Tooltip    |
| Composite of primitives  | `packages/ui/src/patterns/<Name>/`       | Tabs, Combobox, DataTable, CommandPalette |
| Reusable behavior (hook) | `packages/ui/src/hooks/<useThing>.ts`    | useEscape, useDisclosure                  |
| ShipIt-AI domain piece   | `packages/shipit/src/<group>/<Name>.tsx` | AskBar, GraphNode, EntityCard, Hero       |

If it's specific to ShipIt's product (entity types, AI chrome, graph chrome,
marketing chrome), it goes in `@ship-it-ui/shipit`. Anything generic goes in
`@ship-it-ui/ui`. When in doubt, ask: _would another product want this verbatim?_
If yes → ui. If no → shipit.

## Step-by-step

### 1. Scaffold the folder

```bash
cp -r packages/ui/src/components/Button packages/ui/src/components/<Name>
cd packages/ui/src/components/<Name>
mv Button.tsx <Name>.tsx
mv Button.stories.tsx <Name>.stories.tsx
mv Button.test.tsx <Name>.test.tsx
```

On Windows, use Git Bash or `Copy-Item -Recurse` in PowerShell.

Then global-replace `Button` → `<Name>` inside the four files. (For patterns:
target `packages/ui/src/patterns/<Name>/`. For shipit: target the right group
folder under `packages/shipit/src/`.)

### 2. Implement the component

In `<Name>.tsx`:

- **Forward refs** — `forwardRef<HTMLDivElement, Props>(...)`.
- **Variants via `cva`** — keep all conditional classes inside the `cva`
  definition. No inline conditional classNames in JSX.
- **Consume semantic tokens only** — `bg-accent`, `text-text`,
  `border-border-strong`. Never raw `bg-zinc-50` or hex.
- **Hover/focus via Tailwind modifiers** — `hover:`, `focus-visible:`. No JS
  state for these.
- **Use Radix when behavior is non-trivial** — focus traps, controlled state,
  ARIA semantics. Ship-It owns styling; Radix owns the behavior.
- **`asChild` polymorphism** — wrap your root in `<Slot>` (from
  `@radix-ui/react-slot`) when consumers might want to render a different
  element (e.g., a `Link`).
- **`Omit` conflicting HTML attributes** — when `Props extends HTMLAttributes<X>`
  and you have a same-named React prop, `Omit<HTMLAttributes<X>, '<name>'>`
  before extending. Otherwise TS2430. Recurring offenders: `title`, `onSelect`,
  `values`, drag handlers, `role`, `cite`. (Adopt-then-rename your prop is
  another option, but `Omit` is usually cleaner.)

### 3. Write the story

In `<Name>.stories.tsx`:

- Title: `Components/<Group>/<Name>` for primitives,
  `Patterns/<Group>/<Name>` for patterns, `ShipIt/<Group>/<Name>` for shipit.
- One story per variant, plus a composite "Sizes" or "States" story.
- Use `argTypes` to expose every variant prop as a Storybook control.
- Tag `['autodocs']` so the auto-generated docs page works.
- If a story needs `useState` (toggle, controlled inputs), extract its render
  to a top-level **PascalCase component** — `MyStoryDemo` — and have the story
  do `render: (args) => <MyStoryDemo {...args} />`. ESLint's
  `react-hooks/rules-of-hooks` rejects hooks inside lowercase `render`
  arrow functions.

### 4. Write the tests

In `<Name>.test.tsx`:

- A render test for the happy path.
- One test per interactive behavior. Use `userEvent` (from
  `@testing-library/user-event`), **never `fireEvent`** — keyboard parity
  matters.
- An a11y assertion via `vitest-axe`:
  ```ts
  import { axe } from 'vitest-axe';
  expect(await axe(container)).toHaveNoViolations();
  ```
  (Not `jest-axe`. Its matcher signature breaks Vitest's expect.)
- A `disabled` / `aria-*` test if applicable.

### 5. Re-export from the package barrel

In `packages/ui/src/index.ts` (or `packages/shipit/src/index.ts`):

```ts
export * from './components/<Name>';
```

Keep the export list sectioned and alphabetized within each section.

### 6. Verify

```bash
pnpm --filter @ship-it-ui/ui test           # tests pass
pnpm --filter @ship-it-ui/ui typecheck      # types compile
pnpm dev                                 # Storybook shows your component
```

In Storybook: toggle the theme switcher in the toolbar. Confirm the component
looks right in both dark (default) and light. Open the Accessibility panel — it
should show no violations.

If you suspect a turbo cache lie, `pnpm test:force` re-runs without the cache.

### 7. Add a changeset

```bash
pnpm changeset           # @ship-it-ui/ui (or shipit) → minor for new components
```

The `changeset-check` workflow will fail the PR if you forgot.

### 8. Open the PR

Include a screenshot or short Loom of the component. Reviewers will look at:

- Tests + axe passing
- Token usage (no raw values)
- Storybook story coverage (every variant + a state story)
- Whether the API matches the rest of the library
- Public API hygiene — anything you exported is now a contract

## Component checklist

Copy this into your PR description:

```
- [ ] Forwards refs
- [ ] Uses `cva` for variants (no inline conditional classNames)
- [ ] Consumes semantic tokens only (no raw hex / zinc-N)
- [ ] `asChild` supported (or rationale why not)
- [ ] Story per variant + a composite (Sizes/States) story
- [ ] Test per interactive behavior (userEvent, not fireEvent)
- [ ] axe violations === 0
- [ ] Keyboard navigation works (Tab / Enter / Space / Escape / Arrows where applicable)
- [ ] Looks right in dark AND light themes
- [ ] Re-exported from src/index.ts
- [ ] Changeset added (if a publishable package changed)
```
