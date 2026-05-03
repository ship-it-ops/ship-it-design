# DevOps — audit findings

## Verdict

The pipeline is broadly sane and ahead of most one-person design systems: changesets-driven release with `--provenance` (OIDC wired correctly via `id-token: write` on both `release.yml` and `snapshot.yml`), label-driven snapshots, a Claude review gate keyed off `needs:`, and a least-privileged top-level `permissions: contents: read` block in `ci.yml`. **No P0 blockers**, but there is real production risk in the bulk of GitHub Actions pinned to **floating major tags** — `actions/checkout@v5`, `actions/cache@v5`, `actions/setup-node@v6`, `pnpm/action-setup@v5`, `actions/upload-artifact@v7`, `changesets/action@v1`, `anthropics/claude-code-action@v1`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`, and `actions/github-script@v7`/`v9`. Several of those run with `id-token: write` and `NPM_TOKEN` in env, which is exactly the supply-chain shape that a `tj-actions/changed-files`-style hijack exploits. The Turbo cache strategy is also broken in a subtle, expensive way (key uses `github.sha`, so it never restores from a prior run) and there is no Dependabot/Renovate at all. Pages deploy + tsup builds + `.npmrc` look correct. The `coverage/` directory under `packages/ui/` is _not_ committed (gitignore catches it) — false alarm from the starter signals — same for `.pnpm-store/` and `.turbo/`.

## P0 — blockers

_None._

## P1 — high priority

- **Every third-party action pinned to a floating major tag, including release-critical ones** — `.github/workflows/release.yml:70`, `.github/workflows/snapshot.yml:81`, `.github/actions/setup/action.yml:17`, `.github/actions/setup/action.yml:20`, `.github/workflows/ci.yml:172`, `.github/workflows/pages.yml:71`, `.github/workflows/pages.yml:85`
  - What: `changesets/action@v1`, `pnpm/action-setup@v5`, `actions/setup-node@v6`, `anthropics/claude-code-action@v1`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`, `actions/github-script@v7` and `@v9` all resolve to whatever the maintainer last force-pushed onto the major tag.
  - Why it matters: `release.yml` runs `changesets/action@v1` with `id-token: write`, `NPM_TOKEN`, and `GITHUB_TOKEN` (write) in env — `release.yml:84-88`. `snapshot.yml` does the same plus writes `~/.npmrc` with `NPM_TOKEN` — `snapshot.yml:48-51`. A compromised major tag (the `tj-actions/changed-files` 2025 incident) on any of these would publish a tampered tarball signed with this repo's provenance attestation, or exfiltrate `NPM_TOKEN`. GitHub's own published guidance is to pin third-party actions to commit SHAs.
  - Fix: pin every third-party action (everything not under `actions/*` ownership, and arguably even those) to a full 40-char commit SHA with the version comment, e.g. `uses: changesets/action@aba318e9165b45b7948c60273e0b72fce0a64eb9 # v1.5.3`. Let Dependabot bump them.

- **Turbo cache key uses `github.sha`, defeating cross-run cache reuse** — `.github/workflows/ci.yml:46`, `.github/workflows/ci.yml:65`, `.github/workflows/release.yml:35`
  - What: `key: turbo-lint-${{ runner.os }}-${{ github.sha }}` only matches the exact commit. The `restore-keys` fallback (`turbo-lint-${{ runner.os }}-`) does pull the most recent prefix, so warm restores _do_ happen — but every successful run also writes a brand-new cache entry keyed by SHA that nothing will ever match again. GitHub Actions' cache is capped at 10 GB per repo with LRU eviction, and these caches contain `.turbo/` for every CI run.
  - Why it matters: cache thrash. After enough runs you're blowing your own warm caches out of LRU. Builds slow, costs rise.
  - Fix: key on something that actually repeats — e.g. `${{ hashFiles('pnpm-lock.yaml', 'turbo.json') }}` — or drop the per-job cache step and let `actions/setup-node@v6 with: cache: pnpm` (already in the composite) plus Turbo's content hashing carry the load. Better yet, wire up Turbo Remote Cache (Vercel free tier or self-hosted) since the current pnpm-store cache via `setup-node` only covers npm install, not the actual task outputs.

- **No Dependabot or Renovate config** — repo root
  - What: `.github/` has no `dependabot.yml`. No `renovate.json` at root.
  - Why it matters: Storybook is on a 10.x beta train, Tailwind on a v4 beta, every action is on a floating major (see above). Without bot bumps, security advisories and patch CVEs (and the action SHAs once you pin them) will not surface in PRs.
  - Fix: add `.github/dependabot.yml` with at minimum `package-ecosystem: github-actions` (weekly) and `package-ecosystem: npm` (weekly, grouped by minor/patch). Group patch updates so PR volume stays sane.

