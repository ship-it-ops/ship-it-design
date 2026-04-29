# Adding a component

Use `Button` (`packages/ui/src/components/Button/`) as the canonical reference.
Every component follows its shape.

## Step-by-step

### 1. Scaffold the folder

```bash
cp -r packages/ui/src/components/Button packages/ui/src/components/<Name>
cd packages/ui/src/components/<Name>
mv Button.tsx <Name>.tsx
mv Button.stories.tsx <Name>.stories.tsx
mv Button.test.tsx <Name>.test.tsx
```

Then global-replace `Button` → `<Name>` inside the four files.

### 2. Implement the component

In `<Name>.tsx`:

- **Forward refs** — `forwardRef<HTMLDivElement, Props>(...)`.
- **Variants via `cva`** — keep all conditional classes inside the `cva` definition,
  not scattered through JSX.
- **Consume semantic tokens only** — `bg-surface`, not `bg-zinc-50`.
- **Use Radix when behavior is non-trivial** (focus traps, controlled state, ARIA).
- **`asChild` polymorphism** — wrap your root in `<Slot>` when it makes sense for
  consumers to render their own element.

### 3. Write the story

In `<Name>.stories.tsx`:

- Title: `Components/<Name>`
- One story per variant, plus a composite "States" or "Sizes" story.
- Use `argTypes` to expose every variant prop as a Storybook control.
- Tag `['autodocs']` so the auto-generated docs page works.

### 4. Write the tests

In `<Name>.test.tsx`:

- A render test for the happy path.
- One test per interactive behavior (`userEvent`, not `fireEvent`).
- An `axe` assertion: `expect(await axe(container)).toHaveNoViolations()`.
- A `disabled` / `aria-*` test if applicable.

### 5. Re-export from the package barrel

In `packages/ui/src/index.ts`:

```ts
export * from './components/<Name>';
```

Keep the export list alphabetical.

### 6. Verify

```bash
pnpm --filter @ship-it/ui test           # tests pass
pnpm --filter @ship-it/ui typecheck      # types compile
pnpm dev                                 # Storybook shows your component
```

In Storybook: toggle the theme switcher in the toolbar. Confirm the component looks
right in both themes. Open the Accessibility panel — it should show no violations.

### 7. Add a changeset

```bash
pnpm changeset           # mark @ship-it/ui as a `minor` bump for new components
```

### 8. Open the PR

Include a screenshot or short Loom of the component. Reviewers will look at:

- Tests + axe passing
- Token usage (no raw values)
- Storybook story coverage
- Whether the API matches the rest of the library

## Component checklist

Copy this into your PR description:

```
- [ ] Forwards refs
- [ ] Uses `cva` for variants (no inline conditional classNames)
- [ ] Consumes semantic tokens only
- [ ] `asChild` supported (or rationale why not)
- [ ] Story per variant + composite story
- [ ] Test per interactive behavior
- [ ] axe violations === 0
- [ ] Keyboard navigation works
- [ ] Looks right in light AND dark themes
- [ ] Re-exported from src/index.ts
- [ ] Changeset added
```
