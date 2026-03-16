import React from "react";
import { useCanvas } from "../hooks/useCanvas";
import type { Grid as GridType } from "../algorithms/types";
import { DEFAULT_CELL_SIZE } from "../utils/constants";

interface GridProps {
  grid: GridType;
  running: boolean;
  noPath: boolean;
  applyTool: (r: number, c: number) => void;
}

export function Grid({ grid, running, noPath, applyTool }: GridProps) {
  const { canvasRef, canvasProps } = useCanvas({
    grid,
    cellSize: DEFAULT_CELL_SIZE,
    running,
    applyTool,
  });

  return (
    <div style={{
      position: "relative", borderRadius: "8px", overflow: "hidden",
      border: "1px solid #1a1a3e",
      boxShadow: "0 0 40px rgba(0,188,212,0.08), inset 0 0 40px rgba(0,0,0,0.3)",
      lineHeight: 0,
    }}>
      <canvas ref={canvasRef} {...canvasProps} />
      {noPath && (
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          background: "rgba(255,23,68,0.9)", padding: "8px 20px", borderRadius: "6px",
          fontWeight: 700, fontSize: "14px", letterSpacing: "1px", pointerEvents: "none",
        }}>
          SIN CAMINO
        </div>
      )}
    </div>
  );
}
