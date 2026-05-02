# Ship-It Design — Audit Summary (2026-05-02)

## How to read this

Six personas (Software Engineer, UI/UX Engineer, Accessibility, DevOps, Frontend, Project Manager) audited the repo independently. Each wrote a per-persona report under `audit/2026-05-02/`. This summary deduplicates and ranks the findings cross-cuttingly. Every theme below cites its source persona(s) and links back to the file:line.

## Top-line verdict

The repo is **engineering-mature for a 0.0.1 design system** but **not production-ready as a publish target.** Tooling, conventions, test coverage, and documentation are all visible signs of care, and Software Engineering and DevOps audits surface no P0 blockers in their lanes (one and zero P0s respectively). The blockers all live at the **boundary between the system and its consumers**: the published `@ship-it-ui/ui` is unusable as documented because it forgets to declare the `tokens` dep; every Next.js App Router consumer will get a build error because no source file carries `"use client"` and tsup doesn't preserve directives anyway; multiple WCAG AA failures will prevent the library from being adopted by any organization with an a11y bar; the design-token system itself ships with a dead z-index scale and a fork in variant naming that breaks the system's own credibility; and several documentation pages describe a system that is not what's in the code. None of this is hard to fix — most P0s are surgical edits — but the headline is that **the library is closer to a successful internal RFC than to a 1.0**.

Findings cluster into **5 cross-cutting themes**, each summarized below.

---

## P0 — blockers (publish-grade severity)

### Theme A — The published artifact does not work as documented

**Sources:** SE P0 #1, FE P0 #4, PM P0 #3 (cross-flagged)

- **`@ship-it-ui/ui` ships a CSS file (`./styles/globals.css`) that imports `@ship-it-ui/tokens`, but `tokens` is declared only in `devDependencies`** — `packages/ui/package.json:76`, `packages/ui/src/styles/globals.css:20`. Consumers running the documented `import '@ship-it-ui/ui/styles/globals.css'` will hit a CSS-resolver error because their `node_modules` will not contain `@ship-it-ui/tokens`.
- **Fix:** move `@ship-it-ui/tokens` from `devDependencies` to `peerDependencies` (or `dependencies`). The architecture doc already promises a peer relationship — only the `package.json` is wrong.

### Theme B — The library is not Next.js / RSC compatible

**Sources:** FE P0 #1 + #2

- **Zero `"use client"` directives across `packages/ui/src/` and `packages/shipit/src/`** (verified: `grep -rln '"use client"' packages/{ui,shipit}/src/` returns 0). Every component uses hooks or browser APIs, so any Next.js App Router consumer importing `Button` from a Server Component gets `Hooks can only be used in Client Components`.
- **`tsup` does not preserve `"use client"` directives in build output** — `packages/ui/tsup.config.ts:1-12`, `packages/shipit/tsup.config.ts:1-13`. Even if source were fixed, the published `dist/` would strip the directives.
- **Fix:** add `'use client';` as the first line of every interactive file (components, patterns, hooks, shipit composites; NOT pure utils, tokens, or pure data); add `esbuild-plugin-preserve-directives` to both tsup configs.

### Theme C — Hydration mismatches and SSR-unsafe initial reads

**Sources:** FE P0 #3, FE P0 #4

- **`useTheme` reads `document.documentElement.getAttribute('data-theme')` inside its `useState` initializer** — `packages/ui/src/hooks/useTheme.ts:20-23`. Server returns `'dark'`; client may compute `'light'` → first-paint flicker + hydration warning.
- **`Calendar` calls `new Date()` at render and gates `aria-current`/visual styling on `isToday`** — `packages/ui/src/patterns/DatePicker/Calendar.tsx:77,153-156,162-172`. Server vs client clock skew at midnight produces a hydration mismatch.
- **Fix:** initialize `useTheme` to `'dark'` and read DOM in `useEffect`. Lift `Calendar`'s `today` into `useState(() => new Date())` (or a prop) and gate today-specific markup behind a post-hydration flag.

### Theme D — Runtime crash paths and silent visual failures

**Sources:** SE P0 #2, SE P1 #1, A11y P0 (Drawer/Sheet)

