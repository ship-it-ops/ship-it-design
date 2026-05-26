---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [typescript, props, html-attributes]
---

# `Omit` conflicting HTML attributes before extending

## When to Use

Any time a component's prop interface extends `HTMLAttributes<X>` (or
`ComponentPropsWithoutRef<X>`) **and** declares a prop whose name
collides with a standard HTML attribute.

## Implementation

```ts
// Collision: HTML's `title` is a string tooltip, but the component
// wants `title` to mean its visible header.
type Props = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title?: ReactNode;
  // …
};
```

If you don't `Omit`, TypeScript reports TS2430 (or worse: silently
accepts a narrower override that breaks consumers passing an HTML
attribute by spread).

## Examples

Recurring offenders flagged in this codebase:

- `title` — common for visible headers (Drawer, Sheet, Dialog).
- `onSelect` — clashes with native `<details>` event handler.
- `values` — clashes with `HTMLFormElement.values()`-style attributes.
- Drag handlers (`onDragStart`, `onDrop`, …) on draggable composites.
- `role` — common as a domain prop (chat speaker, job title) in shipit.
- `cite` — clashes with `<blockquote cite>` etc.
- `cols` / `rows` — clash with `<textarea>` attributes.

## Gotchas

- The alternative — renaming the prop ("titleNode", "headerText") — is
  sometimes cleaner when the rename is semantically helpful, but `Omit`
  is the default. Pick one per case; don't mix conventions in the same
  component.
- Repeated `Omit` boilerplate can be lifted into a shared
  `OmittedHTMLAttributes<…>` utility if a category of components keeps
  hitting the same conflict — currently not done; revisit if more than
  3 components Omit the same property.
- This rule applies equally to `ComponentPropsWithoutRef<'div'>` etc.
  Any time TypeScript merges your prop into the underlying HTML element
  type, the Omit step is required.

## Related

- [[component-authoring-shape]] — the broader convention this fits into.
