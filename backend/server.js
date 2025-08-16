const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const { getOutfitSuggestions } = require("./services/outfitRecommendation.js");

const app = express();
const port = process.env.PORT || 5000;
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL_URL = process.env.HF_MODEL_URL;

// CORS setup (change origin as per your frontend)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic GET route for health check
app.get('/', (req, res) => {
  res.send('AI Fashion Stylist backend is live!');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Multer setup for image uploads
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

// Image upload and Hugging Face ML inference endpoint (POST)
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  // Convert image to base64
  const imageB64 = imageToBase64(filePath);

  // Hugging Face API call
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

    // Top prediction and friendly label mapping
    const top = Array.isArray(prediction) && prediction.length > 0 ?
