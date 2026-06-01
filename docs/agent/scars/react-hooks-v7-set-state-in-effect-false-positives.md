---
type: scar
status: active
created: 2026-06-01
updated: 2026-06-01
author: claude-opus-4-7
incident-date: 2026-06-01
tripwire: 'when a new component needs an SSR mounted-flag or a post-mount DOM read, expect react-hooks/set-state-in-effect to fire; reach for a targeted eslint-disable with a Why-comment rather than restructuring into useSyncExternalStore'
tags: [eslint, react-hooks, set-state-in-effect, ssr, dom, effect]
---

# `eslint-plugin-react-hooks` v7's `set-state-in-effect` fires on

# legitimate effect patterns

## What Happened

Pulling Dependabot #66 (eslint-plugin-react-hooks 5.2.0 → 7.1.1) added
the new rule `react-hooks/set-state-in-effect`. It caught one real
anti-pattern in `packages/ui/src/patterns/Tree/Tree.tsx` (the stale-id
clear-on-collapse effect — see
[[derive-during-render-stale-clear]] for the fix) — that part is the
rule earning its keep.

But it also fires on two patterns that are correct and idiomatic:

1. **SSR hydration mounted-flag**
   (`apps/docs-site/components/shell/ThemeToggle.tsx`):

   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []); // ← flagged
   return mounted ? <Themed /> : <Placeholder />;
   ```

   The pattern exists exactly so SSR renders a stable placeholder and
   client renders the theme-aware icon, avoiding hydration mismatch.
   There's no clean React-canonical alternative — `useSyncExternalStore`
   with a `subscribe` that calls back once is more code and less
   readable.

2. **Post-navigation DOM scan**
   (`apps/docs-site/components/docs/TableOfContents.tsx`):
   ```tsx
   useEffect(() => {                                            // ← flagged
     const article = document.querySelector('article.docs-prose');
     if (!article) { setHeadings([]); return; }
     const list = Array.from(article.querySelectorAll('h2[id], h3[id]'))…;
     setHeadings(list); setActive(null);
     const obs = new IntersectionObserver(…);
     return () => obs.disconnect();
   }, [pathname]);
   ```
   The DOM (after rehype-slug runs) is the external state we're reading.
   The synchronous `setHeadings(list)` _is_ the documented "set state
   from external system" use — the rule fires because it can't
   distinguish reading-then-updating from a render-side-effect, but the
   doc-page link in the rule message even admits this case is valid.

## Tripwire

When you add a component that:

- starts unmounted on the server and needs an inline "we're hydrated
  now" flag, OR
- reads from the DOM (or any imperative web API) on mount/route change
  and projects the result into state,

…the v7 rule will fire. **Reach for a targeted disable, not a refactor.**
Either:

```tsx
// eslint-disable-next-line react-hooks/set-state-in-effect
useEffect(() => setMounted(true), []);
```

…or, if multiple `setState` calls inside the effect body fire the rule:

```tsx
/* eslint-disable react-hooks/set-state-in-effect */
useEffect(() => { … }, […]);
/* eslint-enable react-hooks/set-state-in-effect */
```

Always pair the disable with a one-line comment explaining _why_ the
pattern is intentional, so the next reader doesn't waste cycles
investigating.

## Why It Hurt

Initial reaction to a lint failure on a major-bump PR is "refactor away
the violation." For the Tree.tsx case that's right — the effect was a
real anti-pattern. For the ThemeToggle / TableOfContents cases that
would be wrong; both effects do exactly what they should. Without this
note, a future agent updating the lint rules or auditing disables might
"clean them up" and re-introduce a hydration flash or a broken TOC.

## Don't Do This

- Don't restructure an SSR mounted-flag into `useSyncExternalStore` to
  appease the rule — that's strictly worse for readability and isn't
  what the React team recommends.
- Don't try to read DOM during render. It's both a violation of React's
  purity contract and impossible during SSR (no `document`).
- Don't mass-disable the rule globally in the eslint config. It does
  catch real anti-patterns (Tree.tsx) — keep it on, and pay the
  per-occurrence comment cost when you know the pattern is intentional.

## Related

- [[derive-during-render-stale-clear]] — the other side of this: when
  the v7 rule is _right_ and the effect should become render-time
  state.
