# Handoff — ShipIt Design System Implementation

> **For the next Claude Code session.** Read this top to bottom, then
> `cozy-doodling-scott.md` (the plan), then start with Phase 5 below.

## TL;DR

Working through a 5-phase implementation of the ShipIt-AI design system.
**Phases 1, 2, 3, and 4 are done and committed.** All workspace checks are
green: 8/8 typecheck, 7/7 tests (264 tests across `ui` + `shipit` + `icons`),
5/5 builds.

**Up next: Phase 5 (Storybook docs polish).** Wire `@ship-it/shipit` into the
docs app and rewrite the foundation MDX pages. Details below.

## Where you are

| | |
|---|---|
| Repo | `/Users/mohamede/Repos/Ship-It-Ops/ship-it-design` |
| Branch | `initial-design` |
| Plan | `cozy-doodling-scott.md` at repo root (the Ultraplan-refined 5-phase plan) |
| Design source | `design-handoff/project/...` (read-only — handoff bundle from claude.ai/design) |
| Storybook | `apps/docs/` (Storybook 8.6 with vite) |

## Phase status

| Phase | Status | Commit |
|---|---|---|
| 1. Foundation (tokens, icons, fonts) | ✅ done | `2e95cf1 Foundation` |
| 2. UI primitives (35 components) | ✅ done | `5dcbfe2 UI Primitives` |
| 3. UI patterns (23 patterns + 2 hooks) | ✅ done | `d160e0a UI Patterns` |
| 4. `@ship-it/shipit` (22 domain composites) | ✅ done | `0db4754 ShipIt Composites` |
| 5. Storybook docs polish | ⏳ pending | Start here |

## Verify current state

```bash
pnpm install
pnpm -w typecheck   # 8/8
pnpm -w test        # 264 tests across @ship-it/ui (195), @ship-it/shipit (69), @ship-it/icons (6)
pnpm -w build       # tokens, icons, ui, shipit, docs — all build clean
```

If any of these fail right out of the gate, something regressed. Don't
proceed until they're green.

---

## Architectural decisions (don't re-litigate)

- **Dark-first tokens.** `:root` holds dark theme. `[data-theme="light"]` is
  the opt-in override.
- **OKLCH master-hue knob.** `--accent-h` (default `200`) drives every accent
  shade.
- **Tailwind v4 + cva.** Translate handoff inline styles to utility classes
  consuming token CSS variables via `@theme inline` in `globals.css`.
  Hover/focus via `hover:`, `focus-visible:` modifiers — no JS state.
- **Radix UI for behavior** on overlays (Dialog, Popover, Tooltip,
  DropdownMenu, ContextMenu, HoverCard, Toast, Tabs, Menubar) and form
  primitives (Checkbox, Radio, Switch, Slider, Select, Avatar). Ship-It owns
  styling, Radix owns ARIA + keyboard.
- **Geist self-hosted** via `@fontsource-variable/geist` and
  `@fontsource-variable/geist-mono`. Imported from `globals.css`.
- **tsup for library builds.** Each lib package has a `tsconfig.build.json`
  (composite=false) referenced from `tsup.config.ts` via top-level `tsconfig:`
  option. Replicated for `tokens`, `icons`, `ui`, and `shipit`.
- **vitest-axe** (NOT jest-axe).

## File geography

```
packages/
├── tokens/                @ship-it/tokens
├── icons/                 @ship-it/icons (IconGlyph + glyphs map + SVGR pipeline)
├── ui/                    @ship-it/ui — 35 primitives + 23 patterns + 6 hooks
│   ├── src/components/    primitives, one folder per component (or family)
│   ├── src/patterns/      composites (Tabs, Combobox, DataTable, Tree, etc.)
│   ├── src/hooks/         useEscape, useOutsideClick, useTheme, useDisclosure,
│   │                       useControllableState, useKeyboardList
│   ├── src/styles/        globals.css + animations.css
│   └── src/index.ts       public barrel
├── shipit/                @ship-it/shipit — 22 domain composites
│   ├── src/ai/            AskBar, CopilotMessage, Citation, ReasoningBlock,
│   │                       ToolCallCard, SuggestionChip, ConfidenceIndicator
│   ├── src/entity/        EntityBadge, EntityCard, EntityListRow + types
│   ├── src/graph/         GraphNode, GraphEdge, GraphLegend, GraphMinimap,
│   │                       GraphInspector, PathOverlay
│   ├── src/marketing/     Hero, FeatureGrid, Testimonial, PricingCard,
│   │                       CTAStrip, Footer
│   ├── src/data/          EntityTable (DataTable wrapper)
│   ├── src/test/setup.ts  jsdom polyfills + vitest-axe
│   └── src/index.ts       public barrel
├── tsconfig/              shared TypeScript presets
└── eslint-config/         shared ESLint flat config

apps/docs/                  Storybook 8.6
├── .storybook/
│   ├── main.ts             stories glob currently covers ui — Phase 5 adds shipit
│   ├── preview.ts          theme switcher (currently withThemeByClassName — Phase 5 flips)
│   └── manager.ts          imports use `storybook/internal/...` paths
└── stories/                MDX foundation pages (1-Introduction → 6-Accessibility)

design-handoff/             read-only design source (committed on handoff branch)
```

