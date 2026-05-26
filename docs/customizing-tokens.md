# Customizing Ship-It tokens

The Ship-It DS ships with sensible defaults for color and typography. Consumer apps can re-skin those defaults via a typed config file at the app root, plus pass arbitrary CSS colors to a small set of components for one-off cases.

## Setup

1. **Install the tokens package** (if not already a dependency):

   ```bash
   pnpm add @ship-it-ui/tokens
   ```

2. **Create `ship-it.config.ts` at the repo root:**

   ```ts
   import { defineConfig } from '@ship-it-ui/tokens/config';

   export default defineConfig({
     accentH: 280, // rotate the master accent hue (OKLCH H component)
     color: {
       dark: { panel: '#0d0f14' },
       light: { accent: 'oklch(0.42 0.14 280)' },
     },
     typography: {
       fontFamily: { sans: '"Söhne", system-ui, sans-serif' },
     },
   });
   ```

3. **Run the CLI** (recommend wiring into `prebuild` / `predev`):

   ```bash
   npx shipit build-tokens         # one-shot
   npx shipit build-tokens --watch # re-emit on config changes during dev
   ```

   Suggested `package.json` scripts:

   ```json
   {
     "scripts": {
       "prebuild": "shipit build-tokens",
       "predev": "shipit build-tokens"
     }
   }
   ```

4. **Import the override file in your app entrypoint, AFTER the DS globals:**

   ```ts
   import '@ship-it-ui/ui/styles/globals.css'; // DS defaults
   import './.ship-it/tokens.css'; // your overrides
   ```

   CSS variables on `:root` cascade by source order, so the override import wins.

5. **Commit both `ship-it.config.ts` and `.ship-it/tokens.css`.** The generated file is small and auditable; committing it means a fresh `git clone && pnpm build` works without running the CLI first.

## What can be overridden

**Color** — every semantic role in `colorSemanticDark` and `colorSemanticLight`:
`bg`, `panel`, `panel-2`, `border`, `borderStrong`, `text`, `textMuted`, `textDim`, `accent`, `accentText`, `accentDim`, `accentGlow`, `ok`, `warn`, `err`, `purple`, `pink`, plus on-color foregrounds (`okFg`, `warnFg`, `errFg`, `okText`, `warnText`, `errText`), CTA gradient stops, marketplace semantics (`rating`, `verified`, `sale`), and `accentH`.

**Typography** — `fontFamily.sans` / `.mono`, `fontSize.*`, `fontWeight.*`, `lineHeight.*`, `tracking.*`.

The TS schema enforces the closed key set — typos are compile errors. To add a brand-new semantic role (e.g., `tier-gold`), fork the tokens package rather than working around the config.

## Output location

Default: `.ship-it/tokens.css` at the repo root.

To relocate (e.g., co-locate with your other styles or rename to fit a convention):

```ts
export default defineConfig({
  // ...
  output: './app/styles/shipit-overrides.css',
});
```

## Per-component one-off overrides

Some components accept a `color` prop for situations where you legitimately need a one-off color (a brand color on a tier badge, a per-user avatar accent) without polluting global tokens:

```tsx
<Badge color="#7c3aed">Premium</Badge>
<StatusDot color="oklch(0.7 0.2 280)" />
<Avatar name="Alex" color={user.brandColor} />
<Rating value={4.5} readOnly color="#f59e0b" />
```

**Supported components:** `Badge`, `Tag`, `Chip`, `StatusDot`, `Rating`, `Avatar`.

When both `color` and the semantic variant prop (`variant` on Badge, `state` on StatusDot) are set, `color` takes precedence at runtime — the variant is ignored. The two are not type-level exclusive: passing both typechecks. Invalid colors fall back to the default variant in both dev and prod; in dev, the component also logs a `console.warn` naming the offending value.

The prop is intentionally a distinct name (rather than overloading `variant`) so it's greppable in PR review and easy to lint against with `no-restricted-syntax` if your team wants to restrict the escape hatch.

## Foot-guns

**On-color foreground pairs are not auto-recomputed.** If you override `--color-ok` to a darker green, `--color-ok-fg` (which assumes a bright `ok`) may no longer contrast correctly. Solutions:

- Override both `ok` and `okFg` together when you change the lightness significantly.
- Or change only the hue/chroma within the same lightness band — the existing foregrounds will still pass contrast.

The same caveat applies to `--accent-h`: rotating the hue keeps the accent ramp internally consistent, but the accent-derived light/dark contrasts can drift at extreme hues.

**Overriding `fontFamily.sans` does not load the font.** The DS self-hosts Geist via `@fontsource-variable`. When you swap to a different font, you're responsible for loading it (`next/font`, `@fontsource`, CDN, custom `@font-face`). The CLI prints a best-effort warning when no matching `@font-face` is detected, but it cannot enforce.

## Reference

- Token modules: [`packages/tokens/src/`](../packages/tokens/src/)
- Config type: [`packages/tokens/src/config.ts`](../packages/tokens/src/config.ts)
- Sparse emitter: [`packages/tokens/src/emit-sparse.ts`](../packages/tokens/src/emit-sparse.ts)
- Spec: [`docs/superpowers/specs/2026-05-25-tokens-customizability-design.md`](./superpowers/specs/2026-05-25-tokens-customizability-design.md)
