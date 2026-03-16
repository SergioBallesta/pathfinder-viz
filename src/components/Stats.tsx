import React from "react";
import { ALGO_NAMES } from "../algorithms";
import type { AlgorithmId } from "../algorithms/types";
import type { Stats as StatsType } from "../algorithms/types";

interface StatsProps {
  stats: StatsType;
  algo: AlgorithmId;
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      background: "#111127", border: "1px solid #1a1a3e", borderRadius: "8px",
      padding: "6px 16px", textAlign: "center", minWidth: "100px",
    }}>
      <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "16px", fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

export function Stats({ stats, algo }: StatsProps) {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
      <StatBox label="EXPLORADAS" value={stats.explored} color="#00bcd4" />
      <StatBox label="CAMINO" value={stats.pathLen ? `${stats.pathLen} celdas` : "—"} color="#ffd600" />
      <StatBox label="TIEMPO" value={stats.time ? `${stats.time}ms` : "—"} color="#ff1744" />
      <StatBox label="ALGORITMO" value={ALGO_NAMES[algo]} color="#00e676" />
    </div>
  );
}
