---
'@ship-it-ui/tokens': patch
'@ship-it-ui/ui': patch
---

Make `--color-on-accent` theme-aware (near-black in dark, white in light) so
`text-on-accent` is legible on the light theme's dark accent.

`on-accent` is the foreground for components on an accent surface (primary /
destructive / success Buttons, solid Badges, Switch, Checkbox, active
Sidebar / NavBar / Calendar / Stepper / TabBar states, MapMarker,
CopilotMessage). It was previously a hardcoded near-black literal in
`globals.css`, which is correct on the dark theme's bright accent but failed
contrast on the light theme's dark accent (near-black text on a dark teal
surface). It is now a theme-aware semantic token — `#0a0a0b` in dark,
`#ffffff` in light — emitted into `tokens.css` like every other semantic
color and bridged through `@theme inline`. No component changes are needed;
all consumers pick up the theme-aware value through the `text-on-accent` /
`bg-on-accent` utilities.
