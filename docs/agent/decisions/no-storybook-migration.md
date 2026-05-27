---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [docs, storybook, examples, build]
importance: core
---

# Storybook removed; docs-site MDX/TSX examples are the canonical demo surface

## Context

The repo originally shipped Storybook under `apps/docs/`. In commit
`424677e` (`chore: rework docs`, PR #25, 2026-05-06) Storybook was
removed in favor of a Next.js 15 + MDX docs site at `apps/docs-site/`.

## Decision

- **No `Component.stories.tsx` files** — component folders contain only
  `Component.tsx`, `Component.test.tsx`, and `index.ts`.
- Visual examples live in **`apps/docs-site/examples/<kebab>/<variant>.tsx`**,
  each default-exporting a single React component named `Example`. The
  file contents are rendered verbatim under the docs page's Code tab, so
  examples must be small and self-contained.
- Docs pages are MDX at `apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx`
  using `<LivePreview example="…">` and an auto-generated `<PropsTable>`
  fed by `react-docgen-typescript`.
- The sidebar at `apps/docs-site/content/navigation.ts` is the
  filesystem-agnostic source of truth; a `page.mdx` not listed there is
  unreachable.

This convention is encoded in `.claude/ship-reviewed-prs-overrides.md`
section "No Storybook in this repo" — reviewers must not ask for
stories.

## Alternatives Considered

- **Keep Storybook + add MDX docs**: rejected — two surfaces drift; the
  Storybook deploy (`apps/docs/`) was on a beta train and a build-break
  source (#21 "Fix ci storybook").
- **Inline examples in MDX without separate `.tsx` files**: rejected —
  the Code tab needs verbatim source per variant; mixing inline JSX into
  MDX hides imports and shortens learning curve.

## Consequences

- The docs site **eats its own dog food** — Topbar/Sidebar/⌘K palette/
  theme toggle are built from `@ship-it-ui/ui`. Bugs in chrome surface in
  the docs build immediately.
- Static export to GitHub Pages via `pages.yml`. Generation scripts
  (`build-examples-registry.ts`, `build-docgen.ts`,
  `build-search-index.ts`) run on `predev`/`prebuild`/`prelint`/
  `pretypecheck` — every quality gate touches them.
- Adding a component requires touching three artifacts (the implementation,
  the example file, the MDX page) plus registering in `navigation.ts`. The
  PR template's checklist enforces this.

## Revisit Triggers

- If the docs site's bundle gets unwieldy enough that Next.js's
  per-page hydration cost outweighs Storybook's lazy chunk loading.
- If a need for visual-regression testing surfaces (Chromatic / Loki) and
  Storybook ergonomics beat re-rolling against the docs site.

## Related

- [[component-authoring-shape]] — the file layout convention this decision
  produces.
- [[v0-changeset-patch-policy]] — docs-site changes don't trigger
  package bumps (in `.changeset/config.json`'s `ignore: ['docs-site']`).
