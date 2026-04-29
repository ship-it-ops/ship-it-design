# ShipIt-AI Design System

A complete design system + component library for **ShipIt-AI** — the AI-ready knowledge graph for engineering organizations. This repo is both a reference and a working UI kit: every screen in the prototype is built from the tokens and components defined here.

## What ShipIt is

ShipIt ingests data from GitHub, Kubernetes, Datadog, Backstage, PagerDuty, and other infra sources, reconciles conflicting claims through its `PropertyClaim` model, and projects a unified graph of every service, team, deployment, and dependency — queryable in plain English. The UI makes the graph feel **alive, explainable, and trustworthy**: every answer cites its sources, every property shows who said what, and the graph is the first-class primitive everywhere you look.

## Sources

- **Codebase:** `web-ui/` (Next.js 14 + Tailwind + shadcn-style components) — mounted locally, used for connector metadata + schema model grounding
- **Prototype:** `shipit.html` (main app shell + 6 pages) and `Onboarding.html` (polished onboarding) — the full clickable prototype these tokens power
- **Exploration board:** `Onboarding Variants.html` — 4 onboarding directions side-by-side

## Index

```
README.md                     ← you are here
colors_and_type.css           ← CSS variable definitions (dark + light)
SKILL.md                      ← Claude Code / Agent Skill entry point
app/                          ← live React components (theme, primitives, pages)
preview/                      ← design-system preview cards
ui_kits/shipit-app/           ← pixel-perfect recreations of app surfaces
assets/                       ← logo mark + brand imagery
fonts/                        ← (Geist is loaded from Google Fonts CDN)
```

---

## CONTENT FUNDAMENTALS

**Voice.** Confident, a little cheeky, never corporate. First-person plural for ShipIt itself (*"We poked around while you weren't watching."*). Second-person for the user (*"Your graph is alive."*). Short sentences. Active verbs.

**Casing.** Sentence case for headlines, titles, buttons. UPPERCASE (with letter-spacing) for eyebrow labels and section headers ("STEP ONE · WORKSPACE"). All-lowercase for UI chrome: `⌘K`, `skip setup →`, `02 / 08`, `fix →`. Never title case.

**Numbers.** Monospace, tabular numerals everywhere there's tick motion or comparison. `1,204 repos`, `99.95% SLA`. Leading zeros on step counters: `03 / 08`.

**Punctuation.** Em-dashes welcome. Middle dot (·) as a separator. Arrows (→ ↗ ←) as affordances and links. Periods at the end of full sentences, not fragments.

**What we don't say.**
- ❌ "Get started" → ✅ "Let's go."
- ❌ "Welcome to ShipIt!" → ✅ "Let's build your graph."
- ❌ "Something went wrong." → ✅ "We lost the thread. Retry?"
- ❌ "Your data is syncing..." → ✅ "Reading your world."

**Emoji.** None. We use unicode glyphs (◆ ✦ ◎ ⌁ → ↗) as a visual system. One exception: the brand mark itself is the diamond `◆`.

**Examples from the prototype.**
- *"Let's give your graph a home."*
- *"Plug in what you have. All of it."*
- *"Eight seconds. Your team couldn't have done this by hand in a month."*
- *"3 things your team didn't know."*
- *"That's it. Go look."*

---

## VISUAL FOUNDATIONS

**Overall feel.** Dark-first "engineering console" — think Linear, Vercel, Raycast. Very high information density handled with crisp rules, generous type hierarchy, and restrained color. Light mode exists and is first-class (not an afterthought), using the same OKLCH-based accents at higher lightness.

**Color.** Near-black canvas (`#0a0a0b`) with a two-step panel system (`#111113` → `#16161a`). The accent is a **cyan-blue at hue 200** in OKLCH space — `oklch(0.82 0.12 200)` dark, `oklch(0.72 0.13 200)` light. A full companion palette (purple 300, warn 75, ok 150, err 25, pink 0) rounds out semantic needs. Accents have `Dim` (12% alpha) and `Glow` (40% alpha) variants for soft backgrounds and shadows. No gradients on UI surfaces — the only gradient is the accent-to-purple stroke used on progress bars and the brand mark.

**Type.** **Geist** for UI (300–700), **Geist Mono** for data, codes, labels. `font-feature-settings: 'cv11', 'ss01'` enabled. Display headlines are 34–64px with negative letter-spacing (-0.5 to -2) and `text-wrap: balance`. Body 13–15px. Monospace eyebrow labels at 10–11px with `letter-spacing: 1.4–1.8` and uppercase. Tabular numerals for any ticker or metric.

