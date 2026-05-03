# Frontend Engineer — audit findings

## Verdict

The library is built for client-only consumption but it is published as if it were SSR/RSC-safe. **Zero files in `packages/ui/src/` or `packages/shipit/src/` carry the `"use client"` directive**, and `tsup` is not configured to preserve that directive even if it were present. Every component uses hooks, event handlers, refs, or browser APIs — so the moment a Next.js App Router consumer imports `Button` into a Server Component, the build fails with `Hooks can only be used in Client Components`. Two additional hydration hazards (`useTheme` reading `document` in a `useState` initializer; `Calendar` calling `new Date()` at render time and gating `isToday` on it) will surface as visible-in-prod hydration warnings even when consumers do remember `"use client"`. The icon system is glyph-text based and tree-shakes correctly; the empty `svg-icons.ts` placeholder is safe today but will become a barrel-shaped tree-shake hazard as soon as it's populated. Tailwind v4 is on `^4.0.0-beta.3` — caret on a pre-release tag is risky because pnpm will resolve to whatever beta is current on `pnpm install`, and v4 has had breaking `@theme inline` API changes between betas. Bundle externals are too narrow (only `react`/`react-dom`); every Radix package is bundled into `dist/`, defeating dedupe with consumers who use Radix directly.

## P0 — blockers

- **Zero `"use client"` directives anywhere in `packages/ui/src/` or `packages/shipit/src/`** — `packages/ui/src/components/Button/Button.tsx:1`, `packages/ui/src/components/Toast/Toast.tsx:1`, every other component file
  - What: `grep -rln '"use client"' packages/{ui,shipit}/src/` returns 0 matches. Every component uses one or more of: React hooks (`useState`, `useEffect`, `useRef`, `useId`, `useContext`), event handlers, Radix primitives (which themselves are client components), or browser APIs.
  - Why it matters: a Next.js App Router consumer (the dominant React framework today) doing `import { Button } from '@ship-it-ui/ui'` from a Server Component gets a build error: _"You're importing a component that needs `useState`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive."_ The consumer's only workaround is to wrap every import in their own `"use client"` shim — viable but absurd for a design system.
  - Fix: add `'use client';` as the first line of every file under `packages/ui/src/components`, `packages/ui/src/patterns`, `packages/shipit/src/{ai,entity,graph,marketing}`, and every hook in `packages/ui/src/hooks`. Pure utilities (`packages/ui/src/utils/cn.ts`, `packages/shipit/src/utils/cn.ts`) and pure data (`packages/icons/src/glyphs.ts`, every file in `packages/tokens/src/`) should NOT carry it. Critically: also configure tsup to preserve the directive — see next finding.

