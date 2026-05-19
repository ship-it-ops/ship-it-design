---
'@ship-it-ui/ui': patch
---

Add `<InlineEdit>` — a display-to-input rename primitive. Double-click (or Enter on the focused display) opens the editor; Enter commits, Escape cancels, blur commits when `commitOnBlur` (default `true`). Supports `validate(next) => string | null` for rejecting commits, controlled `editing` state, and an imperative `edit()` / `cancel()` handle. Renders headings via `as="h1" | "h2" | "h3"` with proper heading semantics + `aria-roledescription="editable"`. Useful for table cells, sidebar names, schema editors, and any other in-place rename surface.
