---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [components, conventions, structure]
---

# Component authoring shape

## When to Use

Every new component, pattern, or shipit composite. `Button`
(`packages/ui/src/components/Button/`) is the canonical reference.

## Implementation

A component folder contains **exactly three files**:

```
packages/ui/src/components/<Name>/
  <Name>.tsx          — implementation
  <Name>.test.tsx     — Vitest + RTL + vitest-axe
  index.ts            — `export * from './<Name>';`
```

Patterns live under `packages/ui/src/patterns/<Name>/` with the same
shape. Shipit composites under `packages/shipit/src/<group>/<Name>.tsx`
(no folder — group-flat).

**Required**:

- `forwardRef<HTMLX, Props>` on every component. Exceptions need a JSDoc
  note (precedent: `EntityListRow*` split — see
  [[specialized-typed-exports]]).
- `cva` for variant axes; no inline conditional className concatenation
  that should be a variant.
- Semantic Tailwind utilities only (`bg-accent`, `text-text-muted`,
  `border-border-strong`). No raw hex or `oklch(…)` literals in
  components.
- `Omit<HTMLAttributes<X>, '<conflict>'>` when extending — see
  [[htmlattributes-omit-pattern]].
- `'use client';` directive on the first line — see
  [[ssr-rsc-support-strategy]].
- Export from `packages/<pkg>/src/index.ts` (alphabetized within section).

**Docs surface** (separate from source):

- Examples at `apps/docs-site/examples/<kebab>/<variant>.tsx` —
  default-export named `Example`, file shown verbatim under the Code tab.
- MDX page at `apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx` with
  `<LivePreview>` per variant and `<PropsTable component="…">`.
- Sidebar entry in `apps/docs-site/content/navigation.ts` — pages not
  listed there are unreachable.

## Examples

- Primitive: `packages/ui/src/components/Button/Button.tsx` — cva
  variants, asChild via `<Slot>`, forwardRef.
- Pattern: `packages/ui/src/patterns/DataTable/DataTable.tsx` — composes
  primitives, uses `useControllableState`, roving-tabindex semantics.
- Shipit composite: `packages/shipit/src/entity/EntityListRow.tsx` — the
  precedent for [[specialized-typed-exports]].

## Gotchas

- Pure utils (`utils/cn.ts`) and type-only files do **not** get
  `'use client'`.
- Tests must use `userEvent`, not `fireEvent` (keyboard parity matters).
  Exceptions need an inline comment explaining (typically Radix keyboard
  handlers that `userEvent` doesn't reach in jsdom).
- Axe assertion on the rendered open state, not the empty viewport — see
  [[drawer-sheet-axe-gap]].
- `<PropsTable>` reads JSDoc above each prop via `react-docgen-typescript`.
  Keep prop comments accurate; they're the descriptions consumers see.

## Related

- [[htmlattributes-omit-pattern]]
- [[specialized-typed-exports]]
- [[ssr-rsc-support-strategy]]
- [[drawer-sheet-axe-gap]]
