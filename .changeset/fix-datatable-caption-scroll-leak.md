---
'@ship-it-ui/ui': patch
---

Fix DataTable's screen-reader caption escaping its containing block. The
`sr-only` Tailwind utility uses `position: absolute` without `top/left`,
so without a positioned ancestor the caption resolved against `<html>`
and inflated the document scroll height — visible on docs pages as a
second, ghostly scrollbar that scrolled into empty space. Marking the
table `position: relative` makes it the caption's containing block.
