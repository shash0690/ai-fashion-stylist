import React, { useState } from "react";

// For production, this would contain real image recognition. Here it's basic for demo.
const detectKeywordFromImage = (file) => {
  // In real app, use API to detect label! Here we just fake by extension for demo.
  const name = file?.name?.toLowerCase() || "";
  if (name.includes("shirt")) return "shirt";
  if (name.includes("jeans")) return "jeans";
  if (name.includes("dress")) return "dress";
  return "fashion";
};

export default function UploadForm({ setKeyword }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to analyze, or use the text box above.");
      return;
    }
    setError("");
    // In production, replace this with image recognition API logic
    const keyword = detectKeywordFromImage(file);
    setKeyword(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="upload-zone">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="analyze-btn" type="submit">
        Analyze Style
      </button>
      {error && (
        <span style={{ color: "#ff2d56", marginTop: "8px", display: "block" }}>
          {error}
        </span>
      )}
    </form>
  );
}
