import { Grid, CellType, CELL_EMPTY, CELL_WALL, CELL_START, CELL_END, CELL_VISITED, CELL_PATH, CELL_FRONTIER } from "../algorithms/types";

/** Create an empty grid. */
export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () =>
    Array<CellType>(cols).fill(CELL_EMPTY)
  );
}

/** Generate a recursive backtracker maze. */
export function generateMaze(rows: number, cols: number): Grid {
  const grid: Grid = Array.from({ length: rows }, () =>
    Array<CellType>(cols).fill(CELL_WALL)
  );

  function carve(r: number, c: number) {
    grid[r][c] = CELL_EMPTY;
    const dirs: [number, number][] = [
      [0, 2], [2, 0], [0, -2], [-2, 0],
    ].sort(() => Math.random() - 0.5) as [number, number][];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === CELL_WALL) {
        grid[r + dr / 2][c + dc / 2] = CELL_EMPTY;
        carve(nr, nc);
      }
    }
  }

  const sr = 1 + 2 * Math.floor(Math.random() * ((rows - 2) / 2));
  const sc = 1 + 2 * Math.floor(Math.random() * ((cols - 2) / 2));
  carve(sr, sc);
  return grid;
}

/** Generate random scattered walls. */
export function generateRandomWalls(rows: number, cols: number, density = 0.3): Grid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () =>
      (Math.random() < density ? CELL_WALL : CELL_EMPTY) as CellType
    )
  );
}

/** Clear only visited / path / frontier cells (keep walls and start/end). */
export function clearVisualization(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((cell) =>
      cell === CELL_VISITED || cell === CELL_PATH || cell === CELL_FRONTIER
        ? CELL_EMPTY
        : cell
    )
  );
}

/** Deep-clone a grid. */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}
