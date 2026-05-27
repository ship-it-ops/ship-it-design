---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: "if a README or example uses bg-brand / text-brand / background — stop, those aren't real Tailwind classes in this system"
tags: [docs, tokens, tailwind, drift]
---

# Package READMEs used `bg-brand` and `background` — tokens that don't exist; new contributors copy-paste-failed

## What Happened

The May 2026 audit (PM persona, P0 #6/P1 #6) found multiple READMEs
referencing tokens that don't exist:

- `packages/ui/README.md:54` told contributors "always use semantic
  tokens like `bg-brand`, not `bg-indigo-600`" — there is no
  `--color-brand` token in this system. The accent role is
  `--color-accent`.
- `packages/tokens/README.md:18` listed "semantic aliases like
  `background`, `text`, `border`, `brand`" — actual names are `bg`,
  `panel`, `text`, `accent`, etc.
- `packages/icons/README.md:23` used `className="text-brand size-4"` in
  the example — same `text-brand` ghost.

A new contributor copying the example would get **no Tailwind output**
(the utility doesn't exist), look at the empty class compile, and assume
the styling system was broken. The cost is _adoption_ loss — first
impressions from public READMEs are unforgiving.

## Tripwire

**If a README or example references `bg-brand`, `text-brand`, or
`background` as a Tailwind utility — stop.** Grep `packages/ui/src/styles/
globals.css` to confirm the actual semantic-token name. The list is in
the `@theme inline` block (`--color-bg`, `--color-panel`, `--color-text`,
`--color-accent`, `--color-ok`, etc.).

When adding to a README, generate one example, run
`pnpm --filter docs-site dev`, and confirm the class actually paints.
Don't trust your memory of what tokens should be named.

## Why It Hurt

First-touch contributor experience matters disproportionately. A
copy-paste-broken README costs the team adoption — the new contributor
doesn't file a bug; they just churn away and never return.

Compounding: the audit's PR-template work fixed the contributor flow
inside the repo, but a public-facing README is the funnel before that.

## Don't Do This

- Don't write README code samples without running them first.
- Don't carry over "design system convention" naming from another
  codebase into examples — verify against this codebase's actual token
  inventory.
- Don't introduce a new doc-level alias (`brand`) without first defining
  it in the token system. The docs follow the code, not the reverse.

## Related

- [[theme-tokens-resolution-chain]] — the canonical inventory of
  actually-existing tokens.
- [[icons-readme-codegen-drift]] — sibling docs-drift scar.
