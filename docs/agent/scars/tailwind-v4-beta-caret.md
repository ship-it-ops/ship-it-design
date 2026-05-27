---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: 'if you see ^x.x.x-beta or ^x.x.x-rc on a prerelease tag, stop — pin exact until GA'
tags: [dependencies, tailwind, semver, prerelease]
---

# Caret on a Tailwind v4 beta auto-bumped to a breaking `@theme inline` change

## What Happened

`packages/ui/package.json` declared `"tailwindcss": "^4.0.0-beta.3"`.
Semver caret semantics on a prerelease tag **allow updates within the
same `4.0.0-beta.*` family** — so `pnpm install` after Tailwind shipped
the next beta would silently upgrade. Between betas Tailwind had
breaking `@theme inline` API changes (notably the directive name and
`--color-*` resolution order).

The result: a contributor running `pnpm install` next month could get a
different Tailwind than CI's lockfile-pinned one, until the lockfile
updated — at which point CI would suddenly get the new beta. Either
direction, builds break unannounced.

The fix is currently in tree: `"tailwindcss": "4.0.0-beta.3"` — no caret
— pinned exact.

## Tripwire

**If you see `^x.x.x-beta` or `^x.x.x-rc` in any package.json, stop.**
Prereleases should be pinned exact until GA. The caret is fine on stable
versions (`^4.1.0` after Tailwind v4 ships); it's specifically the
prerelease tag where caret semantics become a footgun.

Same applies to any other dependency on a beta train — Storybook 10.x
betas were also flagged (now removed from this repo when Storybook was
dropped, see [[no-storybook-migration]]).

## Why It Hurt

Silent upgrade between betas of a build-critical dependency would
manifest as "my local install fails but CI's lockfile-pinned install
passes" (or vice versa) — both equally confusing. The team wastes a
half-day diffing lockfiles before realizing the version constraint was
the problem.

## Don't Do This

- Don't use `^` on a `-beta`/`-rc`/`-alpha`/`-canary` tag.
- Don't take a "compatibility risk" by re-adding the caret because
  "we'll update if anything breaks" — broken builds will surface during
  PR review and waste cycles.
- When Tailwind v4 GA ships, transition the pin to `^4.0.0` (caret on
  stable is fine). Track the transition explicitly; don't let a
  Dependabot PR carry both the GA bump AND the cosmetic caret restoration
  in one diff.

## Related

- [[monorepo-package-split]] — every UI package's `tsup.config.ts` /
  Tailwind setup repeats this pattern; check siblings when bumping.
