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
mv Button.test.tsx <Name>.test.tsx
```

On Windows, use Git Bash or `Copy-Item -Recurse` in PowerShell.

Then global-replace `Button` → `<Name>` inside the three files. (For patterns:
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

### 3. Document it on the docs site

Two artifacts: a set of example files (one per variant) and one MDX page.

**a. Examples** — `apps/docs-site/examples/<kebab>/<name>.tsx`. Each file
default-exports a single React component called `Example`:

```tsx
import { Foo } from '@ship-it-ui/ui';

export default function Example() {
  return <Foo>Hello</Foo>;
}
```

Add one file per variant / state / behavior worth showing — `default.tsx`,
`secondary.tsx`, `with-icon.tsx`, `loading.tsx`, `sizes.tsx`, etc. The
file's contents are shown verbatim under the Code tab on the docs page, so
keep them small and self-contained: no shared module-level helpers unless
the example genuinely can't be expressed without one.

If an example needs `useState` or another hook (controlled inputs, toggles,
live values), extract the stateful part into an inner **PascalCase**
component:

```tsx
'use client';
import { useState } from 'react';
import { Slider } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState<number[]>([42]);
  return <Slider value={v} onValueChange={(n) => setV(Array.isArray(n) ? n : [n])} showValue />;
}

export default function Example() {
  return <Inner />;
}
```

**b. Docs page** — `apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx`,
where `<section>` is `components`, `patterns`, or `shipit`. Use the existing
Button page (`app/(docs)/components/button/page.mdx`) as the template:

```mdx
# Foo

Two-line summary — what it is, when to reach for it.

<LivePreview example="foo/default" />

## Variants

<LivePreview example="foo/secondary" />

## Sizes

<LivePreview example="foo/sizes" />

## Props

<PropsTable component="Foo" />

## Accessibility

- Keyboard semantics covered.
- aria-* contracts.

<EditOnGithub source="apps/docs-site/app/(docs)/components/foo/page.mdx" />
```

`<PropsTable>` is auto-generated from `react-docgen-typescript`, so the JSDoc
above each prop in `<Name>.tsx` becomes the row's Description column. Keep
those comments accurate.

**c. Register in the sidebar** — `apps/docs-site/content/navigation.ts`. A
page that isn't listed here is unreachable, even if `page.mdx` exists.

```ts
{
  label: 'Display',
  items: [
    // …
    { title: 'Foo', slug: 'components/foo' },
  ],
},
```

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
pnpm --filter docs-site dev                 # Next.js docs site on :3000
```

Open `http://localhost:3000/<section>/<kebab>` and confirm:

- The live preview renders for every example you added.
- The Code tab shows the example file source verbatim.
- `<PropsTable>` is populated and the descriptions match your JSDoc.
- Toggling the theme (top-right) flips the preview cleanly in both light
  and dark.
- No console warnings or hydration mismatches.

A11y is asserted in the unit test (`vitest-axe`); there's no separate panel
to inspect on the docs site itself.

If you suspect a turbo cache lie, `pnpm test:force` re-runs without the cache.

### 7. Add a changeset

```bash
pnpm changeset           # @ship-it-ui/ui (or shipit) → minor for new components
```

The `changeset-check` workflow will fail the PR if you forgot.

### 8. Open the PR

Include a screenshot or short Loom of the component (the live preview from
the docs page is usually the cleanest source). Reviewers will look at:

- Tests + axe passing
- Token usage (no raw values)
- Docs page coverage — one `<LivePreview>` per variant + a composite
  Sizes/States preview
- Sidebar entry registered in `content/navigation.ts`
- `<PropsTable>` populated (JSDoc on every prop)
- Whether the API matches the rest of the library
- Public API hygiene — anything you exported is now a contract

## Component checklist

Copy this into your PR description:

```
- [ ] Forwards refs
- [ ] Uses `cva` for variants (no inline conditional classNames)
- [ ] Consumes semantic tokens only (no raw hex / zinc-N)
- [ ] `asChild` supported (or rationale why not)
- [ ] Example file per variant + a composite (Sizes/States) example under apps/docs-site/examples/<kebab>/
- [ ] Docs page at apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx
- [ ] Sidebar entry added to apps/docs-site/content/navigation.ts
- [ ] PropsTable populated (every prop has a JSDoc description)
- [ ] Test per interactive behavior (userEvent, not fireEvent)
- [ ] axe violations === 0
- [ ] Keyboard navigation works (Tab / Enter / Space / Escape / Arrows where applicable)
- [ ] Looks right in dark AND light themes (verified locally on the docs page)
- [ ] Re-exported from src/index.ts
- [ ] Changeset added (if a publishable package changed)
```
