import { describe, expect, it } from 'vitest';

import normalize from '../src/components/IosStylePicker/utils/normalize';
import legacyNormalize from './legacy/normalize.legacy';

/** Deterministic LCG so the run is reproducible. */
function lcg(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

describe('normalize', () => {
  // source.length is always a positive integer in IosStylePicker
  const sizes = [1, 2, 3, 10, 12, 20, 24, 34, 60, 70];

  it('returns exactly the same result as the legacy while-loop implementation', () => {
    const values: number[] = [0, -0, 1e-12, -1e-12, Number.MIN_VALUE, -Number.MIN_VALUE];
    for (let v = -400; v <= 400; v += 0.25) values.push(v);
    for (const size of sizes) {
      for (let k = -5; k <= 5; k++) {
        values.push(k * size, k * size + 1e-9, k * size - 1e-9);
      }
    }
    const random = lcg(42);
    for (let i = 0; i < 200000; i++) {
      // magnitudes from 1e-6 to 1e3, both signs, fractional
      const magnitude = Math.pow(10, random() * 9 - 6);
      values.push((random() - 0.5) * 2 * magnitude);
    }

    const mismatches: string[] = [];
    for (const size of sizes) {
      for (const value of values) {
        const a = normalize(value, size);
        const b = legacyNormalize(value, size);
        // `===` so that -0 and 0 (rendered identically) are considered equal
        if (!(a === b)) mismatches.push(`normalize(${value}, ${size}): ${a} !== ${b}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });

  it('handles large negative values without looping', () => {
    // the legacy loop would need ~1.7e10 iterations here
    expect(normalize(-1e12 - 3, 60)).toBe(17);
  });
});
