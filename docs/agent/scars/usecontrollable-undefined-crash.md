---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: 'if you see selected!.has(id) or value!.method() guarded by `!` in code consuming useControllableState, stop — find the EMPTY_SET (or empty default) and use it instead'
tags: [react, hooks, controlled-state, datatable, tree, typescript]
---

# `selected!.has(id)` non-null assertions papered over a real `T | undefined` runtime crash path

## What Happened

The May 2026 audit (SE persona, P0 #2) found that `useControllableState`
returns `T | undefined` and `DataTable`/`Tree` consumers were
dereferencing the result with non-null assertions:

- `DataTable.tsx:119,120,224` — `selected!.has(id)`
- `Tree.tsx:93,164` — `expanded ?? new Set()` and `item.children!.map`

The `!` silenced the TypeScript checker but did not guard runtime. A
consumer passing `selected={undefined}` explicitly (controlled-but-empty)
triggered `Cannot read properties of undefined`.

Compounding the issue: `instanceof Set ? x : (x as Set)` constructs at
`DataTable.tsx:94` and `Tree.tsx:58` were **no-op casts** that hid a
`ReadonlySet → Set` variance hole; both branches returned the same value
and the conditional only existed to placate TypeScript.

## Tripwire

**If you see `selected!.has(id)`, `value!.method()`, or any `!` non-null
assertion on a result of `useControllableState`, stop.** The hook
deliberately returns `T | undefined` to support uncontrolled mode; the
`!` is a lie. Use one of:

- `(selected ?? EMPTY_SET).has(id)` with a module-level
  `const EMPTY_SET = new Set<string>()`.
- An explicit early return when `selected == null`.
- Widen the prop type to require a non-undefined value (and assert at
  the boundary).

Secondary tripwire: any `instanceof X ? x : (x as X)` cast where both
branches do the same thing — that's the TS checker telling you the
variance is wrong; don't placate it.

## Why It Hurt

The crash is a consumer-API foot-gun: the documented
"controlled-but-empty" path (`selected={undefined}`) is exactly the
shape consumers reach for when wiring up state and haven't seeded it
yet. Throwing on a sensible API call is the worst kind of bug — it
penalizes the most-common adoption pattern.

## Don't Do This

- Don't reach for `!` to silence a TS error on a `useControllableState`
  result — that error is real.
- Don't write `instanceof Set ? x : (x as Set)` (or any X) — pick a
  position on whether the input is mutable or not, and document it.
- Don't mutate (`.add`/`.delete`) on a typed `ReadonlySet` even if today's
  consumer passes a real `Set`; clone into `new Set(prev)` first.

## Related

- [[component-authoring-shape]] — patterns that use
  `useControllableState` should follow this scar's tripwire.
