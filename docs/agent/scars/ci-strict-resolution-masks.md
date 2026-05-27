---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-17
tripwire: "if a new component imports from @ship-it-ui/<pkg> that isn't already declared as a peer or dep of THIS package, stop — CI's strict resolution will fail even though pnpm's workspace symlink hides it locally"
tags: [pnpm, workspace, ci, dependencies, icons]
---

# pnpm symlinks let undeclared workspace deps "work" locally but CI's strict resolution catches them

## What Happened

Commit `bc718e0` ("Fix CI: declare @ship-it-ui/icons dep, address a11y
lint errors") landed because new `@ship-it-ui/ui` components imported
`@ship-it-ui/icons` **without** the package being declared as a peer or
dev dependency of `ui`. Locally, `pnpm`'s workspace symlinks resolved
the bare specifier and everything ran. In CI's strict resolution mode
(or any consumer's `pnpm install`), the import failed.

The fix:

- Add `@ship-it-ui/icons` to both `peerDependencies` and `devDependencies`
  of `@ship-it-ui/ui`.
- Mark all `@ship-it-ui/*` paths external in `packages/ui/tsup.config.ts`
  (regex `/^@ship-it-ui\//`) so the icons package isn't bundled into
  `ui`'s `dist/`.

This is the same shape as the pre-audit `@ship-it-ui/tokens` devDep
mistake (Theme A) — the symptom (works locally, fails for consumers)
is identical.

## Tripwire

**Before importing any `@ship-it-ui/<pkg>` from a sibling, verify both:**

```bash
# 1. Is it declared as a peerDependency of the importing package?
grep -n "ship-it-ui/<pkg>" packages/<importer>/package.json
# Look for it under "peerDependencies" AND ideally "devDependencies"
# (the devDep makes the local install resolve; peer makes consumers resolve)

# 2. Is it listed in tsup.config.ts external?
grep -n "@ship-it-ui" packages/<importer>/tsup.config.ts
```

If the answer to either is no, fix before merging. CI **will** fail —
better to find it on first push than after a chain of PRs already
depends on the import.

## Why It Hurt

Days lost to "works locally, fails in CI" debugging is exactly the kind
of friction that erodes contributor velocity. The fix is mechanical but
the diagnosis ("it's a strict-resolution thing") isn't obvious unless
you've hit it before — hence this scar.

Compounding: the May audit caught the same pattern for `tokens` (P0),
proving the pattern is recurring, not one-off. Treat any new
cross-package import as a "did I declare it?" checkpoint.

## Don't Do This

- Don't add a bare `from '@ship-it-ui/<pkg>'` import without first
  adding the package to `peerDependencies` AND `devDependencies` of the
  importer.
- Don't rely on "well, pnpm finds it" — workspace symlinks lie about
  consumer reality.
- Don't bundle cross-`@ship-it-ui/*` deps into a package's `dist/`. Mark
  them external in `tsup.config.ts` so consumers' npm-installed copies
  win (avoiding context-split if both copies of e.g. Radix are
  instantiated).

## Related

- [[ssr-rsc-support-strategy]] — the tsup external regex pattern is part
  of that decision's config.
- [[monorepo-package-split]] — the package taxonomy these dep
  declarations track.
