import React, { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import './style.css';

// Sample keyword to image mapping
const keywordImages = {
  jeans: "https://img.freepik.com/free-photo/blue-jeans.jpg",
  shirt: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  dress: "https://images.unsplash.com/photo-1517260911080-4f7f0c8d5739"
  // Add more as needed
};

export default function App() {
  const [results, setResults] = useState(null);

  // Used by UploadForm to set the recognized AI label
  function handleImageDetected(keyword) {
    setResults({
      analysis: { type: "image", detected: keyword },
      keyword: keyword
    });
  }

  // Text search handler for manual outfit input (optional)
  function handleTextSearch(e) {
    if (e.key === "Enter" && e.target.value.trim()) {
      const keyword = e.target.value.trim().toLowerCase();
      setResults({
        analysis: { type: "text", query: keyword },
        keyword: keyword
      });
      e.target.value = "";
    }
  }

  // Outfit sources (Amazon/Flipkart cards)
  function getOutfitSources(keyword) {
    if (!keyword) return [];
    return [
      {
        name: "Amazon",
        link: `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`,
        img: "https://logodownload.org/wp-content/uploads/2014/04/amazon-logo-2.png"
      },
      {
        name: "Flipkart",
        link: `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}`,
        img: "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png"
      }
    ];
  }

  return (
    <div className="hero-bg">
      <div className="main-card">
        <div className="site-logo">
          <img
            src="https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@latest/color/svg/1F97C.svg"
            height={49}
            alt="Fashion Logo"
            style={{ background: "white", borderRadius: "13px", boxShadow: "0 3px 12px #efaefa65" }}
          />
        </div>

        <h1 className="main-title">AI Fashion Stylist</h1>
        <p className="main-tagline">Powered by AI • Styled for You</p>
        <p>Upload your photo <b>OR</b> type your style for outfit suggestions.</p>

        <div className="text-search-zone">
          <input
            type="text"
            className="search-input"
            placeholder='Type to search outfits (e.g. "jeans", "dress", "shirt")'
            onKeyDown={handleTextSearch}
            aria-label="Type outfit to search"
          />
        </div>

        <UploadForm setKeyword={handleImageDetected} />

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
                gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "1.6rem"
              }}
            >
              {getOutfitSources(results.keyword).map((site, i) => (
                <div className="outfit-card" key={i} style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 2px 12px #d1cfff30",
                  padding: "1rem",
                  textAlign: "center"
                }}>
                  <img
                    src={keywordImages[results.keyword] || "https://img.freepik.com/free-vector/fashion-banner-design_1300-113.jpg"}
                    alt={results.keyword}
                    style={{ width: "100%", borderRadius: 8, height: 120, objectFit: "cover", marginBottom: 10 }}
                  />
                  <div style={{ margin: "1em 0" }}>
                    <img src={site.img} alt={site.name} style={{ height: 28, verticalAlign: "middle", marginRight: 16 }} />
                    <span>Browse {results.keyword} collection on {site.name}</span>
                  </div>
                  <a
                    href={site.link}
                    className="promo-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on {site.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
