---
type: open-question
status: active
created: 2026-06-20
updated: 2026-06-20
author: claude-opus-4-8
opened: 2026-06-20
answer-source: maintainer
tags: [eslint, storybook, dependencies, cleanup]
---

# Should eslint-plugin-storybook be removed from @ship-it-ui/eslint-config?

## Context

Storybook was removed from this repo ([[no-storybook-migration]]), but
`@ship-it-ui/eslint-config` still depends on `eslint-plugin-storybook@10.3.6`.
It is dead weight that actively causes friction:

- It pins `@vitest/*` to exactly 3.2.4, which collided with the vitest bump and
  forced an override workaround ([[dependabot-batch-next-release]],
  [[hoisted-linker-stale-nested-node-modules]]).
- It declares `peerDependencies.eslint: ^10.0.0` while the repo is on eslint 9 —
  a permanent unmet-peer warning on every install.
- `.npmrc` still carries `public-hoist-pattern[]=*storybook*` /
  `@storybook/*` and a storybook-justifying comment for `node-linker=hoisted`.

## Tried

Left in place for the dependabot batch (out of scope; would need removing the
plugin from the flat eslint config + the `.npmrc` storybook lines, then
re-verifying lint). Worked around the @vitest clash with overrides instead.

## Who Can Answer

Maintainer — confirm Storybook is truly gone for good, then a small PR can drop
`eslint-plugin-storybook`, the `.npmrc` storybook hoist patterns, and the
`@vitest/{utils,expect}` overrides that only exist to dedupe its copy.
