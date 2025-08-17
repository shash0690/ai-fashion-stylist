import React, { useState } from "react";

export default function UploadForm({ setKeyword, textInput }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Jab button dabega aur file hogi, image analyze ho; nahin toh kuch nahi (parent handle karega text)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://ai-fashion-stylist-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (setKeyword && data.labels && data.labels.length > 0) {
        setKeyword(data.labels[0], "image");
      }
      setFile(null);
      // Optional: Clear file input visual (if needed)
      if (textInput && textInput.current) textInput.current.value = "";
    } catch (err) {
      if (setKeyword) setKeyword(null); // trigger error on parent
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginRight: 10 }}
      />
      {/* Button UI ab App.js se manage hoga, yahan default submit se bhi ho jayega */}
    </form>
  );
}
