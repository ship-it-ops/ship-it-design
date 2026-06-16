---
'@ship-it-ui/ui': patch
---

Four additive, non-breaking accessibility and ergonomics fixes.

- **Banner contrast** — the `tone` variants now use the contrast-safe `*-text`
  color tokens (`text-accent-text`, `text-ok-text`, `text-warn-text`,
  `text-err-text`) instead of the raw ramp tokens, which were barely legible on
  the tinted light-mode backgrounds. Backgrounds are unchanged.
- **Dialog title/description + VisuallyHidden** — re-export Radix's `Title` and
  `Description` as `DialogTitle` / `DialogDescription`, and add a new local
  `VisuallyHidden` primitive (a `<span>` using the standard sr-only clip
  pattern, no new dependency). Together these let consumers give a titleless
  dialog an accessible name without showing it on screen.
- **PhoneInput `id` forwarding** — `PhoneInput` now accepts `id` (plus
  `aria-describedby` / `aria-invalid`) and forwards them to the inner
  `<input type="tel">`, so an external `<label htmlFor>` — or a `Field`
  render-prop's generated id/aria wiring — correctly targets the input.
- **Button `asChild` icon/trailing/loading** — `asChild` previously dropped the
  `icon`, `trailing`, and loading spinner. They are now composed into the single
  Slot child via `cloneElement`, mirroring the spans the normal `<button>`
  branch renders. When there is nothing to inject, the original
  `<Slot>{children}</Slot>` behavior is preserved unchanged.
