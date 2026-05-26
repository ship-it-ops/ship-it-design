---
'@ship-it-ui/ui': patch
'@ship-it-ui/next': patch
---

Fix several long-standing act() warnings and Radix a11y dev-mode warnings
surfaced by tests:

- `Dialog` / `AlertDialog` / `WizardDialog` now explicitly pass
  `aria-describedby={undefined}` when no `description` is supplied, so
  Radix's dev-mode check sees the intentional opt-out instead of warning.
  `WizardDialog` additionally renders a visually-hidden fallback `<Title>`
  when no `title` prop is given, so the Dialog contract is always met.
- `useTheme` now flags self-initiated `data-theme` mutations so the
  internal `MutationObserver` skips the change instead of firing a
  redundant `setState` outside `act()` after the click handler returns.
- `Tree`'s active-item move now uses `flushSync` to commit the state
  update before focusing the new tab stop, replacing a `queueMicrotask`
  that resolved outside `act()` in tests.
- Test setup: `@ship-it-ui/next` now polyfills `ResizeObserver` for
  jsdom (Radix `useSize` needs it), and `@ship-it-ui/ui` filters the
  upstream `ToastAnnounce` act warning that fires from Radix's own
  1-second setTimeout.
