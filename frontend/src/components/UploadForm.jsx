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
      // Agar image nahi hai, toh kuch bhi na karo,
      // error bhi mat dikhao, kyunki text search allow hai.
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
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {analysis && (
        <div style={{ marginTop: 20 }}>
          <div>
            <b>Analysis Result:</b>
            <pre>{JSON.stringify(analysis, null, 2)}</pre>
          </div>
          {analysis.labels && (
            <div>
              <b>Detected Labels:</b>
              <ul>
                {analysis.labels.map((label, i) => (
                  <li key={i}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
