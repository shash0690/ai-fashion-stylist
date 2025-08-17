import React, { useState, useRef } from "react";
import UploadForm from "./components/UploadForm.jsx";
import './style.css';

const defaultFashionImg = "https://img.freepik.com/free-vector/fashion-banner-design_1300-113.jpg";

// Backend API URL (Render public backend, production use)
const BACKEND_API_URL = "https://ai-fashion-stylist-1.onrender.com/search";

export default function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const textInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  // Search products by keyword
  async function searchProducts(keyword) {
    setError("");
    setResults(null);

    if (!keyword) {
      setError("Type something or select an image!");
      return;
    }

    try {
      const res = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      const data = await res.json();

      if (data.products?.length) {
        setResults({ products: data.products, query: keyword });
      } else {
        setError("No results. Try another word!");
      }
    } catch (e) {
      setError("API error: " + e.message);
    }
  }

  // Handler for text input keydown (Enter) or button click
  function handleTextOrButton(e) {
    if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
      const keyword = textInput.current.value.trim();

      // Show error if both keyword and selectedImage missing
      if (!keyword && !selectedImage) {
        setError("Please type something or select an image.");
        return;
      }

      if (keyword) {
        searchProducts(keyword);
        textInput.current.value = "";
        setSelectedImage(null); // Clear image after keyword search
      } else if (selectedImage) {
        // Image selected but no text - backend call handled from UploadForm callback
        setError("");
      }
    }
  }

  // Called by UploadForm when backend sends detected keyword from image
  function handleKeyword(keyword) {
    if (keyword) {
      setSelectedImage(null);
      searchProducts(keyword);
    }
  }

  // Called by UploadForm on image select to update state
  function onImageSelect(file) {
    setSelectedImage(file);
    setError("");
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
            ref={textInput}
            type="text"
            className="search-input"
            placeholder='Type to search outfits (e.g. "jeans", "dress", "hair dryer", "shoes")'
            onKeyDown={handleTextOrButton}
            aria-label="Type outfit to search"
          />
        </div>

        <UploadForm
          setKeyword={handleKeyword}
          onImageSelect={onImageSelect}
          textInput={textInput}
        />

        <button
          className="analyze-btn"
          style={{
            marginTop: 10,
            marginBottom: 10,
            background: "#50247b",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            fontSize: "1.2rem",
            padding: "0.5em 2em",
            cursor: "pointer"
          }}
          onClick={handleTextOrButton}
        >
          Analyze Style
        </button>

        {error && (
          <div style={{ color: "red", marginTop: 10 }}>{error}</div>
        )}

        {results && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Recommended Outfits</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "1.6rem"
              }}
            >
              {results.products.map((item, i) => (
                <div
                  className="outfit-card"
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 2px 12px #d1cfff30",
                    padding: "1rem",
                    textAlign: "center"
                  }}
                >
                  <img
                    src={item.image || defaultFashionImg}
                    onError={e => { e.target.onerror = null; e.target.src = defaultFashionImg; }}
                    alt={item.name}
                    style={{ width: "100%", borderRadius: 8, height: 120, objectFit: "cover", marginBottom: 10 }}
                  />
                  <div style={{ margin: "1em 0" }}>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <a
                    href={item.link}
                    className="promo-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="promo-banner">
        <img
          src="https://placehold.co/80x80?text=Brand"
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
