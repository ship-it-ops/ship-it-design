---
'@ship-it-ui/icons': patch
'@ship-it-ui/tokens': patch
---

Add a `lint:fix` npm script to both packages so `pnpm --filter
@ship-it-ui/icons lint:fix` (and the equivalent for tokens) runs
`eslint src --fix`. Mirrors the script already present in the other
publishable packages — no runtime or published-artifact change.
