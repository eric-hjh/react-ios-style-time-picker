// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import IosStylePickerHtml from '../src/components/IosStylePicker/IosStylePickerHtml';
import LegacyIosStylePickerHtml from './legacy/IosStylePickerHtml.legacy';
import {
  expandSource,
  flickFrames,
  makeSource,
  mount,
  visibilities,
} from './helpers';

afterEach(() => {
  document.body.innerHTML = '';
});

/** Deterministic PRNG (mulberry32) so the equivalence run is reproducible. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cases = [
  { name: 'ampm (normal)', source: makeSource(1, 2), infinite: false },
  { name: 'hour 12h (normal)', source: makeSource(1, 12), infinite: false },
  { name: 'hour 24h (normal)', source: makeSource(0, 23), infinite: false },
  { name: 'hour (infinite)', source: makeSource(0, 23), infinite: true },
  { name: 'minute (normal)', source: makeSource(0, 59), infinite: false },
  { name: 'minute (infinite)', source: makeSource(0, 59), infinite: true },
  // sources shorter than wheelCount / 2 are concatenated by IosStylePicker
  { name: '3 items (infinite, concatenated)', source: makeSource(1, 3), infinite: true },
  { name: '1 item (infinite, concatenated)', source: makeSource(1, 1), infinite: true },
];

describe('IosStylePickerHtml visibility diffing', () => {
  it.each(cases)(
    'matches the legacy full scan for every item: $name',
    ({ source: raw, infinite }) => {
      const source = expandSource(raw, infinite);
      const legacy = mount(LegacyIosStylePickerHtml, source, infinite);
      const next = mount(IosStylePickerHtml, source, infinite);

      // initial render state (before any scroll) must match as well
      expect(visibilities(next.container)).toEqual(
        visibilities(legacy.container)
      );

      const random = rng(source.length * 7919 + (infinite ? 1 : 0));
      const len = source.length;
      const positions: number[] = [];

      // exact integers and half steps, including the ±wheelCount/4 boundaries
      for (let s = -8; s <= len + 8; s += 0.5) positions.push(s);
      // realistic flicks both directions
      positions.push(...flickFrames(0, len - 1, len, infinite));
      positions.push(...flickFrames(len - 1, -(len - 1), len, infinite));
      positions.push(...flickFrames(len / 2, len * 1.7, len, infinite));
      // random jumps and small jitter
      for (let i = 0; i < 3000; i++) {
        const r = random();
        const s =
          r < 0.3
            ? (random() - 0.2) * len * 1.5 // big jump, may be out of range
            : (positions[positions.length - 1] ?? 0) + (random() - 0.5) * 2;
        positions.push(infinite ? ((s % len) + len) % len : s);
      }
      // rare values
      positions.push(NaN, 3, Infinity, 2, -Infinity, 0, 1e-12, -1e-12, len - 1e-9);

      for (const s of positions) {
        legacy.renderer.scroll(s);
        next.renderer.scroll(s);
        expect(visibilities(next.container)).toEqual(
          visibilities(legacy.container)
        );
      }
    }
  );
});

describe('style.visibility write counts (60-frame flick)', () => {
  const scenarios = [
    { name: 'minute, infinite=false', source: makeSource(0, 59), infinite: false, from: 10, distance: 30 },
    { name: 'minute, infinite=true', source: makeSource(0, 59), infinite: true, from: 50, distance: 25 },
    { name: 'hour 24h, infinite=true', source: makeSource(0, 23), infinite: true, from: 5, distance: 30 },
    { name: 'hour 12h, infinite=false', source: makeSource(1, 12), infinite: false, from: 0, distance: 11 },
    { name: 'minute slow drag (3 items), infinite=false', source: makeSource(0, 59), infinite: false, from: 20, distance: 3 },
  ];

  it('counts writes for legacy vs diffing renderer', () => {
    const rows = scenarios.map(({ name, source: raw, infinite, from, distance }) => {
      const source = expandSource(raw, infinite);
      const frames = flickFrames(from, distance, source.length, infinite);

      const run = (Ctor: typeof IosStylePickerHtml | typeof LegacyIosStylePickerHtml) => {
        const m = mount(Ctor, source, infinite);
        m.renderer.scroll(infinite ? from % source.length : from); // initial select
        const initial = m.counter.writes;
        m.counter.writes = 0;
        frames.forEach((s) => m.renderer.scroll(s));
        return {
          items: m.container.querySelectorAll('li[data-index]').length,
          initial,
          flick: m.counter.writes,
          final: visibilities(m.container),
        };
      };

      const before = run(LegacyIosStylePickerHtml);
      const after = run(IosStylePickerHtml);
      expect(after.final).toEqual(before.final);
      expect(after.items).toBe(before.items);

      return {
        scenario: name,
        items: before.items,
        frames: frames.length,
        'initial before': before.initial,
        'initial after': after.initial,
        'flick before': before.flick,
        'flick after': after.flick,
      };
    });

    console.table(rows);
    console.log(JSON.stringify(rows));
    rows.forEach((row) => {
      expect(row['flick after']).toBeLessThan(row['flick before']);
      expect(row['initial after']).toBe(row['initial before']);
    });
  });
});
