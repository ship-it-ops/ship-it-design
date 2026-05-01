# Contributing

The full contributor guide lives in [`docs/contributing.md`](./docs/contributing.md).

Quick links:

- **Add a component** → [`docs/adding-a-component.md`](./docs/adding-a-component.md)
- **Architecture overview** → [`docs/architecture.md`](./docs/architecture.md)
- **Design-handoff workflow** → [`docs/design-handoff.md`](./docs/design-handoff.md)

## TL;DR

```bash
pnpm install
pnpm dev                    # Storybook on :6006, watching every package
pnpm test                   # Vitest across the workspace (turbo-cached)
pnpm test:force             # same, but bypass cache (use to confirm green)
pnpm changeset              # before opening a PR that touches a published package
```

Open a PR. CI runs format → lint → typecheck → test → build, and only then runs
the Claude PR review. If your PR includes a `.changeset/*.md` file, the release
workflow handles publishing on merge.
