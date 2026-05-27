---
type: scar
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
incident-date: 2026-05-02
tripwire: "if a hook initializes useState by reading document/window/localStorage, stop — that's hydration-unsafe even if guarded by typeof checks"
tags: [react, hydration, ssr, useTheme, useState, calendar]
---

# `useTheme` read `document` inside `useState` initializer → first-paint flicker + hydration warning

## What Happened

The May 2026 audit (FE persona, Theme C) found two SSR landmines:

- `useTheme` read `document.documentElement.getAttribute('data-theme')`
  inside its `useState` initializer. On the server, `typeof document ===
'undefined'` returned `'dark'`. On the client during hydration the
  initializer ran again and could return `'light'`. React doesn't re-run
  client `useState` initializers — but the _initial render path_ used
  the read, so a `data-theme="light"` root attribute (the documented
  pattern!) caused a visible flicker and an `if any rendered output
depends on it` hydration warning.
- `Calendar` called `new Date()` at render time and gated
  `aria-current="date"` / today-styled border on it. SSR at 23:59:59 →
  hydrate at 00:00:01 the next day = hydration mismatch warning + the
  "today" cell visually jumps.

Both are fixed in tree. The `@ship-it-ui/next` package now ships
`<ThemeBootstrap />` — a synchronous inline script in `<head>` that
reads the theme cookie and sets `data-theme` _before_ first paint. Pair
with `getThemeFromCookies(cookies())` to seed `<html data-theme={theme}>`
on the server.

## Tripwire

**If a hook initializes `useState` by reading `document`, `window`, or
`localStorage` — stop, even if guarded by `typeof X === 'undefined'`
checks.** The fix pattern:

```ts
// WRONG — hydration unsafe even with the guard
const [theme, setTheme] = useState(() => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') ?? 'dark';
});

// RIGHT — render-safe; sync in useEffect after hydration
const [theme, setTheme] = useState<'dark' | 'light'>('dark');
useEffect(() => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
}, []);
```

Same applies to `new Date()`, `Math.random()`, or any non-deterministic
value used in render. Lift into stable state, pass as a prop, or gate
client-only markup behind a post-hydration `useEffect` flag.

## Why It Hurt

The flicker happened on the **central theming knob the docs tell
consumers to wire up**. Adopting consumers see a flash of dark on every
light-mode page load — the worst possible first impression of a system
that pitches "dark-first OKLCH with a single knob."

## Don't Do This

- Don't read DOM/storage/clock in `useState` initializers.
- Don't gate `aria-*` or SSR-relevant markup on render-time clocks.
- Don't trust `typeof document === 'undefined'` to make a DOM read
  safe — the read still runs on the client, where it diverges from the
  server output.
- Don't omit `<ThemeBootstrap />` from Next.js App Router layouts.
  Light-mode users on cold load will see the dark→light flash.

## Related

- [[ssr-rsc-support-strategy]] — the broader decision this scar is
  enshrined in.
- [[ssr-controlled-vs-default-attrs]] — sibling SSR gotcha.
