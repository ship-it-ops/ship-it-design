# Plan: Implement the ShipIt-AI Design System into `ship-it-design`

## Context

The repo scaffold from the prior plan is now built (≈80 files, four workspaces). This plan
**fills it in** with the real design system Mohamed handed off via Anthropic's Design tool.

**Source of truth**: an extracted handoff bundle at `/tmp/shipit-design-handoff/shipit-ai/`,
exported from claude.ai/design. It contains:

- `project/colors_and_type.css` — the canonical token CSS (OKLCH-based dark-first system)
- `project/components/*.jsx` — 8 React primitive files (~30 components)
- `project/library/sec-*.jsx` — 12 library section files demonstrating composite patterns
- `project/Library.html` — the live showroom (TOC sidebar + 18 sections)
- `project/README.md`, `project/SKILL.md` — voice, visual foundations, iconography rules

**The brief**: "implement Library.html"; the packages must be "bullet proof and usable by
other projects"; we may "add anything missing." User decisions captured via AskUserQuestion:

1. **Library is generic + a separate ShipIt-AI composites package** for domain-specific
   surfaces (AskBar, EntityCard, GraphNode, ReasoningBlock, etc.).
2. **Storybook auto-organizes by component**, with one MDX page per section (Buttons,
   Forms, Navigation, …) — the Storybook sidebar IS the Library TOC.

---

## Architectural decisions (defaults; flag at review if any need to flip)

- **Token system flips dark-first.** `:root` now holds dark theme; `[data-theme="light"]`
  is the opt-in (replacing the previous `.dark` class convention). Updates Storybook
  theme switcher accordingly.
- **OKLCH master-hue knob.** A single CSS variable `--accent-h` (default `200`) drives
  every accent shade. Reskinning the system is a one-line change.
- **Tailwind v4 + cva stays.** I'll translate the handoff's inline-style primitives into
  Tailwind utility classes consuming the OKLCH token CSS variables via `@theme inline`.
  Hover/focus states become `hover:`, `focus-visible:` modifiers — no JS state for that.
  The handoff's variant/size matrices map cleanly to `cva`.
- **Geist fonts self-hosted.** Add `@fontsource-variable/geist` and
  `@fontsource-variable/geist-mono` deps; consumers don't depend on Google Fonts CDN.
- **Five packages** (was four):
  - `@ship-it/tokens` — design tokens (rewritten to handoff values)
  - `@ship-it/icons` — `IconGlyph` map + SVGR pipeline (kept; for future SVG icons)
  - `@ship-it/ui` — generic primitives + patterns (the bulk of the work)
  - `@ship-it/shipit` *(new)* — ShipIt-AI domain composites built on `@ship-it/ui`
  - `tsconfig` / `eslint-config` (unchanged from scaffold)

---

## Token rewrite — `packages/tokens/`

Replace every existing token module with handoff-faithful values:

