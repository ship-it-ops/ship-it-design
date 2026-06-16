---
'@ship-it-ui/icons': patch
---

Rename the `connector` icon category to `logo`. The brand-mark set (GitHub,
Slack, social, tech, and car-manufacturer logos) outgrew the "connector"
name, so `logoManifest` / `LogoName` / `kind="logo"` are now canonical.

This is **non-breaking**: the old `connectorManifest` export, the
`ConnectorName` type, and `kind="connector"` continue to work as
`@deprecated` aliases (and `iconToSvgDataUrl('connector:<name>')` still
resolves), all removed at 1.0. Generated `icon-data.ts` keys move from
`connector:` to `logo:`; legacy `connector` callers are normalized to the
`logo:` keys at lookup time.
