import { CELL_EMPTY, CELL_WALL, CELL_START, CELL_END, CELL_VISITED, CELL_PATH, CELL_FRONTIER } from "../algorithms/types";
import type { CellType } from "../algorithms/types";

export const ROWS = 22;
export const COLS = 28;
export const DEFAULT_CELL_SIZE = 24;

export const COLORS: Record<CellType, { fill: string; stroke: string }> = {
  [CELL_EMPTY]:    { fill: "#1a1a2e", stroke: "#16213e" },
  [CELL_WALL]:     { fill: "#0f0f0f", stroke: "#2a2a2a" },
  [CELL_START]:    { fill: "#00e676", stroke: "#00c853" },
  [CELL_END]:      { fill: "#ff1744", stroke: "#d50000" },
  [CELL_VISITED]:  { fill: "#1a237e", stroke: "#283593" },
  [CELL_PATH]:     { fill: "#ffd600", stroke: "#ffab00" },
  [CELL_FRONTIER]: { fill: "#00bcd4", stroke: "#0097a7" },
};
