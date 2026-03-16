import React from "react";

const ITEMS = [
  { color: "#00e676", label: "Inicio" },
  { color: "#ff1744", label: "Meta" },
  { color: "#0f0f0f", label: "Muro" },
  { color: "#00bcd4", label: "Frontera" },
  { color: "#1a237e", label: "Explorada" },
  { color: "#ffd600", label: "Camino" },
];

export function Legend() {
  return (
    <div style={{
      display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
      fontSize: "10px", color: "#555",
    }}>
      {ITEMS.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{
            width: 10, height: 10, borderRadius: 2, background: item.color,
            border: item.label === "Muro" ? "1px solid #333" : "none",
          }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
