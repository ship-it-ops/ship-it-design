# Design handoff

How a design handoff (Figma file, design-tool export, screenshots + a SKILL
doc) maps onto this codebase. Read this the first time you're translating a
real design into the system.

## The translation steps

### 1. Tokens come first

Before any component work, audit the design for token-level decisions:

| Design layer       | Lands in                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| Color styles       | `packages/tokens/src/color.ts`                                          |
| Type styles        | `packages/tokens/src/typography.ts`                                     |
| Spacing scale      | `packages/tokens/src/spacing.ts`                                        |
| Corner radii       | `packages/tokens/src/radius.ts`                                         |
| Shadow / elevation | `packages/tokens/src/shadow.ts` (+ `elevation.ts` for inset highlights) |
| Motion             | `packages/tokens/src/motion.ts`                                         |
| Breakpoints        | `packages/tokens/src/breakpoint.ts`                                     |
| Z-index layers     | `packages/tokens/src/z-index.ts`                                        |

### 2. Decide the color strategy

This system is **dark-first**, with light as an opt-in override. For each color
decision in the handoff:

1. Does it map to an existing **semantic token** (`bg`, `panel`, `text`,
   `text-muted`, `border`, `accent`, `ok`, `warn`, `err`, …)? If yes, use it.
2. Does it want a **new semantic token**? Add it to both the dark and light
   maps. Every new color in dark needs a light counterpart.
3. Is it an **accent shade**? Express it as `oklch(L C var(--accent-h))`.
   Don't hardcode the hue; the whole UI re-skins via the `--accent-h` knob
   (default `200`).
4. Is it a **non-accent state color** (ok / warn / err / purple / pink)? Add a
   primitive in `colorPrimitive` and alias it from both semantic maps.

After editing tokens:

```bash
pnpm --filter @ship-it-ui/tokens build
```

This regenerates `styles/tokens.css` and `dist/`. Spot-check the CSS — search
for the new token name, confirm it appears under both `:root { … }` and
`[data-theme='light'] { … }` if it varies between themes.

### 3. Icons next

This codebase uses two icon systems side by side:

- **`IconGlyph`** — unicode glyphs rendered as styled text (`◇`, `◎`, `✦`, …).
  This is the canonical engineering-console vocabulary; most components use it.
  Add a glyph by extending the map in `packages/icons/src/glyphs.ts`.
- **SVG icons** — SVGR pipeline. Drop a `*.svg` into `packages/icons/src/svg/`,
  run `pnpm --filter @ship-it-ui/icons build`, and a `*Icon` React component
  appears. See `packages/icons/README.md` for the SVG hygiene checklist.

Use `IconGlyph` by default. Use SVG icons for connector logos, brand marks,
and anything that genuinely needs vector geometry rather than a glyph.

### 4. Decide where the component lives

Generic primitive (Button, Input, Dialog, …) → `@ship-it-ui/ui` (`components/`).
Composite of primitives (Tabs, Combobox, DataTable, …) → `@ship-it-ui/ui`
(`patterns/`). Specific to ShipIt-AI's product (AskBar, GraphNode,
EntityCard, Hero, …) → `@ship-it-ui/shipit`.

The test: _would another Ship-It Ops product want this verbatim?_ Yes → ui.
No → shipit.

### 5. Components last

For each component in the handoff:

1. Identify which existing tokens it consumes. If a value isn't in the token
   system, stop and add it as a token first (step 1).
2. Identify the **variants** (`primary`, `secondary`, `ghost`, `outline`, …)
   and **sizes** (`sm`, `md`, `lg`). These map to `cva` variant axes.
3. Identify the **states**: `default`, `hover`, `focus`, `active`, `disabled`,
   `loading` (if any). Hover / focus are Tailwind modifiers. The others want
   explicit state classes.
4. Identify the **a11y semantics**: implicit role? Needs ARIA wiring? Is there
   a Radix primitive that gives this for free? (Dialog, Popover, Tabs,
   Tooltip, DropdownMenu, ContextMenu, HoverCard, Toast, Slider, Switch,
   Checkbox, RadioGroup, Avatar, Select are all wrapped over Radix.)
5. Now follow [`adding-a-component.md`](./adding-a-component.md) to implement.

## Common handoff pitfalls

- **One-off color values.** A design will sometimes have a stray `#5C5C5C`
  that doesn't match any palette token. Don't smuggle it into the code. Push
  back to design or add a token first.
- **Pixel-perfect spacing.** If a designer uses `13px` somewhere, ask whether
  they meant `12` or `16`. The spacing scale is irregular by design (4-pt with
  bumps at 22 and 28 to discourage hand-tuned 7-pt values); we don't ship
  arbitrary spacing.
- **Light-only or dark-only thinking.** Every color change needs both
  counterparts. Storybook's theme toggle is the truth detector — flip it
  before opening the PR.
- **Hover-only states.** Make sure the design has a focus state too. If it
  doesn't, we'll add one — keyboard users need it.
- **Motion without reduced-motion.** The duration tokens are zeroed under
  `prefers-reduced-motion: reduce` automatically; if you author a one-off
  keyframe, gate it on the same media query.
- **`role` collisions.** When extending `HTMLAttributes<X>`, a prop named
  `role` (e.g., chat speaker, job title) clashes with the HTML attribute.
  `Omit<HTMLAttributes<X>, 'role'>` before extending, or rename the prop.

## What goes in a handoff PR

A typical first-time handoff PR (or PR series) lands in this order:

1. **Tokens PR** — populates real values; no component changes. Verify the
   generated `tokens.css` looks right in both `:root` and `[data-theme='light']`.
2. **Icons PR** — drops SVG additions and / or extends the glyph map.
3. **Component PRs** — one per component (or tightly-related family). Each
   includes story + tests + axe-clean.

Reviewers can sanity-check each layer independently.
