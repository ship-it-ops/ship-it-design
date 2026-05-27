---
'@ship-it-ui/ui': patch
---

Add a `color` prop to Badge, Tag, Chip, StatusDot, Rating, and Avatar for one-off color overrides outside the semantic-token surface. The prop is optional and passes through cleanly when used alongside `variant` / `state` — when both are set, `color` takes precedence at runtime. Invalid colors fall back to the default variant; in dev, a console.warn names the offending value. Existing usage is unaffected — `variant` and `state` continue to work exactly as before.
