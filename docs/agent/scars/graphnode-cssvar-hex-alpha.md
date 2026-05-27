---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: 'if you see ${color}${alpha} or var(--color-…)${suffix} as part of a CSS string, stop — CSS vars are not hex strings'
tags: [css, oklch, color, css-variables, graph]
---

# `var(--color-accent)40` is unparseable CSS — the browser dropped the glow shadow silently

## What Happened

`GraphNode.tsx:64` (pre-May-audit) concatenated a CSS variable with a
hex-alpha suffix to fake a 25% alpha:

```ts
boxShadow: `0 0 ${state === 'hover' ? 30 : 20}px ${color}${glowAlpha}`;
// becomes: `0 0 30px var(--color-accent)40`
```

`var(--color-accent)40` is **unparseable** — the trailing `40` is an
attempted hex-alpha but `var(--color-accent)` is not a hex string. The
browser dropped the rule. The glow shadow never rendered.

The component's tests checked DOM presence (the `style` attribute was
set) but not paint, so the regression shipped quietly. A visible default
state of a flagship component silently failed to render.

## Tripwire

**If you see `${color}${alpha}` or `var(--color-…)${suffix}` as part of a
CSS string, stop.** CSS variables resolve at compute time; you can't
suffix them like strings. Use `color-mix()`:

```ts
boxShadow: `0 0 30px color-mix(in oklab, ${color} ${pct}%, transparent)`;
```

Or define a sibling token with the alpha baked in (e.g.
`--color-accent-glow`) and reference it directly.

## Why It Hurt

The hover/path glow is presentational, so the failure was _silent_ —
no error, no warning, no test failure. The visual that the test was
nominally exercising was broken for an unknown number of releases. Tests
that assert "the style attribute contains the shadow string" are not
asserting "the browser painted the shadow."

## Don't Do This

- Don't concatenate alpha onto a CSS variable string.
- Don't write tests that only assert `getComputedStyle(…).boxShadow !==
''` — that's true for invalid CSS too.
- Don't introduce new "alpha by suffix" patterns; reach for `color-mix`
  or a paired `*-glow` token.
- When a visual regresses silently in production, distrust DOM-presence
  tests and add a screenshot or computed-style-parse assertion.

## Related

- [[dark-first-oklch-theming]] — components consume token vars; the
  pattern that this scar violated.
- [[theme-tokens-resolution-chain]] — adding a `*-glow` companion token
  follows the same chain (TS → tokens.css → @theme inline).
