# Changesets

Each `.md` file in this directory describes a future version bump for one
or more `@ship-it-ui/*` packages. The release workflow consumes them on
the next merge to `main`.

## Adding one

```bash
pnpm changeset
```

The interactive CLI walks you through:

1. Which packages your change touches.
2. The bump level for each — `patch` / `minor` / `major` per
   [semver](https://semver.org/).
3. A short summary that becomes the changelog entry on npm and in the
   per-package `CHANGELOG.md`.

Commit the generated `.changeset/*.md` alongside your code change. The
`changeset-check` workflow fails any PR that touches `packages/*` source
without a matching changeset.

## What's ignored from version bumps

Configured in `.changeset/config.json`:

- **`apps/docs`** — the Storybook deployment target, never published to
  npm. Listed in the `ignore` array by package `name`.
- **`@ship-it-ui/eslint-config`** and **`@ship-it-ui/tsconfig`** — these
  are workspace-internal (`private: true`) and never published, so
  Changesets honors the `private` flag automatically.

There are currently no `fixed` or `linked` package sets — every
publishable package versions independently.

See [`docs/contributing.md`](../docs/contributing.md) for the full PR +
changeset flow, and the
[Changesets docs](https://github.com/changesets/changesets) for advanced
usage.
