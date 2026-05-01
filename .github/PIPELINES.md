# CI / Release pipelines

How `@ship-it/*` is verified and shipped. Three GitHub Actions workflows plus
a shared composite action.

## Topology

| Workflow              | Trigger                                         | What it does                                                                                                                                                           |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`              | every PR + push to `main`                       | Format, lint, typecheck, test, build, upload Storybook + dist artifacts.                                                                                               |
| `changeset-check.yml` | PRs (label-aware)                               | Fails the PR if `packages/*` changed without an accompanying `.changeset/*.md`.                                                                                        |
| `snapshot.yml`        | PR label `release: snapshot` or manual dispatch | Publishes a one-off `pr-N` build to npm (with provenance) and comments the install command on the PR.                                                                  |
| `release.yml`         | push to `main`                                  | Opens / updates the "Version Packages" PR. When that PR merges, publishes every bumped package to npm (with provenance), pushes git tags, and creates GitHub releases. |

All four share `.github/actions/setup/action.yml` for pnpm + Node + install,
so the pnpm and Node versions live in exactly two places (the action and
`.nvmrc`).

## Required secrets

Configure these once at the repo (or org) level under
**Settings → Secrets and variables → Actions**:

| Secret         | When               | Notes                                                           |
| -------------- | ------------------ | --------------------------------------------------------------- |
| `NPM_TOKEN`    | release + snapshot | Automation token from npm with publish rights for `@ship-it/*`. |
| `GITHUB_TOKEN` | release            | Auto-provided by Actions. No setup.                             |

The `id-token: write` permission is granted in the workflows that publish so
npm provenance can sign each tarball with the workflow's OIDC token. No extra
secret needed.

## Local equivalents

Anything CI does, you can run locally to triage a failure before pushing:

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm changeset status --since=origin/main   # mirrors the changeset gate
```

## Adding a changeset

```bash
pnpm changeset
```

Pick the affected packages, the bump (`patch` / `minor` / `major`), and a
short summary. The generated file lands in `.changeset/`; commit it with
your PR. The `changeset-check` job blocks merges that touch `packages/*`
without one.

**Skipping the gate.** Apply the `no-changeset` label on PRs that don't ship
(refactors confined to internal tooling, CI changes, doc-only edits). The
gate honors the label.

## Cutting a snapshot release

Want consumers to try a PR before it merges?

- **Easy path:** add the `release: snapshot` label to the PR. The
  `snapshot.yml` workflow publishes every package with a pending changeset
  under the `pr-<number>` dist-tag and comments the install command back on
  the PR.
- **Manual path:** Actions → "Snapshot release" → Run workflow. Optionally
  pass a custom tag.

Snapshots use versions like `0.0.0-pr-42-20260430120000` and **never**
overwrite `latest`. They're purely opt-in via dist-tag.

```bash
pnpm add @ship-it/ui@pr-42
```

## Releasing to `latest`

The release workflow is fully automated. The flow:

1. Author lands changesets via PRs to `main`.
2. `release.yml` watches `main`. As soon as one or more `.changeset/*.md`
   files exist on `main`, it opens a **"Version Packages"** PR. That PR
   bumps versions, regenerates `CHANGELOG.md` files, and deletes the
   consumed changesets.
3. Reviewers approve and merge the Version Packages PR.
4. The next `release.yml` run sees no pending changesets but does see new
   versions; it runs `pnpm release` (build + `changeset publish`), which:
   - Publishes each bumped package to npm with `--provenance`.
   - Pushes a git tag per published package.
   - Opens a GitHub release per published package, sourced from CHANGELOG.

A **"Released the following packages"** summary is appended to the workflow
run for quick verification.

## Provenance + access

- **Provenance**: enforced two ways. The workflows set
  `NPM_CONFIG_PROVENANCE=true` and each `package.json` declares
  `"publishConfig": { "provenance": true }`.
- **Access**: scoped npm packages default to private. We pin `public` in two
  places (`.changeset/config.json` and per-package `publishConfig.access`)
  so a misconfiguration in one location can't cause a private-by-accident
  publish.

## Ignored packages

`apps/docs` is the Storybook deployment target — never published to npm.
It's listed in `.changeset/config.json`'s `ignore` array. Anything else
under `apps/` should follow the same pattern.

`@ship-it/eslint-config` and `@ship-it/tsconfig` are workspace-internal and
not currently set up for publish; mark them `private: true` if that ever
needs enforcing.
