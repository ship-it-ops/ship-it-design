# ship-it-design — PR Review Overrides

Applied on top of the `ship-reviewed-prs` skill defaults when reviewing PRs
in this monorepo. The skill itself is fetched at CI time from
`ship-it-ops/ship-code` (pinned by SHA in `.github/workflows/ci.yml`) and
installed into `.claude/skills/ship-reviewed-prs/`; the methodology
(personas, lifecycle classification, fingerprint suppression, decision
matrix, output format) lives there.

Each block below overrides or extends a default from the skill's `SKILL.md`,
`reference.md`, or `reference-lifecycle.md`. The skill loader reads override
files in this order, with later files winning:

1. Skill's bundled defaults
2. `overrides.md` next to `SKILL.md` (team-wide; absent in our setup)
3. **This file** at `.claude/ship-reviewed-prs-overrides.md` (project-specific)

Format is loose `key: value` + free-form prose; the reviewer reads it before
forming findings.

---

## Repo summary (orient before reviewing)

- pnpm + turbo workspace, five publishable packages under `@ship-it-ui/*`
  (`tokens`, `icons`, `ui`, `shipit`, `cytoscape`) + a Next.js docs site at
  `apps/docs-site/`.
- Stack: React 18+, TypeScript 5.x, Tailwind v4 (beta), Radix UI
  primitives, `cva` for variant axes, `tsup` for library builds, Vitest +
  `vitest-axe` for tests.
- No Storybook — see Convention 2 below.
- All publishable packages are at `0.0.x` — see Convention 3 (v0 policy).

---

## Comment lifecycle tuning

```
stale_threshold_days: 14
fingerprint_line_window: 5
maintainer_associations: [OWNER, MEMBER, COLLABORATOR]
```

### Won't-fix markers (in addition to skill defaults)

```
wont_fix_markers:
  - "follow-up"
  - "follow up"
  - "tracked in #"          # any "tracked in #<n>" reference
  - "not in this PR"
  - "not in this pr"
  - "deferred"
  - "punt"
  - "next sprint"
  - "next release"
```

### Won't-fix reactions

```
wont_fix_reactions: [white_check_mark, thumbsup]
```

---

## CI submission policy

```
ci_max_decision: COMMENT
```

The bot is **non-blocking** — branch protection requires human approval,
so the reviewer's role is to surface concerns, not gate merges. The exit
code still reflects the _original_ (uncapped) verdict so any downstream
tooling that wants stricter gating can use `--strict`.

### Bot identity prefix

```
Posted by ship-reviewed-prs (bot) on the ship-it-design DS monorepo.
Reasoning is in this comment; tag a maintainer for disputed findings.
```

---

## Persona configuration

All five personas active. `DA` (data) and `IN-deep` (infra) only escalate
conditionally on the file triggers below.

### DA conditional triggers (in addition to skill defaults)

`DA` activates when this repo's design-data-equivalent files are touched:

- `packages/tokens/src/**/*.ts` — design tokens (the "schema" of visual
  identity; renames are observable contract breaks for every consumer
  consuming `--color-*` / `--font-*` / `--space-*`)
- `packages/icons/src/icon-manifest.ts` — manifest is the source of truth
  for `GlyphName` / `ConnectorName` and the generated `icon-data.ts`. A
  rename or removal here breaks downstream typed consumers.
- `packages/shipit/src/entity/types.ts` — `EntityTypeMeta` shape;
  registered-type vocabulary is a public contract.

### IN-deep conditional triggers (in addition to skill defaults)

- `.github/workflows/*.yml`
- `packages/*/tsup.config.ts`, `packages/*/vitest.config.ts`
- `turbo.json`, `pnpm-workspace.yaml`, top-level `package.json`

---

## Repo conventions (apply to SE persona)

When SE reviews ship-it-design, apply these on top of its standard rubric.

### 1. Token architecture trap

Token primitives live in `packages/tokens/src/color.ts` and friends, then
are re-bound to Tailwind utilities via the `@theme inline` block in
`packages/ui/src/styles/globals.css`. **Many tokens (e.g.
`--color-on-accent`) exist ONLY in `globals.css`, not in `tokens.css`**.
Before flagging "token X doesn't exist," grep BOTH files. This is the
single most common false-positive on this repo.

### 2. No Storybook in this repo

Migrated away in `chore: rework docs`. Do NOT ask for
`Component.stories.tsx`. Visual examples are MDX/TSX in
`apps/docs-site/examples/<component>/<variant>.tsx`. Component folders
contain only `{Component}.tsx`, `{Component}.test.tsx`, and `index.ts` —
that's the full convention.

### 3. v0 changeset policy

All publishable packages are at `0.0.x`. Every changeset stays `patch`
while in v0 — even for additive new exports and even when Changesets'
workspace-peerDep rule auto-promotes to major. **Do NOT flag
patch-vs-minor severity.** The `changeset-check` workflow handles
structural absence; SE can nudge if the body is empty or actively
misleading.

### 4. Required component conventions

- `forwardRef` on every component (or a JSDoc note explaining why not,
  mirroring `EntityListRow`'s precedent for split convenience wrappers
  that delegate to typed specialized exports).
- `cva` for variant axes — no inline conditional className concat that
  should be a variant.
- Tailwind utilities consume token CSS vars (`bg-accent`, `text-text-muted`)
  — never raw hex literals in `className`.
- When extending `HTMLAttributes`, `Omit` conflicting props (`title`,
  `onSelect`, `values`, drag handlers).
