# Contributing

## Local setup

```bash
nvm use                 # Node 24 (per .nvmrc)
corepack enable         # ensures the right pnpm version
pnpm install
pnpm dev                # opens Storybook at http://localhost:6006
```

## The PR loop

1. **Branch** off `main`. Name it `<scope>/<short-description>` — e.g.,
   `ui/button-loading-state`, `shipit/askbar-citation-pinning`,
   `tokens/tighten-radius-scale`, `docs/architecture-refresh`.
2. **Implement** the change. For new components, follow
   [`adding-a-component.md`](./adding-a-component.md).
3. **Test** locally:
   ```bash
   pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```
   If a turbo cache hit makes you nervous, `pnpm test:force` re-runs tests
   without the cache.
4. **Add a changeset** if you touched a publishable package
   (`packages/{tokens,icons,ui,shipit}`):
   ```bash
   pnpm changeset
   ```
   Pick `patch` / `minor` / `major` per [semver](https://semver.org/). Commit
   the generated `.changeset/*.md`. The `changeset-check` workflow will fail
   the PR if a publish-worthy change is missing one.
5. **Open the PR**. CI runs format → lint → typecheck → test → build. If all
   four pass, the Claude PR review job runs as the final stage and posts a
   sticky review comment.
6. **Review** — at least one approval; CI green; no a11y regressions.
7. **Merge** — squash merges only. The release workflow takes it from there.

## Skipping the Claude review

Apply the `skip-claude` label to a PR (e.g., a mechanical refactor, a snapshot
release, a docs-only change you don't need a review on). The Claude review job
is conditional on the label being absent — it skips entirely when present.

Drafts, the auto-generated `chore(release): version packages` PR, and PRs from
`dependabot[bot]` / `renovate[bot]` are also skipped automatically.

## Commit style

Commit messages tend to use one of these prefixes; we don't enforce this with a
hook today, so treat the list as a reference rather than a rule:

```
ui: add Tooltip component
shipit: tighten EntityListRow ref typing
icons: add bell.svg
tokens: tighten radius scale
docs: explain @theme bridge
chore: bump turbo
```

## When you should NOT add a changeset

- Editing files under `apps/docs/` or `docs/`.
- Editing root config files (eslint, prettier, turbo, CI, tsconfig presets).
- Tests-only changes that don't affect published output.

The Changesets `ignore` config already excludes these paths, but be deliberate —
every changeset triggers a version bump. (Note: the `ignore` list in
`.changeset/config.json` uses package `name` values from each package.json, not
filesystem paths.)

## Got stuck?

Open a draft PR with the `help wanted` label, or file an issue describing
what you're trying to do and where you're stuck. Include a minimal repro and
the output of `pnpm typecheck && pnpm test 2>&1 | tail -50` if relevant.