| File              | Replaces                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| `src/color.ts`    | OKLCH primitives + `accentH` knob; semantic `dark` (default) and `light` maps. Adds `ok/warn/err/purple/pink` companion palette + `accentDim`/`accentGlow`/`accentText`. |
| `src/typography.ts` | Geist + Geist Mono families; sizes `eyebrow/mono/body/body-lg/h4/h3/h2/h1/display`; tracking `wide/xwide/tight/xtight`; weights 300–700. |
| `src/spacing.ts`  | 4pt scale with the handoff's irregular ramp: 1=4 / 2=8 / 3=12 / 4=16 / 5=22 / 6=28 / 8=40. |
| `src/radius.ts`   | xs=4, sm=6, md=8, base=10, lg=14, xl=18.                                       |
| `src/shadow.ts`   | Light + dark recipes (handoff's `--shadow-sm/--shadow/--shadow-lg`).           |
| `src/motion.ts`   | `duration.micro=150ms`, `duration.step=360ms`; `easing.out`, `easing.in` curves. |
| `src/elevation.ts` *(new)* | Combines shadow + inset highlight (e.g. `inset 0 1px 0 rgba(255,255,255,0.02)`) for elevated dark surfaces. |
| `src/breakpoint.ts` | (Keep current generic scale.)                                                |
| `src/z-index.ts`  | (Keep.)                                                                        |
| `src/index.ts`    | Barrel + re-export `accentH`.                                                  |

`scripts/build-css.ts` is rewritten to:
- Emit `:root { … }` (dark theme, default) and `[data-theme="light"] { … }` (light overrides only).
- Preserve `--accent-h` so `oklch(0.82 0.12 var(--accent-h))` works unmodified.
- Keep `@media (prefers-reduced-motion: reduce)` motion-zero block.

`packages/tokens/README.md` adds an "Accent hue knob" section explaining the OKLCH single-hue strategy.

---

## Icons — `packages/icons/`

Keep the SVGR pipeline (for connector logos and future SVG additions). Add a new module:

- `src/glyphs.ts` — the canonical glyph map from the README + sec-ai-marketing-icons.jsx
  (~50 entries: `brand=◆`, `service=◇`, `person=○`, `ask=✦`, `incident=◎`, `connectors=⌁`, …).
- `src/IconGlyph.tsx` — `<IconGlyph name="ask" size={14}/>` resolves the glyph string and
  renders it as styled text (`fontSize`, `color: currentColor`, `aria-hidden` if no label).
- `src/index.ts` — re-export `IconGlyph`, `glyphs`, plus the existing SVG-component barrel.

`README.md` updates: explains the glyph-first philosophy ("no Lucide, no FontAwesome — we
use unicode glyphs as a quiet engineering-console vocabulary").

---

## `@ship-it/ui` — primitives + patterns

This is the heart of the work. The Button reference component is rewritten and ~50 new
components are added. Folder layout:

```
packages/ui/src/
├── components/                  Atomic primitives (one folder each)
│   ├── Button/                  + IconButton, ButtonGroup, SplitButton, FAB
│   ├── Input/
│   ├── Textarea/
│   ├── Select/
│   ├── Checkbox/
│   ├── Radio/
│   ├── Switch/
│   ├── Slider/
│   ├── SearchInput/
│   ├── Dialog/                  + AlertDialog
│   ├── Drawer/
│   ├── Sheet/                   (bottom sheet)
│   ├── Popover/
│   ├── Tooltip/
│   ├── DropdownMenu/            + MenuItem, MenuSeparator
│   ├── ContextMenu/
│   ├── HoverCard/
│   ├── Toast/                   ToastProvider + useToast hook + ToastCard
│   ├── Badge/
│   ├── Tag/
│   ├── Chip/
│   ├── StatusDot/
│   ├── Avatar/                  + AvatarGroup
│   ├── Card/                    + StatCard
│   ├── Field/                   form-field wrapper (label/hint/error)
│   ├── Kbd/                     keyboard shortcut display
│   └── Skeleton/
├── patterns/                    Composites of primitives
│   ├── Tabs/                    underline + pill variants
│   ├── Stepper/
│   ├── Breadcrumbs/             + Crumb
│   ├── Pagination/
│   ├── Dots/                    progress dots
│   ├── CommandPalette/          keyboard-driven, with PaletteItem/PaletteGroup
│   ├── Menubar/
│   ├── Banner/                  sticky page banner (variants)
│   ├── Alert/                   inline alert (variants)
│   ├── Progress/                determinate + indeterminate
│   ├── RadialProgress/
│   ├── Spinner/
│   ├── EmptyState/              with optional chips/action
│   ├── Combobox/                autocomplete
│   ├── OTP/
│   ├── DatePicker/              calendar
│   ├── Dropzone/
│   ├── FileChip/
│   ├── Timeline/
│   ├── Tree/                    expandable
│   ├── DataTable/               sortable header, selectable rows
│   ├── Sparkline/
│   ├── Sidebar/                 + NavItem
│   └── Topbar/
├── hooks/
│   ├── useEscape.ts             ESC-key dismiss
│   ├── useOutsideClick.ts
│   ├── useTheme.ts              read/toggle [data-theme] on documentElement
│   └── useDisclosure.ts         standardized open/close state
├── primitives/                  Re-exports of Radix where we want a Ship-It wrapper API
├── utils/
│   └── cn.ts                    (kept)
├── styles/
│   ├── globals.css              expanded @theme inline bridge for ALL token vars
│   └── animations.css           keyframes (spin, pulse, indeterminate, skel, popIn,
│                                 dialogIn, slideInRight/Left, toastIn, pulse-ring)
└── index.ts                     barrel
```

**Implementation conventions per component** (extends scaffold rules):

- `forwardRef` everywhere; `asChild` via `@radix-ui/react-slot` where polymorphism makes sense
- `cva` for variant axes (`variant`, `size`, occasionally `tone`)
- All styling via Tailwind utilities consuming token CSS vars (no inline styles for static rules)
- A11y baked in: `aria-*`, role attributes, focus management; `axe` violations === 0 in tests
- `data-state` attributes for Radix-style state (`[data-state="open"]`) so consumers can override
- Each component folder: `Component.tsx` + `*.stories.tsx` + `*.test.tsx` + `index.ts`
  (matches the existing Button shape so the authoring template doesn't change)
- For complex components (Dialog, Popover, DropdownMenu, ContextMenu, Tabs), I'll layer
  on top of the matching `@radix-ui/react-*` primitive — Ship-It owns the styling,
  Radix owns the behavior + ARIA. Keeps it bullet-proof.

**Tests required per component**:
- Render happy path
- One test per interactive behavior (`userEvent` only)
- `axe` violations === 0
- For controlled components: state changes propagate via `onChange`/`onValueChange`

---

## `@ship-it/shipit` *(new package)* — domain composites

Built on `@ship-it/ui` + `@ship-it/icons`. Lives at `packages/shipit/`.

Folder layout mirrors `ui/`:

```
packages/shipit/src/
├── ai/
│   ├── AskBar.tsx              ✦ icon, scoped chips, ⌘↵, streaming caret
│   ├── CopilotMessage.tsx      user vs assistant bubbles, citation superscripts
│   ├── Citation.tsx            numbered chip + source meta
│   ├── ReasoningBlock.tsx      collapsible "Reasoning · 3 steps · 1.8s"
│   ├── ToolCallCard.tsx        TOOL badge + name + duration + args preview
│   ├── SuggestionChip.tsx      ✦ prefixed pill
│   └── ConfidenceIndicator.tsx bar + label + color by tier
├── graph/
│   ├── GraphNode.tsx           service/person/document/deployment/incident/ticket variants + states
│   ├── GraphEdge.tsx           solid/dashed/highlighted/dim, optional arrowhead
│   ├── GraphLegend.tsx         entity-type legend
│   ├── GraphMinimap.tsx        miniature node cluster + viewport rect
│   ├── GraphInspector.tsx      properties + relations panel
│   └── PathOverlay.tsx         multi-hop highlighted path
├── entity/
│   ├── EntityBadge.tsx         service / person / document / deployment / incident / ticket
│   ├── EntityCard.tsx          icon + title + sub + stats
│   └── EntityListRow.tsx       compact row variant
├── marketing/
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   ├── Testimonial.tsx
│   ├── PricingCard.tsx
│   ├── CTAStrip.tsx
│   └── Footer.tsx
├── data/
│   └── EntityTable.tsx         sortable + selectable, pre-typed for ShipIt entities
└── index.ts
```

Same authoring conventions (folder-per-component, story+test+index, axe). Package
publishes as `@ship-it/shipit` and depends on `@ship-it/ui` + `@ship-it/icons` workspace.

---

## Storybook (`apps/docs`) — Library replication

Per user choice: Storybook's sidebar IS the TOC.

- **Existing** `stories/1-Introduction.mdx` … `6-Accessibility.mdx` are kept and rewritten
  to reflect real values from the handoff (color swatches, type ramps, spacing scale).
- **New** per-section MDX pages (one per Library.html section):
  - `7-Foundations-Iconography.mdx` — full glyph inventory grid
  - `8-Foundations-Layout.mdx` — container widths, 12-col grid, split pane
  - Beyond foundations, each section is implicitly documented through the matching
    component's auto-generated docs page (Storybook's `tags: ['autodocs']`)
- **Theme switcher** (`@storybook/addon-themes`) updated to toggle
  `[data-theme="light"]` / no attribute (dark default) — matches the new convention.
- **Voice & content rules** appendix added as `9-Voice-Content.mdx` — distills the
  handoff README's voice rules ("no Get started", "no Welcome", glyphs not emoji).
- The full TOC ordering uses Storybook's title prefixing (`Foundations/Tokens/Color`,
  `Components/Inputs/Button`, `Patterns/Navigation/Tabs`, `ShipIt/AI/AskBar`).

---

## Files to add / modify (summary)

- **Modify ~12** existing scaffold files (token modules, build-css, globals.css,
  Button.*, README.md, MDX foundations, theme decorator, ui package.json deps)
- **Add ~200 new files** across the four packages — components, stories, tests, MDX,
  the new `shipit` package scaffolding (its own `package.json`, `tsconfig.json`,
  `tsup.config.ts`, `README.md`)
- **Add to `pnpm-workspace.yaml`**: nothing — `packages/*` is already globbed
- **Update root `tsconfig.json`** to add a `references` entry for `packages/shipit`

---

## Execution order (so progress is visible at every checkpoint)

1. **Tokens rewrite** — color/type/space/radius/shadow/motion/elevation + build-css. The
   visible side effect: `pnpm --filter @ship-it/tokens build` regenerates `tokens.css` with
   real values. Light/dark switch flips; existing Button still renders sensibly.
2. **Fonts wired** — `@fontsource-variable/geist[-mono]` deps added; `globals.css` imports.
3. **Icons** — `IconGlyph` + `glyphs` map ship.
4. **`@ship-it/ui` primitives** — port all 8 component files (~30 React components) plus
   Field/Kbd/Skeleton/StatusDot. Rewrite Button to match the handoff exactly.
5. **`@ship-it/ui` patterns** — port the library-section composites (~25 patterns).
6. **`@ship-it/shipit` package scaffolding + composites** — AI surfaces, graph, entity,
   marketing.
7. **Storybook** — update theme decorator; rewrite/extend MDX pages; auto-docs picks up new stories.
8. **Verification pass** — `pnpm install && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm dev`.

The plan's full surface is large (~50 components in `ui` + ~20 in `shipit`). Reality
check: even at maximum effort, this single execution may not land 100% of components in
one turn. Rule of execution: **bottom-up**. Tokens, icons, primitives first — these
unblock everything else. If we run long, defer the `shipit` composites and any patterns
that aren't structurally novel (Timeline, FileChip, Sparkline are easy adds; Tree,
DataTable, CommandPalette take more care). Whatever isn't completed is enumerated in a
follow-up section in this plan file at end of execution, so the next turn picks up cleanly.

