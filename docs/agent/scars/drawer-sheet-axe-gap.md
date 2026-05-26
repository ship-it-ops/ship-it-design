---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: 'if a new overlay test renders without firing a userEvent on the trigger, stop and add the open-then-axe assertion'
tags: [a11y, axe, radix, dialog, drawer, sheet]
---

# Overlay components shipped without accessible names because axe scanned the empty viewport

## What Happened

The May 2026 audit (A11y persona, Theme D + E) found that:

- `Drawer` and `Sheet` rendered `RadixDialog.Content` **without** a
  `RadixDialog.Title`, leaving them with no accessible name and emitting
  the Radix runtime warning `DialogContent requires a DialogTitle`.
- They were the **only two** component test files in the repo
  (54/56 had it) **without** an `axe()` assertion.
- The regression-detection gap was **co-located with the regression**.
  Every other Dialog-shaped component test had `axe(container)` and
  caught its bugs in CI; these two slipped through because the test gap
  was exactly where the implementation gap was.

Even after adding `axe(container)`, a second sub-scar surfaced (commit
`4993fa1`): `axe(container)` scans the empty RTL render wrapper because
Radix portals Content outside it. **`axe(document.body)`** is the right
scan — see [[test-setup-portal-axe]] for the pattern.

## Tripwire

**If a new overlay test renders the component but never fires a
`userEvent` on the trigger to open it, stop.** The axe pass is trivially
green on a closed overlay. Open it first, then scan `document.body`.

Secondary tripwire: if an overlay component lacks `RadixDialog.Title`
(or a visually-hidden equivalent / `aria-label` / `aria-labelledby`),
flag it — Radix's runtime warning is the smoke; the silence in your
test is the lack of a fire alarm.

## Why It Hurt

A modal with no accessible name announces "dialog" with no purpose to
screen-reader users. Anyone evaluating the library for adoption with an
a11y bar (the dominant enterprise consumer) would block on this in their
own integration test. The library would have lost adopter trust at the
exact surface that's supposed to demonstrate care (Dialog is in the
README's tech-stack table; it's a calling card).

## Don't Do This

- Don't ship an overlay test that asserts only the closed state.
- Don't `axe(container)` when Radix is involved — `container` doesn't
  include the portal.
- Don't add a new overlay component without confirming both
  `RadixDialog.Title` (or equivalent) is wired AND the test fires a
  userEvent on the trigger before axe.
- Don't trust that "well, every other test has axe" — verify with
  `grep -l "axe(" packages/<pkg>/src/components/.../*.test.tsx` on any new
  package; the convention has to migrate to each new package
  intentionally.

## Related

- [[test-setup-portal-axe]] — the pattern that closes this scar.
- [[component-authoring-shape]] — overlay components follow this with
  the open-and-axe step baked in.
