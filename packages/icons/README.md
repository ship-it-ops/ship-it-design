# @ship-it/icons

React components generated from raw SVG files. Designers drop SVGs in, contributors
run a build, and named React components fall out the other side.

## How it works

```
src/svg/             scripts/build.ts            src/components/      src/index.ts
─────────────        ───────────────────         ─────────────────    ──────────────
arrow-right.svg ───► SVGR transform ──► ArrowRightIcon.tsx ──────────► export { ArrowRightIcon }
check.svg      ───►                  ─► CheckIcon.tsx       ──────────► export { CheckIcon }
```

`scripts/build.ts` does three things:

1. Reads every `.svg` from `src/svg/`.
2. Runs each through [SVGR](https://react-svgr.com/) to produce a typed React
   component in `src/components/`.
3. Rewrites `src/index.ts` to re-export every generated component.

The transform sets `width="1em"`, `height="1em"`, and `fill="currentColor"` so icons
inherit size and color from the surrounding text — `<ArrowRightIcon className="text-brand size-4" />`
just works.

## Adding an icon

1. Drop a clean SVG into `src/svg/`. Naming uses kebab-case: `arrow-right.svg`.
2. Make sure the SVG has no fixed `width`/`height` on the root element and uses
   `currentColor` (or solid `#000`/`#000000` — those are remapped automatically).
3. Run `pnpm --filter @ship-it/icons build`.
4. Import: `import { ArrowRightIcon } from '@ship-it/icons';`
5. Commit the SVG. The generated `src/components/*.tsx` and the generated
   `src/index.ts` are gitignored — they're rebuilt by CI.

## SVG hygiene checklist

- ✅ Single-color, uses `currentColor` (or `#000`)
- ✅ 24×24 viewBox (or whatever the design system standard is)
- ✅ No inline `width`/`height` on the root `<svg>` element
- ✅ No `fill-rule="evenodd"` artifacts from Figma you didn't intend
- ✅ Optimized — designer should run through SVGO or Figma's "Outline strokes"
