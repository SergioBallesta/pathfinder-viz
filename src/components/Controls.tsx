import React from "react";
import { ALGO_NAMES } from "../algorithms";
import type { AlgorithmId } from "../algorithms/types";
import type { ToolId } from "../algorithms/types";
import type { MazeType } from "../hooks/usePathfinding";

interface ControlsProps {
  algo: AlgorithmId;
  tool: ToolId;
  speed: number;
  running: boolean;
  allowDiag: boolean;
  canRun: boolean;
  onAlgoChange: (id: AlgorithmId) => void;
  onToolChange: (id: ToolId) => void;
  onSpeedChange: (s: number) => void;
  onDiagToggle: () => void;
  onRun: () => void;
  onClear: () => void;
  onInit: (type: MazeType) => void;
}

const TOOL_BUTTONS: { id: ToolId; label: string; icon: string; key: string }[] = [
  { id: "wall", label: "Muro", icon: "■", key: "1" },
  { id: "start", label: "Inicio", icon: "S", key: "2" },
  { id: "end", label: "Meta", icon: "E", key: "3" },
  { id: "eraser", label: "Borrar", icon: "✕", key: "4" },
];

const TOOL_ACTIVE_COLORS: Record<ToolId, string> = {
  wall: "#fff",
  start: "#00e676",
  end: "#ff1744",
  eraser: "#ffd600",
};

function segmentedBtn(active: boolean, activeColor = "#00e676"): React.CSSProperties {
  return {
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: "inherit",
    fontWeight: active ? 700 : 400,
    background: active ? "#1a237e" : "transparent",
    color: active ? activeColor : "#666",
    transition: "all 0.2s",
  };
}

function smallActionBtn(color: string): React.CSSProperties {
  return {
    padding: "6px 12px",
    border: `1px solid ${color}33`,
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: "inherit",
    background: "#111127",
    color,
    transition: "all 0.2s",
  };
}

export function Controls({
  algo, tool, speed, running, allowDiag, canRun,
  onAlgoChange, onToolChange, onSpeedChange, onDiagToggle,
  onRun, onClear, onInit,
}: ControlsProps) {
  return (
    <>
      {/* Row 1: Algorithm + Tools + Diagonal */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center",
        alignItems: "center", maxWidth: "740px", width: "100%",
      }}>
        {/* Algorithm selector */}
        <div style={{
          display: "flex", background: "#111127", borderRadius: "8px",
          overflow: "hidden", border: "1px solid #1a1a3e",
        }}>
          {(Object.entries(ALGO_NAMES) as [AlgorithmId, string][]).map(([k, v]) => (
            <button
              key={k}
              onClick={() => !running && onAlgoChange(k)}
              style={segmentedBtn(algo === k, "#00e676")}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Tool selector */}
        <div style={{
          display: "flex", background: "#111127", borderRadius: "8px",
          overflow: "hidden", border: "1px solid #1a1a3e",
        }}>
          {TOOL_BUTTONS.map((t) => (
            <button
              key={t.id}
              onClick={() => onToolChange(t.id)}
              style={segmentedBtn(tool === t.id, TOOL_ACTIVE_COLORS[t.id])}
              title={`${t.label} (${t.key})`}
            >
              <span style={{ marginRight: "3px" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Diagonal toggle */}
        <button
          onClick={() => !running && onDiagToggle()}
          style={{
            padding: "6px 10px",
            border: "1px solid",
            cursor: "pointer",
            borderRadius: "8px",
            fontSize: "11px",
            fontFamily: "inherit",
            background: allowDiag ? "#1a237e" : "#111127",
            borderColor: allowDiag ? "#00bcd4" : "#1a1a3e",
            color: allowDiag ? "#00bcd4" : "#666",
          }}
        >
          Diagonal {allowDiag ? "ON" : "OFF"}
        </button>
      </div>

      {/* Row 2: Speed + Action buttons */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center",
        alignItems: "center", maxWidth: "740px", width: "100%",
      }}>
        {/* Speed slider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "#111127", borderRadius: "8px", padding: "4px 12px",
          border: "1px solid #1a1a3e",
        }}>
          <span style={{ fontSize: "10px", color: "#666" }}>SPEED</span>
          <input
            type="range" min="1" max="20" value={speed}
            onChange={(e) => onSpeedChange(+e.target.value)}
            style={{ width: "80px", accentColor: "#00bcd4" }}
          />
          <span style={{ fontSize: "10px", color: "#00bcd4", minWidth: "20px" }}>{speed}</span>
        </div>

        {/* Run */}
        <button
          onClick={onRun}
          disabled={running || !canRun}
          style={{
            padding: "7px 22px", border: "none", borderRadius: "8px",
            cursor: running || !canRun ? "not-allowed" : "pointer",
            fontSize: "12px", fontWeight: 700, fontFamily: "inherit",
            background: running ? "#333" : "linear-gradient(135deg, #00e676, #00bcd4)",
            color: running ? "#666" : "#000",
            letterSpacing: "1px", transition: "all 0.3s",
            boxShadow: running ? "none" : "0 0 20px rgba(0,230,118,0.3)",
          }}
        >
          {running ? "⟳ BUSCANDO..." : "▶ VISUALIZAR"}
        </button>

        <button onClick={onClear} disabled={running} style={smallActionBtn("#ffd600")}>
          ✦ Limpiar
        </button>
        <button onClick={() => onInit("empty")} disabled={running} style={smallActionBtn("#ff1744")}>
          ☐ Vaciar
        </button>
        <button onClick={() => onInit("maze")} disabled={running} style={smallActionBtn("#00bcd4")}>
          ⊞ Laberinto
        </button>
        <button onClick={() => onInit("random")} disabled={running} style={smallActionBtn("#ba68c8")}>
          ⊡ Random
        </button>
      </div>
    </>
  );
}
