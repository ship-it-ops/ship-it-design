---
type: decision
status: active
created: 2026-05-27
updated: 2026-05-27
author: claude-opus-4-7
tags: [next-js, react-19, react-compiler, turbopack, cache-components]
importance: core
---

# Next.js 16 + React 19.2 is the design system's new baseline

## Context

The design system shipped on Next 15.5 / React 18.3 with the helper
package's peer range generously open to Next 14 + React 18. That mismatch
between "what we test on" and "what we claim to support" was a maintenance
tax. Next 16 + React 19.2 is the new stable line, and we wanted to land
the bump while also picking up Turbopack-default builds and React Compiler.

## Decision

- **`apps/docs-site`**: pinned to `next ^16.2.6` and `react ^19.2.0`.
  Turbopack is the default for `dev` and `build` in Next 16 — no custom
  webpack config exists, so the default path is the right one.
- **`reactCompiler: true`** at the top level of `next.config.mjs`.
  Promoted out of `experimental.reactCompiler` in Next 16. Requires
  `babel-plugin-react-compiler` as a docs-site devDep.
- **`@ship-it-ui/next` peer range**: `next ^15.0.0 || ^16.0.0`,
  `react ^19.0.0`. Drops Next 14 and React 18 outright. Allowed under the
  v0.0.x patch-bump policy ([[v0-changeset-patch-policy]]) — no consumer
  has a SemVer stability promise yet.
- **Every library package** (`ui`, `shipit`, `icons`, `cytoscape`,
  `graph-editor`, `map`) follows the same peer floor: `react ^19.0.0`.
- **`packages/ui` Radix refresh**: every `@radix-ui/react-*` dep bumped to
  the latest 1.x. Each one now declares React 19 peer support and ships
  the relevant strict-mode / `forwardRef` compat fixes.
- **Cache Components is documented, not adopted**: the docs site uses
  `output: 'export'` (static export to GitHub Pages), which makes `'use
cache'` / `cacheLife` / `cacheTag` no-ops. The
  `/get-started/next/page.mdx` recipe shows runtime consumers how to wrap
  `getThemeFromCookies(await cookies())` in a cache boundary with
  `cacheTag('theme')`. The docs site keeps its `localStorage` inline
  bootstrap because it has no per-request response to set a cookie from.
- **React Compiler in library packages**: out of scope. Compiling at
  publish-time would require wiring the babel plugin into `tsup` for each
  package. Pilot in docs-site first, revisit once compiler stability is
  confirmed in practice.

## Alternatives Considered

- **Single mega-bump with Radix v1 → v2**: rejected. Doubles the
  breaking-change surface; Radix v2 is its own migration.
- **Drop static export to adopt Cache Components at runtime**: rejected.
  Would mean replacing the `pages.yml` GitHub Pages workflow with a Next
  runtime host (Vercel, Cloudflare, etc.) — adds a hosting + secrets
  surface to the design-system repo that doesn't currently exist.
- **Add `eslint-config-next`**: rejected. The workspace runs flat-config
  ESLint with `@ship-it-ui/eslint-config`; bringing in `eslint-config-next`
  alongside it would create a parallel rule set with no clear owner.
- **Keep React 18 in peer ranges**: rejected for `@ship-it-ui/next`, where
  we deliberately want the peer range to reflect what we actually test.
  Library packages also dropped to `react ^19` floor since `@ship-it-ui/ui`
  installs Radix versions whose own peers now require React ≥18.

## Consequences

- Consumers must upgrade to React 19.2 + Next ≥15 to install any
  `@ship-it-ui/*` package after this release.
- The docs site is the canary for React Compiler. If a docs component is
  rejected, narrow the compiler scope via `next.config.mjs` rather than
  globally disabling — that preserves the signal for what's compatible.
- MDX plugins in `apps/docs-site/next.config.mjs` are now string module
  names instead of imported function refs — required by Turbopack's
  serializable-options constraint ([[turbopack-mdx-plugin-serialization]]).
  Do not revert.
- `forwardRef` deprecation warnings will surface at runtime from the 257
  occurrences across `packages/*/src` — informational only; migration to
  React 19 ref-as-prop is a separate initiative.
- The `JSX.Element` global is gone in `@types/react@19`. New components
  in `@ship-it-ui/*` should drop the explicit return type or import
  `type { JSX } from 'react'` (already applied to
  `packages/next/src/ThemeBootstrap.tsx` and `ThemeToggle.tsx`).

## Revisit Triggers

- If React Compiler rejects more than a handful of docs components, audit
  whether we got the opt-in scope wrong or whether the compiler isn't yet
  the right call.
- If a consumer asks for `@ship-it-ui/*` on React 18, we either widen the
  peer (cheap) or stay firm (better) — depends on whether the asker has
  blockers preventing their own React 19 upgrade.
- When Radix v2 ships compatibly: re-evaluate then.
- When we ship 1.0: tighten peers to a single `react ^19.x` floor or
  bump to whatever React is current at that point.

## Related

- [[turbopack-mdx-plugin-serialization]] — the build scar that fired
  during this migration.
- [[v0-changeset-patch-policy]] — the policy that says every touched
  publishable package gets `patch`.
- [[ssr-rsc-support-strategy]] — the `"use client"` + tsup story unaffected
  by this bump.
- [[dark-first-oklch-theming]] — independent of React/Next version.
- [[hydration-theme-mismatch]] — strict-mode pitfall that motivated the
  helper's `useTheme` shape; still holds under React 19.
