---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [radix, tailwind, data-state, group, css]
---

# Radix `data-state` requires `group` on the parent

## When to Use

Whenever you want a child element to style itself based on its Radix
ancestor's open/closed state (or any other `data-state` attribute Radix
sets on the **trigger**, not the child).

## Implementation

The parent needs `className="group"` (or `group/<name>` if nesting), and
the child uses `group-data-[state=open]:…`:

```tsx
<Disclosure.Trigger className="group">
  Toggle
  <ChevronDownIcon className="transition-transform group-data-[state=open]:rotate-180" />
</Disclosure.Trigger>
```

A **bare** `data-[state=open]:rotate-180` on the child never matches —
Radix sets `data-state` on the trigger, not the child. The
group-modifier is what crosses the boundary.

## Examples

Look at any Disclosure / Accordion trigger that rotates a caret on open
— if it works, the parent has `group`. If you're authoring a new one and
the caret won't animate, this is almost always why.

## Gotchas

- Tailwind's `group` is per-tree. Two nested groups need
  `group/outer`/`group/inner` named groups to disambiguate.
- The `data-state` values Radix sets vary per primitive — `open`/`closed`
  for Dialog, `checked`/`unchecked` for Checkbox, `active`/`inactive` for
  Tabs. Verify against Radix docs for the primitive you're using.
- This is the most common Radix styling false-start in this codebase.
  Reviewers flag the bare form per `.claude/ship-reviewed-prs-overrides.md`
  ("Data-state variants need `group`").

## Related

- [[component-authoring-shape]] — components that use Radix follow this
  pattern when they need state-driven styling.
