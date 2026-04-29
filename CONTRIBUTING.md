# Contributing

Thanks for helping build the Ship-It design system. The full contributor guide lives in
[`docs/contributing.md`](./docs/contributing.md).

Quick links:

- **Add a component** → [`docs/adding-a-component.md`](./docs/adding-a-component.md)
- **Architecture overview** → [`docs/architecture.md`](./docs/architecture.md)
- **Design handoff process** → [`docs/design-handoff.md`](./docs/design-handoff.md)

## TL;DR

```bash
pnpm install
pnpm dev                    # runs Storybook against live packages
pnpm test                   # Vitest, watch by default in dev
pnpm changeset              # before opening a PR that touches a published package
```

Open a PR. CI runs format, lint, typecheck, test, build. If your PR includes a
`.changeset/*.md` file, the release workflow will publish on merge.