- **`release.yml` validate job re-runs full CI but still calls `changesets/action` even if validate-only succeeds twice** — `.github/workflows/release.yml:25-52`
  - What: `validate` runs format + lint + typecheck + test + build on every push to main. `release` job (`needs: validate`) then runs `pnpm build --filter='./packages/*'` _again_ before invoking `changesets/action`, which itself runs the `release` script (`turbo run build --filter='./packages/*' && changeset publish` — `package.json:25`). So packages are built three times on every main push (validate, release.yml line 66, changesets publish step).
  - Why it matters: ~3x compute cost per main push for no signal gain.
  - Fix: drop the explicit `pnpm build --filter='./packages/*'` step from the release job — `pnpm release` already builds. Or drop it from the `release` script. Pick one place.

- **No matrix strategy + no Node compatibility check** — `.github/workflows/ci.yml:31`, etc.
  - What: every job hardcodes `runs-on: ubuntu-latest` with one Node version (24, via `.nvmrc`).
  - Why it matters: the package ships `peerDependencies.react: "^18.0.0 || ^19.0.0"` and `engines.node: ">=24.0.0"` claims compatibility, but CI never proves it — Node 20 LTS is the most common consumer runtime today, and React 19 paths are likewise untested. The README also _still says_ "Node 20 LTS" (`README.md:47`) while everything else says 24, so the inconsistency is real.
  - Fix: small matrix on `verify`: `node: [20, 22, 24]` × `react: [18, 19]`, or at minimum publish a `engines` value that matches what CI actually exercises (CI proves Node 24 only — drop `>=24.0.0` to `>=20` only after CI covers it, or fix README).

- **Snapshot publish writes `_authToken` to `~/.npmrc` under `NPM_TOKEN` env, then re-passes `NPM_TOKEN` and `NPM_CONFIG_PROVENANCE` to the publish step** — `.github/workflows/snapshot.yml:48-78`
  - What: two-step auth — first `echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc`, then env var on publish. The shell echo is fine (no `set -x`) but the redundant token plumbing is asymmetric vs `release.yml`, which only uses env vars and lets `changesets/action` handle auth.
  - Why it matters: divergent paths are bug surface; if one is updated for a token-rotation event the other will break silently. Also the explicit `~/.npmrc` write happens _before_ the build — if any malicious build script reads `~/.npmrc`, it sees the token in plain text on disk.
  - Fix: drop the explicit `~/.npmrc` write. `pnpm publish` honors `NPM_TOKEN` via npm's `_authToken` env interpolation when paired with `npm_config_//registry.npmjs.org/:_authToken=${NPM_TOKEN}`, or use `actions/setup-node@v6` with `registry-url` and `always-auth` to do this declaratively (consistent with `release.yml`).

