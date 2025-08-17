import React, { useState } from "react";

export default function UploadForm({ setKeyword, textInput }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file.");
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
      // Expecting detected fashion label
      if (setKeyword && data.labels && data.labels.length > 0) {
        setKeyword(data.labels[0], "image");
      } else {
        setError("Couldn't detect fashion keyword from image.");
      }
      setFile(null);
      // Optionally clear file input visually (advanced: use a ref to reset if needed)
      if (textInput && textInput.current) textInput.current.value = "";
    } catch (err) {
      setError("Failed to analyze image.");
      if (setKeyword) setKeyword(null);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
      encType="multipart/form-data"
      autoComplete="off"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginRight: 10 }}
      />
      {/* Hidden submit button so Analyze Style/App.js button can submit the form */}
      <button type="submit" style={{ display: "none" }}>Submit</button>
      {error && (
        <span style={{ color: "red", fontSize: "0.95em", marginLeft: 10 }}>{error}</span>
      )}
    </form>
  );
}
