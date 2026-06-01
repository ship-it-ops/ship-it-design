---
type: pattern
status: active
created: 2026-06-01
updated: 2026-06-01
author: claude-opus-4-7
tags: [react, hooks, set-state, render, derived-state]
---

# Clear stale state during render, not in an effect

## When to Use

When a piece of local state references an identity (an item id, a key, a
selection) that lives in a derived list, and that identity can disappear
from the list — e.g.:

- "roving tabindex `activeId` should clear when the focused item is no
  longer visible (parent collapsed)"
- "currently-hovered row id should clear when the row is filtered out"
- "selected option should clear when the option list changes and the
  previous selection isn't in the new options"

Tempting first instinct: an effect on `[id, list]` that clears the id.

```tsx
// ❌ Anti-pattern. eslint-plugin-react-hooks v7 flags this as
//    `react-hooks/set-state-in-effect`, and it's right.
useEffect(() => {
  if (id && !list.some((x) => x.id === id)) setId(null);
}, [id, list]);
```

## Implementation

Set the state during render, behind the same guard. React detects the
in-render `setState`, throws away the current render output, and
re-renders with the new state — same end-result as the effect, no
cascading-render lint warning.

```tsx
// ✅ Pattern.
if (id && !list.some((x) => x.id === id)) {
  setId(null);
}
```

This is the [React-docs-sanctioned form](https://react.dev/reference/react/useState#storing-information-from-previous-renders)
("Storing information from previous renders"). The guard is what keeps
it from looping: the call only happens when state is out of sync with
props, and the next render — with state in sync — doesn't re-fire it.

## Examples

- `packages/ui/src/patterns/Tree/Tree.tsx` — clears `activeId` when the
  active item is no longer in `flatVisible` (after a parent collapses).

## Gotchas

- **The guard is mandatory.** A bare `setId(...)` in render without a
  comparison loops infinitely.
- **Check for other readers first.** If only one place reads the state
  (e.g., the next-step computation in a `useMemo` that already
  fall-backs gracefully on a stale id), you may not even need this
  pattern — deleting the effect entirely is fine. Tree.tsx kept the
  pattern because consumers persist the activeId via a callback prop.
- **Don't migrate every `set-state-in-effect`.** Some effects _are_
  external-state subscriptions (DOM reads, IntersectionObserver,
  WebSocket, etc.) — those legitimately need `setState` inside an
  effect and ride a targeted disable. See
  [[react-hooks-v7-set-state-in-effect-false-positives]] for the
  flip-side rule.

## Related

- [[react-hooks-v7-set-state-in-effect-false-positives]] — when the v7
  rule is wrong about your effect.
- [[usecontrollable-undefined-crash]] — another "value disappears"
  pattern; don't assert non-null on a `useControllableState` result.
