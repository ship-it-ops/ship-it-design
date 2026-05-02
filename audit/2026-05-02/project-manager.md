# Project Manager — audit findings

## Verdict

The doc set is impressively complete for a 0.0.1 system — `architecture.md`, `adding-a-component.md`, `design-handoff.md`, `contributing.md`, per-package READMEs, and a CI-pipeline doc all exist and are well-written. But several of those docs lie about what the code actually does, and the GitHub-side governance surface (security policy, issue/PR templates, CODEOWNERS, code of conduct, dependabot) is essentially empty for a publicly-published, MIT-licensed library. The four publishable packages also ship to npm without `homepage`, `bugs`, `keywords`, `author`, or `funding` fields — discoverability and contribution paths are missing right where contributors will look. Three doc errors actively mislead readers: the `architecture.md` install table promises that `ui` peer-depends on `tokens` (the package declares it as devDep — covered as P0 by SE/FE), the same doc claims `prefers-reduced-motion` "zeros the duration tokens automatically" (the A11y persona proved this is false because every `animate-[…_220ms_…]` hardcodes the literal duration), and `packages/icons/README.md` describes a build process — "SVGs → `src/components/<Name>Icon.tsx`" and "Rewrites `src/index.ts`" — that does not match the actual code (the generator writes `src/svg-icons.ts` and the example uses a `text-brand` Tailwind class that does not exist in this system). `PIPELINES.md` says "three GitHub Actions workflows" while the repo actually has six. The README's tech-stack table still says Node 20 LTS while the rest of the repo is Node 24. None of the publishable packages have a stated 1.0 milestone, a stability promise, or a deprecation policy — they're at `0.0.1` shipping under `--provenance` to public npm with `latest` dist-tag.

## P0 — blockers