---

## Verification

After implementation, all of these must succeed from the repo root:

```bash
pnpm install
pnpm -w typecheck                     # no TS errors anywhere
pnpm -w lint                          # ESLint clean
pnpm -w test                          # Vitest + axe — every component test passes
pnpm -w build                         # tokens + icons + ui + shipit + docs all build
pnpm --filter docs dev                # Storybook on :6006
                                      #   - sidebar shows Foundations / Components / Patterns / ShipIt
                                      #   - theme toggle in toolbar flips dark ↔ light
                                      #   - every component story renders + has autodocs
pnpm --filter docs build              # static Storybook builds clean
```

**Manual visual QA** (mandatory):
- Open Storybook, check Buttons section — every variant × size matches Library.html
- Check Forms — Input states, Select, Switch, OTP look identical to the handoff
- Check Overlays — Dialog opens/dismisses with ESC + backdrop click; focus trap works
- Toggle to light theme — every component recolors via the OKLCH light overrides
- Check `--accent-h: 280` override (manual via DevTools) — UI shifts to purple harmonically

---

## Out of scope (intentionally — for follow-up turns or never)

- **Charts beyond Sparkline.** Library.html shows line/bar/donut/heatmap as hand-rolled
  SVGs with hardcoded data. For a published library, recommend consumer apps adopt
  Recharts or Visx; we ship only the small standalone Sparkline.
- **Live drag/drop Kanban.** Demonstrated in Library.html but not a primitive; consumers
  who need DnD use `@dnd-kit/core` directly.
- **Live SortableTable demo state.** The DataTable ships sort behavior; demo data lives
  in the story.
- **Code blocks / Diff / Terminal** as components. Library.html shows hand-styled SVG-ish
  blocks; consumers wanting real syntax highlighting should use Shiki or Prism.
- **Connector logo SVGs.** Listed by name (GitHub, Notion, Slack, etc.) but the handoff
  uses unicode placeholders. We add the `IconGlyph` system; real SVG connector marks
  are a follow-up polish PR.
- **Visual regression / Chromatic.** Easy to layer on later; not blocking.
- **Publishing to npm.** Changesets is wired but no package will be published until
  the user says so.