- **`format` and `lint` jobs in `ci.yml` run `pnpm install` from scratch with no Turbo benefit** — `.github/workflows/ci.yml:29-49`
  - What: Three separate jobs (`format`, `lint`, `verify`) each run the composite `setup` action, which does a full `pnpm install --frozen-lockfile` from cold cache (well, from `setup-node`'s pnpm cache, but still re-links `node_modules`). With Storybook + Tailwind + every Radix package, that's 3 cold installs per PR.
  - Why it matters: PR feedback latency. The `format` job runs `prettier --check` on ~the whole repo and finishes in seconds, but spends 60-90s installing first.
  - Fix: collapse `format` and `lint` into a single `quick-checks` job, or use `actions/cache` keyed on `pnpm-lock.yaml` to cache `node_modules` across jobs and skip install on hit.

- **`changeset-check.yml` uses `pull_request: types: [labeled, unlabeled]` — runs the install + status check on every label add/remove** — `.github/workflows/changeset-check.yml:5`
  - What: every time someone tags `release: snapshot` or `skip-claude` or anything else, this whole workflow spins up a runner.
  - Why it matters: noise in Actions usage and run history. The check is only useful on `opened`/`synchronize`/`reopened` plus the two label events that actually matter (`no-changeset` add/remove).
  - Fix: keep the `labeled`/`unlabeled` triggers but add an `if:` guard checking `github.event.label.name == 'no-changeset'` for those events.

- **`pages.yml` PR build runs the full Storybook build but never errors if `storybook-static` is empty** — `.github/workflows/pages.yml:69-73`
  - What: PR builds skip `upload-pages-artifact` (correct), but they also skip any verification step — there is no equivalent to `if-no-files-found: error` on the PR side. A regression that produces an empty `storybook-static` would pass PR CI silently and only fail the deploy on main.
  - Fix: add a quick `ls apps/docs/storybook-static/index.html` (or a head-of-file check) on PR builds to fail fast.

## P2 — medium

- **`packages/ui/tsup.config.ts:11` externalizes only `react` and `react-dom`** — `.github/workflows/...` (config: `packages/ui/tsup.config.ts:11`)
  - What: `external: ['react', 'react-dom']`. All `@radix-ui/*` and `@fontsource-variable/*` deps end up bundled into `dist/index.js` / `index.cjs`.
  - Why it matters: every consumer who installs `@ship-it-ui/ui` also has the Radix packages as transitive deps anyway (they're `dependencies`, not peer deps — which is correct for non-peer-dep design choice), but bundling them duplicates code if the consumer also installs Radix directly (common for custom dialogs, etc.). It also defeats Radix's own treeshake of unused subpaths and makes the ui bundle larger.
  - Fix: either externalize `/^@radix-ui\//` and `/^@fontsource-variable\//` (regex pattern) so consumers dedupe, or add a build-size budget check. The current shape isn't broken, but the audit prompt flagged it as expected.

- **`packages/icons/tsup.config.ts:11` does not externalize anything React-adjacent that isn't `react`/`react-dom`** — `packages/icons/tsup.config.ts:11`
  - Same shape; only `react`/`react-dom`. Fine for icons because there are no other deps.

- **`turbo.json` declares every task `dependsOn: ["^build"]` including `lint` and `typecheck`** — `turbo.json:13-21`
  - What: `lint`, `typecheck`, `test` all wait for upstream packages to `build`. This is intentional per `ci.yml:51-54` ("turbo already parallelizes within a job and the tasks share `^build` dependencies"), but it means a one-line typo in `packages/tokens/src/colors.ts` blocks `packages/ui` typecheck on the dist regenerating.
  - Why it matters: only relevant when ESM source resolution would work (i.e., consumers reach into `src/`). For typecheck specifically, `tsc` follows TS path mappings — if those existed at the workspace level you could drop `^build` from `typecheck`. Currently no `paths` in `tsconfig.json`, so the `dist`-based resolution is necessary; intent verified, finding is informational only.
  - Fix: long-term, add TypeScript project references or `paths` mappings so `typecheck` and `lint` can drop the `^build` dep. ~5-10x speedup on those tasks.

- **`turbo.json:21` lists `coverage/**`and`storybook-static/**`as outputs of`test`** — `turbo.json:21`
  - What: `storybook-static/**` is an output of `apps/docs`'s `test` script (`storybook build --test -o storybook-static` per `apps/docs/package.json:12`), but it's _also_ already an output of `build`. Listing it under both means `test` cache invalidations stomp `build` cache outputs and vice versa.
  - Fix: limit `test` outputs to `coverage/**` only.

- **Turbo cache `inputs` field unset everywhere** — `turbo.json:5-26`
  - What: no `inputs` arrays declared, so Turbo uses its default (everything in the package). Test runs invalidate on README edits, etc.
  - Fix: per-task `inputs` for `test` and `lint` would let docs / storybook / unrelated file changes hit cache.

- **`release.yml:25-52` validate job duplicates the entire `ci.yml` flow** — `.github/workflows/release.yml:25`
  - What: comment at `release.yml:21-24` defends this as "re-validate even if someone disabled CI required-checks", which is fair, but it's a literal copy. If `ci.yml`'s steps drift (e.g. add a new `pnpm i18n:check`), the validate gate quietly stops mirroring CI.
  - Fix: extract the step list into a shared composite action (`.github/actions/validate-all/action.yml`) and have both `ci.yml` `verify` and `release.yml` `validate` consume it.

- **No Codecov / coverage upload step** — `.github/workflows/ci.yml:73`
  - What: `pnpm test` produces `coverage/**` (configured in every package's `vitest.config.ts`, with 80% thresholds in `packages/ui/vitest.config.ts:19-24`), but the only thing that happens to it is local disk. CI artifact upload only covers Storybook + dists.
  - Fix: either upload `packages/*/coverage` as an artifact (cheap), or wire up `codecov/codecov-action` (pin to SHA), or at least surface coverage as a job summary via a `vitest-coverage-report-action`.

- **`packages/ui` has `coverage/` on disk locally with 1MB of HTML** — `packages/ui/coverage/`
  - What: not committed (`git check-ignore` confirms `.gitignore:12` matches), but it's there from a local test run. Just noting it because the starter signals flagged it.

- **Snapshot tag default for non-PR runs is `snapshot` but README says `0.0.0-snap-*` and uses tag `snap`** — `.github/workflows/snapshot.yml:64`, `README.md:84`
  - What: workflow's manual-dispatch default tag is `snapshot`, README claims `snap`. Either is fine, they don't match.
  - Fix: bring them into agreement. PIPELINES.md (`.github/PIPELINES.md:74`) uses `0.0.0-pr-42-...` form, which matches the workflow. README is the outlier.

- **`packageManager: pnpm@9.12.0` in root but composite action has no `version:` input on `pnpm/action-setup@v5`** — `.github/actions/setup/action.yml:16`
  - What: `pnpm/action-setup@v5` reads `packageManager` from `package.json` automatically (this is its modern default), so it does pick up 9.12.0. Verify this by running CI; the failure mode if the auto-detection ever breaks is silent fallback to whatever the action defaults to.
  - Fix: explicit pin: `with: { version: 9.12.0 }`. Belt and suspenders.

- **No `pnpm audit` step or `pnpm dedupe` enforcement** — root
  - What: no scheduled `pnpm audit` job; no check that the lockfile is deduped.
  - Fix: weekly cron workflow that runs `pnpm audit --prod --audit-level=high` and `pnpm dedupe --check`.

- **`PIPELINES.md` says "three GitHub Actions workflows plus a shared composite action" but there are six workflows** — `.github/PIPELINES.md:1-4`, `.github/PIPELINES.md:14`
  - What: the topology table lists four (`ci`, `changeset-check`, `snapshot`, `release`) and the prose says "three". `claude.yml` and `pages.yml` are nowhere in `PIPELINES.md`.
  - Why it matters: anyone reading `PIPELINES.md` to understand the release surface will miss two workflows that talk to the npm registry (snapshot) and to GitHub Pages.
  - Fix: update the count and the table.

## P3 — nits

- **`.npmrc:18-22` duplicates the `public-hoist-pattern[]=*storybook*` and `@storybook/*` lines** — `.npmrc:14-22`
  - What: same two patterns appear twice with two different comment blocks. Harmless (pnpm dedupes), just noise.

- **`ci.yml:25` comment says "Tell turbo to write its local cache somewhere actions/cache can pick up" but no env variable actually does that** — `.github/workflows/ci.yml:23-25`
  - What: only `TURBO_TELEMETRY_DISABLED='1'` is set. The comment is a leftover from a different intent.

- **`claude.yml:21` `cancel-in-progress: false` is correct (don't kill an in-flight Claude run on a new comment) but the group key uses `github.run_id` as a fallback which is per-run-unique — so the concurrency group is effectively per-run** — `.github/workflows/claude.yml:19-21`
  - What: minor — it does the right thing for `issue_comment` and `pull_request_review_comment` (both have an issue/PR number); the `github.run_id` only kicks in for events that don't have either, in which case "concurrency group of 1" is fine.

- **`snapshot.yml:81` uses `actions/github-script@v7` while `ci.yml:147` uses `actions/github-script@v9`** — version drift inside one repo. Pin both to the same SHA.

- **README `Tech stack` table claim "Node 20 LTS" contradicts `.nvmrc: 24` and `engines.node: >=24.0.0`** — `README.md:47`, `.nvmrc:1`, `package.json:9`. Already noted in starter signals; verified.

- **`ignore: ["docs"]` in `.changeset/config.json` ignores by package _name_ ("docs" matches `apps/docs/package.json:2`)** — `.changeset/config.json:10`. Correct, but if anyone ever renames the docs app the ignore silently stops working. A comment would help.

- **`packages/eslint-config` and `packages/tsconfig` both have `version: 0.0.1` and a `CHANGELOG.md` even though they're `private: true`** — `packages/eslint-config/package.json:3-4`, `packages/tsconfig/package.json:3-4`. Harmless; changesets honors the `private` flag and won't try to publish them. The CHANGELOG comes from `chore(release): version packages` flow.

- **No SBOM generation or signed checksums for tarballs** — `release.yml`. npm `--provenance` covers attestation already; this is a "nice to have" not a finding.

- **`ci.yml:80-98` artifact retention is 14 days** — could be longer for `package-dists` to enable post-hoc dist-shape comparisons, but 14 days is fine for a fast-moving design system.

## Out of scope / not assessed

- TypeScript correctness of the build outputs (SE persona)
- Test depth and quality of the `vitest-axe` assertions (SE / A11y persona)
- Storybook content / story coverage (UI-UX persona)
- ARIA correctness of components in `dist` (A11y persona)
- React perf, SSR-safety of the bundled output (Frontend persona)
- README accuracy beyond CI-related claims (PM persona — flagged the Node 20 vs 24 mismatch only because it intersects with `setup-node`)
- Tailwind v4 beta CI risk: Tailwind is installed as a `^4.0.0-beta.3` dep — caret on a pre-release does range-resolve; not a DevOps issue, just noting it for the FE persona.
