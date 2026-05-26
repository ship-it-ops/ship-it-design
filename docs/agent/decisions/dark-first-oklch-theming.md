---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [theming, tokens, color, accent]
importance: core
---

# Dark-first OKLCH theming with a single `--accent-h` knob

## Context

The design system has to serve ShipIt-AI's product surface (dark-default
engineering consoles, graph chrome) **and** consumer-marketplace apps
(light-default car-rental / travel surfaces — see the v0.0.7+ pivot in the
`tokens-rating-verified-sale` / `ui-car-rental-readiness` changesets). A
single tokens layer has to flex across both without exploding the surface.

## Decision

- `:root` defines the **dark** theme; `[data-theme="light"]` opts in.
- Every accent shade resolves through one CSS variable: `--accent-h`
  (default `200`). Override at the root to reskin the whole UI.
- Components consume only **semantic** tokens (`bg`, `panel`, `text`,
  `accent`, `border-strong`, …), never primitive OKLCH literals.
- Companion palette (`ok`/`warn`/`err`/`purple`/`pink`) is theme-invariant
  by design — but each role is paired with `*-bg`/`*-fg` where contrast
  needs to flip between themes.

See `docs/architecture.md` ("Theming model — dark-first OKLCH").

## Alternatives Considered

- **Per-component theme props**: rejected — explodes surface, breaks the
  "one knob reskin" demo that sells the system.
- **CSS-in-JS runtime theming**: rejected — loses Tailwind's static
  extraction, hurts FCP, and CSS variables already give us cascade.
- **Light-first**: rejected — ShipIt-AI's primary surfaces are dark; light
  surfaces are the newer consumer pivot. Inverting now would force every
  existing consumer to opt in.

## Consequences

- Every new color decision in design must land as **both** a dark and a
  light value when it varies. Light-only or dark-only thinking is a
  recurring handoff pitfall (see `docs/design-handoff.md`).
- The "knob" only works if components consume `var(--color-accent…)`. Five
  components were caught hardcoding `oklch(...)` literals in the May audit
  ([[audit-2026-05-02-snapshot]]); the rule is "use tokens" not "use
  OKLCH directly".
- `prefers-reduced-motion` must zero both the duration _tokens_ and any
  hardcoded `animate-[…_220ms_…]` literals — earlier the literal duration
  trumped the token override, see [[reduced-motion-token-bypass]].

## Revisit Triggers

- If consumer-marketplace apps need a separate "brand" token distinct from
  `accent` (some PRs hint at a brand vs accent split — keep watching).
- If WCAG 3 / APCA contrast lands and the OKLCH ramp needs retuning.
- If the consumer pivot grows to need per-app theming beyond the single
  `--accent-h` knob.

## Related

- [[token-doc-drift-bg-brand]] — what happens when docs reference tokens
  that don't exist (`bg-brand`, `background`).
- [[theme-tokens-in-globals-not-tokens-css]] — many tokens live only in
  `globals.css`'s `@theme inline` block, not in `tokens.css`.
- [[ssr-theme-flash-prevention]] — light-mode FOUC fix via
  `@ship-it-ui/next/ThemeBootstrap`.
