import React, { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import OutfitCard from "./components/OutfitCard.jsx";
import './style.css';

export default function App() {
  const [results, setResults] = useState(null);

  // Text search handler
  function handleTextSearch(e) {
    if (e.key === "Enter" && e.target.value.trim()) {
      setResults({
        analysis: { type: "text", query: e.target.value },
        outfits: [] // You can hook this to your API later
      });
      e.target.value = "";
    }
  }

  return (
    <div className="hero-bg">
      <div className="main-card">
        {/* Unique Fashion Emoji/AI Icon */}
        <div className="site-logo">
          <img
            src="https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@latest/color/svg/1F97C.svg"
            height={49}
            alt="Fashion Logo"
            style={{
              background: "white",
              borderRadius: "13px",
              boxShadow: "0 3px 12px #efaefa65"
            }}
          />
        </div>

        <h1 className="main-title">AI Fashion Stylist</h1>
        <p className="main-tagline">Powered by AI • Styled for You</p>
        <p>Upload your photo <b>OR</b> type your style for outfit suggestions.</p>

        {/* Text Search Bar */}
        <div className="text-search-zone">
          <input
            type="text"
            className="search-input"
            placeholder='Type to search outfits (e.g. "red dress", "blazer", "black jeans")'
            onKeyDown={handleTextSearch}
            aria-label="Type outfit to search"
          />
        </div>

        {/* File Upload: pass results as prop */}
        <UploadForm setResults={setResults} results={results} />

        {/* Results Display */}
        {results && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Analysis</h2>
            <pre
              style={{
                background: "#f6f6f6",
                padding: "1rem",
                borderRadius: 8,
                overflowX: "auto"
              }}
            >
              {JSON.stringify(results.analysis, null, 2)}
            </pre>
            <h2>Recommended Outfits</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem"
              }}
            >
              {results.outfits.map((o, idx) => (
                <OutfitCard key={idx} outfit={o} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <img
          src="https://via.placeholder.com/80x80?text=Brand"
          alt="Brand Logo"
          className="promo-logo"
        />
        <div className="promo-text">
          <span>🔥 Trending Offer:</span>
          <br />
          <strong>Get 30% Off on Branded Shoes!</strong>
          <br />
          <a
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="promo-btn"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
