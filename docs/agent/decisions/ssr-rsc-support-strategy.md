---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [ssr, rsc, next-js, build, tsup]
importance: core
---

# `"use client"` directives preserved through tsup; light-theme FOUC handled by `@ship-it-ui/next`

## Context

The May 2026 audit (FE persona, Theme B + C) flagged that the library
shipped zero `"use client"` directives, and that tsup stripped any that
were added at source level — making every component crash in Next.js
App Router Server Components. Hydration mismatches in `useTheme` and
`Calendar` were additional landmines.

## Decision

### Directive preservation

- Every interactive source file (`components/`, `patterns/`, `hooks/`,
  `shipit/{ai,entity,graph,marketing}`) starts with `'use client';`.
- Pure type/data/util files (`utils/cn.ts`, `tokens/src/*.ts`, glyph
  manifests) deliberately do **not** carry the directive.
- `packages/ui/tsup.config.ts` and the equivalents in other UI packages
  use `esbuild-plugin-preserve-directives` and disable tsup's
  `treeshake` — Rollup's tree-shake otherwise strips the re-injected
  directives. The reason is annotated in the config comment; don't
  re-enable treeshake without re-verifying.

### Hydration safety

- `useTheme` initializes to `'dark'` on the server and reads
  `document.documentElement.getAttribute('data-theme')` only in
  `useEffect`. No DOM reads in render or `useState` initializers.
- `Calendar` lifts `today` into stable state (`useState(() => new Date())`
  or a prop) and gates today-specific markup behind a post-hydration
  flag — the server- and client-rendered HTML must match.

### Theme FOUC prevention (Next.js App Router)

- `@ship-it-ui/next` ships `<ThemeBootstrap />` plus
  `getThemeFromCookies(cookies())`. `ThemeBootstrap` injects a
  synchronous inline `<script>` into `<head>` that reads the cookie and
  sets `data-theme` _before_ first paint. Pair with the cookie-seeded
  attribute on `<html data-theme={theme}>` for SSR.

### Externals

- `tsup.config.ts` externalizes regex-matched `^react/`, `^@radix-ui/`,
  `^@fontsource-variable/`, `^@ship-it-ui/`, plus `cva`, `clsx`,
  `tailwind-merge`. This prevents context-split / dedupe issues when a
  consumer uses Radix directly alongside `@ship-it-ui/ui`.

## Alternatives Considered

- **Per-component split entries** (`entry: ['src/components/**/*.tsx']`):
  rejected — explodes published file count; preserve-directives plugin is
  simpler and well-maintained.
- **`useSyncExternalStore` for `useTheme`**: not adopted (simpler
  `useEffect` path is enough today), but viable if the theme store grows.
- **No SSR support, document client-only**: rejected — Next.js App Router
  is the dominant consumer framework; a design system that can't be
  imported from a Server Component is uncompetitive.

## Consequences

- Adding a new interactive component requires remembering the directive
  on the first line. Lint via `eslint-plugin-react-hooks`'s strict-mode
  rules + a manual `grep` check is the current cover; consider a custom
  ESLint rule.
- `treeshake: false` makes the published bundle slightly larger; esbuild
  still tree-shakes during initial bundle. Don't "fix" this in a sweep.
- New packages that ship interactive React (`@ship-it-ui/cytoscape`,
  `graph-editor`, `next`, `map`) must repeat the tsup config pattern. If
  a sibling package starts breaking SSR consumers, check its
  `tsup.config.ts` for `preserveDirectivesPlugin` before suspecting
  source-file issues.

## Revisit Triggers

- If `esbuild-plugin-preserve-directives` is deprecated or tsup gains
  native directive preservation, simplify.
- If React Server Components evolve to require new directives (e.g. an
  edge-runtime marker), add to the `directives` array in the plugin call.

## Related

- [[hydration-theme-mismatch]] — the scar the `useTheme` fix addresses.
- [[ssr-controlled-vs-default-attrs]] — separate but related SSR pitfall.
- [[ci-strict-resolution-masks]] — workspace deps that crash only in
  consumers, not pnpm-symlink-resolved local builds.