## Component authoring conventions (every component obeys these)

1. **One folder per component** (or tightly-related family).
2. **Files per folder**: `Component.tsx`, `Component.stories.tsx` (in `ui`,
   not yet in `shipit`), `Component.test.tsx`, `index.ts`. Re-export from
   `index.ts`.
3. **`forwardRef` everywhere**. Pass refs through.
4. **`cva` for variant axes**. All conditional classes inside cva — no inline
   conditional classNames in JSX.
5. **Tailwind utilities consuming token CSS vars**: `bg-accent`, `text-text`,
   `rounded-md`, `border-border`. Never hex values.
6. **Hover/focus via Tailwind modifiers**.
7. **Radix wrapping**: when keyboard/ARIA matters, wrap a Radix primitive.
8. **`asChild` polymorphism** via `@radix-ui/react-slot` where it makes sense.
9. **Tests** (vitest):
   - render happy path
   - one test per interactive behavior (`userEvent`)
   - axe clean: `expect(await axe(container)).toHaveNoViolations()`
10. **Stories** (Storybook, only `ui` so far):
    - title `Components/<Group>/<Name>` for primitives, `Patterns/<Group>/<Name>`
      for ui patterns. shipit stories not authored yet — Phase 5 task.
11. **Update the public barrel** when adding components.
12. **Type ergonomics**: when extending HTMLAttributes, `Omit` any conflicting
    props (`title`, `onSelect`, `values`, drag handlers, `role`, `cite`).
    Recurring TS2430 — see auto memory `feedback_html_attribute_omits.md`.

## Gotchas (don't re-discover these)

- **tsup + composite tsconfig**: causes `error TS6307` in DTS. Solution
  per-package: `tsconfig.build.json` with `composite: false`, referenced via
  tsup's top-level `tsconfig: './tsconfig.build.json'`. Wired for all 4 lib
  packages.

- **Storybook 8.6 imports**: `@storybook/manager-api` and
  `@storybook/theming/create` moved into `storybook` directly. Use
  `storybook/internal/manager-api` and `storybook/internal/theming/create`.

- **kebab-case regex**: only split letter→Letter (camelCase). For tokens like
  `panel-2` use string-literal hyphen in the JS key.

- **jsdom polyfills** in `src/test/setup.ts`: ResizeObserver,
  IntersectionObserver, matchMedia, scrollIntoView, hasPointerCapture,
  releasePointerCapture. Replicated in `shipit/src/test/setup.ts`.

- **vitest-axe over jest-axe**. The latter's matcher signature is incompatible.

- **axe-core color-contrast in jsdom**: throws "canvas not implemented" stderr.
  Harmless — tests still pass.

- **`role="grid"` requires `role="row"` parents.** If you don't implement true
  ARIA grid keyboard nav, drop the grid roles entirely (see Calendar).

- **Nested-interactive a11y**: a `role="button"` div around a focusable file
  input violates `nested-interactive`. Use a `<label>` wrapper instead — labels
  are spec-allowed to wrap form controls (see Dropzone).

- **Radix Dialog: missing aria-describedby warning.** Set
  `aria-describedby={undefined}` explicitly on `RadixDialog.Content` when
  there's no `<DialogDescription>` (see CommandPalette).

- **Generic component + forwardRef**: forwardRef erases the generic. Keep the
  component as a plain function with optional `ref` in props (see DataTable,
  EntityTable).

- **`storybook/test` peer warning**: `@storybook/react` 8.6.18 wants
  `@storybook/test` 8.6.18 but 8.6.15 resolved. Cosmetic.

---

## Phase 5 — Storybook docs polish

This is the last phase. All composites exist; Storybook needs to surface them
and the foundation pages need to be rewritten with real handoff values.

### 1. Wire `@ship-it/shipit` into the docs app

Add the workspace dep to `apps/docs/package.json`:
```json
"dependencies": {
  "@ship-it/shipit": "workspace:*",
  ...
}
```
Then `pnpm install`.

