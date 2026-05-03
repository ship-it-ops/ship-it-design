# @ship-it-ui/icons

React components generated from raw SVG files. Designers drop SVGs in, contributors
run a build, and named React components fall out the other side.

## How it works

```
src/svg/             scripts/build.ts            src/components/      src/svg-icons.ts
─────────────        ───────────────────         ─────────────────    ────────────────────
arrow-right.svg ───► SVGR transform ──► ArrowRightIcon.tsx ──────────► export { ArrowRightIcon }
check.svg      ───►                  ─► CheckIcon.tsx       ──────────► export { CheckIcon }
```

`scripts/build.ts` does three things:

1. Reads every `.svg` from `src/svg/`.
2. Runs each through [SVGR](https://react-svgr.com/) to produce a typed React
   component in `src/components/`.
3. Rewrites `src/svg-icons.ts` to re-export every generated component.

`src/index.ts` is hand-authored: it exports the `IconGlyph` vocabulary and
re-exports everything from `./svg-icons`, so the generated icons surface from
the package root without the build clobbering the manual exports.

The transform sets `width="1em"`, `height="1em"`, and `fill="currentColor"` so icons
inherit size and color from the surrounding text — `<ArrowRightIcon className="text-accent size-4" />`
just works.

## Adding an icon

1. Drop a clean SVG into `src/svg/`. Naming uses kebab-case: `arrow-right.svg`.
2. Make sure the SVG has no fixed `width`/`height` on the root element and uses
   `currentColor` (or solid `#000`/`#000000` — those are remapped automatically).
3. Run `pnpm --filter @ship-it-ui/icons build`.
4. Import: `import { ArrowRightIcon } from '@ship-it-ui/icons';`
5. Commit the SVG and the regenerated `src/svg-icons.ts`. The generated
   `src/components/*.tsx` files are gitignored — CI rebuilds them from the
   committed SVG sources.

## SVG hygiene checklist

- ✅ Single-color, uses `currentColor` (or `#000`)
- ✅ 24×24 viewBox (or whatever the design system standard is)
- ✅ No inline `width`/`height` on the root `<svg>` element
- ✅ No `fill-rule="evenodd"` artifacts from Figma you didn't intend
- ✅ Optimized — designer should run through SVGO or Figma's "Outline strokes"
