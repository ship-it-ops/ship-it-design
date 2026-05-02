---
'@ship-it/ui': patch
'@ship-it/shipit': patch
'@ship-it/icons': patch
---

Set explicit `displayName` on every `forwardRef` component so Storybook's "Show Code" panel and React DevTools render the real component name (`<Button>`) instead of `<React.ForwardRef>`.
