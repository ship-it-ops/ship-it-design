# Changesets

This folder holds [Changesets](https://github.com/changesets/changesets) — small markdown
files that describe the version bumps and changelog entries for each PR.

## Adding a changeset

```bash
pnpm changeset
```

The CLI will prompt you for:

1. Which packages changed.
2. Whether each change is a `patch`, `minor`, or `major` bump (semver).
3. A short summary that becomes the changelog entry.

Commit the generated `.changeset/*.md` file alongside your PR. When the PR merges to
`main`, the release workflow opens a "Version Packages" PR that bumps versions and
publishes to npm.
