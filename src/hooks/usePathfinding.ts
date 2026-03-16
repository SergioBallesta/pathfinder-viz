import { useState, useRef, useCallback, useEffect } from "react";
import {
  Grid, Coord, CellType, ToolId, Stats, AlgorithmId,
  CELL_EMPTY, CELL_START, CELL_END, CELL_WALL, CELL_VISITED, CELL_PATH, CELL_FRONTIER,
} from "../algorithms/types";
import { ALGORITHMS } from "../algorithms";
import { createEmptyGrid, generateMaze, generateRandomWalls, cloneGrid } from "../utils/grid";
import { ROWS, COLS } from "../utils/constants";

export type MazeType = "empty" | "maze" | "random";

export function usePathfinding() {
  const gridRef = useRef<Grid | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [grid, setGrid] = useState<Grid>([]);
  const [start, setStart] = useState<Coord | null>(null);
  const [end, setEnd] = useState<Coord | null>(null);
  const [algo, setAlgo] = useState<AlgorithmId>("astar");
  const [speed, setSpeed] = useState(12);
  const [tool, setTool] = useState<ToolId>("wall");
  const [running, setRunning] = useState(false);
  const [allowDiag, setAllowDiag] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const [stats, setStats] = useState<Stats>({ explored: 0, pathLen: 0, time: 0 });

  // ── Cancel any running animation ──
  const cancelAnim = useCallback(() => {
    if (animRef.current) {
      clearTimeout(animRef.current);
      animRef.current = null;
    }
  }, []);

  // ── Clear only visualization overlay ──
  const clearVisited = useCallback(() => {
    const g = gridRef.current;
    if (!g) return;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (g[r][c] === CELL_VISITED || g[r][c] === CELL_PATH || g[r][c] === CELL_FRONTIER)
          g[r][c] = CELL_EMPTY;
    setGrid(cloneGrid(g));
    setNoPath(false);
  }, []);

  // ── Initialize grid ──
  const initGrid = useCallback((mazeType: MazeType) => {
    cancelAnim();
    let g: Grid;
    if (mazeType === "maze") g = generateMaze(ROWS, COLS);
    else if (mazeType === "random") g = generateRandomWalls(ROWS, COLS, 0.3);
    else g = createEmptyGrid(ROWS, COLS);

    const s: Coord = [1, 1];
    const e: Coord = [ROWS - 2, COLS - 2];
    g[s[0]][s[1]] = CELL_START;
    g[e[0]][e[1]] = CELL_END;
    gridRef.current = g;
    setGrid(cloneGrid(g));
    setStart(s);
    setEnd(e);
    setStats({ explored: 0, pathLen: 0, time: 0 });
    setRunning(false);
    setNoPath(false);
  }, [cancelAnim]);

  useEffect(() => {
    initGrid("empty");
  }, [initGrid]);

  // ── Apply drawing tool to a cell ──
  const applyTool = useCallback(
    (r: number, c: number) => {
      if (running) return;
      const g = gridRef.current;
      if (!g || r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

      if (tool === "start") {
        if (start) g[start[0]][start[1]] = CELL_EMPTY;
        g[r][c] = CELL_START;
        setStart([r, c]);
      } else if (tool === "end") {
        if (end) g[end[0]][end[1]] = CELL_EMPTY;
        g[r][c] = CELL_END;
        setEnd([r, c]);
      } else if (tool === "wall") {
        if (g[r][c] === CELL_START || g[r][c] === CELL_END) return;
        g[r][c] = CELL_WALL;
      } else if (tool === "eraser") {
        if (g[r][c] === CELL_START) setStart(null);
        if (g[r][c] === CELL_END) setEnd(null);
        g[r][c] = CELL_EMPTY;
      }
      setGrid(cloneGrid(g));
    },
    [tool, start, end, running]
  );

  // ── Run the selected algorithm ──
  const run = useCallback(() => {
    if (!start || !end) return;
    cancelAnim();
    clearVisited();
    setRunning(true);
    setNoPath(false);

    const g = gridRef.current!;
    const gen = ALGORITHMS[algo](g, start, end, allowDiag);
    let explored = 0;
    const t0 = performance.now();

    function step() {
      const batchSize = Math.max(1, Math.floor(speed / 2));
      for (let i = 0; i < batchSize; i++) {
        const next = gen.next();
        if (next.done) {
          setRunning(false);
          return;
        }
        const val = next.value;
        if (val.type === "visit") {
          explored++;
          if (
            !(val.r === start![0] && val.c === start![1]) &&
            !(val.r === end![0] && val.c === end![1])
          )
            g[val.r][val.c] = CELL_VISITED;
        } else if (val.type === "frontier") {
          if (
            !(val.r === start![0] && val.c === start![1]) &&
            !(val.r === end![0] && val.c === end![1]) &&
            g[val.r][val.c] !== CELL_VISITED
          )
            g[val.r][val.c] = CELL_FRONTIER;
        } else if (val.type === "path") {
          const elapsed = performance.now() - t0;
          for (const [pr, pc] of val.path) {
            if (
              !(pr === start![0] && pc === start![1]) &&
              !(pr === end![0] && pc === end![1])
            )
              g[pr][pc] = CELL_PATH;
          }
          setStats({ explored, pathLen: val.path.length, time: elapsed.toFixed(1) });
          setGrid(cloneGrid(g));
          setRunning(false);
          return;
        } else if (val.type === "nopath") {
          const elapsed = performance.now() - t0;
          setStats({ explored, pathLen: 0, time: elapsed.toFixed(1) });
          setRunning(false);
          setNoPath(true);
          return;
        }
      }
      setStats((s) => ({ ...s, explored }));
      setGrid(cloneGrid(g));
      animRef.current = setTimeout(step, Math.max(1, 60 - speed * 3));
    }
    step();
  }, [start, end, algo, speed, allowDiag, clearVisited, cancelAnim]);

  return {
    grid, start, end, algo, speed, tool, running, allowDiag, noPath, stats,
    setAlgo, setSpeed, setTool, setAllowDiag,
    initGrid, clearVisited, applyTool, run,
    gridRef,
  };
}
