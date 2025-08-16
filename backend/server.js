import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
const port = 5000;
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL_URL = process.env.HF_MODEL_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // 1. Convert image to base64
  const imageB64 = imageToBase64(filePath);

  // 2. Send to Hugging Face API and handle results
  try {
    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: imageB64,
      }),
    });
    const prediction = await response.json();

    // Print prediction to backend terminal
    console.log("Model Prediction Output:", prediction);

    // 3. Top prediction and friendly label mapping
    const top = Array.isArray(prediction) && prediction
