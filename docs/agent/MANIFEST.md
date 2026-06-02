# Agent Context

Last updated: 2026-06-02 | Total notes: 39

<!--
  This file is the index for `docs/agent/`. Agents read it at session start.
  Format: - [slug] | type | status | importance | YYYY-MM-DD | 8-word summary

  Read protocol:
    1. Read this file.
    2. Read every file in `status/` (always — small, ephemeral, critical).
    3. Read every note marked `importance: core`.
    4. Read 1-3 notes most relevant to the current task.
    5. Scan `open-questions/` for blockers in the task area.

  Write protocol:
    - Write on milestones (decision made, plan finalized, root cause found,
      scar earned), not at end of session.
    - Apply the 5-minute rule: if a future agent could re-derive it in <5
      minutes from code or git log, don't write it.
    - Update existing notes instead of creating near-duplicates.
-->

## Status (in-flight)

<!-- always-read at session start. Move to archive/ on completion. -->

_None._

## Decisions

- [agent-context-initialized](decisions/agent-context-initialized.md) | decision | active | core | 2026-05-21 | Adopted docs/agent/ for agent handoff state
- [dark-first-oklch-theming](decisions/dark-first-oklch-theming.md) | decision | active | core | 2026-05-21 | Dark-default + single --accent-h OKLCH knob
- [monorepo-package-split](decisions/monorepo-package-split.md) | decision | active | core | 2026-05-21 | Nine publishable packages; consumer-install-driven boundaries
- [no-storybook-migration](decisions/no-storybook-migration.md) | decision | active | core | 2026-05-21 | Removed Storybook; docs-site MDX/TSX examples canonical
- [v0-changeset-patch-policy](decisions/v0-changeset-patch-policy.md) | decision | active | core | 2026-05-21 | All packages stay patch bumps while v0.0.x
- [ssr-rsc-support-strategy](decisions/ssr-rsc-support-strategy.md) | decision | active | core | 2026-05-21 | "use client" preserved through tsup; next-helpers package
- [separate-renderer-packages](decisions/separate-renderer-packages.md) | decision | active | standard | 2026-05-21 | Cytoscape, react-flow, MapLibre as optional packages
- [next-16-react-19-baseline](decisions/next-16-react-19-baseline.md) | decision | active | core | 2026-05-27 | Next 16 + React 19.2 baseline; React Compiler opt-in
- [internal-dep-cascade-on-publish](decisions/internal-dep-cascade-on-publish.md) | decision | active | standard | 2026-06-02 | Keep ui-dependent cascade on publish until 1.0

## Plans

_None._

## Investigations

- [audit-2026-05-02-snapshot](investigations/audit-2026-05-02-snapshot.md) | investigation | completed | standard | 2026-05-21 | Six-persona audit themes A-G and current status

## Patterns

- [component-authoring-shape](patterns/component-authoring-shape.md) | pattern | active | standard | 2026-05-21 | Three-file folder, forwardRef, cva, docs surface
- [htmlattributes-omit-pattern](patterns/htmlattributes-omit-pattern.md) | pattern | active | standard | 2026-05-21 | Omit title/onSelect/values etc when extending HTMLAttributes
- [drift-test-for-codegen](patterns/drift-test-for-codegen.md) | pattern | active | standard | 2026-05-21 | Every committed codegen output needs a drift test
- [specialized-typed-exports](patterns/specialized-typed-exports.md) | pattern | active | standard | 2026-05-21 | Typed specialized exports plus a convenience wrapper
- [group-data-state-radix](patterns/group-data-state-radix.md) | pattern | active | standard | 2026-05-21 | Radix data-state needs `group` on parent
- [test-setup-portal-axe](patterns/test-setup-portal-axe.md) | pattern | active | standard | 2026-05-21 | Axe scans document.body to catch Radix portals
- [theme-tokens-resolution-chain](patterns/theme-tokens-resolution-chain.md) | pattern | active | standard | 2026-05-21 | TS → tokens.css → @theme inline → Tailwind utilities
- [derive-during-render-stale-clear](patterns/derive-during-render-stale-clear.md) | pattern | active | standard | 2026-06-01 | Clear stale id state during render, not in an effect
- [goto-in-progress-suppression](patterns/goto-in-progress-suppression.md) | pattern | active | standard | 2026-06-02 | Suppress onScroll setActive during in-flight goTo smooth scroll
- [selection-ring-on-rendered-child](patterns/selection-ring-on-rendered-child.md) | pattern | active | standard | 2026-06-02 | Apply selection ring to child so it follows consumer shape

