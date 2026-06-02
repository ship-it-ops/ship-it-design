---
type: scar
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-opus-4-7
tags: [docs-site, build, dev-loop, ui-package]
incident-date: 2026-06-02
tripwire: "if a behavioural change to packages/ui/src/* doesn't appear in apps/docs-site after the user 'restarts the dev server', packages/ui/dist/ is stale — `pnpm --filter @ship-it-ui/ui build && rm -rf apps/docs-site/.next` and restart the dev server, OR run `pnpm --filter @ship-it-ui/ui dev` (tsup --watch) alongside docs-site dev"
---

# `apps/docs-site` bundles `@ship-it-ui/ui` from `dist/`, not `src/`

## What Happened

Mid-session on a Carousel fix, asked the user to verify behaviour in
their docs-site dev server (port 3000). They reported "the bug still
happens." Source edits had landed correctly. After a short trail of
"are you sure you restarted the dev server" loops, discovered
`packages/ui/dist/index.cjs` was from `Jun 1 12:22` while the edits
were from `Jun 1 19:40+`. The docs-site had been bundling pre-fix code
for the entire round-trip.

Root cause: `packages/ui/package.json` exports from `./dist/index.js`
(not `./src/`). The docs-site declares
`transpilePackages: ['@ship-it-ui/ui']` in `next.config.ts`, which
transpiles whatever the package exports point at — `dist/`. Source
changes need a `tsup` rebuild to surface in `dist/` before the
docs-site sees them. Even after rebuild, Next caches the transpiled
module in `.next/cache`, so a server restart alone may not pick up
the new bundle.

`pnpm dev` at the repo root runs both via Turbo (tsup --watch +
docs-site dev). Per-package commands like `pnpm start:docs` or
`pnpm --filter docs-site dev` do NOT include the UI watcher.

## Tripwire

If a `packages/ui/src/*` change doesn't surface in `apps/docs-site`
after the user reports they restarted the dev server:

1. Check the modification time of `packages/ui/dist/index.{js,cjs}` —
   if it predates the source edit, the dist is stale.
2. `pnpm --filter @ship-it-ui/ui build && rm -rf apps/docs-site/.next`,
   then ask the user to restart the dev server.
3. For longer iteration loops, suggest the watch-mode flow: run
   `pnpm --filter @ship-it-ui/ui dev` (tsup --watch) in one terminal
   alongside the docs-site dev server in another, or use `pnpm dev`
   at root which runs both via Turbo.

## Why It Hurt

~20 minutes of user back-and-forth ("the fix doesn't work" "are you
sure you rebuilt?") on a Carousel bug before realising the dist was
stale. The fix had been correct on the first attempt.

## Don't Do This

When asking the user to verify a `packages/ui/src/*` change in the
docs-site:

- Don't just say "restart the dev server".
- Run the rebuild yourself first, clear `.next/cache`, and TELL them
  what you did so they don't burn time on a stale bundle.
- For iterative back-and-forth, suggest the watch-mode flow upfront.

## Related

- [[scroll-behavior-smooth-overrides-scrollleft-setter]] — Carousel
  scar from the same session whose verification this masked.
