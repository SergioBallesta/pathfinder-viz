import { Grid, Coord, AlgoGenerator, CELL_WALL, DIRS_4, DIRS_8 } from "./types";
import { MinHeap } from "../utils/MinHeap";
import { manhattan, octile } from "../utils/heuristics";

/**
 * A* Search — optimal pathfinding with heuristic guidance.
 *
 * Uses Manhattan distance for 4-dir and Octile for 8-dir grids.
 * Yields each step for visualization.
 */
export function* astar(
  grid: Grid,
  start: Coord,
  end: Coord,
  allowDiag: boolean
): AlgoGenerator {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = allowDiag ? DIRS_8 : DIRS_4;
  const heuristic = allowDiag ? octile : manhattan;

  const dist: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  const prev: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const heap = new MinHeap();
  dist[start[0]][start[1]] = 0;
  heap.push([heuristic(start[0], start[1], end[0], end[1]), start[0], start[1]]);

  while (heap.size > 0) {
    const [, r, c] = heap.pop();

    if (r === end[0] && c === end[1]) {
      const path: Coord[] = [];
      let cur: Coord | null = end;
      while (cur) {
        path.unshift(cur);
        cur = prev[cur[0]][cur[1]];
      }
      yield { type: "path", path };
      return;
    }

    yield { type: "visit", r, c };

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === CELL_WALL) continue;

      const moveCost = dr !== 0 && dc !== 0 ? Math.SQRT2 : 1;
      const nd = dist[r][c] + moveCost;

      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        prev[nr][nc] = [r, c];
        heap.push([nd + heuristic(nr, nc, end[0], end[1]), nr, nc]);
        yield { type: "frontier", r: nr, c: nc };
      }
    }
  }

  yield { type: "nopath" };
}
