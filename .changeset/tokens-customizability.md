---
'@ship-it-ui/tokens': patch
---

Add consumer customization surface: `defineConfig` / `ShipItConfig` (importable from `@ship-it-ui/tokens/config`), a `shipit build-tokens [--watch]` CLI that emits a sparse override CSS at `.ship-it/tokens.css` (default), and the `LineHeightToken` type export. Existing consumers are unaffected — no config file means no override file. See `docs/customizing-tokens.md` for setup.