Update `apps/docs/.storybook/main.ts` to discover shipit stories:
```ts
stories: [
  '../stories/**/*.mdx',
  '../../../packages/ui/src/**/*.mdx',
  '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
  '../../../packages/shipit/src/**/*.mdx',
  '../../../packages/shipit/src/**/*.stories.@(ts|tsx)',
],
```

### 2. Author shipit stories

`packages/shipit/src/{ai,entity,graph,marketing,data}/<Component>.stories.tsx` —
one per composite. Title prefixes:
- `ShipIt/AI/AskBar`, `ShipIt/AI/CopilotMessage`, ...
- `ShipIt/Entity/EntityBadge`, ...
- `ShipIt/Graph/GraphNode`, ...
- `ShipIt/Marketing/Hero`, ...
- `ShipIt/Data/EntityTable`

Use the same `tags: ['autodocs']` + argTypes pattern as the ui primitives.
Reference designs in `design-handoff/project/library/sec-ai-marketing-icons.jsx`
and `design-handoff/project/app/page-{ask,graph,entity,home}.jsx`.

### 3. Theme decorator: switch to data-attribute

Update `apps/docs/.storybook/preview.ts`: replace `withThemeByClassName` (the
scaffold default) with `withThemeByDataAttribute`:
```ts
withThemeByDataAttribute({
  themes: { dark: '', light: 'light' },
  defaultTheme: 'dark',
  attributeName: 'data-theme',
})
```

### 4. Rewrite the 6 existing MDX foundation pages

`apps/docs/stories/{1-Introduction,2-Foundations-Color,3-Foundations-Typography,
4-Foundations-Spacing,5-Foundations-Motion,6-Accessibility}.mdx` — currently
scaffold placeholders. Rewrite with the real handoff values:
- Color: OKLCH swatches for the dark + light maps, `--accent-h` knob demo
- Typography: Geist sample + the named ramp (eyebrow → display)
- Spacing: the irregular 4pt scale
- Motion: durations + easings + reduced-motion behavior

### 5. Add new MDX pages

- `7-Foundations-Iconography.mdx` — full IconGlyph inventory grid (use
  `@ship-it/icons` `glyphs` map) + connector list + sizes + treatments.
- `8-Foundations-Layout.mdx` — container widths, 12-col grid, split pane.
- `9-Voice-Content.mdx` — voice rules from `design-handoff/project/SKILL.md`:
  "Let's go" not "Get started", "Reading your world" not "Loading…", no emoji.

### 6. Verify

```bash
pnpm -w typecheck && pnpm -w test && pnpm -w build
pnpm --filter docs dev   # http://localhost:6006
```

Manual visual QA: theme toggle, every component's autodocs renders,
sidebar shows Foundations / Components / Patterns / ShipIt sections.

After Phase 5, this handoff doc can be archived or deleted.

---

## User preferences (from prior sessions)

- **No `Co-Authored-By: Claude` lines** in commit messages.
- **Use Obsidian as cross-instance memory.** Vault path:
  `~/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/ai-vault/_ai/`.
- **Capture knowledge incrementally** — after each milestone.
- **Communication style**: terse responses; no trailing summaries unless
  asked; show results not narration.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 18+, TypeScript 5.9 |
| Styling | Tailwind v4 beta (`@theme inline` directive) + CSS variables |
| Variants | `class-variance-authority` + `clsx` + `tailwind-merge` |
| Headless | Radix UI primitives |
| Library build | tsup (esm + cjs + dts) |
| Tests | Vitest + @testing-library/react + @testing-library/user-event + vitest-axe |
| Docs | Storybook 8.6 + @storybook/react-vite |
| Versioning | Changesets (wired but no publishes yet) |
| Orchestration | Turborepo |
| Package mgr | pnpm 9 |
| Node | 20 LTS (`.nvmrc`) |

## External state worth knowing

- **Auto memory**:
  `~/.claude/projects/-Users-mohamede-Repos-Ship-It-Ops-ship-it-design/memory/`
  has `MEMORY.md` indexing `obsidian_vault_path.md`,
  `feedback_html_attribute_omits.md`, `feedback_a11y_pitfalls.md`.
- **Global Claude permissions**: `~/.claude/settings.json` allows
  `Read/Write/Edit(/Users/mohamede/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/ai-vault/**)`.
- **Obsidian notes**: pre-Phase-1 architecture rationale lives in
  `_ai/Projects/`, `_ai/Decisions/`, `_ai/Patterns/`. After Phase 5 ships,
  consider a new note capturing lessons from the implementation phases.
