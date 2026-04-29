# Contributing

## Local setup

```bash
nvm use                 # Node 20 (per .nvmrc)
corepack enable         # ensures the right pnpm version
pnpm install
pnpm dev                # opens Storybook at http://localhost:6006
```

## The PR loop

1. **Branch** off `main`. Name it `<scope>/<short-description>` — e.g., `ui/button-loading-state`.
2. **Implement** the change. Follow the conventions in [`adding-a-component.md`](./adding-a-component.md)
   for new components.
3. **Test** locally:
   ```bash
   pnpm typecheck && pnpm lint && pnpm test && pnpm build
   ```
4. **Add a changeset** if you touched a publishable package:
   ```bash
   pnpm changeset
   ```
   Pick `patch` / `minor` / `major` per [semver](https://semver.org/). Commit the
   generated `.changeset/*.md` file.
5. **Open the PR**. CI runs the full verification matrix.
6. **Review** — at least one approval; CI green; no a11y regressions.
7. **Merge** — squash merges only. The release workflow takes it from there.

## Commit style

We don't enforce conventional commits, but a useful prefix helps reviewers:

```
ui: add Tooltip component
tokens: tighten radius scale
docs: explain @theme bridge
chore: bump turbo
```

## When you should NOT add a changeset

- Editing files under `apps/docs` or `docs/`.
- Editing root config files (eslint, prettier, turbo, CI).
- Editing tests-only changes that don't affect published output.

The Changesets `ignore` config already excludes `docs`, but you should be deliberate
either way — every changeset triggers a version bump.

## Got stuck?

Ping the design-system Slack channel or open a draft PR with a `[help wanted]` label.
