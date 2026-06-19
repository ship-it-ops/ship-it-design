---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: "before flagging 'token X does not exist', grep BOTH packages/tokens/styles/tokens.css AND packages/ui/src/styles/globals.css — most-common false-positive in this repo"
tags: [tokens, review, false-positive, theme, css]
---

# Many tokens live ONLY in `globals.css` `@theme inline`, not in `tokens.css` — most-common review false-positive

## What Happened

Multiple Claude-driven PR reviews flagged "token X doesn't exist" when
the token actually lived in `packages/ui/src/styles/globals.css`'s
`@theme inline` block but not in `packages/tokens/styles/tokens.css`.
Example offender token (per `.claude/ship-reviewed-prs-overrides.md`):
`--color-on-accent` — referenced in components, defined in `globals.css`
only.

The split exists because some tokens are _derived_ from primitives (the
`@theme inline` block can re-bind variables) and only need to materialize
as Tailwind utilities, not as part of the canonical token export.
`tokens.css` is what `@ship-it-ui/tokens` _publishes_; `globals.css` is
what `@ship-it-ui/ui` layers on top.

**Update (2026-06-18):** `--color-on-accent` — the canonical example above —
was promoted into `tokens.css` as a theme-aware token (`#0a0a0b` dark /
`#ffffff` light) because the old hardcoded near-black failed contrast on the
light theme's dark accent. As of that change every `@theme inline` entry in
`globals.css` is a `var()` bridge (no more globals-only literals). The tripwire
below is unchanged and still load-bearing: ownership of a token name can move
between the two files, so grep BOTH before declaring one missing — don't trust
a stale "it's only in globals" memory.

## Tripwire

**Before flagging "token X does not exist," grep both files:**

```bash
grep -n "color-on-accent" packages/tokens/styles/tokens.css \
                          packages/ui/src/styles/globals.css
```

If it appears in either, it exists. Reviewers (especially the SE
persona) must do this both-files check first — it's encoded as the
"Token architecture trap" override in `.claude/ship-reviewed-prs-overrides.md`.

## Why It Hurt

False-positive findings on the most-visible review surface (token usage)
erode trust in the bot. A team that learns to dismiss "token X missing"
findings will dismiss the _real_ ones too. The override file exists
specifically because this pattern recurred.

## Don't Do This

- Don't grep only `tokens.css` and declare a token missing.
- Don't move all `globals.css` `@theme inline` derivations into
  `tokens.css` as a "consistency cleanup" — the split is load-bearing
  for the publish boundary (`tokens.css` is part of the published
  artifact; derivations belong to consumers via `globals.css`).
- Don't add a third "shadow tokens" file. Two is the right number.

## Related

- [[theme-tokens-resolution-chain]] — the canonical chain that includes
  both files.
- [[dark-first-oklch-theming]] — the _why_ behind needing the @theme
  inline derivations (the `--accent-h` knob lives there).
