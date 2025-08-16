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

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic GET routes for health checks
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is live!');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper function to convert image to base64
function imageToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  return file.toString('base64');
}

// POST /upload endpoint to upload image and get prediction
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  const imageB64 = imageToBase64(filePath);

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

    const respText = await response.text();
    console.log('Raw HF API response:', respText);

    let prediction = [];
    try {
      prediction = JSON.parse(respText);
    } catch (e) {
      console.error('JSON parse error:', e);
    }

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
      filePath: `https://ai-fashion-stylist.onrender.com/uploads/${req.file.filename}`,
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
      filePath: `https://ai-fashion-stylist.onrender.com/uploads/${req.file.filename}`,
      error: err.toString()
    });
  }
});

// POST /recommend to get outfit suggestions
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
