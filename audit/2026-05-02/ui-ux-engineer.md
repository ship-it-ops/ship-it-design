# UI/UX Engineer — audit findings

## Verdict

The design language is coherent and visually mature for a 0.0.1 system: dark-first with a single OKLCH `--accent-h` knob, semantic two-layer color tokens, a thoughtful 8-step spacing ramp that intentionally skips 7, named motion durations and easings, and a `Field` form wrapper that wires IDs invisibly. cva is used everywhere variants exist, default variants are set, and `Button` is a clean canonical reference. **But the design-token system has three credibility breakers.** First, the z-index scale is dead code — `packages/tokens/src/z-index.ts` defines `dropdown:1000, modal:1300, popover:1400, toast:1500, tooltip:1600`, but every overlay component ad-hocs `z-30/40/50/[51]/[60]/[70]` literal Tailwind classes that don't even line up with the scale; the "named stacking layers" promise is not reified. Second, the variant-naming vocabulary is split three ways across components: `Alert`/`Banner` use `variant: 'info' | 'ok' | 'warn' | 'err'`, `Progress`/`RadialProgress` use `tone: 'accent' | 'ok' | 'warn' | 'err'`, and `EmptyState` uses `tone: 'accent' | 'danger' | 'muted'` — `accent`↔`info`, `err`↔`danger`, `muted` exists only here. Third, the state-change callback name varies across components — `onChange` (Combobox), `onValueChange` (DatePicker, Tabs), `onSelect` (Calendar, Tree), `onSelectionChange` (DataTable). The OKLCH accent knob does work — but several components bypass it with hardcoded `oklch(...)` literals (`Avatar`, `Input` error ring, `Textarea` error ring, `GraphMinimap`, `CTAStrip`), and `SplitButton` even reaches for `border-r-black/20` which is theme-blind. Token vocabulary mismatches in per-package READMEs (`bg-brand`, `colorSemanticLight.background`) compound the credibility issue. The empty `packages/ui/src/primitives/` directory documented as a category is the visible artifact of an unfinished category boundary.

## P0 — blockers

- **Z-index token scale exists but is never consumed** — `packages/tokens/src/z-index.ts:6-16`, every overlay component
  - What: `zIndex` defines `base:0, raised:10, dropdown:1000, sticky:1100, overlay:1200, modal:1300, popover:1400, toast:1500, tooltip:1600`. The `@theme inline` block in `packages/ui/src/styles/globals.css:44-119` does not register any z-index token with Tailwind. Components hardcode arbitrary numbers: `Tooltip.tsx:27` uses `z-[60]` (token says 1600), `Toast.tsx:89` uses `z-[70]` (token says 1500), `Dialog.tsx:25,52` uses `z-50`/`z-[51]` (token says 1300), `Popover.tsx:22` uses `z-40` (token says 1400), `Banner.tsx:25` uses `z-30` (token says 1100), `DataTable.tsx:161` uses `z-10`, `Combobox.tsx:231` uses `z-30`. Both the values and the *ordering* differ from the token scale.
  - Why it matters: the entire promise of "use these named layers instead of arbitrary numbers so stacking conflicts can be reasoned about globally" (the JSDoc on `z-index.ts:1-4`) is unfulfilled. A consumer who reads the docs and uses `z-modal` will get nothing, and a contributor who looks at `Tooltip` to see how the token system applies sees `z-[60]` and concludes the system isn't real.
  - Fix: add `--z-base: 0; --z-dropdown: 1000; --z-modal: 1300; …` to `tokens.css`, register them under `@theme inline` so Tailwind generates `z-modal`/`z-tooltip` utilities, then sweep every overlay component to consume the tokens. This is the single change that makes the rest of the token-system claim believable.

- **State-change callback prop name is split across at least four conventions** — `packages/ui/src/patterns/Combobox/Combobox.tsx`, `packages/ui/src/patterns/DatePicker/DatePicker.tsx:17`, `packages/ui/src/patterns/DatePicker/Calendar.tsx:39`, `packages/ui/src/patterns/Tree/Tree.tsx:40`, `packages/ui/src/patterns/DataTable/DataTable.tsx:50`, `packages/ui/src/patterns/Tabs/Tabs.tsx:55`
  - What:
    - `Tabs` → `onValueChange` (Radix passthrough)
    - `DatePicker` → `onValueChange`
    - `Calendar` → `onSelect`
    - `Tree` → `onSelect`
    - `DataTable` → `onSelectionChange`
    - `Combobox` → `onChange`
    - Native `Input`/`Textarea` → `onChange` (HTML)
  - Why it matters: the central feel of a design system is "guess the prop name without checking the docs." A consumer who memorizes `onValueChange` from `<Tabs>` types it for `<Tree>` and gets a TypeScript error. The vocabulary contradicts itself within the same package.
  - Fix: pick one and migrate. Recommended convention (matches Radix and shadcn): `onValueChange` for single-value controlled components, `onSelectionChange` for multi-select (DataTable is correct), and `onChange` reserved for native HTML form controls only. Update `Calendar`, `Tree`, `Combobox` and add JSDoc deprecation aliases for one minor.

