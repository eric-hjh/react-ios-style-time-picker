/**
 * Wraps `value` into `[0, size)` in O(1).
 *
 * Replaces the previous `while (value < 0) value += size; return value % size`
 * loop. `value % size` is exact, so for non-negative values the remainder is
 * returned as-is and only negative remainders are shifted once by `size`.
 * (The shorter `((value % size) + size) % size` adds and subtracts `size` for
 * non-negative values too, which loses precision for tiny fractions such as
 * 1e-12, so it would not return identical results.)
 */
function normalize(value: number, size: number) {
  const remainder = value % size;
  return remainder < 0 ? (remainder + size) % size : remainder;
}

export default normalize;
