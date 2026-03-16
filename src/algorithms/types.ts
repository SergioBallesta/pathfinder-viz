// ─── Cell types ──────────────────────────────────────────────────
export const CELL_EMPTY = 0 as const;
export const CELL_WALL = 1 as const;
export const CELL_START = 2 as const;
export const CELL_END = 3 as const;
export const CELL_VISITED = 4 as const;
export const CELL_PATH = 5 as const;
export const CELL_FRONTIER = 6 as const;

export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Grid = CellType[][];
export type Coord = [number, number];

// ─── Algorithm generator yields ─────────────────────────────────
export type AlgoStepVisit = { type: "visit"; r: number; c: number };
export type AlgoStepFrontier = { type: "frontier"; r: number; c: number };
export type AlgoStepPath = { type: "path"; path: Coord[] };
export type AlgoStepNoPath = { type: "nopath" };
export type AlgoStep =
  | AlgoStepVisit
  | AlgoStepFrontier
  | AlgoStepPath
  | AlgoStepNoPath;

export type AlgoGenerator = Generator<AlgoStep, void, undefined>;

export type AlgorithmFn = (
  grid: Grid,
  start: Coord,
  end: Coord,
  allowDiag: boolean
) => AlgoGenerator;

export type AlgorithmId = "astar" | "dijkstra" | "bfs";

// ─── Tool types ─────────────────────────────────────────────────
export type ToolId = "wall" | "start" | "end" | "eraser";

// ─── Stats ──────────────────────────────────────────────────────
export interface Stats {
  explored: number;
  pathLen: number;
  time: number | string;
}

// ─── Directions ─────────────────────────────────────────────────
export const DIRS_8: Coord[] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export const DIRS_4: Coord[] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
];
