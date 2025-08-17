import React, { useState } from "react";

export default function UploadForm({ setKeyword }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setAnalysis(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://ai-fashion-stylist-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setAnalysis(data);

      // Parent ko top AI fashion label bhejo
      if (setKeyword && data.labels && data.labels.length > 0) {
        setKeyword(data.labels[0]);
      }
    } catch (err) {
      setError("Image analyze failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Analyze Style</button>
      </form>

      {error && <div style={{ color: "red", margin
