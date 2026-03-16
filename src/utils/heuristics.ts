/** Manhattan distance — admissible heuristic for 4-directional grids. */
export function manhattan(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

/** Octile distance — admissible heuristic for 8-directional grids. */
export function octile(r1: number, c1: number, r2: number, c2: number): number {
  const dx = Math.abs(c1 - c2);
  const dy = Math.abs(r1 - r2);
  return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}
