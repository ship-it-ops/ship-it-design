---
"@ship-it-ui/ui": patch
---

Fix `Slider` so the `showValue` chip and the `<Slider>` component itself
follow Radix's internal value as the user drags. Previously the displayed
number was computed once from `defaultValue` and never updated in the
uncontrolled case — only fully-controlled (`value` + `onValueChange`)
sliders worked. The fix tracks the live value internally when uncontrolled
and forwards every change through `onValueChange` (preserving scalar-vs-
array shape).
