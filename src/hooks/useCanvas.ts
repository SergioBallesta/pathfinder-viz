import { useRef, useEffect, useCallback } from "react";
import type { Grid, CellType } from "../algorithms/types";
import { CELL_START, CELL_END, CELL_EMPTY } from "../algorithms/types";
import { COLORS, ROWS, COLS, DEFAULT_CELL_SIZE } from "../utils/constants";

interface UseCanvasOptions {
  grid: Grid;
  cellSize?: number;
  running: boolean;
  applyTool: (r: number, c: number) => void;
}

export function useCanvas({ grid, cellSize = DEFAULT_CELL_SIZE, running, applyTool }: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const painting = useRef(false);

  // ── Render grid to canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const w = COLS * cellSize;
    const h = ROWS * cellSize;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c] as CellType;
        const color = COLORS[cell] || COLORS[CELL_EMPTY as CellType];
        const x = c * cellSize;
        const y = r * cellSize;

        ctx.fillStyle = color.fill;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = color.stroke;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

        if (cell === CELL_START) {
          ctx.fillStyle = "#000";
          ctx.font = `bold ${Math.floor(cellSize * 0.55)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("S", x + cellSize / 2, y + cellSize / 2 + 1);
        } else if (cell === CELL_END) {
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${Math.floor(cellSize * 0.55)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("E", x + cellSize / 2, y + cellSize / 2 + 1);
        }
      }
    }
  }, [grid, cellSize]);

  // ── Mouse → grid coordinate ──
  const getCell = useCallback(
    (e: React.MouseEvent): [number, number] => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      return [Math.floor(y / cellSize), Math.floor(x / cellSize)];
    },
    [cellSize]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      painting.current = true;
      const [r, c] = getCell(e);
      applyTool(r, c);
    },
    [getCell, applyTool]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!painting.current) return;
      const [r, c] = getCell(e);
      applyTool(r, c);
    },
    [getCell, applyTool]
  );

  const onMouseUp = useCallback(() => {
    painting.current = false;
  }, []);

  return {
    canvasRef,
    canvasProps: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
      style: {
        cursor: running ? "wait" : "crosshair",
        width: `${COLS * cellSize}px`,
        height: `${ROWS * cellSize}px`,
        maxWidth: "95vw",
        display: "block" as const,
      },
    },
  };
}
