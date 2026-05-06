# Contributing

## Local setup

```bash
nvm use                 # Node 24 (per .nvmrc)
corepack enable         # ensures the right pnpm version
pnpm install
pnpm dev                # docs site at http://localhost:3000 + tsup --watch per lib
```

For most component work, `pnpm --filter docs-site dev` is enough — the docs
site imports workspace `src/` directly via Next.js `transpilePackages`, so the
lib watchers are only useful when you want to test consumer-style imports
against the built `dist/`.

## Editing or adding components

Every component on this site is its own canonical source of documentation —
treat the docs surface as part of the component's contract, not a follow-up.

### Adding a new component

1. Build the component itself. The full walkthrough is in
   [`adding-a-component.md`](./adding-a-component.md).
2. **Add example files**, one per variant / state / behavior, at
   `apps/docs-site/examples/<kebab>/<name>.tsx`. Each file default-exports a
   single React component named `Example`. Keep them small and self-contained
   (no shared helpers across files unless absolutely necessary — the
   "Code" tab on the docs page shows the file verbatim, so noise hurts).
3. **Add the docs page** at
   `apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx`. Mirror the shape
   any existing page uses — for example, `app/(docs)/components/button/page.mdx`:

   ````mdx
   # Foo

   Two-line summary of what this is and when to reach for it.

   <LivePreview example="foo/default" />

   ## Variants

   <LivePreview example="foo/secondary" />

   ## Sizes

   <LivePreview example="foo/sizes" />

   ## Props

   <PropsTable component="Foo" />

   ## Accessibility

   - Keyboard semantics covered.
   - aria-* contracts callouts.

   <EditOnGithub source="apps/docs-site/app/(docs)/components/foo/page.mdx" />
   ````

4. **Register the page** in `apps/docs-site/content/navigation.ts` under the
   matching section/group. The sidebar is filesystem-agnostic — a `page.mdx`
   that isn't listed here is unreachable.
5. **Verify locally:**
   ```bash
   pnpm --filter docs-site dev
   # Visit http://localhost:3000/<section>/<kebab>
   ```
   Confirm: live preview renders, the Code tab shows your example file
   verbatim, the props table is populated (it's auto-generated from
   `react-docgen-typescript`, so the JSDoc on each prop becomes the
   description), and the page survives a theme toggle in light + dark.

### Editing an existing component

1. Make the implementation change.
2. **If the public API changed** (added/removed/renamed props, new variant,
   different default, behavior change):
   - Add or update an `examples/<kebab>/*.tsx` file demonstrating the new
     surface. New variant → new example. Removed variant → delete its example
     and remove the `<LivePreview>` from the MDX.
   - Update the relevant section of `app/(docs)/.../<kebab>/page.mdx` —
     intro, accessibility notes, and any prose describing behavior.
   - The `<PropsTable>` regenerates automatically from docgen, so prop
     additions/removals show up without further edits as long as the JSDoc
     above each prop is current.
3. **If only internals or styling changed**, you can usually leave the docs
   alone. If a visual story changes meaningfully (e.g., loading spinner
   replaced with a different glyph), a screenshot in the PR is enough — the
   live preview will show the new behavior.

The PR template has a checklist that mirrors this. Tick the boxes honestly:
reviewers will block on a missing `<LivePreview>` for a new variant.

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
5. **Open the PR**. CI runs format → lint → typecheck → test → build.
6. **Review** — at least one approval; CI green; no a11y regressions.
7. **Merge** — squash merges only. The release workflow takes it from there.

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

- Editing files under `apps/docs-site/` or `docs/`.
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
