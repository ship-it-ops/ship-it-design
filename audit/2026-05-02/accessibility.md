# Accessibility — audit findings

## Verdict

The library has the right bones — Radix powers most overlays, every interactive primitive has a visible `focus-visible` ring, the `Field` wrapper wires `aria-describedby`/`aria-invalid` correctly, axe assertions are present in 54/56 component test files, and the three known regression sites (Dialog `aria-describedby`, DataTable `role="grid"` overreach, Dropzone/FileChip nested-interactive) are mostly handled. However the library is **not yet WCAG 2.2 AA-ready**. Three categories of blockers stand out: (1) the `Drawer` and `Sheet` overlays render `RadixDialog.Content` without a `RadixDialog.Title`, leaving them with no accessible name and emitting Radix runtime warnings — and they are the only two component test files in the repo without an `axe()` assertion, which is exactly why the regression slipped through; (2) the global `--color-text-dim` token (#55555d on dark, #8e8e96 on light) sits at ~2.5:1 against `--color-bg`/`--color-panel`/`--color-panel-2` and is used as visible body text in dozens of patterns (hint text, file size, descriptions, ellipsis, kbd hints, eyebrow labels, the whole `upcoming` Stepper state, light-mode `text-accent` body); (3) the `prefers-reduced-motion` media query in `tokens.css` only zeroes `--duration-micro`/`--duration-step`, but every dialog/drawer/sheet/toast entrance and every infinite spinner uses hard-coded literal durations inside `animate-[ship-…_220ms_…]` strings, so reduced-motion is silently ignored. Beyond those, custom non-Radix interactive composites — the `DataTable` sortable headers, the `Tree` arrow-key model, the `Calendar` date grid — only handle a subset of the keyboard model their pattern demands.

## P0 — blockers

- **Drawer has no accessible name and emits a Radix Dialog warning** — `packages/ui/src/components/Dialog/Drawer.tsx:26-37`
  - What: `DrawerHeader` renders the title in a plain `<span>`, not a `RadixDialog.Title`. The Radix Dialog Content is mounted with no `Title`, no `aria-label`, and no `aria-labelledby`, so the dialog has no accessible name. Radix also logs `DialogContent requires a DialogTitle` and `aria-describedby` warnings to the console at runtime.
  - WCAG criterion: 4.1.2 Name, Role, Value; 2.4.6 Headings and Labels.
  - Why it matters: a screen reader announces "dialog" with no name on open. Combined with the missing axe test (see test-coverage finding below), this regression has zero automated coverage.
  - Fix: render the header label inside `RadixDialog.Title` (visually styled the same), and pass `aria-describedby={undefined}` on `RadixDialog.Content` to silence the description warning when there is genuinely no description.

- **Sheet has no accessible name when `title` is omitted** — `packages/ui/src/components/Dialog/Sheet.tsx:38-40`
  - What: `RadixDialog.Title` only renders inside the `{title && …}` guard. If a consumer mounts `<Sheet>` without a `title` (the test on `Sheet.test.tsx:28-35` proves this is a supported path) the dialog has no accessible name and Radix logs a warning.
  - WCAG criterion: 4.1.2 Name, Role, Value.
  - Why it matters: same as Drawer — screen-reader users land in an unnamed modal with no announced purpose.
  - Fix: require a `title` (or an `aria-label`/`aria-labelledby` prop), or fall back to a visually-hidden `RadixDialog.Title`.

- **Drawer and Sheet test files have no axe assertion** — `packages/ui/src/components/Dialog/Drawer.test.tsx`, `packages/ui/src/components/Dialog/Sheet.test.tsx`
  - What: every other component test in the repo (54 of 56) calls `axe(container)`; these two do not. They are also the two files whose components currently violate Radix's labelling contract. Causal correlation.
  - WCAG criterion: process gap, not a single SC.
  - Why it matters: this is the regression-detection gap that lets the two findings above ship. Adding `axe()` here would have failed the build.
  - Fix: mirror the assertion shape from `Dialog.test.tsx:33-40` — render the open dialog and assert `expect(await axe(container)).toHaveNoViolations()`.

- **DataTable sortable headers are mouse-only** — `packages/ui/src/patterns/DataTable/DataTable.tsx:175-208`
  - What: sortable `<th>` elements get `onClick={…}` and `aria-sort` but no `role="button"`, no `tabIndex`, and no `onKeyDown` for Enter/Space. They are not in the tab order and cannot be activated from the keyboard.
  - WCAG criterion: 2.1.1 Keyboard.
  - Why it matters: keyboard-only users cannot sort the table. The `cursor-pointer` styling is a misleading affordance.
  - Fix: render the header label inside a `<button>` (so the keyboard model is free), or stamp `tabIndex=0`/`role="button"`/Enter+Space handlers on the `<th>`. axe does not catch this — add a keyboard test.

- **Tree falls out of tab order when nothing is selected and has no Up/Down arrow navigation** — `packages/ui/src/patterns/Tree/Tree.tsx:120-143`
  - What: `tabIndex={isSelected ? 0 : -1}` means _every_ treeitem gets `tabIndex=-1` until the user has selected one. With no default selection, the tree is unreachable by Tab. The `onKeyDown` handler implements Enter/Space and ArrowLeft/ArrowRight only; the WAI-ARIA tree pattern requires ArrowUp/ArrowDown to move between visible nodes (and ideally Home/End and type-ahead).
  - WCAG criterion: 2.1.1 Keyboard; APG tree pattern (ARIA Authoring Practices).
  - Why it matters: a tree with no entry point and no vertical traversal is keyboard-unusable. The `Tree.test.tsx:50-58` test only exercises ArrowRight/ArrowLeft, so this gap is uncovered.
  - Fix: when there is no selection, give the first treeitem `tabIndex=0` (roving tabindex). Add ArrowDown/ArrowUp handlers that move focus to the next/prev visible treeitem, and ArrowLeft on a leaf to move to its parent.

- **`text-text-dim` token fails 4.5:1 contrast against every background in both themes; widely used for visible text** — `packages/tokens/src/color.ts:48` (dark `#55555d`), `packages/tokens/src/color.ts:73` (light `#8e8e96`); 57 component-source usages
  - What:
    - Dark `textDim` `#55555d` on dark `bg` `#0a0a0b`: **fg/bg ≈ 2.70:1** (fails 4.5:1 and 3:1).
    - Dark `textDim` on `panel` `#111113`: **≈ 2.54:1** (fails).
    - Dark `textDim` on `panel-2` `#16161a`: **≈ 2.44:1** (fails).
    - Light `textDim` `#8e8e96` on `bg` `#fbfbfa`: **≈ 3.19:1** (fails 4.5:1 normal-text; passes 3:1 large/UI).
    - Used as visible body / functional text in: `Field` empty-string subtitle, `Combobox` option `description` (`Combobox.tsx:262`), `Combobox` empty-state message (`Combobox.tsx:236`), `Dropzone` description (`Dropzone.tsx:109`), `FileChip` size text (`FileChip.tsx:60`), `Stepper` upcoming step labels (`Stepper.tsx:31`), `Calendar` weekday header (`Calendar.tsx:144`), `Sidebar` `NavSection` eyebrow (`Sidebar.tsx:134`), `Pagination` ellipsis (`Pagination.tsx:66`), `Menubar`/`MenuItem`/`ContextMenuItem` trailing kbd (`Menubar.tsx:101`, `DropdownMenu.tsx:62`, `ContextMenu.tsx:52`), `CommandPalette` ESC chip + "No matches" (`CommandPalette.tsx:132`), `Sheet` `Quick actions` body (`Dialog.stories.tsx:79`), `Card` footer (`Card.tsx:91`), `StatCard` eyebrow (`StatCard.tsx:42`), `Timeline` time (`Timeline.tsx:83`), `SearchInput` shortcut chip (`SearchInput.tsx:41`), `EmptyState` chip border (`EmptyState.tsx:67`), `Topbar` actions, plus `placeholder:text-text-dim` on `Input.tsx:60` / `Combobox.tsx:220` / `CommandPalette.tsx:130` / `Textarea.tsx:11` / `SearchInput.tsx:37` / `AskBar.tsx:113`.
  - WCAG criterion: 1.4.3 Contrast (Minimum) — body text 4.5:1; 1.4.11 Non-text Contrast 3:1 for placeholder/UI-component glyphs.
  - Why it matters: this is the most-used "secondary text" token in the system. Dim-grey-on-near-black is a common visual style but it has to clear 4.5:1. Light theme is closer to passing (3.2:1) than dark (2.4–2.7:1) but still fails normal text.
  - Fix: this is a token-level fix owned by UI/UX (per audit scope), but the a11y consequence is a hard P0. Suggest raising dark `textDim` to ~`#7c7c86` (≈4.6:1 on `bg`) and light `textDim` to ~`#6f6f78` (≈4.6:1 on `bg`).

- **`text-accent` on light theme fails contrast as body text** — `packages/tokens/src/color.ts:75`
  - What: Light `--color-accent: oklch(0.72 0.13 var(--accent-h))` at the default `--accent-h: 200` is a mid-tone cyan with relative luminance ≈0.42. Against `--color-bg` `#fbfbfa` (L≈0.97) the ratio is **≈ 2.27:1** (fails 4.5:1 and 3:1). The same token used as a fill (`bg-accent`) against `text-on-accent` `#0a0a0b` is ~9:1 (passes), but the `text-accent` direction does not.
  - Used as visible body text in light theme on bg/panel surfaces by: `Combobox`/`CommandPalette` highlighted option (`Combobox.tsx:256`, `CommandPalette.tsx:197`), `DataTable` sorted-column header (`DataTable.tsx:197`), `Sidebar` `NavItem` active row (`Sidebar.tsx:78`), `Stepper` current step (`Stepper.tsx:24`), `Pagination` active page (`Pagination.tsx:85`), `Banner` info variant (`Banner.tsx:19`), `Alert` info-tone icon (`Alert.tsx:29`), `Button` link variant (`Button.tsx:31`), `Tab` underline active label _(uses `text-text` — OK)_, every `*-pulse` glow.
  - WCAG criterion: 1.4.3 Contrast (Minimum) on light-theme body text.
  - Why it matters: switching to `[data-theme="light"]` instantly degrades all of those active/selected states below threshold. The OKLCH knob doesn't help — every accent hue at L=0.72 has roughly the same luminance and fails by the same margin. The companion `--color-accent-text: oklch(0.38 0.13 …)` token _does_ meet contrast (~7.5:1) but is not used in the components above; only the trigger-color in light theme. Components seem to assume `accent` is a "text-safe" token in both themes.
  - Fix (token-level, UI/UX): either lower light `--color-accent` to ≈`oklch(0.45 0.13 …)` (≈4.6:1) and use a separate brighter token for the fill role, or have components consume `accent-text` (the dark variant) for foreground roles in light theme.

- **`prefers-reduced-motion` is silently ignored by every keyframe animation** — `packages/ui/src/styles/animations.css:1-123`, `packages/tokens/styles/tokens.css:138-143`
  - What: the `@media (prefers-reduced-motion: reduce)` block only sets `--duration-micro` and `--duration-step` to `0ms`. Every Tailwind class of the form `animate-[ship-fade-in_150ms_ease]`, `animate-[ship-dialog-in_180ms_var(--easing-out)]`, `animate-[ship-slide-in-right_220ms_…]`, `animate-[ship-toast-in_220ms_…]`, `animate-[ship-pop-in_140ms_…]`, `animate-[ship-spin_0.7s_linear_infinite]`, `animate-[ship-pulse_1s_infinite]`, `animate-[ship-pulse-ring_1.6s_infinite]`, `animate-[ship-skeleton_1.4s_infinite]`, `animate-[ship-indeterminate_1.4s_linear_infinite]` hard-codes a literal duration in the utility name and never reads the token. 23 such usages across the library.
  - WCAG criterion: 2.3.3 Animation from Interactions (AAA, but a strict-AA expectation for entrance/exit motion); 2.2.2 Pause, Stop, Hide for any infinite spinner that lasts more than 5 seconds visually.
  - Why it matters: vestibular-sensitive users with `prefers-reduced-motion: reduce` set still see Drawer slide 100% across the viewport, Sheet rise 100% from the bottom, Dialog scale-and-translate, Toast slide+scale, and the infinite Spinner/Pulse/PulseRing/Skeleton/Indeterminate animations continue at full speed forever. The Spinner's JSDoc explicitly claims "respects `prefers-reduced-motion` via the global motion override in `tokens.css`" — the override does not apply because the duration is `0.7s` literal, not `var(--duration-step)`.
  - Fix: add a global rule that disables animation under reduced motion, e.g. an `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }` in `animations.css`. Or rewrite each `animate-[…_220ms_…]` to `animate-[…_var(--duration-step)_…]` and accept the entrance-only fix while still gating spinners separately.

## P1 — high priority

- **Sheet and Drawer never set `aria-describedby={undefined}` to silence Radix's description warning** — `packages/ui/src/components/Dialog/Drawer.tsx:51-58`, `packages/ui/src/components/Dialog/Sheet.tsx:28-36`
  - What: even after the P0 Title fix, neither component ever renders a `RadixDialog.Description`. Radix logs `Missing Description or aria-describedby for DialogContent` at runtime. This is exactly pitfall #1 from prior fixes; the convenience `Dialog`, `AlertDialog`, and `CommandPalette` (`CommandPalette.tsx:105`) already do `aria-describedby={undefined}` correctly — Drawer and Sheet were missed.
  - WCAG criterion: developer-experience / runtime warnings, indirectly 4.1.2.
  - Fix: pass `aria-describedby={undefined}` (or wire to a real `RadixDialog.Description`).

- **Calendar date grid has no Arrow-key navigation** — `packages/ui/src/patterns/DatePicker/Calendar.tsx:151-178`
  - What: each day is an isolated `<button>`. Tab moves through 28–31 buttons in linear order (no roving tabindex), and there is no Arrow/PageUp/PageDown/Home/End traversal — the standard pattern for date pickers (move ±1 day, ±1 week, ±1 month, jump to start/end of week).
  - WCAG criterion: 2.1.1 Keyboard / APG date picker pattern.
  - Why it matters: keyboard-only date entry takes up to 31 Tab presses per month switch. Also, `aria-pressed={isSelected}` is wrong — for a date grid the correct semantic is `aria-selected` inside `role="grid"`/`role="gridcell"`, or `aria-current="date"` for today only and no pressed state.
  - Fix: implement the APG grid keyboard model (this is one of the rare cases where `role="grid"` is the right call — pitfall #2 is about _misuse_, not blanket avoidance) and switch `aria-pressed` → `aria-selected`.

- **`SearchInput` has no accessible name** — `packages/ui/src/components/Input/SearchInput.tsx:33-39`
  - What: the `<input type="search">` is rendered with `placeholder="Search…"` but no `aria-label`, no associated `<label>`, and the wrapper isn't labelled either. Consumers can pass `aria-label` through `…props`, but the component doesn't enforce or default it.
  - WCAG criterion: 4.1.2 Name, Role, Value; 3.3.2 Labels or Instructions.
  - Fix: default `aria-label` to the placeholder string, or require an `aria-label` prop.

- **`Slider` accessibility-name is a hardcoded "Value" with no Field-integration path** — `packages/ui/src/components/Slider/Slider.tsx:55`
  - What: `RadixSlider.Thumb` always renders `aria-label="Value"`. Consumers cannot override per slider, and the wrapper does not pass `aria-labelledby` to the thumb when used inside `Field`. Multi-thumb sliders all get the same name.
  - WCAG criterion: 4.1.2 Name, Role, Value; 1.3.1 Info and Relationships.
  - Fix: forward `aria-label`/`aria-labelledby` from props to the Thumb; for ranges, accept a `thumbLabels: [string, string]` option.

- **`CommandPalette` input is not wired to the listbox via combobox semantics** — `packages/ui/src/patterns/CommandPalette/CommandPalette.tsx:119-135`
  - What: the input has `aria-autocomplete="list"` but no `role="combobox"`, no `aria-controls` pointing at the listbox, no `aria-activedescendant` pointing at the highlighted option, and the `onKeyDown` is on the dialog `Content` not the input. The `Combobox` pattern (`Combobox.tsx:192-216`) does this correctly — inconsistent with itself.
  - WCAG criterion: APG combobox pattern; indirectly 4.1.2.
  - Why it matters: screen readers don't announce the active option as the user arrows through the result list — they read the input's text only.
  - Fix: mirror the `Combobox` ARIA wiring (`role="combobox"`, `aria-controls`, `aria-activedescendant={…option-${cursor}}`).

- **`Banner` uses `role="alert"` for warn/err on initial render** — `packages/ui/src/patterns/Banner/Banner.tsx:55`
  - What: an `alert` is an `aria-live="assertive"` region. A banner that is part of the initial page render is announced by screen readers on every page load, interrupting whatever else is being read.
  - WCAG criterion: 4.1.3 Status Messages (correct _use_ of live regions).
  - Fix: use `role="status"` for static banners; reserve `role="alert"` for banners that appear after page load (and even then mount them on demand, not in initial DOM).

- **`Toast` axe test only runs against the empty viewport** — `packages/ui/src/components/Toast/Toast.test.tsx:24-31`
  - What: the test fires `axe()` before clicking the trigger, so only the empty Radix Viewport is evaluated. The actual rendered toast (where `aria-live`, dismiss-button label, and color contrast all matter) is never checked.
  - WCAG criterion: process gap.
  - Fix: click "fire" then `findByText('Hello')` then call `axe(baseElement)`.

- **`HoverCard` content is keyboard-reachable but `Tooltip` content has `pointer-events-none`** — `packages/ui/src/components/Tooltip/Tooltip.tsx:27`
  - What: tooltips with `pointer-events-none` cannot be hovered without dismissing — fine for short label tooltips, but if any consumer puts a link/button inside a `TooltipContent`, that link becomes unhoverable. WCAG 1.4.13 (Content on Hover or Focus) requires the additional content be hoverable, dismissable, and persistent.
  - WCAG criterion: 1.4.13 Content on Hover or Focus.
  - Fix: leave the rule but document that `Tooltip` is for non-interactive labels only; for interactive popovers use `Popover` or `HoverCard`.

## P2 — medium

- **`NavItem` uses `<a role="button">` instead of `<button>` when no `href` is given** — `packages/ui/src/patterns/Sidebar/Sidebar.tsx:97-117`
  - What: an anchor without `href` is not a link; stamping `role="button"` and re-implementing keyboard activation works but is an antipattern that fights screen-reader heuristics. A native `<button>` is the right element.
  - WCAG: 4.1.2 Name, Role, Value (correctness, not failure).
  - Fix: render `<button type="button">` in the no-href branch.

- **`Card` becomes a `role="button"` based on `onClick`/`interactive` but children may include actual buttons (nested-interactive risk)** — `packages/ui/src/components/Card/Card.tsx:73`
  - What: when `interactive` resolves true, the entire card is `role="button"` with `tabIndex=0`. Cards commonly contain action buttons in `actions` (`Card.tsx:81`); two interactive elements nested gives axe a `nested-interactive` violation and screen readers a confusing semantic.
  - WCAG: 4.1.2.
  - Fix: render the whole card content inside a single `<a>` or `<button>` only when there are no nested interactive children, or expose a separate `<CardLink>` element.

- **`StatusDot` uses `state` enum directly as `aria-label` ("ok", "warn", "err", "off", "sync")** — `packages/ui/src/components/StatusDot/StatusDot.tsx:44`
  - What: when `label` is omitted, the SR announcement is `"ok"` or `"err"` — opaque to a non-engineer. "Online", "Warning", "Error", "Offline", "Syncing" would be clearer.
  - WCAG: 3.3.2 Labels or Instructions.
  - Fix: map states to human strings before assigning `aria-label`.

- **`Avatar` status indicator's accessible label is `"status: ok"`** — `packages/ui/src/components/Avatar/Avatar.tsx:81`
  - What: same opacity issue; "online" / "offline" reads better than "status: ok".
  - Fix: same — map the enum to a friendly word.

- **`Skeleton` always exposes `role="status"` + `aria-label="Loading"`** — `packages/ui/src/components/Skeleton/Skeleton.tsx:36-38`
  - What: a list of 8 skeleton lines becomes 8 "Loading" announcements. Should mark each row `aria-hidden` and put a single status region at the parent.
  - WCAG: 4.1.3 Status Messages (over-announcement).
  - Fix: accept a `loading` prop on the parent that wraps a single live region; default Skeleton to `aria-hidden`.

- **`Dropzone` `<label>` wrapping a hidden `<input type="file">` works keyboard-wise but only because the input has `sr-only` (still focusable)** — `packages/ui/src/patterns/Dropzone/Dropzone.tsx:72-101`
  - What: this is the correct _non-button_ form of the file picker (pitfall #3 was about `<button>` containing `<input>` — Dropzone uses `<label>`, which is fine). The keyboard focus ring only shows on the input, but the visual focus indicator is on the label via `focus-within:ring-accent-dim`. Acceptable. Worth a comment in code; pitfall #3 stays fixed.
  - Fix: none required — flagged for completeness.

- **`OTP` has no aggregate "code complete" announcement** — `packages/ui/src/components/OTP/OTP.tsx:89-117`
  - What: each input is independently labelled `Code N of M`. Screen-reader users get no signal that the code completed and was submitted. `aria-live` region with `onComplete` would help.
  - Fix: add a visually-hidden live region announcing completion.

- **`text-text-muted` on `bg-panel-2` is ~5.16:1 (passes 4.5:1) — no action needed but flagging the headroom is thin** — `packages/tokens/src/color.ts:48`
  - Fix: monitor; do not let text-muted drift darker.

## P3 — nits

- **Visible focus ring is `2px solid` outline plus a `3px` ring on most interactives** — `packages/ui/src/styles/globals.css:140-143`, e.g. `Button.tsx:16`
  - The `*:focus-visible` outline is fine; per-component `focus-visible:ring-[3px] focus-visible:ring-accent-dim` adds a second softer halo. This double-treatment is over-styling but does not fail SC 2.4.7.

- **`Spinner` JSDoc claims it respects `prefers-reduced-motion`** — `packages/ui/src/patterns/Spinner/Spinner.tsx:5-7`
  - The doc is wrong (see P0 motion finding). Update once motion is actually wired.

- **`Stepper` uses `role="list"` + `role="listitem"` on flex `<div>`s** — `packages/ui/src/patterns/Stepper/Stepper.tsx:48-65`
  - Functional, but native `<ol>`/`<li>` would be more idiomatic and avoid the explicit `role`s.

- **`Crumb` falls back to `href={href ?? '#'}` for non-current crumbs** — `packages/ui/src/patterns/Breadcrumbs/Breadcrumbs.tsx:74`
  - A `href="#"` link with no semantics navigates to top of page. If a consumer omits `href` they probably want a button. Document or warn.

- **`Sheet` drag-handle is a `bg-border` 9×1px bar with no role** — `packages/ui/src/components/Dialog/Sheet.tsx:37`
  - It's `aria-hidden` so SR-clean, but the bar is not actually a draggable affordance (no drag implementation). Either implement drag-to-dismiss or drop the visual cue.

- **`GraphNode` has `role="img"` but is rendered inline as a presentation node** — `packages/shipit/src/graph/GraphNode.tsx:48`
  - Presentation-only is acceptable. Note: when graph hosts make these focusable/selectable, they will need to override the role and add `aria-pressed`/`aria-selected`.

## Out of scope / not assessed

- TS / hook correctness of `useControllableState`, `useKeyboardList`, `useOutsideClick` — owned by SE.
- Variant API design (e.g., should `Banner` be `tone` instead of `variant`) — owned by UI/UX.
- Token-color values themselves (whether `textDim` _should_ be raised) — owned by UI/UX. The a11y consequence (P0 contrast) is in scope; the chosen replacement value is not.
- React rendering performance, SSR safety, bundle-size of Radix imports — owned by Frontend.
- Storybook a11y addon configuration / CI a11y gate — owned by DevOps.
- MDX docs accessibility (heading order on docs site) — owned by PM.
- I did not run axe in a real browser against rendered Storybook stories; this audit is source-level only. A second pass with `@storybook/addon-a11y` against every story would likely surface contrast violations on every accent-text-on-light surface that I computed by hand above.