- **`useControllableState` returns `T | undefined` and `DataTable`/`Tree` paper over it with `selected!.has(id)` non-null assertions** — `packages/ui/src/hooks/useControllableState.ts:21-29,45`, `DataTable.tsx:119,120,224`, `Tree.tsx:93,164`. A consumer passing `selected={undefined}` in controlled mode hits `Cannot read properties of undefined`.
- **`GraphNode` concatenates a CSS variable with a hex-alpha suffix, producing invalid CSS** — `packages/shipit/src/graph/GraphNode.tsx:64`. `boxShadow: \`0 0 30px var(--color-accent)40\`` is unparseable; the browser drops the rule and the glow shadow never renders. Tests check DOM presence, not paint.
- **Drawer and Sheet have no accessible name and emit Radix runtime warnings** — `packages/ui/src/components/Dialog/Drawer.tsx:26-37`, `packages/ui/src/components/Dialog/Sheet.tsx:38-40`. They are also the only two component test files in the repo missing an `axe()` assertion (verified: `Drawer.test.tsx` and `Sheet.test.tsx` have zero `axe(` calls; `Dialog.test.tsx` and `AlertDialog.test.tsx` do). **The regression-detection gap is co-located with the regression** — adding `axe()` would have caught this.
- **Fix:** drop the `!` non-null assertions and use an `EMPTY_SET` fallback; replace `${color}${alpha}` with `color-mix(in oklab, ${color} ${pct}%, transparent)`; add `RadixDialog.Title` (or visually-hidden equivalent) to Drawer and Sheet, and add the missing `axe()` assertions to both test files.

### Theme E — WCAG 2.2 AA failures across multiple components

**Sources:** A11y P0s (six total)

