---
'@ship-it-ui/graph-editor': patch
---

Strip React Flow's built-in node-default chrome inside `.ship-graph-editor`. RF paints every `default`/`input`/`output`/`group` node with a 150px-wide white box, a 1px border, and 10px padding — which showed up in dark mode as a stark white wrapper around our `<GraphNodeShell>`. The new overrides null out `padding`, `border`, `background`, `width`, `border-radius`, `font-size`, and `text-align` on those classes, so the only visual is the shell. Selection / hover / focus box-shadows are also suppressed so the shell's own selection ring stays the canonical visual. Scope is `.ship-graph-editor` so other React Flow surfaces on the same page (if any) aren't affected.
