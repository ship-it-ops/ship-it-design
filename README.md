# Ship-It Design System

The official design system and React component library for Ship-It Ops front-end
applications. Single source of truth for design tokens, icons, primitives,
patterns, and ShipIt-AI-specific composites.

## What's inside

A pnpm + Turborepo monorepo. Four publishable packages, two internal config
packages, and a Storybook docs app.

```
apps/
  docs/                     Storybook 8 — live component playground & docs site
packages/
  tokens/         (publish) @ship-it-ui/tokens   — colors, type, spacing, radius,
                                                 shadow, motion, breakpoints, z-index
  icons/          (publish) @ship-it-ui/icons    — IconGlyph + glyph map + SVGR pipeline
  ui/             (publish) @ship-it-ui/ui       — generic primitives + patterns + hooks
  shipit/         (publish) @ship-it-ui/shipit   — ShipIt-AI domain composites
                                                 (AI surfaces, graph, entity, marketing)
  tsconfig/       (internal) shared TypeScript presets
  eslint-config/  (internal) shared ESLint flat config
docs/                       Long-form repo docs (architecture, contributing, etc.)
```

Each publishable package has its own `README.md`. `@ship-it-ui/shipit` depends on
`@ship-it-ui/ui` + `@ship-it-ui/icons`; `@ship-it-ui/ui` depends on `@ship-it-ui/tokens` +
`@ship-it-ui/icons`. Apps may install only what they need.

## Tech stack

| Concern              | Choice                                                                           |
| -------------------- | -------------------------------------------------------------------------------- |
| Framework            | React 18+ with TypeScript                                                        |
| Styling              | Tailwind v4 beta (`@theme inline`) over CSS-variable tokens                      |
| Theming              | Dark-first. `:root` is dark; `[data-theme="light"]` opts in.                     |
| Accent system        | OKLCH single-hue knob — `--accent-h` (default `200`) reskins all                 |
| Headless behavior    | Radix UI primitives                                                              |
| Variant API          | `class-variance-authority` + `clsx` + `tailwind-merge`                           |
| Library build        | `tsup` (ESM + CJS + types)                                                       |
| Docs / playground    | Storybook 8                                                                      |
| Testing              | Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe` |
| Versioning & release | Changesets                                                                       |
| Task orchestration   | Turborepo                                                                        |
| Package manager      | pnpm 9                                                                           |
| Node                 | 20 LTS (see `.nvmrc`)                                                            |

## Getting started

```bash
nvm use                    # Node 24 (per .nvmrc)
corepack enable            # ensures the right pnpm version
pnpm install
pnpm dev                   # opens Storybook at http://localhost:6006
```

## Common scripts

Run from the repo root.

```bash
pnpm build                 # build all packages + Storybook static
pnpm test                  # Vitest across every package (turbo-cached)
pnpm test:force            # same as `test`, but bypasses turbo's cache
pnpm typecheck             # tsc --noEmit across the project graph
pnpm lint                  # ESLint
pnpm format                # Prettier write
pnpm format:check          # Prettier check (no writes)
pnpm changeset             # describe a version bump for a PR
```

Per-package: `pnpm --filter @ship-it-ui/ui test`, etc.

## CI

GitHub Actions workflows in `.github/workflows/`:

| Workflow              | Triggers on                     | What it does                                                 |
| --------------------- | ------------------------------- | ------------------------------------------------------------ |
| `ci.yml`              | every PR + push to `main`       | format → lint → typecheck/test/build → Claude PR review      |
| `claude.yml`          | `@claude` mention in PR / issue | reactive — runs Claude with the comment as context           |
| `changeset-check.yml` | every PR touching `packages/*`  | fails if a publish-worthy change has no `.changeset/*.md`    |
| `snapshot.yml`        | manual                          | publishes a `0.0.0-snap-*` build to npm under the `snap` tag |
| `release.yml`         | push to `main` with changesets  | opens "Version Packages" PR; publishes on merge              |

The Claude PR review job runs as the last stage of `ci.yml` with
`needs: [format, lint, verify]` — it only fires if all three CI stages pass on
the PR's head commit. Skip a specific PR with the `skip-claude` label.

## Where to read next

- **[`docs/architecture.md`](./docs/architecture.md)** — how tokens, icons, ui,
  and shipit fit together; theming model; build pipeline.
- **[`docs/adding-a-component.md`](./docs/adding-a-component.md)** — step-by-step
  authoring guide (primitives, patterns, and shipit composites).
- **[`docs/design-handoff.md`](./docs/design-handoff.md)** — translating a Figma
  / design-tool handoff into tokens and components.
- **[`docs/contributing.md`](./docs/contributing.md)** — branching, commits,
  PR checklist, Changesets workflow.

## License

[MIT](./LICENSE)
