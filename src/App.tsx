import React, { useEffect } from "react";
import { usePathfinding } from "./hooks/usePathfinding";
import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { Stats } from "./components/Stats";
import { Legend } from "./components/Legend";
import type { AlgorithmId, ToolId } from "./algorithms/types";

export default function App() {
  const pf = usePathfinding();

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") pf.setTool("wall");
      if (e.key === "2") pf.setTool("start");
      if (e.key === "3") pf.setTool("end");
      if (e.key === "4") pf.setTool("eraser");
      if (e.key === " " && !pf.running) {
        e.preventDefault();
        pf.run();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pf.run, pf.running, pf.setTool]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a1a",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      color: "#e0e0e0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 8px",
      gap: "10px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2px" }}>
        <h1 style={{
          fontSize: "22px", fontWeight: 800, margin: 0,
          background: "linear-gradient(90deg, #00e676, #00bcd4, #ffd600, #ff1744)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "2px",
        }}>
          PATHFINDER
        </h1>
        <p style={{ fontSize: "10px", color: "#555", margin: "2px 0 0", letterSpacing: "3px" }}>
          ALGORITHM VISUALIZER
        </p>
      </div>

      {/* Controls */}
      <Controls
        algo={pf.algo}
        tool={pf.tool}
        speed={pf.speed}
        running={pf.running}
        allowDiag={pf.allowDiag}
        canRun={!!pf.start && !!pf.end}
        onAlgoChange={(id: AlgorithmId) => { pf.setAlgo(id); pf.clearVisited(); }}
        onToolChange={(id: ToolId) => pf.setTool(id)}
        onSpeedChange={pf.setSpeed}
        onDiagToggle={() => { pf.setAllowDiag((d: boolean) => !d); pf.clearVisited(); }}
        onRun={pf.run}
        onClear={pf.clearVisited}
        onInit={pf.initGrid}
      />

      {/* Grid canvas */}
      <Grid
        grid={pf.grid}
        running={pf.running}
        noPath={pf.noPath}
        applyTool={pf.applyTool}
      />

      {/* Stats */}
      <Stats stats={pf.stats} algo={pf.algo} />

      {/* Legend */}
      <Legend />

      {/* Shortcut hint */}
      <p style={{ fontSize: "9px", color: "#333", margin: 0, textAlign: "center" }}>
        [1] Muro · [2] Inicio · [3] Meta · [4] Borrar · [Espacio] Ejecutar
      </p>
    </div>
  );
}
