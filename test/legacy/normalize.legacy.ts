// Verbatim copy of the pre-optimization normalize (main @ 7a91814), test reference only.
function normalize(value: number, size: number) {
  let normalized = value;
  while (normalized < 0) {
    normalized += size;
  }
  return normalized % size;
}

export default normalize;
