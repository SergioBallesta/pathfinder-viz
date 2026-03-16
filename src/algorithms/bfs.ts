import { Grid, Coord, AlgoGenerator, CELL_WALL, DIRS_4, DIRS_8 } from "./types";

/**
 * Breadth-First Search — simple unweighted shortest path.
 *
 * Treats all edges as cost 1. Good baseline for comparison.
 */
export function* bfs(
  grid: Grid,
  start: Coord,
  end: Coord,
  allowDiag: boolean
): AlgoGenerator {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = allowDiag ? DIRS_8 : DIRS_4;

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const prev: (Coord | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const queue: Coord[] = [start];
  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;

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
      if (grid[nr][nc] === CELL_WALL || visited[nr][nc]) continue;

      visited[nr][nc] = true;
      prev[nr][nc] = [r, c];
      queue.push([nr, nc]);
      yield { type: "frontier", r: nr, c: nc };
    }
  }

  yield { type: "nopath" };
}
