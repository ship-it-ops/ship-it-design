---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: "if a README describes a codegen output path that doesn't have a drift test, the README has drifted from the script — verify against the script, not your memory"
tags: [docs, codegen, icons, drift]
---

# `packages/icons/README.md` described a build process that didn't match the code

## What Happened

The May 2026 audit (PM persona, P0 #4) found `packages/icons/README.md`
described the codegen as **rewriting `src/index.ts`** to re-export every
generated component. The actual `scripts/build.ts` rewrites
`src/svg-icons.ts`; `index.ts` is hand-authored and `export *` from
`./svg-icons`.

A first-time contributor adding an SVG ran the build, didn't see their
icon appear "in `index.ts`," and assumed the build was broken.

The fix: rewrite the README's "How it works" section to match what the
script actually does (now correct in tree — verified during this audit).
Replaced the `text-brand` example class (which doesn't exist — see
[[token-doc-drift-bg-brand]]) with `text-accent`.

The deeper fix is the [[drift-test-for-codegen]] pattern:
`packages/icons/scripts/build-icon-data.test.ts` enforces lockstep
between manifest and generated output. Any new codegen output must ship
with the equivalent drift test.

## Tripwire

**If a README claims a codegen output lands in some path — verify
against the script.** Run:

```bash
pnpm --filter @ship-it-ui/<pkg> build
git status --short
```

The actual modified files are the truth. If the README disagrees, the
README is wrong.

A stronger structural tripwire: every codegen output should ship with a
drift test ([[drift-test-for-codegen]]). If a README mentions a
generated file but no drift test exists for it, the README's claim is
unverified — verify by reading the generator script.

## Why It Hurt

Same shape as [[token-doc-drift-bg-brand]] — first-touch contributor
experience cost. Worse, this drift wasn't a stale class name; it was a
**conceptual drift** about how the package's build worked. A new
contributor following the README would conclude the package had no
working codegen at all.

## Don't Do This

- Don't write codegen README claims by memory. Read the script.
- Don't ship a new codegen without a drift test and without a README
  section that names the actual output path verbatim.
- When refactoring a codegen output path, grep `**/*.md` for the old
  path and update every reference. Don't trust "well, the README will
  catch up eventually."

## Related

- [[drift-test-for-codegen]] — the structural prevention.
- [[token-doc-drift-bg-brand]] — sibling docs-drift scar.
