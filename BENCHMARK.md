# Benchmark: `style.visibility` writes during wheel scroll

`IosStylePickerHtml.scroll(scrollCount)` runs on every animation frame while a
wheel is dragged or coasting. Up to 0.0.14 it walked **every** option item on
each frame, parsed `dataset.index`, and assigned `style.visibility`.

Since 0.1.0 the renderer caches item elements and their indices once, keeps the
previously visible index range, and only writes `style.visibility` for items
that entered or left the range. The visibility rule is unchanged:
an item is visible when `|index - scrollCount| <= wheelCount / 4`.

## What is measured

- The legacy renderer is kept verbatim in
  [`test/legacy/IosStylePickerHtml.legacy.ts`](test/legacy/IosStylePickerHtml.legacy.ts)
  (copied from `main` @ `7a91814`) and runs side by side with the new one.
- Each renderer is mounted in jsdom with the same geometry `IosStylePicker`
  uses for the default CSS (150px column, `count` 20 → `wheelCount` 20).
- Every assignment to `style.visibility` on option items is counted by
  shadowing the `CSSStyleDeclaration` accessor on each item's `style` object.
- **initial** = the first `scroll()` call (what `select()` does after mount).
- **flick** = 60 successive `scroll()` calls following the same `easeOutQuart`
  curve `IosStylePicker._animateToScroll` uses, with fractional positions.
  Infinite positions are normalized exactly like `_moveTo`, so the flicks wrap.
- After the flick the final visibility of every item is asserted to be equal
  between the two implementations.

This counts DOM style writes deterministically; it is not a wall-clock or
frame-time measurement.

## Results

Item counts are the number of rendered `<li>` option items (infinite mode adds
`wheelCount / 4` = 5 clones on each side).

| Scenario (60 frames)                        | Items | Initial before | Initial after | Flick before | Flick after |
| :------------------------------------------ | ----: | -------------: | ------------: | -----------: | ----------: |
| minute, `infinite=false`, scroll 10 → 40    |    60 |             60 |            60 |        3,600 |          60 |
| minute, `infinite=true`, scroll 50 → 75 (wraps) |    70 |             70 |            70 |        4,200 |          68 |
| hour 24h, `infinite=true`, scroll 5 → 35 (wraps) |    34 |             34 |            34 |        2,040 |          78 |
| hour 12h, `infinite=false`, scroll 0 → 11   |    12 |             12 |            12 |          720 |          12 |
| minute slow drag, `infinite=false`, 20 → 23 |    60 |             60 |            60 |        3,600 |           6 |

Before, a flick always costs `items × frames` writes. After, it costs roughly
two writes per item boundary crossed (one leaving, one entering), plus one extra
batch when an infinite wheel wraps around. The first `scroll()` still writes
every item once, so the initial DOM state is identical.

## Equivalence checks

`test/visibility.test.ts` also compares the `style.visibility` of every item
after each step of more than 3,000 scroll positions per case (half steps across
the whole range including the `±wheelCount / 4` boundaries, overscroll below 0
and above the length, forward/backward flicks, random jumps and jitter, `NaN`,
`±Infinity`, `±1e-12`) for: AM/PM (2 items), 12h hours, 24h hours, infinite
hours, minutes, infinite minutes, and infinite sources shorter than
`wheelCount / 2` that `IosStylePicker` concatenates (3 and 1 items).

`test/normalize.test.ts` checks that the O(1) `normalize` returns exactly the
same value (`===`) as the previous `while` loop for all integer sizes the picker
uses and ~200k values. Note: the literal one-liner `((value % size) + size) % size`
was measured to differ from the old loop in the last bits for small non-negative
fractions (e.g. `normalize(1e-12, 60)` → `1.0018652574217413e-12` instead of
`1e-12`), so the shipped version only adds `size` when the remainder is negative.

## Reproduce

```sh
npm install
npm run bench:visibility   # prints the table above (console.table + JSON)
npm test                   # full suite, including the equivalence checks
```

To see the effect in a browser, open the Storybook `Default` story, record a
flick in the Chrome DevTools Performance panel on both versions, and compare
"Recalculate Style" time in the frames of the animation.
