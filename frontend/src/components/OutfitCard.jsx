import React from "react";

export default function OutfitCard({ outfit }) {
  return (
    <div style={{ border: "1px solid #eee", padding: "1rem", borderRadius: 12 }}>
      <div style={{ aspectRatio: "4/3", background: "#fafafa", borderRadius: 8, marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ opacity: 0.6 }}>
          {outfit.image ? <img src={outfit.image} alt={outfit.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover", borderRadius: 8 }} /> : "Image"}
        </span>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{outfit.name}</div>
      {outfit.buyLink && (
        <a href={outfit.buyLink} target="_blank" rel="noreferrer">
          Buy
        </a>
      )}
    </div>
  );
}