- **No `SECURITY.md`** — `.github/`, repo root
  - What: a publicly-published, `provenance: true` library on npm has no security disclosure policy. `git ls-files | grep -i security` returns nothing. GitHub's "Security policy" tab links to a 404 page.
  - Why it matters: an external researcher who finds a CVE in `@ship-it-ui/ui` has nowhere to disclose it privately. Public-issue disclosure is a real risk for a library this many consumers will install. GitHub flags missing security policy as a community-standards score gap.
  - Fix: add `.github/SECURITY.md` with supported versions, a private contact (e.g. security@<org>), and the disclosure flow (PGP key optional but preferred). Reference [GitHub's template](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository).

- **`docs/architecture.md` falsely claims `prefers-reduced-motion` is automatic** — `docs/architecture.md:101`
  - What: "`prefers-reduced-motion: reduce` zeros the duration tokens automatically." This claim is functionally false — the A11y persona verified that the override only zeros `--duration-micro` and `--duration-step`, but every component animation hardcodes literal durations like `animate-[ship-dialog-in_180ms_…]` rather than reading the token. So no entrance/exit animation and no infinite spinner respects the user's reduced-motion preference.
  - Why it matters: a contributor reads the doc, assumes motion is handled, and ships new components without the per-animation override. The A11y P0 persists silently.
  - Fix: either fix the implementation (covered by A11y persona's P0) and keep the doc, or correct the doc to "tokens are zeroed; per-component animations must consume the duration tokens to opt in" until the implementation matches.

- **`docs/architecture.md` install table says `ui (+ tokens peer)` but the package.json declares tokens as devDep** — `docs/architecture.md:55-57`, `packages/ui/package.json:76`
  - What: the doc says installing `@ship-it-ui/ui` requires `@ship-it-ui/tokens` as a peer. The package's `peerDependencies` only lists `react`/`react-dom`. The `architecture.md` table is *intent-correct*; the package.json is *wrong* (covered as P0 by SE and FE).
  - Why it matters: a contributor following the doc adds `tokens` as a peer in their consuming app, then `pnpm install` works; another contributor reads the package.json and concludes tokens isn't required, then their CSS import breaks. Two equally-defensible-from-the-evidence contradictory mental models.
  - Fix: fix the package.json (per SE/FE persona). Keep the doc as-is.

- **`packages/icons/README.md` describes a build process that does not match the code** — `packages/icons/README.md:9-21`
  - What: README says "Reads every `.svg` from `src/svg/`, runs each through SVGR to produce a typed React component in `src/components/`, **rewrites `src/index.ts`** to re-export every generated component." The actual `index.ts` (`packages/icons/src/index.ts:14-25`) is hand-authored and exports `IconGlyph`, `glyphs`, `connectorGlyphs`, `resolveGlyph`, plus `export * from './svg-icons'`. The auto-generated file is `svg-icons.ts` (which the file's own header comment confirms: "AUTO-GENERATED by scripts/build.ts — do not edit by hand"), not `index.ts`. The README also contradicts itself by claiming `src/components/` holds generated files; `index.ts` actually re-exports from `./svg-icons`.
  - Why it matters: a contributor adding their first SVG runs `pnpm --filter @ship-it-ui/icons build` and watches their changes appear in `svg-icons.ts`, not where the README told them to look. The README also promises `pnpm add ArrowRightIcon` style imports but the example uses `className="text-brand size-4"` (`packages/icons/README.md:23`) — `text-brand` is not a Tailwind utility this system generates (the token is `accent`, not `brand` — see `packages/tokens/src/color.ts` and `packages/ui/src/styles/globals.css:54`). A new contributor will copy the example, get a Tailwind warning, and assume the system is broken.
  - Fix: rewrite the README's "How it works" section to match what `scripts/build.ts` actually does: SVGs land in `src/svg/`, generated React components are written to `src/components/<Name>.tsx`, `src/svg-icons.ts` (not `src/index.ts`) is rewritten to re-export them, and `src/index.ts` itself is hand-authored. Replace `text-brand` with `text-accent` (or a real semantic Ship-It token).

## P1 — high priority

- **No `pull_request_template.md`** — `.github/`
  - What: missing entirely. `docs/contributing.md:36` lists merge criteria ("at least one approval; CI green; no a11y regressions") and `docs/adding-a-component.md:131-147` provides a copy-pasteable PR checklist. Neither is auto-applied — every PR author has to copy the checklist by hand.
  - Why it matters: the canonical PR checklist exists in docs but PR authors who skip the doc never see it. Reviewers also have nothing to anchor expectations against. PR templates are how design-system maintainers enforce quality without policing every PR.
  - Fix: add `.github/pull_request_template.md` containing the `adding-a-component.md` component checklist, plus a "Type of change" radio-button list (component / pattern / hook / token / docs / chore) and a "Linked changeset" reminder.

- **No `.github/ISSUE_TEMPLATE/`** — `.github/`
  - What: no issue templates. Contributors filing a bug or component request have a blank textarea.
  - Why it matters: high-quality bug reports (repro, expected vs actual, env, package versions) are 10x more likely to come in when templates ask for them. Component-request issues need a different shape (use case, prior-art links, design references).
  - Fix: add at minimum `.github/ISSUE_TEMPLATE/bug_report.yml` (form-based) and `.github/ISSUE_TEMPLATE/component_request.yml`. Use `config.yml` to point general questions to a Discussion or Slack channel.

- **No `CODEOWNERS`** — `.github/`
  - What: no `.github/CODEOWNERS`. `docs/contributing.md:36` requires "at least one approval" but does not say from whom.
  - Why it matters: with 4 packages and ~50 components plus the docs site, ad-hoc reviewer assignment scales poorly. CODEOWNERS lets the org enforce review by area (e.g., `packages/tokens/ @design-team`, `packages/ui/components/ @ds-engineers`).
  - Fix: add `.github/CODEOWNERS` keyed by directory.

- **No `CODE_OF_CONDUCT.md`** — repo root or `.github/`
  - What: missing.
  - Why it matters: GitHub's community-standards checklist explicitly recommends one for public repos. Missing CoC is a small but visible "this isn't really meant for outside contribution" signal.
  - Fix: drop in the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) v2.1 with the org email.

- **All four publishable packages are missing `homepage`, `bugs`, `keywords`, `author`, `funding`** — `packages/{tokens,icons,ui,shipit}/package.json`
  - What: confirmed by reading all four. Each has `name`, `version`, `description`, `license`, `repository.directory` (good). None has `homepage` (npm shows package without a docs link), `bugs.url` (no "Report bug" button on npm), `keywords` (zero hits in npm search for "design system" / "react components" / "tokens" / "tailwind v4"), `author` or `maintainers`, or `funding`.
  - Why it matters: discoverability and contribution funnel. These packages will be invisible to anyone who isn't already linked to them.
  - Fix: add to each package.json:
    ```json
    "homepage": "https://ship-it-ops.github.io/ship-it-design/",
    "bugs": { "url": "https://github.com/ship-it-ops/ship-it-design/issues" },
    "keywords": ["design-system", "react", "tailwindcss", "radix-ui", "tokens", "shipit"],
    "author": "Ship-It Ops"
    ```
    (Use package-specific keywords too: `tokens` should add "design-tokens", `icons` should add "svgr".)

- **`packages/ui/README.md:54` example uses tokens that do not exist in the system** — `packages/ui/README.md:54`
  - What: "Always consume semantic tokens, never primitive ones. `bg-brand`, not `bg-indigo-600`." The system has no `--color-brand` token — the accent role is `--color-accent` (`packages/ui/src/styles/globals.css:54`). `bg-brand` is not a Tailwind utility this build generates.
  - Why it matters: example code fails. A new contributor copies the snippet, runs Tailwind, gets no class output, and concludes the styling system is broken.
  - Fix: replace `bg-brand` with `bg-accent`. Same fix to `packages/tokens/README.md:18` ("semantic aliases like `background`, `text`, `border`, `brand`" — actual names are `bg`, `text`, `border`, `accent`).

- **`packages/tokens/README.md:18` lists semantic alias names that do not match the code** — `packages/tokens/README.md:18`
  - What: "semantic aliases like `background`, `text`, `border`, `brand`." The actual semantic-token names are `bg`, `panel`, `panel-2`, `border`, `border-strong`, `text`, `text-muted`, `text-dim`, `accent`, `accent-text`, `accent-dim`, `accent-glow`, `ok`, `warn`, `err`, `purple`, `pink` (verified in `packages/ui/src/styles/globals.css:46-66` and `packages/tokens/src/color.ts`).
  - Why it matters: same as above — a contributor reads `background` and writes `bg-background`, gets nothing.
  - Fix: replace the list with the real names. Better: link to `globals.css`'s `@theme inline` block as the canonical inventory.

- **`packages/ui/README.md:18` documents a `primitives/` directory that is empty** — `packages/ui/README.md:18`, `packages/ui/src/primitives/`
  - What: README describes `primitives/` as "Thin wrappers over Radix when we want a Ship-It-flavored API." The directory exists but contains no files (verified by `ls`). Two other docs (`README.md:19`, `docs/architecture.md:109`) mention it too.
  - Why it matters: a contributor looks at `Button` and decides their thin Radix wrapper belongs in `primitives/`, then can't figure out what's already there to follow as a pattern.
  - Fix: either delete the empty directory (and remove the doc references) or populate it with one or two examples (a `Slot` re-export, a polymorphic `Box`).

- **README "Tech stack" table says "Node 20 LTS" but every other source says Node 24** — `README.md:47`, `.nvmrc:1`, `package.json:9`, `docs/contributing.md:6`
  - What: top-level README's tech-stack table claims `Node 20 LTS`. `.nvmrc` is `24`. `engines.node` is `>=24.0.0`. `docs/contributing.md:6` says `Node 24 (per .nvmrc)`. README's own "Getting started" section (`README.md:53`) says "Node 24 (per .nvmrc)". So the README contradicts itself within the same file.
  - Why it matters: contributors going from "what stack is this" to "set up locally" hit conflicting information in a 100-line README. The table is the outlier.
  - Fix: edit `README.md:47` to `Node 24 LTS-quality (per .nvmrc)`. Or — if Node 20 is actually fine (the SE persona noted nothing in source code requires Node 24) — relax `engines.node` to `>=20.6.0` and update the table to match.

- **`PIPELINES.md` says "Three GitHub Actions workflows" and lists four; there are six** — `.github/PIPELINES.md:3-4`, `.github/PIPELINES.md:7-13`
  - What: prose says three. Topology table lists four (`ci`, `changeset-check`, `snapshot`, `release`). Actual workflow count: six (`ci.yml`, `claude.yml`, `changeset-check.yml`, `pages.yml`, `release.yml`, `snapshot.yml`). `claude.yml` (Claude review) and `pages.yml` (docs deploy) are nowhere in `PIPELINES.md`.
  - Why it matters: if anyone uses `PIPELINES.md` to reason about what pipelines exist (e.g., before disabling one or rotating a token), they'll miss the two undocumented ones — including `pages.yml` which deploys the docs site to GitHub Pages.
  - Fix: rewrite the prose count and add `claude.yml` + `pages.yml` rows to the topology table. The DevOps persona also flagged this.

- **No 1.0 milestone, stability promise, or deprecation policy documented** — repo root, all docs
  - What: every publishable package is at `0.0.1`. `CONTRIBUTING.md` and `docs/contributing.md` cover the day-to-day flow but never address: when does this hit 1.0? What's the breakage policy at 0.x? When (and how loudly) is something deprecated before removal? Are types stable? Is the OKLCH accent knob a public API surface or internal?
  - Why it matters: consumers evaluating whether to adopt a 0.0.x library need to know the team's intent. Without it, they'll wait. With it, they can plan migrations.
  - Fix: add `docs/stability.md` (or a `## Stability` section to README) with: current pre-1.0 stance ("frequent breaking changes pre-1.0; semver after"), the criteria for 1.0 cut, deprecation cadence (one minor with `@deprecated` JSDoc + console warn → removal in next major), supported React/Node versions matrix.

- **No Dependabot or Renovate** — `.github/`
  - What: covered by DevOps persona as P1; flagging from the PM angle because it's a contributor-experience problem too. Without bot bumps, PRs that update one dep at a time pile up at the maintainer's desk.
  - Fix: cross-reference DevOps fix.

## P2 — medium

- **`CONTRIBUTING.md` is a thin pointer to `docs/contributing.md`** — `CONTRIBUTING.md:1-23`
  - What: GitHub looks for `CONTRIBUTING.md` at repo root and surfaces it from the "Contribute" tab. The file at root is a 5-line redirect plus a TL;DR. The real content is at `docs/contributing.md`.
  - Why it matters: defensible as a cleanliness choice but creates two-source maintenance. Either consolidate at root or keep root and remove from docs/.
  - Fix: pick one canonical location. If `docs/contributing.md` stays canonical, the root file is fine — just keep them in sync.

- **`CONTRIBUTING.md:21` and `docs/contributing.md:33-34` reference a "Claude PR review" without explaining the cost / authorization model** — `CONTRIBUTING.md:21`, `docs/contributing.md:33-34`
  - What: both docs say CI runs a Claude PR review. Neither says what that costs the project, who pays for it, or what to do if a contributor doesn't want their PR sent to a third-party LLM. (Some contributors have legitimate IP/employer-confidentiality concerns.)
  - Why it matters: contributor friction; potential surprise.
  - Fix: brief note: "PRs are reviewed by Claude (Anthropic) using the org's API key. Apply `skip-claude` if you'd prefer not to send your diff. The review is a suggestion; merge decisions still rest with human reviewers."

- **`docs/architecture.md:101` reduced-motion claim covered as P0; the same doc's "Why four packages, not one?" section is solid and could be cited from the per-package READMEs** — `docs/architecture.md:35-58`
  - What: each per-package README mentions its scope but doesn't link the `architecture.md` "Why four packages" rationale.
  - Fix: add a short "How this fits in" link in each per-package README pointing at `docs/architecture.md`.

- **`docs/contributing.md:36` says "no a11y regressions" as a merge criterion but the only enforcement is per-component `vitest-axe`** — `docs/contributing.md:36`
  - What: `vitest-axe` runs against rendered DOM in unit tests, but several components ship without an `axe()` assertion (the A11y persona found Drawer/Sheet specifically; the broader sweep found 54/56 coverage). There is no Storybook a11y CI gate, no Chromatic visual-regression gate, no axe-against-stories run.
  - Why it matters: doc promises something the CI doesn't enforce.
  - Fix: either add a CI step that fails if any new component lacks an axe assertion (script greps for `expect(await axe(` in every `*.test.tsx` and fails when missing), or weaken the doc to "axe checks pass on changed components".

- **No npm `keywords` for any publishable package** — already P1, restated in P2 because it has a discoverability angle worth measuring
  - Fix: see P1.

- **No `apps/docs/README.md`** — `apps/docs/`
  - What: the Storybook docs app has no README. A contributor working on the docs site has nothing to read first.
  - Fix: brief one-pager: "Storybook 8 docs site for `@ship-it-ui/*`. `pnpm dev` from the repo root opens this on :6006. Stories live in each package's source tree (`packages/*/src/**/*.stories.tsx`)."

- **`.changeset/README.md` is the default boilerplate** — `.changeset/README.md`
  - What: default Changesets-cli boilerplate.
  - Why it matters: not actively wrong, but the doc could note this repo's specific conventions (which packages auto-bump together, what the `ignore: ["docs"]` line means).
  - Fix: customize to ~10 lines: "Each `.md` file is consumed on release; `apps/docs` is excluded from version bumps; no fixed/linked sets currently. See `docs/contributing.md` for when to add one."

- **`docs/design-handoff.md` references `colorPrimitive` / `colorSemanticLight` / `colorSemanticDark` token export names** — `docs/design-handoff.md:33-37`, `packages/tokens/src/color.ts`
  - What: the doc names exports the tokens module exposes. Quick sanity check by looking at the tokens public API will tell us if these names are stable. (Did not deep-read color.ts in this audit; flagging for verification.)
  - Fix: confirm names; otherwise rename.

- **No funding hook (`.github/FUNDING.yml`)** — `.github/`
  - What: optional but adds a "Sponsor" button to the repo if relevant.
  - Fix: skip or add per org policy.

## P3 — nits

- **Each per-package `CHANGELOG.md` only has the boilerplate Changesets header** — `packages/*/CHANGELOG.md`
  - What: nothing released yet, so this is correct. Just noting that the changelogs will start populating after the first non-pre release.

- **`LICENSE` says "Copyright (c) 2026 ship-it-ops"** — `LICENSE:3`
  - Fine. (Year is correct for a 2026 project.)

- **`docs/contributing.md:50-58` "Commit style" lists `ui:`/`shipit:`/`icons:`/`tokens:`/`docs:`/`chore:` prefixes — but recent commits use `chore(release):`, `Rename`, `rename packages`, `Fix docs build`** — `docs/contributing.md:50-58`, `git log --oneline -5`
  - What: the documented prefix style is largely ignored by the recent commit history. The doc is aspirational; the practice has been ad-hoc.
  - Fix: either enforce via commit-msg hook (commitlint) or relax the doc.

- **`docs/contributing.md:36` "squash merges only"** — `docs/contributing.md:37`
  - What: documented as a rule but no enforcement (no branch-protection-as-code in the repo).
  - Fix: enable squash-only in repo settings (out of band) and note in docs that protection is enforced repo-side.

- **`packages/icons/README.md:23` example uses Tailwind class `text-brand size-4`** — `packages/icons/README.md:23`
  - Already in P0 (`text-brand` doesn't exist). `size-4` is a Tailwind 4.x utility — fine for this system.

- **`docs/architecture.md:38-49` "Why four packages, not one?" rationale is excellent — keep it; no fix**

- **`docs/adding-a-component.md:24-30` `cp -r` instructions assume the contributor is on a Unix system** — `docs/adding-a-component.md:24-30`
  - What: Windows contributors (PowerShell `Copy-Item`) need a different command.
  - Fix: add a Windows alternative or note "use Git Bash on Windows".

- **`docs/contributing.md:74` "Open a draft PR with the `[help wanted]` label"** — `docs/contributing.md:74`
  - What: `[help wanted]` is a tag style, not a GitHub label. Should be `help wanted` (without brackets). Verify the label exists in the repo.
  - Fix: either rename the doc reference or create the matching label.

## Out of scope / not assessed

- TypeScript correctness, hook bugs (SE persona)
- Variant API design (UI/UX persona)
- ARIA / keyboard correctness (A11y persona)
- CI workflow security and performance (DevOps persona)
- React internals / SSR / RSC compatibility (FE persona)
- Whether the `colorPrimitive` / `colorSemanticLight` / `colorSemanticDark` exports the doc references actually exist with those names (would need to read `packages/tokens/src/color.ts`).
- Branch-protection settings on GitHub itself (cannot read repo settings via filesystem).
- Discussion-board availability, project board, milestones, roadmap (cannot inspect).
- Whether the docs site (`apps/docs`) is actually deployed and accessible at `https://ship-it-ops.github.io/ship-it-design/` (`pages.yml` deploys it; URL not visible from filesystem).
