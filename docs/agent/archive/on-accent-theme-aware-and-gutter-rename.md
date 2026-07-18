---
type: status
status: completed
created: 2026-06-18
updated: 2026-07-18
author: claude-opus-4-8
branch: theme-on-accent-and-gutter-rename
agent: claude-session-2026-06-18-on-accent-gutter
tags: [tokens, theme, tailwind, spacing, on-accent, gutter, downstream-gaps]
---

# Two theming fixes from downstream consumer (ShipIt-AI)

## Scope

Two independent, additive-except-one-rename fixes found by the ShipIt-AI
consumer maintaining a local copy of the DS Tailwind v4 theme bridge:

1. **`--color-on-accent` made theme-aware.** Added `onAccent` to BOTH
   `colorSemanticDark` (`#0a0a0b`) and `colorSemanticLight` (`#ffffff`) in
   `packages/tokens/src/color.ts`; changed the `globals.base.css:52` hardcoded
   literal to a `var(--color-on-accent)` bridge (matching every other color).
   The old near-black literal failed contrast on the light theme's dark accent
   (`oklch(0.45 …)`). 14 consumers pick it up automatically via `text-on-accent`.
2. **`screen` spacing key renamed to `gutter`.** `--spacing-screen[-lg]` →
   `--spacing-gutter[-lg]` in `globals.base.css:159-160`. In Tailwind v4 a
   `--spacing-screen` key minted `h-screen`/`w-screen` and shadowed the reserved
   100vh/100vw viewport utilities (collapsed full-height shells to 16px
   downstream). Consumers updated: `LargeTitle.tsx:39` (`px-screen`→`px-gutter`)
   and `docs-site touch/page.mdx` table. Pre-1.0 utility rename: `p-screen`→
   `p-gutter`.

Also refined two agent-memory files that cited `--color-on-accent` as the
canonical "globals-only token" example ([[theme-tokens-resolution-chain]],
[[theme-tokens-in-globals-not-tokens-css]]) — that example is now stale because
on-accent moved into `tokens.css`.

## Why

Downstream-reported theming bugs; consumer drops its two local divergences on
its next DS bump. Both fixes are in the same family as the JP-Euro
[[ds-upstream-gaps-roadmap]] but from a different consumer.

## State

Implementation complete on branch `theme-on-accent-and-gutter-rename`,
awaiting review/commit. Two `patch` changesets:
`tokens-on-accent-theme-aware.md` (tokens+ui), `ui-rename-screen-spacing-to-gutter.md` (ui).

Verification gate — all green:

- `pnpm --filter @ship-it-ui/tokens build` → `--color-on-accent` in `:root`
  (#0a0a0b) AND `[data-theme='light']` (#ffffff).
- Tokens snapshot updated (`-u`); diff is exactly the two `--color-on-accent`
  lines in the accent group.
- `pnpm lint` (18/18), `pnpm typecheck` (18/18), `pnpm test` (17/17),
  `pnpm build` (10/10) all pass. `format:check` only warns pre-existing
  gitignored generated files; my touched files are Prettier-clean.
- Compiled docs-site CSS verified: `.h-screen{height:100vh}` with NO
  `screen-pad` override (bug gone); `.px-gutter`/`.px-gutter-lg` exist; no
  leftover `.p-screen`; on-accent resolves `#0a0a0b`/`#fff`/`var()` bridge.

No Storybook stories to update ([[no-storybook-migration]]). `tokens.css` is
gitignored so it's not in the diff.

## Related

- [[ds-upstream-gaps-roadmap]] — sibling downstream-gaps work (different consumer)
- [[theme-tokens-resolution-chain]], [[theme-tokens-in-globals-not-tokens-css]] — updated for the on-accent move
- [[v0-changeset-patch-policy]] — both changesets stay patch
- [[no-signature-in-commits]] — no Claude trailer when committing
