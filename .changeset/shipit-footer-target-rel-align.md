---
'@ship-it-ui/shipit': patch
---

Footer: two additive, non-breaking enhancements.

- `FooterLink` now accepts optional `target` and `rel`. External links can set
  `target="_blank"`; when `rel` is omitted and `target === '_blank'`, `rel`
  defaults to `"noopener noreferrer"` for security best practice.
- New `align?: 'split' | 'center'` prop on `Footer`. Default `'split'` is
  byte-identical to today's layout (link columns and closing pushed right via
  `ml-auto`); `'center'` centers the link-columns group and the closing line.

Both changes default to existing behavior, so all current consumers are
unchanged.
