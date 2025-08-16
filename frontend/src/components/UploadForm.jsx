import React, { useState } from "react";

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
      const response = await fetch(
        "https://ai-fashion-stylist.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        // Agar backend error deta hai to error message show karo
        const errResp = await response.json();
        throw new Error(errResp.error || errResp.message || "Server error");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Style"}
      </button>
      {error && <span style={{ color: "crimson" }}>{error}</span>}
    </form>
  );
}