- **`text-text-dim` token fails 4.5:1 contrast against every background in both themes** — `packages/tokens/src/color.ts:48,73`. Dark `#55555d` on `bg`/`panel`/`panel-2` = 2.4–2.7:1; light `#8e8e96` on `bg` = 3.19:1. **71 source usages** (verified — A11y persona estimated 57; broader sweep including shipit caught more) — placeholder text, hint text, descriptions, file sizes, eyebrows, `kbd` hints, every `Stepper` upcoming step, every `Calendar` weekday header.
- **`text-accent` on light theme = 2.27:1** — `packages/tokens/src/color.ts:75`. Used as visible body text in active states across Combobox, CommandPalette, DataTable, Sidebar NavItem, Stepper, Pagination, Banner info, Button link variant.
- **`prefers-reduced-motion` is silently ignored** — `packages/ui/src/styles/animations.css:1-123`, `packages/tokens/styles/tokens.css:138-143`. The override only zeros `--duration-micro`/`--duration-step`, but every component animation hardcodes literal durations like `animate-[ship-dialog-in_180ms_…]`. Dialog/Drawer/Sheet/Toast entrance + Spinner/Pulse/Skeleton infinite animations all play at full speed under `reduce`.
- **DataTable sortable headers are mouse-only** — `packages/ui/src/patterns/DataTable/DataTable.tsx:175-208`. `<th onClick>` with no `tabIndex`/`role="button"`/`onKeyDown`. Keyboard users cannot sort.
- **Tree drops out of tab order with no selection and has no Up/Down arrow navigation** — `packages/ui/src/patterns/Tree/Tree.tsx:120-143`. `tabIndex={isSelected ? 0 : -1}` plus only Left/Right keys. Tree is keyboard-unreachable in its empty initial state.
- **Drawer / Sheet missing accessible name** (cross-listed with Theme D).
- **Fix:** raise `text-text-dim` to ≈`#7c7c86` dark / `#6f6f78` light (≈4.6:1); lower light `text-accent` L to ≈0.45 OR consume the existing `--color-accent-text` in light theme; add a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important } }` rule; refactor DataTable headers to wrap label in `<button>`; implement APG roving-tabindex + Up/Down for Tree.

### Theme F — Design-system credibility gaps

**Sources:** UI/UX P0 (3), PM P0 (4), DevOps P1 (cross-flagged)

- **Z-index token scale is dead code** — `packages/tokens/src/z-index.ts:6-16` defines a 9-layer system but `globals.css` doesn't expose it under `@theme inline` and zero components consume it. `Tooltip` uses `z-[60]` (token says `1600`), `Toast` uses `z-[70]` (token says `1500`), `Dialog` uses `z-50/[51]` (token says `1300`). The named-layer system is a lie.
- **State-change callback prop name is split four ways** — `onChange` (Combobox), `onValueChange` (DatePicker, Tabs), `onSelect` (Calendar, Tree), `onSelectionChange` (DataTable). The vocabulary contradicts itself within the same package.
- **Variant-naming vocabulary is split three ways** — `Alert`/`Banner` use `variant: 'info' | 'ok' | 'warn' | 'err'`; `Progress`/`RadialProgress` use `tone: 'accent' | 'ok' | 'warn' | 'err'`; `EmptyState` uses `tone: 'accent' | 'danger' | 'muted'` (`accent`↔`info`, `err`↔`danger`, `muted` exists nowhere else).
- **Documentation actively misleads contributors** — `docs/architecture.md:101` claims `prefers-reduced-motion` is automatic (false — see Theme E); `packages/icons/README.md:9-21` describes a build process that doesn't match reality (says `index.ts` is rewritten; actual code rewrites `svg-icons.ts`); `packages/ui/README.md:54` and `packages/tokens/README.md:18` use token names (`bg-brand`, `background`, `brand`) that don't exist in this system.
- **Fix:** wire z-index tokens into `@theme inline` and sweep components; pick one callback convention (recommended: `onValueChange` + `onSelectionChange`); pick one variant convention (recommended: `variant` for visual style, `tone` for semantic intent, drop `info`/`danger`/`muted`); fix the three docs.

### Theme G — Public-library governance is missing

**Sources:** PM P0 #1, DevOps P1 #3 (cross-flagged)

- **No `SECURITY.md`** — `.github/`. A publicly-published, `provenance: true` MIT library has no private disclosure path. GitHub flags this in community-standards.
- **(Adjacent P1: no PR template, no issue templates, no CODEOWNERS, no CODE_OF_CONDUCT, no Dependabot/Renovate, missing npm metadata `homepage`/`bugs`/`keywords`/`author` on all 4 publishable packages, no documented stability/1.0 milestone — see PM and DevOps reports.)**
- **Fix:** add `.github/SECURITY.md`, the standard `.github/dependabot.yml`, a PR template that mirrors `docs/adding-a-component.md`'s checklist, and the missing npm metadata fields.

---

## P1 — high priority (per persona, deduplicated)

| Theme | Finding | Persona(s) | Cite |
|---|---|---|---|
| Supply chain | Every third-party GH Action pinned to floating major tag (incl. release-critical `changesets/action@v1` + `actions/setup-node@v6` running with `id-token: write` and `NPM_TOKEN`) | DevOps | `release.yml:70`, `snapshot.yml:81`, `actions/setup/action.yml:17,20` |
| CI cache | Turbo cache key uses `github.sha` so it never restores from itself; thrashes the 10 GB LRU | DevOps | `ci.yml:46,65`, `release.yml:35` |
| CI redundancy | Build runs three times on every main push (validate → release.yml:66 → `pnpm release`) | DevOps | `release.yml:25-52,66`, `package.json:25` |
| Doc/code drift | README "Tech stack" table says Node 20 LTS while everything else (`.nvmrc`, `engines`, contributing.md) says Node 24 | PM, DevOps | `README.md:47` |
| Bundle | tsup `external: ['react', 'react-dom']` only — every Radix package gets bundled into `dist/`, splitting React contexts when consumer also uses Radix directly | FE | `packages/ui/tsup.config.ts:11` |
| Beta dep | Tailwind v4 caret on a pre-release tag — `pnpm install` will silently float to newer betas with breaking `@theme inline` changes | FE | `packages/ui/package.json:88` |
| Token API | No paired `*-fg` tokens for `ok`/`warn`/`err` — components default to `text-on-accent` for success/destructive, semantically wrong | UI/UX | `packages/tokens/src/color.ts:38-61` |
| Token coverage | Companion palette (`ok`/`warn`/`err`/`purple`/`pink`) uses identical OKLCH for both themes — light-theme contrast not validated; `text-err` likely fails | UI/UX | `packages/tokens/src/color.ts:80` |
| Tokens bypass | 5 components hardcode `oklch(...)` literals bypassing the accent knob (Input/Textarea error rings, Avatar fallback, GraphMinimap, CTAStrip) | UI/UX | `Input.tsx:22`, `Textarea.tsx:18`, `Avatar.tsx:68`, `GraphMinimap.tsx:78`, `CTAStrip.tsx:25` |
| Tokens bypass | `SplitButton` hardcodes `border-r-black/20` — invisible in light theme | UI/UX | `SplitButton.tsx:36` |
| API parity | Button family variant counts inconsistent — Button=7, IconButton=4, SplitButton=3 (no destructive IconButton) | UI/UX | `Button.tsx:21-32`, `IconButton.tsx:14`, `SplitButton.tsx:9` |
| API mismatch | `Chip` requires `removable={true}` + `onRemove`; `Tag` only requires `onRemove`. Setting `removable` without `onRemove` renders a no-op X | UI/UX, SE | `Chip.tsx:9-10,35`, `Tag.tsx:7,36` |
| Hook safety | `useOutsideClick` listens on `mousedown` only — touch silent for `Combobox` on mobile | FE, SE | `useOutsideClick.ts:21` |
| Hook semantic | `useTheme` `setTheme` mutates `document` with no SSR guard | FE | `useTheme.ts:25-32` |
| State purity | OTP fires `onChange`/`onComplete` from inside a `setState` updater — double-fires under StrictMode | SE | `OTP.tsx:54-65` |
| Static UI | `Banner`/`Alert` use `role="alert"` for warn/err — announces on every initial page render | UI/UX, A11y | `Banner.tsx:55`, `Alert.tsx:67` |
| Form a11y | `SearchInput` has no accessible name | A11y | `SearchInput.tsx:33-39` |
| Form a11y | `Slider` thumb hardcodes `aria-label="Value"` with no override | A11y | `Slider.tsx:55` |
| Combobox a11y | `CommandPalette` input not wired to listbox via combobox semantics (no `role="combobox"`, `aria-controls`, `aria-activedescendant`) | A11y | `CommandPalette.tsx:119-135` |
| Keyboard | Calendar date grid has no Arrow-key navigation; uses `aria-pressed` instead of `aria-selected` | A11y | `Calendar.tsx:151-178` |
| Drawer/Sheet | After Title fix, still missing `aria-describedby={undefined}` to silence Radix warning | A11y | `Drawer.tsx:51-58`, `Sheet.tsx:28-36` |
| Test gap | Toast axe test runs against empty viewport (before any toast is fired) | A11y | `Toast.test.tsx:24-31` |
| Type hole | `instanceof Set ? x : x as Set` is a no-op cast hiding `ReadonlySet → Set` variance hole in DataTable/Tree | SE | `DataTable.tsx:94`, `Tree.tsx:58` |
| Type hole | `useControllableState` typed `T \| undefined` proliferates `value!`/`value ?? fallback` everywhere — root-cause for the DataTable/Tree P0 | SE | `useControllableState.ts:21-29` |
| Calendar bug | `MONTHS = ['Jan','Feb','Mar','April','May','June','July','Aug','Sep','Oct','Nov','Dec']` mixes 3-letter and full names; the test asserts on the bug | SE | `Calendar.tsx:17-30` |
| Stepper bug | `key={label}` causes React reconciliation collisions on duplicate labels | SE | `Stepper.tsx:56` |
| Workspace | `@radix-ui/react-label` declared as dep but never imported (every consumer pulls unused Radix package) | SE | `packages/ui/package.json:58` |
| Workspace | `@ship-it-ui/icons` declared as dep of `shipit` but never imported | SE | `packages/shipit/package.json:45` |
| Test setup | `cn` utility and the entire vitest setup duplicated byte-for-byte between `ui` and `shipit` (already drifted once) | SE | `ui/src/utils/cn.ts`, `shipit/src/utils/cn.ts`, `ui/src/test/setup.ts`, `shipit/src/test/setup.ts` |
| Empty dir | `packages/ui/src/primitives/` empty, but referenced as a category by 3 docs | SE, UI/UX, PM | `packages/ui/src/primitives/`, `README.md:19`, `docs/architecture.md:109` |
| Docs gap | No PR template, no issue templates, no CODEOWNERS, no CODE_OF_CONDUCT, no FUNDING.yml | PM | `.github/` |
| Docs gap | All four publishable packages missing `homepage`, `bugs`, `keywords`, `author`, `funding` | PM | `packages/{tokens,icons,ui,shipit}/package.json` |
| Docs gap | No documented 1.0 milestone, stability promise, or deprecation policy | PM | repo root |
| Docs gap | `PIPELINES.md` says "three workflows", lists four, repo has six (`claude.yml`, `pages.yml` undocumented) | PM, DevOps | `.github/PIPELINES.md:1-4` |
| Pipeline | No Dependabot or Renovate config — Storybook beta, Tailwind beta, every action floating major | DevOps, PM | `.github/` |
| Pipeline | No matrix strategy — CI tests Node 24 / React 18 only, but `engines` claims `>=24` and peerDeps allow React 19 | DevOps | `ci.yml:31` |
| Pipeline | Snapshot publish writes `_authToken` to `~/.npmrc` on disk before build (vs release.yml's env-only path) | DevOps | `snapshot.yml:48-78` |
| Pipeline | Format/lint jobs run cold pnpm install — 60-90s pre-work for a seconds-long check | DevOps | `ci.yml:29-49` |

## P2 / P3 — bulk

Roughly **40 P2 findings** and **20 P3 findings** distributed across the per-persona reports. Highlights:

- **209 hardcoded `[Npx]` arbitrary Tailwind values** across components (UI/UX P2) — typography/spacing tokens exist but components ignore them
- **Glyph aliasing creates a non-injective vocabulary** — `service`/`serviceOutline` both `◇`, `incident`/`target` both `◎`, `cmd`/`schema`/`menu` all `≡` (UI/UX P2)
- **Multiple weak test assertions** — `toHaveBeenCalled()` without argument check, GraphMinimap test that only counts spans, AlertDialog test that doesn't test the action button (SE P2/P3)
- **`Tooltip` content has `pointer-events-none`** — fine for label tooltips, breaks if consumers put interactive content inside (A11y P1, WCAG 1.4.13)
- **`StatusDot`/`Avatar` use enum value as `aria-label`** — "ok" / "err" instead of "Online" / "Error" (A11y P2)
- **No coverage upload** — Vitest produces it with 80% thresholds, but it's never artifacted or sent to Codecov (DevOps P2)
- **`turbo.json` test outputs include `storybook-static/**` which is also `build`'s output — cache stomping** (DevOps P2)
- **Tabs/IconButton/Card story controls coverage looks good but composite "States" stories not consistently present** (UI/UX P2)
- **Each per-package CHANGELOG.md is just the Changesets boilerplate header** (PM P3 — expected pre-1.0)

For full lists with `path:line` references and proposed fixes, open the per-persona files.

---

## Recommended fix order (the first 10)

The order weights blast radius (does this break consumers?) over churn cost. Each item links into the per-persona file with the deepest treatment.

1. **Move `@ship-it-ui/tokens` from `devDependencies` to `peerDependencies` in `packages/ui/package.json:76`** — Theme A. ~2 minutes. Library becomes consumable. ([SE P0 #1](software-engineer.md))
2. **Add `'use client';` to every interactive file in `packages/ui/src/{components,patterns,hooks}` and `packages/shipit/src/{ai,entity,graph,marketing}`; add `esbuild-plugin-preserve-directives` to both tsup configs** — Theme B. ~1 hour. Library becomes Next.js App Router compatible. ([FE P0 #1, #2](frontend-engineer.md))
3. **Add `.github/SECURITY.md`** + `.github/dependabot.yml` + `.github/pull_request_template.md` — Theme G. ~30 minutes. Closes the public-library governance gap. ([PM P0 #1](project-manager.md))
4. **Pin every third-party GitHub Action to a commit SHA** (especially `changesets/action`, `pnpm/action-setup`, `actions/setup-node`, `anthropics/claude-code-action`, `actions/upload-pages-artifact`, `actions/deploy-pages`, `actions/github-script`) — Theme G adjacent. ~1 hour. Removes the `tj-actions/changed-files`-style supply-chain attack vector on releases. ([DevOps P1 #1](devops.md))
5. **Fix `text-text-dim` (`color.ts:48,73`) and light `text-accent` (`color.ts:75`)** — Theme E. ~15 minutes for the token edit + storybook smoke-check. Removes 2 of the 6 a11y P0s and fixes 71 source usages. ([A11y P0](accessibility.md))
6. **Fix `useTheme` SSR initial read and `Calendar` `new Date()` at render** — Theme C. ~30 minutes. Removes the two known hydration-mismatch sources. ([FE P0 #3, #4](frontend-engineer.md))
7. **Add `RadixDialog.Title` to `Drawer` and `Sheet`; add the missing `axe()` assertions to their test files** — Theme D, E. ~30 minutes. The test gap is exactly co-located with the regression. ([A11y P0](accessibility.md))
8. **Drop `selected!.has(id)` non-null assertions in `DataTable`/`Tree`; use `EMPTY_SET` fallback. Fix `GraphNode` glow shadow to use `color-mix` instead of string concat** — Theme D. ~15 minutes. Removes the runtime crash path and the silent visual failure. ([SE P0 #2, P1 #1](software-engineer.md))
9. **Wire z-index tokens into `@theme inline` (`globals.css:44`) and sweep all overlay components to use `z-modal`/`z-tooltip`/etc.** — Theme F. ~1 hour. Re-establishes the design-system token contract. ([UI/UX P0 #1](ui-ux-engineer.md))
10. **Reconcile callback (`onValueChange` + `onSelectionChange`) and variant (`variant` for visual style + `tone` for semantic intent) vocabulary across components; add deprecation aliases for one minor** — Theme F. ~half-day with tests. The system stops contradicting itself. ([UI/UX P0 #2, #3](ui-ux-engineer.md))

After these 10, the library is publishable to internal consumers with confidence. The remaining P1s should land before a 1.0 cut.

---

## Severity counts

| Persona | P0 | P1 | P2 | P3 | File |
|---|---:|---:|---:|---:|---|
| Software Engineer | 2 | 9 | ~16 | 6 | [software-engineer.md](software-engineer.md) |
| UI/UX Engineer | 3 | 9 | ~13 | 6 | [ui-ux-engineer.md](ui-ux-engineer.md) |
| Accessibility | 7 | 8 | 7 | 5 | [accessibility.md](accessibility.md) |
| DevOps | 0 | 9 | 12 | 8 | [devops.md](devops.md) |
| Frontend Engineer | 5 | 5 | 5 | 5 | [frontend-engineer.md](frontend-engineer.md) |
| Project Manager | 4 | 11 | 8 | 6 | [project-manager.md](project-manager.md) |
| **Total (deduplicated)** | **~17 unique** | **~50 unique** | **~60** | **~35** | |

P0/P1 deduplication accounts for cross-persona overlaps (the `tokens` devDep finding appears in SE, FE, and PM; the `prefers-reduced-motion` finding appears in A11y P0 and PM P0).

---

## Verification spot-checks (Phase C)

I directly confirmed the following high-severity findings by opening the cited file:line:

| Finding | Cite | Verified |
|---|---|---|
| `@ship-it-ui/tokens` declared at `packages/ui/package.json:76` (in the devDependencies section, not peerDependencies) | SE P0 #1 | ✅ `grep -n "ship-it-ui/tokens" packages/ui/package.json` returns line 76 in the devDeps block |
| Drawer/Sheet test files contain no `axe()` assertions; Dialog/AlertDialog test files do | A11y P0 | ✅ `grep -l "axe(" packages/ui/src/components/Dialog/*.test.tsx` returns only `Dialog.test.tsx` and `AlertDialog.test.tsx` (Drawer/Sheet absent) |
| Zero `"use client"` directives across UI + shipit packages | FE P0 #1 | ✅ `grep -rln '"use client"' packages/{ui,shipit}/src/` returns 0 |
| `text-text-dim` widely used as visible body text | A11y P0 | ✅ 71 source usages outside tests/stories (A11y persona estimated 57; broader sweep including shipit caught more — directionally correct, conservative) |
| Z-index scale defined in `tokens/z-index.ts:6-16` but components use literal `z-30/40/50/[51]/[60]/[70]` Tailwind classes | UI/UX P0 #1 | ✅ Token file matches; grep across components confirms no `z-modal`/`z-tooltip` usage |

No hallucinations found in the spot-check sample. Findings reproduce as cited.

## What was NOT covered

- **Visual regression** — no Chromatic / Loki / Percy configured. Token, motion, and component changes have no visual safety net beyond unit tests' DOM assertions and Storybook eyeballing.
- **Real-browser axe** — A11y persona's contrast math was computed from token values; running axe inside a Storybook against every story would likely surface additional violations on every accent-text-on-light surface.
- **Bundle size measurement** — no `size-limit` or equivalent. The FE persona flagged Radix bundling as a P1 but didn't measure the actual delta.
- **Live npm audit / supply-chain SCA** — only static review of dependency hygiene (versions, peer/dev split). No live CVE check beyond what `pnpm audit` would surface.
- **Real React 19 compat run** — peerDeps allow React 19; CI tests React 18.3.1 only. Untested in either direction.
- **GitHub repo settings** — branch protection rules, required reviewers, label inventory, project boards, milestones. Cannot inspect from filesystem.
- **Storybook deploy verification** — `pages.yml` deploys to GH Pages but the live URL was not visited.
