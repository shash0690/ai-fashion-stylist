import React, { useState } from "react";
import axios from "axios";

export default function UploadForm({ setResults }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/analyze", formData);
      setResults(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ddd" }}>
        {loading ? "Analyzing..." : "Analyze Style"}
      </button>
      {error && <span style={{ color: "crimson" }}>{error}</span>}
    </form>
  );
}