- **Variant prop name is split between `variant` and `tone`; option names are split three ways** — `packages/ui/src/patterns/Alert/Alert.tsx:18`, `packages/ui/src/patterns/Banner/Banner.tsx:18`, `packages/ui/src/patterns/Progress/Progress.tsx:27`, `packages/ui/src/patterns/RadialProgress/RadialProgress.tsx`, `packages/ui/src/patterns/EmptyState/EmptyState.tsx:14`, `packages/ui/src/components/Input/Input.tsx:19`, `packages/ui/src/components/Textarea/Textarea.tsx:16`
  - What:
    - `Alert` → `variant: 'info' | 'ok' | 'warn' | 'err'`
    - `Banner` → `variant: 'info' | 'ok' | 'warn' | 'err'`
    - `Progress` → `tone: 'accent' | 'ok' | 'warn' | 'err'` (`info` becomes `accent`)
    - `RadialProgress` → `tone: 'accent' | 'ok' | 'warn' | 'err'` (same)
    - `EmptyState` → `tone: 'accent' | 'danger' | 'muted'` (`err` becomes `danger`, `muted` exists nowhere else)
    - `Input`/`Textarea` → `tone: 'default' | 'error'` (yet another vocabulary)
    
    So `variant` vs `tone` is split, `info` vs `accent` is split, `err` vs `danger` is split, and `muted` is a one-off.
  - Why it matters: `<Alert variant="err">` and `<EmptyState tone="danger">` mean the same thing. A consumer who learns one will guess wrong on the other. Worse, `<Alert variant="info">` and `<Progress tone="accent">` ALSO mean the same thing. The vocabulary doesn't compose.
  - Fix: rename for one shared convention. Recommended: keep `variant` for visual style (e.g., `Button`'s primary/secondary/ghost/outline/destructive/success/link, `Tabs`' underline/pill, `Card`'s elevated/outlined), and use `tone` for semantic intent (`accent | ok | warn | err`). Then enforce both vocabularies across every component. Drop `info` (= `accent`), drop `danger` (= `err`), drop `muted` (or promote it as a real tone token).

## P1 — high priority

- **`SplitButton` hardcodes `border-r-black/20`** — `packages/ui/src/components/Button/SplitButton.tsx:36`
  - What: `className="rounded-r-none border-r border-r-black/20"`. `black/20` is a Tailwind utility that resolves to `rgba(0,0,0,0.2)` regardless of theme.
  - Why it matters: in light mode (where the button itself sits on `bg-accent` / a colored background), this border is barely visible; in dark mode it's invisible. The split between the two button halves is exactly what the component needs to communicate, and it's the one thing you can't see.
  - Fix: use a token. `border-r-border-strong` for outline/secondary, or `border-r-on-accent/20` (introduce the token if needed) for primary/destructive. The right answer depends on the per-variant pairing.

- **Multiple components hardcode `oklch(...)` literals that bypass the accent-knob and the token system** — `packages/ui/src/components/Input/Input.tsx:22`, `packages/ui/src/components/Textarea/Textarea.tsx:18`, `packages/ui/src/components/Avatar/Avatar.tsx:68`, `packages/shipit/src/graph/GraphMinimap.tsx:78`, `packages/shipit/src/marketing/CTAStrip.tsx:25`
  - What:
    - `Input` error ring: `focus-within:ring-[oklch(0.55_0.18_30/0.18)]` — a hardcoded red, not the `--color-err` token
    - `Textarea` error ring: same hardcoded red
    - `Avatar` initial-fallback bg: `style={{ background: \`oklch(0.4 0.1 ${hue})\` }}` — hue derived from the user's name, but L+C are baked-in literals so reskins to `--accent-h` won't propagate
    - `GraphMinimap` viewport tint: `'oklch(0.8 0.12 200 / 0.12)'` — hardcodes the *default* `--accent-h: 200`. A consumer who switches `--accent-h: 280` for purple will see GraphMinimap stay cyan.
    - `CTAStrip` background: `bg-[linear-gradient(135deg,oklch(0.2_0.08_260),oklch(0.16_0.06_300))]` — completely outside the token system; light theme will look the same dark.
  - Why it matters: the central design-system pitch is "one knob reskins everything." Five components silently ignore the knob.
  - Fix: in `Input`/`Textarea` error ring, use `ring-err/30` (or introduce a `--color-err-glow` token mirroring `--color-accent-glow`). In `Avatar`, add `--color-avatar-fallback-{0..n}` tokens or accept that hue rotation is "design-intentional" and document it. In `GraphMinimap`, switch to `var(--color-accent-glow)` or a new `--color-graph-viewport` token. `CTAStrip` is marketing — flag for design review; it likely needs its own dedicated marketing-only tokens.

- **Companion palette (`ok`/`warn`/`err`/`purple`/`pink`) uses identical OKLCH for both themes — light-theme contrast not validated** — `packages/tokens/src/color.ts:29-35`, `packages/tokens/src/color.ts:64-81`
  - What: `colorPrimitive` defines `ok: oklch(0.82 0.17 150)`, `warn: oklch(0.82 0.16 75)`, `err: oklch(0.72 0.19 25)`. These were tuned for dark backgrounds (look great on `#0a0a0b`). The light theme block (`color.ts:64-81`) overrides bg/panel/text/accent but not the companion palette — the comment at line 80 even says "Companion palette is theme-invariant." Means `text-err` (orange-red at L=0.72) sits on light `bg` `#fbfbfa` at roughly **3.0:1** — borderline body-text fail; same shape for `text-warn` (yellow at L=0.82 = ~1.5:1, total contrast fail).
  - Why it matters: light theme silently produces failing contrast wherever ok/warn/err is used as text. The Field error message (`Field.tsx:59` `text-err`) is one of the most-rendered uses of this palette and it's unreadable on light. (A11y persona did the contrast math on `text-text-dim` and `text-accent`; same exercise on companion palette would add ~3 more P0s.)
  - Fix: introduce `colorPrimitiveLight` ramps tuned to higher L for fg roles and lower L for bg roles, and split each companion role into a paired `*-bg`/`*-fg` (next finding).

- **No paired `*-fg`/`*-bg` tokens for ok/warn/err** — `packages/tokens/src/color.ts:38-61`, `packages/ui/src/styles/globals.css:44-66`
  - What: `--color-on-accent: #0a0a0b` exists (the foreground for components that sit on `bg-accent`). No `--color-on-ok`, `--color-on-warn`, `--color-on-err`. So a "success" toast or button with `bg-ok` has no semantic foreground token to use; components default to `text-on-accent` (`Button.tsx:30` for `success` variant) which happens to be near-black — accidentally readable on the bright OK green, but only because both happen to need dark text. Brittle.
  - Why it matters: any time a designer swaps a tone palette, the foreground breaks invisibly. Also: `Banner.tsx:21-24` solves this by drowning the bg in `color-mix(in_oklab,var(--color-X),transparent_82%)` so the background is *barely* tinted — clever, but it's a workaround for missing paired tokens.
  - Fix: add `okFg`, `warnFg`, `errFg`, `purpleFg`, `pinkFg` aliasing `#0a0a0b` (dark) / `#ededef` (light) per the contrast each ramp needs. Update `Button` `success`/`destructive` and any `bg-ok`/`bg-err` consumer.

- **Variant *count* is split across the Button family** — `packages/ui/src/components/Button/Button.tsx:21-32`, `packages/ui/src/components/Button/IconButton.tsx:14`, `packages/ui/src/components/Button/SplitButton.tsx:9`
  - What: `Button` ships 7 variants (`primary, secondary, ghost, outline, destructive, success, link`). `IconButton` ships 4 (`primary, secondary, ghost, outline`). `SplitButton` ships 3 (`primary, secondary, outline`).
  - Why it matters: a consumer with a "Delete" `<IconButton>` cannot use `variant="destructive"` even though the parent `Button` supports it. The arbitrary subset means design intent doesn't propagate across the family.
  - Fix: bring `IconButton` and `SplitButton` to parity with `Button`. If certain variants don't make sense for icon-only (say, `link`), document the exclusion in a JSDoc rather than silently dropping support.

- **`Chip` requires `removable={true}` AND `onRemove`; `Tag` only requires `onRemove`** — `packages/ui/src/components/Chip/Chip.tsx:9-10,35`, `packages/ui/src/components/Tag/Tag.tsx:7,36`
  - What: API mismatch covered by SE persona at the type-correctness angle. UI/UX angle: `Chip` and `Tag` are visually similar enough that consumers will conflate them; making `removable` mandatory in one but not the other is a footgun.
  - Why it matters: in a one-day onboarding, three different developers will write `<Chip onRemove={fn}>` with no removal affordance and silently no callback firing.
  - Fix: drop `removable` from `Chip`; render the close-X whenever `onRemove` is set (matches Tag). Or (better) ask: are `Chip` and `Tag` actually different? If they're visual variants of the same concept, merge them.

- **Empty `packages/ui/src/primitives/` directory referenced as a category by 3 docs** — `packages/ui/src/primitives/`, `README.md:19`, `docs/architecture.md:109`, `packages/ui/README.md:18`
  - What: documented as "Thin wrappers over Radix when we want a Ship-It-flavored API" but the directory contains zero files. The components folder already has Dialog, DropdownMenu, Popover etc. that *are* thin Radix wrappers — so the category is conceptually muddled. There's no rule for what would qualify for `primitives/` vs `components/`.
  - Why it matters: a contributor adding a new Radix-backed component has no clear placement rule. Three documented categories (primitives / components / patterns) but only two exist.
  - Fix: either (a) delete the empty directory and update the docs to two categories, or (b) define and enforce the boundary — e.g., `primitives/` is "Slot/asChild-shaped Ship-It-flavored Radix re-exports without ShipIt visual styling" and migrate the relevant files.

- **`Banner` and `Alert` use the wrong ARIA role for static content** — `packages/ui/src/patterns/Banner/Banner.tsx:55`, `packages/ui/src/patterns/Alert/Alert.tsx:67`
  - What: both apply `role={variant === 'err' || variant === 'warn' ? 'alert' : 'status'}`. `role="alert"` is `aria-live="assertive"` and announces the moment the element appears in the DOM — including initial page render. (Cross-flagged by A11y P1; UI/UX angle: this is a misuse of semantic component APIs.)
  - Why it matters: a static "warn" banner that tells the user "this branch is read-only" interrupts every screen-reader user on every page load. Severity from the UX angle is high: it's loud feedback from a passive surface.
  - Fix: separate `role` from `variant`. Add a `live?: 'off' | 'polite' | 'assertive'` prop or default `role="status"` for all initial-render uses; consumers that need an interrupt mount the Banner conditionally and pass `live="assertive"`.

- **Token vocabulary documented in per-package READMEs does not match the actual token names** — `packages/ui/README.md:54`, `packages/tokens/README.md:18`
  - What: `packages/ui/README.md:54` example uses `bg-brand` (token doesn't exist; the role is `accent`). `packages/tokens/README.md:18` lists "semantic aliases like background, text, border, brand" — actual names are `bg`, `panel`, `text`, `text-muted`, `text-dim`, `border`, `border-strong`, `accent`, `accent-text`, `accent-dim`, `accent-glow`, `ok`, `warn`, `err`, `purple`, `pink` — `background` and `brand` aren't real.
  - Why it matters: a consumer's first contact with the token vocabulary is the README. If the README's examples are wrong, every subsequent decision they make is built on a false mental model. (PM persona owns the doc fix; UI/UX angle: the *token vocabulary itself* is what's at stake — the inconsistency between docs and code is a design-system credibility issue.)
  - Fix: PM persona's fix.

## P2 — medium

- **209 instances of `[Npx]` arbitrary Tailwind values across components/patterns** — `grep -rn '\[[0-9]\+px\]' packages/ui/src/{components,patterns}/`
  - What: token-bypass count. Examples: `Button.tsx:34-36` `h-[26px] px-[10px] text-[11px] gap-[5px] rounded-[5px]` (small button), `Field.tsx:43` `text-[11px]`, `Banner.tsx:14` `gap-[10px] px-[14px] text-[12px]`, `Alert.tsx:17` `text-[13px]`, `Field.tsx:54,59` `text-[11px]`. Some are intentional sub-token precision (button heights), but the `text-[11px]` / `text-[12px]` / `text-[13px]` pattern is widespread despite the existence of `--text-eyebrow`, `--text-mono`, `--text-body` tokens.
  - Why it matters: the typography scale is a real design decision — `font-size-eyebrow`, `font-size-body` etc. are defined in `packages/tokens/src/typography.ts`. Components ignoring it means a typography update by design propagates to nothing.
  - Fix: map each `text-[Npx]` to the closest typography token (or add a new one if the design intent is genuinely a new size). At minimum: `text-[11px]` → `text-eyebrow`, `text-[12px]` → `text-mono`, `text-[13px]` → `text-body` (or adjust the tokens to match the most common literal).

- **Field uses a render-prop pattern; Combobox/Select use Radix passthrough — two API styles for similar concerns** — `packages/ui/src/components/Field/Field.tsx:18-22`
  - What: `Field` requires a render-prop child: `<Field label="Email">{(p) => <Input {...p} />}</Field>`. Combobox/Select etc. don't do this — they wire their own labelling via Radix Label or aria-label.
  - Why it matters: a consumer who learns the render-prop pattern for inputs will reach for it on Combobox and find it doesn't compose. The render-prop is also unusual in modern React — Radix-style compound components with `<Field.Root>`/`<Field.Label>`/`<Field.Control>` are more idiomatic.
  - Fix: refactor `Field` to a compound-component shape (or to React Aria Components-style provider). Defer.

- **`SplitButton` "More actions" `aria-label` is hardcoded and not configurable** — `packages/ui/src/components/Button/SplitButton.tsx:45`
  - What: `aria-label="More actions"`. A consumer with a `<SplitButton>Deploy</SplitButton>` would want the menu button to read "More deploy actions" or similar.
  - Why it matters: minor — accessibility consequence is real but small.
  - Fix: accept `menuAriaLabel?: string` defaulting to `"More actions"`.

- **`Card` has `variant` for visual style but the option set is unclear** — `packages/ui/src/components/Card/Card.tsx:10`
  - What: did not deep-read; flagging that `Card` having a `variant` while `EmptyState`/`Progress` use `tone` reinforces the P0 vocabulary split.
  - Fix: covered by the P0 vocabulary unification.

- **`Avatar` and `AvatarGroup` redeclare the `sizePx` map** — `packages/ui/src/components/Avatar/Avatar.tsx:9`, `packages/ui/src/components/Avatar/AvatarGroup.tsx:7`
  - SE persona covered. From UI/UX angle: a single `sizePx` should live next to the `cva` definition for `Avatar` so the size scale is centrally owned.

- **Story controls use `inline-radio` for variants/sizes — good** — sample of `*.stories.tsx`
  - What: spot-check confirms `argTypes: { variant: { control: 'inline-radio', options: [...] } }` in Banner, Alert, Button, IconButton, Badge stories. Good.
  - Gap: I did not inventory whether every component has a "States" composite story (per `docs/adding-a-component.md:65` requirement). PM/SE persona would catch the test-existence side; UI/UX side: a "States" story per component would surface the loading/error/disabled rendering as part of the docs page.

- **Glyph aliasing creates a non-injective vocabulary** — `packages/icons/src/glyphs.ts:18-95`
  - What: multiple keys map to the same glyph: `service`/`serviceOutline` both `◇`, `incident`/`target` both `◎`, `cmd`/`schema`/`menu` all `≡`, `ask`/`sparkle` both `✦`, `next`/`upRight`/`external` all `↗` (well, `next` is `→` — re-check). `confirm`/`check` both `✓`, `close`/`dismiss` both `×`, `warn`/`warnAlt` both `!`.
  - Why it matters: if these are intentional aliases, document them ("`incident` is the canonical name, `target` is a deprecated alias"). If accidental, fix the duplicates. As-is, the glyph→name lookup is one-to-many and impossible to invert.
  - Fix: document semantic aliases in JSDoc, or split into "primary glyphs" + "alias map" so the data model reflects the intent.

- **`Input` error-state ring color hardcoded `oklch(0.55_0.18_30/0.18)`** — `packages/ui/src/components/Input/Input.tsx:22`
  - Already P1. The L=0.55 ring is the design's intended "error red ring" but the value isn't tied to the `--color-err` token. As soon as `colorPrimitive.err` shifts (e.g., to a more accessible red), the ring will not follow.
  - Fix: covered by P1.

- **Avatar's hue-derived background uses `oklch(0.4 0.1 ${hue})` with hand-picked L+C** — `packages/ui/src/components/Avatar/Avatar.tsx:68`
  - Already P1. From UI/UX angle: the hue rotation (8 distinct hues from the user's name) is a strong UX choice; the L+C choice is fine but should be tokenized so it can be re-tuned globally.
  - Fix: covered by P1.

- **The `--color-on-accent` foreground is *always* `#0a0a0b` regardless of theme** — `packages/ui/src/styles/globals.css:66`
  - What: comment at line 65 says "Always near-black, regardless of theme." This is correct only as long as `--color-accent` stays light (`oklch(0.82 …)` dark, `oklch(0.72 …)` light). If `--accent-h` is rotated to a hue where L=0.72 happens to look darker (e.g., a saturated blue), `text-on-accent` flips to dark-on-dark.
  - Why it matters: the OKLCH knob is a great idea, but `on-accent` should depend on the resolved L of the accent, not be hardcoded. (Could be done with `light-dark()` once browser support catches up, or with a runtime check.)
  - Fix: document the knob's safe range, or add a runtime "auto-pick fg" using `color-mix(in oklab, white 70%, transparent)` against the accent.

- **`Alert` uses `border-l-2 border-l-accent` for the info variant** — `packages/ui/src/patterns/Alert/Alert.tsx:21`
  - What: a left "rule" tied to the accent knob. Visually nice. But the variants `ok`/`warn`/`err` use `border-l-ok`/`border-l-warn`/`border-l-err` directly — not the `tone` API the rest of the system would suggest.
  - Fix: covered by P0 vocabulary unification.

- **No `Card` "elevated" vs "outlined" inventory at-a-glance** — `packages/ui/src/components/Card/Card.tsx:10` (variant)
  - What: did not catalog; flag for follow-up.

- **`Tabs` exposes a context (`TabsVariantContext`) so child `TabsList`/`TabsTrigger` know the variant — clean** — `packages/ui/src/patterns/Tabs/Tabs.tsx:19`
  - Good pattern; flagging as a positive reference for other compound components.

## P3 — nits

- **`Banner` has `sticky` as a cva variant** — `packages/ui/src/patterns/Banner/Banner.tsx:23-26`
  - Works, but `sticky` is a layout concern, not a visual variant. A boolean prop is fine — flagging as a stylistic preference, not a bug.

- **`Field` uses `useId()` then prefixes with `field-`** — `packages/ui/src/components/Field/Field.tsx:34-35`
  - Fine. SSR-safe.

- **`Button.cva` puts `transition-[background,filter,box-shadow,color]` on every button** — `packages/ui/src/components/Button/Button.tsx:14`
  - The transition list is fine but `box-shadow` transitions can be expensive on long lists. Acceptable.

- **`Banner` `Banner.tsx:60` `defaultGlyph[variant!]` non-null assertion** — covered by SE.

- **`SplitButton` chevron is hardcoded `▾`** — `packages/ui/src/components/Button/SplitButton.tsx:48`
  - Could be sourced from `glyphs.collapse` or accept an `icon` prop. Trivial.

- **`Banner.tsx:14` `gap-[10px]` is between `--spacing-2: 8px` and `--spacing-3: 12px`** — token gap by design? Or arbitrary?
  - Likely arbitrary; consider snapping to `--spacing-3`.

- **`Card.tsx` `interactive: boolean` is a separate prop from `variant`** — fine; but consider whether `interactive` should derive from `onClick` presence (covered as a separate ARIA concern by SE/A11y).

## Out of scope / not assessed

- TypeScript correctness, type holes (SE persona)
- Component code-correctness (SE persona owns hook bugs, dead code, dependency hygiene)
- Keyboard navigation, focus management, ARIA roles, contrast math beyond identifying token-level color choices that fail (A11y persona; my P1 on companion palette is a token-level call-out, the A11y persona has the per-component impact list)
- CI / release / build tooling (DevOps)
- React internals, SSR, RSC, bundle output (Frontend)
- README/docs accuracy (PM)
- Did not deep-read every component; spot-checked Button, IconButton, SplitButton, Banner, Alert, Field, Tabs, plus token files for color/z-index/motion/spacing. Patterns Combobox, DataTable, CommandPalette, DatePicker, Tree, Sidebar were sampled at API/prop level but not for full visual or compound-component review.
- Did not run Storybook visually; story coverage assertions are based on file existence (76 stories per repo count) and a stories sample, not page-by-page review.
- Did not inventory whether every CSS variable in `tokens.css` is exposed via `@theme inline` — flagging the z-index gap is the load-bearing one; spacing/typography/radius/shadow appear complete.
- Did not check `breakpoint.ts` and `elevation.ts` against actual responsive class usage in components.