**Spacing.** 4px base unit. Cards pad at 14–22px. Modal padding 34–40px. Sections separate by 22–32px. Never use hand-tuned 7px or 11px values — only multiples of 2.

**Radii.** 4 / 6 / 8 / 10 / 12 / 14 / 18 px. Small inputs 4–6, buttons 6, cards 10, modals 14–18. Never fully rounded on interactive elements except for `Pill` (999px) and round avatars.

**Borders.** Always `1px solid var(--border)`. Strong borders (`--border-strong`) for hover states and dividers on dark panels. Inset top-highlight `inset 0 1px 0 rgba(255,255,255,0.02)` on elevated dark surfaces to fake a glass edge.

**Shadows.** Restrained. Dark mode: `0 4px 24px rgba(0,0,0,0.4)` for floating surfaces, `0 40px 120px -20px rgba(0,0,0,0.5)` for modals. Accent glow only on the live progress bar and the brand mark.

**Backgrounds.** Solid panels, no noise texture. The onboarding and hero surfaces use **radial-gradient ambient fields** in the accent + purple hues, pulsing in intensity as the build progresses. One `SVG grid` pattern (56px) at 40% opacity is used behind graph views.

**Animation.** Purposeful, never decorative. All easings use `cubic-bezier(.2,.7,.2,1)` (out) for entrances, `cubic-bezier(.4,.1,.8,.3)` (in) for exits. Durations: **microtransitions 150ms** (hover/press), **step transitions 360ms**, **graph node reveals 60ms staggered**. Counters tick with `requestAnimationFrame`, not CSS. No bounces. No parallax.

**Hover.** Backgrounds shift from `panel2` → `panelHover` (slight lightening), borders strengthen from `border` → `borderStrong`. No scale transforms, no underlines.

**Press.** Accent fill on buttons darkens 10%; no shrink, no ripple.

**Blur + transparency.** Used on the onboarding modal (`backdrop-filter: blur(16px)`) and the copilot rail overlay. Never on regular cards.

**Imagery.** No stock photography. The only images are the **brand mark** (◆), **connector logos** (copied from their real brand assets), and **synthetic graph visualizations** generated at runtime from SVG.

**Iconography.** See below.

**Layout.** Fixed sidebar (240px), fixed ask command bar at top, optional right copilot rail (320px). Content scrolls in the middle. Max content width 1280 on wide screens. On the graph explorer, the canvas fills available space.

**Node vocabulary.** Graph nodes are small filled circles with soft halos. Tier-1 services use 9px radius; tier-2 use 6px. Color maps to entity type (LogicalService → accent, Repository → purple, Deployment → ok-green, etc). Edges are `0.7px` borderStrong lines at 50% opacity.

---

## ICONOGRAPHY

**Approach.** ShipIt uses a **minimal geometric glyph vocabulary** (unicode and custom SVG), not a conventional icon library. This gives the UI its quiet, engineering-console feel — glyphs are information, not ornament.

**The glyph set.**
| Glyph | Name | Use |
|---|---|---|
| ◆ | brand mark | logo, tier-1 service node |
| ◇ | outline diamond | tier-2 service node |
| ✦ | sparkle | AI, ask, copilot |
| ◎ | target | incident mode |
| ⌁ | bolt | connectors |
| ⋈ | bowtie | graph explorer |
| ◱ | corner square | home |
| ≡ | schema | data model |
| ↗ ↘ ← → | arrows | navigation, trends |
| · | middle dot | separator |
| ✓ × | check / close | status, dismiss |
| ▊ | block cursor | typing indicator |
| ⎔ | hex | kubernetes |
| ◉ | bullseye | datadog |
| ▨ | hatched | backstage |
| ◔ | quarter circle | pagerduty |
| ⌨ | keyboard | github |

**Implementation.** `IconGlyph` component maps semantic names to these characters; use glyphs inline wherever possible. For connector logos we reach for real brand SVGs (see `assets/connectors/`). No hand-rolled icon SVGs in JSX.

**Emoji.** Never.

---

**Caveats & next steps.** Geist font files are loaded from Google Fonts CDN — if you need offline use, download them and drop into `fonts/`. Connector logos (GitHub, Datadog, etc) are represented with unicode glyphs in the prototype; swapping in real SVG marks is a quick polish pass.
