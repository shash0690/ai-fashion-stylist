import React, { useState } from "react";

export default function UploadForm({ setResults, results }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If both file and prior text search absent, only then show error
    if (!file && !results) {
      setError("Please select an image, or use the text box above.");
      return;
    }
    setError("");
    // Mock image analysis, you can hook up API call here
    if (file) {
      setResults({
        analysis: { type: "image", fileName: file.name },
        outfits: []
      });
    }
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