- Import from package barrels (`@ship-it-ui/<pkg>`), not implementation
  files (`@ship-it-ui/<pkg>/src/...`).

### 5. Data-state variants need `group`

Radix sets `data-state` on triggers, not children — bare
`data-[state=open]:` on a child never matches. The parent must have
`group` and the child uses `group-data-[state=open]:`. Flag if you see
the bare form.

### 6. Concurrent-mode safety

Use `useEffect` for prev-value tracking; in-render ref mutation is unsafe
in React 18 concurrent rendering. Flag `useRef` writes that happen during
render.

### 7. Controlled vs. uncontrolled native elements

`<details open={…}>`, `<dialog open={…}>`, `<input checked={…}>`,
`<select value={…}>` are _controlled_ attributes — React re-applies them
on every render. A `defaultX` prop must back into local `useState` +
`onChange` / `onToggle`, not into the `open` / `checked` / `value`
attribute directly. The `EntityList.tsx:72` review thread from PR #39
is the canonical example.

### 8. Public API hygiene

Anything exported from `packages/*/src/index.ts` is a contract. Flag
breaking renames or signature changes — the v0 patch policy means the
bump level won't reflect this, so call it out in the changeset _body_ so
CHANGELOG readers see it.

---

## A11y rubric (apply across personas reviewing UI)

Every component asserts `axe` violations === 0 (`vitest-axe`). Flag:

- Missing accessible names on icon-only controls (e.g. an `IconButton`
  without `aria-label`).
- Duplicate landmarks with the same `aria-label`.
- Nested-interactive elements (`<button>` inside `<button>`, `<a>` inside
  `<button>`, etc.).
- Broken focus-trap or missing keyboard support in interactive widgets.
- `aria-expanded` paired with `aria-controls` pointing at a
  conditionally-unmounted element (the ID is dangling when collapsed).
- `<summary>` without a visible label or fallback `aria-label` when used
  in `<details>` (canonical example: `EntityList collapsible` with no
  `title` from PR #39).
- Dialog / drawer surfaces without `aria-describedby` when content
  conveys non-decorative information.
- `role="grid"` on non-grid DOM shapes (Radix RovingFocusGroup pattern
  is correct; raw `role=grid` on a flat list is not).
- File-picker patterns that nest the input inside a labelled button —
  use a sibling `<label>` instead to avoid `nested-interactive`.

---

## Test coverage (apply to TS persona)

New components/patterns must have:

1. Render happy path.
2. Every interactive behavior covered. **Prefer `userEvent`**; `fireEvent`
   is acceptable only with a comment explaining why (typically Radix
   keyboard handlers that `userEvent` doesn't reach in jsdom).
3. An `axe` clean assertion (`expect(await axe(container)).toHaveNoViolations()`).
4. State-driven UI tests verify _post-mount transitions_ (e.g., re-render
   with a different prop and assert the UI updated), not just first paint.
5. New hooks use `renderHook` from `@testing-library/react`.

For component variants that have visually-distinct render paths (e.g.,
`StalenessChip` with vs. without `tooltip`), **each path needs its own
axe assertion** — the DOM shape differs and one axe pass doesn't cover the
other.

---

## Generated / vendored — DO NOT review

Skip these (note them in the Confidence section as "not reviewed"):

- `packages/icons/src/icon-data.ts` — codegen from
  `icon-manifest.ts`; drift test in `scripts/build-icon-data.test.ts`
  gates parity.
- `packages/icons/src/svg-icons.ts` — codegen from `src/svg/`.
- `packages/icons/src/components/*.tsx` — SVGR output.
- `apps/docs-site/.generated/**` — search index, examples registry,
  docgen output.
- `apps/docs-site/.next/**`, `**/dist/**`, `**/node_modules/**`,
  `**/storybook-static/**`, `**/coverage/**`.
- `pnpm-lock.yaml` (note version-bump scope in the description; don't
  review lockfile content).

---

## Security tightening for this repo (apply to SC persona)

- The icons codegen embeds SVG strings via `dangerouslySetInnerHTML`
  (`IconGlyph.tsx`). That's load-bearing — SVG body comes from a
  build-time-resolved Iconify map, not user input. **Do not flag it as
  XSS.** If a runtime path starts taking user-supplied SVG, then flag.
- Cytoscape stylesheets accept color strings; the `escapeAttr` in
  `iconToSvgDataUrl` protects against attribute-injection. Verify any
  _new_ code path that interpolates color/glyph into SVG strings escapes
  identically.
- The `claude.yml` and `ci.yml` workflows execute model-generated code in
  a CI runner. PRs that modify those workflows are auto-skipped by the
  existing self-modification guard in `ci.yml` — don't second-guess that
  behavior.

---

## What "solid" looks like in this repo

Calibration for the "What's solid" section — these are the patterns SE
should explicitly call out as good when present:

- Drift tests for any generated file (`build-icon-data.test.ts` is the
  template).
- Specialized typed exports + a convenience wrapper that doesn't forward
  refs (`EntityListRow*` pattern).
- `axe` assertions in component tests, especially with multiple
  render-path variants tested separately.
- Comments that name the _why_ (e.g., "`useState` because
  `<details open>` is controlled, not default") rather than restating
  what the code does.
- Changesets that explicitly call out breaking changes in the body even
  when policy keeps the bump at `patch`.

---

## When in doubt

If a finding is uncertain or context-dependent, label it
"low confidence — verify" or skip. The bot's primary failure mode is
crying wolf, not missing things.
