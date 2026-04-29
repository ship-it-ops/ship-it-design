# Design handoff

This document explains how a design handoff (typically a Figma file) maps onto this
codebase. It's intended for the first time you're translating a real design into the
system.

## The translation steps

### 1. Tokens come first

Before any component work, audit the design for token-level decisions:

| Design layer       | Lands in                                      |
| ------------------ | --------------------------------------------- |
| Color styles       | `packages/tokens/src/color.ts`                |
| Type styles        | `packages/tokens/src/typography.ts`           |
| Spacing scale      | `packages/tokens/src/spacing.ts`              |
| Corner radii       | `packages/tokens/src/radius.ts`               |
| Shadow / elevation | `packages/tokens/src/shadow.ts`               |
| Motion             | `packages/tokens/src/motion.ts`               |
| Breakpoints        | `packages/tokens/src/breakpoint.ts`           |

For colors, decide:

1. The **primitive palette** (raw scales — `brand 50…900`).
2. The **semantic mapping** for light theme (which primitive does `background`,
   `text`, `brand`, etc., resolve to?).
3. The **semantic mapping** for dark theme.

After editing tokens:

```bash
pnpm --filter @ship-it/tokens build
```

This regenerates `styles/tokens.css`. Spot-check it.

### 2. Icons next

Export each icon from Figma as a clean SVG (single color, no fixed dimensions).
Drop them in `packages/icons/src/svg/` using kebab-case filenames. Run:

```bash
pnpm --filter @ship-it/icons build
```

See [`packages/icons/README.md`](../packages/icons/README.md) for the SVG hygiene
checklist.

### 3. Components last

For each component in the design:

1. Identify which existing tokens it consumes. If a value isn't in the token system,
   stop and add it as a token first.
2. Identify the **variants** (visual modes — `primary`, `secondary`) and **sizes**
   (`sm`, `md`, `lg`). These map directly to `cva` variant axes.
3. Identify the **states**: `default`, `hover`, `focus`, `active`, `disabled`,
   `loading` (if any). All except hover/focus need explicit Tailwind classes.
4. Identify the **a11y semantics**: what's the implicit role? Does it need ARIA
   wiring? Is there a Radix primitive that gives us this for free?
5. Now follow [`adding-a-component.md`](./adding-a-component.md) to implement.

## Common handoff pitfalls

- **One-off values** — Figma will sometimes have a stray `#5C5C5C` that doesn't match
  any palette token. Don't smuggle it into the code. Push back to design or extend
  the palette first.
- **Pixel-perfect spacing** — if a designer uses `13px` somewhere, ask whether they
  meant `12` or `16`. We don't ship arbitrary spacing.
- **Hover-only states** — make sure the design also has a focus state. If it doesn't,
  we will, because keyboard users need it.
- **Dark mode oversight** — every color change needs a dark-mode counterpart. Storybook's
  theme toggle is the truth detector.

## What goes in a handoff PR

A typical first-time handoff PR (or PR series) lands in this order:

1. **Tokens PR** — populates real values; no component changes.
2. **Icons PR** — drops the icon set + regenerates components.
3. **Component PRs** — one per component, each with story + tests.

Reviewers can sanity-check each layer independently.
