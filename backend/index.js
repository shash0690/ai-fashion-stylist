const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
// Outfit recommendation helper
const { getOutfitSuggestions } = require("./services/outfitRecommendation.js");

const app = express();
const port = process.env.PORT || 5000;
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL_URL = process.env.HF_MODEL_URL;

// NOTE: CommonJS me __dirname directly use karo, NO need to reassign!

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper: Convert image to base64
function imageToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  return file.toString('base64');
}

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  // Convert image to base64
  const imageB64 = imageToBase64(filePath);

  // Send to Hugging Face API and handle results
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: imageB64 }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // Print the raw response (text) from HuggingFace API
    const respText = await response.text();
    console.log('Raw HF API response:', respText);

    let prediction = [];
    try {
      prediction = JSON.parse(respText);
    } catch (e) {
      console.error('JSON parse error:', e);
    }

    // Top prediction and friendly label mapping
    const top = Array.isArray(prediction) && prediction.length > 0 ? prediction[0] : {};
    const friendlyNames = {
      "necklace": "Jewelry",
      "mask": "Face Mask",
      "cellular telephone, cellular phone, cellphone, cell, mobile phone": "Mobile Phone",
      "iPod": "Music Player",
      "syringe": "Syringe"
    };
    const friendlyLabel = top && top.label ? (friendlyNames[top.label] || top.label) : "";

    res.json({
      message: "File uploaded and analyzed successfully",
      filePath: `http://localhost:${port}/uploads/${req.file.filename}`,
      topPrediction: {
        label: friendlyLabel,
        score: top && top.score ? top.score : 0
      },
      aiResult: prediction
    });
  } catch (err) {
    console.error('Prediction Error:', err);
    res.status(500).json({
      message: "Upload done but AI prediction failed",
      filePath: `http://localhost:${port}/uploads/${req.file.filename}`,
      error: err.toString()
    });
  }
});

// (Optional) Outfit Suggestion Example Route
app.post("/recommend", express.json(), (req, res) => {
  const userFeatures = req.body;
  try {
    const suggestions = getOutfitSuggestions(userFeatures);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: "Outfit suggestion failed", error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
