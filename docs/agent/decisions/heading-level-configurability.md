---
type: decision
status: active
created: 2026-06-04
updated: 2026-06-04
author: claude-opus-4-7
tags: [seo, semantic-html, headings, components, conventions]
importance: standard
---

# `titleAs` is the convention for configurable heading levels

## Context

Phase 3 of the SEO upgrade fixed seven components that hardcoded their
title element — `Hero` (`<h1>`), `LargeTitle` (`<h1>`), `CTAStrip` (`<h2>`),
`EmptyState` (`<div>`), `FeatureGrid` (`<div>`), `PricingCard` (`<span>`),
and `Topbar` (`<div>`). Hardcoded headings break consumers' page hierarchies
— a `<Hero>` reused inside a docs page would emit a second `<h1>`, and
`EmptyState`'s `<div>` title was invisible to crawlers ranking the page for
"empty / no results" patterns.

## Decision

**Every design-system component that surfaces a visible title exposes a
`titleAs?: HeadingLevel` prop that renders an `<h1>`–`<h6>`.** Default to the
heading level that matches the component's most common usage; consumers
override when their page hierarchy demands a different level.

Defaults locked in this release:

| Component     | Default `titleAs`                                         |
| ------------- | --------------------------------------------------------- |
| `Hero`        | `h1` (landing page top section)                           |
| `LargeTitle`  | `h1` (screen-level header)                                |
| `CTAStrip`    | `h2` (between-section CTA on a landing page)              |
| `EmptyState`  | `h3` (typically nested in a section)                      |
| `FeatureGrid` | `featureTitleAs: h3` (per-feature title under section h2) |
| `PricingCard` | `tierAs: h3` (tier name under pricing-section h2)         |
| `Topbar`      | `h1` (touch density) / `h2` (desktop density)             |

Implementation: `packages/ui/src/utils/Heading.tsx` exports a small
`<Heading as>` helper. Components import it (`import { Heading, type
HeadingLevel } from '@ship-it-ui/ui'`) and render
`<Heading as={titleAs} className="…">{title}</Heading>` in place of a
hardcoded `<hN>` / `<div>` / `<span>`.

## Alternatives Considered

- **`as`** (instead of `titleAs`): rejected. `as` is widely used for
  polymorphic-component element overrides (e.g. `as="a"` on `Button`).
  Reserving it across the board for "the underlying element of the
  component as a whole" leaves `titleAs` clearly scoped to the title slot.
  Components with multiple heading slots (FeatureGrid, PricingCard) use
  per-slot variants (`featureTitleAs`, `tierAs`).
- **Forcing all titles to a fixed level**: rejected. Pages reuse
  marketing components inside docs sections; one fixed level cannot
  satisfy both.
- **No heading element at all** (keep `<div>`/`<span>`): rejected. That
  surrenders the entire SEO/AT value of the title — the original problem.
- **A `HeadingsProvider` that derives levels from context depth**: rejected
  as over-engineered for the current surface. Revisit if we cross ~15
  heading-bearing components.

## Consequences

- Adding a new component with a visible title now follows a strict
  convention: import `Heading` from `@ship-it-ui/ui`, accept `titleAs?:
HeadingLevel`, default to the level matching the most common usage,
  render via `<Heading as={titleAs}>`. JSDoc on the prop should explain
  what page-hierarchy assumption the default makes.
- Existing consumers who relied on the old hardcoded elements get
  no behavior change — the defaults preserve the prior render. The
  cascade is purely opt-in.
- Components with badges/eyebrows alongside titles (PricingCard's
  "recommended" pill, Topbar's eyebrow) keep their flex/grid wrappers;
  `Heading` only replaces the title node itself.

## Revisit Triggers

- If a third heading slot appears on any component (forcing a third
  per-slot `xxxAs` prop), consider a `HeadingsProvider` context.
- If we add a new heading element above `h1` (e.g. a top-level page
  `h0` standard emerges), revisit the `HeadingLevel` union.

## Related

- [[component-authoring-shape]] — every new component with a title
  follows this pattern.
- [[structured-data-injection-pattern]] — sibling Phase-1 convention
  for JSON-LD emission.
