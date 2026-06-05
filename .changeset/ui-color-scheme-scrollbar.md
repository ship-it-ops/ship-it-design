---
'@ship-it-ui/ui': patch
---

Set `color-scheme: dark` on `<html>` (with a `[data-theme='light']` override) in
the package globals so the browser's native scrollbar, form-control chrome, and
other UA surfaces follow the active theme. Previously the UA defaulted to the
light scrollbar even when the app was rendering in dark mode.
