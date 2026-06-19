---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [tokens, tailwind, css-variables, theme]
---

# Token resolution chain: TS → tokens.css → @theme inline → Tailwind utilities

## When to Use

Whenever you need to add, audit, or modify a design token, **or** when
you're tempted to flag a token as "doesn't exist" during review.

## Implementation

```
1. packages/tokens/src/*.ts           ← TypeScript token defs (source of truth)
                ↓ pnpm --filter @ship-it-ui/tokens build (build-css.ts)
2. packages/tokens/styles/tokens.css  ← :root + [data-theme="light"] CSS vars
                ↓ @import in globals.css
3. packages/ui/src/styles/globals.css ← @theme inline { --color-bg: var(--color-bg); … }
                ↓ Tailwind v4 sees @theme
4. Tailwind utilities                 ← bg-bg, text-text, border-border-strong, …
```

A consuming app does **one** `import '@ship-it-ui/ui/styles/globals.css'`
at its entrypoint. That single import brings in tokens + Tailwind utilities;
no extra Tailwind config required in the consumer.

## Examples

- Color: `packages/tokens/src/color.ts` → `tokens.css` `--color-bg` →
  `globals.css` `@theme inline { --color-bg: var(--color-bg); }` →
  `bg-bg` Tailwind utility.
- Z-index (fixed in the May audit cycle):
  `packages/tokens/src/z-index.ts` → `tokens.css` `--z-modal: 1300;` →
  `globals.css` `--z-modal: var(--z-modal);` → `z-modal` utility.

## Gotchas

**The most important gotcha — and the #1 false-positive in code review:**
a token may be defined in `tokens.css`, in `globals.css`'s `@theme inline`
block, or both — and which file owns it can change over time (e.g.
`--color-on-accent` was a globals-only literal until 2026-06-18, when it was
promoted to a theme-aware `tokens.css` token; as of then every `@theme inline`
entry is a `var()` bridge, but new derivations may still appear globals-only).
Before flagging "token X doesn't exist," grep **both** files:

```bash
grep -n "color-on-accent" packages/tokens/styles/tokens.css \
                          packages/ui/src/styles/globals.css
```

This convention is encoded in `.claude/ship-reviewed-prs-overrides.md`
("Token architecture trap") for the SE reviewer persona.

Other gotchas:

- Adding a new color token requires editing **both** `colorSemanticDark`
  and `colorSemanticLight` in `color.ts`. The `satisfies` constraint
  catches mismatches at TS-compile time — listen to the error.
- Don't hardcode `oklch(…)` in components — that bypasses `--accent-h`
  and breaks the reskin demo. Five components were caught doing this in
  the May audit (Input/Textarea error rings, Avatar fallback,
  GraphMinimap, CTAStrip).
- `prefers-reduced-motion` zeros the duration _tokens_, but components
  must consume `var(--duration-step)` from their `animate-[…]` strings or
  the literal duration wins. See [[reduced-motion-token-bypass]].

## Related

- [[dark-first-oklch-theming]] — the _why_ behind the chain.
- [[theme-tokens-in-globals-not-tokens-css]] — the false-positive scar.
- [[token-doc-drift-bg-brand]] — what happens when docs reference token
  names that don't exist.
