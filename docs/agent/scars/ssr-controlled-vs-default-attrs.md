---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-17
tripwire: 'if you see <details open={defaultOpen}> or <dialog open={defaultOpen}> or <input checked={defaultChecked}> in a component — stop, those are controlled attributes'
tags: [react, controlled, native-html, details, dialog, input]
---

# `<details open={defaultOpen}>` is a controlled attribute — React re-applies it every render

## What Happened

PR #39's `EntityList.tsx:72` review thread caught a pattern that recurs:
treating React's `open` / `checked` / `value` attributes as if they were
defaults. They are **controlled** attributes — React re-applies them on
every render, overriding any user interaction.

The pattern:

```tsx
// WRONG — collapses again on the next render
<details open={defaultOpen}>
  <summary>{title}</summary>…
</details>;

// RIGHT — back into local useState + onToggle
function Collapsible({ defaultOpen, title }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{title}</summary>…
    </details>
  );
}
```

Same shape for `<dialog open={…}>` / `<input checked={…}>` /
`<select value={…}>` — all controlled.

## Tripwire

**If you see any of these in a component, stop:**

- `<details open={defaultOpen}>` (or any `open` prop passed through).
- `<dialog open={…}>` directly bound to a prop.
- `<input checked={…}>` or `<select value={…}>` bound to a prop.

A `defaultX` prop must back into local `useState` + the corresponding
change/toggle event handler — **not** into the controlled attribute
directly. The fix is mechanical.

This convention is encoded in `.claude/ship-reviewed-prs-overrides.md`
("Controlled vs. uncontrolled native elements"), citing the PR #39
`EntityList.tsx:72` thread as the canonical example.

## Why It Hurt

The visible behavior is "user expands the section, the page state
changes for unrelated reasons, the section collapses again on the next
render." The cause is invisible until you remember React's controlled-
attribute contract. Wastes hours in front-end debugging.

## Don't Do This

- Don't bind `open` / `checked` / `value` directly to a `defaultX` prop.
- Don't add a comment "// uncontrolled" to a clearly-controlled
  attribute — fix the binding.
- Don't introduce a custom `useDetailsState` hook to "abstract" this; a
  six-line `useState` + `onToggle` is clearer and the canonical fix.

## Related

- [[hydration-theme-mismatch]] — sibling SSR/controlled-state gotcha.
- [[ssr-rsc-support-strategy]] — broader SSR strategy.
