---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: "if you see animate-[ship-*_220ms_…] with a literal millisecond value, stop — the token override won't reach it"
tags: [a11y, motion, prefers-reduced-motion, animations, tailwind]
---

# `animate-[ship-dialog-in_180ms_…]` literals silently bypassed `prefers-reduced-motion`

## What Happened

The May 2026 audit (A11y persona, Theme E + the matching architecture
doc lie) found that the `@media (prefers-reduced-motion: reduce)` block
in `tokens.css` zeroed `--duration-micro` / `--duration-step` — but
every component animation hardcoded literal durations:

```tsx
className = 'animate-[ship-dialog-in_180ms_var(--easing-out)]';
//                                  ^^^^^ literal, not var(--duration-step)
```

The token override had no effect. Drawer slid the full viewport, Sheet
rose from the bottom, Dialog scaled-and-translated, Toast slid, and the
infinite Spinner / Pulse / PulseRing / Skeleton / Indeterminate
animations continued at full speed forever — under `prefers-reduced-
motion: reduce`. 23 such literal usages across the library.

Adding insult: `docs/architecture.md:101` _claimed_ reduced motion was
automatic. PM audit cross-flagged the docs lie as P0.

The current fix in `animations.css` adds a global override
(`@media (prefers-reduced-motion: reduce) { *, *::before, *::after {
animation-duration: 0.001ms !important; transition-duration: 0.001ms
!important; } }`).

## Tripwire

**If you see `animate-[ship-*_<N>ms_…]` with a literal millisecond value
in a new component — stop.** Either:

- Use `var(--duration-step)` / `var(--duration-micro)` inside the
  `animate-[…]` arbitrary value so the token override reaches it; OR
- Trust the global `animation-duration: 0.001ms !important` override
  in `animations.css` but still prefer reading the token for spinners /
  infinite animations that need to also stop completely.

For infinite animations (Spinner / Pulse / Skeleton): the global
override stops them via `animation-duration`, but they may still appear
to "blink" in the static end state. Consider a separate
`prefers-reduced-motion: reduce` rule that sets `animation-iteration-
count: 0` or replaces with a static visual.

## Why It Hurt

Vestibular-sensitive users with `reduce` set saw the full motion suite
ignored. That's a WCAG 2.3.3 (and a strict-AA expectation for entrance/
exit) fail. The Spinner's JSDoc even _claimed_ it respected reduced
motion — false. Documentation that lies about a11y compliance is the
worst documentation kind: it tells consumers "you can ship to a11y-
strict customers" when in fact they cannot.

## Don't Do This

- Don't hardcode literal ms / s durations inside `animate-[…]` strings.
- Don't trust JSDoc claims of a11y compliance without verifying — that's
  how this slipped. Audit by running the actual `prefers-reduced-motion`
  media query in a real browser.
- Don't write architecture-doc claims about automatic-anything without a
  test that proves it. The docs lie compounded the bug because
  contributors stopped looking.

## Related

- [[dark-first-oklch-theming]] — the token system the override is meant
  to live in.
- [[theme-tokens-resolution-chain]] — adding new motion tokens follows
  the chain.
