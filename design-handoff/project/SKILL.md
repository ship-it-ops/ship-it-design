---
name: shipit-ai-design
description: Use this skill to generate well-branded interfaces and assets for ShipIt-AI — the AI-ready knowledge graph for engineering orgs. Covers dark/light tokens (OKLCH-based), Geist type system, the geometric-glyph iconography, voice & tone ("confident, a little cheeky"), and React primitives for buttons, cards, pills, graph nodes, ask bars, onboarding modals, and more.
user-invocable: true
---

Read `README.md` first — it covers context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, and ICONOGRAPHY. Then:

- `colors_and_type.css` — CSS variables for both modes, semantic classes
- `app/theme.jsx` + `app/components.jsx` — React primitives (Btn, Card, Pill, Dot, PropRow, TypeBadge, StatusDot, IconGlyph, SectionLabel)
- `ui_kits/shipit-app/` — full UI kit, pixel-perfect to the prototype
- `preview/` — design-system cards (reference, not for import)

If creating visual artifacts (slides, mocks, prototypes): copy `colors_and_type.css` and the `app/*.jsx` primitives, then build against those tokens. Follow the voice rules strictly — no "Get started", no "Welcome!", no emoji. Use geometric glyphs (◆ ✦ ◎ ⌁ →) inline; prefer the `IconGlyph` component.

If working on production code: adopt the CSS variables directly. Accent is a single OKLCH hue (default 200); shifting `--accent-h` re-colors the whole UI harmonically.

If the user invokes this skill without guidance, ask what they want to build, then act as an expert ShipIt designer outputting HTML artifacts _or_ production React code depending on the need.
