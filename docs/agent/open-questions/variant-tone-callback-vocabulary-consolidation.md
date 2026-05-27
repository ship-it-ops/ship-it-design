---
type: open-question
status: active
opened: 2026-05-21
answer-source: maintainer
tags: [api, vocabulary, breaking-change, variant, tone, callbacks]
---

# Should `variant`/`tone`/`info`/`danger`/`muted`/`onSelect`/`onChange` be migrated to one consolidated vocabulary before 1.0?

## Context

The May 2026 audit (UI/UX P0 #2, #3) flagged that the design system
contradicted itself in two API axes:

**Variant vs tone**:

- `Alert`/`Banner` use `variant: 'info' | 'ok' | 'warn' | 'err'`.
- `Progress`/`RadialProgress` use `tone: 'accent' | 'ok' | 'warn' | 'err'`.
- `EmptyState` uses `tone: 'accent' | 'danger' | 'muted'`.
- `Input`/`Textarea` use `tone: 'default' | 'error'`.

So `<Alert variant="err">` and `<EmptyState tone="danger">` mean the
same thing; `<Alert variant="info">` and `<Progress tone="accent">` also
mean the same thing. A consumer who memorizes one pattern guesses wrong
on the others.

Recommended: keep `variant` for visual style (Button's primary/
secondary/ghost/etc.) and use `tone` for semantic intent
(`accent | ok | warn | err`). Drop `info` (= `accent`), drop `danger`
(= `err`), drop `muted` (or promote it as a real tone token).

**Callback naming** — state-change prop is split four ways:

- `Tabs`/`DatePicker`/`FilterPanel`/`DateRangePicker` → `onValueChange`.
- `Calendar` → `onSelect` + `onValueChange` (mixed).
- `Tree` → `onSelect`.
- `DataTable` → `onSelectionChange`.
- `Combobox` → `onValueChange` + internal `onSelect`.
- Native `Input`/`Textarea` → `onChange` (HTML).

Recommended (matches Radix + shadcn): `onValueChange` for single-value
controlled components, `onSelectionChange` for multi-select (DataTable
is already correct), `onChange` reserved for native HTML form controls
only. Migrate `Calendar`/`Tree`/`Combobox` and add JSDoc `@deprecated`
aliases for one minor.

## Tried

The current code partially migrates toward the recommended convention
(e.g. `Combobox` now exposes `onValueChange`), but the legacy `onSelect`
shape is still present in several patterns. No bulk migration has been
attempted.

## Who Can Answer

**Maintainer call** — this is a public-API breaking change, and the
[[v0-changeset-patch-policy]] means the bump level won't communicate
the break to consumers. The decision needs:

1. A timeline (do it before 1.0 cut? or carry the contradiction into
   1.0 with deprecation warnings?).
2. A deprecation window (one minor with `@deprecated` is the audit's
   recommendation).
3. A migration codemod or sweep PR plan.

When picked up, this should be promoted from open-question to a
`decisions/` note (or absorbed into a 1.0-prep plan).

## Related

- [[v0-changeset-patch-policy]] — controls how the bump is communicated.
- [[audit-2026-05-02-snapshot]] — Theme F context.
