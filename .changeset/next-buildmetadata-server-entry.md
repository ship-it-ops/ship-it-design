---
'@ship-it-ui/next': patch
---

Export `buildMetadata` (and `BuildMetadataInput`) from `@ship-it-ui/next/server`.

Its only use is a Server Component's `export const metadata`, but the root
barrel carries a hoisted `'use client'` directive, so importing `buildMetadata`
from `@ship-it-ui/next` made it a client-reference proxy that threw at runtime.
It is a pure function, so it now lives on the server entry too (and stays on the
root barrel for back-compat). A regression test asserts the built `dist/server.*`
bundles carry no `'use client'` directive.
