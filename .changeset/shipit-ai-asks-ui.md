---
'@ship-it-ui/ui': patch
---

**Tooltip rename** — `Tooltip` is now the Radix composition root and the
one-liner convenience helper renames to `SimpleTooltip`. The previous
`Tooltip` (with required `content` prop) and `TooltipRoot` (Radix Root
re-export) had names that were trivial to mix up — typecheck errors using
`<Tooltip>` for composition were a recurring papercut.

This matches the rest of the library: `Dialog`, `Popover`, etc. all use the
unqualified component name for the compositional root.

**Breaking renames:**

- `Tooltip` (the convenience wrapper that bundles its own `TooltipProvider`
  and takes a `content` prop) → `SimpleTooltip`.
- `TooltipRoot` (the Radix Root re-export) → `Tooltip`.
- `TooltipProps` → `SimpleTooltipProps`.

The other exports (`TooltipProvider`, `TooltipTrigger`, `TooltipContent`,
`TooltipPortal`, `TooltipArrow`) are unchanged. Per the v0 patch-only
convention this ships as a patch; migration is a single import rename per
call site.
