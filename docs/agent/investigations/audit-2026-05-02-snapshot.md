---
type: investigation
status: completed
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [audit, history, themes, status]
importance: standard
---

# Six-persona audit (2026-05-02) — original findings and what's been addressed since

## Symptoms

On 2026-05-02 a coordinated six-persona audit (Software Engineer, UI/UX
Engineer, Accessibility, DevOps, Frontend Engineer, Project Manager)
landed in `audit/2026-05-02/`. The top-line verdict:

> "Engineering-mature for a 0.0.1 design system" but **not production-
> ready as a publish target.** The published `@ship-it-ui/ui` was
> unusable as documented (`tokens` declared as devDep), every Next.js
> App Router consumer would get a build error (zero `"use client"` +
> tsup stripping directives), and multiple WCAG AA failures would block
> adoption by any organization with an a11y bar.

~17 unique P0s, ~50 P1s, ~60 P2s, ~35 P3s — distributed across the
six persona reports.

## Root Cause

The system grew organically through `v0` + rename PRs (#8, #10, #11)
before the publish boundary, SSR contract, and a11y bar were stress-
tested. The audit was the first systematic stress-test. The findings
clustered into **7 themes**:

- **Theme A** — published artifact broken (tokens as devDep)
- **Theme B** — not Next.js / RSC compatible (no `"use client"`, tsup
  strips directives)
- **Theme C** — hydration mismatches (useTheme, Calendar)
- **Theme D** — runtime crash paths and silent visual failures
  (`useControllableState`, `GraphNode` glow, Drawer/Sheet no name)
- **Theme E** — WCAG 2.2 AA failures across multiple components
  (text-dim contrast, accent-on-light contrast, reduced-motion ignored,
  DataTable keyboard, Tree keyboard)
- **Theme F** — design-system credibility gaps (dead z-index scale,
  variant naming split four ways, callback naming split four ways,
  docs lie about behavior)
- **Theme G** — public-library governance missing (no SECURITY.md, no
  PR template, no CODEOWNERS, no dependabot, missing npm metadata)

## Fix

Audit-review PR #13 ("Audit review") landed the bulk of governance and
infrastructure fixes. Subsequent PRs (#30, #33, #39, #41, #47, #49, #51,
#53) absorbed the per-theme fixes. As of 2026-05-21, the status of each
audit theme is:

| Theme                          | Status           | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — tokens devDep              | ✅ fixed         | Now `peerDependencies` in `packages/ui/package.json:61`                                                                                                                                                                                                                                                                                                                                                                                                       |
| B — `"use client"` + tsup      | ✅ largely fixed | 114/190 interactive source files now carry the directive; `esbuild-plugin-preserve-directives` wired in `tsup.config.ts`; `treeshake: false` documented in config comment                                                                                                                                                                                                                                                                                     |
| C — hydration                  | ✅ fixed         | `useTheme` initial state stable; `@ship-it-ui/next/ThemeBootstrap` ships for FOUC prevention. See [[hydration-theme-mismatch]]                                                                                                                                                                                                                                                                                                                                |
| D — crash paths / Drawer-Sheet | ✅ fixed         | Drawer/Sheet have axe tests + Titles; `useControllableState` consumers no longer use `!` (verify per [[usecontrollable-undefined-crash]]); `GraphNode` glow uses color-mix                                                                                                                                                                                                                                                                                    |
| E — WCAG AA                    | ✅ mostly fixed  | `text-text-dim` raised to `#7c7c86` dark / `#6f6f78` light (matches A11y persona's recommended values exactly); reduced-motion global override added in `animations.css:143`; z-index tokens wired                                                                                                                                                                                                                                                            |
| F — credibility                | ⚠️ partial       | z-index tokens now in `globals.css` `@theme inline` (`--z-modal`, `--z-tooltip`, etc.) and `tokens.css`. Callback naming consolidated toward `onValueChange` + `onSelectionChange` in most patterns but legacy `onSelect`/`onChange` still present in Combobox/CommandPalette/Tree/Calendar. Variant vs tone vocabulary still split (Alert `variant: info\|ok\|warn\|err`; Progress `tone: accent\|ok\|warn\|err`; EmptyState `tone: accent\|danger\|muted`). |
| G — governance                 | ✅ fixed         | `.github/SECURITY.md`, `dependabot.yml`, `ISSUE_TEMPLATE/`, `CODEOWNERS`, `pull_request_template.md` all in place; all four publishable packages have `homepage`/`bugs`/`keywords`/`author`; third-party Actions SHA-pinned. CODE_OF_CONDUCT.md is still missing.                                                                                                                                                                                             |

## Prevention

The audit converted into **structural** prevention:

- `.claude/ship-reviewed-prs-overrides.md` codifies the convention
  reviewers must apply — including the "Token architecture trap" and
  "Data-state variants need `group`" gotchas.
- Drift tests for codegen ([[drift-test-for-codegen]]) prevent
  regression of the icons-README class of bug.
- Scars on the highest-impact landmines live in `docs/agent/scars/`.

The audit folder (`audit/2026-05-02/`) remains as the deep-dive
reference — every theme entry links into the per-persona file with full
`file:line` citations. Don't reproduce its findings here; reference it
when a theme reopens.

## Related

- [[hydration-theme-mismatch]] — Theme C
- [[drawer-sheet-axe-gap]] — Theme D
- [[usecontrollable-undefined-crash]] — Theme D
- [[graphnode-cssvar-hex-alpha]] — Theme D
- [[reduced-motion-token-bypass]] — Theme E
- [[token-doc-drift-bg-brand]] — Theme F
- [[icons-readme-codegen-drift]] — Theme F
- [[ssr-rsc-support-strategy]] — Theme B's decision
