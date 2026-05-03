## Summary

<!-- One-sentence description of what this PR does and why. -->

## Type of change

- [ ] New component / pattern / hook
- [ ] Bug fix
- [ ] Refactor
- [ ] Token / theming change
- [ ] CI / build / docs only
- [ ] Breaking change

## Linked changeset

- [ ] I added a `.changeset/*.md` file (or this PR is docs/CI-only and the `no-changeset` label applies)

## Component checklist

If this PR adds or changes a component, confirm:

- [ ] Forwards refs
- [ ] Uses `cva` for variants (no inline conditional classNames)
- [ ] Consumes semantic tokens only (no raw hex / zinc-N)
- [ ] `asChild` supported (or rationale why not)
- [ ] Story per variant + a composite (Sizes/States) story
- [ ] Test per interactive behavior (`userEvent`, not `fireEvent`)
- [ ] axe violations === 0
- [ ] Keyboard navigation works (Tab / Enter / Space / Escape / Arrows where applicable)
- [ ] Looks right in dark AND light themes
- [ ] Re-exported from `src/index.ts`

## Test plan

<!-- How did you verify this works? -->

## Notes for reviewers

<!-- Anything reviewers should pay extra attention to. Optional. -->
