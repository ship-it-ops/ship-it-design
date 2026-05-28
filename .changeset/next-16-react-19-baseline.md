---
'@ship-it-ui/ui': patch
'@ship-it-ui/shipit': patch
'@ship-it-ui/icons': patch
'@ship-it-ui/cytoscape': patch
'@ship-it-ui/graph-editor': patch
'@ship-it-ui/map': patch
---

React 19 baseline. Peer range tightened to `react ^19.0.0` /
`react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
React 19.2. Drops React 18 from the supported matrix — consumers must be on
React 19 to install.

`@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
latest 1.x. Each one now declares explicit React 19 peer support and ships
the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
Radix v2 migration in this release; only patch-level moves within 1.x.
