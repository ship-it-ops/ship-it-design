---
'@ship-it-ui/ui': patch
---

Rename the `screen` spacing key to `gutter` (`p-screen` → `p-gutter`) so it no
longer shadows Tailwind's reserved `h-screen` / `w-screen` viewport utilities.

In Tailwind v4 a `--spacing-<key>` entry mints the full sizing family for that
key, so the `--spacing-screen` bridge also generated `h-screen` /
`min-h-screen` / `max-h-screen` / `w-screen` and silently redefined Tailwind's
built-in `100vh` / `100vw` utilities to the 16px screen-pad value — collapsing
any consumer's full-height app shell to 16px. Renaming the bridge key to
`gutter` restores native `h-screen` / `w-screen` and keeps the screen-edge
padding utility as `p-gutter` / `px-gutter` (and the `-lg` variants). The
underlying `--screen-pad` token is unchanged.

Note: this is a pre-1.0 utility rename — `p-screen` → `p-gutter`. The only DS
consumer (`LargeTitle`) is updated; external consumers using `p-screen` /
`px-screen` must rename to `p-gutter` / `px-gutter`.
