import React, { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import OutfitCard from "./components/OutfitCard.jsx";
import './style.css'; // Stylish CSS import

export default function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="hero-bg">
      <div className="main-card">
        <h1>AI Fashion Stylist</h1>
        <p>Upload your photo to get personalised outfit suggestions.</p>
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

      {/* Promo Banner */}
      <div className="promo-banner">
        <img src="https://via.placeholder.com/80x80?text=Brand" alt="Brand Logo" className="promo-logo" />
        <div className="promo-text">
          <span>🔥 Trending Offer:</span><br />
          <strong>Get 30% Off on Branded Shoes!</strong><br />
          <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="promo-btn">
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