## Open Questions

- [variant-tone-callback-vocabulary-consolidation](open-questions/variant-tone-callback-vocabulary-consolidation.md) | open-question | active | standard | 2026-05-21 | Pick one vocabulary across variant/tone/callback APIs before 1.0
- [1-0-stability-promise](open-questions/1-0-stability-promise.md) | open-question | active | standard | 2026-05-21 | When and how to cut 1.0 with stability commitment

## Scars

- [drawer-sheet-axe-gap](scars/drawer-sheet-axe-gap.md) | scar | active | standard | 2026-05-21 | Overlays without axe shipped without accessible names
- [graphnode-cssvar-hex-alpha](scars/graphnode-cssvar-hex-alpha.md) | scar | active | standard | 2026-05-21 | var(--color)40 is invalid CSS; use color-mix
- [usecontrollable-undefined-crash](scars/usecontrollable-undefined-crash.md) | scar | active | standard | 2026-05-21 | Non-null assertion on useControllableState result crashes
- [tailwind-v4-beta-caret](scars/tailwind-v4-beta-caret.md) | scar | active | standard | 2026-05-21 | Caret on prerelease tag silently auto-bumps
- [token-doc-drift-bg-brand](scars/token-doc-drift-bg-brand.md) | scar | active | standard | 2026-05-21 | READMEs referenced bg-brand etc that don't exist
- [theme-tokens-in-globals-not-tokens-css](scars/theme-tokens-in-globals-not-tokens-css.md) | scar | active | standard | 2026-05-21 | Grep both files before flagging missing token
- [hydration-theme-mismatch](scars/hydration-theme-mismatch.md) | scar | active | standard | 2026-05-21 | useTheme DOM read in useState initializer caused FOUC
- [ssr-controlled-vs-default-attrs](scars/ssr-controlled-vs-default-attrs.md) | scar | active | standard | 2026-05-21 | <details open=> is controlled, not a default
- [ci-strict-resolution-masks](scars/ci-strict-resolution-masks.md) | scar | active | standard | 2026-05-21 | pnpm symlinks hide undeclared workspace deps locally
- [reduced-motion-token-bypass](scars/reduced-motion-token-bypass.md) | scar | active | standard | 2026-05-21 | Literal animate-[…_220ms_…] bypassed token zeroing
- [icons-readme-codegen-drift](scars/icons-readme-codegen-drift.md) | scar | active | standard | 2026-05-21 | icons README claimed wrong codegen output path
- [turbopack-mdx-plugin-serialization](scars/turbopack-mdx-plugin-serialization.md) | scar | active | standard | 2026-05-27 | Turbopack needs MDX plugin _names_, not function refs
- [react-hooks-v7-set-state-in-effect-false-positives](scars/react-hooks-v7-set-state-in-effect-false-positives.md) | scar | active | standard | 2026-06-01 | v7 set-state-in-effect fires on SSR mounted-flag and post-nav DOM scans
- [scroll-behavior-smooth-overrides-scrollleft-setter](scars/scroll-behavior-smooth-overrides-scrollleft-setter.md) | scar | active | standard | 2026-06-02 | scrollLeft = X animates under scroll-behavior: smooth; use instant
- [math-round-midpoint-fires-onscroll-edge-mid-animation](scars/math-round-midpoint-fires-onscroll-edge-mid-animation.md) | scar | active | standard | 2026-06-02 | Math.round flips at midpoint and fires edge work mid-flight
- [docs-site-stale-ui-dist](scars/docs-site-stale-ui-dist.md) | scar | active | standard | 2026-06-02 | docs-site bundles @ship-it-ui/ui from dist, not src
- [rebase-instant-scroll-fires-edge-snap](scars/rebase-instant-scroll-fires-edge-snap.md) | scar | active | standard | 2026-06-02 | scrollIntoView(instant) fires a scroll event you can't distinguish from natural landings
