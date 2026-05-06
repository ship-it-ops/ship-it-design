## Summary

<!-- One-sentence description of what this PR does and why. -->

## Type of change

- [ ] New component / pattern / hook
- [ ] Bug fix
- [ ] Refactor
- [ ] Token / theming change
- [ ] CI / build / docs only
- [ ] Breaking change

## Linked changeset

- [ ] I added a `.changeset/*.md` file (or this PR is docs/CI-only and the `no-changeset` label applies)

## Docs + examples

<!--
Required when this PR adds, removes, renames, or changes the props/behavior
of any component, pattern, hook, or token. Tick "N/A" only for true
internals (CI, build scripts, repo plumbing, internal-only refactors that
don't change public API or visible output).
-->

- [ ] **Examples** — `apps/docs-site/examples/<kebab>/*.tsx` covers each new variant / state / behavior
- [ ] **Docs page** — `apps/docs-site/app/(docs)/<section>/<kebab>/page.mdx` exists with `<LivePreview>` per example, `<PropsTable>`, and any a11y / behavior notes
- [ ] **Sidebar** — entry added/updated in `apps/docs-site/content/navigation.ts`
- [ ] **PropsTable** renders correctly (verified locally — `pnpm --filter docs-site dev` and visit the new page)
- [ ] N/A — this PR does not affect any documented surface

## Test plan

<!-- How did you verify this works? Include the URL of the docs page you previewed, if applicable. -->

## Notes for reviewers

<!-- Anything reviewers should pay extra attention to. Optional. -->
