import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { analyzeWithVision } from "./services/googleVision.js";
import { detectStyle } from "./services/huggingFace.js";
import { getRecommendations } from "./services/outfitRecommendation.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("AI Fashion Stylist Backend is running ✅");
});

app.post("/api/analyze", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const imageBuffer = req.files.image.data;

    const visionResult = await analyzeWithVision(imageBuffer);
    const detectedStyle = await detectStyle(imageBuffer);

    const analysis = {
      colorTone: visionResult.colorTone,
      detectedStyle
    };

    const outfits = getRecommendations(analysis);

    res.json({ analysis, outfits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));