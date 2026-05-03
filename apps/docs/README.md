# apps/docs

Storybook 8 docs site for the `@ship-it-ui/*` packages.

Stories live next to each component in the source packages
(`packages/*/src/**/*.stories.tsx`); this app just orchestrates the
build — `.storybook/main.ts` globs the workspace for `*.stories.tsx`
and Storybook serves them.

## Local

From the repo root:

```bash
pnpm dev    # opens Storybook at http://localhost:6006
```

`pnpm dev` is wired through Turbo, so changes to any `packages/*` source
file hot-reload the playground.

## Build

```bash
pnpm --filter docs build      # static export to apps/docs/storybook-static/
```

## Deployment

`.github/workflows/pages.yml` deploys this Storybook to GitHub Pages on
every push to `main`. The PR build runs the same `storybook build` without
deploying so regressions surface in CI.

## Why this is a separate app

Keeping Storybook out of the publishable packages means the `@ship-it-ui/*`
tarballs stay lean — consumers don't pay for Storybook deps in their
`node_modules`. The `apps/docs` package is `private: true` and excluded
from version bumps via `.changeset/config.json`.
