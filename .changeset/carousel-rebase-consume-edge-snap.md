---
'@ship-it-ui/ui': patch
---

Fix `Carousel` `loop="circular"` desync after spam-clicking past the
end (10+ rapid Next clicks). Symptom: the carousel got stuck oscillating
between slide N and slide 1 — every subsequent Next either wrapped from
N→1 or got misread as a wrap-toward landing and snapped to N again, even
on normal-paced clicks long after the spam stopped.

Cause: the wrap-consolidation rebase shipped in 0.0.13 jumps scrollLeft
to the opposite clone via `scrollIntoView({behavior:'instant'})` so the
new smooth scroll runs forward from a real-strip-adjacent source. That
instant jump fires a synthetic scroll event whose scrollLeft sits at the
clone edge — and onScroll's edge branch treated it as the tail of a
wrap-toward animation, snapping activeIdx to the wrong twin. The
`scrollLeft > 1` tolerance check couldn't distinguish "smooth scroll
just settled here" from "we deliberately rebased here to start a forward
scroll", so any scroll event with scrollLeft ≤ 1 at the rebase domIdx
flipped activeIdx by N - 1.

Fix: track the rebase target in a new `rebaseConsumeRef`. While set,
onScroll's looping branch suppresses any work at that domIdx — both the
synthetic instant-scroll event and the smooth scroll's early frames that
still round to the rebase slot. Cleared automatically when scrollLeft
progresses into a different domIdx, and on viewport pointerdown (user
takes over). Symmetric across next-wrap (rebase to clone-start = DOM 0)
and prev-wrap (rebase to clone-end = DOM N + 1). Natural wrap-end snaps
on a single arrow click are unchanged — the guard is null in that path.
