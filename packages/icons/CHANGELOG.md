# @ship-it-ui/icons

## 0.0.12

### Patch Changes

- 19b6dbd: Bump dev dependencies via dependabot patches group (#79):
  - `react` / `react-dom` 19.2.6 → 19.2.7 (fixes a `FormData`-entries
    regression introduced in 19.2.6's Server Actions; also backported in
    `next@16.2.7` as "Don't drop FormData entries").
  - `@types/react` 19.2.15 → 19.2.16.
  - `@iconify-json/simple-icons` 1.2.84 → 1.2.85 (icons only).

  Dev-only bumps; published tarballs are functionally unchanged. Five of
  these packages (cytoscape, graph-editor, map, next, shipit) would
  patch-cascade alongside `@ship-it-ui/ui` regardless per
  `updateInternalDependencies`; the explicit entry exists so the
  changeset-required gate sees coverage for the bundled dependabot patch
  group, and so `icons` (which isn't a ui-dependent and wouldn't cascade)
  picks up the upstream alignment.

## 0.0.11

### Patch Changes

- a793daa: Bump devDependencies: `@iconify/utils` 2.3.0 → 3.1.3,
  `@iconify-json/lucide` 1.2.109 → 1.2.111, `@iconify-json/simple-icons`
  1.2.83 → 1.2.84. No public API changes — the committed icon-data
  codegen output is byte-identical (verified via the existing drift
  test).

## 0.0.10

### Patch Changes

- 1ba01f1: Brand glyph (`<IconGlyph name="brand" />`) now renders Lucide's `rocket` —
  Ship-It is a deployment story. Previously rendered Lucide's `diamond`.

  Consumers who rely on the visual identity of the `brand` name will see a
  different glyph. The shape, viewBox, and component API are unchanged.

- 1ba01f1: React 19 baseline. Peer range tightened to `react ^19.0.0` /
  `react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
  React 19.2. Drops React 18 from the supported matrix — consumers must be on
  React 19 to install.

  `@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
  latest 1.x. Each one now declares explicit React 19 peer support and ships
  the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
  Radix v2 migration in this release; only patch-level moves within 1.x.

## 0.0.9

### Patch Changes

- 66be20b: Dev-dependency bumps with no runtime-output impact:
  - `@ship-it-ui/cytoscape`: `cytoscape` dev dep `^3.30.0` → `^3.33.4`.
  - `@ship-it-ui/icons`: `@iconify-json/lucide` `^1.2.0` → `^1.2.109`,
    `@iconify-json/simple-icons` `^1.2.0` → `^1.2.83`.

  Published package output is unchanged; these only affect local development
  and CI environments.

## 0.0.8

### Patch Changes

- e2b569e: Expand the icon manifest with a travel & transport glyph set so the design
  system covers consumer-mobility apps (car rental, rideshare, hotel,
  flight-adjacent surfaces) — not just developer/observability UI.

  **New glyph categories** in `glyphManifest`:
  - **Vehicles**: `car`, `carFront`, `carTaxi`, `suv`, `truck`, `pickup`,
    `van`, `bus`, `caravan`, `motorcycle`, `scooter`, `bike`, `ev`, `plane`,
    `planeTakeoff`, `planeLanding`, `train`, `tram`, `ship`, `sailboat`,
    `ambulance`, `helicopter`.
  - **Vehicle parts & telematics**: `steeringWheel`, `carKey`, `gearShift`,
    `engine`, `fuel`, `gasPump`, `evCharger`, `battery`, `batteryCharging`,
    `batteryFull`, `batteryLow`, `seat`, `seatbelt`, `camera`, `snowflake`,
    `trafficCone`.
  - **Locations (pickup/dropoff)**: `airport`, `hotel`, `building`,
    `building2`, `trainStation`, `busStation`, `ferryTerminal`, `parking`,
    `parkingGarage`, `gasStation`, `chargingStation`, `valet`, `store`,
    `landmark`, `castle`, `tent`, `mountain`, `palmTree`, `city`.
  - **Trip essentials & artifacts**: `luggage`, `briefcase`, `backpack`,
    `passport`, `boardingPass`, `idCard`, `driversLicense`, `signature`,
    `contract`, `agreement`.
  - **Booking lifecycle**: `carPickup`, `carReturn`, `checkin`, `checkout`,
    `inspection`, `contactless`, `selfService`.
  - **Safety, insurance, emergency**: `umbrella`, `firstAid`, `sos`,
    `roadsideAssistance`, `collision`, `damage`, `verified`, `notVerified`,
    `shieldHalf`.
  - **Vehicle features (filter chips)**: `bluetooth`, `bluetoothConnected`,
    `usb`, `childSeat`, `baby`, `petFriendly`, `smokeFree`, `smoking`.
  - **Weather (trip planning)**: `sunny`, `cloudy`, `rainy`, `snowy`,
    `foggy`, `windy`, `thermometer`, `droplets`, `sunrise`, `sunset`.
  - **People (driver/passenger roles)**: `driver`, `passenger`, `coDriver`,
    `chauffeur`.
  - **Map & routing**: `pickupPin`, `dropoffPin`, `oneWay`, `roundTrip`.
  - **Commerce**: `priceTag`, `percent`, `promo`, `refund`, `piggyBank`.

  **New `connectorManifest` entries** for consumer payments and rideshare:
  `applePay`, `googlePay`, `venmo`, `cashApp`, `klarna`, `afterpay`, `amex`,
  `visa`, `mastercard`, `discover`, `uber`, `lyft`.

  All entries resolve against the existing Iconify pipeline — no source code,
  docs, or component changes required. The iconography docs page derives
  from the manifest and surfaces the new icons automatically. Total inventory
  goes from ~245 to ~471 entries.

  Iconify slugs that were initially requested but don't exist in the
  installed collections were dropped: `helicopter` is now sourced from
  `lucide` (Phosphor doesn't ship one); `airbag`, `affirm`, `applewallet`,
  and `googlewallet` are deferred until the collections add them or a
  custom SVG path is added under `src/svg/`.

## 0.0.7

### Patch Changes

- 9da43f1: `iconToSvgDataUrl` now sets `style="color:…"` on the wrapper SVG in addition to `fill`. Lucide-style icon bodies use `stroke="currentColor"` with `fill="none"`, so the wrapper's `fill` alone didn't paint them — and `currentColor` inside an `<img src="data:image/svg+xml">` falls back to the user-agent default (black) without an inherited `color` cascade. The fix means icons inside cytoscape nodes (and any other non-DOM consumer of this helper) now render in the entity-type color on every theme. Previously the glyphs disappeared against dark-mode node backgrounds.

## 0.0.6

### Patch Changes

- 0318497: Replace the Unicode-glyph rendering system with inline Iconify SVGs. The
  `<IconGlyph>` consumer API (`name`, `kind`, `size`, `label`) is unchanged
  in shape; under the hood every name now resolves to a Lucide / Phosphor /
  simple-icons SVG via `src/icon-manifest.ts`. A build-time codegen
  (`scripts/build-icon-data.ts`) materialises every manifest entry into the
  committed `src/icon-data.ts`; a drift test regenerates the same content
  in-memory and fails CI when the manifest and generated file desync.

  **New exports**:
  - `iconData` (and the `IconData` type) — the raw map of `{ body, viewBox,
width, height }`. Consumers that need to render icons outside React
    (canvas, Mermaid) read directly from it.
  - `iconToSvgDataUrl(name, { color?, size? })` — builds a complete
    `data:image/svg+xml;…` URL with explicit `width`/`height` so cytoscape's
    `<img>`-based background-image rasterisation paints correctly. Falls back
    to a centered `<text>` glyph for unregistered names.
  - Two new manifest aliases — `deployment` (`lucide:rocket`) and `ticket`
    (`lucide:ticket`) — to give entity-type built-ins clean semantic names.
  - `glyphManifest`, `connectorManifest`, and the `IconRef` type — the raw
    `[collection, iconName]` map. Useful for enumeration (icon pickers, docs
    pages) when you need the names in their authored order.

  **Removed (breaking for any external consumer)**:
  - `glyphs` and `connectorGlyphs` value exports — the unicode character
    lookup tables. The `GlyphName` and `ConnectorName` types are preserved
    but now derived from `icon-manifest.ts` (`keyof typeof glyphManifest`).
    Consumers that imported these maps must read `iconData` instead, or call
    `iconToSvgDataUrl()` for the SVG body string.
  - `resolveGlyph(name)` helper — no replacement; the typed `IconGlyph`
    component is the canonical surface.
  - `src/glyphs.ts` and `src/manifest-coverage.test.ts` — deleted.

  **Behaviour changes**:
  - `IconGlyph` renders as `<svg>` instead of `<span>`. **Typed-API break**:
    `forwardRef` element type changes from `HTMLSpanElement` to
    `SVGSVGElement`; props extend `SVGAttributes<SVGSVGElement>` instead of
    `HTMLAttributes<HTMLSpanElement>`. Consumers holding refs need to update
    the type annotation.
  - `DynamicIconGlyph` falls back to drawing the literal name string as
    centered SVG `<text>` for unregistered names (no more unicode-map
    fallback).

  **Build & deps**: adds `@iconify/utils`, `@iconify-json/lucide`,
  `@iconify-json/ph`, `@iconify-json/simple-icons` as devDependencies only —
  nothing Iconify-shaped ships in `dist/`. The codegen runs as the first step
  in `pnpm build`; a `pnpm icons:sync` alias regenerates `icon-data.ts`
  without a full `tsup` pass.

- 0318497: Tighten `<IconGlyph>` typing and add a runtime-dynamic escape hatch:
  - `IconGlyphProps['name']` is now `GlyphName | ConnectorName` (previously
    `GlyphName | ConnectorName | string`). Static call-sites get compile-time
    typo catching — names like `caretUp` / `change` / `book` / `analytics` /
    `cluster` that don't exist in the registry now fail typecheck instead of
    silently rendering the literal string.
  - New companion export `<DynamicIconGlyph>` accepts `name: string` for the
    runtime case (server payloads, plugin-registered keys). Same render
    behaviour — falls back to the literal name when the glyph isn't
    registered, which is the right behaviour when the name is genuinely
    dynamic.
  - `ConnectorCard` switches to `<DynamicIconGlyph>` internally so its public
    `connector: ConnectorName | (string & {})` surface keeps working
    unchanged.

  This is a compile-time-only breaking change for any out-of-tree consumer
  passing arbitrary strings to `<IconGlyph name=…>`; the fix is a single-line
  swap to `<DynamicIconGlyph>`. Per the v0 patch-only convention this ships as
  a patch.

## 0.0.5

### Patch Changes

- 0796a75: Add `caretUp` (▴) and `caretDown` (⌄) glyphs to complete the caret family —
  previously only `caretLeft` (‹) and `caretRight` (›) existed. Useful for sort
  indicators, dropdown toggles, and collapsible-section affordances. `caretUp`
  uses U+25B4 (BLACK UP-POINTING SMALL TRIANGLE) to stay in the same
  small-triangle family as the existing `expand: '▸'` / `collapse: '▾'` glyphs,
  leaving U+2303 (`⌃`) reserved for the macOS Control-key role when the
  interaction-keys section adds `ctrl` alongside `cmd`, `shift`, `option`, and
  `escape`.

## 0.0.4

### Patch Changes

- 01246b3: Add a `lint:fix` npm script to both packages so `pnpm --filter
@ship-it-ui/icons lint:fix` (and the equivalent for tokens) runs
  `eslint src --fix`. Mirrors the script already present in the other
  publishable packages — no runtime or published-artifact change.

## 0.0.3

### Patch Changes

- 597a705: Adds five new glyphs to the `glyphs` map: `info` (ⓘ), `moreVertical` (⋮),
  `edit` (✎), `copy` (⧉), and `refresh` (↻). Existing glyph names are
  unchanged.

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.

## 0.0.1

### Patch Changes

- 1035968: v0 launch