- **tsup config does not preserve `"use client"` directives in build output** — `packages/ui/tsup.config.ts:1-12`, `packages/shipit/tsup.config.ts:1-13`
  - What: `tsup` (esbuild under the hood) strips top-of-file string-literal expressions during bundling unless a `banner` or the `esbuild-preserve-directives` plugin is wired up. The current config has neither.
  - Why it matters: even after fixing the previous P0 by adding `"use client"` to source files, the published `dist/` will not have it. Next.js reads the directive from the consumed package's bundled output, not from source.
  - Fix: add the `esbuild-plugin-preserve-directives` plugin (or `esbuild-plugins-node-modules-polyfill`'s sibling) to the tsup config's `esbuildPlugins`, OR split the entry per-component (`entry: ['src/components/**/*.tsx', ...]`) so each file becomes its own chunk and tsup's directive-preservation kicks in. The first option is simpler.

- **`useTheme` reads `document.documentElement.getAttribute('data-theme')` inside a `useState` initializer** — `packages/ui/src/hooks/useTheme.ts:20-23`
  - What: `useState(() => { if (typeof document === 'undefined') return 'dark'; return document...attribute === 'light' ? 'light' : 'dark'; })`. On the server the initializer returns `'dark'` unconditionally. On the client during hydration the initializer runs again and may return `'light'`. React does not re-run client `useState` initializers — it uses the server-rendered value during hydration and then the client value diverges, but the read here is in the _initial render path_, so a consumer whose root sets `data-theme="light"` before hydration (the documented pattern) will get `theme === 'light'` on the client first paint vs `'dark'` from the server's HTML, producing a visible flicker and a hydration warning if any rendered output depends on it (e.g. a `Switch on={theme === 'light'}`).
  - Why it matters: hydration mismatch warning + first-paint-flicker on the central theming knob the docs tell consumers to wire up.
  - Fix: initialize to `'dark'` always, then read the real DOM in a `useEffect`. Alternative: use `useSyncExternalStore` so React renders the same value on server and client and only updates after hydration. (The `useEffect` MutationObserver at `useTheme.ts:39-49` already covers post-hydration sync — just shift the initial read into it.)

- **`Calendar` calls `new Date()` at render and gates `aria-current`/border on it** — `packages/ui/src/patterns/DatePicker/Calendar.tsx:77,153-156,162-172`
  - What: `const today = new Date()` at render time. The `isToday` check (`isSameDay(today, date)`) determines `aria-current="date"` and a border class. If the calendar SSRs at 23:59:59 and hydrates at 00:00:01 the next day, `today` differs and React throws a hydration mismatch warning — and the "today" cell visually jumps.
  - Why it matters: rare in absolute terms but a known SSR-correctness footgun. Also: any test relying on `today` is non-deterministic across runs.
  - Fix: lift `today` into a `useState(() => new Date())` so it's stable across renders, OR (better) accept `today?: Date` as a prop and let consumers pass a stable value. Either way, gate the `isToday` styling behind a `useEffect` flag so the server-rendered HTML doesn't carry today-specific markup until after hydration.

- **`globals.css` runs `@import '@ship-it-ui/tokens/styles/tokens.css'` but tokens is a devDep of `ui`** — `packages/ui/src/styles/globals.css:20`, `packages/ui/package.json:76`
  - What: documented separately by the SE persona as a P0; flagging from the FE angle because it is the consumer's import path that breaks. `import '@ship-it-ui/ui/styles/globals.css'` runs through the consumer's CSS toolchain, which then tries to resolve the bare `@ship-it-ui/tokens` specifier from the consumer's `node_modules`. Since `ui` declares `tokens` as `devDependencies`, npm/pnpm/yarn will not install it for the consumer.
  - Why it matters: the documented setup path produces a CSS resolve error on `pnpm install && pnpm dev` for the end user. Cross-references SE persona's P0.
  - Fix: see SE — make `tokens` a `peerDependency` (or `dependencies`).

## P1 — high priority

- **Tailwind v4 caret on a pre-release tag** — `packages/ui/package.json:88`
  - What: `"tailwindcss": "^4.0.0-beta.3"`. Caret semantics on a pre-release allow updates within the same `4.0.0-beta.*` family, so `pnpm install` after Tailwind ships `4.0.0-beta.10` will silently upgrade. v4 has had breaking `@theme inline` API changes between betas (notably the directive name and the `--color-*` resolution order). The `globals.css` `@theme inline { --color-bg: var(--color-bg); … }` shape is the most-likely-to-break surface.
  - Why it matters: a contributor running `pnpm install` next month gets a different Tailwind than CI's lockfile-pinned one — until the lockfile updates, at which point CI gets the new beta. Either way, builds break unannounced.
  - Fix: pin to an exact version (`"4.0.0-beta.3"` no caret) until v4 GA, OR commit to a beta-promotion cadence and document it. Add Tailwind v4 GA to the dependency-bot allowlist for explicit migration.

- **tsup `external` is too narrow — every Radix package gets bundled into `dist/`** — `packages/ui/tsup.config.ts:11`
  - What: `external: ['react', 'react-dom']`. All 18 `@radix-ui/react-*` packages are listed in `dependencies` (correct) but they're also bundled into `dist/index.js`/`dist/index.cjs` because they're not listed as external. A consumer who installs `@ship-it-ui/ui` AND uses Radix directly (e.g. their own custom Dialog) ends up with two copies of `@radix-ui/react-dialog` — one in `node_modules/@radix-ui/react-dialog` (their version) and one inlined into `node_modules/@ship-it-ui/ui/dist/index.js` (the version this library was built against).
  - Why it matters: bundle-size duplication AND React-context split — Radix relies on context (e.g. `DialogContext`) and two copies have two contexts, so Radix-vs-`@ship-it-ui/ui` interleaving breaks. Same goes for `clsx`, `tailwind-merge`, `class-variance-authority`. This is the bundle-output finding the DevOps persona flagged as P2; from the FE angle it's a P1 because the React-context split silently breaks composition.
  - Fix: `external: [/^react/, /^@radix-ui\//, '@fontsource-variable/geist', '@fontsource-variable/geist-mono', 'class-variance-authority', 'clsx', 'tailwind-merge']`. Same pattern in `packages/shipit/tsup.config.ts` (already externalizes `@ship-it-ui/ui` and `@ship-it-ui/icons` — good — but doesn't externalize `clsx`/`tailwind-merge`).

- **`useOutsideClick` listens on `mousedown` only — touch devices silently broken** — `packages/ui/src/hooks/useOutsideClick.ts:21`
  - What: `document.addEventListener('mousedown', onDown)`. iOS Safari and Android Chrome do not synthesize `mousedown` on touch unless the document has a global `tap` handler. Used by `Combobox` (`Combobox.tsx:147`) — touching outside an open combobox does not close it on mobile.
  - Why it matters: silent UX gap on mobile. Combobox is a core pattern.
  - Fix: also listen on `pointerdown` (or `touchstart`); pointer events cover mouse, touch, and pen on all modern browsers.

- **Toast `Math.random()` for IDs** — `packages/ui/src/components/Toast/Toast.tsx:71`
  - What: `const id = opts.id ?? Math.random().toString(36).slice(2)`. The call site is inside the `toast` callback (event handler), so SSR is not affected (no render-time call). However: collisions are possible across long-lived sessions, and `useId` would be more idiomatic for client-only ID generation that's never SSR'd.
  - Why it matters: not a correctness bug today, but it's the only uncontrolled randomness in the runtime; a counter or `crypto.randomUUID()` (with a polyfill check for older Safaris) is safer.
  - Fix: lift to a module-level `let n = 0` counter (`++n`), or use `crypto.randomUUID()` with a fallback.

- **`useTheme` `setTheme` mutates `document` directly with no SSR guard** — `packages/ui/src/hooks/useTheme.ts:25-32`
  - What: `setTheme` calls `document.documentElement.setAttribute(...)`. If a consumer calls `setTheme` from a `useEffect` (post-mount, fine) it works; but if they expose a control surface that fires `setTheme` server-side via `getServerSideProps`-derived logic (rare but possible), the call throws.
  - Why it matters: edge case; defensive guard is cheap.
  - Fix: `if (typeof document === 'undefined') { setThemeState(next); return }` at the top of `setTheme`.

## P2 — medium

- **No `useIsomorphicLayoutEffect` shim used anywhere** — `packages/ui/src/hooks/`, `packages/shipit/src/`
  - What: `grep -rn 'useLayoutEffect' packages/{ui,shipit}/src/` returns 0 hits, so this isn't an active SSR-warning source today. Worth flagging because: as soon as any composite needs to measure DOM before paint (a virtualized list, a Popover position), the natural `useLayoutEffect` will fire the SSR warning. Pre-emptive shim recommended.
  - Fix: add `useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect` to `packages/ui/src/hooks/` for future use.

- **Icons package `export * from './svg-icons'` is fine today only because `svg-icons.ts` is empty** — `packages/icons/src/index.ts:25`, `packages/icons/src/svg-icons.ts:1-3`
  - What: `svg-icons.ts` currently contains `export {}`. Once SVGs are added under `src/svg/` and SVGR generates per-icon exports, this barrel will work for tree-shaking IF the generated file exports each icon as a named const (`export const IconFoo = ...; export const IconBar = ...;`) AND the package's `sideEffects: false` is preserved (which it is — `packages/icons/package.json` shows `"sideEffects": false`). Risk: if the generator instead emits `export { IconFoo, IconBar } from './foo'` style re-exports, every consumer pulls every icon.
  - Fix: when populating `svg-icons.ts`, ensure the generator emits direct `export const Icon*` declarations, not re-exports. Validate by building, then `node -e "import('@ship-it-ui/icons').then(m => console.log(Object.keys(m)))"` and bundle-analyze.

- **`glyphs` is a single object const re-exported as a value — every consumer pulls all glyphs** — `packages/icons/src/glyphs.ts:15-95`
  - What: `glyphs` is one frozen object with 50+ entries. Tree-shakers cannot eliminate unused keys. A consumer using only `glyphs.brand` ships all 50.
  - Why it matters: ~50 unicode characters total ≈ 100 bytes, so the bytes-impact is trivial. But the same pattern in `connectorGlyphs` (`glyphs.ts:104-115`) and the future SVG-icon equivalent has real cost. Pattern should be set right while the shape is still small.
  - Fix: low priority for the unicode glyphs (bytes are negligible); high priority before SVG icons populate. Switch to per-icon named exports so tree-shaking works.

- **`shipit` package `external` is broader but still misses `clsx`/`tailwind-merge` — duplicated `cn`** — `packages/shipit/tsup.config.ts:11`
  - What: `external: ['react', 'react-dom', '@ship-it-ui/ui', '@ship-it-ui/icons']`. `clsx` and `tailwind-merge` are bundled (cross-references the SE persona's "duplicated `cn`" P1 finding — when `cn` is imported from `@ship-it-ui/ui` instead, the bundled `clsx`/`tailwind-merge` go away too).
  - Fix: covered by SE persona's `cn` dedupe.

- **No `displayName` on a few components** — `packages/ui/src/patterns/Spinner/Spinner.tsx`, sample of others
  - What: spot-checked Calendar (has it), Button (has it), most of the rest do too. Did not find any obvious gaps in the sample. Mild risk for any forwardRef component that omits it — React DevTools shows `Anonymous`. Catalog gap, not a bug.
  - Fix: ESLint rule `react/display-name` (already enabled in most configs by default) catches these; verify it's on.

- **Storybook docs app uses `apps/docs` which itself is a private package — fine, but consumers can't run a one-command Storybook in their own repo** — `apps/docs/package.json`
  - What: documentation discoverability gap. Not really FE; mention so it surfaces.

## P3 — nits

- **`useDisclosure` returns a stable but distinct callback identity for `setOpen`** — `packages/ui/src/hooks/useDisclosure.ts:15`
  - What: `setOpen` returned directly is React's `setState` setter — already stable. Fine. (Verified.)

- **`useTheme` does not respect `prefers-color-scheme`** — `packages/ui/src/hooks/useTheme.ts:20-23`
  - What: defaults to `'dark'` regardless of OS preference. Documented as a "dark-first" design choice; not a bug. SE persona also flagged this as a docs/intent question.

- **`React.FC` usage** — `grep -rn 'React.FC' packages/{ui,shipit}/src/`
  - What: spot-check found no `React.FC` usage; components consistently use `forwardRef` + explicit props types. Good.

- **Module-scope `instanceof` checks** — none found at module scope. (`DataTable`/`Tree` use `instanceof Set` inside the component body; SE flagged separately.)

- **`Citation.tsx:41` `ref as never`** — covered by SE persona.

## Out of scope / not assessed

- Detailed React 19 compatibility verification (peerDeps allow `^19.0.0`; CI only tests Node 24 / React 18.3.1 per `packages/ui/package.json:86`). DevOps persona owns the matrix-strategy gap.
- ARIA / keyboard correctness — A11y persona.
- Token semantics (does `--color-accent` knob actually work) — UI/UX persona.
- Test depth — SE persona.
- Storybook story coverage — UI/UX persona.
- Workflow security / supply-chain — DevOps persona.
- Dependency hygiene beyond bundle-output implications — SE persona.
- Visual perf profiling of any single component (no real measurement done; would need Chromatic / a11y-violations dashboard).
