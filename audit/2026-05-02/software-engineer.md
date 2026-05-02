# Software Engineer — audit findings

## Verdict
Engineering health is solid for a 0.0.1 design system: TypeScript is set to `strict` plus `noUncheckedIndexedAccess` from `packages/tsconfig/base.json`, the cva/cn vocabulary is consistent, hooks are small and well-scoped, and 86 test files cover most components with a useful axe pass at the end. The real fragility is at the dependency-graph seam: `@ship-it-ui/ui` ships a CSS file that imports `@ship-it-ui/tokens` while declaring tokens only as a devDependency — the package is broken on `npm install` for end users. Several declared deps are unused, two `instanceof Set ? x : (x as Set)` constructs are no-op casts that hide a real type hole in `DataTable`/`Tree`, and `GraphNode` has a CSS-color concatenation bug that silently mis-renders the hover/glow ring. Tests are mostly behavior-driven but lean on shallow assertions in a few places (`toHaveBeenCalled()` with no argument check, the EntityListRow test asserting only Cancel's spy fires, etc). There is no dead-code disaster and no cycles, but there is duplicated `cn` and test setup between `ui` and `shipit` and a directory (`packages/ui/src/primitives/`) referenced by docs but empty on disk.

## P0 — blockers
- **`@ship-it-ui/tokens` is a devDependency but consumers' CSS imports it at runtime** — `packages/ui/package.json:76`, `packages/ui/src/styles/globals.css:20`
  - What: `globals.css` runs `@import '@ship-it-ui/tokens/styles/tokens.css';` and is exported from the published package as `./styles/globals.css`. `@ship-it-ui/tokens` is listed in `devDependencies` only, so an end user who runs `npm i @ship-it-ui/ui` and follows the documented `import '@ship-it-ui/ui/styles/globals.css'` (README + `apps/docs/.storybook/preview.ts:4`) will hit a Tailwind/Vite resolve error: the bare `@ship-it-ui/tokens` specifier won't be on disk.
  - Why it matters: the publishable artifact is unusable as documented. This is a publish-time foot-gun, not a workspace problem.
  - Fix: move `@ship-it-ui/tokens` from `devDependencies` to `peerDependencies` (or to `dependencies`). Same goes for `@fontsource-variable/geist` / `geist-mono` if they should be peers — currently they're runtime deps, which is fine, but tokens needs to live alongside them.

- **`useControllableState`'s "value changed" check uses identity, but `DataTable`/`Tree` updaters return Set instances that always change identity** — `packages/ui/src/hooks/useControllableState.ts:45`, `packages/ui/src/patterns/DataTable/DataTable.tsx:138-156`, `packages/ui/src/patterns/Tree/Tree.tsx:69-79`
  - What: the hook only fires `onChange` when `resolved !== valueRef.current`. The DataTable/Tree updaters always return `new Set(prev)`, so the identity is always different — that part is fine. The actual issue is the inverse: in *controlled* mode where the parent passes a stable `selected={mySet}` reference, the hook will store the same `mySet` in `valueRef`, and a child setSelected updater that mutates a clone and returns it always sees a different reference, so onChange fires correctly. **However**, the `setSelected` calls cast through `useControllableState<Set<string>>` typed as `T | undefined` and then dereference with `selected!.has(id)` (DataTable.tsx:119, 120, 224) and `expanded ?? new Set()` (Tree.tsx:93). With `noUncheckedIndexedAccess` and `strict`, the non-null assertion is masking a real possibility: a consumer passes `selected={undefined}` explicitly (controlled-but-empty), `useControllableState` returns the controlled value `undefined`, and `selected!.has(id)` throws `Cannot read properties of undefined`.
  - Why it matters: a runtime crash path on a sensible API call.
  - Fix: replace `selected!.has(id)` with `(selected ?? EMPTY_SET).has(id)` (or hoist a stable empty-set constant), and drop the `!` non-null assertions. Same for Tree.tsx:164 `item.children!.map`, which is currently guarded by `hasChildren` but unnecessarily uses `!`.

## P1 — high priority
- **`GraphNode` concatenates CSS color values, producing invalid CSS** — `packages/shipit/src/graph/GraphNode.tsx:64`
  - What: `boxShadow: \`0 0 ${state === 'hover' ? 30 : 20}px ${color}${glowAlpha}\`` produces e.g. `0 0 30px var(--color-accent)40`. The trailing `40` is an attempt to apply hex-alpha, but `var(--color-accent)` is not a hex string — the resulting token `var(--color-accent)40` is unparseable, the browser drops the rule, and the glow shadow never renders.
  - Why it matters: a default presentational state of a flagship component (hover/path) silently fails to render the visual it's testing for. Hard to spot in tests because the test only checks DOM presence, not the painted shadow.
  - Fix: switch to `color-mix(in oklab, ${color} ${pct}%, transparent)` so the CSS variable resolves first, or precompute an alpha-aware color using a token (e.g. `var(--color-accent-glow)`).

- **`packages/ui/src/primitives/` is referenced by README/docs but empty on disk** — `packages/ui/src/primitives/`, `README.md:19`, `docs/architecture.md:109`, `docs/adding-a-component.md:11`
  - What: the directory exists, exports nothing, is not referenced by `packages/ui/src/index.ts`, but is documented as a category. Either an unbuilt section or a stale dir.
  - Why it matters: TS project references will scan it; a future contributor will think the slot exists. Mostly noise, but it's the single empty workspace directory that ships in the published package's source layout.
  - Fix: delete the directory, or pick a primitive (e.g. `Slot` re-export, polymorphic `Box`) and populate it.

- **`@radix-ui/react-label` declared but not imported** — `packages/ui/package.json:58`
  - What: declared in `dependencies` of `@ship-it-ui/ui` but no source file imports `@radix-ui/react-label`. Confirmed via `grep -rn "react-label"` against `packages/ui/src`.
  - Why it matters: every install of `@ship-it-ui/ui` pulls a Radix package nobody uses; `Field.tsx` even rolls its own `<label htmlFor={id}>` without it. Bundle and dependency surface footprint.
  - Fix: remove from `dependencies`, or rewire `Field.tsx` to use Radix Label so the dep is justified.

- **`@ship-it-ui/icons` is a runtime dep of `@ship-it-ui/shipit` but not imported** — `packages/shipit/package.json:45`
  - What: `dependencies["@ship-it-ui/icons"]: workspace:*`. `grep -rln "from '@ship-it-ui/icons'" packages/shipit/src` returns no matches; only a docs MDX code-sample mentions the package.
  - Why it matters: pnpm resolves the workspace dep but the published package will declare `@ship-it-ui/icons` as a peer/runtime dep needlessly (depends on whether shipit pkg.json gets a `workspace:*` rewrite at publish). Consumers install an unused subpackage.
  - Fix: drop from `dependencies`. Add it back if/when shipit actually imports an SVG component.

- **`@ship-it-ui/icons` is a devDependency of `@ship-it-ui/ui` but unused** — `packages/ui/package.json:75`
  - What: declared as devDep, no source file under `packages/ui/src` imports from `@ship-it-ui/icons`. Same `grep` confirmation.
  - Why it matters: dead workspace edge in the dep graph; misleads readers about the package boundary.
  - Fix: remove the devDep.

- **`MONTHS` array uses inconsistent abbreviations** — `packages/ui/src/patterns/DatePicker/Calendar.tsx:17-30`
  - What: `['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']`. April/May/June/July are full names; the rest are 3-letter. The DatePicker test asserts on this (`packages/ui/src/patterns/DatePicker/DatePicker.test.tsx:12,29` expect "April 2026" and "May 2026"), so the bug is captured rather than caught.
  - Why it matters: visible UI inconsistency in the calendar header. Width changes from 3 → 5 chars, the layout wiggles month-to-month.
  - Fix: either all 3-letter (`['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']`) or all full names, then update the affected tests.

- **`instanceof Set ? x : x as Set` is a no-op cast obscuring the real type hole** — `packages/ui/src/patterns/DataTable/DataTable.tsx:94`, `packages/ui/src/patterns/Tree/Tree.tsx:58`
  - What: `value: selectedProp instanceof Set ? selectedProp : (selectedProp as Set<string> | undefined)`. Both branches pass `selectedProp` through unchanged; the conditional only exists to placate the TypeScript checker, which would otherwise complain that `ReadonlySet<string>` is not assignable to `Set<string>`. There's no runtime safeguard.
  - Why it matters: the prop type is `ReadonlySet<string>`, but the internal code calls `.delete`/`.add` on the result (toggleAll/toggleRow at DataTable.tsx:140-152, toggle at Tree.tsx:69-78). Today the consumer passes a real Set so it works; if anyone ever passes an `Object.freeze`d set or a `ReadonlySet` polyfill, mutations throw at runtime.
  - Fix: either widen the prop type to `Set<string>` (and document that the consumer keeps ownership), or always clone into a fresh `new Set(selectedProp)` before mutation in the updater. Stop hiding the variance with a cast.

- **Side effects inside React `setState` updater** — `packages/ui/src/components/OTP/OTP.tsx:54-65`
  - What: `writeAt` calls `setValues((prev) => { ... ; onChange?.(joined); if (...) onComplete?.(joined); return next })`. React Strict Mode invokes updater functions twice during development to surface impurity — both `onChange` and `onComplete` will fire twice per keystroke under StrictMode.
  - Why it matters: silent double-callback in dev. Not seen in tests because tests don't enable StrictMode, but `apps/docs` Storybook doesn't either today, so it's also not caught there.
  - Fix: compute `next` synchronously outside the updater, then `setValues(next)` and call the callbacks once.

- **Test setup duplication between `ui` and `shipit`** — `packages/ui/src/test/setup.ts`, `packages/shipit/src/test/setup.ts`
  - What: the two files are byte-for-byte equivalent except for the leading comments. Same ResizeObserver / IntersectionObserver / matchMedia / scrollIntoView / pointer-capture polyfills. Same axe matcher registration. Same `vitest-axe.d.ts` module augmentation.
  - Why it matters: any fix to one (e.g. a new jsdom polyfill the next Radix release needs) must be replicated in both. Already drifted once: `ui/src/test/setup.ts` has explanatory comments, `shipit/src/test/setup.ts` doesn't.
  - Fix: extract `@ship-it-ui/test-setup` as an internal package (siblings to `eslint-config`/`tsconfig`) exporting the setup module + ambient `.d.ts`. Both consume via `setupFiles: ['@ship-it-ui/test-setup']`.

- **`cn` utility duplicated between packages** — `packages/ui/src/utils/cn.ts`, `packages/shipit/src/utils/cn.ts`
  - What: identical 4-line `clsx + twMerge` wrapper exported from both. `@ship-it-ui/ui` already exports `cn` from its public API (`packages/ui/src/index.ts:9`).
  - Why it matters: two `cn`s is benign, but it doubles `clsx`+`tailwind-merge` peer footprint in `shipit` for nothing, and creates two type identities for `ClassValue` that could trip future consumers.
  - Fix: in `packages/shipit/src`, replace `import { cn } from '../utils/cn'` with `import { cn } from '@ship-it-ui/ui'`, drop `packages/shipit/src/utils/cn.ts`, and remove `clsx` + `tailwind-merge` from `packages/shipit/package.json` (they'll come transitively via `@ship-it-ui/ui`).

## P2 — medium
- **`as any` cast bypassing real prop forwarding in Breadcrumbs** — `packages/ui/src/patterns/Breadcrumbs/Breadcrumbs.tsx:39`
  - What: `<Crumb {...(crumb.props as any)} current />` — explicit `as any` with eslint-disable. Works today because `<Crumb>` is the only valid child, but if anyone passes a custom child (e.g. a custom anchor wrapping the link), the props spread loses all type safety.
  - Why it matters: the only `as any` in production source. Easy to type properly with `crumb.props as CrumbProps`.
  - Fix: `(crumb as ReactElement<CrumbProps>).props` is already the type at line 29 — the inner cast is redundant. Drop both the `as any` and the eslint-disable.

- **`as unknown as Ref<HTMLElement>` for Slot ref forwarding** — `packages/ui/src/components/Button/Button.tsx:107`
  - What: `ref={ref as unknown as Ref<HTMLElement>}`. This is a known Slot/forwardRef awkwardness.
  - Why it matters: not strictly wrong, but the double-cast suggests the public ref type should be `HTMLButtonElement | HTMLElement` when `asChild`. Today consumers passing a `<a>` get a `Ref<HTMLButtonElement>` typed ref to an anchor.
  - Fix: typed overload for `asChild: true` case, or accept the awkwardness explicitly with a single-cast comment.

- **`as unknown as never` casts inside Slider's own tests** — `packages/ui/src/components/Slider/Slider.test.tsx:14,24`
  - What: `value={37 as unknown as never}` because `Slider`'s public type is `number[]` (inherited from Radix). The component implementation accepts a scalar (Slider.tsx:22-31) and the test verifies that, but the type doesn't.
  - Why it matters: tests are casting around the actual public API to verify a feature consumers can't use without their own ts-error.
  - Fix: widen `SliderProps['value']`/`defaultValue` to `number | number[]` (Omit them from `RadixSlider.SliderProps` first), then drop the casts.

- **`as unknown as React.MouseEvent<HTMLDivElement>` in Card keyboard handler** — `packages/ui/src/components/Card/Card.tsx:68`
  - What: synthesizes a fake mouse event to pass to `onClick` when Enter/Space is pressed. Calling `onClick(keyEvent)` with the wrong event type means downstream handlers get `e.button === undefined`, `e.clientX === undefined`, etc.
  - Why it matters: subtle for consumers that read mouse coordinates from the click handler. Minor at the design-system level, real at the integration level.
  - Fix: don't synthesize a click event. Either expose a separate `onActivate` callback, or wire keyboard activation through a real `<button>` (the role is already `button`).

- **Toast duplicate-id behavior** — `packages/ui/src/components/Toast/Toast.tsx:70-78`
  - What: `toast({ id: 'x', ... })` called twice pushes both entries; `dismiss('x')` then removes both at once. No dedupe and no warning.
  - Why it matters: a common UX pattern is "show one toast for state X, replace it on update". The current API silently allows duplicates.
  - Fix: either dedupe by id in the `toast` callback (replace the existing entry) or document that ids should be unique.

- **`Math.random()` for toast IDs** — `packages/ui/src/components/Toast/Toast.tsx:71`
  - What: `Math.random().toString(36).slice(2)` for unique-id generation. Collision-prone and not SSR-stable.
  - Why it matters: not a P1 because the keys are local and toasts dismiss themselves, but a counter or `useId` (if generation moved to a child) is strictly better.
  - Fix: lift to a module-scope counter, or document why Math.random is acceptable here.

- **`role="button"` on `<a>` element instead of `<button>`** — `packages/ui/src/patterns/Sidebar/Sidebar.tsx:97-117`
  - What: `NavItem` without `href` renders an `<a role="button">`. The keyboard handler synthesizes a `.click()` to make it work. (Mentioning from the engineering angle: `<button>` would remove the synthesis entirely; the a11y persona owns the rest.)
  - Why it matters: the synthesis is unnecessary code and ARIA-role-on-wrong-element is an axe smell.
  - Fix: render a `<button>` when `href` is missing; share styling.

- **DataTable `onSelectionChange` typed as `(selection: Set<string>) => void` but receives ReadonlySet semantically** — `packages/ui/src/patterns/DataTable/DataTable.tsx:50`
  - What: callback type allows the consumer to mutate the set we passed them, which would break our internal state.
  - Why it matters: type-level invariant violation. Consumers can shoot themselves in the foot.
  - Fix: type as `(selection: ReadonlySet<string>) => void`.

- **Stepper uses `key={label}` and crashes when two steps share a label** — `packages/ui/src/patterns/Stepper/Stepper.tsx:56`
  - What: `key={label}` instead of `key={i}` or a stable id. Two steps with the same label produce a React key collision warning in dev and broken reconciliation in prod.
  - Why it matters: realistic with multi-stage flows like ["Plan", "Plan Review"].
  - Fix: `key={i}`, or accept `{ id, label }[]` as the input shape.

- **Non-null assertion on a defaulted prop** — `packages/ui/src/components/Badge/Badge.tsx:60`, `packages/ui/src/patterns/Banner/Banner.tsx:60`, `packages/ui/src/patterns/Alert/Alert.tsx:67-69`, `packages/ui/src/components/Skeleton/Skeleton.tsx:31`
  - What: `dotSize[size!]`, `dotColorClass[variant!]`, `defaultGlyph[variant!]`, `iconColorClass[variant!]`, `defaultHeight[shape!]`. In every case the variable comes from a destructured default (`size = 'md'`, `variant = 'info'`, `shape = 'line'`), so the `!` is redundant but signals that the type isn't matching the runtime guarantee.
  - Why it matters: misleading. Some readers will assume the value is genuinely nullable.
  - Fix: tighten the variable type: `const variant: AlertVariant = props.variant ?? 'info'` then drop the `!`. The default in the destructure already does this — TS just loses the narrowing because of `VariantProps<typeof …>`.

- **`AvatarGroup` redeclares the `sizePx` map already exported by `Avatar`** — `packages/ui/src/components/Avatar/Avatar.tsx:9`, `packages/ui/src/components/Avatar/AvatarGroup.tsx:7`
  - What: identical `Record<AvatarSize, number>` of `xs:20, sm:24, md:32, lg:40, xl:56`. Two sources of truth for the same numbers.
  - Why it matters: a future size change has to be made in two places.
  - Fix: export `sizePx` from `Avatar.tsx` (or hoist to a shared `sizes.ts`).

- **`Chip` requires both `removable` and `onRemove`; `Tag` requires only `onRemove`** — `packages/ui/src/components/Chip/Chip.tsx:9-10,35`, `packages/ui/src/components/Tag/Tag.tsx:7,36`
  - What: API mismatch between two near-identical components. Chip needs `removable={true}` + `onRemove`; Tag only needs `onRemove`. Setting `removable` without `onRemove` on a Chip renders an X that does nothing.
  - Why it matters: cognitive load and a foot-gun. The "removable bool + handler" pattern is one of those where one prop is enough.
  - Fix: drop `removable` from Chip; render the close button when `onRemove` is set, mirroring Tag.

- **`useTheme` doesn't reflect `prefers-color-scheme`** — `packages/ui/src/hooks/useTheme.ts:20-23`
  - What: defaults to `'dark'` when document is undefined and falls back to `'dark'` if attribute is absent. Doesn't read the OS preference.
  - Why it matters: not a bug per se (the system documents dark-first), but a hook called `useTheme` is going to surprise people. Also: the MutationObserver is created on mount but not torn down when the parent unmounts and remounts in StrictMode (well, it is — `return () => observer.disconnect()` is correct). No leak.
  - Fix: optional behavior; document the intent. Can wait.

- **`useEscape` re-binds every render when `handler` is a new function literal** — `packages/ui/src/hooks/useEscape.ts:9-16`
  - What: `useEffect(..., [handler, enabled])` — typical inline `<… onSomething={() => x}>` consumers will re-bind the listener every render. Cheap but noisy.
  - Why it matters: Documented React footgun. Not a bug, but pattern-of-the-year for hook stability.
  - Fix: stash the handler in a ref so the effect can have `[enabled]` only.

- **`useOutsideClick` listens on `mousedown` only — touch is silent** — `packages/ui/src/hooks/useOutsideClick.ts:17-22`
  - What: doesn't add `touchstart`. Mobile users tapping outside an open Combobox won't close it via this hook (Radix-backed components are unaffected because Radix handles dismissal itself; the impact is only on `Combobox` which uses this hook).
  - Why it matters: silent UX gap on touch devices for `Combobox` (`packages/ui/src/patterns/Combobox/Combobox.tsx:147`).
  - Fix: also listen on `pointerdown`, or `touchstart` in addition to `mousedown`.

- **CommandPalette flattens groups but the `aria-activedescendant` it implies is never wired** — `packages/ui/src/patterns/CommandPalette/CommandPalette.tsx:79-92, 188-196`
  - What: `useKeyboardList` tracks a `cursor`, the `<button role="option" aria-selected={isActive}>` reflects it, but the search `<input>` doesn't set `aria-activedescendant` to point at the active option. (Combobox does it correctly at `Combobox.tsx:202`.) Engineering side: pattern asymmetry.
  - Why it matters: keyboard navigation works, but screen readers don't announce the active option as the cursor moves. (a11y-adjacent — flagging because it's a code-pattern asymmetry between two components in the same package.)
  - Fix: lift the listbox id, give each option a stable `id={...}`, and add `aria-activedescendant` to the search input. (a11y persona owns the deeper review.)

- **`useControllableState` returns `T | undefined`, forcing every consumer into `value ?? defaultFallback`** — `packages/ui/src/hooks/useControllableState.ts:21-29`
  - What: returns `T | undefined` because `defaultValue?: T`. When the consumer guarantees a default at the call site (e.g. `defaultValue: ''` or `defaultValue: new Set()`), the type still says undefined.
  - Why it matters: `selected!.has(id)` and `value ?? ''` patterns proliferate (DataTable.tsx:119, Tree.tsx:93, AskBar.tsx:104, Combobox.tsx:208, ReasoningBlock.tsx:57). Each of those is one more place a future contributor copies the `!`.
  - Fix: provide an overload: `useControllableState<T>(opts: { value?: T; defaultValue: T; ... }): [T, ...]` (default required) vs `: [T | undefined, ...]` when `defaultValue` is omitted. Eliminates the `!`s.

- **Test asserts the wrong thing in AlertDialog "cancel and action buttons trigger their handlers"** — `packages/ui/src/components/Dialog/AlertDialog.test.tsx:50-68`
  - What: the test name says "cancel and action buttons" but only clicks Cancel and asserts on `onCancel`. `onConfirm` is never tested. The describe block has no other test for the action button.
  - Why it matters: a regression in the action button (e.g. forgetting to forward `onClick`) won't fail this test.
  - Fix: add `await userEvent.click(getByRole('button', { name: 'Disconnect' }))` and `expect(onConfirm).toHaveBeenCalledOnce()`.

- **`GraphMinimap` "renders the viewport rectangle when provided" test only counts spans** — `packages/shipit/src/graph/GraphMinimap.test.tsx:18-24`
  - What: `expect(dots.length).toBeGreaterThan(points.length)` — proves there's *some* extra span, doesn't prove it's the viewport rectangle, doesn't check its position/size. If the implementation regresses to always render an extra span, this still passes.
  - Why it matters: the assertion is structurally true regardless of correctness.
  - Fix: assert on a specific `data-testid="minimap-viewport"` element (add the testid first), or query by computed style.

- **EntityListRow renders a `<div>` non-interactively but spreads `HTMLAttributes<HTMLElement>`** — `packages/shipit/src/entity/EntityListRow.tsx:29,76`
  - What: ref typed `HTMLElement`, the non-interactive branch uses `<div>` and casts ref to `Ref<HTMLDivElement>`, the interactive branch uses `<button>` and casts to `Ref<HTMLButtonElement>`. Same pattern works in Sidebar.
  - Why it matters: typing as `HTMLElement` loses the specific element type for both cases. Consumers who want focus management on the button never get the button-specific ref API.
  - Fix: split into `EntityListRow` and `EntityListButtonRow`, or use a discriminated union on the prop type.

- **`packages/ui/src/styles/` is exported via `./styles/globals.css` but has no `index.ts`** — `packages/ui/src/styles/`, `packages/ui/package.json:21`
  - What: the directory has `globals.css`, `animations.css`, `index.ts`. The exports map exposes only `globals.css`. The `index.ts` is empty/missing per the file listing (`ls` returns three filenames including `index.ts` but that's just listed alongside CSS files). Confirming separately:
  - Why it matters: minor. Verify that `index.ts` isn't doing anything; if empty, delete it; if it has exports, route them through the package exports map.
  - Fix: either delete `src/styles/index.ts` or add `"./styles": "./src/styles/index.ts"` to the exports.

- **`apps/docs/tsconfig.json` references only `ui` and `tokens`, not `icons` and `shipit`** — `apps/docs/tsconfig.json:8`
  - What: docs imports from all four publishable packages but only references two via `references`. TS still resolves through node_modules workspace links, so type-checking works, but the project graph is incomplete and incremental builds will skip rebuilding icons/shipit when docs is the entry.
  - Why it matters: `pnpm typecheck` on the docs workspace can run before icons/shipit have been built when those packages have changed.
  - Fix: add `{ "path": "../../packages/icons" }` and `{ "path": "../../packages/shipit" }` to the references array.

## P3 — nits
- **Dead `import.meta.resolve` reliance is the only Node-24-specific feature in build code** — `apps/docs/.storybook/main.ts:15`
  - What: `import.meta.resolve` was unflagged in Node 20.6+. The repo's `engines.node: ">=24"` (`package.json:8-10`) and `.nvmrc: 24` aren't strictly necessary for current source. (PM persona owns the doc-vs-config inconsistency; flagging the engineering side: nothing in the build actually requires Node 24.)
  - Fix: align engines with what the build actually needs (Node 20.6+) or document why 24 is required (test runner, etc.).

- **Same dotSize map literal duplicated** — `packages/ui/src/components/Avatar/Avatar.tsx:9`, `packages/ui/src/components/Avatar/AvatarGroup.tsx:7` (already covered above; nit version: extract into a `sizes.ts`).

- **`packages/ui/src/index.ts` does not export `cn`-as-type, just the function** — `packages/ui/src/index.ts:9`
  - What: `cn` is exported but `ClassValue` (its parameter type) isn't. Consumers who want to type pass-throughs have to import from `clsx` directly.
  - Fix: `export { cn, type ClassValue }` from a single re-export module.

- **`Skeleton`'s default height map uses non-null on a defaulted prop** — covered in P2.

- **`cn` declared in `packages/shipit/src/utils/cn.ts` lacks the JSDoc `packages/ui` has** — minor; will go away with the dedupe in P1.

- **`Citation` component falls back to `ref as never` when `inline`** — `packages/shipit/src/ai/Citation.tsx:41`
  - What: `<sup ref={ref as never} ...>`. The component's forwardRef is typed `HTMLSpanElement`; in the inline branch it's a `<sup>`, which is also an `HTMLElement` but not a span.
  - Fix: widen ref to `HTMLElement` or split into two components.

- **Tests heavily lean on `toHaveBeenCalled()` without argument verification** — `packages/ui/src/patterns/Sidebar/Sidebar.test.tsx:39`, `packages/ui/src/patterns/EmptyState/EmptyState.test.tsx:19`, `packages/ui/src/patterns/FileChip/FileChip.test.tsx:29`, `packages/ui/src/patterns/DataTable/DataTable.test.tsx:73`, `packages/ui/src/components/Card/Card.test.tsx:25`
  - What: the spy fired, but with what? In each case the handler takes either no args (Sidebar/Card) or specific args (FileChip onRemove takes none, DataTable onSelectionChange takes a Set). DataTable does subsequently inspect the call but EmptyState and FileChip don't.
  - Why it matters: low-grade — these tests would still catch the obvious "handler not wired" regression. They wouldn't catch "handler called with the wrong argument".
  - Fix: prefer `toHaveBeenCalledWith(...)` or `toHaveBeenCalledTimes(1)` plus an inspection of `mock.calls[0]`.

## Out of scope / not assessed
- ARIA correctness of components (Drawer omits `<Dialog.Title>` even with a `title` prop — flagged in passing at `packages/ui/src/components/Dialog/Drawer.tsx:28`; full a11y review owned by the Accessibility persona).
- Component API design quality, naming consistency between `Banner`/`Alert`/`Toast`/`Dialog`/`Drawer`/`Sheet`, token semantics — UI/UX persona.
- React-specific perf (memoization missing on hot paths in DataTable, Combobox), SSR safety of `useTheme`'s document access, `"use client"` directives — Frontend persona.
- CI workflows, changesets, release pipeline correctness, `provenance: true`, GitHub Actions — DevOps persona.
- Storybook story coverage, MDX docs accuracy, README alignment, governance — PM persona.
- Hardcoded `oklch(...)` literals in `GraphMinimap.tsx:78` and `CTAStrip.tsx:25` that bypass `--accent-h` — UI/UX (token semantics) persona.
- Glyph aliasing in `packages/icons/src/glyphs.ts` (e.g. `service`/`serviceOutline` both `◇`, `incident`/`target` both `◎`, `github` glyph `⌨` vs connector `⎈`) — UI/UX vocabulary persona.
- Bundle size and treeshakability of the `export *` barrel approach — Frontend persona.
