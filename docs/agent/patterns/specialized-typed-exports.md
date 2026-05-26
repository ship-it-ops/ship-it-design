---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [api, typescript, exports, convenience-wrappers]
---

# Specialized typed exports + a convenience wrapper that doesn't forwardRef

## When to Use

When a single component would otherwise need an overloaded prop signature
to cover multiple "shapes" (e.g. a row that can render a person, a
service, or a document with different prop sets), AND the consumer often
wants to spread props from a typed registry.

## Implementation

Ship N **specialized typed exports**, each strongly typed for one shape,
with `forwardRef`. Then ship a **convenience wrapper** that branches on a
discriminant prop, calls the right specialized export internally, and
deliberately **does not forward refs**. Document the ref omission in
the wrapper's JSDoc.

This trades the convenience wrapper's ref-safety for cleaner per-shape
APIs and easier type narrowing at the call site.

## Examples

- `packages/shipit/src/entity/EntityListRow.tsx` — the canonical case.
  `EntityListRowPerson`, `EntityListRowService`, `EntityListRowDocument`
  each forward refs and have type-narrowed props; `EntityListRow` is a
  branch-on-`type` convenience wrapper that delegates.

`.claude/ship-reviewed-prs-overrides.md` calls this out as the precedent
in section "Required component conventions" — reviewers should not flag
a missing `forwardRef` on a documented convenience wrapper if the JSDoc
matches `EntityListRow`'s shape.

## Gotchas

- Don't apply this pattern reflexively. If the component's variants are
  visual (`primary`/`secondary`/`ghost`) rather than structural
  (different prop shapes per discriminant), use `cva` variant axes
  instead. The split exists specifically for structurally-distinct
  shapes.
- The convenience wrapper must still pass through the standard HTML
  attributes spread — ref omission is acceptable, prop omission is not.
- If the wrapper grows logic beyond branching, refactor: either the
  branches should each absorb it, or the wrapper has become a stateful
  component and should re-add ref forwarding.

## Related

- [[component-authoring-shape]] — the standard ref-forwarding rule this
  pattern is a documented exception to.
