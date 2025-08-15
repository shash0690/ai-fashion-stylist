import React, { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import OutfitCard from "./components/OutfitCard.jsx";

export default function App() {
  const [results, setResults] = useState(null);

  return (
    <div style={{ fontFamily: "system-ui, Arial", maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>AI Fashion Stylist</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Upload a photo to get personalised outfit suggestions.</p>

      <UploadForm setResults={setResults} />

      {results && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Analysis</h2>
          <pre style={{ background: "#f6f6f6", padding: "1rem", borderRadius: 8, overflowX: "auto" }}>
{JSON.stringify(results.analysis, null, 2)}
          </pre>
          <h2>Recommended Outfits</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {results.outfits.map((o, idx) => (
              <OutfitCard key={idx} outfit={o} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}