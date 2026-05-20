---
'@ship-it-ui/graph-editor': patch
---

`<GraphEditorCanvas>` no longer imports its own stylesheet. Consumers must now add `import '@ship-it-ui/graph-editor/styles.css';` once at their app entry (`app/layout.tsx` for Next.js, `main.tsx` for Vite, etc.). Library-internal global CSS imports break Next.js's App Router CSS rules, and the explicit pattern also lets consumers control load order against their own theme. The CSS export path is unchanged; tsup ships it as a standalone `dist/styles.css` entry. README + docs updated; existing examples already follow the explicit-import pattern.
