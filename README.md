# Ship-It Design System

The official design system and React component library used by Ship-It Ops front-end
applications. It is the single source of truth for design tokens, icons, and UI
components.

## What's inside

This is a [pnpm](https://pnpm.io/) monorepo with three publishable packages and one
documentation app.

```
apps/
  docs/                    Storybook 8 — live component playground & docs site
packages/
  tokens/                  @ship-it/tokens   — colors, type, spacing, radius, motion
  icons/                   @ship-it/icons    — SVG-based React icons
  ui/                      @ship-it/ui       — React component library (Tailwind v4)
  tsconfig/                Shared TypeScript presets
  eslint-config/           Shared ESLint flat config
docs/                      Long-form repo docs (architecture, contributing, etc.)
```

Each package has its own `README.md` describing how to add to or change it.

## Tech stack

| Concern               | Choice                                                 |
| --------------------- | ------------------------------------------------------ |
| Framework             | React 18+ with TypeScript                              |
| Styling               | Tailwind v4 (`@theme` directive) + CSS variable tokens |
| Headless behavior     | Radix UI primitives                                    |
| Variant API           | `class-variance-authority` + `tailwind-merge`          |
| Library build         | `tsup` (ESM + CJS + types)                             |
| Docs / playground     | Storybook 8                                            |
| Testing               | Vitest, @testing-library/react, axe-core               |
| Versioning & release  | Changesets                                             |
| Task orchestration    | Turborepo                                              |
| Package manager       | pnpm 9                                                 |
| Node                  | 20 LTS (see `.nvmrc`)                                  |

## Getting started

```bash
nvm use                    # picks up .nvmrc
pnpm install
pnpm dev                   # opens Storybook at http://localhost:6006
```

Common scripts (run from the repo root):

```bash
pnpm build                 # build all packages + docs
pnpm test                  # Vitest across all packages
pnpm typecheck             # tsc -b across the project graph
pnpm lint                  # ESLint
pnpm format                # Prettier write
pnpm changeset             # describe a version bump for a PR
```

## Where to read next

- **[`docs/architecture.md`](./docs/architecture.md)** — how tokens, icons, and
  components fit together; build pipeline.
- **[`docs/adding-a-component.md`](./docs/adding-a-component.md)** — step-by-step
  authoring guide.
- **[`docs/design-handoff.md`](./docs/design-handoff.md)** — how a Figma handoff
  becomes tokens and components in this repo.
- **[`docs/contributing.md`](./docs/contributing.md)** — branching, commits, PR
  checklist, Changesets workflow.

## License

[MIT](./LICENSE)
