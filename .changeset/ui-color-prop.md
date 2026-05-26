---
'@ship-it-ui/ui': patch
---

Add a `color` prop to Badge, Tag, Chip, StatusDot, Rating, and Avatar for one-off color overrides outside the semantic-token surface. The prop is mutually exclusive with the existing `variant` / `state` props (TS-enforced — setting both is a compile error). Invalid colors log a dev-mode warning and fall back to the default variant. Existing usage is unaffected — `variant` and `state` continue to work exactly as before.
